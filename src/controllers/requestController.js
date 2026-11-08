const db = require("../config/db");
const dayjs = require("dayjs");
const { logAssetEvent, logAudit } = require("../utils/logger");

const requestController = {
  // 1. Danh sách phiếu yêu cầu (Lọc theo loại phiếu, trạng thái, phân trang)
  async index(req, res) {
    try {
      const type = req.query.type || "";
      const status = req.query.status || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      let whereClause = "WHERE 1=1";
      const params = [];

      if (type) {
        whereClause += " AND r.type = ?";
        params.push(type);
      }
      if (status) {
        whereClause += " AND r.status = ?";
        params.push(status);
      }

      // Đếm tổng số
      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) AS total FROM requests r ${whereClause}`,
        params
      );
      const totalPages = Math.ceil(total / limit) || 1;
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      // Lấy danh sách phiếu kèm người đề xuất và phòng ban
      const [requests] = await db.query(
        `
        SELECT r.*,
               u.full_name AS requester_name,
               u.email     AS requester_email,
               ou.name     AS org_unit_name,
               (SELECT COUNT(*) FROM request_lines rl WHERE rl.request_id = r.id) AS line_count
        FROM requests r
        LEFT JOIN users     u  ON r.requester_id = u.id
        LEFT JOIN org_units ou ON r.org_unit_id  = ou.id
        ${whereClause}
        ORDER BY r.id DESC
        LIMIT ${offset}, ${limit}
      `,
        params
      );

      res.render("requests/index", {
        title: "Quản lý phiếu yêu cầu & Phê duyệt",
        requests,
        type,
        status,
        totalPages,
        pages,
      });
    } catch (err) {
      console.error("Lỗi danh sách phiếu:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Form tạo phiếu mới
  async createForm(req, res) {
    try {
      const [categories] = await db.query("SELECT id, name FROM asset_categories ORDER BY name");
      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");
      const [assets] = await db.query("SELECT id, code, name, status, original_cost FROM assets WHERE deleted_at IS NULL ORDER BY code");
      const [users] = await db.query("SELECT id, full_name, email FROM users WHERE status = 'ACTIVE' ORDER BY full_name");

      res.render("requests/create", {
        title: "Lập phiếu đề xuất mới",
        formData: { categories, orgUnits, assets, users },
      });
    } catch (err) {
      console.error("Lỗi form tạo phiếu:", err);
      res.redirect("/requests");
    }
  },

  // 3. Xử lý tạo phiếu đề xuất
  async create(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const {
        type,
        title,
        reason,
        target_asset_id,
        item_name,
        category_id,
        quantity,
        estimated_cost,
        notes,
      } = req.body;

      const currentUserId = req.session.user ? req.session.user.id : 315;
      const userOrgUnitId = req.session.user ? req.session.user.org_unit_id : 227;

      const prefixMap = {
        purchase: "DX-MS",
        assign: "DX-CP",
        transfer: "DX-DC",
        recall: "DX-TH",
        disposal: "DX-TL",
        maintenance: "DX-SC",
      };
      const prefix = prefixMap[type] || "DX";
      const code = `${prefix}-${dayjs().format("YYYY")}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Guard: Kiểm tra xung đột khóa tài sản nếu phiếu gắn với 1 tài sản cụ thể
      if (target_asset_id) {
        const [locked] = await connection.query(
          "SELECT id, code, name, active_request_id, status FROM assets WHERE id = ?",
          [target_asset_id]
        );
        if (locked.length > 0 && locked[0].active_request_id) {
          await connection.rollback();
          return res.status(400).send(
            `Tài sản [${locked[0].code}] ${locked[0].name} đang nằm trong phiếu #REQ-${locked[0].active_request_id} chờ xử lý. Không thể tạo thêm phiếu mới!`
          );
        }
      }

      const totalCost = (Number(quantity) || 1) * (Number(estimated_cost) || 0);

      const [result] = await connection.query(
        `
        INSERT INTO requests (code, type, requester_id, org_unit_id, title, reason, status, total_estimated_cost, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'pending_approval', ?, NOW(), NOW())
      `,
        [code, type, currentUserId, userOrgUnitId, title, reason, totalCost]
      );

      const requestId = result.insertId;

      // Khóa tài sản gắn với phiếu này để chống xung đột (Concurrency Lock)
      if (target_asset_id) {
        await connection.query("UPDATE assets SET active_request_id = ? WHERE id = ?", [
          requestId,
          target_asset_id,
        ]);
      }

      // Lưu dòng chi tiết phiếu vào request_lines
      await connection.query(
        `
        INSERT INTO request_lines (request_id, asset_id, item_name, category_id, quantity, estimated_cost, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `,
        [
          requestId,
          target_asset_id || null,
          item_name || title,
          category_id || null,
          quantity || 1,
          estimated_cost || 0,
          notes || reason,
        ]
      );

      await connection.commit();
      res.redirect("/requests/" + requestId);
    } catch (err) {
      await connection.rollback();
      console.error("Lỗi tạo phiếu:", err);
      res.status(500).send("Lỗi: " + err.message);
    } finally {
      connection.release();
    }
  },

  // 4. Xem chi tiết phiếu & Luồng duyệt
  async show(req, res) {
    try {
      const [requests] = await db.query(
        `
        SELECT r.*,
               u.full_name AS requester_name,
               u.email     AS requester_email,
               ou.name     AS org_unit_name
        FROM requests r
        LEFT JOIN users     u  ON r.requester_id = u.id
        LEFT JOIN org_units ou ON r.org_unit_id  = ou.id
        WHERE r.id = ?
      `,
        [req.params.id]
      );

      if (requests.length === 0) return res.redirect("/requests");
      const request = requests[0];

      // Lấy chi tiết các dòng
      const [lines] = await db.query(
        `
        SELECT rl.*,
               a.code AS asset_code,
               a.name AS asset_name,
               c.name AS category_name
        FROM request_lines rl
        LEFT JOIN assets a           ON rl.asset_id    = a.id
        LEFT JOIN asset_categories c ON rl.category_id = c.id
        WHERE rl.request_id = ?
      `,
        [request.id]
      );

      // Kiểm tra xem user hiện tại có quyền duyệt hay không
      const currentUserId = req.session.user ? req.session.user.id : null;
      const canApprove =
        currentUserId &&
        currentUserId !== request.requester_id && // Tách nhiệm vụ: không được tự duyệt
        ["SYS_ADMIN", "DIRECTOR", "CHIEF_ACCOUNTANT", "ASSET_MANAGER", "DEPT_HEAD"].includes(
          req.session.user?.role_code
        ) &&
        ["pending", "pending_approval"].includes(request.status);

      res.render("requests/show", {
        title: `Phiếu yêu cầu - ${request.code}`,
        request,
        lines,
        canApprove,
      });
    } catch (err) {
      console.error("Lỗi xem chi tiết phiếu:", err);
      res.redirect("/requests");
    }
  },

  // 5. Phê duyệt phiếu (Approve)
  async approve(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const requestId = req.params.id;
      const currentUserId = req.session.user ? req.session.user.id : null;

      const [rows] = await connection.query("SELECT * FROM requests WHERE id = ?", [requestId]);
      if (rows.length === 0) return res.redirect("/requests");
      const request = rows[0];

      // Guard 1: Người đề xuất không được tự duyệt phiếu của chính mình
      if (request.requester_id === currentUserId) {
        await connection.rollback();
        return res.status(403).send("Nguyên tắc tách nhiệm vụ: Bạn không được tự phê duyệt phiếu của chính mình!");
      }

      // Cập nhật trạng thái phiếu sang 'approved'
      await connection.query(
        "UPDATE requests SET status = 'approved', updated_at = NOW() WHERE id = ?",
        [requestId]
      );

      // Lấy chi tiết các dòng tài sản trong phiếu để cập nhật vòng đời
      const [lines] = await connection.query("SELECT * FROM request_lines WHERE request_id = ?", [requestId]);

      for (const line of lines) {
        // A. Nếu là Mua sắm (purchase) -> Tự động tạo tài sản mới trong kho (in_stock)
        if (request.type === "purchase") {
          const autoCode = `TS-${dayjs().format("YYYY")}-${Math.floor(10000 + Math.random() * 90000)}`;
          const [newAsset] = await connection.query(
            `
            INSERT INTO assets (code, name, category_id, org_unit_id, original_cost, purchase_date, useful_life_months, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, CURDATE(), 36, 'in_stock', NOW(), NOW())
          `,
            [autoCode, line.item_name, line.category_id, request.org_unit_id, line.estimated_cost]
          );

          await logAssetEvent(connection, {
            asset_id: newAsset.insertId,
            event_type: "INITIAL_IMPORT",
            to_org_unit_id: request.org_unit_id,
            request_id: requestId,
            performed_by: currentUserId,
            note: `Tiếp nhận mua sắm theo phiếu ${request.code}`,
          });
        }

        // B. Nếu là Cấp phát (assign) -> Đổi trạng thái sang 'in_use', gán người nhận
        if (request.type === "assign" && line.asset_id) {
          await connection.query(
            "UPDATE assets SET status = 'in_use', assignee_id = ?, active_request_id = NULL, updated_at = NOW() WHERE id = ?",
            [request.requester_id, line.asset_id]
          );
          await logAssetEvent(connection, {
            asset_id: line.asset_id,
            event_type: "ASSIGN",
            to_org_unit_id: request.org_unit_id,
            to_assignee_id: request.requester_id,
            request_id: requestId,
            performed_by: currentUserId,
            note: `Cấp phát sử dụng theo phiếu ${request.code}`,
          });
        }

        // C. Nếu là Thu hồi (recall) -> Trả về 'in_stock'
        if (request.type === "recall" && line.asset_id) {
          await connection.query(
            "UPDATE assets SET status = 'in_stock', assignee_id = NULL, active_request_id = NULL, updated_at = NOW() WHERE id = ?",
            [line.asset_id]
          );
          await logAssetEvent(connection, {
            asset_id: line.asset_id,
            event_type: "RECALL",
            to_org_unit_id: request.org_unit_id,
            request_id: requestId,
            performed_by: currentUserId,
            note: `Thu hồi về kho theo phiếu ${request.code}`,
          });
        }

        // D. Nếu là Điều chuyển (transfer)
        if (request.type === "transfer" && line.asset_id) {
          await connection.query(
            "UPDATE assets SET org_unit_id = ?, active_request_id = NULL, updated_at = NOW() WHERE id = ?",
            [request.org_unit_id, line.asset_id]
          );
          await logAssetEvent(connection, {
            asset_id: line.asset_id,
            event_type: "TRANSFER",
            to_org_unit_id: request.org_unit_id,
            request_id: requestId,
            performed_by: currentUserId,
            note: `Điều chuyển đơn vị theo phiếu ${request.code}`,
          });
        }

        // E. Nếu là Thanh lý (disposal) -> Chuyển sang 'disposed'
        if (request.type === "disposal" && line.asset_id) {
          await connection.query(
            "UPDATE assets SET status = 'disposed', active_request_id = NULL, disposal_date = CURDATE(), updated_at = NOW() WHERE id = ?",
            [line.asset_id]
          );
          await logAssetEvent(connection, {
            asset_id: line.asset_id,
            event_type: "DISPOSAL",
            request_id: requestId,
            performed_by: currentUserId,
            note: `Thanh lý tài sản theo phiếu ${request.code}`,
          });
        }
      }

      // Đảm bảo mở khóa toàn bộ tài sản gắn với phiếu này
      await connection.query("UPDATE assets SET active_request_id = NULL WHERE active_request_id = ?", [requestId]);

      // Ghi nhật ký kiểm toán audit
      await logAudit(connection, {
        actor_id: currentUserId,
        action: "REQUEST_APPROVE",
        entity: "requests",
        entity_id: requestId,
        before: { status: "pending_approval" },
        after: { status: "approved" },
      });

      await connection.commit();
      res.redirect("/requests/" + requestId);
    } catch (err) {
      await connection.rollback();
      console.error("Lỗi duyệt phiếu:", err);
      res.status(500).send("Lỗi duyệt phiếu: " + err.message);
    } finally {
      connection.release();
    }
  },

  // 6. Từ chối phiếu (Reject)
  async reject(req, res) {
    try {
      const requestId = req.params.id;
      const { reject_reason } = req.body;
      const currentUserId = req.session.user ? req.session.user.id : null;

      await db.query(
        "UPDATE requests SET status = 'rejected', reason = CONCAT(IFNULL(reason, ''), ' [LÝ DO TỪ CHỐI]: ', ?), updated_at = NOW() WHERE id = ?",
        [reject_reason || "Không đủ điều kiện phê duyệt", requestId]
      );

      // Giải phóng khóa tài sản gắn với phiếu này
      await db.query("UPDATE assets SET active_request_id = NULL WHERE active_request_id = ?", [requestId]);

      // Ghi audit
      await logAudit(db, {
        actor_id: currentUserId,
        action: "REQUEST_REJECT",
        entity: "requests",
        entity_id: requestId,
        before: { status: "pending_approval" },
        after: { status: "rejected", reject_reason },
      });

      res.redirect("/requests/" + requestId);
    } catch (err) {
      console.error("Lỗi từ chối phiếu:", err);
      res.redirect("/requests");
    }
  },
};

module.exports = requestController;

