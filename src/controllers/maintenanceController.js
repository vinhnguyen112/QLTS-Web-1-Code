const db = require("../config/db");

const maintenanceController = {
  // 1. Danh sách phiếu bảo trì
  async index(req, res) {
    try {
      const [orders] = await db.query(`
        SELECT mo.*, a.code AS asset_code, a.name AS asset_name
        FROM maintenance_orders mo
        JOIN assets a ON mo.asset_id = a.id
        ORDER BY mo.id DESC
      `);
      res.render("maintenance/index", { title: "Bảo trì & Sửa chữa", orders });
    } catch (err) {
      console.error("Lỗi danh sách bảo trì:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Form báo hỏng thiết bị
  async createForm(req, res) {
    try {
      const [assets] = await db.query(
        "SELECT id, code, name FROM assets WHERE deleted_at IS NULL AND status != 'disposed' ORDER BY code"
      );
      res.render("maintenance/create", { title: "Báo hỏng thiết bị", assets });
    } catch (err) {
      console.error("Lỗi form tạo bảo trì:", err);
      res.redirect("/maintenance");
    }
  },

  // 3. Xử lý báo hỏng (chuyển tài sản sang 'maintenance')
  async create(req, res) {
    try {
      const { asset_id, cause } = req.body;
      const code = "BT-" + Date.now().toString().slice(-6);
      const userId = req.session.user?.id || 315;

      await db.query(
        `INSERT INTO maintenance_orders (code, asset_id, cause, reported_by, status, started_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'in_progress', CURDATE(), NOW(), NOW())`,
        [code, asset_id, cause || "Báo hỏng thiết bị", userId]
      );

      await db.query("UPDATE assets SET status = 'maintenance', updated_at = NOW() WHERE id = ?", [asset_id]);

      res.redirect("/maintenance");
    } catch (err) {
      console.error("Lỗi tạo phiếu bảo trì:", err);
      res.redirect("/maintenance");
    }
  },

  // 4. Hoàn thành sửa chữa (trả tài sản về trạng thái cũ)
  async complete(req, res) {
    try {
      const { cost } = req.body;
      const [orders] = await db.query("SELECT asset_id FROM maintenance_orders WHERE id = ?", [req.params.id]);
      
      if (orders.length > 0) {
        const [assets] = await db.query("SELECT assignee_id FROM assets WHERE id = ?", [orders[0].asset_id]);
        const returnStatus = (assets.length > 0 && assets[0].assignee_id) ? "in_use" : "in_stock";

        await db.query("UPDATE assets SET status = ?, updated_at = NOW() WHERE id = ?", [returnStatus, orders[0].asset_id]);
        await db.query(
          "UPDATE maintenance_orders SET status = 'done', cost = ?, finished_at = CURDATE(), updated_at = NOW() WHERE id = ?",
          [Number(cost) || 0, req.params.id]
        );
      }

      res.redirect("/maintenance");
    } catch (err) {
      console.error("Lỗi hoàn thành bảo trì:", err);
      res.redirect("/maintenance");
    }
  },
};

module.exports = maintenanceController;
