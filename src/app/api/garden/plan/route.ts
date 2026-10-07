import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { gardenView } from "@/lib/garden-view";
import { gardenInputSchema } from "@/lib/garden/schema";
import { getSessionUser } from "@/lib/session";

export async function POST(request: NextRequest) {
	const user = await getSessionUser(request);
	if (!user) {
		return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
	}

	const parsed = gardenInputSchema.safeParse(await request.json().catch(() => null));
	if (!parsed.success) {
		return NextResponse.json({ ok: false, error: "Dados inválidos", issues: parsed.error.issues }, { status: 400 });
	}

	return NextResponse.json({ ok: true, data: await gardenView(parsed.data, user.id) });
}
