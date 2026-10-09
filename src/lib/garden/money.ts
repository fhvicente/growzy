import type { Range } from "./types.ts";

export const round2 = (n: number) => Math.round(n * 100) / 100;
export const range = (min: number, max: number): Range => ({ min: round2(min), max: round2(max), mid: round2((min + max) / 2) });
