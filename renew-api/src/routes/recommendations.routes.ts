import { FastifyPluginAsync } from "fastify";
import { forUser } from "../controllers/recommendations.controller";

const routes: FastifyPluginAsync = async (app) => {
  app.get("/for-user/:userId", forUser);
};

export default routes;
