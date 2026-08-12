// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const planRoutes = require("./routes/planRoutes");
const templateRoutes = require("./routes/templateRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const Template = require("./models/Template");

// Load environment variables from .env next to this file, regardless of CWD
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("DoWise API running"));

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/resources", resourceRoutes);

// Seed templates if none exist (helpful fallback)
async function seedTemplates() {
  const count = await Template.countDocuments();
  if (count) return;
  await Template.insertMany([
    {
      name: "Frontend",
      tasks: [
        { title: "HTML Basics", days: 2, resource: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
        { title: "CSS Fundamentals", days: 3, resource: "https://web.dev/learn/css/" },
        { title: "JavaScript Core", days: 7, resource: "https://javascript.info/" }
      ]
    },
    {
      name: "Backend",
      tasks: [
        { title: "Node.js Basics", days: 4, resource: "https://nodejs.org/en/docs" },
        { title: "Express API", days: 3, resource: "https://expressjs.com/" }
      ]
    },
    {
      name: "DSA",
      tasks: [
        { title: "Arrays and Strings", days: 3, resource: "https://leetcode.com/problemset/all/" },
        { title: "Linked Lists", days: 2, resource: "https://www.geeksforgeeks.org/data-structures/" },
        { title: "Trees and Graphs", days: 4, resource: "https://visualgo.net/en" }
      ]
    },
    {
      name: "AI",
      tasks: [
        { title: "Python Basics", days: 3, resource: "https://www.python.org/doc/" },
        { title: "Machine Learning Fundamentals", days: 5, resource: "https://scikit-learn.org/stable/" },
        { title: "Data Analysis with Pandas", days: 4, resource: "https://pandas.pydata.org/docs/" }
      ]
    },
    {
      name: "DevOps",
      tasks: [
        { title: "Linux Basics", days: 3, resource: "https://linuxjourney.com/" },
        { title: "Docker Fundamentals", days: 4, resource: "https://docs.docker.com/get-started/" },
        { title: "CI/CD Pipeline", days: 3, resource: "https://jenkins.io/doc/" }
      ]
    },
    {
      name: "Mobile",
      tasks: [
        { title: "React Native Basics", days: 4, resource: "https://reactnative.dev/docs/getting-started" },
        { title: "Mobile UI Design", days: 3, resource: "https://material.io/design" },
        { title: "App Store Guidelines", days: 2, resource: "https://developer.apple.com/app-store/review/guidelines/" }
      ]
    },
    {
      name: "Business",
      tasks: [
        { title: "Business Model Canvas", days: 2, resource: "https://strategyzer.com/canvas/business-model-canvas" },
        { title: "Market Research", days: 3, resource: "https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis" },
        { title: "Financial Planning", days: 4, resource: "https://www.investopedia.com/financial-planning-4689811" }
      ]
    },
    {
      name: "Language",
      tasks: [
        { title: "Basic Vocabulary", days: 5, resource: "https://www.duolingo.com/" },
        { title: "Grammar Fundamentals", days: 4, resource: "https://www.grammarly.com/blog/" },
        { title: "Conversation Practice", days: 3, resource: "https://www.italki.com/" }
      ]
    },
    {
      name: "Music",
      tasks: [
        { title: "Music Theory Basics", days: 4, resource: "https://www.musictheory.net/" },
        { title: "Instrument Practice", days: 7, resource: "https://www.youtube.com/results?search_query=music+lessons" },
        { title: "Ear Training", days: 3, resource: "https://www.teoria.com/" }
      ]
    },
    {
      name: "Fitness",
      tasks: [
        { title: "Workout Planning", days: 2, resource: "https://www.bodybuilding.com/workout-plans" },
        { title: "Nutrition Basics", days: 3, resource: "https://www.nutrition.gov/" },
        { title: "Consistent Exercise", days: 7, resource: "https://www.fitness.gov/" }
      ]
    },
    {
      name: "Cooking",
      tasks: [
        { title: "Knife Skills", days: 3, resource: "https://www.youtube.com/results?search_query=knife+skills+cooking" },
        { title: "Basic Recipes", days: 4, resource: "https://www.allrecipes.com/" },
        { title: "Meal Planning", days: 2, resource: "https://www.mealime.com/" }
      ]
    },
    {
      name: "Photography",
      tasks: [
        { title: "Camera Basics", days: 3, resource: "https://digital-photography-school.com/" },
        { title: "Composition Rules", days: 2, resource: "https://expertphotography.com/composition-rules/" },
        { title: "Photo Editing", days: 4, resource: "https://helpx.adobe.com/lightroom/tutorials.html" }
      ]
    },
    {
      name: "Writing",
      tasks: [
        { title: "Creative Writing Basics", days: 3, resource: "https://www.masterclass.com/classes/james-patterson-teaches-writing" },
        { title: "Story Structure", days: 4, resource: "https://www.writersdigest.com/" },
        { title: "Daily Writing Habit", days: 7, resource: "https://750words.com/" }
      ]
    },
    {
      name: "Science",
      tasks: [
        { title: "Scientific Method", days: 2, resource: "https://www.sciencebuddies.org/science-fair-projects/science-fair/steps-of-the-scientific-method" },
        { title: "Research Skills", days: 4, resource: "https://www.nature.com/subjects/research" },
        { title: "Data Analysis", days: 3, resource: "https://www.khanacademy.org/math/statistics-probability" }
      ]
    }
  ]);
  console.log("🌱 seeded templates");
}

const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await seedTemplates();
  app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
});
