import OpenAI from "openai";
import { UserService } from "./user.service";

export class ChatbotService {
  static async reply(payload: { userId?: string; message: string }) {
    const { message } = payload;

    if (!message || message.trim().length === 0) {
      return {
        reply: "Por favor, envie uma mensagem válida para que eu possa ajudar.",
        intent: "INVALID_INPUT" as const,
      };
    }

    if (!process.env.GROQ_API_KEY) {
      return {
        reply:
          "O serviço de IA não está disponível no momento. Por favor, tente novamente mais tarde.",
        intent: "SERVICE_UNAVAILABLE" as const,
      };
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    let profileText = "";
    if (payload.userId) {
      try {
        const user = await UserService.getUserById(payload.userId);
        if (user) {
          profileText = `Usuário: ${user.name || "-"} | Profissão atual: ${
            user.currentProfession || "-"
          } | Região: ${user.region || "-"} | Escolaridade: ${
            user.educationLevel || "-"
          }`;
        }
      } catch {}
    }

    const systemPrompt = [
      "Você é o mentor de IA do RenovarApp.",
      "Ajude o usuário a entender o risco da profissão, tendências e possíveis trilhas de requalificação.",
      "Seja acolhedor e direto. Responda em português brasileiro.",
      "Quando fizer sentido, sugira trilhas genéricas (ex.: CFTV, redes, suporte técnico, monitoramento) sem inventar links.",
      "Se o usuário pedir avaliação de profissão, explique riscos e tendências de forma simples.",
    ].join(" \n");

    const userPrompt = [
      profileText ? `Contexto do perfil: ${profileText}` : undefined,
      `Mensagem do usuário: ${message}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      });

      const reply =
        completion.choices?.[0]?.message?.content?.trim() ||
        "Consegui processar sua mensagem. Como posso te ajudar mais?";
      return { reply, intent: "AI_REPLY" as const };
    } catch (err) {
      // Tratamento específico para erro de quota ou modelo inválido
      const status = (err as any)?.status;
      const code = (err as any)?.error?.code;
      const message = (err as any)?.message || (err as any)?.error?.message;
      if (status === 400 && /model/i.test(message || "")) {
        return {
          reply:
            "Modelo inválido para o provedor atual. Verifique se o nome está correto ou remova o prefixo 'openai/' se estiver usando Groq. Modelo atual: " +
            model,
          intent: "INVALID_MODEL" as const,
        };
      }
      if (status === 429 && code === "insufficient_quota") {
        console.warn("Quota excedida ao chamar OpenAI:", {
          status,
          code,
          message,
        });
        return {
          reply:
            "Atingimos o limite de uso do modelo de IA no momento. Por favor, tente novamente em alguns minutos. Enquanto isso posso oferecer orientações gerais sobre trilhas e riscos de profissões. Deseja continuar?",
          intent: "QUOTA_EXCEEDED" as const,
        };
      }
      console.error("Erro ao chamar OpenAI:", {
        status,
        code,
        message,
        raw: err,
      });
      // Fallback em caso de erro genérico de API
      const reply =
        "Estou com dificuldades para acessar o meu modelo de IA agora. Podemos continuar com orientações gerais: posso analisar sua profissão com base em dados pré-definidos e sugerir trilhas. O que você prefere fazer?";
      return { reply, intent: "FALLBACK" as const };
    }
  }

  static async streamReply(
    payload: { userId: string; message: string },
    onChunk: (text: string) => void
  ) {
    const { message } = payload;
    if (!message || message.trim().length === 0) {
      onChunk(
        JSON.stringify({
          intent: "INVALID_INPUT",
          reply:
            "Por favor, envie uma mensagem válida para que eu possa ajudar.",
        })
      );
      return;
    }
    if (!process.env.GROQ_API_KEY) {
      onChunk(
        JSON.stringify({
          intent: "SERVICE_UNAVAILABLE",
          reply:
            "O serviço de IA não está disponível no momento. Por favor, tente novamente mais tarde.",
        })
      );
      return;
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    let profileText = "";
    if (payload.userId) {
      try {
        const user = await UserService.getUserById(payload.userId);
        if (user) {
          profileText = `Usuário: ${user.name || "-"} | Profissão atual: ${
            user.currentProfession || "-"
          } | Região: ${user.region || "-"} | Escolaridade: ${
            user.educationLevel || "-"
          }`;
        }
      } catch {}
    }

    const systemPrompt = [
      "Você é o mentor de IA do RenovarApp.",
      "Ajude o usuário a entender o risco da profissão, tendências e possíveis trilhas de requalificação.",
      "Seja acolhedor e direto. Responda em português brasileiro.",
      "Quando fizer sentido, sugira trilhas genéricas (ex.: CFTV, redes, suporte técnico, monitoramento) sem inventar links.",
      "Se o usuário pedir avaliação de profissão, explique riscos e tendências de forma simples.",
    ].join(" \n");

    const userPrompt = [
      profileText ? `Contexto do perfil: ${profileText}` : undefined,
      `Mensagem do usuário: ${message}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        stream: true,
      });

      for await (const part of completion as any) {
        const delta = part.choices?.[0]?.delta?.content;
        if (delta) {
          onChunk(JSON.stringify({ token: delta }));
        }
      }
      onChunk(JSON.stringify({ done: true, intent: "AI_REPLY" }));
    } catch (err) {
      const status = (err as any)?.status;
      const code = (err as any)?.error?.code;
      const messageErr =
        (err as any)?.message || (err as any)?.error?.message || "Erro";
      if (status === 400 && /model/i.test(messageErr || "")) {
        onChunk(
          JSON.stringify({
            intent: "INVALID_MODEL",
            reply:
              "Modelo inválido para o provedor atual. Ajuste OPENAI_MODEL ou remova prefixo 'openai/' se quiser usar Groq.",
            error: messageErr,
          })
        );
        onChunk(JSON.stringify({ done: true }));
        return;
      }
      if (status === 429 && code === "insufficient_quota") {
        onChunk(
          JSON.stringify({
            intent: "QUOTA_EXCEEDED",
            reply:
              "Atingimos o limite de uso do modelo de IA no momento. Por favor, tente novamente em alguns minutos.",
            error: messageErr,
          })
        );
        onChunk(JSON.stringify({ done: true }));
        return;
      }
      onChunk(
        JSON.stringify({
          intent: "FALLBACK",
          reply:
            "Estou com dificuldades para acessar o modelo de IA agora. Podemos continuar com orientações gerais.",
          error: messageErr,
        })
      );
      onChunk(JSON.stringify({ done: true }));
    }
  }
}
