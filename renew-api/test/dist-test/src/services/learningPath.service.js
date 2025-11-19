"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningPathService = void 0;
const learningPaths_1 = require("../data/learningPaths");
class LearningPathService {
    static list(filters = {}) {
        return learningPaths_1.LEARNING_PATHS.filter((lp) => {
            if (filters.targetProfession &&
                lp.targetProfession.toLowerCase() !==
                    filters.targetProfession.toLowerCase())
                return false;
            if (filters.forCurrentProfession !== undefined &&
                lp.forCurrentProfession !== filters.forCurrentProfession)
                return false;
            if (filters.level && lp.level !== filters.level)
                return false;
            return true;
        });
    }
    static getById(id) {
        return learningPaths_1.LEARNING_PATHS.find((lp) => lp.id === id);
    }
}
exports.LearningPathService = LearningPathService;
