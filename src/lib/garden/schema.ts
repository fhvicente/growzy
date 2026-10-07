import { z } from "zod";
import { cropBySlug, supplyBySlug } from "./catalog.ts";

const cm = z.number().int().min(30).max(2000);

export const gardenInputSchema = z.object({
	zone: z.enum(["litoral-norte", "interior", "sul"]),
	space: z.object({ kind: z.enum(["vasos", "canteiro-elevado", "terra"]), widthCm: cm, lengthCm: cm }),
	light: z.enum(["sol", "meia-sombra", "sombra"]),
	irrigation: z.enum(["regador", "gota-a-gota"]),
	crops: z
		.array(
			z.object({
				slug: z.string().refine((s) => cropBySlug.has(s), "cultura desconhecida"),
				quantity: z.number().int().min(1).max(200).optional(),
				from: z.enum(["planta", "semente"]).optional(),
			}),
		)
		.min(1)
		.max(15)
		.refine((cs) => new Set(cs.map((c) => c.slug)).size === cs.length, "culturas repetidas"),
	owned: z.array(z.string().refine((s) => supplyBySlug.has(s), "material desconhecido")).max(20).default([]),
});

export const gardenBodySchema = z.object({ name: z.string().trim().min(1).max(80), input: gardenInputSchema });
