const Router = require("express").Router;
const donationRoutes = require("./donation.routes");

const router = Router();

// Donation API routes
router.use("/", donationRoutes);

// Health check
router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    memory: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
  });
});

module.exports = router;
