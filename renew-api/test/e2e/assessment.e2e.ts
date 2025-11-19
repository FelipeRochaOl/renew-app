import assert from "node:assert/strict";
import { test } from "node:test";
import { buildApp } from "./helpers";

test("POST /assessment/profession-risk returns risk for profession", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "POST",
    url: "/assessment/profession-risk",
    payload: { profession: "Segurança de Shopping" },
  });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.profession.toLowerCase().includes("segurança"), true);
  assert.ok(["LOW", "MEDIUM", "HIGH"].includes(body.riskLevel));
});

test("POST /assessment/profession-risk validates missing profession", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "POST",
    url: "/assessment/profession-risk",
    payload: {},
  });
  assert.equal(res.statusCode, 400);
});

test("POST /assessment/profession-risk returns fallback for unknown profession", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "POST",
    url: "/assessment/profession-risk",
    payload: { profession: "Profissão Desconhecida XYZ" },
  });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.profession, "Profissão Desconhecida XYZ");
  assert.equal(body.riskLevel, "LOW");
});
