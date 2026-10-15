const express = require("express");
const homeController = require("../controllers/homeController");
const categoryController = require("../controllers/categoryController");
const departmentController = require("../controllers/departmentController");
const employeeController = require("../controllers/employeeController");
const assetController = require("../controllers/assetController");
const procurementController = require("../controllers/procurementController");
const reportController = require("../controllers/reportController");

const router = express.Router();

// 1. Tổng quan (Dashboard)
router.get("/", homeController.index);

// 2. Danh mục tài sản
router.get("/categories", categoryController.index);
router.post("/categories", categoryController.create);
router.get("/categories/:id/edit", categoryController.edit);
router.get("/categories/:id", categoryController.show);
router.post("/categories/:id/update", categoryController.update);
router.post("/categories/:id/delete", categoryController.delete);

// 3. Phòng ban
router.get("/departments", departmentController.index);
router.post("/departments", departmentController.create);
router.get("/departments/:id/edit", departmentController.edit);
router.get("/departments/:id", departmentController.show);
router.post("/departments/:id/update", departmentController.update);
router.post("/departments/:id/delete", departmentController.delete);

// 4. Nhân sự
router.get("/employees", employeeController.index);
router.post("/employees", employeeController.create);
router.get("/employees/:id/edit", employeeController.edit);
router.get("/employees/:id", employeeController.show);
router.post("/employees/:id/update", employeeController.update);
router.post("/employees/:id/delete", employeeController.delete);

// 5. Danh sách tài sản
router.get("/assets", assetController.index);
router.post("/assets", assetController.create);
router.get("/assets/:id/edit", assetController.edit);
router.get("/assets/:id", assetController.show);
router.post("/assets/:id/update", assetController.update);
router.post("/assets/:id/delete", assetController.delete);

// 6. Mua sắm tài sản 
router.get("/procurement", procurementController.index);
router.post("/procurement", procurementController.create);
router.get("/procurement/:id/edit", procurementController.edit);
router.get("/procurement/:id", procurementController.show);
router.post("/procurement/:id/update", procurementController.update);
router.post("/procurement/:id/delete", procurementController.delete);

// 7. Báo cáo & Thống kê (Dữ liệu mẫu)
router.get("/reports", reportController.index);

module.exports = router;
