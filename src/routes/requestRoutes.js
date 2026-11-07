const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");

router.get("/", requestController.index);
router.get("/create", requestController.createForm);
router.post("/create", requestController.create);
router.get("/:id", requestController.show);
router.post("/:id/approve", requestController.approve);
router.post("/:id/reject", requestController.reject);

module.exports = router;

