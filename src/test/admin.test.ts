import assert from "node:assert/strict";
import { test } from "node:test";
import { desc, eq } from "drizzle-orm";
import Stripe from "stripe";
import { POST as setPrices } from "@/app/api/admin/catalog/route";
import { POST as action } from "@/app/api/admin/users/[id]/route";
import { POST as reprocess } from "@/app/api/admin/webhook-logs/[id]/route";
import { applyCatalogPrices } from "@/lib/catalog-prices";
import { cropBySlug } from "@/lib/garden/catalog";
import { auditLogs, catalogPrices, gardens, sessions, subscriptions, users, webhookLogs } from "@/lib/schema";
import { getSessionUser } from "@/lib/session";
import { ctx, db, getUser, req, signUp } from "./api.ts";

const stripe = new Stripe("sk_test_dummy");
const proto = (r: object) => Object.getPrototypeOf(r);
process.env.STRIPE_STANDARD_PRICE_ID = "price_standard";

const admin = await signUp({ email: `admin-${crypto.randomUUID()}@test.pt` });
process.env.ADMIN_EMAILS = `outro@test.pt, ${admin.user.email.toUpperCase()}`;

const call = (id: string, body: unknown, cookie = admin.cookie) =>
	action(req(`/api/admin/users/${id}`, { body, cookie }), ctx(id));
const auditOf = (id: string) => db.select().from(auditLogs).where(eq(auditLogs.targetId, id));
const withStripe = (id: string, customer: string) =>
	db.update(users).set({ stripeId: customer }).where(eq(users.id, id));

test("ações de admin: 401 sem sessão, 403 para utilizador normal, 404 e 400", async () => {
	const { user, cookie } = await signUp();
	assert.equal(
		(await action(req(`/api/admin/users/${user.id}`, { body: { action: "resync" } }), ctx(user.id))).status,
		401,
	);
	assert.equal((await call(user.id, { action: "set-plan", plan: "standard" }, cookie)).status, 403);
	assert.equal((await call("nao-existe", { action: "resync" })).status, 404);
	assert.equal((await call(user.id, { action: "set-plan", plan: "ouro" })).status, 400);
	assert.equal((await call(user.id, { action: "inventada" })).status, 400);
	assert.equal((await call(user.id, "{nope")).status, 400);
});

test("set-plan muda o plano e audita sem dados do cliente", async () => {
	const { user } = await signUp();
	assert.equal((await call(user.id, { action: "set-plan", plan: "standard" })).status, 200);
	assert.equal((await getUser(user.id)).subscriptionPlan, "standard");
	const [log] = await auditOf(user.id);
	assert.equal(log.actorId, admin.user.id);
	assert.deepEqual(log.details, { from: "free", to: "standard" });
	assert.ok(!JSON.stringify(log).includes(user.email));
});

test("revoke-sessions mata as sessões; admin não o faz a si próprio", async () => {
	const { user, cookie } = await signUp();
	assert.equal((await call(user.id, { action: "revoke-sessions" })).status, 200);
	assert.equal((await db.select().from(sessions).where(eq(sessions.userId, user.id))).length, 0);
	assert.equal(await getSessionUser(req("/", { cookie })), null);
	assert.equal((await call(admin.user.id, { action: "revoke-sessions" })).status, 400);
	assert.equal((await call(admin.user.id, { action: "delete" })).status, 400);
});

test("delete sem Stripe apaga conta e hortas e deixa auditoria", async () => {
	const { user } = await signUp();
	await db.insert(gardens).values({ userId: user.id, name: "Varanda", input: {} as never });
	assert.equal((await call(user.id, { action: "delete" })).status, 200);
	assert.equal(await getUser(user.id), undefined);
	assert.equal((await db.select().from(gardens).where(eq(gardens.userId, user.id))).length, 0);
	assert.deepEqual((await auditOf(user.id))[0].details, { canceledSubs: 0 });
});

test("delete cancela as subscrições vivas no Stripe antes de apagar", async (t) => {
	const { user } = await signUp();
	await withStripe(user.id, "cus_del");
	t.mock.method(proto(stripe.subscriptions), "list", async () => ({
		data: [
			{ id: "sub_a", status: "active" },
			{ id: "sub_b", status: "canceled" },
		],
	}));
	const cancel = t.mock.method(proto(stripe.subscriptions), "cancel", async (_id: string) => ({}));
	assert.equal((await call(user.id, { action: "delete" })).status, 200);
	assert.deepEqual(
		cancel.mock.calls.map((c: { arguments: unknown[] }) => c.arguments[0]),
		["sub_a"],
	);
	assert.equal(await getUser(user.id), undefined);
});

test("delete não apaga nada se o Stripe falhar", async (t) => {
	const { user } = await signUp();
	await withStripe(user.id, "cus_err");
	t.mock.method(proto(stripe.subscriptions), "list", async () => {
		throw new Error("stripe em baixo");
	});
	assert.equal((await call(user.id, { action: "delete" })).status, 502);
	assert.ok(await getUser(user.id));
	assert.equal((await auditOf(user.id)).length, 0);
});

test("resync: 400 sem cliente Stripe, copia a subscrição real, free se cancelada", async (t) => {
	const { user } = await signUp();
	assert.equal((await call(user.id, { action: "resync" })).status, 400);
	await withStripe(user.id, "cus_sync");
	const subId = `sub_${crypto.randomUUID()}`;
	let status = "active";
	t.mock.method(proto(stripe.subscriptions), "list", async () => ({
		data: [{ id: subId, status, items: { data: [{ price: { id: "price_standard" }, quantity: 1 }] } }],
	}));
	assert.equal((await call(user.id, { action: "resync" })).status, 200);
	assert.equal((await getUser(user.id)).subscriptionPlan, "standard");
	status = "canceled";
	assert.equal((await call(user.id, { action: "resync" })).status, 200);
	const u = await getUser(user.id);
	assert.equal(u.subscriptionPlan, "free");
	assert.equal(u.subscriptionStatus, "canceled");
});

test("reprocessar um webhook falhado volta a aplicá-lo e audita", async () => {
	const { user } = await signUp();
	const subId = `sub_${crypto.randomUUID()}`;
	await db
		.insert(subscriptions)
		.values({ userId: user.id, stripeId: subId, stripeStatus: "active", plan: "standard" });
	const payload = JSON.stringify({
		id: `evt_${crypto.randomUUID()}`,
		type: "invoice.payment_failed",
		data: { object: { id: "in_r", object: "invoice", subscription: subId } },
	});
	const [log] = await db
		.insert(webhookLogs)
		.values({ eventType: "invoice.payment_failed", payload, status: "error", errorMessage: "db em baixo" })
		.returning();
	const { cookie } = await signUp();
	assert.equal(
		(await reprocess(req(`/api/admin/webhook-logs/${log.id}`, { method: "POST", cookie }), ctx(log.id))).status,
		403,
	);
	const r = await reprocess(
		req(`/api/admin/webhook-logs/${log.id}`, { method: "POST", cookie: admin.cookie }),
		ctx(log.id),
	);
	assert.equal(r.status, 200);
	assert.equal((await getUser(user.id)).subscriptionStatus, "past_due");
	const [after] = await db.select().from(webhookLogs).where(eq(webhookLogs.id, log.id));
	assert.equal(after.status, "success");
	assert.equal(after.errorMessage, null);
	const [a] = await db
		.select()
		.from(auditLogs)
		.where(eq(auditLogs.action, "reprocess-webhook"))
		.orderBy(desc(auditLogs.id))
		.limit(1);
	assert.deepEqual(a.details, { logId: log.id, eventType: "invoice.payment_failed", status: "success" });
});

test("reprocessar: 404 se não existe, 400 sem payload", async () => {
	const [log] = await db
		.insert(webhookLogs)
		.values({ eventType: "unknown", payload: "", status: "error" })
		.returning();
	const call = (id: string | number) =>
		reprocess(req(`/api/admin/webhook-logs/${id}`, { method: "POST", cookie: admin.cookie }), ctx(id));
	assert.equal((await call("abc")).status, 404);
	assert.equal((await call(999999999)).status, 404);
	assert.equal((await call(log.id)).status, 400);
});

test("preços do catálogo: editar aplica ao motor, repor apaga a linha", async () => {
	const save = (body: unknown, cookie = admin.cookie) => setPrices(req("/api/admin/catalog", { body, cookie }));
	const tomate = cropBySlug.get("tomate")!;
	const original = { ...tomate.price.planta! };

	assert.equal(
		(await save({ slug: "tomate", prices: [{ field: "planta", min: 2, max: 3 }] }, (await signUp()).cookie)).status,
		403,
	);
	assert.equal((await save({ slug: "tomate", prices: [{ field: "planta", min: 2, max: 3 }] })).status, 200);
	assert.equal(tomate.price.planta!.min, 2);
	await applyCatalogPrices(true); // outra instância a ler da BD chega ao mesmo
	assert.equal(tomate.price.planta!.max, 3);
	const [a] = await db
		.select()
		.from(auditLogs)
		.where(eq(auditLogs.action, "set-price"))
		.orderBy(desc(auditLogs.id))
		.limit(1);
	assert.deepEqual(a.details, {
		slug: "tomate",
		changes: [{ field: "planta", from: [original.min, original.max], to: [2, 3] }],
	});

	// mercado: um só valor
	assert.equal((await save({ slug: "tomate", prices: [{ field: "mercado", min: 9, max: 1 }] })).status, 200);
	assert.equal(tomate.marketEurKg, 9);

	// repor = guardar o valor do código
	assert.equal(
		(
			await save({
				slug: "tomate",
				prices: [
					{ field: "planta", min: original.min, max: original.max },
					{ field: "mercado", min: 2.2, max: 2.2 },
				],
			})
		).status,
		200,
	);
	assert.equal((await db.select().from(catalogPrices).where(eq(catalogPrices.slug, "tomate"))).length, 0);
	assert.deepEqual(tomate.price.planta, original);
	assert.equal(tomate.marketEurKg, 2.2);
});

test("preços do catálogo: 400 para slug, campo ou intervalo inválidos", async () => {
	const save = (body: unknown) => setPrices(req("/api/admin/catalog", { body, cookie: admin.cookie }));
	assert.equal((await save({ slug: "inventada", prices: [{ field: "semente", min: 1, max: 2 }] })).status, 400);
	assert.equal((await save({ slug: "feijao-verde", prices: [{ field: "planta", min: 1, max: 2 }] })).status, 400);
	assert.equal((await save({ slug: "tomate", prices: [{ field: "material", min: 1, max: 2 }] })).status, 400);
	assert.equal((await save({ slug: "tomate", prices: [{ field: "semente", min: 3, max: 2 }] })).status, 400);
	assert.equal((await save({ slug: "tomate", prices: [{ field: "semente", min: -1, max: 2 }] })).status, 400);
	assert.equal((await save({ slug: "vaso-3l", prices: [] })).status, 400);
});
