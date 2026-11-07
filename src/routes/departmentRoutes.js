const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");

router.get("/", departmentController.index);
router.post("/", departmentController.create);
router.get("/:id/edit", departmentController.edit);
router.post("/:id/update", departmentController.update);
router.post("/:id/delete", departmentController.delete);

module.exports = router;
