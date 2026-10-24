const db = require("../config/db");
const dayjs = require("dayjs");

// Dữ liệu nền cho form
async function getFormData() {
  const [departments] = await db.query(
    "SELECT department_id, department_name FROM departments ORDER BY department_name ASC"
  );
  const [employees] = await db.query(
    "SELECT employee_id, full_name, department_id FROM employees ORDER BY full_name ASC"
  );
  const [categories] = await db.query(
    "SELECT category_id, category_name FROM categories ORDER BY category_name ASC"
  );
  return { departments, employees, categories };
}

const procurementController = {
  // 1. Danh sách đề nghị mua sắm
  async index(req, res) {
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const start = (page - 1) * limit;

    try {
      const countSql =
        "SELECT COUNT(*) AS total FROM requests WHERE request_code LIKE ? AND request_type = 'purchase'";
      const [countResult] = await db.query(countSql, [`%${name}%`]);
      const totalPages = Math.ceil((countResult[0]?.total || 0) / limit);

      const sql = `
        SELECT 
          r.*,
          r.request_id AS procurement_id,
          r.request_code AS procurement_code,
          r.created_at AS request_date,
          d.department_name,
          e.full_name AS requester_name
        FROM requests r
        LEFT JOIN departments d ON r.department_id = d.department_id
        LEFT JOIN employees e ON r.requester_id = e.employee_id
        WHERE r.request_code LIKE ? AND r.request_type = 'purchase'
        ORDER BY r.request_id DESC
        LIMIT ${start}, ${limit}
      `;
      const [procurements] = await db.query(sql, [`%${name}%`]);

      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i == page });
      }

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
      const sql = `
        SELECT 
          r.*,
          r.request_id AS procurement_id,
          r.request_code AS procurement_code,
          r.created_at AS request_date,
          d.department_name,
          e.full_name AS requester_name
        FROM requests r
        LEFT JOIN departments d ON r.department_id = d.department_id
        LEFT JOIN employees e ON r.requester_id = e.employee_id
        WHERE r.request_id = ?
      `;
      const [procurements] = await db.query(sql, [req.params.id]);

      if (procurements.length === 0) {
        return res.redirect("/procurement");
      }

      // Lấy danh sách mặt hàng cần mua
      const detailSql = `
        SELECT 
          rl.*,
          rl.item_name AS asset_name,
          rl.note AS description,
          c.category_name
        FROM request_lines rl
        LEFT JOIN categories c ON rl.category_id = c.category_id
        WHERE rl.request_id = ?
      `;
      const [details] = await db.query(detailSql, [req.params.id]);

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
      reason,
      status,
      asset_name,
      category_id,
      quantity,
      estimated_cost,
      description,
    } = req.body;

    const finalCode =
      procurement_code && procurement_code.trim() !== ""
        ? procurement_code.trim()
        : `DX-${dayjs().format("YYYY")}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // 1. Lưu phiếu đề xuất
      const sqlRequest = `
        INSERT INTO requests (request_code, request_type, requester_id, department_id, status, reason)
        VALUES (?, 'purchase', ?, ?, ?, ?)
      `;
      const [result] = await db.query(sqlRequest, [
        finalCode,
        requester_id,
        department_id,
        status || "pending_manager",
        reason || "Đề xuất mua sắm tài sản",
      ]);

      // 2. Lưu mặt hàng chi tiết
      if (asset_name && asset_name.trim() !== "") {
        const sqlDetail = `
          INSERT INTO request_lines (request_id, item_name, category_id, quantity, estimated_cost, note)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.query(sqlDetail, [
          result.insertId,
          asset_name.trim(),
          category_id || null,
          parseInt(quantity) || 1,
          parseFloat(estimated_cost) || 0,
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
        "SELECT *, request_id AS procurement_id, request_code AS procurement_code FROM requests WHERE request_id = ?",
        [req.params.id]
      );

      if (procurements.length === 0) {
        return res.redirect("/procurement");
      }

      const procurement = procurements[0];
      if (procurement.created_at) {
        procurement.request_date = dayjs(procurement.created_at).format("YYYY-MM-DD");
      }

      const [details] = await db.query(
        "SELECT *, item_name AS asset_name, note AS description FROM request_lines WHERE request_id = ? LIMIT 1",
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
      reason,
      status,
      asset_name,
      category_id,
      quantity,
      estimated_cost,
      description,
    } = req.body;

    try {
      // 1. Cập nhật phiếu đề xuất
      await db.query(
        `UPDATE requests
         SET request_code = ?, requester_id = ?, department_id = ?, status = ?, reason = ?
         WHERE request_id = ?`,
        [
          procurement_code,
          requester_id,
          department_id,
          status || "pending_manager",
          reason || "Đề xuất mua sắm tài sản",
          req.params.id,
        ]
      );

      // 2. Cập nhật mặt hàng chi tiết
      await db.query(
        `UPDATE request_lines
         SET item_name = ?, category_id = ?, quantity = ?, estimated_cost = ?, note = ?
         WHERE request_id = ?`,
        [
          asset_name,
          category_id || null,
          parseInt(quantity) || 1,
          parseFloat(estimated_cost) || 0,
          description || null,
          req.params.id,
        ]
      );

      res.redirect("/procurement");
    } catch (err) {
      console.log("Lỗi cập nhật đề nghị:", err);
      res.status(500).send("Lỗi cập nhật đề nghị mua sắm");
    }
  },

  // 6. Xóa đề nghị mua sắm
  async delete(req, res) {
    try {
      await db.query("DELETE FROM request_lines WHERE request_id = ?", [req.params.id]);
      await db.query("DELETE FROM requests WHERE request_id = ?", [req.params.id]);
      res.redirect("/procurement");
    } catch (err) {
      console.log("Lỗi xóa đề nghị:", err);
      res.status(500).send("Lỗi xóa đề nghị mua sắm");
    }
  },
};

module.exports = procurementController;
