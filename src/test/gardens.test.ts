import assert from "node:assert/strict";
import { test } from "node:test";
import { DELETE, GET, PATCH } from "@/app/api/gardens/[id]/route";
import { POST as createGarden } from "@/app/api/gardens/route";
import { POST as plan } from "@/app/api/garden/plan/route";
import { input } from "@/lib/garden/fixtures";
import { ctx, req, setPlan, signUp } from "./api.ts";

const body = (name = "Varanda") => ({ name, input: input() });
const create = (cookie: string, b: unknown = body()) => createGarden(req("/api/gardens", { body: b, cookie }));

test("sem sessão todas as rotas de hortas dão 401", async () => {
	assert.equal((await create("")).status, 401);
	assert.equal((await plan(req("/api/garden/plan", { body: input() }))).status, 401);
	assert.equal((await GET(req("/api/gardens/1"), ctx(1))).status, 401);
	assert.equal((await PATCH(req("/api/gardens/1", { method: "PATCH", body: { name: "x" } }), ctx(1))).status, 401);
	assert.equal((await DELETE(req("/api/gardens/1", { method: "DELETE" }), ctx(1))).status, 401);
});

test("cookie de sessão forjado dá 401", async () => {
	assert.equal((await create("better-auth.session_token=forjado.assinatura")).status, 401);
});

test("inputs inválidos dão 400 e não gravam nada", async () => {
	const { cookie } = await signUp();
	for (const b of [
		null,
		"não é json",
		{ name: "", input: input() },
		{ name: "x", input: { ...input(), zone: "marte" } },
		{ name: "x", input: { ...input(), space: { kind: "vasos", widthCm: 10, lengthCm: 100 } } },
		{ name: "x", input: { ...input(), crops: [] } },
		{ name: "x", input: { ...input(), crops: [{ slug: "nao-existe" }] } },
		{ name: "x", input: { ...input(), owned: ["nao-existe"] } },
	]) {
		const r = await create(cookie, b);
		assert.equal(r.status, 400, JSON.stringify(b));
	}
	assert.equal((await plan(req("/api/garden/plan", { body: { ...input(), light: "lua" }, cookie }))).status, 400);
});

test("criar, ler, editar e apagar uma horta", async () => {
	const { user, cookie } = await signUp();
	const r = await create(cookie, body("  Varanda  "));
	assert.equal(r.status, 201);
	const { data } = await r.json();
	assert.equal(data.name, "Varanda");
	assert.equal(data.userId, user.id);

	const g = await GET(req(`/api/gardens/${data.id}`, { cookie }), ctx(data.id));
	assert.equal(g.status, 200);
	const got = (await g.json()).data;
	assert.equal(got.garden.id, data.id);
	assert.ok(got.view);

	const p = await PATCH(req(`/api/gardens/${data.id}`, { method: "PATCH", body: { name: "Quintal" }, cookie }), ctx(data.id));
	assert.equal((await p.json()).data.name, "Quintal");
	assert.equal((await PATCH(req(`/api/gardens/${data.id}`, { method: "PATCH", body: {}, cookie }), ctx(data.id))).status, 400);

	assert.equal((await DELETE(req(`/api/gardens/${data.id}`, { method: "DELETE", cookie }), ctx(data.id))).status, 200);
	assert.equal((await GET(req(`/api/gardens/${data.id}`, { cookie }), ctx(data.id))).status, 404);
});

test("não se lê, edita nem apaga a horta de outra pessoa", async () => {
	const dono = await signUp();
	const outro = await signUp();
	const { data } = await (await create(dono.cookie)).json();
	const id = data.id;
	assert.equal((await GET(req(`/api/gardens/${id}`, { cookie: outro.cookie }), ctx(id))).status, 404);
	assert.equal((await PATCH(req(`/api/gardens/${id}`, { method: "PATCH", body: { name: "meu" }, cookie: outro.cookie }), ctx(id))).status, 404);
	assert.equal((await DELETE(req(`/api/gardens/${id}`, { method: "DELETE", cookie: outro.cookie }), ctx(id))).status, 404);
	const still = await (await GET(req(`/api/gardens/${id}`, { cookie: dono.cookie }), ctx(id))).json();
	assert.equal(still.data.garden.name, "Varanda");
});

test("ids inválidos dão 404", async () => {
	const { cookie } = await signUp();
	for (const id of ["abc", "0", "-1", "1.5", "99999999"]) {
		assert.equal((await GET(req(`/api/gardens/${id}`, { cookie }), ctx(id))).status, 404, id);
	}
});

test("Grátis guarda até 3 hortas, Standard não tem limite", async () => {
	const { user, cookie } = await signUp();
	for (let i = 0; i < 3; i++) assert.equal((await create(cookie)).status, 201);
	const r = await create(cookie);
	assert.equal(r.status, 403);
	assert.equal((await r.json()).code, "PLAN_LIMIT_EXCEEDED");

	await setPlan(user.id, "standard");
	assert.equal((await create(cookie)).status, 201);
});

test("o plano Grátis recebe a vista redigida, o Standard a completa", async () => {
	const { user, cookie } = await signUp();
	const free = (await (await plan(req("/api/garden/plan", { body: input(), cookie }))).json()).data;
	assert.equal(free.view.watering.length, 1);
	assert.ok(free.view.locked.length > 0);

	await setPlan(user.id, "standard");
	const std = (await (await plan(req("/api/garden/plan", { body: input(), cookie }))).json()).data;
	assert.equal(std.view.watering.length, 12);
	assert.deepEqual(std.view.locked, []);
});
