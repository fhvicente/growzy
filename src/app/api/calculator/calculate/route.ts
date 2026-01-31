import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { plants as plantsTable, products as productsTable } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

type PlantInput = {
    id: number | string;
    quantity?: number | string;
};

export async function POST(request: NextRequest) {
    const user = await getSessionUser(request);
    if (!user) {
        return NextResponse.json(
            { ok: false, error: "Unauthorized" },
            { status: 401 },
        );
    }

    const body = await request.json();
    const plantsInput: PlantInput[] = Array.isArray(body?.plants)
        ? (body.plants as PlantInput[])
        : [];

    if (!plantsInput.length) {
        return NextResponse.json(
            { ok: false, error: "Invalid plants" },
            { status: 400 },
        );
    }

    const plantIds = plantsInput.map((p) => Number(p.id)).filter(Boolean);
    const rows = await db
        .select()
        .from(plantsTable)
        .where(inArray(plantsTable.id, plantIds));

    const plantDetails = plantsInput.map((item) => {
        const plant = rows.find((row) => row.id === Number(item.id));
        const quantity = Number(item.quantity) || 1;
        const unitPrice = plant ? Number(plant.price) : 0;
        const total = unitPrice * quantity;
        return {
            id: plant?.id,
            name: plant?.name ?? "",
            quantity,
            unit_price: unitPrice,
            total,
        };
    });

    const totalPlantsCost = plantDetails.reduce((sum, p) => sum + p.total, 0);
    const products = await db.select().from(productsTable);

    const selectedProducts = products.map((_, index) => String(index));
    const productsTotal = products.reduce((sum, p) => sum + Number(p.price), 0);
    const totalCost = totalPlantsCost + productsTotal;

    return NextResponse.json({
        ok: true,
        plants: plantDetails,
        products,
        selectedProducts,
        totalPlantsCost,
        totalCost,
    });
}
