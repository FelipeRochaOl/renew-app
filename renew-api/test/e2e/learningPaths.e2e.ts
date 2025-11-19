import assert from "node:assert/strict";
import { test } from "node:test";
import { LEARNING_PATHS } from "../../src/data/learningPaths";
import { buildApp } from "./helpers";

test("GET /learning-paths returns a list", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({ method: "GET", url: "/learning-paths/" });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.ok(Array.isArray(body));
  assert.ok(body.length >= 0);
});

test("GET /learning-paths filters by targetProfession, forCurrentProfession and level", async (t) => {
  const app = await buildApp(t);
  const res1 = await app.inject({
    method: "GET",
    url: "/learning-paths?targetProfession=Segurança de Shopping&forCurrentProfession=true&level=BEGINNER",
  });
  const body1 = res1.json();
  assert.equal(res1.statusCode, 200);
  assert.ok(
    body1.every(
      (lp: any) =>
        lp.targetProfession === "Segurança de Shopping" &&
        lp.forCurrentProfession === true &&
        lp.level === "BEGINNER"
    )
  );

  const res2 = await app.inject({
    method: "GET",
    url: "/learning-paths?forCurrentProfession=false",
  });
  const body2 = res2.json();
  assert.equal(res2.statusCode, 200);
  assert.ok(body2.every((lp: any) => lp.forCurrentProfession === false));
});

test("GET /learning-paths/:id returns item or 404", async (t) => {
  const app = await buildApp(t);
  const existingId = LEARNING_PATHS[0]?.id;
  if (existingId) {
    const ok = await app.inject({
      method: "GET",
      url: `/learning-paths/${existingId}`,
    });
    assert.equal(ok.statusCode, 200);
    const item = ok.json();
    assert.equal(item.id, existingId);
  }
  const notFound = await app.inject({
    method: "GET",
    url: `/learning-paths/does-not-exist`,
  });
  assert.equal(notFound.statusCode, 404);
});
