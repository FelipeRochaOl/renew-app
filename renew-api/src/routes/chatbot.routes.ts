import { FastifyPluginAsync } from "fastify";
import {
  chatbotMessage,
  chatbotStream,
} from "../controllers/chatbot.controller";

const routes: FastifyPluginAsync = async (app) => {
  app.post("/message", chatbotMessage);
  app.post("/message/stream", chatbotStream);
  app.get("/message/stream", chatbotStream); // suporte EventSource GET
};

export default routes;
