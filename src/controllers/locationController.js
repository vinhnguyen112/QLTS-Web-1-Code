const db = require("../config/db");

const locationController = {
  // 1. Danh sách vị trí / phòng máy
  async index(req, res) {
    try {
      const searchName = req.query.name || "";
      const orgUnitId = req.query.org_unit_id || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      let whereClause = "WHERE l.active = 1";
      const params = [];

      if (searchName) {
        whereClause += " AND (l.name LIKE ? OR l.code LIKE ?)";
        params.push(`%${searchName}%`, `%${searchName}%`);
      }

      if (orgUnitId) {
        whereClause += " AND l.org_unit_id = ?";
        params.push(orgUnitId);
      }

      const countSql = `SELECT COUNT(*) AS total FROM locations l ${whereClause}`;
      const [[{ total }]] = await db.query(countSql, params);

      const totalPages = Math.ceil(total / limit) || 1;
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      const listSql = `
        SELECT l.*,
               ou.name AS org_unit_name,
               COUNT(a.id) AS asset_count
        FROM locations l
        LEFT JOIN org_units ou ON l.org_unit_id = ou.id
        LEFT JOIN assets a     ON l.id = a.location_id AND a.deleted_at IS NULL
        ${whereClause}
        GROUP BY l.id, l.code, l.name, l.org_unit_id
        ORDER BY l.id DESC
        LIMIT ${offset}, ${limit}
      `;
      const [locations] = await db.query(listSql, params);

      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");

      res.render("locations/index", {
        title: "Vị trí lắp đặt & Phòng máy",
        locations,
        searchName,
        orgUnitId,
        totalPages,
        pages,
        currentPage: page,
        orgUnits,
      });
    } catch (err) {
      console.error("Lỗi danh sách vị trí:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Thêm vị trí mới
  async create(req, res) {
    try {
      const { code, name, org_unit_id } = req.body;
      const cleanCode = (code || "").trim().toUpperCase();
      const cleanName = (name || "").trim();
      const unitId = org_unit_id || 227;

      if (!cleanCode || !cleanName) {
        return res.redirect("/locations?error=" + encodeURIComponent("Vui lòng nhập đầy đủ mã và tên vị trí!"));
      }

      // Kiểm tra trùng mã vị trí trong đơn vị (kể cả bản ghi đã xóa mềm)
      const [existing] = await db.query(
        "SELECT id FROM locations WHERE code = ? AND org_unit_id = ? LIMIT 1",
        [cleanCode, unitId]
      );
      if (existing.length > 0) {
        return res.redirect(
          "/locations?error=" +
            encodeURIComponent(`Mã vị trí '${cleanCode}' đã tồn tại trong đơn vị này, vui lòng nhập mã khác!`)
        );
      }

      await db.query(
        "INSERT INTO locations (code, name, org_unit_id, active, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())",
        [cleanCode, cleanName, unitId]
      );
      res.redirect("/locations?msg=" + encodeURIComponent("Thêm vị trí mới thành công!"));
    } catch (err) {
      console.error("Lỗi thêm vị trí:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.redirect(
          "/locations?error=" + encodeURIComponent("Mã vị trí đã tồn tại trong đơn vị này, vui lòng nhập mã khác!")
        );
      }
      res.redirect("/locations?error=" + encodeURIComponent("Lỗi thêm vị trí: " + err.message));
    }
  },

  // 3. Form sửa vị trí
  async edit(req, res) {
    try {
      const [rows] = await db.query("SELECT * FROM locations WHERE id = ?", [req.params.id]);
      if (rows.length === 0) return res.redirect("/locations");

      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");

      res.render("locations/locations-edit", {
        title: `Sửa vị trí - ${rows[0].name}`,
        location: rows[0],
        orgUnits,
      });
    } catch (err) {
      console.error("Lỗi xem vị trí sửa:", err);
      res.redirect("/locations");
    }
  },

  // 4. Cập nhật vị trí
  async update(req, res) {
    try {
      const { code, name, org_unit_id, active } = req.body;
      const cleanCode = (code || "").trim().toUpperCase();
      const cleanName = (name || "").trim();
      const unitId = org_unit_id || 227;
      const isActive = active === undefined ? 1 : (active === "1" || active === 1 ? 1 : 0);

      // Kiểm tra trùng mã vị trí với bản ghi khác trong cùng đơn vị
      const [duplicate] = await db.query(
        "SELECT id FROM locations WHERE code = ? AND org_unit_id = ? AND id != ? LIMIT 1",
        [cleanCode, unitId, req.params.id]
      );
      if (duplicate.length > 0) {
        return res.redirect(
          "/locations?error=" +
            encodeURIComponent(`Mã vị trí '${cleanCode}' đã tồn tại trong đơn vị này, vui lòng nhập mã khác!`)
        );
      }

      await db.query(
        "UPDATE locations SET code = ?, name = ?, org_unit_id = ?, active = ?, updated_at = NOW() WHERE id = ?",
        [cleanCode, cleanName, unitId, isActive, req.params.id]
      );

      res.redirect("/locations?msg=" + encodeURIComponent("Cập nhật vị trí thành công!"));
    } catch (err) {
      console.error("Lỗi cập nhật vị trí:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.redirect(
          "/locations?error=" + encodeURIComponent("Mã vị trí đã tồn tại trong đơn vị này, vui lòng nhập mã khác!")
        );
      }
      res.redirect("/locations?error=" + encodeURIComponent("Lỗi cập nhật: " + err.message));
    }
  },

  // 5. Xóa vị trí (ngừng hoạt động)
  async delete(req, res) {
    try {
      await db.query("UPDATE locations SET active = 0, updated_at = NOW() WHERE id = ?", [req.params.id]);
      res.redirect("/locations?msg=" + encodeURIComponent("Đã ngưng hoạt động vị trí thành công!"));
    } catch (err) {
      console.error("Lỗi xóa vị trí:", err);
      res.redirect("/locations?error=" + encodeURIComponent("Không thể xóa vị trí: " + err.message));
    }
  },
};

module.exports = locationController;
