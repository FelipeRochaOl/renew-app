import assert from "node:assert";
import { test } from "node:test";
import { build } from "./helper";

test("GET /learning-paths returns list", async (t) => {
  const app = await build(t);
  const res = await app.inject({ method: "GET", url: "/learning-paths" });
  assert.strictEqual(res.statusCode, 200);
  const body = res.json();
  assert.ok(Array.isArray(body));
  assert.ok(body.length >= 1);
});

test("GET /learning-paths?targetProfession filters correctly", async (t) => {
  const app = await build(t);
  const res = await app.inject({
    method: "GET",
    url: "/learning-paths?targetProfession=Segurança de Shopping",
  });
  assert.strictEqual(res.statusCode, 200);
  const body = res.json();
  assert.ok(Array.isArray(body));
  assert.ok(
    body.every((lp: any) => lp.targetProfession === "Segurança de Shopping")
  );
});

test("GET /learning-paths/:id returns item or 404", async (t) => {
  const app = await build(t);
  const ok = await app.inject({
    method: "GET",
    url: "/learning-paths/lp-sec-update",
  });
  assert.strictEqual(ok.statusCode, 200);
  const notFound = await app.inject({
    method: "GET",
    url: "/learning-paths/does-not-exist",
  });
  assert.strictEqual(notFound.statusCode, 404);
});
