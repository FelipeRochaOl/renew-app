"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const helper_1 = require("./helper");
(0, node_test_1.test)("GET /learning-paths returns list", async (t) => {
    const app = await (0, helper_1.build)(t);
    const res = await app.inject({ method: "GET", url: "/learning-paths" });
    node_assert_1.default.strictEqual(res.statusCode, 200);
    const body = res.json();
    node_assert_1.default.ok(Array.isArray(body));
    node_assert_1.default.ok(body.length >= 1);
});
(0, node_test_1.test)("GET /learning-paths?targetProfession filters correctly", async (t) => {
    const app = await (0, helper_1.build)(t);
    const res = await app.inject({
        method: "GET",
        url: "/learning-paths?targetProfession=Segurança de Shopping",
    });
    node_assert_1.default.strictEqual(res.statusCode, 200);
    const body = res.json();
    node_assert_1.default.ok(Array.isArray(body));
    node_assert_1.default.ok(body.every((lp) => lp.targetProfession === "Segurança de Shopping"));
});
(0, node_test_1.test)("GET /learning-paths/:id returns item or 404", async (t) => {
    const app = await (0, helper_1.build)(t);
    const ok = await app.inject({
        method: "GET",
        url: "/learning-paths/lp-sec-update",
    });
    node_assert_1.default.strictEqual(ok.statusCode, 200);
    const notFound = await app.inject({
        method: "GET",
        url: "/learning-paths/does-not-exist",
    });
    node_assert_1.default.strictEqual(notFound.statusCode, 404);
});
