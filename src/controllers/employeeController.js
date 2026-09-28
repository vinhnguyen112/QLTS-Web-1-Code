const db = require("../config/db");

const employeeController = {
  async index(req, res) {
    const employeeSql = `
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
      const [employees] = await db.query(employeeSql);
      const [departments] = await db.query(departmentSql);

      res.render("employees/index", {
        title: "Nhân sự",
        employees,
        departments,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  },

  async create(req, res) {
    const { employee_code, full_name, department_id, position, phone, email } =
      req.body;

    const sql = `
      INSERT INTO employees
      (
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
      res.status(500).send("Lỗi cơ sở dữ liệu");
    }
  },

  async edit(req, res) {
    const id = req.params.id;

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
      const [rows] = await db.query(employeeSql, [id]);

      if (rows.length === 0) {
        return res.redirect("/employees");
      }

      const [departments] = await db.query(departmentSql);

      res.render("employees/employees-edit", {
        title: "Chỉnh sửa nhân sự",
        employee: rows[0],
        departments,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/employees");
    }
  },

  async update(req, res) {
    const { id } = req.params;

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
        id,
      ]);

      res.redirect("/employees");
    } catch (err) {
      console.log("Lỗi cập nhật nhân sự:", err);
      res.status(500).send("Lỗi cơ sở dữ liệu");
    }
  },

  async delete(req, res) {
    const id = req.params.id;

    const sql = `
      DELETE FROM employees
      WHERE employee_id = ?
    `;

    try {
      await db.query(sql, [id]);

      res.redirect("/employees");
    } catch (error) {
      console.log(error);
      res.redirect("/employees");
    }
  },
};

module.exports = employeeController;
