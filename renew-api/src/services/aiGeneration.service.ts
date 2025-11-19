import crypto from "node:crypto";
import OpenAI from "openai";
import {
  LearningModule,
  LearningPath,
  ProfessionRisk,
  RiskLevel,
} from "../types/domain";

interface AIProfessionData {
  professionRisk: ProfessionRisk;
  learningPaths: LearningPath[];
}

function generateId(prefix: string) {
  return prefix + "-" + crypto.randomUUID().slice(0, 8);
}

function sanitizeRiskLevel(val: string): RiskLevel {
  const upper = (val || "").toUpperCase();
  return ["LOW", "MEDIUM", "HIGH"].includes(upper)
    ? (upper as RiskLevel)
    : "LOW";
}

function validateModule(raw: any): LearningModule {
  return {
    id: typeof raw.id === "string" ? raw.id : generateId("mod"),
    title: String(raw.title || "Módulo"),
    durationHours:
      typeof raw.durationHours === "number" && raw.durationHours > 0
        ? raw.durationHours
        : 4,
    skills: Array.isArray(raw.skills) ? raw.skills.map(String).slice(0, 8) : [],
    externalLink:
      typeof raw.externalLink === "string" ? raw.externalLink : undefined,
  };
}

function validatePath(raw: any, profession: string): LearningPath {
  return {
    id: typeof raw.id === "string" ? raw.id : generateId("lp"),
    title: String(raw.title || "Trilha"),
    description: String(raw.description || "Trilha gerada automaticamente."),
    targetProfession: String(raw.targetProfession || profession),
    forCurrentProfession: !!raw.forCurrentProfession,
    level: ["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(String(raw.level))
      ? raw.level
      : "BEGINNER",
    modules: Array.isArray(raw.modules)
      ? raw.modules.slice(0, 8).map((m: any) => validateModule(m))
      : [],
  };
}

function fallback(profession: string): AIProfessionData {
  return {
    professionRisk: {
      profession,
      riskLevel: "MEDIUM",
      description:
        "Dados gerados genericamente. Requalificação e atualização digital são recomendadas.",
      trends: ["Digitalização", "Automação", "Uso de IA"],
    },
    learningPaths: [
      {
        id: generateId("lp"),
        title: "Fundamentos e Atualização",
        description:
          "Habilidades essenciais e digitais para manter relevância.",
        targetProfession: profession,
        forCurrentProfession: true,
        level: "BEGINNER",
        modules: [
          {
            id: generateId("mod"),
            title: "Ferramentas Digitais Básicas",
            durationHours: 6,
            skills: ["Produtividade", "Colaboração"],
          },
        ],
      },
    ],
  };
}

export class AIGenerationService {
  static async generateProfessionData(
    profession: string
  ): Promise<AIProfessionData> {
    if (!process.env.GROQ_API_KEY) {
      return fallback(profession);
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const prompt = `Gere JSON puro com informações para a profissão "${profession}". Formato exato:\n{\n  \"professionRisk\": {\n    \"profession\": \"${profession}\",\n    \"riskLevel\": "LOW|MEDIUM|HIGH",\n    \"description\": \"texto objetivo em português\",\n    \"trends\": ["tendência 1", "tendência 2", "tendência 3"]\n  },\n  \"learningPaths\": [\n    {\n      \"id\": "string",\n      \"title\": "string",\n      \"description\": "string",\n      \"targetProfession\": "${profession}",\n      \"forCurrentProfession\": true,\n      \"level\": "BEGINNER|INTERMEDIATE|ADVANCED",\n      \"modules\": [\n        { \"id\": "string", \"title\": "string", \"durationHours\": number, \"skills\": ["skill"], \"externalLink\": "(opcional)" }\n      ]\n    },\n    {\n      \"id\": "string",\n      \"title\": "string",\n      \"description\": "string",\n      \"targetProfession\": "${profession}",\n      \"forCurrentProfession\": false,\n      \"level\": "BEGINNER|INTERMEDIATE|ADVANCED",\n      \"modules\": [\n        { \"id\": "string", \"title\": "string", \"durationHours\": number, \"skills\": ["skill"], \"externalLink\": "(opcional)" }\n      ]\n    }\n  ]\n}\nRegras: responda SOMENTE o JSON. Não inclua comentários, explicações ou bloco markdown.`;

    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "Você gera apenas JSON válido conforme o esquema pedido.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      });

      const raw = completion.choices?.[0]?.message?.content?.trim() || "";
      const jsonTextMatch = raw.match(/\{[\s\S]*\}/);
      const jsonText = jsonTextMatch ? jsonTextMatch[0] : raw;

      let parsed: any;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        return fallback(profession);
      }

      if (!parsed || typeof parsed !== "object") return fallback(profession);
      const pr = parsed.professionRisk || {};
      const lpArr = Array.isArray(parsed.learningPaths)
        ? parsed.learningPaths
        : [];

      const professionRisk: ProfessionRisk = {
        profession: profession,
        riskLevel: sanitizeRiskLevel(pr.riskLevel),
        description: String(pr.description || ""),
        trends: Array.isArray(pr.trends)
          ? pr.trends.map(String).slice(0, 10)
          : [],
      };

      const learningPaths: LearningPath[] = lpArr
        .slice(0, 6)
        .map((p: any) => validatePath(p, profession));

      return { professionRisk, learningPaths };
    } catch (err) {
      console.error("Erro IA geração profissão:", err);
      return fallback(profession);
    }
  }
}
