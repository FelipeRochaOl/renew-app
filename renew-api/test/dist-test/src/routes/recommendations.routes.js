"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recommendations_controller_1 = require("../controllers/recommendations.controller");
const routes = async (app) => {
    app.get("/for-user/:userId", recommendations_controller_1.forUser);
};
exports.default = routes;
