// Ajudas para testes das rotas contra uma base de dados real (growzy_test).
import { eq } from "drizzle-orm";
import { after } from "node:test";
import { NextRequest } from "next/server";

if (!process.env.DATABASE_URL?.includes("_test")) throw new Error("DATABASE_URL tem de apontar para uma base de dados *_test");

const { auth } = await import("@/lib/auth");
const { db } = await import("@/lib/db");
const { users } = await import("@/lib/schema");
export { db };
after(() => db.$client.end());

/** Cria um utilizador real via better-auth e devolve o cookie de sessão. */
export async function signUp(over: { email?: string } = {}) {
	const email = over.email ?? `u-${crypto.randomUUID()}@test.pt`;
	const { headers, response } = await auth.api.signUpEmail({
		body: { email, password: "password-123", name: "Teste" },
		returnHeaders: true,
	});
	const cookie = headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
	return { user: response.user, cookie };
}

export const setPlan = (userId: string, plan: string) => db.update(users).set({ subscriptionPlan: plan }).where(eq(users.id, userId));

export const getUser = async (id: string) => (await db.select().from(users).where(eq(users.id, id)))[0];

export function req(path: string, opts: { method?: string; body?: unknown; cookie?: string; headers?: Record<string, string> } = {}) {
	const headers = new Headers(opts.headers);
	if (opts.cookie) headers.set("cookie", opts.cookie);
	if (opts.body !== undefined && typeof opts.body !== "string") headers.set("content-type", "application/json");
	const body = opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
	return new NextRequest(`http://localhost:3000${path}`, { method: opts.method ?? (body ? "POST" : "GET"), body, headers });
}

export const ctx = (id: string | number) => ({ params: Promise.resolve({ id: String(id) }) });
