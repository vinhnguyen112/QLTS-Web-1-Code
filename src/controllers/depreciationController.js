const db = require("../config/db");
const { calcDepreciation, generateDepreciationSchedule } = require("../utils/depreciation");

const depreciationController = {
  async index(req, res) {
    try {
      const { search = "", org_unit_id = "", category_id = "", status = "" } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = 15;

      // 1. Xây dựng điều kiện lọc SQL
      let whereClause = "WHERE a.deleted_at IS NULL";
      const params = [];

      if (search.trim()) {
        whereClause += " AND (a.code LIKE ? OR a.name LIKE ?)";
        params.push(`%${search.trim()}%`, `%${search.trim()}%`);
      }
      if (org_unit_id) {
        whereClause += " AND a.org_unit_id = ?";
        params.push(org_unit_id);
      }
      if (category_id) {
        whereClause += " AND a.category_id = ?";
        params.push(category_id);
      }

      // 2. Truy vấn tài sản
      const [rows] = await db.query(
        `
        SELECT a.id, a.code, a.name, a.original_cost, a.residual_value,
               a.useful_life_months, a.purchase_date, a.depreciation_start,
               a.opening_accumulated,
               ou.name AS org_unit_name,
               c.name  AS category_name
        FROM assets a
        LEFT JOIN org_units        ou ON a.org_unit_id = ou.id
        LEFT JOIN asset_categories c  ON a.category_id = c.id
        ${whereClause}
        ORDER BY a.id DESC
      `,
        params
      );

      // 3. Tính toán khấu hao và thống kê tổng hợp (KPI)
      let totalCost = 0, totalMonthly = 0, totalAccumulated = 0, totalRemaining = 0;
      let assets = rows.map((a) => {
        const dep = calcDepreciation(a);
        const cost = Number(a.original_cost) || 0;
        totalCost += cost;
        totalMonthly += dep.hasDepreciation && !dep.isDone ? dep.monthly : 0;
        totalAccumulated += dep.accumulated;
        totalRemaining += dep.remainingValue;
        return { ...a, ...dep };
      });

      // 4. Lọc theo tình trạng khấu hao nếu có chọn
      if (status === "depreciating") {
        assets = assets.filter((a) => a.hasDepreciation && !a.isDone);
      } else if (status === "fully_depreciated") {
        assets = assets.filter((a) => a.hasDepreciation && a.isDone);
      }

      // 5. Phân trang
      const totalItems = assets.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const paginatedAssets = assets.slice((page - 1) * limit, page * limit);
      const pages = Array.from({ length: totalPages }, (_, i) => ({
        number: i + 1,
        active: i + 1 === page,
      }));

      // 6. Lấy danh sách dropdown bộ lọc
      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");
      const [categories] = await db.query("SELECT id, name FROM asset_categories WHERE active = 1 ORDER BY name");

      res.render("depreciation/index", {
        title: "Khấu hao tài sản (Phương pháp đường thẳng)",
        assets: paginatedAssets,
        totalItems,
        totalPages,
        currentPage: page,
        pages,
        search: search.trim(),
        orgUnitId: org_unit_id,
        categoryId: category_id,
        statusFilter: status,
        orgUnits,
        categories,
        summary: {
          totalCost,
          totalMonthly,
          totalAccumulated,
          totalRemaining,
          depreciatingCount: assets.filter((a) => a.hasDepreciation && !a.isDone).length,
          fullyCount: assets.filter((a) => a.hasDepreciation && a.isDone).length,
        },
      });
    } catch (err) {
      console.error("Lỗi khấu hao tài sản:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  async schedule(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await db.query(
        `
        SELECT a.id, a.code, a.name, a.original_cost, a.residual_value,
               a.useful_life_months, a.purchase_date, a.depreciation_start,
               a.opening_accumulated,
               ou.name AS org_unit_name,
               c.name  AS category_name
        FROM assets a
        LEFT JOIN org_units        ou ON a.org_unit_id = ou.id
        LEFT JOIN asset_categories c  ON a.category_id = c.id
        WHERE a.id = ? AND a.deleted_at IS NULL
        LIMIT 1
      `,
        [id]
      );

      if (!rows.length) {
        return res.status(404).json({ success: false, message: "Không tìm thấy tài sản." });
      }

      const asset = rows[0];
      const dep = calcDepreciation(asset);
      const schedule = generateDepreciationSchedule(asset);

      return res.json({
        success: true,
        asset: {
          id: asset.id,
          code: asset.code,
          name: asset.name,
          category_name: asset.category_name || "Chưa phân loại",
          org_unit_name: asset.org_unit_name || "Chưa gán",
          original_cost: Number(asset.original_cost) || 0,
          residual_value: Number(asset.residual_value) || 0,
          useful_life_months: Number(asset.useful_life_months) || 0,
          purchase_date: asset.purchase_date,
          depreciation_start: asset.depreciation_start,
        },
        dep,
        schedule,
      });
    } catch (err) {
      console.error("Lỗi lấy kế hoạch khấu hao:", err);
      return res.status(500).json({ success: false, message: "Lỗi hệ thống: " + err.message });
    }
  },
};

module.exports = depreciationController;
