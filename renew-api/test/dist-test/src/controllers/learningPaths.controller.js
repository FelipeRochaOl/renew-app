"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLearningPath = exports.listLearningPaths = void 0;
const learningPath_service_1 = require("../services/learningPath.service");
const listLearningPaths = async (req, reply) => {
    const { targetProfession, forCurrentProfession, level } = req.query;
    const filters = {};
    if (targetProfession)
        filters.targetProfession = targetProfession;
    if (forCurrentProfession !== undefined)
        filters.forCurrentProfession = ["1", "true", "yes"].includes(String(forCurrentProfession).toLowerCase());
    if (level)
        filters.level = level;
    const data = learningPath_service_1.LearningPathService.list(filters);
    reply.send(data);
};
exports.listLearningPaths = listLearningPaths;
const getLearningPath = async (req, reply) => {
    const item = learningPath_service_1.LearningPathService.getById(req.params.id);
    if (!item)
        return reply.code(404).send({ error: "Not found" });
    reply.send(item);
};
exports.getLearningPath = getLearningPath;
