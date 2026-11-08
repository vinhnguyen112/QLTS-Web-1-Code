const dayjs = require("dayjs");

/**
 * Tính toán khấu hao đường thẳng (Straight-Line Depreciation) cho 1 tài sản
 * Tuân thủ VAS & Thông tư 45/2013/TT-BTC
 */
function calcDepreciation(asset, now = dayjs()) {
  const cost = Number(asset.original_cost) || 0;
  const residual = Number(asset.residual_value) || 0;
  const months = Number(asset.useful_life_months) || 0;
  const depreciableAmount = Math.max(0, cost - residual);

  if (months <= 0 || cost <= 0) {
    return {
      monthly: 0,
      usedMonths: 0,
      remainingMonths: 0,
      accumulated: 0,
      remainingValue: cost,
      percent: 0,
      isDone: false,
      hasDepreciation: false,
    };
  }

  const monthly = Math.round(depreciableAmount / months);
  const startDate = asset.depreciation_start || asset.purchase_date || now;
  const elapsedMonths = Math.max(0, now.diff(dayjs(startDate), "month"));
  const usedMonths = Math.min(months, elapsedMonths);
  const remainingMonths = Math.max(0, months - usedMonths);

  const accumulated = Math.min(cost, Math.round((Number(asset.opening_accumulated) || 0) + monthly * usedMonths));
  const remainingValue = Math.max(0, cost - accumulated);
  const percent = cost > 0 ? Math.min(100, Math.round((accumulated / cost) * 100)) : 100;
  const isDone = remainingMonths === 0 || remainingValue <= 0;

  return {
    monthly,
    usedMonths,
    remainingMonths,
    accumulated,
    remainingValue,
    percent,
    isDone,
    hasDepreciation: true,
  };
}

module.exports = { calcDepreciation };

