import assert from "node:assert/strict";
import { test } from "node:test";
import { buildApp } from "./helpers";

test("POST /chatbot/message handles known intent", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "POST",
    url: "/chatbot/message",
    payload: { message: "Quero ver trilhas" },
  });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.intent, "SEE_PATHS");
  assert.ok(body.data?.paths);
});

test("POST /chatbot/message validates request body", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "POST",
    url: "/chatbot/message",
    payload: {},
  });
  assert.equal(res.statusCode, 400);
});

test("POST /chatbot/message ASSESS_PROFESSION with known profession", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "POST",
    url: "/chatbot/message",
    payload: { message: "Quero avaliar profissão segurança de shopping" },
  });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.intent, "ASSESS_PROFESSION");
  assert.ok(body.data?.profession);
});

test("POST /chatbot/message ASSESS_PROFESSION without explicit profession", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "POST",
    url: "/chatbot/message",
    payload: { message: "Quero avaliar minha profissão" },
  });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.intent, "ASSESS_PROFESSION");
});

test("POST /chatbot/message CHANGE_CAREER", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "POST",
    url: "/chatbot/message",
    payload: { message: "Quero mudar de área" },
  });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.intent, "CHANGE_CAREER");
  assert.ok(Array.isArray(body.data.paths));
});

test("POST /chatbot/message WHAT_COURSE", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "POST",
    url: "/chatbot/message",
    payload: { message: "Qual curso devo fazer?" },
  });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.intent, "WHAT_COURSE");
});

test("POST /chatbot/message CAREER_FUTURE", async (t) => {
  const app = await buildApp(t);
  const res = await app.inject({
    method: "POST",
    url: "/chatbot/message",
    payload: { message: "Meu futuro no trabalho" },
  });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.intent, "CAREER_FUTURE");
});
