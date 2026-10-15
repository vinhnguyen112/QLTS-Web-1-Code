const db = require("../config/db");
const dayjs = require("dayjs");

// Lấy dữ liệu danh mục, phòng ban, nhân sự dùng chung cho các form
async function getAssetFormData() {
  const [categories] = await db.query(`
    SELECT category_id, category_name
    FROM categories
    ORDER BY category_name ASC
  `);

  const [departments] = await db.query(`
    SELECT department_id, department_name
    FROM departments
    ORDER BY department_name ASC
  `);

  const [employees] = await db.query(`
    SELECT employee_id, full_name
    FROM employees
    ORDER BY full_name ASC
  `);

  return {
    categories,
    departments,
    employees,
  };
}

const assetController = {
  // 1. Danh sách tài sản (Tìm kiếm & Phân trang)
  async index(req, res) {
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const start = (page - 1) * limit;

    // Đếm tổng số tài sản theo từ khóa tìm kiếm
    const countSql = `
      SELECT COUNT(*) AS total
      FROM assets
      WHERE asset_name LIKE ?
         OR asset_code LIKE ?
    `;

    // Lấy danh sách tài sản theo trang
    const sql = `
      SELECT
        a.asset_id,
        a.asset_code,
        a.asset_name,
        c.category_name,
        d.department_name,
        a.original_cost,
        a.status
      FROM assets a
      LEFT JOIN categories c
        ON a.category_id = c.category_id
      LEFT JOIN departments d
        ON a.department_id = d.department_id
      WHERE a.asset_name LIKE ?
         OR a.asset_code LIKE ?
      ORDER BY a.asset_id DESC
      LIMIT ${start}, ${limit}
    `;

    try {
      // Tổng số tài sản
      const [countResult] = await db.query(countSql, [
        `%${name}%`,
        `%${name}%`,
      ]);

      const totalRow = countResult[0].total;
      const totalPages = Math.ceil(totalRow / limit);

      // Danh sách tài sản của trang hiện tại
      const [assets] = await db.query(sql, [`%${name}%`, `%${name}%`]);

      // Tạo danh sách số trang
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          number: i,
          active: i == page,
        });
      }

      const { categories, departments, employees } = await getAssetFormData();

      res.render("assets/index", {
        title: "Tài sản",
        assets,
        searchName: name,
        categories,
        departments,
        employees,
        totalPages,
        pages,
      });
    } catch (err) {
      console.log("Lỗi lấy danh sách tài sản:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy danh sách tài sản");
    }
  },

  // 2. Chi tiết tài sản
  async show(req, res) {
    const sql = `
      SELECT a.*,
             c.category_name,
             d.department_name,
             e.full_name
      FROM assets a
      LEFT JOIN categories c ON a.category_id = c.category_id
      LEFT JOIN departments d ON a.department_id = d.department_id
      LEFT JOIN employees e ON a.employee_id = e.employee_id
      WHERE a.asset_id = ?
    `;

    try {
      const [assets] = await db.query(sql, [req.params.id]);

      if (assets.length === 0) {
        return res.redirect("/assets");
      }

      res.render("assets/show", {
        title: "Chi tiết tài sản",
        asset: assets[0],
      });
    } catch (err) {
      console.log("Lỗi lấy chi tiết tài sản:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy chi tiết tài sản");
    }
  },

  // 3. Thêm mới tài sản
  async create(req, res) {
    const {
      asset_code,
      asset_name,
      category_id,
      serial_number,
      purchase_date,
      original_cost,
      location,
      department_id,
      employee_id,
      status,
      description,
    } = req.body;

    const sql = `
      INSERT INTO assets (
        asset_code,
        asset_name,
        category_id,
        serial_number,
        purchase_date,
        original_cost,
        location,
        department_id,
        employee_id,
        status,
        description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      await db.query(sql, [
        asset_code,
        asset_name,
        category_id || null,
        serial_number || null,
        purchase_date || null,
        Number(original_cost) || 0,
        location || null,
        department_id || null,
        employee_id || null,
        status || "in_stock",
        description || null,
      ]);

      res.redirect("/assets");
    } catch (err) {
      console.log("Lỗi thêm tài sản:", err);
      res.status(500).send("Đã xảy ra lỗi khi thêm tài sản");
    }
  },

  // 4. Form sửa tài sản
  async edit(req, res) {
    try {
      const [assets] = await db.query(
        "SELECT * FROM assets WHERE asset_id = ?",
        [req.params.id]
      );

      if (assets.length === 0) {
        return res.redirect("/assets");
      }

      const asset = assets[0];

      // Định dạng ngày mua bằng thư viện Day.js chuẩn YYYY-MM-DD cho input date
      if (asset.purchase_date) {
        asset.purchase_date = dayjs(asset.purchase_date).format("YYYY-MM-DD");
      }

      const { categories, departments, employees } = await getAssetFormData();

      res.render("assets/asset-edit", {
        title: "Sửa tài sản",
        asset,
        categories,
        departments,
        employees,
      });
    } catch (err) {
      console.log("Lỗi lấy thông tin tài sản:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy thông tin tài sản");
    }
  },

  // 5. Cập nhật tài sản
  async update(req, res) {
    const {
      asset_code,
      asset_name,
      category_id,
      serial_number,
      purchase_date,
      original_cost,
      location,
      department_id,
      employee_id,
      status,
      description,
    } = req.body;

    const sql = `
      UPDATE assets
      SET
        asset_code = ?,
        asset_name = ?,
        category_id = ?,
        serial_number = ?,
        purchase_date = ?,
        original_cost = ?,
        location = ?,
        department_id = ?,
        employee_id = ?,
        status = ?,
        description = ?
      WHERE asset_id = ?
    `;

    try {
      await db.query(sql, [
        asset_code,
        asset_name,
        category_id || null,
        serial_number || null,
        purchase_date || null,
        Number(original_cost) || 0,
        location || null,
        department_id || null,
        employee_id || null,
        status || "in_stock",
        description || null,
        req.params.id,
      ]);

      res.redirect("/assets");
    } catch (err) {
      console.log("Lỗi cập nhật tài sản:", err);
      res.status(500).send("Đã xảy ra lỗi khi cập nhật tài sản");
    }
  },

  // 6. Xóa tài sản
  async delete(req, res) {
    try {
      await db.query("DELETE FROM assets WHERE asset_id = ?", [req.params.id]);
      res.redirect("/assets");
    } catch (err) {
      console.log("Lỗi xóa tài sản:", err);
      res.status(500).send("Đã xảy ra lỗi khi xóa tài sản");
    }
  },
};

module.exports = assetController;
