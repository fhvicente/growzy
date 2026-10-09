import assert from "node:assert/strict";
import { test } from "node:test";
import { GET as webhookLogs } from "@/app/api/admin/webhook-logs/route";
import { GET as me } from "@/app/api/auth/me/route";
import { POST as authPost } from "@/app/api/auth/[...better-auth]/route";
import { getUser, req, signUp } from "./api.ts";

const authCall = (path: string, body: unknown) => authPost(req(`/api/auth${path}`, { body, headers: { origin: "http://localhost:3000" } }));

test("registo cria utilizador no plano Grátis", async () => {
	const email = `novo-${crypto.randomUUID()}@test.pt`;
	const r = await authCall("/sign-up/email", { email, password: "password-123", name: "Novo" });
	assert.equal(r.status, 200);
	const { user } = await r.json();
	const row = await getUser(user.id);
	assert.equal(row.email, email);
	assert.equal(row.subscriptionPlan, "free");
	assert.equal("password" in user, false);
});

test("registo rejeita email repetido e password curta", async () => {
	const { user } = await signUp();
	assert.equal((await authCall("/sign-up/email", { email: user.email, password: "password-123", name: "X" })).status, 422);
	assert.equal((await authCall("/sign-up/email", { email: `c-${crypto.randomUUID()}@test.pt`, password: "123", name: "X" })).status, 400);
});

test("login com password certa dá sessão, errada não", async () => {
	const { user } = await signUp();
	const ok = await authCall("/sign-in/email", { email: user.email, password: "password-123" });
	assert.equal(ok.status, 200);
	assert.ok(ok.headers.getSetCookie().some((c) => c.includes("session_token")));
	const bad = await authCall("/sign-in/email", { email: user.email, password: "errada-123" });
	assert.equal(bad.status, 401);
	assert.equal(bad.headers.getSetCookie().length, 0);
});

test("logs de webhooks só para o admin", async () => {
	assert.equal((await webhookLogs(req("/api/admin/webhook-logs"))).status, 401);
	const { cookie } = await signUp();
	assert.equal((await webhookLogs(req("/api/admin/webhook-logs", { cookie }))).status, 403);
});

test("admin vem de ADMIN_EMAILS (sem maiúsculas/espaços a contar), não de um email fixo", async (t) => {
	t.after(() => delete process.env.ADMIN_EMAILS);
	const legado = await signUp({ email: `admin-${crypto.randomUUID()}@example.com` });
	const admin = await signUp();
	const outro = await signUp();
	const get = (cookie: string) => webhookLogs(req("/api/admin/webhook-logs", { cookie }));

	delete process.env.ADMIN_EMAILS;
	assert.equal((await get(admin.cookie)).status, 403, "sem ADMIN_EMAILS ninguém é admin");

	process.env.ADMIN_EMAILS = ` x@test.pt , ${admin.user.email.toUpperCase()} ,`;
	const r = await get(admin.cookie);
	assert.equal(r.status, 200);
	assert.ok(Array.isArray((await r.json()).data));
	assert.equal((await get(outro.cookie)).status, 403);
	assert.equal((await get(legado.cookie)).status, 403);
});

test("/api/auth/me diz se é admin a partir da sessão, não do pedido", async () => {
	assert.equal((await me(req("/api/auth/me"))).status, 401);
	assert.equal((await me(req("/api/auth/me", { cookie: "better-auth.session_token=forjado" }))).status, 401);

	const normal = await signUp();
	const admin = await signUp();
	process.env.ADMIN_EMAILS = admin.user.email.toUpperCase();
	// Pedir isAdmin no URL/header não muda nada.
	const r = await me(req("/api/auth/me?isAdmin=true", { cookie: normal.cookie, headers: { "x-admin": "true" } }));
	assert.equal((await r.json()).isAdmin, false);
	assert.equal(r.headers.get("cache-control"), "private, no-store");
	assert.equal((await (await me(req("/api/auth/me", { cookie: admin.cookie }))).json()).isAdmin, true);
});
