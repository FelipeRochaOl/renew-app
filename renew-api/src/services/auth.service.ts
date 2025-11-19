import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function registerUserWithPassword(payload: {
  name: string;
  email: string;
  password: string;
  role?: "worker" | "company" | "admin";
}) {
  const existing = await UserModel.findOne({ email: payload.email });
  if (existing) throw new Error("Email already registered");
  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await UserModel.create({
    name: payload.name,
    email: payload.email,
    role: payload.role || "worker",
    passwordHash,
  });
  return user;
}

export async function loginWithPassword(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user || !user.passwordHash) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");
  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return { token, user };
}

export async function startPasswordRecovery(email: string) {
  const user = await UserModel.findOne({ email });
  if (!user) return; // do not leak existence
  const token = (
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  ).slice(0, 32);
  user.resetToken = token;
  user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30); // 30m
  await user.save();
  // In production, send email with token link. Here we just return the token for testing.
  return { token };
}

export async function completePasswordReset(
  token: string,
  newPassword: string
) {
  const user = await UserModel.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: new Date() },
  });
  if (!user) throw new Error("Invalid or expired token");
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  return true;
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET) as {
    sub: string;
    email: string;
    role: string;
  };
}
