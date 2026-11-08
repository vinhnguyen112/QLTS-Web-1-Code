const express = require("express");
const router = express.Router();
const auditController = require("../controllers/auditController");
const { requireRole } = require("../middlewares/authMiddleware");

// Nhật ký hoạt động: Chỉ Quản trị viên (SYS_ADMIN) và Giám đốc (DIRECTOR) được xem
router.get("/", requireRole("SYS_ADMIN", "DIRECTOR"), auditController.index);

module.exports = router;

