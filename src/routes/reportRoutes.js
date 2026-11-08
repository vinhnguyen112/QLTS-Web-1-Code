const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { hasPermission } = require("../middlewares/authMiddleware");

// Báo cáo & Thống kê toàn công ty
router.get("/", hasPermission("VIEW_REPORTS"), reportController.index);

module.exports = router;
