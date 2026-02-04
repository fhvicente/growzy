import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { subscriptions, users, webhookLogs } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getPlanFromPriceId } from "@/lib/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2026-01-28.clover",
});

export async function POST(request: NextRequest) {
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!webhookSecret) {
		return NextResponse.json({ ok: false, error: "Webhook secret missing" }, { status: 500 });
	}

	const sig = request.headers.get("stripe-signature");
	const payload = await request.text();

	if (!sig) {
		return NextResponse.json({ ok: false, error: "Missing signature" }, { status: 400 });
	}

	let event: Stripe.Event;
	let webhookLogId: number | null = null;

	try {
		event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);

		const [log] = await db
			.insert(webhookLogs)
			.values({
				eventId: event.id,
				eventType: event.type,
				payload,
				status: "processing",
			})
			.returning();

		webhookLogId = log?.id ?? null;
	} catch (error: any) {
		await db.insert(webhookLogs).values({
			eventType: "unknown",
			payload,
			status: "error",
			errorMessage: error?.message ?? "Invalid signature",
		});

		return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
	}

	// Processar eventos do Stripe
	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;

				// Recuperar a subscription criada
				if (session.subscription && session.client_reference_id) {
					const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

					const priceId = subscription.items.data[0]?.price.id;
					const plan = priceId ? getPlanFromPriceId(priceId) : "free";

					// Criar registro de assinatura
					await db.insert(subscriptions).values({
						userId: session.client_reference_id,
						stripeId: subscription.id,
						stripeStatus: subscription.status,
						stripePrice: priceId,
						plan,
						quantity: subscription.items.data[0]?.quantity || 1,
					});

					// Atualizar usuário com o plano e status
					await db
						.update(users)
						.set({
							stripeId: session.customer as string,
							subscriptionPlan: plan,
							subscriptionStatus: subscription.status,
						})
						.where(eq(users.id, session.client_reference_id));
				}
				break;
			}

			case "customer.subscription.updated": {
				const subscription = event.data.object as Stripe.Subscription;
				const priceId = subscription.items.data[0]?.price.id;
				const plan = priceId ? getPlanFromPriceId(priceId) : "free";

				// Atualizar registro de assinatura
				await db
					.update(subscriptions)
					.set({
						stripeStatus: subscription.status,
						stripePrice: priceId,
						plan,
					})
					.where(eq(subscriptions.stripeId, subscription.id));

				// Atualizar plano do usuário
				const [existingSub] = await db
					.select()
					.from(subscriptions)
					.where(eq(subscriptions.stripeId, subscription.id))
					.limit(1);

				if (existingSub) {
					await db
						.update(users)
						.set({
							subscriptionPlan: plan,
							subscriptionStatus: subscription.status,
						})
						.where(eq(users.id, existingSub.userId));
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

		// Marcar log como sucesso
		if (webhookLogId) {
			await db.update(webhookLogs).set({ status: "success" }).where(eq(webhookLogs.id, webhookLogId));
		}
	} catch (error: any) {
		// Marcar log como erro
		if (webhookLogId) {
			await db
				.update(webhookLogs)
				.set({
					status: "error",
					errorMessage: error?.message || "Unknown error processing webhook",
				})
				.where(eq(webhookLogs.id, webhookLogId));
		}

		console.error("Error processing webhook:", error);
		return NextResponse.json({ ok: false, error: "Error processing webhook" }, { status: 500 });
	}

	return NextResponse.json({ ok: true });
}
