const express = require("express");
const router = express.Router();

// Chuyển hướng thông minh: Kho tài sản chính là danh sách tài sản có trạng thái "Trong kho"
router.get("/", (req, res) => {
  res.redirect("/assets?status=in_stock");
});

module.exports = router;
