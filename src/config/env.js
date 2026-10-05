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
  port: Number(getEnv("PORT", "5000")),
  nodeEnv: getEnv("NODE_ENV", "development"),

  // ONE spreadsheet ID
  googleSpreadsheetId: getEnv("GOOGLE_SPREADSHEET_ID"),

  // 4 tab names inside that spreadsheet
  googleSheetDay1Name: getEnv("GOOGLE_SHEET_DAY1_NAME", "Day 1"),
  googleSheetDay2Name: getEnv("GOOGLE_SHEET_DAY2_NAME", "Day 2"),
  googleSheetDay3Name: getEnv("GOOGLE_SHEET_DAY3_NAME", "Day 3"),
  googleSheetCommitteeName: getEnv("GOOGLE_SHEET_COMMITTEE_NAME", "Committee"),

  googleSheetRange: getEnv("GOOGLE_SHEET_RANGE", "A:Z"),
  googleServiceAccountPath: getEnv(
    "GOOGLE_SERVICE_ACCOUNT_PATH",
    "./credentials/service-account.json",
  ),
  rateLimitWindowMs: Number(getEnv("RATE_LIMIT_WINDOW_MS", "900000")),
  rateLimitMax: Number(getEnv("RATE_LIMIT_MAX", "100")),
});

module.exports = env;
