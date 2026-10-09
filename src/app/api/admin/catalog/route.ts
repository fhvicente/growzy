import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { audit, requireAdmin } from "@/lib/admin";
import { applyCatalogPrices, defaultPrice } from "@/lib/catalog-prices";
import { db } from "@/lib/db";
import { catalogPrices } from "@/lib/schema";

const euro = z.number().finite().min(0).max(10_000);
const Body = z.object({
	slug: z.string().min(1).max(50),
	prices: z
		.array(z.object({ field: z.enum(["planta", "semente", "mercado", "material"]), min: euro, max: euro }))
		.min(1)
		.max(4),
});

// Guarda preços de uma cultura ou material. Um valor igual ao do código apaga a linha (= repor).
export async function POST(request: NextRequest) {
	const { user: admin, res } = await requireAdmin(request);
	if (res) return res;

	const parsed = Body.safeParse(await request.json().catch(() => null));
	if (!parsed.success) return NextResponse.json({ ok: false, error: "Pedido inválido" }, { status: 400 });
	const { slug, prices } = parsed.data;

	for (const p of prices) {
		if (!defaultPrice(slug, p.field)) {
			return NextResponse.json({ ok: false, error: `Sem preço "${p.field}" para ${slug}` }, { status: 400 });
		}
		if (p.field === "mercado") p.max = p.min;
		if (p.max < p.min) return NextResponse.json({ ok: false, error: "Máximo menor que mínimo" }, { status: 400 });
	}

	const current = await db.select().from(catalogPrices).where(eq(catalogPrices.slug, slug));
	const changes = [];
	for (const { field, min, max } of prices) {
		const def = defaultPrice(slug, field) as number[];
		const row = current.find((r) => r.field === field);
		const from = row ? [row.min, row.max] : def;
		if (from[0] === min && from[1] === max) continue;
		const where = and(eq(catalogPrices.slug, slug), eq(catalogPrices.field, field));
		if (def[0] === min && def[1] === max) await db.delete(catalogPrices).where(where);
		else
			await db
				.insert(catalogPrices)
				.values({ slug, field, min, max })
				.onConflictDoUpdate({
					target: [catalogPrices.slug, catalogPrices.field],
					set: { min, max, updatedAt: new Date() },
				});
		changes.push({ field, from, to: [min, max] });
	}

	if (changes.length) {
		await audit(admin.id, "set-price", null, { slug, changes });
		await applyCatalogPrices(true);
	}
	return NextResponse.json({ ok: true, changed: changes.length });
}
