import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { audit, requireAdmin } from "@/lib/admin";
import { handleStripeEvent, stripeClient } from "@/lib/billing";
import { db } from "@/lib/db";
import { webhookLogs } from "@/lib/schema";

// Reprocessa o payload guardado. Só eventos com assinatura válida têm payload (os outros ficam com "").
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { user: admin, res } = await requireAdmin(request);
	if (res) return res;

	const id = Number((await params).id);
	const [log] = Number.isInteger(id)
		? await db.select().from(webhookLogs).where(eq(webhookLogs.id, id)).limit(1)
		: [];
	if (!log) return NextResponse.json({ ok: false, error: "Evento não encontrado" }, { status: 404 });
	if (!log.payload) return NextResponse.json({ ok: false, error: "Evento sem payload válido" }, { status: 400 });

	let status = "success";
	let errorMessage: string | null = null;
	try {
		await handleStripeEvent(stripeClient(), JSON.parse(log.payload) as Stripe.Event);
	} catch (error) {
		status = "error";
		errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
	}
	await db.update(webhookLogs).set({ status, errorMessage, updatedAt: new Date() }).where(eq(webhookLogs.id, id));
	await audit(admin.id, "reprocess-webhook", null, { logId: id, eventType: log.eventType, status });
	return NextResponse.json(
		{ ok: status === "success", status, error: errorMessage },
		{ status: status === "success" ? 200 : 500 },
	);
}
