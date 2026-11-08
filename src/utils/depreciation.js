const dayjs = require("dayjs");

/**
 * Tính toán khấu hao đường thẳng (Straight-line Depreciation)
 * Tuân thủ Thông tư 45/2013/TT-BTC
 */
function calculateStraightLineDepreciation(asset) {
  const originalCost = Number(asset.original_cost) || 0;
  const usefulLifeMonths = Number(asset.useful_life_months) || 36;
  const purchaseDate = asset.purchase_date ? dayjs(asset.purchase_date) : dayjs();
  const now = dayjs();

  // Số tháng trôi qua kể từ ngày đưa vào sử dụng
  let monthsUsed = now.diff(purchaseDate, "month");
  if (monthsUsed < 0) monthsUsed = 0;

  // Mức khấu hao mỗi tháng
  const monthlyDepreciation = usefulLifeMonths > 0 ? Math.round(originalCost / usefulLifeMonths) : 0;

  // Khấu hao lũy kế
  let accumulatedDepreciation = monthlyDepreciation * monthsUsed;
  if (accumulatedDepreciation > originalCost) {
    accumulatedDepreciation = originalCost;
  }

  // Giá trị còn lại
  const remainingValue = Math.max(0, originalCost - accumulatedDepreciation);

  // Tỷ lệ khấu hao (%)
  const depreciationPercent = originalCost > 0
    ? Math.min(100, Math.round((accumulatedDepreciation / originalCost) * 100))
    : 100;

  return {
    originalCost,
    usefulLifeMonths,
    monthsUsed: Math.min(monthsUsed, usefulLifeMonths),
    monthsRemaining: Math.max(0, usefulLifeMonths - monthsUsed),
    monthlyDepreciation,
    accumulatedDepreciation,
    remainingValue,
    depreciationPercent,
  };
}

module.exports = {
  calculateStraightLineDepreciation,
};
