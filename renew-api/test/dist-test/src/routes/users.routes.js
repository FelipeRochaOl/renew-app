"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = require("../controllers/users.controller");
const routes = async (app) => {
    app.post("/", users_controller_1.createUser);
    app.get("/:id", users_controller_1.getUser);
};
exports.default = routes;
