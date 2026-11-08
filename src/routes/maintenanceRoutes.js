const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");
const { requireRole } = require("../middlewares/authMiddleware");

// Xem danh sách và tạo phiếu báo hỏng: Mọi nhân sự đều có thể báo hỏng thiết bị
router.get("/", maintenanceController.index);
router.get("/create", maintenanceController.createForm);
router.post("/", maintenanceController.create);
router.post("/create", maintenanceController.create);

// Nghiệm thu hoàn thành bảo trì: Chỉ Kỹ thuật viên (TECHNICIAN), QL Tài sản (ASSET_MANAGER) hoặc Admin
router.post(
  "/:id/complete",
  requireRole("SYS_ADMIN", "ASSET_MANAGER", "TECHNICIAN"),
  maintenanceController.complete
);

module.exports = router;
