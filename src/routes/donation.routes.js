const Router = require("express").Router;
const donationController = require("../controllers/donation.controller");

const router = Router();

router.get("/day/:day", donationController.getDayData);
router.get("/committee", donationController.getCommitteeData);
router.get("/total", donationController.getTotalData);
router.get("/winning", donationController.getWinningData);
router.get("/nkg",donationController.getTotalCount);

module.exports = router;
