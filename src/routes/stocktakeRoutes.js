const express = require("express");
const router = express.Router();
const stocktakeController = require("../controllers/stocktakeController");
const { requireRole } = require("../middlewares/authMiddleware");

// Xem danh sách và trang quét QR: Quản trị, Quản lý tài sản, Trưởng phòng
router.get("/", requireRole("SYS_ADMIN", "ASSET_MANAGER", "DEPT_HEAD", "DIRECTOR"), stocktakeController.index);
router.get("/:id", requireRole("SYS_ADMIN", "ASSET_MANAGER", "DEPT_HEAD", "DIRECTOR"), stocktakeController.show);
router.get("/:id/scan", requireRole("SYS_ADMIN", "ASSET_MANAGER", "DEPT_HEAD", "DIRECTOR"), stocktakeController.scanPage);

// Tạo đợt kiểm kê, ghi nhận quét và đóng đợt: Chỉ Admin hoặc Quản lý tài sản
router.post("/create", requireRole("SYS_ADMIN", "ASSET_MANAGER"), stocktakeController.create);
router.post("/:id/record-scan", requireRole("SYS_ADMIN", "ASSET_MANAGER", "DEPT_HEAD"), stocktakeController.recordScan);
router.post("/:id/close", requireRole("SYS_ADMIN", "ASSET_MANAGER"), stocktakeController.close);

module.exports = router;
