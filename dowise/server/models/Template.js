// server/models/Template.js
const mongoose = require("mongoose");

const TemplateTaskSchema = new mongoose.Schema({
  title: String,
  days: Number,
  resource: String
}, { _id: false });

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tasks: [TemplateTaskSchema]
}, { timestamps: true });

module.exports = mongoose.model("Template", TemplateSchema);
