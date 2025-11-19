"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assessment_controller_1 = require("../controllers/assessment.controller");
const routes = async (app) => {
    app.post("/profession-risk", assessment_controller_1.assessProfessionRisk);
};
exports.default = routes;
