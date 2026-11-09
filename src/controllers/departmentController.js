const db = require("../config/db");

const departmentController = {
  // 1. Danh sách cơ cấu phòng ban / đơn vị
  async index(req, res) {
    try {
      const searchName = req.query.name || "";
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

      // Kiểm tra xem mã phòng ban đã tồn tại chưa
      const [existing] = await db.query(
        "SELECT id, active FROM org_units WHERE code = ? LIMIT 1",
        [cleanCode]
      );

      if (existing.length > 0) {
        if (existing[0].active === 0) {
          // Nếu mã đã có nhưng trước đó bị xóa mềm (active = 0) -> Phục hồi lại với tên mới
          await db.query(
            "UPDATE org_units SET name = ?, type = ?, active = 1, updated_at = NOW() WHERE id = ?",
            [cleanName, type || "DEPARTMENT", existing[0].id]
          );
          return res.redirect("/departments");
        } else {
          // Mã đã tồn tại và đang hoạt động
          return res.status(400).send(`Mã phòng ban '${cleanCode}' đã tồn tại trong hệ thống. Vui lòng chọn mã khác!`);
        }
      }

      await db.query(
        "INSERT INTO org_units (code, name, type, parent_id, active, created_at, updated_at) VALUES (?, ?, ?, 227, 1, NOW(), NOW())",
        [cleanCode, cleanName, type || "DEPARTMENT"]
      );

      res.redirect("/departments");
    } catch (err) {
      console.error("Lỗi thêm phòng ban:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).send("Mã phòng ban đã tồn tại trong hệ thống. Vui lòng chọn mã khác!");
      }
      res.status(500).send("Lỗi thêm phòng ban: " + err.message);
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

      // Kiểm tra trùng mã với phòng ban khác
      const [duplicate] = await db.query(
        "SELECT id FROM org_units WHERE code = ? AND id != ? LIMIT 1",
        [cleanCode, req.params.id]
      );
      if (duplicate.length > 0) {
        return res.status(400).send(`Mã phòng ban '${cleanCode}' đã được sử dụng bởi phòng ban khác!`);
      }

      await db.query(
        "UPDATE org_units SET code = ?, name = ?, type = ?, updated_at = NOW() WHERE id = ?",
        [cleanCode, cleanName, type || "DEPARTMENT", req.params.id]
      );

      res.redirect("/departments");
    } catch (err) {
      console.error("Lỗi cập nhật phòng ban:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).send("Mã phòng ban đã tồn tại trong hệ thống!");
      }
      res.status(500).send("Lỗi cập nhật phòng ban: " + err.message);
    }
  },

  // 5. Xóa phòng ban (Soft delete)
  async delete(req, res) {
    try {
      await db.query("UPDATE org_units SET active = 0, updated_at = NOW() WHERE id = ?", [req.params.id]);
      res.redirect("/departments");
    } catch (err) {
      res.status(500).send("Không thể xóa: " + err.message);
    }
  },
};

module.exports = departmentController;
