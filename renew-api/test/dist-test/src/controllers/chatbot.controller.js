"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotMessage = void 0;
const chatbot_service_1 = require("../services/chatbot.service");
const chatbotMessage = async (req, reply) => {
    const { message } = req.body;
    if (!message)
        return reply.code(400).send({ error: "message is required" });
    const data = await chatbot_service_1.ChatbotService.reply(req.body);
    reply.send(data);
};
exports.chatbotMessage = chatbotMessage;
