const db = require("../config/db");
const dayjs = require("dayjs");

const stocktakeController = {
  // 1. Danh sách các đợt kiểm kê
  async index(req, res) {
    try {
      const [stocktakes] = await db.query(`
        SELECT st.*, 
               ou.name AS org_unit_name,
               u.full_name AS created_by_name,
               (SELECT COUNT(*) FROM stocktake_items sti WHERE sti.stocktake_id = st.id) AS total_items,
               (SELECT COUNT(*) FROM stocktake_items sti WHERE sti.stocktake_id = st.id AND sti.result = 'matched') AS matched_count,
               (SELECT COUNT(*) FROM stocktake_items sti WHERE sti.stocktake_id = st.id AND sti.result = 'missing') AS missing_count,
               (SELECT COUNT(*) FROM stocktake_items sti WHERE sti.stocktake_id = st.id AND sti.result = 'pending') AS pending_count
        FROM stocktakes st
        LEFT JOIN org_units ou ON st.scope_org_unit_id = ou.id
        LEFT JOIN users     u  ON st.created_by        = u.id
        ORDER BY st.id DESC
      `);

      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");
      const [locations] = await db.query("SELECT id, name FROM locations WHERE active = 1 ORDER BY name");

      res.render("stocktakes/index", {
        title: "Kiểm kê tài sản & Quét mã QR",
        stocktakes,
        formData: { orgUnits, locations },
      });
    } catch (err) {
      console.error("Lỗi danh sách kiểm kê:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Tạo mới đợt kiểm kê & Nạp danh sách tài sản cần kiểm
  async create(req, res) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { name, scope_org_unit_id, scope_location_id, notes } = req.body;
      const currentUserId = req.session.user ? req.session.user.id : null;
      const code = `KK-${dayjs().format("YYYY")}-${Math.floor(1000 + Math.random() * 9000)}`;

      const orgUnitId = scope_org_unit_id && scope_org_unit_id.trim() !== "" ? scope_org_unit_id.trim() : null;
      const locationId = scope_location_id && scope_location_id.trim() !== "" ? scope_location_id.trim() : null;

      // Tạo đợt kiểm kê
      const [result] = await connection.query(
        `
        INSERT INTO stocktakes (code, name, scope_org_unit_id, scope_location_id, status, started_at, created_by, notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'in_progress', NOW(), ?, ?, NOW(), NOW())
      `,
        [
          code,
          (name || `Đợt kiểm kê ${code}`).trim(),
          orgUnitId,
          locationId,
          currentUserId,
          notes || "Kiểm kê định kỳ",
        ]
      );
      const stocktakeId = result.insertId;

      // Nạp toàn bộ tài sản vào đợt kiểm kê trong 1 câu truy vấn duy nhất (Batch Insert)
      let assetWhere = "WHERE a.deleted_at IS NULL AND a.status IN ('in_use', 'in_stock', 'maintenance')";
      const insertParams = [stocktakeId];
      if (orgUnitId) {
        assetWhere += " AND a.org_unit_id = ?";
        insertParams.push(orgUnitId);
      }
      if (locationId) {
        assetWhere += " AND a.location_id = ?";
        insertParams.push(locationId);
      }

      await connection.query(
        `
        INSERT INTO stocktake_items (stocktake_id, asset_id, raw_code, expected_location_id, result)
        SELECT ?, a.id, a.code, a.location_id, 'pending'
        FROM assets a
        ${assetWhere}
      `,
        insertParams
      );

      await connection.commit();
      res.redirect("/stocktakes/" + stocktakeId);
    } catch (err) {
      await connection.rollback();
      console.error("Lỗi tạo đợt kiểm kê:", err);
      res.status(500).send("Lỗi: " + err.message);
    } finally {
      connection.release();
    }
  },

  // 3. Chi tiết đợt kiểm kê & Đối chiếu kết quả
  async show(req, res) {
    try {
      const stocktakeId = req.params.id;

      const [stocktakes] = await db.query(
        `
        SELECT st.*, 
               ou.name AS org_unit_name,
               u.full_name AS created_by_name
        FROM stocktakes st
        LEFT JOIN org_units ou ON st.scope_org_unit_id = ou.id
        LEFT JOIN users     u  ON st.created_by        = u.id
        WHERE st.id = ?
      `,
        [stocktakeId]
      );
      if (stocktakes.length === 0) return res.redirect("/stocktakes");
      const stocktake = stocktakes[0];

      // Lấy danh sách tài sản kiểm kê
      const [items] = await db.query(
        `
        SELECT sti.*,
               a.code AS asset_code,
               a.name AS asset_name,
               a.original_cost,
               u.full_name AS assignee_name,
               el.name AS expected_location_name,
               al.name AS actual_location_name,
               sb.full_name AS scanned_by_name
        FROM stocktake_items sti
        LEFT JOIN assets a     ON sti.asset_id = a.id
        LEFT JOIN users u      ON a.assignee_id = u.id
        LEFT JOIN locations el ON sti.expected_location_id = el.id
        LEFT JOIN locations al ON sti.actual_location_id   = al.id
        LEFT JOIN users sb     ON sti.scanned_by           = sb.id
        WHERE sti.stocktake_id = ?
        ORDER BY sti.result ASC, sti.id ASC
      `,
        [stocktakeId]
      );

      // Thống kê nhanh
      const summary = {
        total: items.length,
        matched: items.filter((i) => i.result === "matched").length,
        missing: items.filter((i) => i.result === "missing").length,
        pending: items.filter((i) => i.result === "pending").length,
        misplaced: items.filter((i) => i.result === "misplaced").length,
        extra: items.filter((i) => i.result === "extra").length,
      };

      res.render("stocktakes/show", {
        title: `Đợt kiểm kê - ${stocktake.code}`,
        stocktake,
        items,
        summary,
      });
    } catch (err) {
      console.error("Lỗi xem đợt kiểm kê:", err);
      res.redirect("/stocktakes");
    }
  },

  // 4. Giao diện quét QR trực tiếp bằng Camera
  async scanPage(req, res) {
    try {
      const stocktakeId = req.params.id;
      const [stocktakes] = await db.query("SELECT * FROM stocktakes WHERE id = ?", [stocktakeId]);
      if (stocktakes.length === 0) return res.redirect("/stocktakes");

      res.render("stocktakes/scan", {
        title: `Quét mã QR kiểm kê - ${stocktakes[0].code}`,
        stocktake: stocktakes[0],
      });
    } catch (err) {
      res.redirect("/stocktakes");
    }
  },

  // 5. API nhận diện mã quét QR từ Camera
  async recordScan(req, res) {
    try {
      const stocktakeId = req.params.id;
      const { code } = req.body;
      const currentUserId = req.session.user ? req.session.user.id : null;

      if (!code) {
        return res.status(400).json({ success: false, message: "Không tìm thấy mã quét" });
      }

      let cleanCode = code.trim();
      const urlMatch = cleanCode.match(/\/assets\/([^/?#]+)/i);
      if (urlMatch) {
        cleanCode = urlMatch[1];
      }

      // Tìm tài sản theo code hoặc qr_token hoặc id
      const [assets] = await db.query(
        "SELECT * FROM assets WHERE code = ? OR qr_token = ? OR id = ?",
        [cleanCode, cleanCode, isNaN(cleanCode) ? 0 : Number(cleanCode)]
      );

      if (assets.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy tài sản nào khớp với mã "${code}"`,
        });
      }
      const asset = assets[0];

      // Kiểm tra xem tài sản này có nằm trong đợt kiểm kê không
      const [items] = await db.query(
        "SELECT * FROM stocktake_items WHERE stocktake_id = ? AND asset_id = ?",
        [stocktakeId, asset.id]
      );

      if (items.length > 0) {
        // Có trong danh sách kiểm kê -> cập nhật kết quả Khớp ('matched')
        const item = items[0];
        const newResult = item.result === "extra" ? "extra" : "matched";
        await db.query(
          `
          UPDATE stocktake_items
          SET result = ?, scanned_at = NOW(), scanned_by = ?
          WHERE id = ?
        `,
          [newResult, currentUserId, item.id]
        );

        return res.json({
          success: true,
          status: newResult,
          asset_code: asset.code,
          asset_name: asset.name,
          message: `ĐÃ KHỚP: [${asset.code}] ${asset.name}`,
        });
      } else {
        // Tài sản nằm ngoài phạm vi kiểm kê -> ghi nhận 'Thừa' (extra)
        await db.query(
          `
          INSERT INTO stocktake_items (stocktake_id, asset_id, raw_code, result, scanned_at, scanned_by)
          VALUES (?, ?, ?, 'extra', NOW(), ?)
        `,
          [stocktakeId, asset.id, asset.code, currentUserId]
        );

        return res.json({
          success: true,
          status: "extra",
          asset_code: asset.code,
          asset_name: asset.name,
          message: `PHÁT HIỆN THỪA (Ngoài phạm vi): [${asset.code}] ${asset.name}`,
        });
      }
    } catch (err) {
      console.error("Lỗi ghi nhận quét:", err);
      res.status(500).json({ success: false, message: "Lỗi máy chủ: " + err.message });
    }
  },

  // 6. Đóng đợt kiểm kê & Chốt kết quả
  async close(req, res) {
    try {
      const stocktakeId = req.params.id;

      // Chuyển tất cả những tài sản còn 'pending' (chưa quét) thành 'missing' (thiếu)
      await db.query(
        "UPDATE stocktake_items SET result = 'missing' WHERE stocktake_id = ? AND result = 'pending'",
        [stocktakeId]
      );

      // Cập nhật trạng thái đợt kiểm kê sang 'closed'
      await db.query(
        "UPDATE stocktakes SET status = 'closed', closed_at = NOW(), updated_at = NOW() WHERE id = ?",
        [stocktakeId]
      );

      res.redirect("/stocktakes/" + stocktakeId);
    } catch (err) {
      console.error("Lỗi đóng đợt kiểm kê:", err);
      res.redirect("/stocktakes");
    }
  },
};

module.exports = stocktakeController;
