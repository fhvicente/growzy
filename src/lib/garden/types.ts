export type Zone = "litoral-norte" | "interior" | "sul";
export type Light = "sol" | "meia-sombra" | "sombra";
export type SpaceKind = "vasos" | "canteiro-elevado" | "terra";
export type From = "planta" | "semente";

export type GardenInput = {
	zone: Zone;
	space: { kind: SpaceKind; widthCm: number; lengthCm: number };
	light: Light;
	irrigation: "regador" | "gota-a-gota";
	crops: { slug: string; quantity?: number; from?: From }[];
	owned: string[];
};

export type PriceRange = { min: number; max: number; store: string; checkedAt: string };

export type Crop = {
	slug: string;
	name: string;
	light: Light; // luz mínima
	season: "quente" | "fresca";
	spacingCm: number;
	minPotL: number; // litros de substrato por planta
	kc: number; // FAO-56, fase intermédia
	sowMonths: number[]; // 1–12, zona litoral-norte
	transplantMonths: number[]; // [] = sementeira direta
	daysToHarvest: [number, number]; // desde a plantação
	maxUseful: number;
	yieldKg: [number, number]; // por planta, por época
	marketEurKg: number;
	price: { planta: PriceRange | null; semente: PriceRange };
	seedsPerPacket: number;
	perennial?: true; // fica na horta o ano inteiro
};

export type SupplyGroup = "plantas" | "recipientes" | "ferramentas" | "rega";

export type Supply = {
	slug: string;
	name: string;
	group: SupplyGroup;
	durable: boolean;
	price: PriceRange;
	volumeL?: number;
	diameterCm?: number;
};

export type MonthClimate = { tMin: number; tMax: number; precipMm: number };
export type ZoneClimate = { station: string; latitude: number; months: MonthClimate[] };

export type Range = { min: number; max: number; mid: number };

export type AllocatedCrop = {
	slug: string;
	from: From;
	quantity: number;
	footprintCm2: number;
	container: string | null; // slug de SUPPLIES ou null (canteiro/terra)
	perContainer: number; // plantas por recipiente (1 em vaso, n em floreira)
	potLPerPlant: number; // litros de substrato por planta
};

export type Allocation = {
	crops: AllocatedCrop[];
	excluded: { slug: string; reason: string }[];
	usableCm2: number;
	usedPct: number;
	warnings: string[];
};

export type ShoppingLine = {
	slug: string;
	name: string;
	group: SupplyGroup;
	quantity: number;
	unit: string;
	durable: boolean;
	owned: boolean;
	min: number;
	max: number;
	store: string;
	checkedAt: string;
};

export type Shopping = { lines: ShoppingLine[]; total: Range; durableTotal: Range };

export type CropWatering = {
	slug: string;
	litersPerDay: number;
	everyDays: number | null; // null = a chuva chega
	litersPerWatering: number;
	dripMinutes: number | null;
};

export type MonthWatering = {
	month: number;
	et0: number;
	crops: CropWatering[];
	litersPerWeek: number;
	hint: string;
	timer: { everyDays: number; minutes: number } | null;
};

export type CropCalendar = {
	slug: string;
	sow: number[];
	transplant: number[];
	harvest: number[];
	next: { action: "semear" | "transplantar"; month: number } | null;
};

export type Calendar = {
	crops: CropCalendar[];
	months: { month: number; sow: string[]; transplant: string[]; harvest: string[] }[];
};

export type Savings = {
	harvestValue: Range;
	firstSeason: Range;
	nextSeason: Range;
	paybackWeeks: number | null;
	verdict: "paga-se na 1.ª época" | "paga-se na 2.ª época" | "não compensa financeiramente";
	byCrop: { slug: string; min: number; max: number }[];
};

export type GardenResult = {
	allocation: Allocation;
	shopping: Shopping;
	watering: MonthWatering[];
	calendar: Calendar;
	savings: Savings;
};
