"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chatbot_controller_1 = require("../controllers/chatbot.controller");
const routes = async (app) => {
    app.post("/message", chatbot_controller_1.chatbotMessage);
};
exports.default = routes;
