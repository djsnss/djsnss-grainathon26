const app = require("./app");
const env = require("./config/env");
const logger = require("./utils/logger");

const port = env.port;

const server = app.listen(port, () => {
  logger.info(`🚀 Server running on port ${port} [${env.nodeEnv}]`);
  logger.info(`📡 API → http://localhost:${port}/api`);
  logger.info(`❤️  Health → http://localhost:${port}/api/health`);
  logger.info(`📋 Routes:`);
  logger.info(`   GET /api/day/1`);
  logger.info(`   GET /api/day/2`);
  logger.info(`   GET /api/day/3`);
  logger.info(`   GET /api/committee`);
  logger.info(`   GET /api/total`);
  logger.info(`   GET /api/winning`);
});

// ─── Graceful Shutdown ─────────────────────────────────────────

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info("✅ Server closed.");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("⛔ Forced shutdown after 10s.");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error("💥 Unhandled Rejection", { reason });
  gracefulShutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (error) => {
  logger.error("💥 Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});
