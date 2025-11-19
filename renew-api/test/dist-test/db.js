"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTestDB = setupTestDB;
exports.teardownTestDB = teardownTestDB;
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
let mongod = null;
async function setupTestDB() {
    mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose_1.default.connect(uri);
}
async function teardownTestDB() {
    await mongoose_1.default.disconnect();
    if (mongod) {
        await mongod.stop();
        mongod = null;
    }
}
