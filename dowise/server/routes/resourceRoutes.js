// server/routes/resourceRoutes.js
const express = require("express");
const resourceController = require("../controllers/resourceController");
const router = express.Router();

router.post("/search", resourceController.search);
router.get("/technologies", resourceController.getTechnologies);
router.get("/verify", resourceController.verifyLinks);

module.exports = router;
