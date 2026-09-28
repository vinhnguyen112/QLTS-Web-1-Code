const db = require("../config/db");

const departmentController = {
  async index(req, res) {
    const sql = `
    SELECT
        d.department_id,
        d.department_code,
        d.department_name,
        d.description,
        COUNT(e.employee_id) AS employee_count
    FROM departments d
    LEFT JOIN employees e
        ON d.department_id = e.department_id
    GROUP BY
        d.department_id,
        d.department_code,
        d.department_name,
        d.description
    ORDER BY d.department_id ASC
`;

    try {
      const [departments] = await db.query(sql);

      res.render("departments/index", {
        title: "Phòng ban",
        departments,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  },

  async create(req, res) {
    const { department_code, department_name, description } = req.body;

    const sql = `
            INSERT INTO departments
            (department_code, department_name, description)
            VALUES (?, ?, ?)
        `;

    try {
      await db.query(sql, [department_code, department_name, description]);

      res.redirect("/departments");
    } catch (error) {
      console.log(error);
      res.redirect("/departments");
    }
  },

  async edit(req, res) {
    const id = req.params.id;

    const sql = `
            SELECT
                department_id,
                department_code,
                department_name,
                description
            FROM departments
            WHERE department_id = ?
        `;

    try {
      const [rows] = await db.query(sql, [id]);

      if (rows.length === 0) {
        return res.redirect("/departments");
      }

      res.render("departments/departments-edit", {
        title: "Chỉnh sửa phòng ban",
        department: rows[0],
      });
    } catch (error) {
      console.log(error);
      res.redirect("/departments");
    }
  },

  async update(req, res) {
    const id = req.params.id;

    const { department_code, department_name, description } = req.body;

    const sql = `
            UPDATE departments
            SET
                department_code = ?,
                department_name = ?,
                description = ?
            WHERE department_id = ?
        `;

    try {
      await db.query(sql, [department_code, department_name, description, id]);

      res.redirect("/departments");
    } catch (error) {
      console.log(error);
      res.redirect("/departments");
    }
  },

  async delete(req, res) {
    const id = req.params.id;

    const sql = `
            DELETE FROM departments
            WHERE department_id = ?
        `;

    try {
      await db.query(sql, [id]);

      res.redirect("/departments");
    } catch (error) {
      console.log(error);
      res.redirect("/departments");
    }
  },
};

module.exports = departmentController;
