const db = require("../config/db");
const { calcDepreciation, generateDepreciationSchedule } = require("../utils/depreciation");

const depreciationController = {
  // 1. Danh sách khấu hao toàn bộ tài sản
  async index(req, res) {
    try {
      const search = (req.query.search || "").trim();
      const orgUnitId = req.query.org_unit_id || "";
      const page = parseInt(req.query.page) || 1;
      const limit = 15;

      // Xây dựng điều kiện tìm kiếm
      let where = "WHERE a.deleted_at IS NULL";
      const params = [];
      if (search) {
        where += " AND (a.code LIKE ? OR a.name LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
      }
      if (orgUnitId) {
        where += " AND a.org_unit_id = ?";
        params.push(orgUnitId);
      }

      // Lấy danh sách tài sản kèm đơn vị quản lý
      const [rows] = await db.query(
        `SELECT a.id, a.code, a.name, a.original_cost, a.residual_value,
                a.useful_life_months, a.purchase_date, a.depreciation_start,
                a.opening_accumulated, ou.name AS org_unit_name
         FROM assets a
         LEFT JOIN org_units ou ON a.org_unit_id = ou.id
         ${where}
         ORDER BY a.id DESC`,
        params
      );

      // Tính khấu hao từng tài sản và tổng hợp số liệu
      let totalCost = 0, totalAccumulated = 0, totalRemaining = 0;
      const assets = rows.map((item) => {
        const dep = calcDepreciation(item);
        totalCost += Number(item.original_cost) || 0;
        totalAccumulated += dep.accumulated;
        totalRemaining += dep.remainingValue;
        return { ...item, ...dep };
      });

      // Phân trang
      const totalPages = Math.ceil(assets.length / limit) || 1;
      const paginatedAssets = assets.slice((page - 1) * limit, page * limit);
      const pages = Array.from({ length: totalPages }, (_, i) => ({
        number: i + 1,
        active: i + 1 === page,
      }));

      // Danh mục phòng ban cho bộ lọc
      const [orgUnits] = await db.query("SELECT id, name FROM org_units WHERE active = 1 ORDER BY name");

      res.render("depreciation/index", {
        title: "Khấu hao tài sản",
        assets: paginatedAssets,
        totalPages,
        currentPage: page,
        pages,
        search,
        orgUnitId,
        orgUnits,
        summary: { totalCost, totalAccumulated, totalRemaining },
      });
    } catch (err) {
      console.error("Lỗi danh sách khấu hao:", err);
      res.status(500).send("Lỗi: " + err.message);
    }
  },

  // 2. Chi tiết khấu hao và lịch trình từng tháng
  async show(req, res) {
    try {
      const [rows] = await db.query(
        `SELECT a.*, ou.name AS org_unit_name, c.name AS category_name
         FROM assets a
         LEFT JOIN org_units ou ON a.org_unit_id = ou.id
         LEFT JOIN asset_categories c ON a.category_id = c.id
         WHERE a.id = ? AND a.deleted_at IS NULL`,
        [req.params.id]
      );

      if (!rows.length) return res.redirect("/depreciation");

      const asset = rows[0];
      const dep = calcDepreciation(asset);
      const schedule = generateDepreciationSchedule(asset);

      res.render("depreciation/show", {
        title: `Chi tiết khấu hao - ${asset.code}`,
        asset,
        dep,
        schedule,
      });
    } catch (err) {
      console.error("Lỗi xem chi tiết khấu hao:", err);
      res.redirect("/depreciation");
    }
  },
};

module.exports = depreciationController;
