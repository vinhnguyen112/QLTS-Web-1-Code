const db = require("../config/db");

const supplierController = {
  // 1. Danh sách nhà cung cấp (Tìm kiếm & Phân trang)
  async index(req, res) {
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const start = (page - 1) * limit;

    const countSql = `
      SELECT COUNT(*) AS total
      FROM suppliers
      WHERE supplier_name LIKE ? OR tax_code LIKE ?
    `;

    const sql = `
      SELECT 
        s.supplier_id,
        s.supplier_name,
        s.tax_code,
        s.contact_phone,
        s.contact_email,
        s.address,
        COUNT(a.asset_id) AS asset_count
      FROM suppliers s
      LEFT JOIN assets a ON s.supplier_id = a.supplier_id
      WHERE s.supplier_name LIKE ? OR s.tax_code LIKE ?
      GROUP BY s.supplier_id, s.supplier_name, s.tax_code, s.contact_phone, s.contact_email, s.address
      ORDER BY s.supplier_id DESC
      LIMIT ${start}, ${limit}
    `;

    try {
      const [countResult] = await db.query(countSql, [`%${name}%`, `%${name}%`]);
      const totalRow = countResult[0].total;
      const totalPages = Math.ceil(totalRow / limit);

      const [suppliers] = await db.query(sql, [`%${name}%`, `%${name}%`]);

      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i == page });
      }

      res.render("suppliers/index", {
        title: "Nhà cung cấp",
        suppliers,
        searchName: name,
        totalPages,
        pages,
      });
    } catch (err) {
      console.log("Lỗi lấy danh sách nhà cung cấp:", err);
      res.status(500).send("Đã xảy ra lỗi khi tải danh sách nhà cung cấp");
    }
  },

  // 2. Thêm mới nhà cung cấp
  async create(req, res) {
    const { supplier_name, tax_code, contact_phone, contact_email, address } = req.body;
    try {
      await db.query(
        "INSERT INTO suppliers (supplier_name, tax_code, contact_phone, contact_email, address) VALUES (?, ?, ?, ?, ?)",
        [supplier_name, tax_code || null, contact_phone || null, contact_email || null, address || null]
      );
      res.redirect("/suppliers");
    } catch (err) {
      console.log("Lỗi thêm nhà cung cấp:", err);
      res.status(500).send("Đã xảy ra lỗi khi thêm nhà cung cấp");
    }
  },

  // 3. Form chỉnh sửa
  async edit(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM suppliers WHERE supplier_id = ?", [req.params.id]);
      if (rows.length === 0) return res.redirect("/suppliers");

      res.render("suppliers/edit", {
        title: "Sửa nhà cung cấp",
        supplier: rows[0],
      });
    } catch (err) {
      console.log("Lỗi tải thông tin nhà cung cấp:", err);
      res.status(500).send("Đã xảy ra lỗi");
    }
  },

  // 4. Cập nhật
  async update(req, res) {
    const { supplier_name, tax_code, contact_phone, contact_email, address } = req.body;
    try {
      await db.query(
        "UPDATE suppliers SET supplier_name = ?, tax_code = ?, contact_phone = ?, contact_email = ?, address = ? WHERE supplier_id = ?",
        [supplier_name, tax_code || null, contact_phone || null, contact_email || null, address || null, req.params.id]
      );
      res.redirect("/suppliers");
    } catch (err) {
      console.log("Lỗi cập nhật nhà cung cấp:", err);
      res.status(500).send("Đã xảy ra lỗi khi cập nhật");
    }
  },

  // 5. Xóa
  async delete(req, res) {
    try {
      await db.query("DELETE FROM suppliers WHERE supplier_id = ?", [req.params.id]);
      res.redirect("/suppliers");
    } catch (err) {
      console.log("Lỗi xóa nhà cung cấp:", err);
      res.status(500).send("Không thể xóa nhà cung cấp đang có tài sản liên kết");
    }
  },
};

module.exports = supplierController;
