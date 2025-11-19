"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.createUser = void 0;
const user_service_1 = require("../services/user.service");
const createUser = async (req, reply) => {
    try {
        const user = await user_service_1.UserService.createUser(req.body);
        reply.code(201).send(user);
    }
    catch (err) {
        reply.code(400).send({ error: err.message });
    }
};
exports.createUser = createUser;
const getUser = async (req, reply) => {
    try {
        const user = await user_service_1.UserService.getUserById(req.params.id);
        if (!user)
            return reply.code(404).send({ error: "User not found" });
        reply.send(user);
    }
    catch (err) {
        reply.code(400).send({ error: err.message });
    }
};
exports.getUser = getUser;
