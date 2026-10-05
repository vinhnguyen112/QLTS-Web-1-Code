const db = require("../config/db");

const employeeController = {
  // Danh sách nhân sự
  async index(req, res) {
    const name = req.query.name || "";

    const sql = `
      SELECT
        e.employee_id,
        e.employee_code,
        e.full_name,
        e.position,
        d.department_name,
        COUNT(a.asset_id) AS asset_count
      FROM employees e
      LEFT JOIN departments d
        ON e.department_id = d.department_id
      LEFT JOIN assets a
        ON e.employee_id = a.employee_id
      WHERE e.full_name LIKE ?
         OR e.employee_code LIKE ?
      GROUP BY
        e.employee_id,
        e.employee_code,
        e.full_name,
        e.position,
        d.department_name
      ORDER BY e.employee_id ASC
    `;

    const departmentSql = `
      SELECT
        department_id,
        department_name
      FROM departments
      ORDER BY department_id ASC
    `;

    try {
      const [employees] = await db.query(sql, [`%${name}%`, `%${name}%`]);

      const [departments] = await db.query(departmentSql);

      res.render("employees/index", {
        title: "Nhân sự",
        employees,
        departments,
        searchName: name,
      });
    } catch (err) {
      console.log("Lỗi lấy nhân sự:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy danh sách nhân sự");
    }
  },

  // Thêm nhân sự
  async create(req, res) {
    const { employee_code, full_name, department_id, position, phone, email } =
      req.body;

    const sql = `
      INSERT INTO employees (
        employee_code,
        full_name,
        department_id,
        position,
        phone,
        email
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      await db.query(sql, [
        employee_code,
        full_name,
        department_id || null,
        position,
        phone,
        email,
      ]);

      res.redirect("/employees");
    } catch (err) {
      console.log("Lỗi thêm nhân sự:", err);
      res.status(500).send("Đã xảy ra lỗi khi thêm nhân sự");
    }
  },

  // Xem chi tiết nhân sự
  async show(req, res) {
    const employee_id = req.params.id;

    const sql = `
      SELECT
        e.employee_id,
        e.employee_code,
        e.full_name,
        e.position,
        e.phone,
        e.email,
        d.department_name,
        COUNT(a.asset_id) AS asset_count
      FROM employees e
      LEFT JOIN departments d
        ON e.department_id = d.department_id
      LEFT JOIN assets a
        ON e.employee_id = a.employee_id
      WHERE e.employee_id = ?
      GROUP BY
        e.employee_id,
        e.employee_code,
        e.full_name,
        e.position,
        e.phone,
        e.email,
        d.department_name
    `;

    try {
      const [employees] = await db.query(sql, [employee_id]);

      if (employees.length === 0) {
        return res.status(404).send("Không tìm thấy nhân sự");
      }

      res.render("employees/show", {
        title: "Chi tiết nhân sự",
        employee: employees[0],
      });
    } catch (err) {
      console.log("Lỗi lấy chi tiết nhân sự:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy chi tiết nhân sự");
    }
  },

  // Hiển thị form sửa nhân sự
  async edit(req, res) {
    const employee_id = req.params.id;

    const employeeSql = `
      SELECT
        employee_id,
        employee_code,
        full_name,
        department_id,
        position,
        phone,
        email,
        description
      FROM employees
      WHERE employee_id = ?
    `;

    const departmentSql = `
      SELECT
        department_id,
        department_name
      FROM departments
      ORDER BY department_id ASC
    `;

    try {
      const [employees] = await db.query(employeeSql, [employee_id]);

      if (employees.length === 0) {
        return res.status(404).send("Không tìm thấy nhân sự");
      }

      const [departments] = await db.query(departmentSql);

      res.render("employees/employees-edit", {
        title: "Chỉnh sửa nhân sự",
        employee: employees[0],
        departments,
      });
    } catch (err) {
      console.log("Lỗi lấy nhân sự:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy thông tin nhân sự");
    }
  },

  // Cập nhật nhân sự
  async update(req, res) {
    const employee_id = req.params.id;

    const { employee_code, full_name, department_id, position, phone, email } =
      req.body;

    const sql = `
      UPDATE employees
      SET
        employee_code = ?,
        full_name = ?,
        department_id = ?,
        position = ?,
        phone = ?,
        email = ?
      WHERE employee_id = ?
    `;

    try {
      await db.query(sql, [
        employee_code,
        full_name,
        department_id || null,
        position,
        phone,
        email,
        employee_id,
      ]);

      res.redirect("/employees");
    } catch (err) {
      console.log("Lỗi cập nhật nhân sự:", err);
      res.status(500).send("Đã xảy ra lỗi khi cập nhật nhân sự");
    }
  },

  // Xóa nhân sự
  async delete(req, res) {
    const employee_id = req.params.id;

    const sql = `
      DELETE FROM employees
      WHERE employee_id = ?
    `;

    try {
      await db.query(sql, [employee_id]);

      res.redirect("/employees");
    } catch (err) {
      console.log("Lỗi xóa nhân sự:", err);
      res.status(500).send("Đã xảy ra lỗi khi xóa nhân sự");
    }
  },
};

module.exports = employeeController;
