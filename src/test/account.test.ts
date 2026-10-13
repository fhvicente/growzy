import assert from "node:assert/strict";
import { test } from "node:test";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { GET as exportData } from "@/app/api/account/export/route";
import { GET as cleanup } from "@/app/api/cron/cleanup/route";
import { auth } from "@/lib/auth";
import { gardens, sessions, subscriptions, users, verifications, webhookLogs } from "@/lib/schema";
import { db, getUser, req, signUp } from "./api.ts";

const stripe = new Stripe("sk_test_dummy");
const proto = (r: object) => Object.getPrototypeOf(r);
const deleteUser = (cookie: string, password: string) =>
	auth.api.deleteUser({ body: { password }, headers: new Headers({ cookie }) });

test("exportar: 401 sem sessão; devolve conta e hortas, sem segredos", async () => {
	assert.equal((await exportData(req("/api/account/export"))).status, 401);
	const { user, cookie } = await signUp();
	await db.insert(gardens).values({ userId: user.id, name: "Varanda", input: {} as never });
	const r = await exportData(req("/api/account/export", { cookie }));
	assert.equal(r.status, 200);
	assert.match(r.headers.get("content-disposition") ?? "", /attachment/);
	const text = await r.text();
	const data = JSON.parse(text);
	assert.equal(data.account.email, user.email);
	assert.equal(data.gardens[0].name, "Varanda");
	assert.equal(data.sessions.length, 1);
	assert.doesNotMatch(text, /password|token/i);
});

test("apagar conta: palavra-passe errada não apaga; certa apaga conta, hortas e subscrições", async () => {
	const { user, cookie } = await signUp();
	await db.insert(gardens).values({ userId: user.id, name: "Varanda", input: {} as never });
	await db
		.insert(subscriptions)
		.values({ userId: user.id, stripeId: `sub_${crypto.randomUUID()}`, stripeStatus: "canceled" });

	await assert.rejects(deleteUser(cookie, "errada-123"));
	assert.ok(await getUser(user.id));

	await deleteUser(cookie, "password-123");
	assert.equal(await getUser(user.id), undefined);
	assert.equal((await db.select().from(gardens).where(eq(gardens.userId, user.id))).length, 0);
	assert.equal((await db.select().from(subscriptions).where(eq(subscriptions.userId, user.id))).length, 0);
});

test("apagar conta cancela no Stripe primeiro; se o Stripe falhar não apaga nada", async (t) => {
	const { user, cookie } = await signUp();
	await db.update(users).set({ stripeId: "cus_self" }).where(eq(users.id, user.id));
	const list = t.mock.method(proto(stripe.subscriptions), "list", async () => {
		throw new Error("stripe em baixo");
	});
	await assert.rejects(deleteUser(cookie, "password-123"));
	assert.ok(await getUser(user.id));

	list.mock.mockImplementation(async () => ({ data: [{ id: "sub_live", status: "active" }] }));
	const cancel = t.mock.method(proto(stripe.subscriptions), "cancel", async () => ({}));
	await deleteUser(cookie, "password-123");
	assert.equal(cancel.mock.calls[0].arguments[0], "sub_live");
	assert.equal(await getUser(user.id), undefined);
});

test("cron de limpeza: 401 sem segredo; apaga só o que expirou", async () => {
	process.env.CRON_SECRET = "cron-test";
	assert.equal((await cleanup(req("/api/cron/cleanup"))).status, 401);
	assert.equal(
		(await cleanup(req("/api/cron/cleanup", { headers: { authorization: "Bearer errado" } }))).status,
		401,
	);

	const { user } = await signUp();
	const past = new Date(Date.now() - 1000);
	const old = new Date(Date.now() - 91 * 24 * 60 * 60 * 1000);
	await db
		.insert(sessions)
		.values({ id: crypto.randomUUID(), token: crypto.randomUUID(), userId: user.id, expiresAt: past });
	const [v] = await db
		.insert(verifications)
		.values({ id: crypto.randomUUID(), identifier: "x", value: "y", expiresAt: past })
		.returning();
	const [w] = await db.insert(webhookLogs).values({ eventType: "old", createdAt: old }).returning();

	const r = await cleanup(req("/api/cron/cleanup", { headers: { authorization: "Bearer cron-test" } }));
	assert.equal(r.status, 200);
	const live = await db.select().from(sessions).where(eq(sessions.userId, user.id));
	assert.equal(live.length, 1, "a sessão válida do signUp fica");
	assert.equal((await db.select().from(verifications).where(eq(verifications.id, v.id))).length, 0);
	assert.equal((await db.select().from(webhookLogs).where(eq(webhookLogs.id, w.id))).length, 0);
});
