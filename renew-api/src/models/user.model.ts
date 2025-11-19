import { Document, Schema, model } from "mongoose";
import { UserRole } from "../types/domain";

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  passwordHash?: string;
  resetToken?: string;
  resetTokenExpires?: Date;
  currentProfession?: string;
  region?: string;
  educationLevel?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      enum: ["worker", "company", "admin"],
      default: "worker",
    },
    passwordHash: { type: String },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
    currentProfession: { type: String },
    region: { type: String },
    educationLevel: { type: String },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);
