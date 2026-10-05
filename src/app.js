const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");
const routes = require("./routes/index");
const errorHandler = require("./middleware/error-handler");
const logger = require("./utils/logger");

const app = express();

// ─── Security & Performance ────────────────────────────────────

app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    statusCode: 429,
    message: "Too many requests — try again later.",
  },
});
app.use("/api", limiter);

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Request logging in dev
if (env.nodeEnv === "development") {
  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── Routes ────────────────────────────────────────────────────

app.use("/api", routes);

// 404
app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    statusCode: 404,
    message: `Cannot find ${req.originalUrl} on this server.`,
  });
});

// Error handler — must be LAST
app.use(errorHandler);

logger.info(`App initialized in ${env.nodeEnv} mode`);

module.exports = app;
