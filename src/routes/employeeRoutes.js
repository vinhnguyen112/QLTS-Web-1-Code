const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.get("/", employeeController.index);
router.post("/", employeeController.create);
router.get("/:id/edit", employeeController.edit);
router.post("/:id/update", employeeController.update);

module.exports = router;
