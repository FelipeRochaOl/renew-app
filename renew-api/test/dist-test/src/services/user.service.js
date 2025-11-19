"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
class UserService {
    static async createUser(payload) {
        const user = new user_model_1.UserModel(payload);
        return user.save();
    }
    static async getUserById(id) {
        return user_model_1.UserModel.findById(id).exec();
    }
}
exports.UserService = UserService;
