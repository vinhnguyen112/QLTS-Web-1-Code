const db = require("../config/db");

// Tạo danh sách số trang cho phân trang
function buildPageList(totalRows, limit, currentPage) {
  const totalPages = Math.ceil(totalRows / limit);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push({ number: i, active: i == currentPage });
  }
  return { totalPages, pages };
}

const categoryController = {
  // 1. Danh sách danh mục — có tìm kiếm và phân trang
  async index(req, res) {
    const searchName  = req.query.name;
    const currentPage = parseInt(req.query.page) || 1;
    const limit       = 10;
    const offset      = (currentPage - 1) * limit;

    const searchParam = `%${searchName}%`;

    // Đếm tổng để tính số trang
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total
       FROM categories
       WHERE category_name LIKE ? OR category_code LIKE ?`,
      [searchParam, searchParam]
    );

    const { totalPages, pages } = buildPageList(total, limit, currentPage);

    const [categories] = await db.query(
      `SELECT category_id, category_code, category_name, default_useful_months, description
       FROM categories
       WHERE category_name LIKE ? OR category_code LIKE ?
       ORDER BY category_id DESC
       LIMIT ${offset}, ${limit}`,
      [searchParam, searchParam]
    );

    res.render("categories/index", {
      title: "Danh mục tài sản",
      categories,
      searchName,
      totalPages,
      pages,
    });
  },

  // 2. Chi tiết danh mục — kèm số lượng tài sản thuộc danh mục
  async show(req, res) {
    const [rows] = await db.query(
      `SELECT
         c.category_id, c.category_code, c.category_name,
         c.default_useful_months, c.description,
         COUNT(a.asset_id) AS asset_count
       FROM categories c
       LEFT JOIN assets a ON c.category_id = a.category_id
       WHERE c.category_id = ?
       GROUP BY c.category_id, c.category_code, c.category_name, c.default_useful_months, c.description`,
      [req.params.id]
    );

    if (rows.length === 0) return res.redirect("/categories");

    res.render("categories/show", {
      title: "Chi tiết danh mục tài sản",
      category: rows[0],
    });
  },

  // 3. Thêm danh mục mới (nhận dữ liệu từ form POST)
  async create(req, res) {
    const { category_code, category_name, default_useful_months, description } = req.body;

    await db.query(
      `INSERT INTO categories (category_code, category_name, default_useful_months, description)
       VALUES (?, ?, ?, ?)`,
      [
        category_code,
        category_name,
        parseInt(default_useful_months) || 36,
        description || null,
      ]
    );

    res.redirect("/categories");
  },

  // 4. Hiển thị form sửa danh mục
  async edit(req, res) {
    const [rows] = await db.query(
      `SELECT category_id, category_code, category_name, default_useful_months, description
       FROM categories
       WHERE category_id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) return res.redirect("/categories");

    res.render("categories/categories-edit", {
      title: "Sửa danh mục tài sản",
      category: rows[0],
    });
  },

  // 5. Cập nhật thông tin danh mục 
  async update(req, res) {
    const { category_code, category_name, default_useful_months, description } = req.body;

    await db.query(
      `UPDATE categories
       SET category_code = ?, category_name = ?, default_useful_months = ?, description = ?
       WHERE category_id = ?`,
      [
        category_code,
        category_name,
        parseInt(default_useful_months) || 36,
        description || null,
        req.params.id,
      ]
    );

    res.redirect("/categories");
  },

  // 6. Xóa danh mục
  async delete(req, res) {
    await db.query("DELETE FROM categories WHERE category_id = ?", [req.params.id]);

    res.redirect("/categories");
  },
};

module.exports = categoryController;
