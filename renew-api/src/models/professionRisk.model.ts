import { Document, Schema, model } from "mongoose";
import { RiskLevel } from "../types/domain";

export interface IProfessionRisk extends Document {
  profession: string;
  riskLevel: RiskLevel;
  description: string;
  trends: string[];
}

const ProfessionRiskSchema = new Schema<IProfessionRisk>(
  {
    profession: { type: String, required: true, unique: true, index: true },
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },
    description: { type: String, required: true },
    trends: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const ProfessionRiskModel = model<IProfessionRisk>(
  "ProfessionRisk",
  ProfessionRiskSchema
);
