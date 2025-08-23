// server/routes/templateRoutes.js
const express = require("express");
const Template = require("../models/Template");
const { auth, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, isAdmin, async (_req, res) => {
  const list = await Template.find().sort({ name: 1 });
  res.json(list);
});

router.post("/", auth, isAdmin, async (req, res) => {
  const { name, tasks } = req.body;
  const t = await Template.create({ name, tasks: tasks || [] });
  res.status(201).json(t);
});

router.delete("/:id", auth, isAdmin, async (req, res) => {
  await Template.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
