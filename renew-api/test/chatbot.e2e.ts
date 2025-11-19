import assert from "node:assert";
import { test } from "node:test";
import { build } from "./helper";

test("POST /chatbot/message detects SEE_PATHS intent", async (t) => {
  const app = await build(t);
  const res = await app.inject({
    method: "POST",
    url: "/chatbot/message",
    payload: { message: "Quero ver trilhas" },
  });
  assert.strictEqual(res.statusCode, 200);
  const body = res.json();
  assert.strictEqual(body.intent, "SEE_PATHS");
  assert.ok(Array.isArray(body.data.paths));
});

test("POST /chatbot/message without message returns 400", async (t) => {
  const app = await build(t);
  const res = await app.inject({
    method: "POST",
    url: "/chatbot/message",
    payload: {},
  });
  assert.strictEqual(res.statusCode, 400);
});

test("POST /chatbot/message unknown intent returns default", async (t) => {
  const app = await build(t);
  const res = await app.inject({
    method: "POST",
    url: "/chatbot/message",
    payload: { message: "asdfghjkl" },
  });
  assert.strictEqual(res.statusCode, 200);
  const body = res.json();
  assert.strictEqual(body.intent, "UNKNOWN");
});
