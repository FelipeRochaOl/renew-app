"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionRiskService = void 0;
const professionRisks_1 = require("../data/professionRisks");
class ProfessionRiskService {
    static assess(profession, region) {
        const normalized = profession.trim().toLowerCase();
        const found = professionRisks_1.PROFESSION_RISKS.find((p) => p.profession.trim().toLowerCase() === normalized);
        if (found)
            return found;
        return {
            profession,
            riskLevel: "LOW",
            description: "Não encontrei dados específicos. Em geral, atualizar habilidades digitais e habilidades humanas (comunicação, resolução de problemas) reduz riscos.",
            trends: [
                "Habilidades digitais",
                "Aprendizado contínuo",
                "IA como ferramenta",
            ],
        };
    }
}
exports.ProfessionRiskService = ProfessionRiskService;
