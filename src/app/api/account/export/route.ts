import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gardens, sessions, subscriptions, users } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

// RGPD Art. 15/20: tudo o que guardamos sobre a pessoa, em JSON. Sem tokens nem hash da palavra-passe.
export async function GET(request: NextRequest) {
	const user = await getSessionUser(request);
	if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

	const [[account], hortas, subs, sess] = await Promise.all([
		db
			.select({
				name: users.name,
				email: users.email,
				emailVerified: users.emailVerified,
				subscriptionPlan: users.subscriptionPlan,
				subscriptionStatus: users.subscriptionStatus,
				stripeCustomerId: users.stripeId,
				createdAt: users.createdAt,
				updatedAt: users.updatedAt,
			})
			.from(users)
			.where(eq(users.id, user.id)),
		db
			.select({
				name: gardens.name,
				input: gardens.input,
				createdAt: gardens.createdAt,
				updatedAt: gardens.updatedAt,
			})
			.from(gardens)
			.where(eq(gardens.userId, user.id)),
		db
			.select({
				stripeId: subscriptions.stripeId,
				status: subscriptions.stripeStatus,
				plan: subscriptions.plan,
				createdAt: subscriptions.createdAt,
				endsAt: subscriptions.endsAt,
			})
			.from(subscriptions)
			.where(eq(subscriptions.userId, user.id)),
		db
			.select({
				createdAt: sessions.createdAt,
				expiresAt: sessions.expiresAt,
				ipAddress: sessions.ipAddress,
				userAgent: sessions.userAgent,
			})
			.from(sessions)
			.where(eq(sessions.userId, user.id)),
	]);

	return NextResponse.json(
		{ exportedAt: new Date(), account, gardens: hortas, subscriptions: subs, sessions: sess },
		{
			headers: {
				"Content-Disposition": 'attachment; filename="growzy-dados.json"',
				"Cache-Control": "private, no-store",
			},
		},
	);
}
