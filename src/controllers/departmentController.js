const db = require("../config/db");

const departmentController = {
  // 1. Danh sách phòng ban (Tìm kiếm & Phân trang)
  async index(req, res) {
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const start = (page - 1) * limit;

    // Đếm tổng số phòng ban
    const countSql = `
      SELECT COUNT(*) AS total
      FROM departments
      WHERE department_name LIKE ?
         OR department_code LIKE ?
    `;

    // Lấy danh sách phòng ban
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
      ORDER BY d.department_id DESC
      LIMIT ${start}, ${limit}
    `;

    try {
      const [countResult] = await db.query(countSql, [
        `%${name}%`,
        `%${name}%`,
      ]);

      const totalRow = countResult[0].total;
      const totalPages = Math.ceil(totalRow / limit);

      const [departments] = await db.query(sql, [`%${name}%`, `%${name}%`]);

      // Tạo danh sách số trang
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          number: i,
          active: i == page,
        });
      }

      res.render("departments/index", {
        title: "Phòng ban",
        departments,
        searchName: name,
        totalPages,
        pages,
      });
    } catch (err) {
      console.log("Lỗi lấy phòng ban:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy danh sách phòng ban");
    }
  },

  // 2. Thêm phòng ban
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
      await db.query(sql, [department_code, department_name, description || null]);
      res.redirect("/departments");
    } catch (err) {
      console.log("Lỗi thêm phòng ban:", err);
      res.status(500).send("Đã xảy ra lỗi khi thêm phòng ban");
    }
  },

  // 3. Chi tiết phòng ban
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
        return res.redirect("/departments");
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

  // 4. Form sửa phòng ban
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
        return res.redirect("/departments");
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

  // 5. Cập nhật phòng ban
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
        description || null,
        department_id,
      ]);

      res.redirect("/departments");
    } catch (err) {
      console.log("Lỗi cập nhật phòng ban:", err);
      res.status(500).send("Đã xảy ra lỗi khi cập nhật phòng ban");
    }
  },

  // 6. Xóa phòng ban
  async delete(req, res) {
    const department_id = req.params.id;

    try {
      await db.query("DELETE FROM departments WHERE department_id = ?", [department_id]);
      res.redirect("/departments");
    } catch (err) {
      console.log("Lỗi xóa phòng ban:", err);
      res.status(500).send("Đã xảy ra lỗi khi xóa phòng ban");
    }
  },
};

module.exports = departmentController;
