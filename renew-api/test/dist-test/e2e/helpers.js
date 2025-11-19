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
const assessmentRoutes = require("../../../dist/routes/assessment.routes").default;
const chatbotRoutes = require("../../../dist/routes/chatbot.routes").default;
const learningPathsRoutes = require("../../../dist/routes/learningPaths.routes").default;
const recommendationsRoutes = require("../../../dist/routes/recommendations.routes").default;
const usersRoutes = require("../../../dist/routes/users.routes").default;
const connectToDatabase = require("../../../dist/utils/db").connectToDatabase;
async function buildApp(t) {
    const app = (0, fastify_1.default)({ logger: false });
    app.register(cors_1.default, { origin: true });
    app.register(sensible_1.default);
    app.register(usersRoutes, { prefix: "/users" });
    app.register(assessmentRoutes, { prefix: "/assessment" });
    app.register(learningPathsRoutes, { prefix: "/learning-paths" });
    app.register(recommendationsRoutes, { prefix: "/recommendations" });
    app.register(chatbotRoutes, { prefix: "/chatbot" });
    const mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connectToDatabase(uri);
    t.after(async () => {
        await app.close();
        await mongoose_1.default.disconnect();
        await mongod.stop();
    });
    return app;
}
