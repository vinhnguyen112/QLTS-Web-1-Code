const db = require("../config/db");
const dayjs = require("dayjs");

const depreciationController = {
  async index(req, res) {
    try {
      const search = (req.query.search || "").trim();
      const orgUnitId = req.query.org_unit_id || "";
      const categoryId = req.query.category_id || "";
      const statusFilter = req.query.status || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 15;

      let whereClause = "WHERE a.deleted_at IS NULL";
      const params = [];

      if (search) {
        whereClause += " AND (a.code LIKE ? OR a.name LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
      }

      if (orgUnitId) {
        whereClause += " AND a.org_unit_id = ?";
        params.push(orgUnitId);
      }

      if (categoryId) {
        whereClause += " AND a.category_id = ?";
        params.push(categoryId);
      }

      // Lấy toàn bộ tài sản thỏa mãn điều kiện lọc để tính toán chỉ số khấu hao
      const [assets] = await db.query(
        `
        SELECT a.id, a.code, a.name, a.original_cost, a.residual_value,
               a.useful_life_months, a.purchase_date, a.depreciation_start,
               a.opening_accumulated, a.status AS asset_status,
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

      const now = dayjs();
      let totalCost = 0;
      let totalMonthly = 0;
      let totalAccumulated = 0;
      let totalRemaining = 0;

      // Tính toán khấu hao đường thẳng cho từng tài sản
      const computedAssets = assets.map((a) => {
        const cost = Number(a.original_cost) || 0;
        const residual = Number(a.residual_value) || 0;
        const months = Number(a.useful_life_months) || 0;
        const depreciableAmount = Math.max(0, cost - residual);

        let monthly = 0;
        let elapsedMonths = 0;
        let usedMonths = 0;
        let remainingMonths = 0;
        let accumulated = Number(a.opening_accumulated) || 0;
        let remainingValue = cost;
        let percent = 0;
        let depStatus = "non_depreciable";
        let statusBadge = '<span class="badge text-bg-light border">Không trích</span>';

        if (months > 0) {
          monthly = Math.round(depreciableAmount / months);
          const startDate = a.depreciation_start
            ? dayjs(a.depreciation_start)
            : a.purchase_date
            ? dayjs(a.purchase_date)
            : now;

          elapsedMonths = Math.max(0, now.diff(startDate, "month"));
          usedMonths = Math.min(months, elapsedMonths);
          remainingMonths = Math.max(0, months - usedMonths);

          accumulated = Math.min(cost, Math.round(accumulated + monthly * usedMonths));
          remainingValue = Math.max(0, cost - accumulated);
          percent = cost > 0 ? Math.min(100, Math.round((accumulated / cost) * 100)) : 100;

          if (remainingMonths === 0 || remainingValue <= 0) {
            depStatus = "fully_depreciated";
            statusBadge = '<span class="badge text-bg-secondary">Đã hết KH</span>';
          } else {
            depStatus = "depreciating";
            statusBadge = '<span class="badge text-bg-success">Đang trích</span>';
          }
        }

        totalCost += cost;
        totalMonthly += depStatus === "depreciating" ? monthly : 0;
        totalAccumulated += accumulated;
        totalRemaining += remainingValue;

        return {
          id: a.id,
          code: a.code,
          name: a.name,
          category_name: a.category_name,
          org_unit_name: a.org_unit_name,
          purchase_date: a.purchase_date,
          useful_life_months: months,
          original_cost: cost,
          monthly_amount: monthly,
          used_months: usedMonths,
          remaining_months: remainingMonths,
          accumulated_amount: accumulated,
          remaining_value: remainingValue,
          depreciation_percent: percent,
          depreciation_status: depStatus,
          status_badge: statusBadge,
        };
      });

      // Lọc theo tình trạng khấu hao nếu có chọn
      let filteredAssets = computedAssets;
      if (statusFilter === "depreciating") {
        filteredAssets = computedAssets.filter((a) => a.depreciation_status === "depreciating");
      } else if (statusFilter === "fully_depreciated") {
        filteredAssets = computedAssets.filter((a) => a.depreciation_status === "fully_depreciated");
      }

      // Phân trang danh sách hiển thị
      const totalItems = filteredAssets.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const offset = (page - 1) * limit;
      const paginatedAssets = filteredAssets.slice(offset, offset + limit);

      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ number: i, active: i === page });
      }

      // Lấy danh sách danh mục và đơn vị để đổ vào dropdown bộ lọc
      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");
      const [categories] = await db.query("SELECT id, name FROM asset_categories WHERE active = 1 ORDER BY name");

      res.render("depreciation/index", {
        title: "Khấu hao tài sản (Phương pháp đường thẳng)",
        assets: paginatedAssets,
        totalItems,
        totalPages,
        currentPage: page,
        pages,
        search,
        orgUnitId,
        categoryId,
        statusFilter,
        orgUnits,
        categories,
        summary: {
          totalCost,
          totalMonthly,
          totalAccumulated,
          totalRemaining,
          depreciatingCount: computedAssets.filter((a) => a.depreciation_status === "depreciating").length,
          fullyCount: computedAssets.filter((a) => a.depreciation_status === "fully_depreciated").length,
        },
      });
    } catch (err) {
      console.error("Lỗi khấu hao tài sản:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },
};

module.exports = depreciationController;
