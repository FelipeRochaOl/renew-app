"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const learningPath_service_1 = require("./learningPath.service");
const professionRisk_service_1 = require("./professionRisk.service");
const intentKeywords = {
    ASSESS_PROFESSION: [
        "avaliar profissão",
        "minha profissão",
        "profissão vai acabar",
        "segurança de shopping",
    ],
    SEE_PATHS: ["ver trilhas", "trilhas", "opções de curso", "mostrar trilhas"],
    CAREER_FUTURE: ["meu futuro no trabalho", "futuro do trabalho"],
    CHANGE_CAREER: ["mudar de área", "quero mudar de área", "transição"],
    WHAT_COURSE: ["qual curso devo", "curso devo fazer", "curso recomendado"],
    UNKNOWN: [],
};
function detectIntent(message) {
    const text = message.toLowerCase();
    for (const intent of Object.keys(intentKeywords)) {
        if (intent === "UNKNOWN")
            continue;
        const terms = intentKeywords[intent];
        if (terms.some((t) => text.includes(t)))
            return intent;
    }
    return "UNKNOWN";
}
function extractProfession(message) {
    const lower = message.toLowerCase();
    const known = [
        "segurança de shopping",
        "operador de cftv",
        "motorista de entrega",
        "caixa de supermercado",
    ];
    const found = known.find((k) => lower.includes(k));
    if (found) {
        return found
            .split(" ")
            .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w))
            .join(" ");
    }
    return undefined;
}
class ChatbotService {
    static async reply(payload) {
        const { message } = payload;
        const intent = detectIntent(message);
        switch (intent) {
            case "ASSESS_PROFESSION": {
                const profession = extractProfession(message) || "Profissão informada pelo usuário";
                const risk = professionRisk_service_1.ProfessionRiskService.assess(profession);
                const reply = `Posso te ajudar com isso! Vou analisar a profissão '${risk.profession}' e te mostrar como está o cenário atual.\n\n${risk.description}`;
                return { reply, intent, data: risk };
            }
            case "SEE_PATHS": {
                const paths = learningPath_service_1.LearningPathService.list();
                const reply = "Encontrei trilhas que podem te ajudar na transição ou atualização. Quer ver opções de atualização ou de mudança de área?";
                return { reply, intent, data: { paths } };
            }
            case "CHANGE_CAREER": {
                const paths = learningPath_service_1.LearningPathService.list({ forCurrentProfession: false });
                const reply = "Legal! Posso sugerir trilhas para transição de carreira. Veja algumas opções e me diga quais fazem sentido para você.";
                return { reply, intent, data: { paths } };
            }
            case "WHAT_COURSE": {
                const reply = "Para te indicar cursos, me diga sua profissão atual e o que você gostaria de aprender (ex.: redes, suporte técnico, monitoramento).";
                return { reply, intent };
            }
            case "CAREER_FUTURE": {
                const reply = "As mudanças trazem novas oportunidades. Podemos avaliar sua profissão, entender tendências e montar uma trilha personalizada para você.";
                return { reply, intent };
            }
            case "UNKNOWN":
            default: {
                const reply = "Estou aqui para te ajudar com sua carreira. Posso analisar sua profissão, sugerir trilhas de aprendizado ou indicar cursos. Como posso te apoiar hoje?";
                return { reply, intent: "UNKNOWN" };
            }
        }
    }
}
exports.ChatbotService = ChatbotService;
