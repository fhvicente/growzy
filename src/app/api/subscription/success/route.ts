import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { subscriptions, users } from "@/lib/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-06-20",
});

export async function GET(request: NextRequest) {
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
            { ok: false, error: "Stripe not configured" },
            { status: 500 },
        );
    }
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json(
            { ok: false, error: "Missing session_id" },
            { status: 400 },
        );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
        return NextResponse.json(
            { ok: false, error: "Payment not completed" },
            { status: 400 },
        );
    }

    const userId = session.client_reference_id;
    if (!userId) {
        return NextResponse.json(
            { ok: false, error: "Missing user reference" },
            { status: 400 },
        );
    }

    if (session.customer) {
        await db
            .update(users)
            .set({ stripeId: String(session.customer) })
            .where(eq(users.id, String(userId)));
    }

    if (session.subscription) {
        await db.insert(subscriptions).values({
            userId: String(userId),
            stripeId: String(session.subscription),
            stripeStatus: "active",
            stripePrice: session.amount_total
                ? String(session.amount_total / 100)
                : null,
            quantity: 1,
        });
    }

    return NextResponse.json({ ok: true });
}
