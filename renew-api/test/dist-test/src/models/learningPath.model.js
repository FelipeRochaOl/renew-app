"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningPathModel = void 0;
const mongoose_1 = require("mongoose");
const LearningModuleSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    durationHours: { type: Number, required: true },
    skills: [{ type: String, required: true }],
    externalLink: { type: String },
});
const LearningPathSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetProfession: { type: String, required: true },
    forCurrentProfession: { type: Boolean, required: true },
    level: {
        type: String,
        enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
        required: true,
    },
    modules: { type: [LearningModuleSchema], default: [] },
}, { timestamps: true });
exports.LearningPathModel = (0, mongoose_1.model)("LearningPath", LearningPathSchema);
