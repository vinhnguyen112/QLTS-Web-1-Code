const db = require("../config/db");
const argon2 = require("argon2");

const employeeController = {
  // 1. Danh sách nhân sự & Người dùng
  async index(req, res) {
    try {
      const searchName = req.query.name || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const [[{ total }]] = await db.query(
        "SELECT COUNT(*) AS total FROM users WHERE (full_name LIKE ? OR username LIKE ? OR email LIKE ?)",
        [`%${searchName}%`, `%${searchName}%`, `%${searchName}%`]
      );

      const totalPages = Math.ceil(total / limit) || 1;
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      const [employees] = await db.query(
        `
        SELECT u.id, u.username, u.full_name, u.email, u.status, u.last_login_at,
               ou.name AS department_name,
               r.name  AS role_name,
               (SELECT COUNT(*) FROM assets a WHERE a.assignee_id = u.id AND a.deleted_at IS NULL) AS asset_count
        FROM users u
        LEFT JOIN org_units  ou ON u.org_unit_id = ou.id
        LEFT JOIN user_roles ur ON u.id          = ur.user_id
        LEFT JOIN roles      r  ON ur.role_id    = r.id
        WHERE (u.full_name LIKE ? OR u.username LIKE ? OR u.email LIKE ?)
        ORDER BY u.id DESC
        LIMIT ${offset}, ${limit}
      `,
        [`%${searchName}%`, `%${searchName}%`, `%${searchName}%`]
      );

      const [departments] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");
      const [roles] = await db.query("SELECT id, name FROM roles ORDER BY id ASC");

      res.render("employees/index", {
        title: "Nhân sự & Người dùng",
        employees,
        searchName,
        totalPages,
        pages,
        currentPage: page,
        formData: { departments, roles },
      });
    } catch (err) {
      console.error("Lỗi danh sách nhân sự:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Thêm nhân sự / người dùng mới
  async create(req, res) {
    try {
      const { username, full_name, email, org_unit_id, role_id, password } = req.body;
      const cleanUsername = (username || "").trim();
      const cleanEmail = (email || "").trim();
      const cleanFullName = (full_name || "").trim();

      if (!cleanUsername || !cleanFullName || !cleanEmail) {
        return res.redirect("/employees?error=" + encodeURIComponent("Vui lòng điền đầy đủ thông tin nhân sự!"));
      }

      // Kiểm tra trùng username hoặc email trong DB
      const [existing] = await db.query(
        "SELECT id, username, email FROM users WHERE username = ? OR email = ? LIMIT 1",
        [cleanUsername, cleanEmail]
      );
      if (existing.length > 0) {
        const isUserMatch = existing[0].username.toLowerCase() === cleanUsername.toLowerCase();
        return res.redirect(
          "/employees?error=" +
            encodeURIComponent(
              isUserMatch
                ? `Tên đăng nhập '${cleanUsername}' đã tồn tại, vui lòng chọn tên khác!`
                : `Email '${cleanEmail}' đã tồn tại trong hệ thống, vui lòng chọn email khác!`
            )
        );
      }

      const defaultPass = password || "Devmaster@2026!";
      const hash = await argon2.hash(defaultPass);

      const [result] = await db.query(
        `
        INSERT INTO users (username, password_hash, full_name, email, org_unit_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'ACTIVE', NOW(), NOW())
      `,
        [cleanUsername, hash, cleanFullName, cleanEmail, org_unit_id || 227]
      );

      // Gán vai trò
      if (role_id) {
        await db.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [
          result.insertId,
          role_id,
        ]);
      }

      res.redirect("/employees?msg=" + encodeURIComponent("Thêm nhân sự mới thành công!"));
    } catch (err) {
      console.error("Lỗi thêm nhân sự:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.redirect(
          "/employees?error=" + encodeURIComponent("Tên đăng nhập hoặc email đã tồn tại!")
        );
      }
      res.redirect("/employees?error=" + encodeURIComponent("Lỗi thêm nhân sự: " + err.message));
    }
  },

  // 3. Form sửa thông tin
  async edit(req, res) {
    try {
      const [rows] = await db.query(
        `
        SELECT u.*, ur.role_id
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        WHERE u.id = ?
      `,
        [req.params.id]
      );

      if (rows.length === 0) return res.redirect("/employees");

      const [departments] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");
      const [roles] = await db.query("SELECT id, name FROM roles ORDER BY id ASC");

      res.render("employees/employees-edit", {
        title: `Sửa nhân sự - ${rows[0].full_name}`,
        employee: rows[0],
        formData: { departments, roles },
      });
    } catch (err) {
      res.redirect("/employees");
    }
  },

  // 4. Cập nhật thông tin
  async update(req, res) {
    try {
      const { full_name, email, org_unit_id, role_id, status } = req.body;
      const cleanFullName = (full_name || "").trim();
      const cleanEmail = (email || "").trim();

      // Kiểm tra trùng email với tài khoản khác
      const [duplicate] = await db.query(
        "SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1",
        [cleanEmail, req.params.id]
      );
      if (duplicate.length > 0) {
        return res.redirect(
          "/employees?error=" + encodeURIComponent(`Email '${cleanEmail}' đã được dùng bởi tài khoản khác!`)
        );
      }

      await db.query(
        `
        UPDATE users
        SET full_name = ?, email = ?, org_unit_id = ?, status = ?, updated_at = NOW()
        WHERE id = ?
      `,
        [cleanFullName, cleanEmail, org_unit_id, status || "ACTIVE", req.params.id]
      );

      if (role_id) {
        await db.query("DELETE FROM user_roles WHERE user_id = ?", [req.params.id]);
        await db.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [
          req.params.id,
          role_id,
        ]);
      }

      res.redirect("/employees?msg=" + encodeURIComponent("Cập nhật thông tin nhân sự thành công!"));
    } catch (err) {
      console.error("Lỗi cập nhật nhân sự:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.redirect(
          "/employees?error=" + encodeURIComponent("Email đã tồn tại ở tài khoản khác!")
        );
      }
      res.redirect("/employees?error=" + encodeURIComponent("Lỗi cập nhật: " + err.message));
    }
  },
};

module.exports = employeeController;
