import { FastifyReply, FastifyRequest } from "fastify";
import { verifyJwt } from "../services/auth.service";

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
  const token = auth.slice(7);
  try {
    const decoded = verifyJwt(token);
    // @ts-ignore
    (req as any).user = decoded;
  } catch {
    return reply.code(401).send({ error: "Unauthorized" });
  }
}
