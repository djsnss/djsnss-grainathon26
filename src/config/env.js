const dotenv = require("dotenv");

dotenv.config();

const getEnv = (key, defaultValue) => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable "${key}" is not set.`);
  }
  return value;
};

const env = Object.freeze({
  port: Number(getEnv("PORT", "3000")),
  nodeEnv: getEnv("NODE_ENV", "development"),
  googleSheetDay1: getEnv("GOOGLE_SHEET_DAY1"),
  googleSheetDay2: getEnv("GOOGLE_SHEET_DAY2"),
  googleSheetDay3: getEnv("GOOGLE_SHEET_DAY3"),
  googleSheetCommittee: getEnv("GOOGLE_SHEET_COMMITTEE"),
  googleSheetRange: getEnv("GOOGLE_SHEET_RANGE", "Sheet1!A:Z"),
  googleServiceAccountPath: getEnv(
    "GOOGLE_SERVICE_ACCOUNT_PATH",
    "./credentials/service-account.json",
  ),
  rateLimitWindowMs: Number(getEnv("RATE_LIMIT_WINDOW_MS", "900000")),
  rateLimitMax: Number(getEnv("RATE_LIMIT_MAX", "100")),
});

module.exports = env;
