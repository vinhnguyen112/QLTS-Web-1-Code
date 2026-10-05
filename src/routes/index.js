const express = require("express");
const categoryController = require("../controllers/categoryController");
const departmentController = require("../controllers/departmentController");
const employeeController = require("../controllers/employeeController");
const assetController = require("../controllers/assetController");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home/index", {
    title: "Dashboard",
  });
});

router.get("/assets", assetController.index);
router.post("/assets", assetController.create);
router.get("/assets/:id/edit", assetController.edit);
router.get("/assets/:id", assetController.show);
router.post("/assets/:id/update", assetController.update);
router.post("/assets/:id/delete", assetController.delete);

router.get("/categories", categoryController.index);
router.post("/categories", categoryController.create);
router.get("/categories/:id/edit", categoryController.edit);
router.get("/categories/:id", categoryController.show);
router.post("/categories/:id/update", categoryController.update);
router.post("/categories/:id/delete", categoryController.delete);

router.get("/departments", departmentController.index);
router.post("/departments", departmentController.create);
router.get("/departments/:id/edit", departmentController.edit);
router.get("/departments/:id", departmentController.show);
router.post("/departments/:id/update", departmentController.update);
router.post("/departments/:id/delete", departmentController.delete);

router.get("/employees", employeeController.index);
router.post("/employees", employeeController.create);
router.get("/employees/:id/edit", employeeController.edit);
router.get("/employees/:id", employeeController.show);
router.post("/employees/:id/update", employeeController.update);
router.post("/employees/:id/delete", employeeController.delete);

module.exports = router;
