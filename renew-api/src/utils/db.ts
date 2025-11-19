import mongoose from "mongoose";

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 2000;

export const connectToDatabase = async (mongoUrl: string) => {
  if (mongoose.connection.readyState === 1) return;

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      await mongoose.connect(mongoUrl);
      return;
    } catch (err) {
      attempt++;
      const msg = (err as any)?.message || String(err);
      // Basic network DNS error often happens when container starts before mongo hostname resolves
      if (attempt < MAX_RETRIES) {
        console.warn(
          `[DB] Falha ao conectar (tentativa ${attempt}/${MAX_RETRIES}): ${msg}. Retentando em ${RETRY_DELAY_MS}ms...`
        );
        await new Promise((res) => setTimeout(res, RETRY_DELAYMS()));
      } else {
        console.error(`[DB] Erro final ao conectar: ${msg}`);
        throw err;
      }
    }
  }
};

function RETRY_DELAYMS() {
  return RETRY_DELAY_MS;
}
