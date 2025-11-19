import { FastifyReply, FastifyRequest } from "fastify";
import { LearningPathService } from "../services/learningPath.service";

export const listLearningPaths = async (
  req: FastifyRequest<{
    Querystring: {
      targetProfession?: string;
      forCurrentProfession?: string;
      level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    };
  }>,
  reply: FastifyReply
) => {
  const { targetProfession, forCurrentProfession, level } = req.query;
  const filters: any = {};
  if (targetProfession) filters.targetProfession = targetProfession;
  if (forCurrentProfession !== undefined)
    filters.forCurrentProfession = ["1", "true", "yes"].includes(
      String(forCurrentProfession).toLowerCase()
    );
  if (level) filters.level = level;

  const data = await LearningPathService.list(filters);
  reply.send(data);
};

export const getLearningPath = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const item = await LearningPathService.getById(req.params.id);
  if (!item) return reply.code(404).send({ error: "Not found" });
  reply.send(item);
};
