const db = require("../config/db");
const argon2 = require("argon2");

const authController = {
  // 1. Hiển thị trang đăng nhập
  getLogin(req, res) {
    if (req.session && req.session.user) {
      return res.redirect("/");
    }
    res.render("auth/login", {
      layout: false, // Dùng layout riêng cho trang login
      title: "Đăng nhập hệ thống",
      error: null,
    });
  },

  // 2. Xử lý đăng nhập
  async postLogin(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render("auth/login", {
        layout: false,
        title: "Đăng nhập hệ thống",
        error: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu",
        username,
      });
    }

    try {
      // Tìm người dùng trong CSDL kèm phòng ban và vai trò
      const [users] = await db.query(
        `
        SELECT u.*, 
               ou.name AS org_unit_name,
               r.code AS role_code,
               r.name AS role_name
        FROM users u
        LEFT JOIN org_units  ou ON u.org_unit_id = ou.id
        LEFT JOIN user_roles ur ON u.id          = ur.user_id
        LEFT JOIN roles      r  ON ur.role_id    = r.id
        WHERE u.username = ?
        LIMIT 1
      `,
        [username.trim()]
      );

      if (users.length === 0) {
        return res.render("auth/login", {
          layout: false,
          title: "Đăng nhập hệ thống",
          error: "Tài khoản hoặc mật khẩu không chính xác",
          username,
        });
      }

      const user = users[0];

      if (user.status !== "ACTIVE") {
        return res.render("auth/login", {
          layout: false,
          title: "Đăng nhập hệ thống",
          error: "Tài khoản này hiện đang bị khóa hoặc chưa kích hoạt",
          username,
        });
      }

      // Xác thực mật khẩu bằng Argon2
      const isValid = await argon2.verify(user.password_hash, password);
      if (!isValid) {
        return res.render("auth/login", {
          layout: false,
          title: "Đăng nhập hệ thống",
          error: "Tài khoản hoặc mật khẩu không chính xác",
          username,
        });
      }

      // Lưu phiên đăng nhập (Session)
      req.session.user = {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        org_unit_id: user.org_unit_id,
        org_unit_name: user.org_unit_name || "Trụ sở chính",
        role_code: user.role_code || "EMPLOYEE",
        role_name: user.role_name || "Nhân viên",
      };

      // Cập nhật thời điểm đăng nhập gần nhất
      await db.query("UPDATE users SET last_login_at = NOW() WHERE id = ?", [
        user.id,
      ]);

      res.redirect("/");
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      res.render("auth/login", {
        layout: false,
        title: "Đăng nhập hệ thống",
        error: "Đã xảy ra lỗi máy chủ: " + err.message,
        username,
      });
    }
  },

  // 3. Đăng xuất
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/auth/login");
    });
  },
};

module.exports = authController;

