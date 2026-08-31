// server/routes/templateRoutes.js
const express = require("express");
const templateController = require("../controllers/templateController");
const { auth, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, isAdmin, templateController.getTemplates);
router.post("/", auth, isAdmin, templateController.createTemplate);
router.delete("/:id", auth, isAdmin, templateController.deleteTemplate);

module.exports = router;
