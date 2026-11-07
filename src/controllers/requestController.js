const db = require("../config/db");
const dayjs = require("dayjs");

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

      const totalCost = (Number(quantity) || 1) * (Number(estimated_cost) || 0);

      const [result] = await connection.query(
        `
        INSERT INTO requests (code, type, requester_id, org_unit_id, title, reason, status, total_estimated_cost, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'pending_approval', ?, NOW(), NOW())
      `,
        [code, type, currentUserId, userOrgUnitId, title, reason, totalCost]
      );

      const requestId = result.insertId;

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

          await connection.query(
            `
            INSERT INTO asset_events (asset_id, event_type, from_status, to_status, actor_id, note)
            VALUES (?, 'PURCHASE_RECEIVE', NULL, 'in_stock', ?, ?)
          `,
            [newAsset.insertId, currentUserId, `Tiếp nhận mua sắm theo phiếu ${request.code}`]
          ).catch(() => {});
        }

        // B. Nếu là Cấp phát (assign) -> Đổi trạng thái sang 'in_use'
        if (request.type === "assign" && line.asset_id) {
          await connection.query(
            "UPDATE assets SET status = 'in_use', assignee_id = ?, updated_at = NOW() WHERE id = ?",
            [request.requester_id, line.asset_id]
          );
          await connection.query(
            `
            INSERT INTO asset_events (asset_id, event_type, from_status, to_status, actor_id, note)
            VALUES (?, 'ASSIGN', 'in_stock', 'in_use', ?, ?)
          `,
            [line.asset_id, currentUserId, `Cấp phát sử dụng theo phiếu ${request.code}`]
          ).catch(() => {});
        }

        // C. Nếu là Thu hồi (recall) -> Trả về 'in_stock'
        if (request.type === "recall" && line.asset_id) {
          await connection.query(
            "UPDATE assets SET status = 'in_stock', assignee_id = NULL, updated_at = NOW() WHERE id = ?",
            [line.asset_id]
          );
          await connection.query(
            `
            INSERT INTO asset_events (asset_id, event_type, from_status, to_status, actor_id, note)
            VALUES (?, 'RECALL', 'in_use', 'in_stock', ?, ?)
          `,
            [line.asset_id, currentUserId, `Thu hồi về kho theo phiếu ${request.code}`]
          ).catch(() => {});
        }

        // D. Nếu là Thanh lý (disposal) -> Chuyển sang 'disposed'
        if (request.type === "disposal" && line.asset_id) {
          await connection.query(
            "UPDATE assets SET status = 'disposed', disposal_date = CURDATE(), updated_at = NOW() WHERE id = ?",
            [line.asset_id]
          );
          await connection.query(
            `
            INSERT INTO asset_events (asset_id, event_type, from_status, to_status, actor_id, note)
            VALUES (?, 'DISPOSAL', 'in_stock', 'disposed', ?, ?)
          `,
            [line.asset_id, currentUserId, `Thanh lý tài sản theo phiếu ${request.code}`]
          ).catch(() => {});
        }
      }

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

      await db.query(
        "UPDATE requests SET status = 'rejected', reason = CONCAT(IFNULL(reason, ''), ' [LÝ DO TỪ CHỐI]: ', ?), updated_at = NOW() WHERE id = ?",
        [reject_reason || "Không đủ điều kiện phê duyệt", requestId]
      );

      res.redirect("/requests/" + requestId);
    } catch (err) {
      console.error("Lỗi từ chối phiếu:", err);
      res.redirect("/requests");
    }
  },
};

module.exports = requestController;

