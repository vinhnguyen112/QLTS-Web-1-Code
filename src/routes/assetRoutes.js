const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");
const { hasPermission } = require("../middlewares/authMiddleware");

// Xem danh sách và chi tiết tài sản: Tất cả nhân sự trong hệ thống
router.get("/", assetController.index);
router.get("/:id", assetController.show);

// Nghiệp vụ Quản lý tài sản: Thêm mới, Bàn giao, Thu hồi, Chỉnh sửa
router.post("/create", hasPermission("MANAGE_ASSETS"), assetController.create);
router.post("/:id/assign", hasPermission("MANAGE_ASSETS"), assetController.assign);
router.post("/:id/recall", hasPermission("MANAGE_ASSETS"), assetController.recall);
router.get("/:id/edit", hasPermission("MANAGE_ASSETS"), assetController.edit);
router.post("/:id/update", hasPermission("MANAGE_ASSETS"), assetController.update);

// Xóa tài sản: Yêu cầu quyền quản trị hệ thống
router.post("/:id/delete", hasPermission("MANAGE_SYSTEM"), assetController.delete);

module.exports = router;
