import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { handleStripeEvent, stripeClient } from "@/lib/billing";
import { db } from "@/lib/db";
import { webhookLogs } from "@/lib/schema";

export async function POST(request: NextRequest) {
	const stripe = stripeClient();
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
		// Corpo não autenticado: não se guarda, senão qualquer pessoa enche a base de dados.
		await db.insert(webhookLogs).values({
			eventType: "unknown",
			payload: "",
			status: "error",
			errorMessage: error?.message ?? "Invalid signature",
		});

		return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
	}

	// Processar eventos do Stripe
	try {
		await handleStripeEvent(stripe, event);

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
