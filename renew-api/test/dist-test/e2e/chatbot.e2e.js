"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const helpers_1 = require("./helpers");
(0, node_test_1.test)("POST /chatbot/message handles known intent", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "POST",
        url: "/chatbot/message",
        payload: { message: "Quero ver trilhas" },
    });
    strict_1.default.equal(res.statusCode, 200);
    const body = res.json();
    strict_1.default.equal(body.intent, "SEE_PATHS");
    strict_1.default.ok(body.data?.paths);
});
(0, node_test_1.test)("POST /chatbot/message validates request body", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "POST",
        url: "/chatbot/message",
        payload: {},
    });
    strict_1.default.equal(res.statusCode, 400);
});
(0, node_test_1.test)("POST /chatbot/message ASSESS_PROFESSION with known profession", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "POST",
        url: "/chatbot/message",
        payload: { message: "Quero avaliar profissão segurança de shopping" },
    });
    strict_1.default.equal(res.statusCode, 200);
    const body = res.json();
    strict_1.default.equal(body.intent, "ASSESS_PROFESSION");
    strict_1.default.ok(body.data?.profession);
});
(0, node_test_1.test)("POST /chatbot/message ASSESS_PROFESSION without explicit profession", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "POST",
        url: "/chatbot/message",
        payload: { message: "Quero avaliar minha profissão" },
    });
    strict_1.default.equal(res.statusCode, 200);
    const body = res.json();
    strict_1.default.equal(body.intent, "ASSESS_PROFESSION");
});
(0, node_test_1.test)("POST /chatbot/message CHANGE_CAREER", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "POST",
        url: "/chatbot/message",
        payload: { message: "Quero mudar de área" },
    });
    strict_1.default.equal(res.statusCode, 200);
    const body = res.json();
    strict_1.default.equal(body.intent, "CHANGE_CAREER");
    strict_1.default.ok(Array.isArray(body.data.paths));
});
(0, node_test_1.test)("POST /chatbot/message WHAT_COURSE", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "POST",
        url: "/chatbot/message",
        payload: { message: "Qual curso devo fazer?" },
    });
    strict_1.default.equal(res.statusCode, 200);
    const body = res.json();
    strict_1.default.equal(body.intent, "WHAT_COURSE");
});
(0, node_test_1.test)("POST /chatbot/message CAREER_FUTURE", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "POST",
        url: "/chatbot/message",
        payload: { message: "Meu futuro no trabalho" },
    });
    strict_1.default.equal(res.statusCode, 200);
    const body = res.json();
    strict_1.default.equal(body.intent, "CAREER_FUTURE");
});
