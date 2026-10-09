import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { getSessionUser } from "@/lib/session";
import { defaultLocale, locales } from "@/app/[locale]/i18n";

export async function POST(request: NextRequest) {
	const user = await getSessionUser(request);
	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	// Receber o plano selecionado do body
	const body = await request.json().catch(() => null);
	if (!body) {
		return NextResponse.json({ ok: false, error: "Dados inválidos" }, { status: 400 });
	}
	const { plan } = body;

	// Premium só se vende quando existir (Fase 3 do PRD)
	if (plan !== "standard") {
		return NextResponse.json({ ok: false, error: "Plano indisponível" }, { status: 400 });
	}

	const priceId = process.env.STRIPE_STANDARD_PRICE_ID;

	if (!priceId || !process.env.STRIPE_SECRET_KEY) {
		return NextResponse.json({ ok: false, error: "Stripe not configured" }, { status: 500 });
	}
	// Criado por pedido: ao nível do módulo rebenta no `next build`, que corre sem segredos.
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });

	const origin = request.headers.get("origin") ?? "http://localhost:3000";
	const requested = request.headers.get("x-locale");
	const locale = locales.find((l) => l === requested) ?? defaultLocale;

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
		return NextResponse.json({ ok: false, error: "Error creating checkout session" }, { status: 500 });
	}
}
