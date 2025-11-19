import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import Fastify from "fastify";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import * as test from "node:test";

// Use CommonJS require to avoid TS typings for compiled JS in dist
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assessmentRoutes =
  require("../../../dist/routes/assessment.routes").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chatbotRoutes = require("../../../dist/routes/chatbot.routes").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const learningPathsRoutes =
  require("../../../dist/routes/learningPaths.routes").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const recommendationsRoutes =
  require("../../../dist/routes/recommendations.routes").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const usersRoutes = require("../../../dist/routes/users.routes").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const connectToDatabase = require("../../../dist/utils/db").connectToDatabase;

export type TestContext = { after: typeof test.after };

export async function buildApp(t: TestContext) {
  const app = Fastify({ logger: false });

  app.register(cors, { origin: true });
  app.register(sensible);

  app.register(usersRoutes, { prefix: "/users" });
  app.register(assessmentRoutes, { prefix: "/assessment" });
  app.register(learningPathsRoutes, { prefix: "/learning-paths" });
  app.register(recommendationsRoutes, { prefix: "/recommendations" });
  app.register(chatbotRoutes, { prefix: "/chatbot" });

  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await connectToDatabase(uri);

  t.after(async () => {
    await app.close();
    await mongoose.disconnect();
    await mongod.stop();
  });

  return app;
}
