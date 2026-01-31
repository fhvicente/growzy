import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { calculations } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";

export async function POST(request: NextRequest) {
    const user = await getSessionUser(request);
    if (!user) {
        return NextResponse.json(
            { ok: false, error: "Unauthorized" },
            { status: 401 },
        );
    }

    const body = await request.json();
    const plants = Array.isArray(body?.plants) ? body.plants : [];
    const products = Array.isArray(body?.products) ? body.products : [];
    const selectedProducts = Array.isArray(body?.selectedProducts)
        ? body.selectedProducts.map(String)
        : [];

    if (!plants.length || !products.length) {
        return NextResponse.json(
            { ok: false, error: "Invalid data" },
            { status: 400 },
        );
    }

    const totalPlantsCost = plants.reduce(
        (sum: number, plant: any) => sum + Number(plant.total || 0),
        0,
    );
    const productsTotal = selectedProducts.reduce(
        (sum: number, index: string) => {
            const product = products[Number(index)];
            return sum + Number(product?.price || 0);
        },
        0,
    );

    const totalCost = totalPlantsCost + productsTotal;

    const [inserted] = await db
        .insert(calculations)
        .values({
            userId: String(user.id),
            plantsData: plants,
            productsData: products,
            totalCost: String(totalCost),
            plantsCount: plants.length,
            estimatedSavings: "0",
            isPublic: false,
        })
        .returning();

    return NextResponse.json({ ok: true, calculation: inserted });
}
