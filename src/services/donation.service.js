const googleSheetsService = require("./google-sheets.service");
const sheetsConfig = require("../config/sheets");
const env = require("../config/env");
const logger = require("../utils/logger");
const AppError = require("../utils/app-error");

class DonationService {
  buildDefaultDepartmentMap() {
    const map = {};
    for (const dept of env.defaultDepartments) {
      map[dept] = 0;
    }
    return map;
  }

  findColumnIndex(headerRow, expectedName) {
    if (!headerRow || headerRow.length === 0) return -1;
    return headerRow.findIndex(
      (col) => col.trim().toLowerCase() === expectedName.trim().toLowerCase(),
    );
  }

  parseDayRows(rows) {
    const result = this.buildDefaultDepartmentMap();

    if (!rows || rows.length <= 1) return result;

    const headerRow = rows[0];
    const deptIdx = this.findColumnIndex(headerRow, env.departmentColumn);
    const qtyIdx = this.findColumnIndex(headerRow, env.quantityColumn);

    if (deptIdx === -1 || qtyIdx === -1) {
      logger.warn(
        `Column headers not found. Expected: "${env.departmentColumn}" and "${env.quantityColumn}". Found: ${JSON.stringify(headerRow)}`,
      );
      return result;
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const name = row[deptIdx]?.trim().toUpperCase();
      const amount = parseFloat(row[qtyIdx]);

      if (name && !isNaN(amount) && amount >= 0) {
        result[name] = (result[name] || 0) + amount;
      }
    }

    return result;
  }

  parseCommitteeRows(rows) {
    const result = {
      committeesByDept: {},
      allCommittees: {},
    };

    if (!rows || rows.length <= 1) return result;

    const headerRow = rows[0];
    const deptIdx = this.findColumnIndex(headerRow, env.departmentColumn);
    const commIdx = this.findColumnIndex(headerRow, env.committeeColumn);
    const qtyIdx = this.findColumnIndex(headerRow, env.quantityColumn);

    if (deptIdx === -1 || commIdx === -1 || qtyIdx === -1) {
      logger.warn(
        `Column headers not found in committee sheet. Expected: "${env.departmentColumn}", "${env.committeeColumn}", "${env.quantityColumn}". Found: ${JSON.stringify(headerRow)}`,
      );
      return result;
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const deptName = row[deptIdx]?.trim().toUpperCase();
      const commName = row[commIdx]?.trim();
      const amount = parseFloat(row[qtyIdx]);

      if (!deptName || !commName || isNaN(amount) || amount < 0) continue;

      if (!result.committeesByDept[deptName]) {
        result.committeesByDept[deptName] = {};
      }
      result.committeesByDept[deptName][commName] =
        (result.committeesByDept[deptName][commName] || 0) + amount;

      result.allCommittees[commName] =
        (result.allCommittees[commName] || 0) + amount;
    }

    return result;
  }

  async getDayData(day) {
    const configMap = {
      1: sheetsConfig.day1,
      2: sheetsConfig.day2,
      3: sheetsConfig.day3,
    };

    const config = configMap[day];
    if (!config) {
      throw new AppError("Invalid day. Must be 1, 2, or 3.", 400);
    }

    const rows = await googleSheetsService.getSheetData(config.range);
    const data = this.parseDayRows(rows);

    logger.info(`Day ${day} data fetched successfully`);

    return data;
  }

  async getCommitteeData() {
    const config = sheetsConfig.committee;
    const rows = await googleSheetsService.getSheetData(config.range);
    const { allCommittees, committeesByDept } = this.parseCommitteeRows(rows);

    logger.info("Committee data fetched successfully");

    return (allCommittees, committeesByDept);
  }

  async getAggregatedDepartments() {
    const [day1, day2, day3] = await Promise.all([
      this.getDayData(1),
      this.getDayData(2),
      this.getDayData(3),
    ]);

    const totalDepartments = this.buildDefaultDepartmentMap();

    for (const dayData of [day1, day2, day3]) {
      for (const [dept, amount] of Object.entries(dayData)) {
        totalDepartments[dept] = (totalDepartments[dept] || 0) + amount;
      }
    }

    const config = sheetsConfig.committee;
    const committeeRows = await googleSheetsService.getSheetData(config.range);
    const { committeesByDept } = this.parseCommitteeRows(committeeRows);

    for (const [dept, committees] of Object.entries(committeesByDept)) {
      const committeeTotal = Object.values(committees).reduce(
        (sum, qty) => sum + qty,
        0,
      );
      totalDepartments[dept] = (totalDepartments[dept] || 0) + committeeTotal;
    }

    return { totalDepartments, committeesByDept };
  }

  async getTotalData() {
    const { totalDepartments } = await this.getAggregatedDepartments();

    logger.info("Total data fetched successfully");

    return totalDepartments;
  }

  async getWinningData() {
    const { totalDepartments, committeesByDept } =
      await this.getAggregatedDepartments();

    let winningDeptName = "";
    let winningDeptAmount = 0;

    for (const [name, amount] of Object.entries(totalDepartments)) {
      if (amount > winningDeptAmount) {
        winningDeptName = name;
        winningDeptAmount = amount;
      }
    }

    const winningCommittees = committeesByDept[winningDeptName] || {};

    const result = {
      department: {
        name: winningDeptName,
        quantity: winningDeptAmount,
      },
      committees: winningCommittees,
    };

    logger.info(
      `🏆 Winning → Dept: ${result.department.name} (${result.department.quantity} kg) with ${Object.keys(result.committees).length} committees`,
    );

    return result;
  }
}

module.exports = new DonationService();
