const express = require("express");
const router = express.Router();
const stocktakeController = require("../controllers/stocktakeController");

router.get("/", stocktakeController.index);
router.post("/create", stocktakeController.create);
router.get("/:id", stocktakeController.show);
router.get("/:id/scan", stocktakeController.scanPage);
router.post("/:id/record-scan", stocktakeController.recordScan);
router.post("/:id/close", stocktakeController.close);

module.exports = router;

