"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTestServer = void 0;
const cors_1 = __importDefault(require("@fastify/cors"));
const sensible_1 = __importDefault(require("@fastify/sensible"));
const fastify_1 = __importDefault(require("fastify"));
const assessment_routes_1 = __importDefault(require("./routes/assessment.routes"));
const chatbot_routes_1 = __importDefault(require("./routes/chatbot.routes"));
const learningPaths_routes_1 = __importDefault(require("./routes/learningPaths.routes"));
const recommendations_routes_1 = __importDefault(require("./routes/recommendations.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const buildTestServer = () => {
    const app = (0, fastify_1.default)({ logger: false });
    app.register(cors_1.default, { origin: true });
    app.register(sensible_1.default);
    app.register(users_routes_1.default, { prefix: "/users" });
    app.register(assessment_routes_1.default, { prefix: "/assessment" });
    app.register(learningPaths_routes_1.default, { prefix: "/learning-paths" });
    app.register(recommendations_routes_1.default, { prefix: "/recommendations" });
    app.register(chatbot_routes_1.default, { prefix: "/chatbot" });
    return app;
};
exports.buildTestServer = buildTestServer;
exports.default = exports.buildTestServer;
