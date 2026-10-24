const db = require("../config/db");
const dayjs = require("dayjs");

async function getFormData() {
  const [categories] = await db.query(
    "SELECT category_id, category_name, default_useful_months FROM categories ORDER BY category_name ASC"
  );
  const [suppliers] = await db.query(
    "SELECT supplier_id, supplier_name FROM suppliers ORDER BY supplier_name ASC"
  );
  const [departments] = await db.query(
    "SELECT department_id, department_name FROM departments ORDER BY department_name ASC"
  );
  const [locations] = await db.query(`
    SELECT l.location_id, l.location_name, d.department_name
    FROM locations l
    JOIN departments d ON l.department_id = d.department_id
    ORDER BY d.department_name ASC, l.location_name ASC
  `);
  const [employees] = await db.query(
    "SELECT employee_id, employee_code, full_name, department_id FROM employees ORDER BY full_name ASC"
  );

  return { categories, suppliers, departments, locations, employees };
}

// Tạo danh sách số trang cho phân trang
function buildPageList(totalRows, limit, currentPage) {
  const totalPages = Math.ceil(totalRows / limit);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push({ number: i, active: i == currentPage });
  }
  return { totalPages, pages };
}


const assetController = {
  // 1. Danh sách tài sản — có tìm kiếm, lọc, phân trang
  async index(req, res) {
    const searchName     = req.query.name  ;
    const filterStatus   = req.query.status   ;
    const filterCategory = req.query.category_id   ;
    const currentPage    = parseInt(req.query.page) || 1;
    const limit          = 10;
    const offset         = (currentPage - 1) * limit;

    const searchParam = `%${searchName}%`;

    let where  = "WHERE (a.asset_name LIKE ? OR a.asset_code LIKE ?)";
    const params = [searchParam, searchParam];

    if (filterStatus)   { where += " AND a.status = ?";      params.push(filterStatus);   }
    if (filterCategory) { where += " AND a.category_id = ?"; params.push(filterCategory); }

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
         d.department_name,
         e.full_name AS current_employee_name
       FROM assets a
       LEFT JOIN categories c  ON a.category_id        = c.category_id
       LEFT JOIN suppliers  s  ON a.supplier_id         = s.supplier_id
       LEFT JOIN locations  l  ON a.location_id         = l.location_id
       LEFT JOIN departments d ON l.department_id       = d.department_id
       LEFT JOIN employees   e ON a.current_employee_id = e.employee_id
       ${where}
       ORDER BY a.asset_id DESC
       LIMIT ${offset}, ${limit}`,
      params
    );

    const { categories, suppliers, locations, employees } = await getFormData();

    res.render("assets/index", {
      title: "Danh sách tài sản",
      assets,
      searchName,
      filterStatus,
      filterCategory,
      categories,
      suppliers,
      locations,
      employees,
      totalPages,
      pages,
    });
  },

  // 2. Chi tiết một tài sản
  async show(req, res) {
    const assetId = req.params.id;

    const [rows] = await db.query(
      `SELECT a.*,
              c.category_name, c.default_useful_months,
              s.supplier_name, s.contact_phone AS supplier_phone,
              l.location_name,
              d.department_name, d.department_id,
              e.full_name   AS current_employee_name,
              e.employee_code AS current_employee_code,
              e.phone       AS employee_phone
       FROM assets a
       LEFT JOIN categories c  ON a.category_id        = c.category_id
       LEFT JOIN suppliers  s  ON a.supplier_id         = s.supplier_id
       LEFT JOIN locations  l  ON a.location_id         = l.location_id
       LEFT JOIN departments d ON l.department_id       = d.department_id
       LEFT JOIN employees   e ON a.current_employee_id = e.employee_id
       WHERE a.asset_id = ?`,
      [assetId]
    );

    // Không tìm thấy → về danh sách
    if (rows.length === 0) return res.redirect("/assets");

    const asset = rows[0];
    const { locations, employees } = await getFormData();
    const today = dayjs().format("YYYY-MM-DD");

    res.render("assets/show", {
      title: `Tài sản: ${asset.asset_name}`,
      asset,
      locations,
      employees,
      today,
    });
  },

  // 3. Thêm tài sản mới (nhận dữ liệu từ form POST)
  async create(req, res) {
    const {
      asset_code, asset_name, category_id, supplier_id, location_id,
      original_cost, purchase_date, useful_life_months, specifications,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO assets
         (asset_code, asset_name, category_id, supplier_id, location_id,
          current_employee_id, original_cost, residual_value,
          purchase_date, useful_life_months, status, specifications)
       VALUES (?, ?, ?, ?, ?, NULL, ?, 0, ?, ?, 'in_stock', ?)`,
      [
        asset_code,
        asset_name,
        category_id,
        supplier_id        || null,
        location_id        || null,
        Number(original_cost)      || 0,
        purchase_date              || dayjs().format("YYYY-MM-DD"),
        Number(useful_life_months) || 36,
        specifications     || null,
      ]
    );

    // Sau khi thêm → chuyển thẳng vào trang chi tiết
    res.redirect(`/assets/${result.insertId}`);
  },

  // 4. Hiển thị form sửa tài sản
  async edit(req, res) {
    const [rows] = await db.query(
      "SELECT * FROM assets WHERE asset_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) return res.redirect("/assets");

    const asset = rows[0];

    // Định dạng ngày để input[type=date] hiển thị đúng
    if (asset.purchase_date) {
      asset.purchase_date = dayjs(asset.purchase_date).format("YYYY-MM-DD");
    }

    const { categories, suppliers, locations, employees } = await getFormData();

    res.render("assets/asset-edit", {
      title: "Sửa tài sản",
      asset,
      categories,
      suppliers,
      locations,
      employees,
    });
  },

  // 5. Cập nhật thông tin tài sản 
  async update(req, res) {
    const {
      asset_code, asset_name, category_id, supplier_id, location_id,
      current_employee_id, original_cost, residual_value,
      purchase_date, useful_life_months, status, specifications,
    } = req.body;

    await db.query(
      `UPDATE assets
       SET asset_code = ?, asset_name = ?, category_id = ?,
           supplier_id = ?, location_id = ?, current_employee_id = ?,
           original_cost = ?, residual_value = ?, purchase_date = ?,
           useful_life_months = ?, status = ?, specifications = ?
       WHERE asset_id = ?`,
      [
        asset_code,
        asset_name,
        category_id,
        supplier_id         || null,
        location_id         || null,
        current_employee_id || null,
        Number(original_cost)      || 0,
        Number(residual_value)     || 0,
        purchase_date               || dayjs().format("YYYY-MM-DD"),
        Number(useful_life_months)  || 36,
        status              || "in_stock",
        specifications      || null,
        req.params.id,
      ]
    );

    res.redirect(`/assets/${req.params.id}`);
  },

  // 6. Xóa vĩnh viễn tài sản
  async delete(req, res) {
    const assetId = req.params.id;

    await db.query("DELETE FROM assets WHERE asset_id = ?", [assetId]);

    res.redirect("/assets");
  },

};

module.exports = assetController;
