"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.build = build;
const testServer_1 = __importDefault(require("../src/testServer"));
async function build(t) {
    const app = (0, testServer_1.default)();
    t.after(() => void app.close());
    return app;
}
const config = () => ({ skipOverride: true });
exports.config = config;
