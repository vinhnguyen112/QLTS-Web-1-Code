const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouseController");

router.get("/", warehouseController.index);
router.post("/", warehouseController.create);
router.post("/assign", warehouseController.assign);

module.exports = router;
