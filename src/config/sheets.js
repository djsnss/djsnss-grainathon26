const env = require("./env");

const sheetsConfig = Object.freeze({
  spreadsheetId: env.googleSpreadsheetId,

  day1: {
    sheetName: env.googleSheetDay1Name,
    range: `${env.googleSheetDay1Name}!${env.googleSheetRange}`,
  },
  day2: {
    sheetName: env.googleSheetDay2Name,
    range: `${env.googleSheetDay2Name}!${env.googleSheetRange}`,
  },
  day3: {
    sheetName: env.googleSheetDay3Name,
    range: `${env.googleSheetDay3Name}!${env.googleSheetRange}`,
  },
  committee: {
    sheetName: env.googleSheetCommitteeName,
    range: `${env.googleSheetCommitteeName}!${env.googleSheetRange}`,
  },
});

module.exports = sheetsConfig;
