import { Document, Schema, model } from "mongoose";
import { LearningLevel, LearningModule } from "../types/domain";

export type ILearningModule = LearningModule;

export interface ILearningPath extends Document {
  id: string;
  title: string;
  description: string;
  targetProfession: string;
  forCurrentProfession: boolean;
  level: LearningLevel;
  modules: ILearningModule[];
}

const LearningModuleSchema = new Schema<ILearningModule>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  durationHours: { type: Number, required: true },
  skills: [{ type: String, required: true }],
  externalLink: { type: String },
});

const LearningPathSchema = new Schema<ILearningPath>(
  {
    id: { type: String, required: true, unique: true, index: true },
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
  },
  { timestamps: true }
);

export const LearningPathModel = model<ILearningPath>(
  "LearningPath",
  LearningPathSchema
);
