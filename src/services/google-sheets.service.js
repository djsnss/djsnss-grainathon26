const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const env = require("../config/env");
const logger = require("../utils/logger");
const AppError = require("../utils/app-error");

class GoogleSheetsService {
  constructor() {
    try {
      const credPath = path.resolve(env.googleServiceAccountPath);
      const credentials = JSON.parse(fs.readFileSync(credPath, "utf-8"));

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      });

      this.sheets = google.sheets({ version: "v4", auth });
      this.spreadsheetId = env.googleSpreadsheetId;

      logger.info("✅ Google Sheets service authenticated successfully");
    } catch (error) {
      logger.error("❌ Google Sheets auth failed", {
        error: error.message,
      });
      throw new AppError("Google Sheets authentication failed", 500, false);
    }
  }

  /**
   * Fetch data from one tab of the spreadsheet.
   * @param {string} range - e.g. "Day 1!A:Z"
   * @returns {Promise<string[][]>}
   */
  async getSheetData(range) {
    try {
      logger.debug(`Fetching range: ${range}`);

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });

      const rows = response.data.values;

      if (!rows || rows.length === 0) {
        logger.warn(`No data found for range: ${range}`);
        return [];
      }

      logger.debug(`Fetched ${rows.length} rows from range: ${range}`);
      return rows;
    } catch (error) {
      logger.error(`Error fetching range: ${range}`, {
        error: error.message,
      });
      throw new AppError("Failed to fetch data from Google Sheets", 500, true);
    }
  }
}

let instance = null;

const getGoogleSheetsService = () => {
  if (!instance) {
    instance = new GoogleSheetsService();
  }
  return instance;
};

module.exports = getGoogleSheetsService();
