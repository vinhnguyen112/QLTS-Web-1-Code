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

/**
 * Tạo bảng kế hoạch phân bổ khấu hao chi tiết theo từng tháng
 */
function generateDepreciationSchedule(asset, now = dayjs()) {
  const cost = Number(asset.original_cost) || 0;
  const residual = Number(asset.residual_value) || 0;
  const months = Number(asset.useful_life_months) || 0;
  const depreciableAmount = Math.max(0, cost - residual);

  if (months <= 0 || cost <= 0) {
    return [];
  }

  const baseMonthly = Math.floor(depreciableAmount / months);
  const startDate = dayjs(asset.depreciation_start || asset.purchase_date || now);

  const schedule = [];
  let currentAccumulated = 0;

  for (let i = 1; i <= months; i++) {
    const periodDate = startDate.add(i - 1, "month");
    // Tháng cuối cùng làm tròn để bù phần dư cho chính xác tuyệt đối với depreciableAmount
    const amount = (i === months) ? (depreciableAmount - baseMonthly * (months - 1)) : baseMonthly;
    currentAccumulated += amount;
    const remaining = Math.max(residual, cost - currentAccumulated);

    const isPast = periodDate.isBefore(now, "month");
    const isCurrent = periodDate.isSame(now, "month");

    let status = "upcoming";
    let statusLabel = "Dự kiến";
    if (isPast) {
      status = "completed";
      statusLabel = "Đã trích";
    } else if (isCurrent) {
      status = "current";
      statusLabel = "Kỳ hiện tại";
    }

    schedule.push({
      index: i,
      period: periodDate.format("MM/YYYY"),
      date: periodDate.format("YYYY-MM-DD"),
      amount,
      accumulated: currentAccumulated,
      remaining,
      isPast,
      isCurrent,
      status,
      statusLabel,
    });
  }

  return schedule;
}

module.exports = { calcDepreciation, generateDepreciationSchedule };
