"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const learningPath_service_1 = require("./learningPath.service");
const professionRisk_service_1 = require("./professionRisk.service");
const user_service_1 = require("./user.service");
class RecommendationService {
    static async forUser(userId) {
        const user = await user_service_1.UserService.getUserById(userId);
        if (!user)
            throw new Error("User not found");
        const profession = user.currentProfession || "Profissão não informada";
        const professionRisk = professionRisk_service_1.ProfessionRiskService.assess(profession, user.region || undefined);
        const updatePaths = learningPath_service_1.LearningPathService.list({
            targetProfession: profession,
            forCurrentProfession: true,
        });
        let transitionPaths = [];
        if (professionRisk.riskLevel !== "LOW") {
            transitionPaths = learningPath_service_1.LearningPathService.list({
                forCurrentProfession: false,
            }).filter((lp) => lp.targetProfession.toLowerCase() !== profession.toLowerCase());
        }
        const suggestedPaths = [...updatePaths, ...transitionPaths].slice(0, 6);
        return { user, professionRisk, suggestedPaths };
    }
}
exports.RecommendationService = RecommendationService;
