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
      logger.info("✅ Google Sheets service authenticated successfully");
    } catch (error) {
      logger.error("❌ Failed to authenticate Google Sheets service", {
        error: error.message,
      });
      throw new AppError("Google Sheets authentication failed", 500, false);
    }
  }

  /**
   * Fetch raw data from a spreadsheet.
   * Returns a 2D array of strings (rows x columns).
   */
  async getSheetData(spreadsheetId, range) {
    try {
      logger.debug(`Fetching sheet → id: ${spreadsheetId} | range: ${range}`);

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values;

      if (!rows || rows.length === 0) {
        logger.warn(`No data found in sheet: ${spreadsheetId}`);
        return [];
      }

      logger.debug(`Fetched ${rows.length} rows from sheet: ${spreadsheetId}`);
      return rows;
    } catch (error) {
      logger.error(`Error fetching sheet: ${spreadsheetId}`, {
        error: error.message,
      });
      throw new AppError("Failed to fetch data from Google Sheets", 500, true);
    }
  }
}

// Singleton — created once, reused everywhere
let instance = null;

const getGoogleSheetsService = () => {
  if (!instance) {
    instance = new GoogleSheetsService();
  }
  return instance;
};

module.exports = getGoogleSheetsService();
