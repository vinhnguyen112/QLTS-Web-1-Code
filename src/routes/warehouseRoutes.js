const express = require("express");
const router = express.Router();

// Trang Kho cũ được hợp nhất hoàn toàn vào Hồ sơ tài sản với bộ lọc "Trong kho"
router.get("/", (req, res) => {
  res.redirect("/assets?status=in_stock");
});

// Chuyển hướng các thao tác cũ sang route chuẩn của assets
router.post("/", (req, res) => {
  res.redirect(307, "/assets/create");
});

router.post("/assign", (req, res) => {
  const assetId = req.body.asset_id;
  if (assetId) {
    res.redirect(307, `/assets/${assetId}/assign`);
  } else {
    res.redirect("/assets?status=in_stock");
  }
});

module.exports = router;
