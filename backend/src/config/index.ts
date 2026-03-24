import { loadEnv } from "./env.js";

const env = loadEnv();

/** Парсит CORS_ORIGIN: пустая строка → [], иначе split(',') → trim */
function parseCorsOrigins(raw: string): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export const config = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  isDev: env.NODE_ENV === "development",
  isProd: env.NODE_ENV === "production",
  baseUrl: env.APP_BASE_URL,

  corsOrigins: parseCorsOrigins(env.CORS_ORIGIN),

  adminApiKey: env.ADMIN_API_KEY || "",

  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
  },

  telegram: {
    enabled: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
    token: env.TELEGRAM_BOT_TOKEN,
    chatId: env.TELEGRAM_CHAT_ID,
  },

  smtp: {
    enabled: Boolean(env.SMTP_HOST && env.SMTP_USER),
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_FROM,
    managerEmail: env.MANAGER_EMAIL,
  },
} as const;
