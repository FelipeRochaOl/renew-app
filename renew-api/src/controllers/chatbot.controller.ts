import { FastifyReply, FastifyRequest } from "fastify";
import { ChatbotService } from "../services/chatbot.service";

interface ChatBody {
  userId?: string;
  message: string;
}

export const chatbotMessage = async (
  req: FastifyRequest<{ Body: ChatBody }>,
  reply: FastifyReply
) => {
  const { message } = req.body;
  if (!message) return reply.code(400).send({ error: "message is required" });
  const data = await ChatbotService.reply(req.body);
  reply.send(data);
};

interface ChatQuery {
  userId?: string;
  message?: string;
}

export const chatbotStream = async (
  req: FastifyRequest<{ Body: ChatBody; Querystring: ChatQuery }>,
  reply: FastifyReply
) => {
  const isGet = req.method === "GET";
  const msg = isGet ? req.query.message : req.body?.message;
  const userId = isGet ? req.query.userId : req.body?.userId;

  if (!msg) {
    reply.code(400);
    reply.headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    reply.raw.write(
      `data: ${JSON.stringify({ error: "message is required" })}\n\n`
    );
    return reply.raw.end();
  }

  if (!userId) {
    reply.code(400);
    reply.headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    reply.raw.write(
      `data: ${JSON.stringify({ error: "userId is required" })}\n\n`
    );
    return reply.raw.end();
  }

  reply.headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  reply.raw.write("retry: 1000\n\n");

  try {
    await ChatbotService.streamReply({ message: msg, userId }, (chunk) => {
      reply.raw.write(`data: ${chunk}\n\n`);
    });
  } catch (e) {
    reply.raw.write(`data: ${JSON.stringify({ error: "stream_failed" })}\n\n`);
  } finally {
    reply.raw.end();
  }
};
