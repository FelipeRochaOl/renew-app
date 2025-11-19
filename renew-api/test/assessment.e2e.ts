import assert from "node:assert";
import { test } from "node:test";
import { build } from "./helper";

test("POST /assessment/profession-risk returns known profession risk", async (t) => {
  const app = await build(t);
  const res = await app.inject({
    method: "POST",
    url: "/assessment/profession-risk",
    payload: { profession: "Segurança de Shopping" },
  });
  assert.strictEqual(res.statusCode, 200);
  const body = res.json();
  assert.strictEqual(body.profession, "Segurança de Shopping");
  assert.ok(["LOW", "MEDIUM", "HIGH"].includes(body.riskLevel));
});

test("POST /assessment/profession-risk without profession returns 400", async (t) => {
  const app = await build(t);
  const res = await app.inject({
    method: "POST",
    url: "/assessment/profession-risk",
    payload: {},
  });
  assert.strictEqual(res.statusCode, 400);
});
