const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { requireRole } = require("../middlewares/authMiddleware");

// Xem: Quản trị, Quản lý tài sản, Giám đốc, Kế toán
router.get("/", requireRole("SYS_ADMIN", "ASSET_MANAGER", "DIRECTOR", "CHIEF_ACCOUNTANT", "ASSET_ACCOUNTANT"), categoryController.index);

// Thêm, Sửa, Xóa: Chỉ Admin hoặc Quản lý tài sản
router.post("/", requireRole("SYS_ADMIN", "ASSET_MANAGER"), categoryController.create);
router.get("/:id/edit", requireRole("SYS_ADMIN", "ASSET_MANAGER"), categoryController.edit);
router.post("/:id/update", requireRole("SYS_ADMIN", "ASSET_MANAGER"), categoryController.update);
router.post("/:id/delete", requireRole("SYS_ADMIN"), categoryController.delete);

module.exports = router;
