const express = require("express");
const router = express.Router();
const depreciationController = require("../controllers/depreciationController");
const { hasPermission } = require("../middlewares/authMiddleware");

// Danh sách bảng tính khấu hao tài sản
router.get("/", hasPermission("VIEW_DEPRECIATION"), depreciationController.index);

// Chi tiết khấu hao tài sản: Thông tin tài sản & Bảng kê khấu hao từng tháng
router.get("/:id", hasPermission("VIEW_DEPRECIATION"), depreciationController.show);

module.exports = router;
