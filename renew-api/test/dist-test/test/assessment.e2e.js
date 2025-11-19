"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const helper_1 = require("./helper");
(0, node_test_1.test)("POST /assessment/profession-risk returns known profession risk", async (t) => {
    const app = await (0, helper_1.build)(t);
    const res = await app.inject({
        method: "POST",
        url: "/assessment/profession-risk",
        payload: { profession: "Segurança de Shopping" },
    });
    node_assert_1.default.strictEqual(res.statusCode, 200);
    const body = res.json();
    node_assert_1.default.strictEqual(body.profession, "Segurança de Shopping");
    node_assert_1.default.ok(["LOW", "MEDIUM", "HIGH"].includes(body.riskLevel));
});
(0, node_test_1.test)("POST /assessment/profession-risk without profession returns 400", async (t) => {
    const app = await (0, helper_1.build)(t);
    const res = await app.inject({
        method: "POST",
        url: "/assessment/profession-risk",
        payload: {},
    });
    node_assert_1.default.strictEqual(res.statusCode, 400);
});
