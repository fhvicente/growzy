import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { getSessionUser } from "@/lib/session";
import { PLAN_TYPES } from "@/lib/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2026-01-28.clover",
});

export async function POST(request: NextRequest) {
	const user = await getSessionUser(request);
	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	// Receber o plano selecionado do body
	const body = await request.json();
	const { plan } = body;

	// Validar plano
	if (!plan || (plan !== PLAN_TYPES.STANDARD && plan !== PLAN_TYPES.PREMIUM)) {
		return NextResponse.json({ ok: false, error: "Invalid plan selected" }, { status: 400 });
	}

	// Selecionar o Price ID apropriado
	const priceId =
		plan === PLAN_TYPES.STANDARD ? process.env.STRIPE_STANDARD_PRICE_ID : process.env.STRIPE_PREMIUM_PRICE_ID;

	if (!priceId || !process.env.STRIPE_SECRET_KEY) {
		return NextResponse.json({ ok: false, error: "Stripe not configured" }, { status: 500 });
	}

	const origin = request.headers.get("origin") ?? "http://localhost:3000";
	const locale = request.headers.get("x-locale") ?? "pt";

	try {
		const session = await stripe.checkout.sessions.create({
			mode: "subscription",
			line_items: [{ price: priceId, quantity: 1 }],
			success_url: `${origin}/${locale}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/${locale}/subscription/cancel`,
			customer_email: user.email,
			client_reference_id: String(user.id),
			metadata: {
				user_id: String(user.id),
				plan,
			},
		});

		return NextResponse.json({ ok: true, url: session.url });
	} catch (error: any) {
		console.error("Error creating checkout session:", error);
		return NextResponse.json(
			{ ok: false, error: error?.message || "Error creating checkout session" },
			{ status: 500 },
		);
	}
}
