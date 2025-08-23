// server/routes/planRoutes.js
const express = require("express");
const Plan = require("../models/Plan");
const Template = require("../models/Template");
const { mapInputToCategories } = require("../utils/mapInput");
const { auth, isAdmin } = require("../middleware/auth");
const router = express.Router();

// Create plan (auth required). Accepts either tasks (client-provided) OR input to be mapped.
router.post("/", auth, async (req, res) => {
  try {
    const { input, startDate, tasks: clientTasks } = req.body;
    if (!input) return res.status(400).json({ message: "input required" });

    const start = startDate ? new Date(startDate) : new Date();
    let mergedTasks = [];

    if (Array.isArray(clientTasks) && clientTasks.length) {
      // Use client-provided tasks (Option A) - compute sequential deadlines
      let dayCounter = 0;
      clientTasks.forEach(t => {
        dayCounter += Number(t.days) || 1;
        const deadline = new Date(start);
        deadline.setDate(start.getDate() + dayCounter);
        mergedTasks.push({
          title: String(t.title).slice(0,160),
          days: Number(t.days) || 1,
          resource: String(t.resource || "").slice(0,1000),
          deadline,
          done: false,
          difficulty: t.difficulty || "intermediate",
          priority: t.priority || "medium"
        });
      });
    } else {
      // Fallback: map input to templates and build tasks from DB templates
      const categories = await mapInputToCategories(input);
      const templates = await Template.find({ name: { $in: categories } }).lean();
      let dayCounter = 0;
      templates.forEach(tp => {
        (tp.tasks || []).forEach(t => {
          dayCounter += Number(t.days) || 1;
          const deadline = new Date(start);
          deadline.setDate(start.getDate() + dayCounter);
          mergedTasks.push({
            title: t.title,
            days: t.days,
            resource: t.resource,
            deadline,
            done: false
          });
        });
      });
    }

    const plan = await Plan.create({
      userId: req.user._id,
      goal: input, // keep raw input as goal for clarity
      rawInput: input,
      tasks: mergedTasks
    });

    res.status(201).json(plan);
  } catch (err) {
    console.error("Create plan error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's plans
router.get("/", auth, async (req, res) => {
  const plans = await Plan.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(plans);
});

// Toggle task (index) - owner only
router.patch("/:id/tasks/:index/toggle", auth, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (String(plan.userId) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const i = Number(req.params.index);
    if (Number.isNaN(i) || i < 0 || i >= plan.tasks.length) return res.status(400).json({ message: "Invalid index" });

    plan.tasks[i].done = !plan.tasks[i].done;
    await plan.save();
    res.json(plan);
  } catch (err) {
    console.error("toggle", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete individual task (index) - owner only
router.delete("/:id/tasks/:index", auth, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (String(plan.userId) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const i = Number(req.params.index);
    if (Number.isNaN(i) || i < 0 || i >= plan.tasks.length) return res.status(400).json({ message: "Invalid index" });

    // Remove the task at the specified index
    plan.tasks.splice(i, 1);
    await plan.save();
    
    res.json(plan);
  } catch (err) {
    console.error("delete task", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete entire plan - owner only
router.delete("/:id", auth, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (String(plan.userId) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted successfully" });
  } catch (err) {
    console.error("delete plan", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
