import assert from "node:assert/strict";
import { test } from "node:test";
import { buildApp } from "./helpers";

const sampleUser = {
  name: "Alice",
  email: `alice_${Date.now()}@example.com`,
  role: "worker",
  currentProfession: "Segurança de Shopping",
  region: "SP",
  educationLevel: "Médio",
};

test("POST /users creates a user and GET /users/:id retrieves it", async (t) => {
  const app = await buildApp(t);

  const createRes = await app.inject({
    method: "POST",
    url: "/users/",
    payload: sampleUser,
  });
  assert.equal(createRes.statusCode, 201);
  const created = createRes.json();
  assert.ok(created._id);
  assert.equal(created.name, sampleUser.name);
  assert.equal(created.email, sampleUser.email);

  const getRes = await app.inject({
    method: "GET",
    url: `/users/${created._id}`,
  });
  assert.equal(getRes.statusCode, 200);
  const got = getRes.json();
  assert.equal(got.email, sampleUser.email);
});

test("POST /users duplicate email returns 400", async (t) => {
  const app = await buildApp(t);
  const payload = {
    name: "Dup",
    email: `dup_${Date.now()}@example.com`,
    role: "worker",
  };
  const first = await app.inject({ method: "POST", url: "/users/", payload });
  assert.equal(first.statusCode, 201);
  const second = await app.inject({ method: "POST", url: "/users/", payload });
  assert.equal(second.statusCode, 400);
});

test("GET /users/:id 404 when not found", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "GET",
    url: "/users/507f1f77bcf86cd799439011",
  });
  assert.equal(res.statusCode, 404);
});
