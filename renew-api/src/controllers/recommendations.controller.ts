import { FastifyReply, FastifyRequest } from "fastify";
import { RecommendationService } from "../services/recommendation.service";

export const forUser = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const data = await RecommendationService.forUser(req.params.userId);
    reply.send(data);
  } catch (err: any) {
    reply.code(400).send({ error: err.message });
  }
};
