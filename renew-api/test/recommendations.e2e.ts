import assert from "node:assert";
import { test } from "node:test";
import { setupTestDB, teardownTestDB } from "./db";
import { build } from "./helper";

test("GET /recommendations/for-user/:userId returns data for existing user", async (t) => {
  await setupTestDB();
  const app = await build(t);
  t.after(async () => {
    await teardownTestDB();
  });

  const create = await app.inject({
    method: "POST",
    url: "/users",
    payload: {
      name: "Carol",
      email: "carol@example.com",
      role: "worker",
      currentProfession: "Segurança de Shopping",
      region: "SP",
    },
  });
  const user = create.json();

  const res = await app.inject({
    method: "GET",
    url: `/recommendations/for-user/${user._id}`,
  });
  assert.strictEqual(res.statusCode, 200);
  const body = res.json();
  assert.ok(body.user && body.user._id === user._id);
  assert.ok(body.professionRisk && body.professionRisk.riskLevel);
  assert.ok(Array.isArray(body.suggestedPaths));
});

test("GET /recommendations/for-user/:userId returns 400 for invalid id", async (t) => {
  await setupTestDB();
  const app = await build(t);
  t.after(async () => {
    await teardownTestDB();
  });

  const res = await app.inject({
    method: "GET",
    url: "/recommendations/for-user/not-a-valid-id",
  });
  assert.strictEqual(res.statusCode, 400);
});
