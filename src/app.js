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

app.use(helmet());
app.use(cors());
app.use(compression());

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

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

if (env.nodeEnv === "development") {
  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.originalUrl}`);
    next();
  });
}

app.use("/api", routes);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    statusCode: 404,
    message: `Cannot find ${req.originalUrl} on this server.`,
  });
});

app.use(errorHandler);

logger.info(`App initialized in ${env.nodeEnv} mode`);

module.exports = app;
