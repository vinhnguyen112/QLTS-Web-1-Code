const db = require("../config/db");

const departmentController = {
  // 1. Danh sách cơ cấu phòng ban / đơn vị
  async index(req, res) {
    try {
      const searchName = req.query.name || "";
      const errorMessage = req.query.error || null;
      const successMessage = req.query.msg || null;
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const [[{ total }]] = await db.query(
        "SELECT COUNT(*) AS total FROM org_units WHERE active = 1 AND (name LIKE ? OR code LIKE ?)",
        [`%${searchName}%`, `%${searchName}%`]
      );

      const totalPages = Math.ceil(total / limit) || 1;
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      const [departments] = await db.query(
        `
        SELECT ou.id, ou.code, ou.name, ou.type,
               COUNT(DISTINCT u.id) AS employee_count,
               COUNT(DISTINCT a.id) AS asset_count
        FROM org_units ou
        LEFT JOIN users  u ON ou.id = u.org_unit_id AND u.status = 'ACTIVE'
        LEFT JOIN assets a ON ou.id = a.org_unit_id AND a.deleted_at IS NULL
        WHERE ou.active = 1 AND (ou.name LIKE ? OR ou.code LIKE ?)
        GROUP BY ou.id, ou.code, ou.name, ou.type
        ORDER BY ou.id ASC
        LIMIT ${offset}, ${limit}
      `,
        [`%${searchName}%`, `%${searchName}%`]
      );

      res.render("departments/index", {
        title: "Cơ cấu phòng ban & Đơn vị",
        departments,
        searchName,
        errorMessage,
        successMessage,
        totalPages,
        pages,
      });
    } catch (err) {
      console.error("Lỗi phòng ban:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Thêm phòng ban mới
  async create(req, res) {
    try {
      const { code, name, type } = req.body;
      const cleanCode = (code || "").trim().toUpperCase();
      const cleanName = (name || "").trim();

      if (!cleanCode || !cleanName) {
        return res.redirect("/departments?error=" + encodeURIComponent("Vui lòng nhập đầy đủ mã và tên phòng ban!"));
      }

      // 1. Kiểm tra trong DB xem mã phòng ban đã tồn tại chưa
      const [existing] = await db.query(
        "SELECT id, name FROM org_units WHERE code = ? LIMIT 1",
        [cleanCode]
      );

      // Nếu mã đã tồn tại -> Báo lỗi cho người dùng, không cho tạo
      if (existing.length > 0) {
        return res.redirect(
          "/departments?error=" +
            encodeURIComponent(`Mã phòng ban '${cleanCode}' đã tồn tại trong hệ thống, vui lòng nhập mã khác!`)
        );
      }

      // 2. Nếu mã chưa tồn tại -> Mới cho phép tạo mới
      await db.query(
        "INSERT INTO org_units (code, name, type, parent_id, active, created_at, updated_at) VALUES (?, ?, ?, 227, 1, NOW(), NOW())",
        [cleanCode, cleanName, type || "DEPARTMENT"]
      );

      res.redirect("/departments?msg=" + encodeURIComponent("Thêm phòng ban mới thành công!"));
    } catch (err) {
      console.error("Lỗi thêm phòng ban:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.redirect(
          "/departments?error=" +
            encodeURIComponent("Mã phòng ban đã tồn tại trong hệ thống, vui lòng nhập mã khác!")
        );
      }
      res.redirect("/departments?error=" + encodeURIComponent("Lỗi thêm phòng ban: " + err.message));
    }
  },

  // 3. Form sửa phòng ban
  async edit(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM org_units WHERE id = ?", [req.params.id]);
      if (rows.length === 0) return res.redirect("/departments");

      res.render("departments/departments-edit", {
        title: `Sửa phòng ban - ${rows[0].name}`,
        department: rows[0],
      });
    } catch (err) {
      res.redirect("/departments");
    }
  },

  // 4. Cập nhật phòng ban
  async update(req, res) {
    try {
      const { code, name, type } = req.body;
      const cleanCode = (code || "").trim().toUpperCase();
      const cleanName = (name || "").trim();

      // Kiểm tra trùng mã với phòng ban khác trong DB
      const [duplicate] = await db.query(
        "SELECT id FROM org_units WHERE code = ? AND id != ? LIMIT 1",
        [cleanCode, req.params.id]
      );
      if (duplicate.length > 0) {
        return res.render("departments/departments-edit", {
          title: "Sửa phòng ban",
          department: { id: req.params.id, code: cleanCode, name: cleanName, type },
          error: `Mã phòng ban '${cleanCode}' đã tồn tại, vui lòng nhập mã khác!`,
        });
      }

      await db.query(
        "UPDATE org_units SET code = ?, name = ?, type = ?, updated_at = NOW() WHERE id = ?",
        [cleanCode, cleanName, type || "DEPARTMENT", req.params.id]
      );

      res.redirect("/departments?msg=" + encodeURIComponent("Cập nhật phòng ban thành công!"));
    } catch (err) {
      console.error("Lỗi cập nhật phòng ban:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.render("departments/departments-edit", {
          title: "Sửa phòng ban",
          department: { id: req.params.id, code: req.body.code, name: req.body.name, type: req.body.type },
          error: "Mã phòng ban đã tồn tại, vui lòng nhập mã khác!",
        });
      }
      res.redirect("/departments");
    }
  },

  // 5. Xóa phòng ban (Soft delete)
  async delete(req, res) {
    try {
      await db.query("UPDATE org_units SET active = 0, updated_at = NOW() WHERE id = ?", [req.params.id]);
      res.redirect("/departments?msg=" + encodeURIComponent("Đã ngưng hoạt động phòng ban thành công!"));
    } catch (err) {
      res.status(500).send("Không thể xóa: " + err.message);
    }
  },
};

module.exports = departmentController;
