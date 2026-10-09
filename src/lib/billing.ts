import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { getPlanFromPriceId } from "@/lib/plans";
import { subscriptions, users } from "@/lib/schema";

// Criado por pedido: ao nível do módulo rebenta no `next build`, que corre sem segredos.
export const stripeClient = () => new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2026-02-25.clover" });

// Estados em que o cliente ainda tem direito ao plano pago (past_due = período de tolerância).
export const LIVE_STATUSES = new Set(["active", "trialing", "past_due"]);

/** Copia o estado de uma subscrição do Stripe para `subscriptions` e para o plano do utilizador. */
export async function applySubscription(userId: string, subscription: Stripe.Subscription) {
	const priceId = subscription.items.data[0]?.price.id;
	const plan = priceId && LIVE_STATUSES.has(subscription.status) ? getPlanFromPriceId(priceId) : "free";
	await db
		.insert(subscriptions)
		.values({
			userId,
			stripeId: subscription.id,
			stripeStatus: subscription.status,
			stripePrice: priceId,
			plan,
			quantity: subscription.items.data[0]?.quantity || 1,
		})
		.onConflictDoUpdate({
			target: subscriptions.stripeId,
			set: { stripeStatus: subscription.status, stripePrice: priceId, plan, updatedAt: new Date() },
		});
	await db
		.update(users)
		.set({ subscriptionPlan: plan, subscriptionStatus: subscription.status })
		.where(eq(users.id, userId));
	return plan;
}
