const db = require("../config/db");

const locationController = {
  // 1. Danh sách vị trí / phòng máy
  async index(req, res) {
    try {
      const searchName = req.query.name || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const [[{ total }]] = await db.query(
        "SELECT COUNT(*) AS total FROM locations WHERE active = 1 AND (name LIKE ? OR code LIKE ?)",
        [`%${searchName}%`, `%${searchName}%`]
      );

      const totalPages = Math.ceil(total / limit) || 1;
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      const [locations] = await db.query(
        `
        SELECT l.*,
               ou.name AS org_unit_name,
               COUNT(a.id) AS asset_count
        FROM locations l
        LEFT JOIN org_units ou ON l.org_unit_id = ou.id
        LEFT JOIN assets a     ON l.id = a.location_id AND a.deleted_at IS NULL
        WHERE l.active = 1 AND (l.name LIKE ? OR l.code LIKE ?)
        GROUP BY l.id, l.code, l.name, l.org_unit_id
        ORDER BY l.id ASC
        LIMIT ${offset}, ${limit}
      `,
        [`%${searchName}%`, `%${searchName}%`]
      );

      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");

      res.render("locations/index", {
        title: "Vị trí lắp đặt & Phòng máy",
        locations,
        searchName,
        totalPages,
        pages,
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
      await db.query(
        "INSERT INTO locations (code, name, org_unit_id, active, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())",
        [code, name, org_unit_id || 227]
      );
      res.redirect("/locations");
    } catch (err) {
      console.error("Lỗi thêm vị trí:", err);
      res.redirect("/locations");
    }
  },

  // 3. Xóa vị trí (Soft delete)
  async delete(req, res) {
    try {
      await db.query("UPDATE locations SET active = 0, updated_at = NOW() WHERE id = ?", [req.params.id]);
      res.redirect("/locations");
    } catch (err) {
      res.status(500).send("Không thể xóa: " + err.message);
    }
  },
};

module.exports = locationController;

