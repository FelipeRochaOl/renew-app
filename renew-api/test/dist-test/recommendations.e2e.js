"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const db_1 = require("./db");
const helper_1 = require("./helper");
(0, node_test_1.test)("GET /recommendations/for-user/:userId returns data for existing user", async (t) => {
    await (0, db_1.setupTestDB)();
    const app = await (0, helper_1.build)(t);
    t.after(async () => {
        await (0, db_1.teardownTestDB)();
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
    node_assert_1.default.strictEqual(res.statusCode, 200);
    const body = res.json();
    node_assert_1.default.ok(body.user && body.user._id === user._id);
    node_assert_1.default.ok(body.professionRisk && body.professionRisk.riskLevel);
    node_assert_1.default.ok(Array.isArray(body.suggestedPaths));
});
(0, node_test_1.test)("GET /recommendations/for-user/:userId returns 400 for invalid id", async (t) => {
    await (0, db_1.setupTestDB)();
    const app = await (0, helper_1.build)(t);
    t.after(async () => {
        await (0, db_1.teardownTestDB)();
    });
    const res = await app.inject({
        method: "GET",
        url: "/recommendations/for-user/not-a-valid-id",
    });
    node_assert_1.default.strictEqual(res.statusCode, 400);
});
