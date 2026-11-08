const express = require("express");
const router = express.Router();
const auditController = require("../controllers/auditController");
const { hasPermission } = require("../middlewares/authMiddleware");

// Nhật ký hoạt động: Chỉ Quản trị viên (SYS_ADMIN) và Giám đốc (DIRECTOR) được xem
router.get("/", hasPermission("VIEW_AUDIT"), auditController.index);

module.exports = router;
