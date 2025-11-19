// Shared helpers for E2E tests
import type { FastifyInstance } from "fastify";
import * as test from "node:test";
import buildTestServer from "../src/testServer";

export type TestContext = {
  after: typeof test.after;
};

export async function build(t: TestContext): Promise<FastifyInstance> {
  const app = buildTestServer();
  t.after(() => void app.close());
  return app;
}

export const config = () => ({ skipOverride: true });
