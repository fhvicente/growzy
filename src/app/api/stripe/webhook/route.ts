import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { subscriptions, webhookLogs } from "@/lib/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        return NextResponse.json(
            { ok: false, error: "Webhook secret missing" },
            { status: 500 },
        );
    }

    const sig = request.headers.get("stripe-signature");
    const payload = await request.text();

    if (!sig) {
        return NextResponse.json(
            { ok: false, error: "Missing signature" },
            { status: 400 },
        );
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

        return NextResponse.json(
            { ok: false, error: "Invalid signature" },
            { status: 400 },
        );
    }

    if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as Stripe.Subscription;
        await db
            .update(subscriptions)
            .set({ stripeStatus: subscription.status })
            .where(eq(subscriptions.stripeId, subscription.id));
    }

    if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;
        await db
            .update(subscriptions)
            .set({ stripeStatus: "canceled", endsAt: new Date() })
            .where(eq(subscriptions.stripeId, subscription.id));
    }

    if (webhookLogId) {
        await db
            .update(webhookLogs)
            .set({ status: "success" })
            .where(eq(webhookLogs.id, webhookLogId));
    }

    return NextResponse.json({ ok: true });
}
