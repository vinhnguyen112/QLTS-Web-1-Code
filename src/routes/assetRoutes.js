const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");
const { requireRole } = require("../middlewares/authMiddleware");

// Xem danh sách và xem chi tiết: Tất cả nhân viên đã đăng nhập
router.get("/", assetController.index);
router.get("/:id", assetController.show);

// Thu hồi, chỉnh sửa và xóa tài sản: Yêu cầu quyền quản lý tài sản
router.post("/:id/recall", requireRole("SYS_ADMIN", "ASSET_MANAGER"), assetController.recall);
router.get("/:id/edit", requireRole("SYS_ADMIN", "ASSET_MANAGER"), assetController.edit);
router.post("/:id/update", requireRole("SYS_ADMIN", "ASSET_MANAGER"), assetController.update);
router.post("/:id/delete", requireRole("SYS_ADMIN"), assetController.delete); // Chỉ Admin mới được xóa

module.exports = router;
