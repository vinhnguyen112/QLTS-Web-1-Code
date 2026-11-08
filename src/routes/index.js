const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");

// 1. Phân hệ Xác thực (Công khai - không cần đăng nhập)
router.use("/auth", require("./authRoutes"));

// Áp dụng middleware kiểm tra đăng nhập cho tất cả các chức năng bên dưới
router.use(requireAuth);

// 2. Phân hệ Trang chủ & Dashboard (Ai đã đăng nhập cũng xem được)
router.use("/", require("./homeRoutes"));

// 3. Phân hệ Quản lý Tài sản & Vòng đời
router.use("/assets", require("./assetRoutes"));
router.use("/warehouse", require("./warehouseRoutes"));
router.use("/requests", require("./requestRoutes"));
router.use("/procurement", (req, res) => res.redirect("/requests")); // Alias
router.use("/stocktakes", require("./stocktakeRoutes"));
router.use("/maintenance", require("./maintenanceRoutes"));
router.use("/depreciation", require("./depreciationRoutes"));

// 4. Phân hệ Danh mục & Cơ cấu tổ chức
// Quản lý Người dùng & Vai trò: CHỈ SYS_ADMIN
router.use("/employees", requireRole("SYS_ADMIN"), require("./employeeRoutes"));

// Các danh mục dùng chung (Phòng ban, Loại tài sản, Vị trí, Nhà cung cấp)
router.use("/departments", require("./departmentRoutes"));
router.use("/categories", require("./categoryRoutes"));
router.use("/locations", require("./locationRoutes"));
router.use("/suppliers", require("./supplierRoutes"));

// 5. Phân hệ Báo cáo & Thống kê
router.use("/reports", require("./reportRoutes"));

// 6. Phân hệ Nhật ký hoạt động (Audit Log) - Chỉ Quản trị viên & Giám đốc
router.use("/audit", require("./auditRoutes"));

module.exports = router;
