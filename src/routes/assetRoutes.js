const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");
const { requireRole } = require("../middlewares/authMiddleware");

// Xem danh sách tài sản: Tất cả nhân viên đã đăng nhập
router.get("/", assetController.index);

// Thêm mới hồ sơ tài sản (qua Modal popup): Chỉ Quản lý tài sản hoặc Admin
router.post("/create", requireRole("SYS_ADMIN", "ASSET_MANAGER"), assetController.create);

// Cấp phát / Bàn giao tài sản từ kho cho nhân viên: Chỉ Quản lý tài sản hoặc Admin
router.post("/:id/assign", requireRole("SYS_ADMIN", "ASSET_MANAGER"), assetController.assign);

// Xem chi tiết hồ sơ tài sản: Tất cả nhân viên đã đăng nhập
router.get("/:id", assetController.show);

// Thu hồi, chỉnh sửa và xóa tài sản: Yêu cầu quyền quản lý tài sản
router.post("/:id/recall", requireRole("SYS_ADMIN", "ASSET_MANAGER"), assetController.recall);
router.get("/:id/edit", requireRole("SYS_ADMIN", "ASSET_MANAGER"), assetController.edit);
router.post("/:id/update", requireRole("SYS_ADMIN", "ASSET_MANAGER"), assetController.update);
router.post("/:id/delete", requireRole("SYS_ADMIN"), assetController.delete); // Chỉ Admin mới được xóa

module.exports = router;
