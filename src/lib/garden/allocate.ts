import { cropBySlug, SUPPLIES } from "./catalog.ts";
import type { AllocatedCrop, Allocation, Crop, GardenInput, Light, SpaceKind } from "./types.ts";

const LIGHT_RANK: Record<Light, number> = { sombra: 0, "meia-sombra": 1, sol: 2 };
const POTS = SUPPLIES.filter((s) => s.slug.startsWith("vaso-")); // já ordenados por volume
const FLOREIRA_L = 18;

export const lightOk = (crop: Crop, light: Light) => LIGHT_RANK[light] >= LIGHT_RANK[crop.light];

type Fit = Pick<AllocatedCrop, "footprintCm2" | "container" | "perContainer" | "potLPerPlant">;

export function fit(crop: Crop, kind: SpaceKind): Fit {
	if (kind !== "vasos") {
		return { footprintCm2: crop.spacingCm ** 2, container: null, perContainer: 1, potLPerPlant: 0 };
	}
	if (crop.spacingCm <= 25) {
		const per = Math.max(1, Math.min(Math.floor(80 / crop.spacingCm), Math.floor(FLOREIRA_L / crop.minPotL)));
		return { footprintCm2: (80 * 20) / per, container: "floreira-80", perContainer: per, potLPerPlant: FLOREIRA_L / per };
	}
	const pot = POTS.find((v) => (v.volumeL ?? 0) >= crop.minPotL) ?? POTS[POTS.length - 1];
	return { footprintCm2: (pot.diameterCm ?? 0) ** 2, container: pot.slug, perContainer: 1, potLPerPlant: pot.volumeL ?? 0 };
}

export function allocate(input: GardenInput): Allocation {
	const { kind, widthCm, lengthCm } = input.space;
	const usableCm2 = widthCm * lengthCm * (kind === "vasos" ? 0.8 : 1);
	const excluded: Allocation["excluded"] = [];
	const rows: (AllocatedCrop & { crop: Crop; auto: boolean })[] = [];

	for (const item of input.crops) {
		const crop = cropBySlug.get(item.slug);
		if (!crop) {
			excluded.push({ slug: item.slug, reason: "já não existe no catálogo" });
			continue;
		}
		if (!lightOk(crop, input.light)) {
			excluded.push({
				slug: crop.slug,
				reason: crop.light === "sol" ? "precisa de sol pleno (6 h ou mais)" : "precisa de pelo menos meia-sombra (3 h de sol)",
			});
			continue;
		}
		const from = (item.from ?? "planta") === "planta" && crop.price.planta ? "planta" : "semente";
		rows.push({ slug: crop.slug, from, quantity: item.quantity ?? 0, ...fit(crop, kind), crop, auto: !item.quantity });
	}

	// Área que sobra das quantidades manuais, repartida em partes iguais pelas automáticas.
	// Uma cultura que bate no teto devolve a área que não usa às outras.
	let pool = usableCm2 - rows.filter((r) => !r.auto).reduce((s, r) => s + r.quantity * r.footprintCm2, 0);
	let open = rows.filter((r) => r.auto);
	while (open.length) {
		const share = Math.max(0, pool) / open.length;
		const capped = open.filter((r) => Math.floor(share / r.footprintCm2) >= r.crop.maxUseful);
		if (!capped.length) {
			for (const r of open) r.quantity = Math.floor(share / r.footprintCm2);
			break;
		}
		for (const r of capped) {
			r.quantity = r.crop.maxUseful;
			pool -= r.quantity * r.footprintCm2;
		}
		open = open.filter((r) => !capped.includes(r));
	}
	for (const r of rows) r.quantity = Math.max(1, r.quantity);

	const used = rows.reduce((s, r) => s + r.quantity * r.footprintCm2, 0);
	const usedPct = Math.round((used / usableCm2) * 100);
	const warnings = usedPct > 100 ? [`ocupa ${usedPct}% do espaço disponível`] : [];

	return {
		crops: rows.map(({ crop: _c, auto: _a, ...r }) => r),
		excluded,
		usableCm2,
		usedPct,
		warnings,
	};
}
