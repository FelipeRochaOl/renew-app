"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const learningPaths_1 = require("../../src/data/learningPaths");
const helpers_1 = require("./helpers");
(0, node_test_1.test)("GET /learning-paths returns a list", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({ method: "GET", url: "/learning-paths/" });
    strict_1.default.equal(res.statusCode, 200);
    const body = res.json();
    strict_1.default.ok(Array.isArray(body));
    strict_1.default.ok(body.length >= 0);
});
(0, node_test_1.test)("GET /learning-paths filters by targetProfession, forCurrentProfession and level", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res1 = await app.inject({
        method: "GET",
        url: "/learning-paths?targetProfession=Segurança de Shopping&forCurrentProfession=true&level=BEGINNER",
    });
    const body1 = res1.json();
    strict_1.default.equal(res1.statusCode, 200);
    strict_1.default.ok(body1.every((lp) => lp.targetProfession === "Segurança de Shopping" &&
        lp.forCurrentProfession === true &&
        lp.level === "BEGINNER"));
    const res2 = await app.inject({
        method: "GET",
        url: "/learning-paths?forCurrentProfession=false",
    });
    const body2 = res2.json();
    strict_1.default.equal(res2.statusCode, 200);
    strict_1.default.ok(body2.every((lp) => lp.forCurrentProfession === false));
});
(0, node_test_1.test)("GET /learning-paths/:id returns item or 404", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const existingId = learningPaths_1.LEARNING_PATHS[0]?.id;
    if (existingId) {
        const ok = await app.inject({
            method: "GET",
            url: `/learning-paths/${existingId}`,
        });
        strict_1.default.equal(ok.statusCode, 200);
        const item = ok.json();
        strict_1.default.equal(item.id, existingId);
    }
    const notFound = await app.inject({
        method: "GET",
        url: `/learning-paths/does-not-exist`,
    });
    strict_1.default.equal(notFound.statusCode, 404);
});
