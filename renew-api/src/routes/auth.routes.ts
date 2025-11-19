import { FastifyPluginAsync } from "fastify";
import {
  completeReset,
  login,
  register,
  startReset,
} from "../controllers/auth.controller";

const routes: FastifyPluginAsync = async (app) => {
  app.post("/login", login);
  app.post("/register", register);
  app.post("/recover", startReset);
  app.post("/reset", completeReset);
};

export default routes;
