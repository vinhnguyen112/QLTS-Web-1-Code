const express = require("express");
const router = express.Router();
const depreciationController = require("../controllers/depreciationController");
const { requireRole } = require("../middlewares/authMiddleware");

// Xem bảng tính khấu hao tài sản: Admin, Quản lý tài sản, Ban Giám đốc, Kế toán
router.get(
  "/",
  requireRole("SYS_ADMIN", "ASSET_MANAGER", "DIRECTOR", "CHIEF_ACCOUNTANT", "ASSET_ACCOUNTANT"),
  depreciationController.index
);

// Lấy chi tiết kế hoạch trích khấu hao của 1 tài sản (JSON cho Modal)
router.get(
  "/:id/schedule",
  requireRole("SYS_ADMIN", "ASSET_MANAGER", "DIRECTOR", "CHIEF_ACCOUNTANT", "ASSET_ACCOUNTANT"),
  depreciationController.schedule
);

module.exports = router;

