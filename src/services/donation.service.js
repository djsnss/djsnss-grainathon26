const googleSheetsService = require("./google-sheets.service");
const sheetsConfig = require("../config/sheets");
const logger = require("../utils/logger");
const AppError = require("../utils/app-error");

class DonationService {
  /**
   * Parse department donation rows.
   * Expected sheet format:  Header row → [Department, Amount]
   *                         Data rows  → ["CSE", "5000"]
   */
  parseDepartmentRows(rows) {
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).reduce((acc, row) => {
      const department = row[0]?.trim();
      const amount = parseFloat(row[1]);

      if (department && !isNaN(amount) && amount >= 0) {
        acc.push({ department, amount });
      }
      return acc;
    }, []);
  }

  /**
   * Parse committee donation rows.
   * Expected sheet format:  Header row → [Committee, Amount]
   *                         Data rows  → ["Cultural", "6000"]
   */
  parseCommitteeRows(rows) {
    if (!rows || rows.length <= 1) return [];

    return rows.slice(1).reduce((acc, row) => {
      const committee = row[0]?.trim();
      const amount = parseFloat(row[1]);

      if (committee && !isNaN(amount) && amount >= 0) {
        acc.push({ committee, amount });
      }
      return acc;
    }, []);
  }

  /**
   * GET /day?day=1|2|3
   */
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

    const rows = await googleSheetsService.getSheetData(
      config.id,
      config.range,
    );

    const departments = this.parseDepartmentRows(rows);
    const total = departments.reduce((sum, d) => sum + d.amount, 0);

    logger.info(
      `Day ${day} → ${departments.length} departments, total: ₹${total}`,
    );

    return { day, departments, total };
  }

  /**
   * GET /comm
   */
  async getCommitteeData() {
    const config = sheetsConfig.committee;
    const rows = await googleSheetsService.getSheetData(
      config.id,
      config.range,
    );

    const committees = this.parseCommitteeRows(rows);
    const total = committees.reduce((sum, c) => sum + c.amount, 0);

    logger.info(
      `Committee → ${committees.length} committees, total: ₹${total}`,
    );

    return { committees, total };
  }

  /**
   * GET /total
   */
  async getTotalData() {
    const [day1, day2, day3, committee] = await Promise.all([
      this.getDayData(1),
      this.getDayData(2),
      this.getDayData(3),
      this.getCommitteeData(),
    ]);

    const grandTotal = day1.total + day2.total + day3.total + committee.total;

    logger.info(`Grand total: ₹${grandTotal}`);

    return {
      days: [day1, day2, day3],
      committee,
      grandTotal,
    };
  }

  /**
   * GET /winning
   * Department totals are aggregated across ALL 3 days.
   */
  async getWinningData() {
    const [day1, day2, day3, committeeData] = await Promise.all([
      this.getDayData(1),
      this.getDayData(2),
      this.getDayData(3),
      this.getCommitteeData(),
    ]);

    // Aggregate department donations across all 3 days
    const departmentMap = new Map();

    for (const dayData of [day1, day2, day3]) {
      for (const dept of dayData.departments) {
        const existing = departmentMap.get(dept.department) ?? 0;
        departmentMap.set(dept.department, existing + dept.amount);
      }
    }

    if (departmentMap.size === 0) {
      throw new AppError("No department donation data available", 404);
    }

    // Find winning department
    let winningDeptName = "";
    let winningDeptAmount = 0;

    for (const [name, amount] of departmentMap) {
      if (amount > winningDeptAmount) {
        winningDeptName = name;
        winningDeptAmount = amount;
      }
    }

    // Find winning committee
    if (committeeData.committees.length === 0) {
      throw new AppError("No committee donation data available", 404);
    }

    const winningCommittee = committeeData.committees.reduce((prev, curr) =>
      curr.amount > prev.amount ? curr : prev,
    );

    const result = {
      department: {
        name: winningDeptName,
        amount: winningDeptAmount,
      },
      committee: {
        name: winningCommittee.committee,
        amount: winningCommittee.amount,
      },
    };

    logger.info(
      `🏆 Winning → Dept: ${result.department.name} (₹${result.department.amount}) | Committee: ${result.committee.name} (₹${result.committee.amount})`,
    );

    return result;
  }
}

module.exports = new DonationService();
