const db = require("../config/db");
const dayjs = require("dayjs");

const requestController = {
  // 1. Danh sách phiếu đề xuất
  async index(req, res) {
    try {
      const [requests] = await db.query(`
        SELECT r.*, u.full_name AS requester_name 
        FROM requests r 
        LEFT JOIN users u ON r.requester_id = u.id 
        ORDER BY r.id DESC
      `);
      res.render("requests/index", { title: "Phiếu đề xuất & Phê duyệt", requests });
    } catch (err) {
      console.error("Lỗi danh sách phiếu:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Form tạo phiếu đề xuất mới
  async createForm(req, res) {
    try {
      const [categories] = await db.query("SELECT id, name FROM asset_categories ORDER BY name");
      const [assets] = await db.query(
        "SELECT id, code, name, original_cost FROM assets WHERE deleted_at IS NULL AND status = 'in_stock' ORDER BY code"
      );
      res.render("requests/create", { title: "Lập đề xuất mới", categories, assets });
    } catch (err) {
      console.error("Lỗi form tạo phiếu:", err);
      res.redirect("/requests");
    }
  },

  // 3. Xử lý tạo phiếu
  async create(req, res) {
    try {
      const { type, title, reason, item_name, category_id, estimated_cost, asset_id } = req.body;
      const code = (type === "assign" ? "DX-CP-" : "DX-MS-") + Date.now().toString().slice(-6);
      const userId = req.session.user ? req.session.user.id : null;
      const orgUnitId = req.session.user ? req.session.user.org_unit_id : 227;
      const cost = type === "purchase" ? Number(estimated_cost) || 0 : 0;

      const [result] = await db.query(
        `INSERT INTO requests (code, type, requester_id, org_unit_id, title, reason, status, total_estimated_cost, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'pending_approval', ?, NOW(), NOW())`,
        [code, type, userId, orgUnitId, title, reason, cost]
      );

      // Lưu chi tiết yêu cầu
      await db.query(
        `INSERT INTO request_lines (request_id, asset_id, item_name, category_id, quantity, estimated_cost, notes, created_at)
         VALUES (?, ?, ?, ?, 1, ?, ?, NOW())`,
        [result.insertId, type === "assign" ? asset_id : null, item_name || title, category_id || null, cost, reason]
      );

      res.redirect("/requests/" + result.insertId);
    } catch (err) {
      console.error("Lỗi tạo phiếu:", err);
      res.status(500).send("Lỗi tạo phiếu: " + err.message);
    }
  },

  // 4. Xem chi tiết phiếu & luồng duyệt
  async show(req, res) {
    try {
      const [rows] = await db.query(
        `
        SELECT r.*, u.full_name AS requester_name,
               rl.item_name, rl.estimated_cost, rl.category_id,
               c.name AS category_name,
               a.code AS asset_code, a.name AS asset_name
        FROM requests r
        LEFT JOIN users u ON r.requester_id = u.id
        LEFT JOIN request_lines rl ON rl.request_id = r.id
        LEFT JOIN asset_categories c ON rl.category_id = c.id
        LEFT JOIN assets a ON rl.asset_id = a.id
        WHERE r.id = ?
      `,
        [req.params.id]
      );

      if (rows.length === 0) return res.redirect("/requests");
      const request = rows[0];

      // Điều kiện duyệt: Là quản lý và không phải người tự tạo phiếu
      const currentUserId = req.session.user ? req.session.user.id : null;
      const canApprove =
        currentUserId &&
        currentUserId !== request.requester_id &&
        res.locals.canApprove &&
        (request.status === "pending_approval" || request.status === "pending");

      res.render("requests/show", {
        title: `Chi tiết đề xuất - ${request.code}`,
        request,
        canApprove,
      });
    } catch (err) {
      console.error("Lỗi xem chi tiết phiếu:", err);
      res.redirect("/requests");
    }
  },

  // 5. Phê duyệt đề xuất
  async approve(req, res) {
    try {
      const [rows] = await db.query(
        `SELECT r.*, rl.asset_id, rl.item_name, rl.category_id, rl.estimated_cost 
         FROM requests r 
         LEFT JOIN request_lines rl ON rl.request_id = r.id 
         WHERE r.id = ?`,
        [req.params.id]
      );
      if (rows.length === 0) return res.redirect("/requests");
      const request = rows[0];

      // Mua sắm -> Tự tạo tài sản mới vào kho
      if (request.type === "purchase") {
        const autoCode = `TS-${dayjs().format("YYYY")}-${Math.floor(1000 + Math.random() * 9000)}`;
        await db.query(
          `INSERT INTO assets (code, name, category_id, org_unit_id, original_cost, purchase_date, useful_life_months, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, CURDATE(), 36, 'in_stock', NOW(), NOW())`,
          [autoCode, request.item_name || request.title, request.category_id, request.org_unit_id, request.estimated_cost]
        );
      }

      // Cấp phát -> Chuyển tài sản trong kho sang cho người đề xuất sử dụng
      if (request.type === "assign" && request.asset_id) {
        await db.query(
          "UPDATE assets SET status = 'in_use', assignee_id = ?, updated_at = NOW() WHERE id = ?",
          [request.requester_id, request.asset_id]
        );
      }

      // Cập nhật trạng thái phiếu
      await db.query("UPDATE requests SET status = 'approved', updated_at = NOW() WHERE id = ?", [req.params.id]);
      res.redirect("/requests/" + req.params.id);
    } catch (err) {
      console.error("Lỗi duyệt phiếu:", err);
      res.status(500).send("Lỗi duyệt phiếu: " + err.message);
    }
  },

  // 6. Từ chối đề xuất
  async reject(req, res) {
    try {
      await db.query("UPDATE requests SET status = 'rejected', updated_at = NOW() WHERE id = ?", [req.params.id]);
      res.redirect("/requests/" + req.params.id);
    } catch (err) {
      console.error("Lỗi từ chối phiếu:", err);
      res.redirect("/requests");
    }
  },
};

module.exports = requestController;
