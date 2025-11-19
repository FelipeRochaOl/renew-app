import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { getUser, updateUser } from "../controllers/users.controller";
import { requireAuth } from "../plugins/auth";

const routes: FastifyPluginAsync = async (app) => {
  app.put(
    "/:id",
    { preHandler: requireAuth },
    async (req: FastifyRequest, reply: FastifyReply) => {
      return updateUser(req as any, reply);
    }
  );
  app.get("/:id", getUser);
};

export default routes;
