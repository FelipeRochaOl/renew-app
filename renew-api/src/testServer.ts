import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import Fastify, { FastifyInstance } from "fastify";
import assessmentRoutes from "./routes/assessment.routes";
import chatbotRoutes from "./routes/chatbot.routes";
import learningPathsRoutes from "./routes/learningPaths.routes";
import recommendationsRoutes from "./routes/recommendations.routes";
import usersRoutes from "./routes/users.routes";

export const buildTestServer = (): FastifyInstance => {
  const app = Fastify({ logger: false });

  app.register(cors, { origin: true });
  app.register(sensible);

  app.register(usersRoutes, { prefix: "/users" });
  app.register(assessmentRoutes, { prefix: "/assessment" });
  app.register(learningPathsRoutes, { prefix: "/learning-paths" });
  app.register(recommendationsRoutes, { prefix: "/recommendations" });
  app.register(chatbotRoutes, { prefix: "/chatbot" });

  return app;
};

export default buildTestServer;
