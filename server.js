require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { engine } = require("express-handlebars");
const path = require("path");
require("./src/config/db");

const app = express();

// Cấu hình Handlebars View Engine
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "src/views/layouts"),
    partialsDir: path.join(__dirname, "src/views/partials"),
    helpers: require("./src/utils/hbsHelpers"),
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src/public")));

// Cấu hình Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "qlts-devmaster-secret-2026",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
  })
);

// Nạp thông tin người dùng & quyền hạn vào View
app.use((req, res, next) => {
  const user = req.session.user || null;
  const role = user?.role_code || "";

  res.locals.currentUser = user;
  res.locals.errorMessage = req.query.error || null;
  res.locals.successMessage = req.query.msg || null;

  const isOperator = role === "SYS_ADMIN" || role === "ASSET_MANAGER";
  const isLeader = role === "SYS_ADMIN" || ["DIRECTOR", "CHIEF_ACCOUNTANT", "DEPT_HEAD", "ASSET_MANAGER"].includes(role);
  const isFinancial = role === "SYS_ADMIN" || ["DIRECTOR", "CHIEF_ACCOUNTANT", "ASSET_ACCOUNTANT", "ASSET_MANAGER"].includes(role);

  res.locals.canManage = isOperator;
  res.locals.canManageAssets = isOperator;
  res.locals.canApprove = isLeader;

  res.locals.can = {
    manageSystem: role === "SYS_ADMIN",
    manageMasterData: isOperator,
    manageAssets: isOperator,
    viewDepreciation: isFinancial,
    viewReports: isFinancial,
    manageStocktakes: isOperator || role === "DIRECTOR",
    resolveMaintenance: isOperator || role === "TECHNICIAN" || role === "DIRECTOR",
    approveRequests: isLeader,
    viewAudit: role === "SYS_ADMIN" || role === "DIRECTOR",
  };

  res.locals.currentPath = req.path;
  next();
});

// Định tuyến hệ thống
app.use("/", require("./src/routes/index"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server đang chạy tại http://localhost:" + PORT);
});
