// server/models/Plan.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  days: { type: Number, required: true },
  resource: { type: String, default: "" },
  deadline: { type: Date, required: true },
  done: { type: Boolean, default: false }
}, { _id: false });

const PlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goal: { type: String, required: true },
  rawInput: { type: String, required: true },
  tasks: [TaskSchema]
}, { timestamps: true });

module.exports = mongoose.model("Plan", PlanSchema);
