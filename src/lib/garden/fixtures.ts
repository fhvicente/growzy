import type { GardenInput } from "./types.ts";

export const input = (over: Partial<GardenInput> = {}): GardenInput => ({
	zone: "litoral-norte",
	space: { kind: "vasos", widthCm: 200, lengthCm: 100 },
	light: "sol",
	irrigation: "regador",
	crops: [{ slug: "tomate" }, { slug: "manjericao" }],
	owned: [],
	...over,
});
