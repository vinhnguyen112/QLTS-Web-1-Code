const db = require("../config/db");

const categoryController = {
  // 1. Danh sách danh mục tài sản
  async index(req, res) {
    try {
      const searchName = req.query.name || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const [[{ total }]] = await db.query(
        "SELECT COUNT(*) AS total FROM asset_categories WHERE active = 1 AND (name LIKE ? OR code LIKE ?)",
        [`%${searchName}%`, `%${searchName}%`]
      );

      const totalPages = Math.ceil(total / limit) || 1;
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      const [categories] = await db.query(
        `
        SELECT c.*,
               COUNT(a.id) AS asset_count
        FROM asset_categories c
        LEFT JOIN assets a ON c.id = a.category_id AND a.deleted_at IS NULL
        WHERE c.active = 1 AND (c.name LIKE ? OR c.code LIKE ?)
        GROUP BY c.id, c.code, c.name, c.default_life_months
        ORDER BY c.id ASC
        LIMIT ${offset}, ${limit}
      `,
        [`%${searchName}%`, `%${searchName}%`]
      );

      res.render("categories/index", {
        title: "Danh mục tài sản",
        categories,
        searchName,
        totalPages,
        pages,
      });
    } catch (err) {
      console.error("Lỗi danh mục:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Thêm danh mục mới
  async create(req, res) {
    try {
      const { code, name, default_life_months } = req.body;

      await db.query(
        "INSERT INTO asset_categories (code, name, default_life_months, active, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())",
        [code, name, default_life_months || 36]
      );

      res.redirect("/categories");
    } catch (err) {
      console.error("Lỗi thêm danh mục:", err);
      res.redirect("/categories");
    }
  },

  // 3. Form sửa danh mục
  async edit(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM asset_categories WHERE id = ?", [req.params.id]);
      if (rows.length === 0) return res.redirect("/categories");

      res.render("categories/categories-edit", {
        title: `Sửa danh mục - ${rows[0].name}`,
        category: rows[0],
      });
    } catch (err) {
      res.redirect("/categories");
    }
  },

  // 4. Cập nhật danh mục
  async update(req, res) {
    try {
      const { code, name, default_life_months } = req.body;

      await db.query(
        "UPDATE asset_categories SET code = ?, name = ?, default_life_months = ?, updated_at = NOW() WHERE id = ?",
        [code, name, default_life_months || 36, req.params.id]
      );

      res.redirect("/categories");
    } catch (err) {
      console.error("Lỗi cập nhật danh mục:", err);
      res.redirect("/categories");
    }
  },

  // 5. Xóa danh mục
  async delete(req, res) {
    try {
      await db.query("UPDATE asset_categories SET active = 0, updated_at = NOW() WHERE id = ?", [req.params.id]);
      res.redirect("/categories");
    } catch (err) {
      res.status(500).send("Không thể xóa danh mục: " + err.message);
    }
  },
};

module.exports = categoryController;
