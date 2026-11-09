const dayjs = require("dayjs");

// Các hàm bổ trợ (helpers) cho Handlebars View Engine
const helpers = {
  // So sánh logic
  eq: (a, b) => a === b,
  or: (a, b) => a || b,
  not: (a) => !a,
  gt: (a, b) => Number(a) > Number(b),
  addOne: (i) => Number(i) + 1,

  // Định dạng dữ liệu
  formatCurrency: (val) => Number(val || 0).toLocaleString("vi-VN") + " đ",
  formatDate: (d) => (d ? dayjs(d).format("DD/MM/YYYY") : ""),
  formatDateTime: (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : ""),
  json: (ctx) => JSON.stringify(ctx === undefined ? null : ctx),

  // Nhãn trạng thái tài sản
  assetStatusBadge: (status) => {
    const badges = {
      in_stock: '<span class="badge text-bg-light border">Trong kho</span>',
      in_use: '<span class="badge text-bg-light border">Đang sử dụng</span>',
      maintenance: '<span class="badge text-bg-warning text-dark">Bảo trì</span>',
      disposed: '<span class="badge text-bg-secondary">Đã thanh lý</span>',
      lost: '<span class="badge text-bg-danger">Đã mất</span>',
    };
    return badges[status] || `<span class="badge text-bg-light border">${status}</span>`;
  },

  // Nhãn trạng thái đề xuất
  requestStatusBadge: (status) => {
    const badges = {
      pending_approval: '<span class="badge text-bg-warning text-dark">Chờ duyệt</span>',
      pending: '<span class="badge text-bg-warning text-dark">Chờ duyệt</span>',
      approved: '<span class="badge text-bg-success">Đã duyệt</span>',
      rejected: '<span class="badge text-bg-danger">Từ chối</span>',
    };
    return badges[status] || `<span class="badge text-bg-light border">${status}</span>`;
  },

  // Nhãn loại đề xuất
  requestTypeBadge: (type) => {
    const badges = {
      purchase: '<span class="badge text-bg-light border">Mua sắm</span>',
      assign: '<span class="badge text-bg-light border">Cấp phát</span>',
    };
    return badges[type] || `<span class="badge text-bg-light border">${type}</span>`;
  },
};

module.exports = helpers;

