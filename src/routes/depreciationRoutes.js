const express = require("express");
const router = express.Router();
const depreciationController = require("../controllers/depreciationController");
const { requireRole } = require("../middlewares/authMiddleware");

// Danh sách khấu hao tài sản: Admin, Quản lý tài sản, Ban Giám đốc, Kế toán
router.get(
  "/",
  requireRole("SYS_ADMIN", "ASSET_MANAGER", "DIRECTOR", "CHIEF_ACCOUNTANT", "ASSET_ACCOUNTANT"),
  depreciationController.index
);

// Chi tiết khấu hao của tài sản (Thông tin tài sản + Bảng khấu hao theo từng tháng)
router.get(
  "/:id",
  requireRole("SYS_ADMIN", "ASSET_MANAGER", "DIRECTOR", "CHIEF_ACCOUNTANT", "ASSET_ACCOUNTANT"),
  depreciationController.show
);

module.exports = router;
