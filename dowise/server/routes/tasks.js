const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const { Configuration, OpenAIApi } = require("openai");

const router = express.Router();

// Middleware to check token
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// AI client
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

// AI-based task generator
router.post("/generate", authMiddleware, async (req, res) => {
  const { goal } = req.body;
  try {
    const aiRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a roadmap generator. Output JSON tasks with {title, days, resource}" },
        { role: "user", content: `Generate a roadmap for ${goal}` }
      ]
    });

    const tasks = JSON.parse(aiRes.choices[0].message.content);
    const savedTasks = await Task.insertMany(tasks.map(t => ({
      userId: req.user.id,
      title: t.title,
      status: "pending",
      deadline: new Date(Date.now() + t.days * 24*60*60*1000).toDateString(),
      resource: t.resource
    })));

    res.json(savedTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user tasks
router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Update task status
router.put("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(task);
});

module.exports = router;
