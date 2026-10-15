const db = require("../config/db");
const dayjs = require("dayjs");

// Lấy danh sách phòng ban, nhân sự, danh mục 
async function getFormData() {
  const [departments] = await db.query("SELECT * FROM departments");
  const [employees] = await db.query("SELECT * FROM employees");
  const [categories] = await db.query("SELECT * FROM categories");
  return { departments, employees, categories };
}

const procurementController = {
  // 1. Danh sách đề nghị mua sắm (Tìm kiếm & Phân trang)
  async index(req, res) {
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const start = (page - 1) * limit;

    try {
      // Đếm tổng số bản ghi để tính số trang
      const countSql = "SELECT COUNT(*) AS total FROM procurements WHERE procurement_code LIKE ?";
      const [countResult] = await db.query(countSql, [`%${name}%`]);
      const totalPages = Math.ceil(countResult[0].total / limit);

      // Lấy danh sách đề nghị kèm tên phòng ban và người đề nghị
      const sql = `
        SELECT p.*, d.department_name, e.full_name AS requester_name
        FROM procurements p
        LEFT JOIN departments d ON p.department_id = d.department_id
        LEFT JOIN employees e ON p.requester_id = e.employee_id
        WHERE p.procurement_code LIKE ?
        ORDER BY p.procurement_id DESC
        LIMIT ${start}, ${limit}
      `;
      const [procurements] = await db.query(sql, [`%${name}%`]);

      // Tạo mảng số trang
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i == page });
      }

      // Dữ liệu cho modal thêm mới
      const { departments, employees, categories } = await getFormData();

      res.render("procurement/index", {
        title: "Mua sắm tài sản",
        procurements,
        searchName: name,
        departments,
        employees,
        categories,
        totalPages,
        pages,
      });
    } catch (err) {
      console.log("Lỗi lấy danh sách đề nghị:", err);
      res.status(500).send("Lỗi lấy danh sách đề nghị mua sắm");
    }
  },

  // 2. Chi tiết đề nghị mua sắm
  async show(req, res) {
    try {
      // Lấy thông tin đề nghị
      const sql = `
        SELECT p.*, d.department_name, e.full_name AS requester_name
        FROM procurements p
        LEFT JOIN departments d ON p.department_id = d.department_id
        LEFT JOIN employees e ON p.requester_id = e.employee_id
        WHERE p.procurement_id = ?
      `;
      const [procurements] = await db.query(sql, [req.params.id]);

      if (procurements.length === 0) {
        return res.redirect("/procurement");
      }

      // Lấy danh sách mặt hàng của đề nghị này
      const detailSql = `
        SELECT pd.*, c.category_name
        FROM procurement_details pd
        LEFT JOIN categories c ON pd.category_id = c.category_id
        WHERE pd.procurement_id = ?
      `;
      const [details] = await db.query(detailSql, [req.params.id]);

      // Tính tổng tiền dự kiến
      let totalCost = 0;
      details.forEach((item) => {
        item.lineTotal = Number(item.quantity) * Number(item.estimated_cost || 0);
        totalCost += item.lineTotal;
      });

      res.render("procurement/show", {
        title: "Chi tiết đề nghị mua sắm",
        procurement: procurements[0],
        details,
        totalCost,
      });
    } catch (err) {
      console.log("Lỗi xem chi tiết đề nghị:", err);
      res.status(500).send("Lỗi xem chi tiết đề nghị mua sắm");
    }
  },

  // 3. Thêm mới đề nghị mua sắm
  async create(req, res) {
    const {
      procurement_code,
      requester_id,
      department_id,
      request_date,
      reason,
      status,
      note,
      asset_name,
      category_id,
      quantity,
      estimated_cost,
      description,
    } = req.body;

    try {
      // Lưu vào bảng procurements
      const sqlProcurement = `
        INSERT INTO procurements (procurement_code, requester_id, department_id, request_date, reason, status, note)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(sqlProcurement, [
        procurement_code,
        requester_id || null,
        department_id,
        request_date,
        reason || null,
        status || "pending",
        note || null,
      ]);

      // Lưu mặt hàng vào bảng procurement_details
      if (asset_name) {
        const sqlDetail = `
          INSERT INTO procurement_details (procurement_id, asset_name, category_id, quantity, estimated_cost, description)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.query(sqlDetail, [
          result.insertId,
          asset_name,
          category_id || null,
          quantity || 1,
          estimated_cost || 0,
          description || null,
        ]);
      }

      res.redirect("/procurement");
    } catch (err) {
      console.log("Lỗi thêm đề nghị:", err);
      res.status(500).send("Lỗi thêm đề nghị mua sắm");
    }
  },

  // 4. Form sửa đề nghị mua sắm
  async edit(req, res) {
    try {
      const [procurements] = await db.query(
        "SELECT * FROM procurements WHERE procurement_id = ?",
        [req.params.id]
      );

      if (procurements.length === 0) {
        return res.redirect("/procurement");
      }

      const procurement = procurements[0];
      if (procurement.request_date) {
        procurement.request_date = dayjs(procurement.request_date).format("YYYY-MM-DD");
      }

      // Lấy thông tin mặt hàng cần mua
      const [details] = await db.query(
        "SELECT * FROM procurement_details WHERE procurement_id = ?",
        [req.params.id]
      );

      const { departments, employees, categories } = await getFormData();

      res.render("procurement/procurement-edit", {
        title: "Sửa đề nghị mua sắm",
        procurement,
        detail: details[0] || {},
        departments,
        employees,
        categories,
      });
    } catch (err) {
      console.log("Lỗi lấy thông tin sửa:", err);
      res.status(500).send("Lỗi lấy thông tin đề nghị mua sắm");
    }
  },

  // 5. Cập nhật đề nghị mua sắm
  async update(req, res) {
    const {
      procurement_code,
      requester_id,
      department_id,
      request_date,
      reason,
      status,
      note,
      asset_name,
      category_id,
      quantity,
      estimated_cost,
      description,
    } = req.body;

    try {
      // Cập nhật thông tin chung
      const sqlProcurement = `
        UPDATE procurements
        SET procurement_code = ?, requester_id = ?, department_id = ?, request_date = ?, reason = ?, status = ?, note = ?
        WHERE procurement_id = ?
      `;
      await db.query(sqlProcurement, [
        procurement_code,
        requester_id || null,
        department_id,
        request_date,
        reason || null,
        status || "pending",
        note || null,
        req.params.id,
      ]);

      // Cập nhật chi tiết mặt hàng
      const sqlDetail = `
        UPDATE procurement_details
        SET asset_name = ?, category_id = ?, quantity = ?, estimated_cost = ?, description = ?
        WHERE procurement_id = ?
      `;
      await db.query(sqlDetail, [
        asset_name,
        category_id || null,
        quantity || 1,
        estimated_cost || 0,
        description || null,
        req.params.id,
      ]);

      res.redirect("/procurement");
    } catch (err) {
      console.log("Lỗi cập nhật đề nghị:", err);
      res.status(500).send("Lỗi cập nhật đề nghị mua sắm");
    }
  },

  // 6. Xóa đề nghị mua sắm
  async delete(req, res) {
    try {
      await db.query("DELETE FROM procurement_details WHERE procurement_id = ?", [req.params.id]);
      await db.query("DELETE FROM procurements WHERE procurement_id = ?", [req.params.id]);
      res.redirect("/procurement");
    } catch (err) {
      console.log("Lỗi xóa đề nghị:", err);
      res.status(500).send("Lỗi xóa đề nghị mua sắm");
    }
  },
};

module.exports = procurementController;
