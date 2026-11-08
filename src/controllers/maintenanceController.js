const db = require("../config/db");
const dayjs = require("dayjs");
const { logAssetEvent, logAudit } = require("../utils/logger");

const maintenanceController = {
  // 1. Danh sách các phiếu bảo trì & sửa chữa
  async index(req, res) {
    try {
      const [orders] = await db.query(`
        SELECT mo.*,
               a.code AS asset_code,
               a.name AS asset_name,
               u_rep.full_name AS reported_by_name,
               u_tech.full_name AS technician_name
        FROM maintenance_orders mo
        JOIN assets a               ON mo.asset_id    = a.id
        LEFT JOIN users u_rep       ON mo.reported_by = u_rep.id
        LEFT JOIN users u_tech      ON mo.assigned_to = u_tech.id
        ORDER BY mo.id DESC
      `);

      // Thống kê chi phí & số lượng
      const summary = {
        total: orders.length,
        inProgress: orders.filter((o) => ["open", "in_progress", "pending_receive"].includes(o.status)).length,
        completed: orders.filter((o) => o.status === "done").length,
        totalCost: orders.reduce((sum, o) => sum + (Number(o.cost) || 0), 0),
      };

      res.render("maintenance/index", {
        title: "Bảo trì & Sửa chữa tài sản",
        orders,
        summary,
      });
    } catch (err) {
      console.error("Lỗi danh sách bảo trì:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Form báo hỏng / đề xuất bảo trì
  async createForm(req, res) {
    try {
      const selectedAssetId = req.query.asset_id || null;

      // Danh sách tài sản chưa bị thanh lý
      const [assets] = await db.query(
        "SELECT id, code, name, status FROM assets WHERE deleted_at IS NULL AND status != 'disposed' ORDER BY code"
      );

      // Danh sách kỹ thuật viên
      const [technicians] = await db.query(
        `
        SELECT u.id, u.full_name, r.name AS role_name
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id
        WHERE r.code IN ('TECHNICIAN', 'ASSET_MANAGER', 'SYS_ADMIN')
        ORDER BY u.full_name
      `
      );

      res.render("maintenance/create", {
        title: "Lập phiếu báo hỏng / Bảo trì thiết bị",
        assets,
        technicians,
        selectedAssetId: Number(selectedAssetId),
      });
    } catch (err) {
      console.error("Lỗi form tạo bảo trì:", err);
      res.redirect("/maintenance");
    }
  },

  // 3. Xử lý tạo phiếu bảo trì & chuyển trạng thái tài sản sang 'maintenance'
  async create(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { asset_id, cause, assigned_to, type } = req.body;
      const currentUserId = req.session.user ? req.session.user.id : 315;
      const code = `BT-${dayjs().format("YYYY")}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Lưu đơn bảo trì
      await connection.query(
        `
        INSERT INTO maintenance_orders (code, asset_id, type, source, status, reported_by, assigned_to, cause, started_at, created_at, updated_at)
        VALUES (?, ?, ?, 'manual', 'in_progress', ?, ?, ?, CURDATE(), NOW(), NOW())
      `,
        [code, asset_id, type || "corrective", currentUserId, assigned_to || null, cause]
      );

      // 2. Chuyển trạng thái tài sản sang 'maintenance'
      await connection.query(
        "UPDATE assets SET status = 'maintenance', updated_at = NOW() WHERE id = ?",
        [asset_id]
      );

      // 3. Ghi vết biến động chuẩn
      await logAssetEvent(connection, {
        asset_id,
        event_type: "MAINTENANCE_START",
        performed_by: currentUserId,
        note: `Báo hỏng / Chuyển sửa chữa: ${cause}`,
      });

      // 4. Ghi nhật ký kiểm toán audit
      await logAudit(connection, {
        actor_id: currentUserId,
        action: "MAINTENANCE_CREATE",
        entity: "maintenance_orders",
        entity_id: code,
        after: { asset_id, type, cause, assigned_to },
      });

      await connection.commit();
      res.redirect("/maintenance");
    } catch (err) {
      await connection.rollback();
      console.error("Lỗi tạo phiếu bảo trì:", err);
      res.status(500).send("Lỗi: " + err.message);
    } finally {
      connection.release();
    }
  },

  // 4. Hoàn thành sửa chữa -> trả tài sản về sử dụng
  async complete(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const orderId = req.params.id;
      const { cost, result } = req.body;
      const currentUserId = req.session.user ? req.session.user.id : 315;

      const [orders] = await connection.query("SELECT * FROM maintenance_orders WHERE id = ?", [orderId]);
      if (orders.length === 0) return res.redirect("/maintenance");
      const order = orders[0];

      // 1. Cập nhật phiếu bảo trì sang 'done'
      await connection.query(
        `
        UPDATE maintenance_orders
        SET status = 'done', cost = ?, result = ?, outcome = 'repaired', finished_at = CURDATE(), updated_at = NOW()
        WHERE id = ?
      `,
        [cost || 0, result || "Đã sửa chữa và kiểm tra hoạt động tốt", orderId]
      );

      // 2. Trả tài sản về lại 'in_use' (nếu có người giữ) hoặc 'in_stock'
      const [assets] = await connection.query("SELECT assignee_id FROM assets WHERE id = ?", [order.asset_id]);
      const returnStatus = assets[0]?.assignee_id ? "in_use" : "in_stock";

      await connection.query(
        "UPDATE assets SET status = ?, updated_at = NOW() WHERE id = ?",
        [returnStatus, order.asset_id]
      );

      // 3. Ghi vết biến động chuẩn
      await logAssetEvent(connection, {
        asset_id: order.asset_id,
        event_type: "MAINTENANCE_END",
        to_assignee_id: assets[0]?.assignee_id || null,
        performed_by: currentUserId,
        note: `Hoàn thành sửa chữa (Chi phí: ${Number(cost || 0).toLocaleString('vi-VN')} đ). Kết quả: ${result || 'Tốt'}`,
      });

      // 4. Ghi nhật ký kiểm toán audit
      await logAudit(connection, {
        actor_id: currentUserId,
        action: "MAINTENANCE_COMPLETE",
        entity: "maintenance_orders",
        entity_id: order.id,
        before: { status: order.status },
        after: { status: "done", cost, result },
      });

      await connection.commit();
      res.redirect("/maintenance");
    } catch (err) {
      await connection.rollback();
      console.error("Lỗi hoàn thành bảo trì:", err);
      res.redirect("/maintenance");
    } finally {
      connection.release();
    }
  },
};

module.exports = maintenanceController;

