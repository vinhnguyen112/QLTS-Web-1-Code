const db = require("../config/db");

const reportController = {
  async index(req, res) {
    try {
      const [[totals]] = await db.query(`
        SELECT COUNT(*) AS grandTotalAssets,
               IFNULL(SUM(original_cost), 0) AS grandTotalCost
        FROM assets
        WHERE deleted_at IS NULL
      `);

      const [byDepartment] = await db.query(`
        SELECT ou.name AS department_name,
               COUNT(a.id) AS total_assets,
               IFNULL(SUM(a.original_cost), 0) AS total_cost
        FROM org_units ou
        LEFT JOIN assets a ON ou.id = a.org_unit_id AND a.deleted_at IS NULL
        WHERE ou.active = 1
        GROUP BY ou.id, ou.name
        HAVING total_assets > 0
        ORDER BY total_assets DESC
      `);

      const [byCategory] = await db.query(`
        SELECT c.name AS category_name,
               COUNT(a.id) AS total_assets,
               IFNULL(SUM(a.original_cost), 0) AS total_cost
        FROM asset_categories c
        LEFT JOIN assets a ON c.id = a.category_id AND a.deleted_at IS NULL
        WHERE c.active = 1
        GROUP BY c.id, c.name
        ORDER BY total_assets DESC
      `);

      const [byStatus] = await db.query(`
        SELECT status,
               COUNT(*) AS total_assets,
               IFNULL(SUM(original_cost), 0) AS total_cost
        FROM assets
        WHERE deleted_at IS NULL
        GROUP BY status
        ORDER BY total_assets DESC
      `);

      res.render("reports/index", {
        title: "Báo cáo & Thống kê tài sản doanh nghiệp",
        grandTotalAssets: Number(totals.grandTotalAssets) || 0,
        grandTotalCost: Number(totals.grandTotalCost) || 0,
        byDepartment,
        byCategory,
        byStatus,
      });
    } catch (err) {
      console.error("Lỗi báo cáo:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },
};

module.exports = reportController;
