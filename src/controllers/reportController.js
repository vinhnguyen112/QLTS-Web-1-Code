const db = require("../config/db");

const reportController = {
  // Trang Báo cáo & Thống kê tổng hợp (Dữ liệu thật từ MySQL qlts-new-01)
  async index(req, res) {
    try {
      // 1. Tổng số lượng và tổng nguyên giá toàn bộ tài sản
      const [[totals]] = await db.query(`
        SELECT 
          COUNT(*) AS grandTotalAssets,
          IFNULL(SUM(original_cost), 0) AS grandTotalCost
        FROM assets
      `);

      // 2. Thống kê theo phòng ban (thông qua locations)
      const [byDepartment] = await db.query(`
        SELECT 
          d.department_id, 
          d.department_name, 
          COUNT(a.asset_id) AS total_assets, 
          IFNULL(SUM(a.original_cost), 0) AS total_cost 
        FROM departments d 
        LEFT JOIN locations l ON d.department_id = l.department_id
        LEFT JOIN assets a ON l.location_id = a.location_id
        GROUP BY d.department_id, d.department_name 
        ORDER BY total_assets DESC, d.department_name ASC
      `);

      // 3. Thống kê theo danh mục loại tài sản
      const [byCategory] = await db.query(`
        SELECT 
          c.category_id, 
          c.category_name, 
          COUNT(a.asset_id) AS total_assets, 
          IFNULL(SUM(a.original_cost), 0) AS total_cost 
        FROM categories c 
        LEFT JOIN assets a ON c.category_id = a.category_id
        GROUP BY c.category_id, c.category_name 
        ORDER BY total_assets DESC, c.category_name ASC
      `);

      res.render("reports/index", {
        title: "Báo cáo & Thống kê",
        grandTotalAssets: totals ? Number(totals.grandTotalAssets) || 0 : 0,
        grandTotalCost: totals ? Number(totals.grandTotalCost) || 0 : 0,
        byDepartment,
        byCategory,
      });
    } catch (err) {
      console.log("Lỗi lấy dữ liệu báo cáo:", err);
      res.status(500).send("Đã xảy ra lỗi khi lấy báo cáo thống kê");
    }
  },
};

module.exports = reportController;
