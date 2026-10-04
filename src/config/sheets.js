const env = require("./env");

const sheetsConfig = Object.freeze({
  day1: {
    id: env.googleSheetDay1,
    range: env.googleSheetRange,
  },
  day2: {
    id: env.googleSheetDay2,
    range: env.googleSheetRange,
  },
  day3: {
    id: env.googleSheetDay3,
    range: env.googleSheetRange,
  },
  committee: {
    id: env.googleSheetCommittee,
    range: env.googleSheetRange,
  },
});

module.exports = sheetsConfig;
