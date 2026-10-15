const db = require("../config/db");

const categoryController = {
  // 1. Danh sách danh mục (Tìm kiếm & Phân trang)
  async index(req, res) {
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const start = (page - 1) * limit;

    // Đếm tổng số danh mục
    const countSql = `
      SELECT COUNT(*) AS total
      FROM categories
      WHERE category_name LIKE ?
         OR category_code LIKE ?
    `;

    // Lấy danh sách danh mục theo trang
    const sql = `
      SELECT
        category_id,
        category_code,
        category_name,
        description
      FROM categories
      WHERE category_name LIKE ?
         OR category_code LIKE ?
      ORDER BY category_id DESC
      LIMIT ${start}, ${limit}
    `;

    try {
      const [countResult] = await db.query(countSql, [
        `%${name}%`,
        `%${name}%`,
      ]);

      const totalRow = countResult[0].total;
      const totalPages = Math.ceil(totalRow / limit);

      const [categories] = await db.query(sql, [`%${name}%`, `%${name}%`]);

      // Tạo danh sách số trang
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          number: i,
          active: i == page,
        });
      }

      res.render("categories/index", {
        title: "Danh mục tài sản",
        categories,
        searchName: name,
        totalPages,
        pages,
      });
    } catch (err) {
      console.log("Lỗi lấy danh mục:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy danh sách danh mục");
    }
  },

  // 2. Thêm danh mục
  async create(req, res) {
    const { category_code, category_name, description } = req.body;

    const sql = `
      INSERT INTO categories (category_code, category_name, description)
      VALUES (?, ?, ?)
    `;

    try {
      await db.query(sql, [category_code, category_name, description || null]);
      res.redirect("/categories");
    } catch (err) {
      console.log("Lỗi thêm danh mục:", err);
      res.status(500).send("Đã xảy ra lỗi khi thêm danh mục");
    }
  },

  // 3. Chi tiết danh mục
  async show(req, res) {
    const sql = `
      SELECT
        c.category_id,
        c.category_code,
        c.category_name,
        c.description,
        COUNT(a.asset_id) AS asset_count
      FROM categories c
      LEFT JOIN assets a ON c.category_id = a.category_id
      WHERE c.category_id = ?
      GROUP BY c.category_id, c.category_code, c.category_name, c.description
    `;

    try {
      const [categories] = await db.query(sql, [req.params.id]);

      if (categories.length === 0) {
        return res.redirect("/categories");
      }

      res.render("categories/show", {
        title: "Chi tiết danh mục tài sản",
        category: categories[0],
      });
    } catch (err) {
      console.log("Lỗi lấy chi tiết danh mục:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy chi tiết danh mục");
    }
  },

  // 4. Form sửa danh mục
  async edit(req, res) {
    const sql = `
      SELECT category_id, category_code, category_name, description
      FROM categories
      WHERE category_id = ?
    `;

    try {
      const [categories] = await db.query(sql, [req.params.id]);

      if (categories.length === 0) {
        return res.redirect("/categories");
      }

      res.render("categories/categories-edit", {
        title: "Sửa danh mục tài sản",
        category: categories[0],
      });
    } catch (err) {
      console.log("Lỗi lấy danh mục:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy thông tin danh mục");
    }
  },

  // 5. Cập nhật danh mục
  async update(req, res) {
    const { category_code, category_name, description } = req.body;

    const sql = `
      UPDATE categories
      SET category_code = ?, category_name = ?, description = ?
      WHERE category_id = ?
    `;

    try {
      await db.query(sql, [
        category_code,
        category_name,
        description || null,
        req.params.id,
      ]);

      res.redirect("/categories");
    } catch (err) {
      console.log("Lỗi cập nhật danh mục:", err);
      res.status(500).send("Đã xảy ra lỗi khi cập nhật danh mục");
    }
  },

  // 6. Xóa danh mục
  async delete(req, res) {
    try {
      await db.query("DELETE FROM categories WHERE category_id = ?", [
        req.params.id,
      ]);
      res.redirect("/categories");
    } catch (err) {
      console.log("Lỗi xóa danh mục:", err);
      res.status(500).send("Đã xảy ra lỗi khi xóa danh mục");
    }
  },
};

module.exports = categoryController;
