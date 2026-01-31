import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { calculations } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/session";

export async function GET(request: NextRequest) {
    const user = await getSessionUser(request);
    if (!user) {
        return NextResponse.json(
            { ok: false, error: "Unauthorized" },
            { status: 401 },
        );
    }

    const rows = await db
        .select()
        .from(calculations)
        .where(eq(calculations.userId, String(user.id)));

    const totals = rows.reduce(
        (acc, row) => {
            acc.calculations += 1;
            acc.savings += Number(row.estimatedSavings || 0);
            return acc;
        },
        { calculations: 0, favorites: 0, savings: 0 },
    );

    return NextResponse.json({ ok: true, totals });
}
