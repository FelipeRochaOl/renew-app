"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const helpers_1 = require("./helpers");
(0, node_test_1.test)("POST /assessment/profession-risk returns risk for profession", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "POST",
        url: "/assessment/profession-risk",
        payload: { profession: "Segurança de Shopping" },
    });
    strict_1.default.equal(res.statusCode, 200);
    const body = res.json();
    strict_1.default.equal(body.profession.toLowerCase().includes("segurança"), true);
    strict_1.default.ok(["LOW", "MEDIUM", "HIGH"].includes(body.riskLevel));
});
(0, node_test_1.test)("POST /assessment/profession-risk validates missing profession", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "POST",
        url: "/assessment/profession-risk",
        payload: {},
    });
    strict_1.default.equal(res.statusCode, 400);
});
(0, node_test_1.test)("POST /assessment/profession-risk returns fallback for unknown profession", async (t) => {
    const app = await (0, helpers_1.buildApp)(t);
    const res = await app.inject({
        method: "POST",
        url: "/assessment/profession-risk",
        payload: { profession: "Profissão Desconhecida XYZ" },
    });
    strict_1.default.equal(res.statusCode, 200);
    const body = res.json();
    strict_1.default.equal(body.profession, "Profissão Desconhecida XYZ");
    strict_1.default.equal(body.riskLevel, "LOW");
});
