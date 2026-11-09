const db = require("../config/db");

const homeController = {
  async index(req, res) {
    try {
      // 1. Thống kê tổng số lượng & hiện trạng tài sản
      const [[totals]] = await db.query(`
        SELECT
          COUNT(*) AS totalAssets,
          IFNULL(SUM(status = 'in_use'), 0) AS inUse,
          IFNULL(SUM(status = 'in_stock'), 0) AS inStock,
          IFNULL(SUM(status = 'maintenance'), 0) AS maintenance,
          IFNULL(SUM(status = 'disposed'), 0) AS disposed,
          IFNULL(SUM(original_cost), 0) AS totalCost
        FROM assets
        WHERE deleted_at IS NULL
      `);

      // 2. Lấy 5 tài sản mới nhất
      const [recentAssets] = await db.query(`
        SELECT a.id, a.code, a.name, a.status, a.original_cost,
               ou.name AS org_unit_name, c.name AS category_name
        FROM assets a
        LEFT JOIN org_units ou ON a.org_unit_id = ou.id
        LEFT JOIN asset_categories c ON a.category_id = c.id
        WHERE a.deleted_at IS NULL
        ORDER BY a.id DESC
        LIMIT 5
      `);

      // 3. Thống kê theo phòng ban cho biểu đồ
      const [deptStats] = await db.query(`
        SELECT ou.name AS dept_name, COUNT(a.id) AS asset_count
        FROM org_units ou
        LEFT JOIN assets a ON ou.id = a.org_unit_id AND a.deleted_at IS NULL
        WHERE ou.active = 1
        GROUP BY ou.id, ou.name
        HAVING asset_count > 0
        ORDER BY asset_count DESC
        LIMIT 8
      `);

      // 4. Thống kê theo danh mục cho biểu đồ
      const [catStats] = await db.query(`
        SELECT c.name AS cat_name, COUNT(a.id) AS asset_count
        FROM asset_categories c
        LEFT JOIN assets a ON c.id = a.category_id AND a.deleted_at IS NULL
        GROUP BY c.id, c.name
        ORDER BY asset_count DESC
      `);

      res.render("home/index", {
        title: "Tổng quan Dashboard",
        totals,
        recentAssets,
        deptLabels: JSON.stringify(deptStats.map((d) => d.dept_name)),
        deptData: JSON.stringify(deptStats.map((d) => d.asset_count)),
        catLabels: JSON.stringify(catStats.map((c) => c.cat_name)),
        catData: JSON.stringify(catStats.map((c) => c.asset_count)),
      });
    } catch (err) {
      console.error("Lỗi Dashboard:", err);
      res.status(500).send("Lỗi tải trang tổng quan: " + err.message);
    }
  },
};

module.exports = homeController;
