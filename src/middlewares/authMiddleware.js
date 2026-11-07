// Middleware kiểm tra đăng nhập
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
}

// Middleware kiểm tra quyền theo vai trò (Role-Based Access Control)
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect("/auth/login");
    }

    const userRole = req.session.user.role_code;
    // Quản trị viên (SYS_ADMIN) luôn có toàn quyền
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
  requireRole,
};

