import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { config } from "./config/index.js";
import { AppError } from "./common/errors.js";
import { errorResponse } from "./common/response.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { leadsRoutes } from "./modules/leads/leads.routes.js";
import { pdfRoutes } from "./modules/pdf/pdf.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: config.isDev
      ? {
          level: "info",
          transport: {
            target: "pino-pretty",
            options: { translateTime: "HH:MM:ss Z", ignore: "pid,hostname" },
          },
        }
      : { level: "info" },
    genReqId: () => crypto.randomUUID(),
  });

  // ── Security Headers ─────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: false, // API-only, не нужен CSP
  });

  // ── CORS ─────────────────────────────────────────
  const corsOrigin = config.isDev
    ? true
    : config.corsOrigins.length > 0
      ? config.corsOrigins
      : [config.baseUrl];

  await app.register(cors, {
    origin: corsOrigin,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });

  // ── Rate Limiting (global fallback) ──────────────
  await app.register(rateLimit, {
    max: 100,
    timeWindow: 60_000,
  });

  // ── Request Logging ──────────────────────────���───
  app.addHook("onResponse", (request, reply, done) => {
    request.log.info(
      { method: request.method, url: request.url, statusCode: reply.statusCode, durationMs: reply.elapsedTime },
      "request completed",
    );
    done();
  });

  // ── Global Error Handler ─────────────────────────
  app.setErrorHandler((error, request, reply) => {
    // Наши бизнес-ошибки
    if (error instanceof AppError) {
      if (error.statusCode >= 500) {
        request.log.error({ err: error, requestId: request.id }, error.message);
      } else {
        request.log.warn({ code: error.code, requestId: request.id }, error.message);
      }
      return reply
        .status(error.statusCode)
        .send(errorResponse(error.code, error.message, error.details));
    }

    // Rate limit (429)
    const fastifyErr = error as { statusCode?: number; message?: string };
    const statusCode = typeof fastifyErr.statusCode === "number"
      ? fastifyErr.statusCode
      : 500;

    if (statusCode === 429) {
      return reply
        .status(429)
        .send(errorResponse("TOO_MANY_REQUESTS", "Слишком много запросов, попробуйте позже"));
    }

    // Ошибки Fastify (парсинг JSON и т.п.)
    if (statusCode < 500) {
      request.log.warn({ statusCode, requestId: request.id }, fastifyErr.message ?? "Client error");
      return reply
        .status(statusCode)
        .send(errorResponse("BAD_REQUEST", fastifyErr.message ?? "Bad request"));
    }

    // Неожиданные ошибки — полный лог
    request.log.error({ err: error, requestId: request.id }, "Unhandled error");
    return reply
      .status(500)
      .send(errorResponse("INTERNAL_ERROR", "Internal server error"));
  });

  // ── Routes ───────────────────────────────────────
  await app.register(healthRoutes, { prefix: "/api" });
  await app.register(leadsRoutes, { prefix: "/api" });
  await app.register(pdfRoutes, { prefix: "/api" });
  await app.register(adminRoutes, { prefix: "/api" });

  return app;
}
