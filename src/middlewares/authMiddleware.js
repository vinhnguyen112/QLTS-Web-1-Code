const { checkPermission } = require("../config/permissions");

// Middleware kiểm tra đăng nhập
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
}

// Middleware kiểm tra quyền theo Bảng phân quyền tập trung (RBAC)
function hasPermission(permissionKey) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect("/auth/login");
    }

    const userRole = req.session.user.role_code;
    if (checkPermission(userRole, permissionKey)) {
      return next();
    }

    const roleName = req.session.user.role_name || userRole;
    res.status(403).render("errors/403", {
      title: "Không có quyền truy cập",
      layout: "main",
      message: `Tài khoản với vai trò [${roleName}] không được cấp phép thực hiện chức năng này.`,
    });
  };
}

// Giữ lại requireRole để tương thích ngược nếu cần
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect("/auth/login");
    }

    const userRole = req.session.user.role_code;
    if (userRole === "SYS_ADMIN" || roles.includes(userRole)) {
      return next();
    }

    res.status(403).render("errors/403", {
      title: "Không có quyền truy cập",
      layout: "main",
      message: `Bạn cần quyền [${roles.join(", ")}] để thực hiện thao tác này.`,
    });
  };
}

module.exports = {
  requireAuth,
  hasPermission,
  requireRole,
};
