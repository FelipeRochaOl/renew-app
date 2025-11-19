import { LearningPath, ProfessionRisk } from "../types/domain";
import { LearningPathService } from "./learningPath.service";
import { ProfessionRiskService } from "./professionRisk.service";
import { UserService } from "./user.service";

export class RecommendationService {
  static async forUser(userId: string): Promise<{
    user: any;
    professionRisk: ProfessionRisk;
    suggestedPaths: LearningPath[];
  }> {
    const user = await UserService.getUserById(userId);
    if (!user) throw new Error("User not found");

    const profession = user.currentProfession || "Profissão não informada";
    const professionRisk = await ProfessionRiskService.assess(
      profession,
      user.region || undefined
    );

    // Estratégia simples: se risco MEDIUM/HIGH, incluir atualização e transição;
    // se LOW, focar em atualização na própria profissão.
    const updatePaths = await LearningPathService.list({
      targetProfession: profession,
      forCurrentProfession: true,
    });

    let transitionPaths: LearningPath[] = [];
    if (professionRisk.riskLevel !== "LOW") {
      const allTransitions = await LearningPathService.list({
        forCurrentProfession: false,
      });
      transitionPaths = allTransitions.filter(
        (lp) => lp.targetProfession.toLowerCase() !== profession.toLowerCase()
      );
    }

    const suggestedPaths = [...updatePaths, ...transitionPaths].slice(0, 6);

    return { user, professionRisk, suggestedPaths };
  }
}
