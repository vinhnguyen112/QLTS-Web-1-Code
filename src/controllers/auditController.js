const db = require("../config/db");

const auditController = {
  // Danh sách nhật ký hoạt động
  async index(req, res) {
    try {
      const searchAction = req.query.action || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 15;
      const offset = (page - 1) * limit;

      // Đếm tổng số bản ghi
      let countSql = "SELECT COUNT(*) AS total FROM audit_logs al";
      const params = [];
      if (searchAction) {
        countSql += " WHERE al.action LIKE ? OR al.entity LIKE ?";
        params.push(`%${searchAction}%`, `%${searchAction}%`);
      }

      const [[{ total }]] = await db.query(countSql, params);
      const totalPages = Math.ceil(total / limit) || 1;
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      // Truy vấn danh sách nhật ký join với users
      let querySql = `
        SELECT al.*, 
               u.full_name AS actor_name, 
               u.username AS actor_username,
               r.name AS actor_role
        FROM audit_logs al
        LEFT JOIN users u ON al.actor_id = u.id
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
      `;
      if (searchAction) {
        querySql += " WHERE al.action LIKE ? OR al.entity LIKE ?";
      }
      querySql += ` ORDER BY al.performed_at DESC LIMIT ${offset}, ${limit}`;

      const [logs] = await db.query(querySql, params);

      res.render("audit/index", {
        title: "Nhật ký hoạt động hệ thống",
        logs,
        searchAction,
        page,
        totalPages,
        pages,
      });
    } catch (err) {
      console.error("Lỗi nhật ký hoạt động:", err);
      res.status(500).send("Lỗi tải nhật ký: " + err.message);
    }
  },
};

module.exports = auditController;

