import assert from "node:assert/strict";
import { test } from "node:test";
import { buildApp } from "./helpers";

const makeUser = () => ({
  name: "Bob",
  email: `bob_${Date.now()}@example.com`,
  role: "worker",
  currentProfession: "Segurança de Shopping",
  region: "SP",
});

test("GET /recommendations/for-user/:id returns suggestions", async (t) => {
  const app = await buildApp(t);

  const createRes = await app.inject({
    method: "POST",
    url: "/users/",
    payload: makeUser(),
  });
  assert.equal(createRes.statusCode, 201);
  const user = createRes.json();

  const recRes = await app.inject({
    method: "GET",
    url: `/recommendations/for-user/${user._id}`,
  });
  assert.equal(recRes.statusCode, 200);
  const body = recRes.json();
  assert.ok(body.user);
  assert.ok(body.professionRisk);
  assert.ok(Array.isArray(body.suggestedPaths));
});

test("GET /recommendations/for-user/:id returns 400 for invalid id format", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "GET",
    url: "/recommendations/for-user/not-a-valid-id",
  });
  assert.equal(res.statusCode, 400);
});

test("GET /recommendations/for-user/:id returns 400 when user not found", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "GET",
    url: "/recommendations/for-user/507f1f77bcf86cd799439011",
  });
  assert.equal(res.statusCode, 400);
});
