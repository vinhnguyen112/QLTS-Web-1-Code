const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

router.get("/", supplierController.index);
router.post("/", supplierController.create);
router.get("/:id/edit", supplierController.edit);
router.post("/:id/update", supplierController.update);
router.post("/:id/delete", supplierController.delete);

module.exports = router;

