import { FastifyReply, FastifyRequest } from "fastify";
import { ProfessionRiskService } from "../services/professionRisk.service";

interface AssessBody {
  userId?: string;
  profession: string;
  region?: string;
}

export const assessProfessionRisk = async (
  req: FastifyRequest<{ Body: AssessBody }>,
  reply: FastifyReply
) => {
  const { profession, region } = req.body;
  if (!profession)
    return reply.code(400).send({ error: "profession is required" });
  const risk = await ProfessionRiskService.assess(profession, region);
  reply.send(risk);
};
