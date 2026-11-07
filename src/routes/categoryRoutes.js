const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.index);
router.post("/", categoryController.create);
router.get("/:id/edit", categoryController.edit);
router.post("/:id/update", categoryController.update);
router.post("/:id/delete", categoryController.delete);

module.exports = router;
