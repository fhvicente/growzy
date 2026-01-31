import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function getSessionUser(request: NextRequest) {
    const api = (
        auth as unknown as {
            api?: { getSession?: (args: { headers: Headers }) => Promise<any> };
        }
    ).api;

    if (!api?.getSession) {
        return null;
    }

    const session = await api.getSession({ headers: request.headers });
    return session?.user ?? null;
}
