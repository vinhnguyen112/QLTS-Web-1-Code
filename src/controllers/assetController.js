const db = require("../config/db");
const dayjs = require("dayjs");
const QRCode = require("qrcode");

// Câu SQL dùng chung lấy ra asset_categories , suppliers, org_units, locations, users
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
  // 1. Danh sách tài sản (tìm kiếm + phân trang)
  async index(req, res) {
    try {
      const search = req.query.name || "";
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

      // Đếm tổng số bản ghi
      const countSql = `SELECT COUNT(*) AS total FROM assets a ${whereClause}`;
      const [[{ total }]] = await db.query(countSql, params);
      const totalPages = Math.ceil(total / limit) || 1;

      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      // Lấy danh sách tài sản
      const listSql = `
        ${ASSET_SELECT_SQL}
        ${whereClause}
        ORDER BY a.id DESC
        LIMIT ${offset}, ${limit}
      `;
      const [assets] = await db.query(listSql, params);

      // Lấy danh mục để lọc
      const [categories] = await db.query("SELECT id, name FROM asset_categories ORDER BY name");

      res.render("assets/index", {
        title: "Hồ sơ tài sản",
        assets,
        searchName: search,
        status,
        totalPages,
        pages,
        categories,
      });
    } catch (err) {
      console.error("Lỗi danh sách tài sản:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Chi tiết hồ sơ tài sản + Tem mã QR
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

      // Lấy lịch sử biến động tài sản từ asset_events (hoặc asset_history)
      const [events] = await db.query(
        `
        SELECT ae.*, u.full_name AS actor_name
        FROM asset_events ae
        LEFT JOIN users u ON ae.actor_id = u.id
        WHERE ae.asset_id = ?
        ORDER BY ae.id DESC
        LIMIT 20
      `,
        [asset.id]
      ).catch(() => [[]]);

      res.render("assets/show", {
        title: `Chi tiết tài sản - ${asset.code}`,
        asset,
        qrCodeDataUrl,
        events: events || [],
      });
    } catch (err) {
      console.error("Lỗi xem chi tiết tài sản:", err);
      res.redirect("/assets");
    }
  },

  // 3. Form chỉnh sửa tài sản
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

  // 4. Cập nhật thông tin tài sản
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
        `
        UPDATE assets
        SET code = ?, name = ?, category_id = ?, supplier_id = ?,
            org_unit_id = ?, location_id = ?, assignee_id = ?,
            original_cost = ?, purchase_date = ?, useful_life_months = ?,
            serial_no = ?, status = ?, updated_at = NOW()
        WHERE id = ?
      `,
        [
          code,
          name,
          category_id || null,
          supplier_id || null,
          org_unit_id || null,
          location_id || null,
          assignee_id || null,
          original_cost || 0,
          purchase_date || null,
          useful_life_months || 0,
          serial_no || null,
          status || "in_stock",
          req.params.id,
        ]
      );

      res.redirect(`/assets/${req.params.id}`);
    } catch (err) {
      console.error("Lỗi cập nhật tài sản:", err);
      res.status(500).send("Không thể cập nhật tài sản: " + err.message);
    }
  },

  // 5. Thu hồi tài sản từ nhân viên về kho
  async recall(req, res) {
    try {
      const assetId = req.params.id;
      const currentUserId = req.session.user ? req.session.user.id : null;

      // Đưa trạng thái về 'in_stock', gỡ assignee_id
      await db.query(
        "UPDATE assets SET assignee_id = NULL, status = 'in_stock', updated_at = NOW() WHERE id = ?",
        [assetId]
      );

      // Ghi nhận biến động vào asset_events
      await db.query(
        `
        INSERT INTO asset_events (asset_id, event_type, from_status, to_status, actor_id, note)
        VALUES (?, 'RECALL', 'in_use', 'in_stock', ?, 'Thu hồi tài sản về kho trung tâm')
      `,
        [assetId, currentUserId]
      ).catch(() => {});

      res.redirect("/assets/" + assetId);
    } catch (err) {
      console.error("Lỗi thu hồi tài sản:", err);
      res.redirect("/assets");
    }
  },

  // 6. Xóa logic tài sản (Soft Delete)
  async delete(req, res) {
    try {
      await db.query("UPDATE assets SET deleted_at = NOW() WHERE id = ?", [req.params.id]);
      res.redirect("/assets");
    } catch (err) {
      res.status(500).send("Không thể xóa tài sản: " + err.message);
    }
  },
};

module.exports = assetController;
