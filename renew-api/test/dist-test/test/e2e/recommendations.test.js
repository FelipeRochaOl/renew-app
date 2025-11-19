"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const helpers_1 = require("./helpers");
const makeUser = () => ({
    name: "Bob",
    email: `bob_${Date.now()}@example.com`,
    role: "worker",
    currentProfession: "Segurança de Shopping",
    region: "SP",
});
(0, node_test_1.test)("GET /recommendations/for-user/:id returns suggestions", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const createRes = await app.inject({
        method: "POST",
        url: "/users/",
        payload: makeUser(),
    });
    strict_1.default.equal(createRes.statusCode, 201);
    const user = createRes.json();
    const recRes = await app.inject({
        method: "GET",
        url: `/recommendations/for-user/${user._id}`,
    });
    strict_1.default.equal(recRes.statusCode, 200);
    const body = recRes.json();
    strict_1.default.ok(body.user);
    strict_1.default.ok(body.professionRisk);
    strict_1.default.ok(Array.isArray(body.suggestedPaths));
});
(0, node_test_1.test)("GET /recommendations/for-user/:id returns 400 for invalid id format", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "GET",
        url: "/recommendations/for-user/not-a-valid-id",
    });
    strict_1.default.equal(res.statusCode, 400);
});
(0, node_test_1.test)("GET /recommendations/for-user/:id returns 400 when user not found", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "GET",
        url: "/recommendations/for-user/507f1f77bcf86cd799439011",
    });
    strict_1.default.equal(res.statusCode, 400);
});
