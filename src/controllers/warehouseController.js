const db = require("../config/db");
const dayjs = require("dayjs");
const { logAssetEvent, logAudit } = require("../utils/logger");

const ASSET_SQL = `
  SELECT a.*, 
         c.name  AS category_name, 
         s.name  AS supplier_name,
         ou.name AS org_unit_name,
         l.name  AS location_name
  FROM assets a
  LEFT JOIN asset_categories c  ON a.category_id = c.id
  LEFT JOIN suppliers        s  ON a.supplier_id  = s.id
  LEFT JOIN org_units        ou ON a.org_unit_id  = ou.id
  LEFT JOIN locations        l  ON a.location_id  = l.id
`;

const warehouseController = {
  // 1. Danh sách tài sản trong kho (status = 'in_stock')
  async index(req, res) {
    try {
      const searchName = req.query.name || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const [[{ total }]] = await db.query(
        "SELECT COUNT(*) AS total FROM assets WHERE status = 'in_stock' AND deleted_at IS NULL AND (name LIKE ? OR code LIKE ?)",
        [`%${searchName}%`, `%${searchName}%`]
      );

      const totalPages = Math.ceil(total / limit) || 1;
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      const [assets] = await db.query(
        `
        ${ASSET_SQL}
        WHERE a.status = 'in_stock' AND a.deleted_at IS NULL AND (a.name LIKE ? OR a.code LIKE ?)
        ORDER BY a.id DESC
        LIMIT ${offset}, ${limit}
      `,
        [`%${searchName}%`, `%${searchName}%`]
      );

      const [categories] = await db.query("SELECT id, name FROM asset_categories ORDER BY name");
      const [suppliers] = await db.query("SELECT id, name FROM suppliers ORDER BY name");
      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");
      const [locations] = await db.query("SELECT id, name FROM locations WHERE active = 1 ORDER BY name");
      const [users] = await db.query("SELECT id, full_name, email FROM users WHERE status = 'ACTIVE' ORDER BY full_name");

      res.render("warehouse/index", {
        title: "Kho thiết bị & Tài sản",
        assets,
        searchName,
        totalPages,
        pages,
        formData: { categories, suppliers, orgUnits, locations, users },
      });
    } catch (err) {
      console.error("Lỗi kho tài sản:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Nhập mới tài sản vào kho
  async create(req, res) {
    try {
      const {
        code,
        name,
        category_id,
        supplier_id,
        org_unit_id,
        location_id,
        original_cost,
        purchase_date,
        useful_life_months,
        serial_no,
      } = req.body;

      // Sinh mã tự động nếu người dùng không nhập
      const finalCode =
        code && code.trim() !== ""
          ? code.trim()
          : `TS-${dayjs().format("YYYY")}-${Math.floor(10000 + Math.random() * 90000)}`;

      const currentUserId = req.session.user ? req.session.user.id : null;

      const [result] = await db.query(
        `
        INSERT INTO assets (code, name, category_id, supplier_id, org_unit_id, location_id,
                            original_cost, purchase_date, useful_life_months, status, serial_no, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'in_stock', ?, NOW(), NOW())
      `,
        [
          finalCode,
          name,
          category_id || null,
          supplier_id || null,
          org_unit_id || 227, // Mặc định Trụ sở chính nếu không chọn
          location_id || null,
          original_cost || 0,
          purchase_date || dayjs().format("YYYY-MM-DD"),
          useful_life_months || 36,
          serial_no || null,
        ]
      );

      // Ghi log biến động chuẩn
      await logAssetEvent(db, {
        asset_id: result.insertId,
        event_type: "INITIAL_IMPORT",
        to_org_unit_id: org_unit_id || 227,
        performed_by: currentUserId,
        note: "Nhập mới tài sản vào kho",
      });

      // Ghi audit
      await logAudit(db, {
        actor_id: currentUserId,
        action: "ASSET_IMPORT",
        entity: "assets",
        entity_id: result.insertId,
        after: { code, name, original_cost },
      });

      res.redirect("/warehouse");
    } catch (err) {
      console.error("Lỗi nhập kho:", err);
      res.status(500).send("Không thể nhập tài sản: " + err.message);
    }
  },

  // 3. Cấp phát trực tiếp tài sản từ kho cho nhân viên
  async assign(req, res) {
    try {
      const { asset_id, assignee_id, org_unit_id, location_id, note } = req.body;
      const currentUserId = req.session.user ? req.session.user.id : null;

      await db.query(
        `
        UPDATE assets
        SET status = 'in_use', assignee_id = ?, org_unit_id = COALESCE(?, org_unit_id),
            location_id = COALESCE(?, location_id), updated_at = NOW()
        WHERE id = ?
      `,
        [assignee_id, org_unit_id || null, location_id || null, asset_id]
      );

      // Ghi nhận biến động chuẩn
      await logAssetEvent(db, {
        asset_id,
        event_type: "ASSIGN",
        to_org_unit_id: org_unit_id || null,
        to_assignee_id: assignee_id || null,
        performed_by: currentUserId,
        note: note || "Cấp phát trực tiếp từ kho",
      });

      // Ghi audit
      await logAudit(db, {
        actor_id: currentUserId,
        action: "ASSET_ASSIGN",
        entity: "assets",
        entity_id: asset_id,
        before: { status: "in_stock" },
        after: { status: "in_use", assignee_id, org_unit_id },
      });

      res.redirect("/warehouse");
    } catch (err) {
      console.error("Lỗi cấp phát tài sản:", err);
      res.redirect("/warehouse");
    }
  },
};

module.exports = warehouseController;
