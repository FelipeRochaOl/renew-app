import { FastifyReply, FastifyRequest } from "fastify";
import {
  completePasswordReset,
  loginWithPassword,
  registerUserWithPassword,
  startPasswordRecovery,
} from "../services/auth.service";

export const register = async (
  req: FastifyRequest<{
    Body: {
      name: string;
      email: string;
      password: string;
      role?: "worker" | "company" | "admin";
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const user = await registerUserWithPassword(req.body);
    reply.code(201).send({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (e: any) {
    reply.code(400).send({ error: e.message });
  }
};

export const login = async (
  req: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply
) => {
  try {
    const { token, user } = await loginWithPassword(
      req.body.email,
      req.body.password
    );
    reply.send({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e: any) {
    reply.code(401).send({ error: e.message });
  }
};

export const startReset = async (
  req: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) => {
  try {
    const res = await startPasswordRecovery(req.body.email);
    reply.send({ ok: true, ...(res || {}) });
  } catch (e: any) {
    reply.code(400).send({ error: e.message });
  }
};

export const completeReset = async (
  req: FastifyRequest<{ Body: { token: string; password: string } }>,
  reply: FastifyReply
) => {
  try {
    await completePasswordReset(req.body.token, req.body.password);
    reply.send({ ok: true });
  } catch (e: any) {
    reply.code(400).send({ error: e.message });
  }
};
