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
      const defaultPass = password || "Devmaster@2026!";
      const hash = await argon2.hash(defaultPass);

      const [result] = await db.query(
        `
        INSERT INTO users (username, password_hash, full_name, email, org_unit_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'ACTIVE', NOW(), NOW())
      `,
        [username.trim(), hash, full_name.trim(), email.trim(), org_unit_id || 227]
      );

      // Gán vai trò
      if (role_id) {
        await db.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [
          result.insertId,
          role_id,
        ]);
      }

      res.redirect("/employees");
    } catch (err) {
      console.error("Lỗi thêm nhân sự:", err);
      res.redirect("/employees");
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

      await db.query(
        `
        UPDATE users
        SET full_name = ?, email = ?, org_unit_id = ?, status = ?, updated_at = NOW()
        WHERE id = ?
      `,
        [full_name, email, org_unit_id, status || "ACTIVE", req.params.id]
      );

      if (role_id) {
        await db.query("DELETE FROM user_roles WHERE user_id = ?", [req.params.id]);
        await db.query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [
          req.params.id,
          role_id,
        ]);
      }

      res.redirect("/employees");
    } catch (err) {
      console.error("Lỗi cập nhật nhân sự:", err);
      res.redirect("/employees");
    }
  },
};

module.exports = employeeController;
