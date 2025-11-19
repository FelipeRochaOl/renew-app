import assert from "node:assert";
import { test } from "node:test";
import { setupTestDB, teardownTestDB } from "./db";
import { build } from "./helper";

test("POST /users creates and GET /users/:id retrieves user", async (t) => {
  await setupTestDB();
  const app = await build(t);
  t.after(async () => {
    await teardownTestDB();
  });

  const create = await app.inject({
    method: "POST",
    url: "/users",
    payload: {
      name: "Alice",
      email: "alice@example.com",
      role: "worker",
      currentProfession: "Segurança de Shopping",
      region: "SP",
    },
  });
  assert.strictEqual(create.statusCode, 201);
  const created = create.json();
  assert.ok(created._id);

  const getRes = await app.inject({
    method: "GET",
    url: `/users/${created._id}`,
  });
  assert.strictEqual(getRes.statusCode, 200);
  const got = getRes.json();
  assert.strictEqual(got.email, "alice@example.com");
});

test("POST /users duplicate email returns 400", async (t) => {
  await setupTestDB();
  const app = await build(t);
  t.after(async () => {
    await teardownTestDB();
  });

  const payload = { name: "Bob", email: "bob@example.com", role: "worker" };
  const first = await app.inject({ method: "POST", url: "/users", payload });
  assert.strictEqual(first.statusCode, 201);
  const second = await app.inject({ method: "POST", url: "/users", payload });
  assert.strictEqual(second.statusCode, 400);
});

test("GET /users/:id not found returns 404", async (t) => {
  await setupTestDB();
  const app = await build(t);
  t.after(async () => {
    await teardownTestDB();
  });

  // Valid ObjectId format but not existing
  const res = await app.inject({
    method: "GET",
    url: "/users/64b64b64b64b64b64b64b64b",
  });
  assert.strictEqual(res.statusCode, 404);
});
