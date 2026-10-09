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

/** Aplica um evento do Stripe à BD. Pode correr mais de uma vez para o mesmo evento (o Stripe repete; o admin reprocessa). */
export async function handleStripeEvent(stripe: Stripe, event: Stripe.Event) {
	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object as Stripe.Checkout.Session;
			if (session.subscription && session.client_reference_id) {
				const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
				await applySubscription(session.client_reference_id, subscription);
				await db
					.update(users)
					.set({ stripeId: session.customer as string })
					.where(eq(users.id, session.client_reference_id));
			}
			break;
		}

		case "customer.subscription.updated": {
			const subscription = event.data.object as Stripe.Subscription;
			const [existingSub] = await db
				.select()
				.from(subscriptions)
				.where(eq(subscriptions.stripeId, subscription.id))
				.limit(1);

			if (existingSub) {
				await applySubscription(existingSub.userId, subscription);
			}
			break;
		}

		case "customer.subscription.deleted": {
			const subscription = event.data.object as Stripe.Subscription;

			// Atualizar registro de assinatura
			await db
				.update(subscriptions)
				.set({
					stripeStatus: "canceled",
					endsAt: new Date(),
				})
				.where(eq(subscriptions.stripeId, subscription.id));

			// Voltar usuário para plano gratuito
			const [existingSub] = await db
				.select()
				.from(subscriptions)
				.where(eq(subscriptions.stripeId, subscription.id))
				.limit(1);

			if (existingSub) {
				await db
					.update(users)
					.set({
						subscriptionPlan: "free",
						subscriptionStatus: "inactive",
					})
					.where(eq(users.id, existingSub.userId));
			}
			break;
		}

		case "invoice.payment_failed": {
			const invoice = event.data.object as Stripe.Invoice & {
				subscription?: string | Stripe.Subscription | null;
			};
			const subscriptionId =
				typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;

			// Notificar usuário sobre falha no pagamento
			if (subscriptionId) {
				const [existingSub] = await db
					.select()
					.from(subscriptions)
					.where(eq(subscriptions.stripeId, subscriptionId))
					.limit(1);

				if (existingSub) {
					await db
						.update(users)
						.set({
							subscriptionStatus: "past_due",
						})
						.where(eq(users.id, existingSub.userId));
				}
			}
			break;
		}
	}
}
