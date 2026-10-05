const db = require("../config/db");

const departmentController = {
  async index(req, res) {
    let sql = `
      SELECT
        d.department_id,
        d.department_code,
        d.department_name,
        d.description,
        COUNT(e.employee_id) AS employee_count
      FROM departments d
      LEFT JOIN employees e
        ON d.department_id = e.department_id
    `;

    const name = req.query.name;

    if (name) {
      sql += ` WHERE d.department_name LIKE ? OR d.department_code LIKE ?`;
    }

    sql += `
      GROUP BY
        d.department_id,
        d.department_code,
        d.department_name,
        d.description
      ORDER BY d.department_id ASC
    `;

    try {
      const [departments] = await db.query(
        sql,
        name ? [`%${name}%`, `%${name}%`] : []
      );

      res.render("departments/index", {
        title: "Phòng ban",
        departments,
        searchName: name || "",
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

  // Xem chi tiết phòng ban
  async show(req, res) {
    const id = req.params.id;

    const sql = `
      SELECT
        d.department_id,
        d.department_code,
        d.department_name,
        d.description,
        COUNT(DISTINCT e.employee_id) AS employee_count,
        COUNT(DISTINCT a.asset_id) AS asset_count
      FROM departments d
      LEFT JOIN employees e
        ON d.department_id = e.department_id
      LEFT JOIN assets a
        ON d.department_id = a.department_id
      WHERE d.department_id = ?
      GROUP BY
        d.department_id,
        d.department_code,
        d.department_name,
        d.description
    `;

    try {
      const [rows] = await db.query(sql, [id]);

      if (rows.length === 0) {
        return res.status(404).send("Không tìm thấy phòng ban");
      }

      res.render("departments/show", {
        title: "Chi tiết phòng ban",
        department: rows[0],
      });
    } catch (error) {
      console.log("Lỗi xem chi tiết phòng ban:", error);
      res.status(500).send("Lỗi cơ sở dữ liệu");
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
