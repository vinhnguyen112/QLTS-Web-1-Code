const db = require("../config/db");

const categoryController = {
  async index(req, res) {
    let sql = `
      SELECT
        category_id,
        category_code,
        category_name,
        description
      FROM categories
    `;

    const name = req.query.name;

    if (name) {
      sql += ` WHERE category_name LIKE ? OR category_code LIKE ?`;
    }

    sql += ` ORDER BY category_id ASC`;

    try {
      const [categories] = await db.query(
        sql,
        name ? [`%${name}%`, `%${name}%`] : []
      );

      res.render("categories/index", {
        title: "Danh mục tài sản",
        categories,
        searchName: name || "",
      });
    } catch (err) {
      console.log("Lỗi lấy danh sách danh mục:", err);
      res.status(500).send("Lỗi cơ sở dữ liệu");
    }
  },

  async create(req, res) {
    const {
      category_code,
      category_name,
      description
    } = req.body;

    const sql = `
      INSERT INTO categories
      (category_code, category_name, description)
      VALUES (?, ?, ?)
    `;

    try {
      await db.query(sql, [
        category_code,
        category_name,
        description
      ]);

      res.redirect("/categories");
    } catch (err) {
    console.log("Lỗi thêm danh mục:", err);
    res.status(500).send("Lỗi thêm danh mục: " + err.message);
    }
  },

  // Xem chi tiết danh mục
  async show(req, res) {
    const { id } = req.params;

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
      const [rows] = await db.query(sql, [id]);

      if (rows.length === 0) {
        return res.status(404).send("Không tìm thấy danh mục");
      }

      res.render("categories/show", {
        title: "Chi tiết danh mục tài sản",
        category: rows[0],
      });
    } catch (err) {
      console.log("Lỗi xem chi tiết danh mục:", err);
      res.status(500).send("Lỗi cơ sở dữ liệu");
    }
  },

  async edit(req, res) {
  const { id } = req.params;

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
    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).send("Không tìm thấy danh mục");
    }

    res.render("categories/categories-edit", {
      title: "Sửa danh mục tài sản",
      category: rows[0]
    });

  } catch (err) {
    console.log("Lỗi lấy danh mục:", err);
    res.status(500).send("Lỗi cơ sở dữ liệu");
  }
  },

  async update(req, res) {
  const { id } = req.params;

  const {
    category_code,
    category_name,
    description
  } = req.body;

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
      id
    ]);

    res.redirect("/categories");

  } catch (err) {
    console.log("Lỗi cập nhật danh mục:", err);
    res.status(500).send("Lỗi cập nhật danh mục: " + err.message);
  }
},
  async delete(req, res) {
    const { id } = req.params;

    const sql = `
      DELETE FROM categories
      WHERE category_id = ?
    `;

    try {
      await db.query(sql, [id]);

      res.redirect("/categories");
    } catch (err) {
      console.log("Lỗi xóa danh mục:", err);
      res.status(500).send("Lỗi xóa danh mục: " + err.message);
    }
  }
};

module.exports = categoryController;