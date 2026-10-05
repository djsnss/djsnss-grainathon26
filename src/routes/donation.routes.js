const Router = require("express").Router;
const donationController = require("../controllers/donation.controller");

const router = Router();

/**
 * @route   GET /day/1
 * @route   GET /day/2
 * @route   GET /day/3
 * @desc    Fetch donation data for a specific day
 */
router.get("/day/:day", donationController.getDayData);

/**
 * @route   GET /committee
 * @desc    Fetch donation data collected by different committees
 */
router.get("/committee", donationController.getCommitteeData);

/**
 * @route   GET /total
 * @desc    Fetch total donations across all data
 */
router.get("/total", donationController.getTotalData);

/**
 * @route   GET /winning
 * @desc    Fetch department & committee with highest donation
 */
router.get("/winning", donationController.getWinningData);

module.exports = router;
