"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const learningPaths_controller_1 = require("../controllers/learningPaths.controller");
const routes = async (app) => {
    app.get("/", learningPaths_controller_1.listLearningPaths);
    app.get("/:id", learningPaths_controller_1.getLearningPath);
};
exports.default = routes;
