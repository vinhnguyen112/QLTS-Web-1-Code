const db = require("../config/db");

const homeController = {
  // Hiển thị trang tổng quan (kết nối dữ liệu thật từ MySQL)
  async index(req, res) {
    try {
      // 1. Thống kê tổng số lượng và giá trị tài sản
      const [[totals]] = await db.query(`
        SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'in_use' THEN 1 ELSE 0 END) AS in_use,
          SUM(CASE WHEN status = 'in_stock' THEN 1 ELSE 0 END) AS in_stock,
          SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) AS maintenance,
          IFNULL(SUM(original_cost), 0) AS total_cost
        FROM assets
      `);

      const totalAssets = totals.total || 0;
      const inUse = Number(totals.in_use) || 0;
      const inStock = Number(totals.in_stock) || 0;
      const maintenance = Number(totals.maintenance) || 0;
      const totalCost = Number(totals.total_cost) || 0;

      // Tính tỷ lệ phần trăm (tránh chia cho 0)
      const inUsePercent = totalAssets > 0 ? ((inUse / totalAssets) * 100).toFixed(1) : "0.0";
      const inStockPercent = totalAssets > 0 ? ((inStock / totalAssets) * 100).toFixed(1) : "0.0";
      const maintenancePercent = totalAssets > 0 ? ((maintenance / totalAssets) * 100).toFixed(1) : "0.0";

      // 2. Thống kê tài sản phân bổ theo phòng ban (Top 10 phòng nhiều tài sản nhất)
      const [byDepartment] = await db.query(`
        SELECT 
          d.department_id, 
          d.department_name, 
          COUNT(a.asset_id) AS total_assets, 
          IFNULL(SUM(a.original_cost), 0) AS total_cost 
        FROM departments d 
        LEFT JOIN assets a ON d.department_id = a.department_id 
        GROUP BY d.department_id, d.department_name 
        ORDER BY total_assets DESC, d.department_name ASC
        LIMIT 10
      `);

      res.render("home/index", {
        title: "Tổng quan",
        totalAssets,
        inUse,
        inStock,
        maintenance,
        totalCost,
        inUsePercent,
        inStockPercent,
        maintenancePercent,
        byDepartment,
      });
    } catch (err) {
      console.log("Lỗi lấy dữ liệu trang chủ:", err);
      res.status(500).send("Đã xảy ra lỗi khi tải trang chủ");
    }
  },
};

module.exports = homeController;

