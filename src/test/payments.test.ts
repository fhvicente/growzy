import assert from "node:assert/strict";
import { test } from "node:test";
import { desc, eq } from "drizzle-orm";
import Stripe from "stripe";
import { POST as webhook } from "@/app/api/stripe/webhook/route";
import { POST as checkout } from "@/app/api/subscription/checkout/route";
import { subscriptions, webhookLogs } from "@/lib/schema";
import { db, getUser, req, signUp } from "./api.ts";

// Os métodos dos recursos do Stripe vivem no protótipo, partilhado com as instâncias das rotas.
const stripe = new Stripe("sk_test_dummy");
const proto = (r: object) => Object.getPrototypeOf(r);
const SECRET = "whsec_test";
process.env.STRIPE_WEBHOOK_SECRET = SECRET;
process.env.STRIPE_STANDARD_PRICE_ID = "price_standard";

const send = (event: object, sig?: string) => {
	const payload = JSON.stringify(event);
	return webhook(
		req("/api/stripe/webhook", {
			body: payload,
			headers: {
				"stripe-signature": sig ?? stripe.webhooks.generateTestHeaderString({ payload, secret: SECRET }),
			},
		}),
	);
};
const event = (type: string, object: object) => ({
	id: `evt_${crypto.randomUUID()}`,
	object: "event",
	type,
	data: { object },
});
const sub = (id: string, price = "price_standard", status = "active") => ({
	id,
	object: "subscription",
	status,
	items: { data: [{ price: { id: price }, quantity: 1 }] },
});
const logOf = async (eventId: string) =>
	(await db.select().from(webhookLogs).where(eq(webhookLogs.eventId, eventId)))[0];

test("checkout: 401 sem sessão, 400 para planos fora de venda", async () => {
	assert.equal((await checkout(req("/api/subscription/checkout", { body: { plan: "standard" } }))).status, 401);
	const { cookie } = await signUp();
	for (const plan of ["premium", "free", "inventado", undefined]) {
		assert.equal(
			(await checkout(req("/api/subscription/checkout", { body: { plan }, cookie }))).status,
			400,
			String(plan),
		);
	}
});

test("checkout Standard cria sessão Stripe ligada ao utilizador", async (t) => {
	const create = t.mock.method(proto(stripe.checkout.sessions), "create", async () => ({
		url: "https://checkout.stripe.test/x",
	}));
	const { user, cookie } = await signUp();
	const r = await checkout(
		req("/api/subscription/checkout", {
			body: { plan: "standard" },
			cookie,
			headers: { origin: "https://growzy.pt" },
		}),
	);
	assert.equal(r.status, 200);
	assert.equal((await r.json()).url, "https://checkout.stripe.test/x");
	const args = create.mock.calls[0].arguments[0] as Stripe.Checkout.SessionCreateParams;
	assert.equal(args.client_reference_id, user.id);
	assert.equal(args.customer_email, user.email);
	assert.deepEqual(args.line_items, [{ price: "price_standard", quantity: 1 }]);
	assert.ok(args.success_url?.startsWith("https://growzy.pt/"));
});

test("checkout devolve 500 se o Stripe falhar", async (t) => {
	t.mock.method(proto(stripe.checkout.sessions), "create", async () => {
		throw new Error("stripe em baixo");
	});
	const { cookie } = await signUp();
	const r = await checkout(req("/api/subscription/checkout", { body: { plan: "standard" }, cookie }));
	assert.equal(r.status, 500);
	assert.ok(
		!JSON.stringify(await r.json()).includes("stripe em baixo"),
		"erro interno do Stripe não chega ao cliente",
	);
});

test("checkout: JSON inválido dá 400 e locale desconhecido cai para pt", async (t) => {
	const create = t.mock.method(proto(stripe.checkout.sessions), "create", async () => ({
		url: "https://checkout.stripe.test/x",
	}));
	const { cookie } = await signUp();
	assert.equal((await checkout(req("/api/subscription/checkout", { body: "{nope", cookie }))).status, 400);
	await checkout(
		req("/api/subscription/checkout", {
			body: { plan: "standard" },
			cookie,
			headers: { origin: "https://growzy.pt", "x-locale": "x/../evil" },
		}),
	);
	const args = create.mock.calls[0].arguments[0] as Stripe.Checkout.SessionCreateParams;
	assert.ok(args.success_url?.startsWith("https://growzy.pt/pt/subscription/success"));
});

test("webhook: sem assinatura 400, assinatura falsa 400 e nada é processado", async () => {
	const e = event("customer.subscription.deleted", sub("sub_x"));
	assert.equal((await webhook(req("/api/stripe/webhook", { body: JSON.stringify(e) }))).status, 400);
	const r = await send(e, "t=1,v1=falsa");
	assert.equal(r.status, 400);
	assert.equal(await logOf(e.id), undefined, "evento com assinatura falsa não deve ser registado como válido");
	const [last] = await db.select().from(webhookLogs).orderBy(desc(webhookLogs.id)).limit(1);
	assert.equal(last.payload, "", "o corpo de um pedido sem assinatura válida não é guardado");
});

test("webhook: checkout.session.completed repetido pelo Stripe responde 200", async (t) => {
	const { user } = await signUp();
	const subId = `sub_${crypto.randomUUID()}`;
	t.mock.method(proto(stripe.subscriptions), "retrieve", async () => sub(subId));
	const obj = {
		id: "cs_2",
		object: "checkout.session",
		subscription: subId,
		client_reference_id: user.id,
		customer: "cus_2",
	};
	assert.equal((await send(event("checkout.session.completed", obj))).status, 200);
	assert.equal((await send(event("checkout.session.completed", obj))).status, 200);
	assert.equal((await db.select().from(subscriptions).where(eq(subscriptions.stripeId, subId))).length, 1);
});

test("webhook: ciclo de vida da subscrição muda o plano do utilizador", async (t) => {
	const { user } = await signUp();
	const subId = `sub_${crypto.randomUUID()}`;
	t.mock.method(proto(stripe.subscriptions), "retrieve", async () => sub(subId));

	const done = event("checkout.session.completed", {
		id: "cs_1",
		object: "checkout.session",
		subscription: subId,
		client_reference_id: user.id,
		customer: "cus_1",
	});
	assert.equal((await send(done)).status, 200);
	let u = await getUser(user.id);
	assert.equal(u.subscriptionPlan, "standard");
	assert.equal(u.subscriptionStatus, "active");
	assert.equal(u.stripeId, "cus_1");
	assert.equal((await logOf(done.id)).status, "success");

	assert.equal(
		(await send(event("invoice.payment_failed", { id: "in_1", object: "invoice", subscription: subId }))).status,
		200,
	);
	assert.equal((await getUser(user.id)).subscriptionStatus, "past_due");

	assert.equal(
		(await send(event("customer.subscription.updated", sub(subId, "price_desconhecido", "active")))).status,
		200,
	);
	assert.equal((await getUser(user.id)).subscriptionPlan, "free");

	assert.equal((await send(event("customer.subscription.deleted", sub(subId)))).status, 200);
	u = await getUser(user.id);
	assert.equal(u.subscriptionPlan, "free");
	assert.equal(u.subscriptionStatus, "inactive");
	const [s] = await db.select().from(subscriptions).where(eq(subscriptions.stripeId, subId));
	assert.equal(s.stripeStatus, "canceled");
	assert.ok(s.endsAt);
});

test("webhook: eventos desconhecidos são aceites sem mexer em nada", async () => {
	const e = event("customer.created", { id: "cus_x", object: "customer" });
	assert.equal((await send(e)).status, 200);
	assert.equal((await logOf(e.id)).status, "success");
});
