const db = require("../config/db");

const supplierController = {
  // 1. Danh sách nhà cung cấp
  async index(req, res) {
    try {
      const searchName = req.query.name || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const [[{ total }]] = await db.query(
        "SELECT COUNT(*) AS total FROM suppliers WHERE active = 1 AND (name LIKE ? OR code LIKE ? OR tax_code LIKE ?)",
        [`%${searchName}%`, `%${searchName}%`, `%${searchName}%`]
      );

      const totalPages = Math.ceil(total / limit) || 1;
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      const [suppliers] = await db.query(
        `
        SELECT s.id, s.code, s.name, s.tax_code, s.phone, s.email, s.address,
               COUNT(a.id) AS asset_count
        FROM suppliers s
        LEFT JOIN assets a ON s.id = a.supplier_id AND a.deleted_at IS NULL
        WHERE s.active = 1 AND (s.name LIKE ? OR s.code LIKE ? OR s.tax_code LIKE ?)
        GROUP BY s.id, s.code, s.name, s.tax_code, s.phone, s.email, s.address
        ORDER BY s.id DESC
        LIMIT ${offset}, ${limit}
      `,
        [`%${searchName}%`, `%${searchName}%`, `%${searchName}%`]
      );

      res.render("suppliers/index", {
        title: "Nhà cung cấp thiết bị",
        suppliers,
        searchName,
        totalPages,
        pages,
      });
    } catch (err) {
      console.error("Lỗi danh sách nhà cung cấp:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Thêm nhà cung cấp mới
  async create(req, res) {
    try {
      const { code, name, tax_code, phone, email, address } = req.body;
      const cleanCode = (code || "").trim().toUpperCase();
      const cleanName = (name || "").trim();

      if (!cleanCode || !cleanName) {
        return res.redirect("/suppliers?error=" + encodeURIComponent("Vui lòng nhập đầy đủ mã và tên nhà cung cấp!"));
      }

      // Kiểm tra trùng mã trong DB (kể cả bản ghi đã xóa mềm)
      const [existing] = await db.query(
        "SELECT id FROM suppliers WHERE code = ? LIMIT 1",
        [cleanCode]
      );
      if (existing.length > 0) {
        return res.redirect(
          "/suppliers?error=" +
            encodeURIComponent(`Mã nhà cung cấp '${cleanCode}' đã tồn tại, vui lòng nhập mã khác!`)
        );
      }

      await db.query(
        "INSERT INTO suppliers (code, name, tax_code, phone, email, address, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())",
        [cleanCode, cleanName, tax_code, phone, email, address]
      );
      res.redirect("/suppliers?msg=" + encodeURIComponent("Thêm nhà cung cấp mới thành công!"));
    } catch (err) {
      console.error("Lỗi thêm nhà cung cấp:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.redirect(
          "/suppliers?error=" + encodeURIComponent("Mã nhà cung cấp đã tồn tại, vui lòng nhập mã khác!")
        );
      }
      res.redirect("/suppliers?error=" + encodeURIComponent("Lỗi thêm nhà cung cấp: " + err.message));
    }
  },

  // 3. Form sửa nhà cung cấp
  async edit(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM suppliers WHERE id = ?", [req.params.id]);
      if (!rows.length) return res.redirect("/suppliers");
      res.render("suppliers/edit", { title: "Sửa nhà cung cấp", supplier: rows[0] });
    } catch (err) {
      res.redirect("/suppliers");
    }
  },

  // 4. Cập nhật
  async update(req, res) {
    try {
      const { code, name, tax_code, phone, email, address } = req.body;
      const cleanCode = (code || "").trim().toUpperCase();
      const cleanName = (name || "").trim();

      // Kiểm tra trùng mã với nhà cung cấp khác trong DB
      const [duplicate] = await db.query(
        "SELECT id FROM suppliers WHERE code = ? AND id != ? LIMIT 1",
        [cleanCode, req.params.id]
      );
      if (duplicate.length > 0) {
        return res.redirect(
          "/suppliers?error=" +
            encodeURIComponent(`Mã nhà cung cấp '${cleanCode}' đã tồn tại, vui lòng nhập mã khác!`)
        );
      }

      await db.query(
        "UPDATE suppliers SET code = ?, name = ?, tax_code = ?, phone = ?, email = ?, address = ?, updated_at = NOW() WHERE id = ?",
        [cleanCode, cleanName, tax_code, phone, email, address, req.params.id]
      );
      res.redirect("/suppliers?msg=" + encodeURIComponent("Cập nhật nhà cung cấp thành công!"));
    } catch (err) {
      console.error("Lỗi cập nhật nhà cung cấp:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.redirect(
          "/suppliers?error=" + encodeURIComponent("Mã nhà cung cấp đã tồn tại, vui lòng nhập mã khác!")
        );
      }
      res.redirect("/suppliers?error=" + encodeURIComponent("Lỗi cập nhật: " + err.message));
    }
  },

  // 5. Xóa (Soft delete)
  async delete(req, res) {
    try {
      await db.query("UPDATE suppliers SET active = 0, updated_at = NOW() WHERE id = ?", [req.params.id]);
      res.redirect("/suppliers?msg=" + encodeURIComponent("Đã ngưng hoạt động nhà cung cấp thành công!"));
    } catch (err) {
      res.redirect("/suppliers?error=" + encodeURIComponent("Không thể xóa nhà cung cấp: " + err.message));
    }
  },
};

module.exports = supplierController;
