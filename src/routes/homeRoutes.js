const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

// Tổng quan (Dashboard)
router.get("/", homeController.index);

module.exports = router;

