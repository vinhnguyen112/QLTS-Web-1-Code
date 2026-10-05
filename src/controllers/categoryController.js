const db = require("../config/db");

const categoryController = {
  // Danh sách danh mục
  async index(req, res) {
    const name = req.query.name || "";

    const sql = `
      SELECT
        category_id,
        category_code,
        category_name,
        description
      FROM categories
      WHERE category_name LIKE ?
         OR category_code LIKE ?
      ORDER BY category_id ASC
    `;

    try {
      const [categories] = await db.query(sql, [`%${name}%`, `%${name}%`]);

      res.render("categories/index", {
        title: "Danh mục tài sản",
        categories,
        searchName: name,
      });
    } catch (err) {
      console.log("Lỗi lấy danh mục:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy danh sách danh mục");
    }
  },

  // Thêm danh mục
  async create(req, res) {
    const { category_code, category_name, description } = req.body;

    const sql = `
      INSERT INTO categories (
        category_code,
        category_name,
        description
      )
      VALUES (?, ?, ?)
    `;

    try {
      await db.query(sql, [category_code, category_name, description]);

      res.redirect("/categories");
    } catch (err) {
      console.log("Lỗi thêm danh mục:", err);
      res.status(500).send("Đã xảy ra lỗi khi thêm danh mục");
    }
  },

  // Xem chi tiết danh mục
  async show(req, res) {
    const category_id = req.params.id;

    const sql = `
      SELECT
        c.category_id,
        c.category_code,
        c.category_name,
        c.description,
        COUNT(a.asset_id) AS asset_count
      FROM categories c
      LEFT JOIN assets a
        ON c.category_id = a.category_id
      WHERE c.category_id = ?
      GROUP BY
        c.category_id,
        c.category_code,
        c.category_name,
        c.description
    `;

    try {
      const [categories] = await db.query(sql, [category_id]);

      if (categories.length === 0) {
        return res.status(404).send("Không tìm thấy danh mục");
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

  // Hiển thị form sửa danh mục
  async edit(req, res) {
    const category_id = req.params.id;

    const sql = `
      SELECT
        category_id,
        category_code,
        category_name,
        description
      FROM categories
      WHERE category_id = ?
    `;

    try {
      const [categories] = await db.query(sql, [category_id]);

      if (categories.length === 0) {
        return res.status(404).send("Không tìm thấy danh mục");
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

  // Cập nhật danh mục
  async update(req, res) {
    const category_id = req.params.id;

    const { category_code, category_name, description } = req.body;

    const sql = `
      UPDATE categories
      SET
        category_code = ?,
        category_name = ?,
        description = ?
      WHERE category_id = ?
    `;

    try {
      await db.query(sql, [
        category_code,
        category_name,
        description,
        category_id,
      ]);

      res.redirect("/categories");
    } catch (err) {
      console.log("Lỗi cập nhật danh mục:", err);
      res.status(500).send("Đã xảy ra lỗi khi cập nhật danh mục");
    }
  },

  // Xóa danh mục
  async delete(req, res) {
    const category_id = req.params.id;

    try {
      await db.query("DELETE FROM categories WHERE category_id = ?", [
        category_id,
      ]);

      res.redirect("/categories");
    } catch (err) {
      console.log("Lỗi xóa danh mục:", err);
      res.status(500).send("Đã xảy ra lỗi khi xóa danh mục");
    }
  },
};

module.exports = categoryController;
