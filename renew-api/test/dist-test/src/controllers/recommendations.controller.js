"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forUser = void 0;
const recommendation_service_1 = require("../services/recommendation.service");
const forUser = async (req, reply) => {
    try {
        const data = await recommendation_service_1.RecommendationService.forUser(req.params.userId);
        reply.send(data);
    }
    catch (err) {
        reply.code(400).send({ error: err.message });
    }
};
exports.forUser = forUser;
