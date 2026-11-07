const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");

router.get("/", assetController.index);
router.post("/:id/recall", assetController.recall);
router.get("/:id/edit", assetController.edit);
router.get("/:id", assetController.show);
router.post("/:id/update", assetController.update);
router.post("/:id/delete", assetController.delete);

module.exports = router;

