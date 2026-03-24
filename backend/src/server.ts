import "dotenv/config";
import { buildApp } from "./app.js";
import { config } from "./config/index.js";
import { prisma } from "./lib/prisma.js";
import { isPdfAvailable } from "./modules/pdf/pdf.service.js";

async function main() {
  const app = await buildApp();

  // ── Graceful Shutdown ────────────────────────────
  const shutdown = async (signal: string) => {
    app.log.info(`${signal} received — shutting down gracefully`);
    try {
      await app.close();
      await prisma.$disconnect();
      app.log.info("Server stopped");
    } catch (err) {
      app.log.error(err, "Error during shutdown");
    }
    process.exit(0);
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  try {
    await app.listen({ port: config.port, host: "0.0.0.0" });

    app.log.info({
      port: config.port,
      env: config.nodeEnv,
      telegram: config.telegram.enabled,
      smtp: config.smtp.enabled,
      pdf: isPdfAvailable(),
      adminApi: Boolean(config.adminApiKey),
    }, "Backend started");
  } catch (err) {
    app.log.error(err, "Failed to start server");
    process.exit(1);
  }
}

main();
