const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router.get("/", locationController.index);
router.post("/", locationController.create);
router.post("/:id/delete", locationController.delete);

module.exports = router;

