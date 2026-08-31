// server/controllers/templateController.js
const Template = require("../models/Template");

exports.getTemplates = async (req, res) => {
  try {
    const list = await Template.find().sort({ name: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const { name, tasks } = req.body;
    const t = await Template.create({ name, tasks: tasks || [] });
    res.status(201).json(t);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
