const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouseController");
const { requireRole } = require("../middlewares/authMiddleware");

// Xem danh sách kho: Quản lý hoặc Giám đốc hoặc Kế toán
router.get("/", warehouseController.index);

// Nhập mới tài sản vào kho & Cấp phát: Chỉ SYS_ADMIN, ASSET_MANAGER
router.post("/", requireRole("SYS_ADMIN", "ASSET_MANAGER"), warehouseController.create);
router.post("/assign", requireRole("SYS_ADMIN", "ASSET_MANAGER"), warehouseController.assign);

module.exports = router;
