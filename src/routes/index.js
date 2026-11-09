const express = require("express");
const router = express.Router();
const { requireAuth, hasPermission } = require("../middlewares/authMiddleware");

// 1. Phân hệ Xác thực (Công khai - không cần đăng nhập)
router.use("/auth", require("./authRoutes"));

// Áp dụng middleware kiểm tra đăng nhập cho tất cả các chức năng bên dưới
router.use(requireAuth);

// 2. Phân hệ Trang chủ & Dashboard
router.use("/", require("./homeRoutes"));

// 3. Phân hệ Quản lý Tài sản & Vòng đời
router.use("/assets", require("./assetRoutes"));
router.use("/requests", require("./requestRoutes"));
router.use("/stocktakes", require("./stocktakeRoutes"));
router.use("/maintenance", require("./maintenanceRoutes"));
router.use("/depreciation", require("./depreciationRoutes"));

// 4. Phân hệ Danh mục & Cơ cấu tổ chức
// Quản lý Người dùng & Vai trò: Yêu cầu quyền MANAGE_SYSTEM
router.use("/employees", hasPermission("MANAGE_SYSTEM"), require("./employeeRoutes"));

// Các danh mục dùng chung (Phòng ban, Loại tài sản, Vị trí, Nhà cung cấp): Yêu cầu quyền MANAGE_MASTER_DATA
router.use("/departments", hasPermission("MANAGE_MASTER_DATA"), require("./departmentRoutes"));
router.use("/categories", hasPermission("MANAGE_MASTER_DATA"), require("./categoryRoutes"));
router.use("/locations", hasPermission("MANAGE_MASTER_DATA"), require("./locationRoutes"));
router.use("/suppliers", hasPermission("MANAGE_MASTER_DATA"), require("./supplierRoutes"));

// 5. Phân hệ Báo cáo & Thống kê
router.use("/reports", require("./reportRoutes"));

// 6. Phân hệ Nhật ký hoạt động (Audit Log)
router.use("/audit", require("./auditRoutes"));

module.exports = router;
