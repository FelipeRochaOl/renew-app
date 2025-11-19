import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import "dotenv/config";
import Fastify from "fastify";
import assessmentRoutes from "./routes/assessment.routes";
import authRoutes from "./routes/auth.routes";
import chatbotRoutes from "./routes/chatbot.routes";
import learningPathsRoutes from "./routes/learningPaths.routes";
import recommendationsRoutes from "./routes/recommendations.routes";
import usersRoutes from "./routes/users.routes";
import { connectToDatabase } from "./utils/db";

const buildServer = () => {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });
  app.register(sensible);

  app.get("/health", async () => ({ status: "ok" }));

  app.register(usersRoutes, { prefix: "/users" });
  app.register(authRoutes, { prefix: "/auth" });
  app.register(assessmentRoutes, { prefix: "/assessment" });
  app.register(learningPathsRoutes, { prefix: "/learning-paths" });
  app.register(recommendationsRoutes, { prefix: "/recommendations" });
  app.register(chatbotRoutes, { prefix: "/chatbot" });

  return app;
};

const start = async () => {
  const PORT = Number(process.env.PORT || 3333);
  const MONGO_URL = process.env.MONGO_URL;

  if (!MONGO_URL) {
    throw new Error("Missing MONGO_URL environment variable");
  }

  await connectToDatabase(MONGO_URL);

  const app = buildServer();
  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export default buildServer;
