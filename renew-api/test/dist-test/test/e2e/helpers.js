"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const cors_1 = __importDefault(require("@fastify/cors"));
const sensible_1 = __importDefault(require("@fastify/sensible"));
const fastify_1 = __importDefault(require("fastify"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const assessment_routes_1 = __importDefault(require("../../src/routes/assessment.routes"));
const chatbot_routes_1 = __importDefault(require("../../src/routes/chatbot.routes"));
const learningPaths_routes_1 = __importDefault(require("../../src/routes/learningPaths.routes"));
const recommendations_routes_1 = __importDefault(require("../../src/routes/recommendations.routes"));
const users_routes_1 = __importDefault(require("../../src/routes/users.routes"));
const db_1 = require("../../src/utils/db");
async function buildApp(t) {
    const app = (0, fastify_1.default)({ logger: false });
    app.register(cors_1.default, { origin: true });
    app.register(sensible_1.default);
    app.register(users_routes_1.default, { prefix: "/users" });
    app.register(assessment_routes_1.default, { prefix: "/assessment" });
    app.register(learningPaths_routes_1.default, { prefix: "/learning-paths" });
    app.register(recommendations_routes_1.default, { prefix: "/recommendations" });
    app.register(chatbot_routes_1.default, { prefix: "/chatbot" });
    const mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    await (0, db_1.connectToDatabase)(uri);
    t.after(async () => {
        await app.close();
        await mongoose_1.default.disconnect();
        await mongod.stop();
    });
    return app;
}
