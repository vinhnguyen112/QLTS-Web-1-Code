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


const warehouseController = {

  async index(req, res) {
    const searchName     = req.query.name        || "";
    const filterCategory = req.query.category_id || "";
    const filterLocation = req.query.location_id || "";
    const currentPage    = parseInt(req.query.page) || 1;
    const limit          = 10;
    const offset         = (currentPage - 1) * limit;

    const searchParam = `%${searchName}%`;

    // Xây điều kiện WHERE động — chỉ thêm filter khi người dùng có chọn
    let where   = "WHERE a.status = 'in_stock' AND (a.asset_name LIKE ? OR a.asset_code LIKE ?)";
    const params = [searchParam, searchParam];

    if (filterCategory) { where += " AND a.category_id = ?"; params.push(filterCategory); }
    if (filterLocation) { where += " AND a.location_id = ?"; params.push(filterLocation); }

    // Đếm tổng để tính số trang
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM assets a ${where}`,
      params
    );

    const { totalPages, pages } = buildPageList(total, limit, currentPage);

    // Lấy danh sách tài sản của trang hiện tại
    const [assets] = await db.query(
      `SELECT
         a.asset_id, a.asset_code, a.asset_name,
         a.original_cost, a.status, a.purchase_date, a.useful_life_months,
         c.category_name,
         s.supplier_name,
         l.location_name,
         d.department_name
       FROM assets a
       LEFT JOIN categories  c ON a.category_id  = c.category_id
       LEFT JOIN suppliers   s ON a.supplier_id   = s.supplier_id
       LEFT JOIN locations   l ON a.location_id   = l.location_id
       LEFT JOIN departments d ON l.department_id = d.department_id
       ${where}
       ORDER BY a.asset_id DESC
       LIMIT ${offset}, ${limit}`,
      params
    );

    // Dữ liệu cho bộ lọc và modal bàn giao
    const [categories] = await db.query(
      "SELECT category_id, category_name FROM categories ORDER BY category_name ASC"
    );
    const [locations] = await db.query(
      `SELECT l.location_id, l.location_name, d.department_name
       FROM locations l
       JOIN departments d ON l.department_id = d.department_id
       ORDER BY l.location_name ASC`
    );
    const [employees] = await db.query(
      "SELECT employee_id, employee_code, full_name FROM employees ORDER BY full_name ASC"
    );

    res.render("warehouse/index", {
      title: "Kho tài sản",
      assets,
      categories,
      locations,
      employees,
      searchName,
      filterCategory,
      filterLocation,
      totalPages,
      pages,
    });
  },
};

module.exports = warehouseController;
