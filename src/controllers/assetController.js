const db = require("../config/db");
const dayjs = require("dayjs");
const crypto = require("crypto");
const QRCode = require("qrcode");
const { recordEvent } = require("../utils/logger");
const { calcDepreciation } = require("../utils/depreciation");

// Câu SQL dùng chung lấy ra asset_categories, suppliers, org_units, locations, users
const ASSET_SELECT_SQL = `
  SELECT a.*,
         c.name  AS category_name,
         s.name  AS supplier_name,
         ou.name AS org_unit_name,
         l.name  AS location_name,
         u.full_name AS current_employee_name,
         u.email     AS employee_email
  FROM assets a
  LEFT JOIN asset_categories c  ON a.category_id = c.id
  LEFT JOIN suppliers        s  ON a.supplier_id  = s.id
  LEFT JOIN org_units        ou ON a.org_unit_id  = ou.id
  LEFT JOIN locations        l  ON a.location_id  = l.id
  LEFT JOIN users            u  ON a.assignee_id  = u.id
`;

const assetController = {
  // 1. Danh sách tài sản (tìm kiếm + lọc trạng thái tức thì)
  async index(req, res) {
    try {
      const search = (req.query.name || "").trim();
      const status = req.query.status || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      let whereClause = "WHERE a.deleted_at IS NULL";
      const params = [];

      if (search) {
        whereClause += " AND (a.name LIKE ? OR a.code LIKE ? OR a.serial_no LIKE ?)";
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      if (status) {
        whereClause += " AND a.status = ?";
        params.push(status);
      }

      // Đếm tổng số bản ghi thỏa mãn điều kiện lọc
      const countSql = `SELECT COUNT(*) AS total FROM assets a ${whereClause}`;
      const [[{ total }]] = await db.query(countSql, params);
      const totalPages = Math.ceil(total / limit) || 1;

      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      // Lấy danh sách tài sản theo trang
      const listSql = `
        ${ASSET_SELECT_SQL}
        ${whereClause}
        ORDER BY a.id DESC
        LIMIT ${offset}, ${limit}
      `;
      const [assets] = await db.query(listSql, params);

      // Lấy danh mục phục vụ Modal thêm mới tại chỗ
      const [categories] = await db.query("SELECT id, name FROM asset_categories ORDER BY name");
      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");
      const [locations] = await db.query("SELECT id, name FROM locations WHERE active = 1 ORDER BY name");
      const [suppliers] = await db.query("SELECT id, name FROM suppliers ORDER BY name");
      const [users] = await db.query("SELECT id, full_name, email FROM users WHERE status = 'ACTIVE' ORDER BY full_name");

      res.render("assets/index", {
        title: "Hồ sơ tài sản",
        assets,
        searchName: search,
        status,
        totalPages,
        page,
        pages,
        formData: { categories, orgUnits, locations, suppliers, users },
      });
    } catch (err) {
      console.error("Lỗi danh sách tài sản:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Thêm mới hồ sơ tài sản
  async create(req, res) {
    try {
      const {
        name,
        category_id,
        supplier_id,
        org_unit_id,
        location_id,
        assignee_id,
        original_cost,
        purchase_date,
        useful_life_months,
        serial_no,
      } = req.body;

      // Sinh mã tài sản tự động & mã token QR
      const code = `TS-${dayjs().format("YYYY")}-${Math.floor(10000 + Math.random() * 90000)}`;
      const qr_token = crypto.randomBytes(32).toString("hex");
      const status = assignee_id ? "in_use" : "in_stock";

      const [result] = await db.query(
        `INSERT INTO assets (code, qr_token, name, category_id, supplier_id, org_unit_id, location_id, assignee_id,
                            original_cost, purchase_date, useful_life_months, status, serial_no, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          code,
          qr_token,
          name,
          category_id,
          supplier_id,
          org_unit_id,
          location_id,
          assignee_id || null,
          original_cost,
          purchase_date,
          useful_life_months,
          status,
          serial_no || null,
        ]
      );

      await recordEvent(result.insertId, assignee_id ? "ASSIGN" : "INITIAL_IMPORT", assignee_id ? "Bàn giao sử dụng" : "Nhập kho", req.session.user?.id);
      res.redirect(`/assets/${result.insertId}?msg=` + encodeURIComponent("Thêm tài sản mới thành công!"));
    } catch (err) {
      console.error("Lỗi thêm tài sản mới:", err);
      res.redirect("/assets?error=" + encodeURIComponent("Lỗi: " + err.message));
    }
  },

  // 3. Cấp phát / Bàn giao tài sản từ kho cho nhân viên
  async assign(req, res) {
    try {
      const assetId = req.params.id || req.body.asset_id;
      const { assignee_id, org_unit_id, location_id, note } = req.body;
      const currentUserId = req.session.user ? req.session.user.id : null;

      if (!assignee_id) {
        return res.status(400).send("Vui lòng chọn nhân viên tiếp nhận bàn giao!");
      }

      await db.query(
        `
        UPDATE assets
        SET status = 'in_use', assignee_id = ?, org_unit_id = COALESCE(?, org_unit_id),
            location_id = COALESCE(?, location_id), updated_at = NOW()
        WHERE id = ?
      `,
        [assignee_id, org_unit_id || null, location_id || null, assetId]
      );

      await recordEvent(assetId, "ASSIGN", note || "Bàn giao / Cấp phát tài sản cho nhân sự", currentUserId);

      res.redirect(`/assets/${assetId}`);
    } catch (err) {
      console.error("Lỗi cấp phát tài sản:", err);
      res.redirect("/assets");
    }
  },

  // 4. Chi tiết hồ sơ tài sản + Tem mã QR
  async show(req, res) {
    try {
      const [rows] = await db.query(`${ASSET_SELECT_SQL} WHERE a.id = ? AND a.deleted_at IS NULL`, [
        req.params.id,
      ]);
      if (rows.length === 0) return res.redirect("/assets");

      const asset = rows[0];

      // Sinh ảnh QR Code Data URL để hiển thị trực tiếp
      const qrData = asset.qr_token || asset.code;
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 180,
        margin: 1,
      });

      // Lấy lịch sử biến động tài sản
      const [events] = await db.query(
        `
        SELECT ae.performed_at, ae.event_type, ae.note, u.full_name AS actor_name
        FROM asset_events ae
        LEFT JOIN users u ON ae.performed_by = u.id
        WHERE ae.asset_id = ?
        ORDER BY ae.id DESC
        LIMIT 20
      `,
        [asset.id]
      ).catch(() => [[]]);

      // Lấy danh sách phục vụ Modal Cấp phát nếu tài sản đang ở trong kho
      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");
      const [locations] = await db.query("SELECT id, name FROM locations WHERE active = 1 ORDER BY name");
      const [users] = await db.query("SELECT id, full_name, email FROM users WHERE status = 'ACTIVE' ORDER BY full_name");

      // Tính toán khấu hao đường thẳng
      const depreciation = calcDepreciation(asset);

      res.render("assets/show", {
        title: `Chi tiết tài sản - ${asset.code}`,
        asset,
        qrCodeDataUrl,
        events: events || [],
        formData: { orgUnits, locations, users },
        depreciation,
      });
    } catch (err) {
      console.error("Lỗi xem chi tiết tài sản:", err);
      res.redirect("/assets");
    }
  },

  // 5. Form chỉnh sửa tài sản
  async edit(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM assets WHERE id = ? AND deleted_at IS NULL", [
        req.params.id,
      ]);
      if (rows.length === 0) return res.redirect("/assets");

      const asset = rows[0];
      if (asset.purchase_date) {
        asset.purchase_date = dayjs(asset.purchase_date).format("YYYY-MM-DD");
      }

      const [categories] = await db.query("SELECT id, name FROM asset_categories ORDER BY name");
      const [suppliers] = await db.query("SELECT id, name FROM suppliers ORDER BY name");
      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");
      const [locations] = await db.query("SELECT id, name FROM locations WHERE active = 1 ORDER BY name");
      const [users] = await db.query("SELECT id, full_name, email FROM users WHERE status = 'ACTIVE' ORDER BY full_name");

      res.render("assets/asset-edit", {
        title: `Chỉnh sửa tài sản - ${asset.code}`,
        asset,
        formData: { categories, suppliers, orgUnits, locations, users },
      });
    } catch (err) {
      console.error("Lỗi form sửa tài sản:", err);
      res.redirect("/assets");
    }
  },

  // 6. Cập nhật thông tin tài sản
  async update(req, res) {
    try {
      const {
        code,
        name,
        category_id,
        supplier_id,
        org_unit_id,
        location_id,
        assignee_id,
        original_cost,
        purchase_date,
        useful_life_months,
        serial_no,
        status,
      } = req.body;

      await db.query(
        `UPDATE assets
         SET code = ?, name = ?, category_id = ?, supplier_id = ?, org_unit_id = ?, location_id = ?,
             assignee_id = ?, original_cost = ?, purchase_date = ?, useful_life_months = ?, serial_no = ?, status = ?, updated_at = NOW()
         WHERE id = ?`,
        [
          code,
          name,
          category_id,
          supplier_id,
          org_unit_id,
          location_id,
          assignee_id || null,
          original_cost,
          purchase_date,
          useful_life_months,
          serial_no || null,
          status,
          req.params.id,
        ]
      );

      res.redirect(`/assets/${req.params.id}`);
    } catch (err) {
      console.error("Lỗi cập nhật tài sản:", err);
      res.redirect(`/assets/${req.params.id}?error=` + encodeURIComponent("Lỗi: " + err.message));
    }
  },

  // 7. Thu hồi tài sản từ nhân viên về kho
  async recall(req, res) {
    try {
      const assetId = req.params.id;
      const currentUserId = req.session.user ? req.session.user.id : null;

      // Đưa trạng thái về 'in_stock', gỡ assignee_id
      await db.query(
        "UPDATE assets SET assignee_id = NULL, status = 'in_stock', updated_at = NOW() WHERE id = ?",
        [assetId]
      );

      // Ghi nhận biến động (1 dòng duy nhất)
      await recordEvent(assetId, "RECALL", "Thu hồi tài sản về kho trung tâm", currentUserId);

      res.redirect("/assets/" + assetId);
    } catch (err) {
      console.error("Lỗi thu hồi tài sản:", err);
      res.redirect("/assets");
    }
  },

  // 8. Xóa logic tài sản (Soft Delete)
  async delete(req, res) {
    try {
      await db.query("UPDATE assets SET deleted_at = NOW() WHERE id = ?", [req.params.id]);
      res.redirect("/assets?msg=" + encodeURIComponent("Đã xóa tài sản thành công!"));
    } catch (err) {
      res.redirect("/assets?error=" + encodeURIComponent("Không thể xóa tài sản: " + err.message));
    }
  },
};

module.exports = assetController;
