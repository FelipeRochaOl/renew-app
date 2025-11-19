"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const db_1 = require("./db");
const helper_1 = require("./helper");
(0, node_test_1.test)("POST /users creates and GET /users/:id retrieves user", async (t) => {
    await (0, db_1.setupTestDB)();
    const app = await (0, helper_1.build)(t);
    t.after(async () => {
        await (0, db_1.teardownTestDB)();
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
    node_assert_1.default.strictEqual(create.statusCode, 201);
    const created = create.json();
    node_assert_1.default.ok(created._id);
    const getRes = await app.inject({
        method: "GET",
        url: `/users/${created._id}`,
    });
    node_assert_1.default.strictEqual(getRes.statusCode, 200);
    const got = getRes.json();
    node_assert_1.default.strictEqual(got.email, "alice@example.com");
});
(0, node_test_1.test)("POST /users duplicate email returns 400", async (t) => {
    await (0, db_1.setupTestDB)();
    const app = await (0, helper_1.build)(t);
    t.after(async () => {
        await (0, db_1.teardownTestDB)();
    });
    const payload = { name: "Bob", email: "bob@example.com", role: "worker" };
    const first = await app.inject({ method: "POST", url: "/users", payload });
    node_assert_1.default.strictEqual(first.statusCode, 201);
    const second = await app.inject({ method: "POST", url: "/users", payload });
    node_assert_1.default.strictEqual(second.statusCode, 400);
});
(0, node_test_1.test)("GET /users/:id not found returns 404", async (t) => {
    await (0, db_1.setupTestDB)();
    const app = await (0, helper_1.build)(t);
    t.after(async () => {
        await (0, db_1.teardownTestDB)();
    });
    const res = await app.inject({
        method: "GET",
        url: "/users/64b64b64b64b64b64b64b64b",
    });
    node_assert_1.default.strictEqual(res.statusCode, 404);
});
