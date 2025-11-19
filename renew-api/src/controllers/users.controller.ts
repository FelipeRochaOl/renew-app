import { FastifyReply, FastifyRequest } from "fastify";
import { UserService } from "../services/user.service";

export const updateUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const user = await UserService.updateUser(id, req.body as any);
    reply.code(201).send(user);
  } catch (err: any) {
    reply.code(400).send({ error: err.message });
  }
};

export const getUser = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) return reply.code(404).send({ error: "User not found" });
    reply.send(user);
  } catch (err: any) {
    reply.code(400).send({ error: err.message });
  }
};
