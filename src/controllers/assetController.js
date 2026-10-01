const db = require("../config/db");

const assetController = {
  // Danh sách tài sản
  async index(req, res) {
    let sql = `
    SELECT
      a.asset_id,
      a.asset_code,
      a.asset_name,
      c.category_name,
      d.department_name,
      a.original_cost,
      a.status
    FROM assets a
    LEFT JOIN categories c ON a.category_id = c.category_id
    LEFT JOIN departments d ON a.department_id = d.department_id
  `;

    const name = req.query.name;

    if (name) {
      sql += ` WHERE a.asset_name LIKE ?`;
    }

    sql += ` ORDER BY a.asset_id ASC`;

    try {
      const [assets] = await db.query(sql, name ? [`%${name}%`] : []);

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

      res.render("assets/index", {
        title: "Tài sản",
        assets,
        searchName: name || "",
        categories,
        departments,
        employees,
      });
    } catch (err) {
      console.log("Lỗi lấy tài sản:", err);
      res.status(500).send("Lỗi cơ sở dữ liệu");
    }
  },
  // Hiển thị form thêm tài sản
  async createForm(req, res) {
    try {
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

      res.render("assets/asset-create", {
        title: "Thêm tài sản",
        categories,
        departments,
        employees,
      });
    } catch (err) {
      console.log("Lỗi lấy dữ liệu form:", err);
      res.status(500).send("Lỗi cơ sở dữ liệu");
    }
  },

  // Xem chi tiết tài sản
async show(req, res) {

  const asset_id = req.params.id;

  const sql = `
    SELECT
      a.*,
      c.category_name,
      d.department_name,
      e.full_name
    FROM assets a
    LEFT JOIN categories c
      ON a.category_id = c.category_id
    LEFT JOIN departments d
      ON a.department_id = d.department_id
    LEFT JOIN employees e
      ON a.employee_id = e.employee_id
    WHERE a.asset_id = ?
  `;

  try {

    const [assets] = await db.query(sql, [asset_id]);

    if (assets.length === 0) {
      return res.status(404).send("Không tìm thấy tài sản");
    }

    res.render("assets/show", {
      title: "Chi tiết tài sản",
      asset: assets[0]
    });

  } catch (err) {

    console.log("Lỗi xem chi tiết tài sản:", err);
    res.status(500).send("Lỗi cơ sở dữ liệu");

  }
},

  // Thêm tài sản
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
        category_id,
        serial_number,
        purchase_date,
        original_cost,
        location,
        department_id,
        employee_id,
        status,
        description,
      ]);

      res.redirect("/assets");
    } catch (err) {
      console.log("Lỗi thêm tài sản:", err);
      res.status(500).send("Lỗi thêm tài sản");
    }
  },

  // Hiển thị form sửa tài sản
  async edit(req, res) {
    const asset_id = req.params.id;

    try {
      // Lấy tài sản cần sửa
      const [assets] = await db.query(
        "SELECT * FROM assets WHERE asset_id = ?",
        [asset_id],
      );

      const asset = assets[0];

      if (!asset) {
        return res.status(404).send("Không tìm thấy tài sản");
      }

      // Định dạng ngày mua
      if (asset.purchase_date) {
        asset.purchase_date = new Date(asset.purchase_date)
          .toISOString()
          .split("T")[0];
      }

      // Lấy danh mục
      const [categories] = await db.query(`
        SELECT category_id, category_name
        FROM categories
        ORDER BY category_name ASC
      `);

      // Lấy phòng ban
      const [departments] = await db.query(`
        SELECT department_id, department_name
        FROM departments
        ORDER BY department_name ASC
      `);

      // Lấy nhân viên
      const [employees] = await db.query(`
        SELECT employee_id, full_name
        FROM employees
        ORDER BY full_name ASC
      `);

      res.render("assets/asset-edit", {
        title: "Sửa tài sản",
        asset,
        categories,
        departments,
        employees,
      });
    } catch (err) {
      console.log("Lỗi lấy tài sản:", err);
      res.status(500).send("Lỗi cơ sở dữ liệu");
    }
  },

  // Cập nhật tài sản
  async update(req, res) {
    const asset_id = req.params.id;

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
        category_id,
        serial_number,
        purchase_date,
        original_cost,
        location,
        department_id,
        employee_id,
        status,
        description,
        asset_id,
      ]);

      res.redirect("/assets");
    } catch (err) {
      console.log("Lỗi cập nhật tài sản:", err);
      res.status(500).send("Lỗi cập nhật tài sản");
    }
  },

  // Xóa tài sản
  async delete(req, res) {
    const asset_id = req.params.id;

    try {
      await db.query("DELETE FROM assets WHERE asset_id = ?", [asset_id]);

      res.redirect("/assets");
    } catch (err) {
      console.log("Lỗi xóa tài sản:", err);
      res.status(500).send("Lỗi xóa tài sản");
    }
  },
};

module.exports = assetController;
