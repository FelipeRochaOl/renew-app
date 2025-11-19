import { FastifyPluginAsync } from "fastify";
import {
  getLearningPath,
  listLearningPaths,
} from "../controllers/learningPaths.controller";

const routes: FastifyPluginAsync = async (app) => {
  app.get("/", listLearningPaths);
  app.get("/:id", getLearningPath);
};

export default routes;
