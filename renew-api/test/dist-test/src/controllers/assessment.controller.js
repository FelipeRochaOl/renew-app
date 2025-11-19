"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessProfessionRisk = void 0;
const professionRisk_service_1 = require("../services/professionRisk.service");
const assessProfessionRisk = async (req, reply) => {
    const { profession, region } = req.body;
    if (!profession)
        return reply.code(400).send({ error: "profession is required" });
    const risk = professionRisk_service_1.ProfessionRiskService.assess(profession, region);
    reply.send(risk);
};
exports.assessProfessionRisk = assessProfessionRisk;
