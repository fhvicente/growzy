import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { getSessionUser } from "@/lib/session";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
    const user = await getSessionUser(request);
    if (!user) {
        return NextResponse.json(
            { ok: false, error: "Unauthorized" },
            { status: 401 },
        );
    }

    const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
    if (!priceId || !process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
            { ok: false, error: "Stripe not configured" },
            { status: 500 },
        );
    }

    const origin = request.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/subscription/cancel`,
        customer_email: user.email,
        client_reference_id: String(user.id),
        metadata: {
            user_id: String(user.id),
        },
    });

    return NextResponse.json({ ok: true, url: session.url });
}
