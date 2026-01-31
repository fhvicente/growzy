import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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

    return NextResponse.json({
        ok: true,
        plants,
        products,
        selectedProducts,
        totalPlantsCost,
        totalCost,
    });
}
