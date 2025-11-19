import { FastifyPluginAsync } from "fastify";
import { assessProfessionRisk } from "../controllers/assessment.controller";

const routes: FastifyPluginAsync = async (app) => {
  app.post("/profession-risk", assessProfessionRisk);
};

export default routes;
