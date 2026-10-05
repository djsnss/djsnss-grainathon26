const logger = require("../utils/logger");

const errorHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let status = "error";
  let message = "Something went wrong";

  if (err.isOperational) {
    statusCode = err.statusCode;
    status = err.status || "fail";
    message = err.message;
  }

  if (statusCode >= 500) {
    logger.error("Unhandled error", { error: err.message, stack: err.stack });
  } else {
    logger.warn(`Operational error: ${message}`, { statusCode });
  }

  const response = { status, statusCode, message };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
