import { LearningPathModel } from "../models/learningPath.model";
import { ProfessionRiskModel } from "../models/professionRisk.model";
import { ProfessionRisk } from "../types/domain";
import { AIGenerationService } from "./aiGeneration.service";

export class ProfessionRiskService {
  static async assess(
    profession: string,
    _region?: string
  ): Promise<ProfessionRisk> {
    const normalized = profession.trim().toLowerCase();

    // Try existing stored risk
    const existing = await ProfessionRiskModel.findOne({
      profession: { $regex: new RegExp(`^${normalized}$`, "i") },
    }).exec();
    if (existing) {
      return {
        profession: existing.profession,
        riskLevel: existing.riskLevel,
        description: existing.description,
        trends: existing.trends,
      };
    }

    // Generate via AI and persist
    const generated = await AIGenerationService.generateProfessionData(
      profession
    );

    // Persist ProfessionRisk
    try {
      await ProfessionRiskModel.create(generated.professionRisk);
    } catch (err) {
      // Unique race condition: ignore duplicate insert
      if (!(err as any).message?.includes("duplicate")) {
        console.warn("Falha ao salvar ProfessionRisk:", err);
      }
    }

    // Persist LearningPaths (skip if any id duplicates)
    for (const lp of generated.learningPaths) {
      try {
        const existsLP = await LearningPathModel.findOne({ id: lp.id }).exec();
        if (!existsLP) await LearningPathModel.create(lp);
      } catch (err) {
        console.warn("Falha ao salvar LearningPath gerado:", err);
      }
    }

    return generated.professionRisk;
  }
}
