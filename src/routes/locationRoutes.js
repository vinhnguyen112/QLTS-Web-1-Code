const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const { requireRole } = require("../middlewares/authMiddleware");

// Xem: Quản trị, Quản lý tài sản, Giám đốc, Kỹ thuật
router.get("/", requireRole("SYS_ADMIN", "ASSET_MANAGER", "DIRECTOR", "TECHNICIAN"), locationController.index);

// Thêm, Sửa, Xóa: Chỉ Admin hoặc Quản lý tài sản
router.post("/", requireRole("SYS_ADMIN", "ASSET_MANAGER"), locationController.create);
router.get("/:id/edit", requireRole("SYS_ADMIN", "ASSET_MANAGER"), locationController.edit);
router.post("/:id/update", requireRole("SYS_ADMIN", "ASSET_MANAGER"), locationController.update);
router.post("/:id/delete", requireRole("SYS_ADMIN"), locationController.delete);

module.exports = router;
