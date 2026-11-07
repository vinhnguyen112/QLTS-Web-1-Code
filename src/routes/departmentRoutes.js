const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { requireRole } = require("../middlewares/authMiddleware");

// Xem danh sách: Cần quyền quản trị hoặc quản lý CSVC
router.get("/", requireRole("SYS_ADMIN", "ASSET_MANAGER", "DIRECTOR"), departmentController.index);

// Thêm, Sửa, Xóa: Chỉ Quản trị viên
router.post("/", requireRole("SYS_ADMIN"), departmentController.create);
router.get("/:id/edit", requireRole("SYS_ADMIN"), departmentController.edit);
router.post("/:id/update", requireRole("SYS_ADMIN"), departmentController.update);
router.post("/:id/delete", requireRole("SYS_ADMIN"), departmentController.delete);

module.exports = router;
