"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const helpers_1 = require("./helpers");
const sampleUser = {
    name: "Alice",
    email: `alice_${Date.now()}@example.com`,
    role: "worker",
    currentProfession: "Segurança de Shopping",
    region: "SP",
    educationLevel: "Médio",
};
(0, node_test_1.test)("POST /users creates a user and GET /users/:id retrieves it", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const createRes = await app.inject({
        method: "POST",
        url: "/users/",
        payload: sampleUser,
    });
    strict_1.default.equal(createRes.statusCode, 201);
    const created = createRes.json();
    strict_1.default.ok(created._id);
    strict_1.default.equal(created.name, sampleUser.name);
    strict_1.default.equal(created.email, sampleUser.email);
    const getRes = await app.inject({
        method: "GET",
        url: `/users/${created._id}`,
    });
    strict_1.default.equal(getRes.statusCode, 200);
    const got = getRes.json();
    strict_1.default.equal(got.email, sampleUser.email);
});
(0, node_test_1.test)("POST /users duplicate email returns 400", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const payload = {
        name: "Dup",
        email: `dup_${Date.now()}@example.com`,
        role: "worker",
    };
    const first = await app.inject({ method: "POST", url: "/users/", payload });
    strict_1.default.equal(first.statusCode, 201);
    const second = await app.inject({ method: "POST", url: "/users/", payload });
    strict_1.default.equal(second.statusCode, 400);
});
(0, node_test_1.test)("GET /users/:id 404 when not found", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "GET",
        url: "/users/507f1f77bcf86cd799439011",
    });
    strict_1.default.equal(res.statusCode, 404);
});
