// server/routes/planRoutes.js
const express = require("express");
const planController = require("../controllers/planController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, planController.createPlan);
router.get("/", auth, planController.getPlans);
router.get("/:id", auth, planController.getPlanById);
router.patch("/:id/complete", auth, planController.completePlan);
router.patch("/:id/tasks/:index/toggle", auth, planController.toggleTask);
router.delete("/:id/tasks/:index", auth, planController.deleteTask);
router.delete("/:id", auth, planController.deletePlan);

module.exports = router;
