require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { engine } = require("express-handlebars");
const path = require("path");
const dayjs = require("dayjs");
const db = require("./src/config/db");
const { checkPermission } = require("./src/config/permissions");

const app = express();

// Cấu hình Handlebars View Engine
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "src/views/layouts"),

    partialsDir: [
      path.join(__dirname, "src/views/partials"),
      path.join(__dirname, "src/views/assets"),
      path.join(__dirname, "src/views/categories"),
      path.join(__dirname, "src/views/departments"),
      path.join(__dirname, "src/views/employees"),
      path.join(__dirname, "src/views/requests"),
      path.join(__dirname, "src/views/stocktakes"),
      path.join(__dirname, "src/views/maintenance"),
      path.join(__dirname, "src/views/locations"),
      path.join(__dirname, "src/views/depreciation"),
    ],

    helpers: {
      eq: (a, b) => a === b,
      or: (a, b) => a || b,
      not: (a) => !a,
      gt: (a, b) => Number(a) > Number(b),
      lt: (a, b) => Number(a) < Number(b),
      gte: (a, b) => Number(a) >= Number(b),
      lte: (a, b) => Number(a) <= Number(b),
      addOne: (index) => Number(index) + 1,
      formatCurrency: (value) => {
        return Number(value || 0).toLocaleString("vi-VN") + " đ";
      },
      formatDate: (date) => {
        return date ? dayjs(date).format("DD/MM/YYYY") : "";
      },
      formatDateTime: (date) => {
        return date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
      },
      assetStatusBadge: (status) => {
        const map = {
          in_stock: '<span class="badge text-bg-light border">Trong kho</span>',
          in_use: '<span class="badge text-bg-light border">Đang sử dụng</span>',
          maintenance: '<span class="badge text-bg-warning text-dark">Bảo trì</span>',
          transferring: '<span class="badge text-bg-light border">Điều chuyển</span>',
          disposing: '<span class="badge text-bg-light border">Chờ thanh lý</span>',
          disposed: '<span class="badge text-bg-secondary">Đã thanh lý</span>',
          lost: '<span class="badge text-bg-danger">Đã mất</span>',
        };
        return map[status] || `<span class="badge text-bg-light border">${status}</span>`;
      },
      requestStatusBadge: (status) => {
        const map = {
          draft: '<span class="badge text-bg-light border">Bản nháp</span>',
          pending_approval: '<span class="badge text-bg-warning text-dark">Chờ duyệt</span>',
          pending: '<span class="badge text-bg-warning text-dark">Chờ duyệt</span>',
          approved: '<span class="badge text-bg-success">Đã duyệt</span>',
          rejected: '<span class="badge text-bg-danger">Từ chối</span>',
          in_progress: '<span class="badge text-bg-light border">Đang xử lý</span>',
          completed: '<span class="badge text-bg-light border">Hoàn thành</span>',
          cancelled: '<span class="badge text-bg-secondary">Đã hủy</span>',
        };
        return map[status] || `<span class="badge text-bg-light border">${status}</span>`;
      },
      requestTypeBadge: (type) => {
        const map = {
          purchase: '<span class="badge text-bg-light border">Mua sắm</span>',
          assign: '<span class="badge text-bg-light border">Cấp phát</span>',
          transfer: '<span class="badge text-bg-light border">Điều chuyển</span>',
          recall: '<span class="badge text-bg-light border">Thu hồi</span>',
          disposal: '<span class="badge text-bg-light border">Thanh lý</span>',
          maintenance: '<span class="badge text-bg-light border">Sửa chữa</span>',
        };
        return map[type] || `<span class="badge text-bg-light border">${type}</span>`;
      },
      json: (context) => JSON.stringify(context),
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src/public")));
app.use(express.static(path.join(__dirname, "public")));

// Cấu hình Express Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "qlts-devmaster-secret-2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 8 * 60 * 60 * 1000,
    },
  })
);

// Nạp thông tin người dùng & quyền hạn rõ ràng vào mọi View
app.use((req, res, next) => {
  const user = req.session.user || null;
  const role = user?.role_code || "";

  res.locals.currentUser = user;
  res.locals.errorMessage = req.query.error || null;
  res.locals.successMessage = req.query.msg || null;

  // Cờ quyền kiểm tra nhanh trong View: {{#if can.manageAssets}} ... {{/if}}
  res.locals.can = {
    manageSystem: checkPermission(role, "MANAGE_SYSTEM"),
    manageMasterData: checkPermission(role, "MANAGE_MASTER_DATA"),
    manageAssets: checkPermission(role, "MANAGE_ASSETS"),
    viewDepreciation: checkPermission(role, "VIEW_DEPRECIATION"),
    viewReports: checkPermission(role, "VIEW_REPORTS"),
    manageStocktakes: checkPermission(role, "MANAGE_STOCKTAKES"),
    resolveMaintenance: checkPermission(role, "RESOLVE_MAINTENANCE"),
    approveRequests: checkPermission(role, "APPROVE_REQUESTS"),
    viewAudit: checkPermission(role, "VIEW_AUDIT"),
  };

  // Giữ lại các biến tương thích ngược
  res.locals.isSysAdmin = role === "SYS_ADMIN";
  res.locals.isAssetManager = role === "ASSET_MANAGER";
  res.locals.isTechnician = role === "TECHNICIAN";
  res.locals.isDirector = role === "DIRECTOR";
  res.locals.isAccountant = ["CHIEF_ACCOUNTANT", "ASSET_ACCOUNTANT"].includes(role);
  res.locals.canManageAssets = res.locals.can.manageAssets;
  res.locals.canManageMasterData = res.locals.can.manageMasterData;
  res.locals.canMaintain = res.locals.can.resolveMaintenance;
  res.locals.canApproveRequests = res.locals.can.approveRequests;

  res.locals.currentPath = req.path;
  next();
});

// Định tuyến hệ thống
const indexRouter = require("./src/routes/index");
app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server đang chạy tại http://localhost:" + PORT);
});
