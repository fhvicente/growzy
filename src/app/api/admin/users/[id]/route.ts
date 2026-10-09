import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import { audit, requireAdmin } from "@/lib/admin";
import { applySubscription, LIVE_STATUSES, stripeClient } from "@/lib/billing";
import { db } from "@/lib/db";
import { PLAN_FEATURES, type PlanType } from "@/lib/plans";
import { sessions, subscriptions, users } from "@/lib/schema";

const Body = z.discriminatedUnion("action", [
	z.object({ action: z.literal("set-plan"), plan: z.enum(Object.keys(PLAN_FEATURES) as [PlanType, ...PlanType[]]) }),
	z.object({ action: z.literal("resync") }),
	z.object({ action: z.literal("revoke-sessions") }),
	z.object({ action: z.literal("delete") }),
]);

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { user: admin, res } = await requireAdmin(request);
	if (res) return res;

	const parsed = Body.safeParse(await request.json().catch(() => null));
	if (!parsed.success) return fail(400, "Pedido inválido");
	const body = parsed.data;

	const { id } = await params;
	const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1);
	if (!target) return fail(404, "Utilizador não encontrado");
	if (target.id === admin.id && (body.action === "delete" || body.action === "revoke-sessions")) {
		return fail(400, "Não podes fazer isto à tua própria conta");
	}

	switch (body.action) {
		case "set-plan": {
			await db.update(users).set({ subscriptionPlan: body.plan }).where(eq(users.id, id));
			await audit(admin.id, "set-plan", id, { from: target.subscriptionPlan, to: body.plan });
			return NextResponse.json({ ok: true });
		}

		case "resync": {
			if (!target.stripeId) return fail(400, "Utilizador sem cliente Stripe");
			let latest: Stripe.Subscription | undefined;
			try {
				const { data } = await stripeClient().subscriptions.list({
					customer: target.stripeId,
					status: "all",
					limit: 1,
				});
				latest = data[0];
			} catch (error) {
				console.error("admin resync failed", error);
				return fail(502, "Stripe indisponível");
			}
			let plan = "free";
			if (latest) plan = await applySubscription(id, latest);
			else
				await db
					.update(users)
					.set({ subscriptionPlan: "free", subscriptionStatus: "inactive" })
					.where(eq(users.id, id));
			await audit(admin.id, "resync", id, { plan });
			return NextResponse.json({ ok: true, plan });
		}

		case "revoke-sessions": {
			const gone = await db.delete(sessions).where(eq(sessions.userId, id)).returning({ id: sessions.id });
			await audit(admin.id, "revoke-sessions", id, { count: gone.length });
			return NextResponse.json({ ok: true });
		}

		case "delete": {
			// Cancelar no Stripe primeiro: se falhar, não se apaga nada e o cliente não fica a pagar sem conta.
			let canceledSubs = 0;
			if (target.stripeId) {
				try {
					const stripe = stripeClient();
					const { data } = await stripe.subscriptions.list({
						customer: target.stripeId,
						status: "all",
						limit: 100,
					});
					for (const s of data.filter((s) => LIVE_STATUSES.has(s.status))) {
						await stripe.subscriptions.cancel(s.id);
						canceledSubs++;
					}
				} catch (error) {
					console.error("admin delete: stripe cancel failed", error);
					return fail(502, "Não foi possível cancelar no Stripe; nada foi apagado");
				}
			}
			await db.transaction(async (tx) => {
				await tx.delete(subscriptions).where(eq(subscriptions.userId, id));
				await tx.delete(users).where(eq(users.id, id)); // sessions, accounts e gardens em cascata
			});
			await audit(admin.id, "delete", id, { canceledSubs });
			return NextResponse.json({ ok: true });
		}
	}
}
