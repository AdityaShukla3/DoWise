// server/controllers/planController.js
const Plan = require("../models/Plan");
const Template = require("../models/Template");
const { mapInputToCategories } = require("../utils/mapInput");

exports.createPlan = async (req, res) => {
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
          title: String(t.title).slice(0, 160),
          days: Number(t.days) || 1,
          resource: String(t.resource || "").slice(0, 1000),
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
      goal: input,
      rawInput: input,
      tasks: mergedTasks
    });

    res.status(201).json(plan);
  } catch (err) {
    console.error("Create plan error", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    console.error("Get plans error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (String(plan.userId) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    res.json(plan);
  } catch (err) {
    console.error("Get plan error", err);
    res.status(500).json({ message: "Server error" });
  }
};

const User = require("../models/User");
const nodemailer = require("nodemailer");

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.completePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (String(plan.userId) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    plan.completed = true;
    await plan.save();

    // Fetch user to get email
    const user = await User.findById(req.user._id);
    if (user && user.email) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `Congratulations on completing ${plan.rawInput}!`,
          html: `
            <h2>Congratulations ${user.name}!</h2>
            <p>You have successfully completed your learning plan for <strong>${plan.rawInput}</strong>.</p>
            <p>We are thrilled to see your progress. Keep up the great work and continue learning!</p>
            <br/>
            <p>Best regards,</p>
            <p>The DoWise Team</p>
          `
        });
      } catch (emailErr) {
        console.error("Failed to send completion email:", emailErr);
      }
    }

    res.json(plan);
  } catch (err) {
    console.error("Complete plan error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleTask = async (req, res) => {
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
    console.error("Toggle task error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (String(plan.userId) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const i = Number(req.params.index);
    if (Number.isNaN(i) || i < 0 || i >= plan.tasks.length) return res.status(400).json({ message: "Invalid index" });

    plan.tasks.splice(i, 1);
    await plan.save();
    res.json(plan);
  } catch (err) {
    console.error("Delete task error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (String(plan.userId) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted successfully" });
  } catch (err) {
    console.error("Delete plan error", err);
    res.status(500).json({ message: "Server error" });
  }
};
