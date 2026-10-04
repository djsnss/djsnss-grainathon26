const donationService = require("../services/donation.service");
const AppError = require("../utils/app-error");

const buildResponse = (data, message) => ({
  success: true,
  data,
  ...(message && { message }),
  timestamp: new Date().toISOString(),
});

class DonationController {
  /**
   * GET /day?day=1|2|3
   */
  async getDayData(req, res, next) {
    try {
      const day = Number(req.query.day);

      if (![1, 2, 3].includes(day)) {
        throw new AppError(
          "Invalid or missing 'day' query param. Must be 1, 2, or 3.",
          400,
        );
      }

      const data = await donationService.getDayData(day);
      res.status(200).json(buildResponse(data));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /comm
   */
  async getCommitteeData(req, res, next) {
    try {
      const data = await donationService.getCommitteeData();
      res.status(200).json(buildResponse(data));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /total
   */
  async getTotalData(req, res, next) {
    try {
      const data = await donationService.getTotalData();
      res.status(200).json(buildResponse(data));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /winning
   */
  async getWinningData(req, res, next) {
    try {
      const data = await donationService.getWinningData();
      res.status(200).json(buildResponse(data));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DonationController();
