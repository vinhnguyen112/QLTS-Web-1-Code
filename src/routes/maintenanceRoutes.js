const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");

router.get("/", maintenanceController.index);
router.get("/create", maintenanceController.createForm);
router.post("/create", maintenanceController.create);
router.post("/:id/complete", maintenanceController.complete);

module.exports = router;

