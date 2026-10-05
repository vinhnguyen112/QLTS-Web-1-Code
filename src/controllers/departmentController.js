const db = require("../config/db");

const departmentController = {
  // Danh sách phòng ban
  async index(req, res) {
    const name = req.query.name || "";

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
      WHERE d.department_name LIKE ?
         OR d.department_code LIKE ?
      GROUP BY
        d.department_id,
        d.department_code,
        d.department_name,
        d.description
      ORDER BY d.department_id ASC
    `;

    try {
      const [departments] = await db.query(sql, [`%${name}%`, `%${name}%`]);

      res.render("departments/index", {
        title: "Phòng ban",
        departments,
        searchName: name,
      });
    } catch (err) {
      console.log("Lỗi lấy phòng ban:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy danh sách phòng ban");
    }
  },

  // Thêm phòng ban
  async create(req, res) {
    const { department_code, department_name, description } = req.body;

    const sql = `
      INSERT INTO departments (
        department_code,
        department_name,
        description
      )
      VALUES (?, ?, ?)
    `;

    try {
      await db.query(sql, [department_code, department_name, description]);

      res.redirect("/departments");
    } catch (err) {
      console.log("Lỗi thêm phòng ban:", err);
      res.status(500).send("Đã xảy ra lỗi khi thêm phòng ban");
    }
  },

  // Xem chi tiết phòng ban
  async show(req, res) {
    const department_id = req.params.id;

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
      const [departments] = await db.query(sql, [department_id]);

      if (departments.length === 0) {
        return res.status(404).send("Không tìm thấy phòng ban");
      }

      res.render("departments/show", {
        title: "Chi tiết phòng ban",
        department: departments[0],
      });
    } catch (err) {
      console.log("Lỗi lấy chi tiết phòng ban:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy chi tiết phòng ban");
    }
  },

  // Hiển thị form sửa phòng ban
  async edit(req, res) {
    const department_id = req.params.id;

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
      const [departments] = await db.query(sql, [department_id]);

      if (departments.length === 0) {
        return res.status(404).send("Không tìm thấy phòng ban");
      }

      res.render("departments/departments-edit", {
        title: "Chỉnh sửa phòng ban",
        department: departments[0],
      });
    } catch (err) {
      console.log("Lỗi lấy phòng ban:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy thông tin phòng ban");
    }
  },

  // Cập nhật phòng ban
  async update(req, res) {
    const department_id = req.params.id;

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
      await db.query(sql, [
        department_code,
        department_name,
        description,
        department_id,
      ]);

      res.redirect("/departments");
    } catch (err) {
      console.log("Lỗi cập nhật phòng ban:", err);
      res.status(500).send("Đã xảy ra lỗi khi cập nhật phòng ban");
    }
  },

  // Xóa phòng ban
  async delete(req, res) {
    const department_id = req.params.id;

    const sql = `
      DELETE FROM departments
      WHERE department_id = ?
    `;

    try {
      await db.query(sql, [department_id]);

      res.redirect("/departments");
    } catch (err) {
      console.log("Lỗi xóa phòng ban:", err);
      res.status(500).send("Đã xảy ra lỗi khi xóa phòng ban");
    }
  },
};

module.exports = departmentController;
