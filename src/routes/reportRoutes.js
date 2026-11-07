const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// Báo cáo & Thống kê
router.get("/", reportController.index);

module.exports = router;

