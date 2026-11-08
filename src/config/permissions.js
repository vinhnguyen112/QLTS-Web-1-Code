/**
 * BẢNG MA TRẬN PHÂN QUYỀN HỆ THỐNG (ROLE-BASED ACCESS CONTROL - RBAC)
 * Định nghĩa tập trung: Chức năng nghiệp vụ -> Các vai trò được phép thực hiện
 */
const PERMISSIONS = {
  // 1. Quản trị hệ thống (Người dùng & Phân quyền)
  MANAGE_SYSTEM: ["SYS_ADMIN"],

  // 2. Cấu hình danh mục dùng chung (Phòng ban, Vị trí, Loại tài sản, Nhà cung cấp)
  MANAGE_MASTER_DATA: ["SYS_ADMIN", "ASSET_MANAGER"],

  // 3. Nghiệp vụ Quản lý tài sản (Thêm mới, bàn giao, thu hồi, sửa thông tin)
  MANAGE_ASSETS: ["SYS_ADMIN", "ASSET_MANAGER"],

  // 4. Khấu hao tài sản & Số liệu tài chính
  VIEW_DEPRECIATION: [
    "SYS_ADMIN",
    "ASSET_MANAGER",
    "CHIEF_ACCOUNTANT",
    "ASSET_ACCOUNTANT",
    "DIRECTOR",
  ],

  // 5. Báo cáo & Thống kê toàn công ty
  VIEW_REPORTS: [
    "SYS_ADMIN",
    "ASSET_MANAGER",
    "CHIEF_ACCOUNTANT",
    "ASSET_ACCOUNTANT",
    "DIRECTOR",
  ],

  // 6. Kiểm kê tài sản (Quét mã QR)
  MANAGE_STOCKTAKES: ["SYS_ADMIN", "ASSET_MANAGER", "DIRECTOR"],

  // 7. Nghiệm thu & hoàn thành bảo trì sửa chữa
  RESOLVE_MAINTENANCE: ["SYS_ADMIN", "ASSET_MANAGER", "TECHNICIAN"],

  // 8. Xét duyệt các loại phiếu đề xuất
  APPROVE_REQUESTS: [
    "SYS_ADMIN",
    "DIRECTOR",
    "CHIEF_ACCOUNTANT",
    "ASSET_MANAGER",
    "DEPT_HEAD",
  ],

  // 9. Giám sát & Nhật ký hoạt động
  VIEW_AUDIT: ["SYS_ADMIN", "DIRECTOR"],
};

/**
 * Kiểm tra xem một vai trò có quyền thực hiện chức năng hay không
 */
function checkPermission(userRole, permissionKey) {
  if (!userRole) return false;
  // Quản trị viên cấp cao (SYS_ADMIN) luôn có toàn quyền
  if (userRole === "SYS_ADMIN") return true;
  const allowedRoles = PERMISSIONS[permissionKey] || [];
  return allowedRoles.includes(userRole);
}

module.exports = {
  PERMISSIONS,
  checkPermission,
};

