const Router = require("express").Router;
const donationController = require("../controllers/donation.controller");

const router = Router();

/**
 * @route   GET /day?day=1|2|3
 * @desc    Fetch donation data for a specific day
 */
router.get("/day", donationController.getDayData);

/**
 * @route   GET /comm
 * @desc    Fetch donation data collected by different committees
 */
router.get("/comm", donationController.getCommitteeData);

/**
 * @route   GET /total
 * @desc    Fetch the total donations across all available data
 */
router.get("/total", donationController.getTotalData);

/**
 * @route   GET /winning
 * @desc    Fetch the department and committee with the highest donation
 */
router.get("/winning", donationController.getWinningData);

module.exports = router;
