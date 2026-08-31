// server/routes/aiRoutes.js
const express = require("express");
const aiController = require("../controllers/aiController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/suggest", auth, aiController.suggest);
router.post("/optimize", auth, aiController.optimize);
router.post("/analyze", auth, aiController.analyze);
router.post("/recommend", auth, aiController.recommend);
router.post("/suggest-topics", auth, aiController.suggestTopics);
router.get("/similar", auth, aiController.getSimilarTechnologies);
router.get("/plans/:id/quiz", auth, aiController.getQuiz);
router.post("/plans/:id/evaluate", auth, aiController.evaluateQuiz);
router.get("/quick-quiz", auth, aiController.quickQuiz);
router.post("/quick-quiz/evaluate", auth, aiController.quickQuizEvaluate);

module.exports = router;
