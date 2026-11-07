const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const { requireRole } = require("../middlewares/authMiddleware");

// Xem: Quản trị, Quản lý tài sản, Giám đốc, Kế toán
router.get("/", requireRole("SYS_ADMIN", "ASSET_MANAGER", "DIRECTOR", "CHIEF_ACCOUNTANT"), supplierController.index);

// Thêm, Sửa, Xóa: Chỉ Admin hoặc Quản lý tài sản
router.post("/", requireRole("SYS_ADMIN", "ASSET_MANAGER"), supplierController.create);
router.get("/:id/edit", requireRole("SYS_ADMIN", "ASSET_MANAGER"), supplierController.edit);
router.post("/:id/update", requireRole("SYS_ADMIN", "ASSET_MANAGER"), supplierController.update);
router.post("/:id/delete", requireRole("SYS_ADMIN"), supplierController.delete);

module.exports = router;
