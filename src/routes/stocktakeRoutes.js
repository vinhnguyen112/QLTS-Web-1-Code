const express = require("express");
const router = express.Router();
const stocktakeController = require("../controllers/stocktakeController");
const { hasPermission } = require("../middlewares/authMiddleware");

// Xem danh sách và thực hiện kiểm kê tài sản qua mã QR
router.get("/", hasPermission("MANAGE_STOCKTAKES"), stocktakeController.index);
router.get("/:id", hasPermission("MANAGE_STOCKTAKES"), stocktakeController.show);
router.get("/:id/scan", hasPermission("MANAGE_STOCKTAKES"), stocktakeController.scanPage);

// Tạo đợt kiểm kê, ghi nhận quét và chốt kiểm kê
router.post("/create", hasPermission("MANAGE_STOCKTAKES"), stocktakeController.create);
router.post("/:id/record-scan", hasPermission("MANAGE_STOCKTAKES"), stocktakeController.recordScan);
router.post("/:id/close", hasPermission("MANAGE_STOCKTAKES"), stocktakeController.close);

module.exports = router;
