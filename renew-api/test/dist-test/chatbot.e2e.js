"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const helper_1 = require("./helper");
(0, node_test_1.test)("POST /chatbot/message detects SEE_PATHS intent", async (t) => {
    const app = await (0, helper_1.build)(t);
    const res = await app.inject({
        method: "POST",
        url: "/chatbot/message",
        payload: { message: "Quero ver trilhas" },
    });
    node_assert_1.default.strictEqual(res.statusCode, 200);
    const body = res.json();
    node_assert_1.default.strictEqual(body.intent, "SEE_PATHS");
    node_assert_1.default.ok(Array.isArray(body.data.paths));
});
(0, node_test_1.test)("POST /chatbot/message without message returns 400", async (t) => {
    const app = await (0, helper_1.build)(t);
    const res = await app.inject({
        method: "POST",
        url: "/chatbot/message",
        payload: {},
    });
    node_assert_1.default.strictEqual(res.statusCode, 400);
});
(0, node_test_1.test)("POST /chatbot/message unknown intent returns default", async (t) => {
    const app = await (0, helper_1.build)(t);
    const res = await app.inject({
        method: "POST",
        url: "/chatbot/message",
        payload: { message: "asdfghjkl" },
    });
    node_assert_1.default.strictEqual(res.statusCode, 200);
    const body = res.json();
    node_assert_1.default.strictEqual(body.intent, "UNKNOWN");
});
