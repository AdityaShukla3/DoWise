// server/routes/aiRoutes.js
const express = require("express");
const Template = require("../models/Template");
const Plan = require("../models/Plan");
const { mapInputToCategories } = require("../utils/mapInput");
const { auth } = require("../middleware/auth");
const router = express.Router();

// Helper to extract JSON block or parse raw
function parseJSONSafe(text) {
  try {
    const jsonText = text.trim().match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] || text;
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

// Enhanced AI suggestion with context awareness
router.post("/suggest", async (req, res) => {
  try {
    const { input, maxTasks = 6, userId, context } = req.body;
    if (!input || !input.trim()) return res.status(400).json({ message: "input required" });

    const useOpenAI = String(process.env.USE_OPENAI || "false").toLowerCase() === "true";
    const key = process.env.OPENAI_API_KEY;

    if (useOpenAI && key) {
      // Enhanced prompt with context awareness
      let prompt = `Return a JSON array (no extra text) of up to ${maxTasks} optimized learning steps for the user intent.
Each object: {"title":"...", "days":<int>, "resource":"<url>", "difficulty":"beginner|intermediate|advanced", "priority":"high|medium|low"}

User intent: "${input}"`;

      // Add context if available
      if (context && context.previousPlans) {
        prompt += `\n\nUser's learning history: ${context.previousPlans.join(', ')}`;
      }
      if (context && context.preferredDuration) {
        prompt += `\n\nPreferred learning duration: ${context.preferredDuration} days`;
      }

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an expert learning path designer. Return only valid JSON arrays with learning tasks optimized for the user's goals and context." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 800
        })
      });

      const d = await resp.json();
      const raw = d?.choices?.[0]?.message?.content || "";
      const parsed = parseJSONSafe(raw);
      if (parsed && Array.isArray(parsed) && parsed.length) {
        const out = parsed.slice(0, maxTasks).map(t => ({
          title: String(t.title).slice(0,120),
          days: Number(t.days) || 2,
          resource: String(t.resource || "").slice(0,400),
          difficulty: t.difficulty || "intermediate",
          priority: t.priority || "medium"
        }));
        return res.json({ source: "openai", tasks: out, aiInsights: "AI-optimized learning path" });
      }
    }

    // Fallback: offline mapping -> templates in DB
    const cats = await mapInputToCategories(input);
    const templates = await Template.find({ name: { $in: cats } }).lean();
    const merged = [];
    for (const t of templates) {
      for (const task of (t.tasks || [])) {
        merged.push({ 
          title: task.title, 
          days: task.days || 2, 
          resource: task.resource || "",
          difficulty: "intermediate",
          priority: "medium"
        });
        if (merged.length >= maxTasks) break;
      }
      if (merged.length >= maxTasks) break;
    }
    return res.json({ source: "offline", tasks: merged, aiInsights: "Template-based suggestions" });
  } catch (err) {
    console.error("AI suggest error", err);
    res.status(500).json({ message: "AI suggestion failed" });
  }
});

// AI-powered plan optimization
router.post("/optimize", async (req, res) => {
  try {
    const { planId, userId } = req.body;
    if (!planId || !userId) return res.status(400).json({ message: "planId and userId required" });

    const plan = await Plan.findOne({ _id: planId, userId });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const useOpenAI = String(process.env.USE_OPENAI || "false").toLowerCase() === "true";
    const key = process.env.OPENAI_API_KEY;

    if (useOpenAI && key) {
      const prompt = `Analyze this learning plan and suggest optimizations:
Current plan: ${JSON.stringify(plan.tasks)}

Suggest improvements in JSON format:
{"optimizations": [{"type": "reorder|split|merge|add", "description": "...", "impact": "high|medium|low"}]}`;

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an expert learning path optimizer. Analyze plans and suggest improvements." },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 500
        })
      });

      const d = await resp.json();
      const raw = d?.choices?.[0]?.message?.content || "";
      const parsed = parseJSONSafe(raw);
      
      if (parsed && parsed.optimizations) {
        return res.json({ 
          source: "openai", 
          optimizations: parsed.optimizations,
          aiInsights: "AI-analyzed plan optimization"
        });
      }
    }

    // Fallback optimization logic
    const optimizations = [];
    if (plan.tasks.length > 8) {
      optimizations.push({
        type: "split",
        description: "Consider breaking down into smaller, focused plans",
        impact: "high"
      });
    }
    
    const highPriorityTasks = plan.tasks.filter(t => t.priority === "high");
    if (highPriorityTasks.length === 0) {
      optimizations.push({
        type: "add",
        description: "Add priority levels to focus on most important tasks",
        impact: "medium"
      });
    }

    return res.json({ 
      source: "offline", 
      optimizations,
      aiInsights: "Rule-based optimization"
    });
  } catch (err) {
    console.error("AI optimize error", err);
    res.status(500).json({ message: "AI optimization failed" });
  }
});

// AI-powered progress analysis and insights
router.post("/analyze", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const plans = await Plan.find({ userId }).populate('tasks');
    if (!plans.length) return res.status(404).json({ message: "No plans found" });

    const useOpenAI = String(process.env.USE_OPENAI || "false").toLowerCase() === "true";
    const key = process.env.OPENAI_API_KEY;

    if (useOpenAI && key) {
      const planSummary = plans.map(p => ({
        input: p.rawInput,
        completed: p.tasks.filter(t => t.done).length,
        total: p.tasks.length,
        createdAt: p.createdAt
      }));

      const prompt = `Analyze this learning progress data and provide insights:
${JSON.stringify(planSummary)}

Return insights in JSON format:
{"insights": [{"type": "strength|improvement|recommendation", "title": "...", "description": "...", "actionable": true|false}]}`;

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an expert learning coach. Analyze progress data and provide actionable insights." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 600
        })
      });

      const d = await resp.json();
      const raw = d?.choices?.[0]?.message?.content || "";
      const parsed = parseJSONSafe(raw);
      
      if (parsed && parsed.insights) {
        return res.json({ 
          source: "openai", 
          insights: parsed.insights,
          aiInsights: "AI-powered progress analysis"
        });
      }
    }

    // Fallback analysis
    const totalTasks = plans.reduce((sum, p) => sum + p.tasks.length, 0);
    const completedTasks = plans.reduce((sum, p) => sum + p.tasks.filter(t => t.done).length, 0);
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;

    const insights = [
      {
        type: "strength",
        title: "Learning Consistency",
        description: `You've completed ${completedTasks} out of ${totalTasks} tasks (${completionRate}% completion rate)`,
        actionable: false
      }
    ];

    if (completionRate < 70) {
      insights.push({
        type: "improvement",
        title: "Task Completion",
        description: "Consider breaking down larger tasks into smaller, more manageable steps",
        actionable: true
      });
    }

    return res.json({ 
      source: "offline", 
      insights,
      aiInsights: "Progress analysis completed"
    });
  } catch (err) {
    console.error("AI analyze error", err);
    res.status(500).json({ message: "AI analysis failed" });
  }
});

// AI-powered personalized recommendations
router.post("/recommend", async (req, res) => {
  try {
    const { userId, interests, skillLevel = "beginner" } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const useOpenAI = String(process.env.USE_OPENAI || "false").toLowerCase() === "true";
    const key = process.env.OPENAI_API_KEY;

    if (useOpenAI && key) {
      const prompt = `Based on these user preferences, suggest personalized learning paths:
Interests: ${interests || "general learning"}
Skill Level: ${skillLevel}
Focus: Return 3-5 learning path suggestions in JSON format:
{"recommendations": [{"title": "...", "description": "...", "estimatedDuration": "...", "difficulty": "beginner|intermediate|advanced", "resources": ["url1", "url2"]}]}`;

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an expert learning path designer. Provide personalized recommendations based on user interests and skill level." },
            { role: "user", content: prompt }
          ],
          temperature: 0.4,
          max_tokens: 700
        })
      });

      const d = await resp.json();
      const raw = d?.choices?.[0]?.message?.content || "";
      const parsed = parseJSONSafe(raw);
      
      if (parsed && parsed.recommendations) {
        return res.json({ 
          source: "openai", 
          recommendations: parsed.recommendations,
          aiInsights: "AI-personalized recommendations"
        });
      }
    }

    // Fallback recommendations based on templates
    const templates = await Template.find().limit(5).lean();
    const recommendations = templates.map(t => ({
      title: `Learn ${t.name}`,
      description: `Master ${t.name.toLowerCase()} fundamentals with structured learning path`,
      estimatedDuration: `${t.tasks.reduce((sum, task) => sum + task.days, 0)} days`,
      difficulty: "beginner",
      resources: t.tasks.map(task => task.resource).filter(Boolean)
    }));

    return res.json({ 
      source: "offline", 
      recommendations,
      aiInsights: "Template-based recommendations"
    });
  } catch (err) {
    console.error('AI recommend error', err);
    res.status(500).json({ message: "AI recommendations failed" });
  }
});

// AI-powered comprehensive topic suggestions
router.post("/suggest-topics", async (req, res) => {
  try {
    const { input, userId } = req.body;
    if (!input || !input.trim()) return res.status(400).json({ message: "input required" });

    const useOpenAI = String(process.env.USE_OPENAI || "false").toLowerCase() === "true";
    const key = process.env.OPENAI_API_KEY;

    if (useOpenAI && key) {
      const prompt = `Analyze this learning goal and provide comprehensive topic breakdown:
User wants to learn: "${input}"

Return a detailed learning path in JSON format:
{"suggestions": [{"title": "...", "description": "...", "topics": ["topic1", "topic2", ...], "difficulty": "beginner|intermediate|advanced", "estimatedDuration": "...", "priority": "high|medium|low"}]}

Focus on:
1. Core fundamentals and prerequisites
2. Main concepts and technologies
3. Practical applications and projects
4. Advanced topics and specializations
5. Real-world skills and best practices

Make it comprehensive and actionable.`;

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an expert learning path designer. Create comprehensive, structured learning paths with specific topics and realistic timelines." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      const d = await resp.json();
      const raw = d?.choices?.[0]?.message?.content || "";
      const parsed = parseJSONSafe(raw);
      
      if (parsed && parsed.suggestions) {
        return res.json({ 
          source: "openai", 
          suggestions: parsed.suggestions,
          aiInsights: "AI-generated comprehensive learning path"
        });
      }
    }

    // Fallback to intelligent topic mapping
    const suggestions = generateFallbackTopicSuggestions(input);
    return res.json({ 
      source: "offline", 
      suggestions,
      aiInsights: "Intelligent topic mapping"
    });
  } catch (err) {
    console.error('AI suggest-topics error', err);
    res.status(500).json({ message: "AI topic suggestions failed" });
  }
});

// Fallback topic suggestion generator
function generateFallbackTopicSuggestions(input) {
  const lowerInput = input.toLowerCase();
  const suggestions = [];

  // Backend Development
  if (lowerInput.includes('backend') || lowerInput.includes('server') || lowerInput.includes('api')) {
    suggestions.push({
      title: "Backend Development Mastery",
      description: "Complete backend development learning path from fundamentals to advanced concepts",
      topics: [
        "Programming Fundamentals (Variables, Loops, Functions)",
        "Object-Oriented Programming",
        "Data Structures & Algorithms",
        "Node.js Runtime & NPM",
        "Express.js Framework & Middleware",
        "Database Design & SQL/NoSQL",
        "RESTful API Development",
        "Authentication & Authorization",
        "Testing & Debugging",
        "Performance Optimization",
        "Security Best Practices",
        "Deployment & DevOps",
        "Microservices Architecture",
        "API Documentation & Versioning"
      ],
      difficulty: "Beginner to Advanced",
      estimatedDuration: "4-8 months",
      priority: "High"
    });
  }

  // Frontend Development
  if (lowerInput.includes('frontend') || lowerInput.includes('ui') || lowerInput.includes('web') || lowerInput.includes('react')) {
    suggestions.push({
      title: "Frontend Development Excellence",
      description: "Master modern frontend technologies and create stunning user experiences",
      topics: [
        "HTML5 Semantic Structure",
        "CSS3 Layouts & Flexbox/Grid",
        "JavaScript ES6+ Features",
        "DOM Manipulation & Events",
        "React.js Components & Hooks",
        "State Management (Redux/Context)",
        "Routing & Navigation",
        "Responsive Design & Mobile-First",
        "CSS-in-JS & Styled Components",
        "Performance Optimization",
        "Testing with Jest & React Testing Library",
        "Build Tools (Webpack, Vite)",
        "Progressive Web Apps (PWA)",
        "Accessibility & SEO"
      ],
      difficulty: "Beginner to Advanced",
      estimatedDuration: "5-9 months",
      priority: "High"
    });
  }

  // AI & Machine Learning
  if (lowerInput.includes('ai') || lowerInput.includes('machine') || lowerInput.includes('ml') || lowerInput.includes('deep')) {
    suggestions.push({
      title: "AI & Machine Learning Journey",
      description: "Comprehensive AI/ML learning path from basics to advanced applications",
      topics: [
        "Python Programming Fundamentals",
        "Mathematics & Statistics",
        "Linear Algebra & Calculus",
        "Data Analysis with Pandas & NumPy",
        "Data Visualization (Matplotlib, Seaborn)",
        "Machine Learning Algorithms",
        "Scikit-learn Framework",
        "Deep Learning with TensorFlow/PyTorch",
        "Neural Networks & CNN/RNN",
        "Natural Language Processing (NLP)",
        "Computer Vision & Image Processing",
        "Model Deployment & MLOps",
        "AI Ethics & Responsible AI",
        "Real-world AI Projects"
      ],
      difficulty: "Intermediate to Advanced",
      estimatedDuration: "8-15 months",
      priority: "High"
    });
  }

  // Data Science
  if (lowerInput.includes('data') || lowerInput.includes('analytics') || lowerInput.includes('science')) {
    suggestions.push({
      title: "Data Science & Analytics",
      description: "Master data analysis, visualization, and business intelligence",
      topics: [
        "Python for Data Science",
        "SQL & Database Management",
        "Data Cleaning & Preprocessing",
        "Exploratory Data Analysis (EDA)",
        "Statistical Analysis & Hypothesis Testing",
        "Data Visualization (Tableau, PowerBI)",
        "Machine Learning Basics",
        "Big Data Technologies (Hadoop, Spark)",
        "Business Intelligence & Reporting",
        "Data Storytelling & Communication",
        "Predictive Analytics",
        "Data Governance & Ethics"
      ],
      difficulty: "Beginner to Intermediate",
      estimatedDuration: "6-10 months",
      priority: "Medium"
    });
  }

  // Mobile Development
  if (lowerInput.includes('mobile') || lowerInput.includes('app') || lowerInput.includes('react native')) {
    suggestions.push({
      title: "Mobile App Development",
      description: "Cross-platform mobile development with React Native",
      topics: [
        "JavaScript & React Fundamentals",
        "React Native Components & APIs",
        "Navigation & Routing",
        "State Management (Redux/Context)",
        "Mobile UI/UX Design Principles",
        "Platform-Specific Code (iOS/Android)",
        "API Integration & Data Fetching",
        "Local Storage & Caching",
        "Push Notifications",
        "Testing & Debugging",
        "Performance Optimization",
        "App Store Deployment",
        "Continuous Integration"
      ],
      difficulty: "Intermediate",
      estimatedDuration: "4-7 months",
      priority: "Medium"
    });
  }

  // DevOps & Cloud
  if (lowerInput.includes('devops') || lowerInput.includes('deployment') || lowerInput.includes('cloud') || lowerInput.includes('aws')) {
    suggestions.push({
      title: "DevOps & Cloud Deployment",
      description: "Master modern deployment practices and cloud infrastructure",
      topics: [
        "Linux & Command Line",
        "Git Version Control",
        "Docker & Containerization",
        "CI/CD Pipelines (Jenkins, GitHub Actions)",
        "Cloud Platforms (AWS, Azure, GCP)",
        "Infrastructure as Code (Terraform)",
        "Configuration Management (Ansible)",
        "Monitoring & Logging",
        "Security & Compliance",
        "Kubernetes Orchestration",
        "Serverless Architecture",
        "Cost Optimization",
        "Disaster Recovery"
      ],
      difficulty: "Intermediate to Advanced",
      estimatedDuration: "5-10 months",
      priority: "Medium"
    });
  }

  // Full Stack Development
  if (lowerInput.includes('full') || lowerInput.includes('stack') || lowerInput.includes('web')) {
    suggestions.push({
      title: "Full Stack Web Development",
      description: "End-to-end web development from frontend to backend",
      topics: [
        "HTML, CSS & JavaScript",
        "Frontend Framework (React/Vue/Angular)",
        "Backend Development (Node.js/Python/Java)",
        "Database Design & Management",
        "API Development & Integration",
        "Authentication & Security",
        "Testing & Quality Assurance",
        "Performance Optimization",
        "Deployment & Hosting",
        "Monitoring & Maintenance",
        "Version Control & Collaboration",
        "Agile Development Practices"
      ],
      difficulty: "Beginner to Advanced",
      estimatedDuration: "6-12 months",
      priority: "High"
    });
  }

  // Generic learning suggestion if no specific matches
  if (suggestions.length === 0) {
    suggestions.push({
      title: `Master ${input.charAt(0).toUpperCase() + input.slice(1)}`,
      description: "Customized learning path tailored to your specific goal",
      topics: [
        "Fundamentals & Core Concepts",
        "Essential Skills & Techniques",
        "Practical Applications",
        "Advanced Methods & Strategies",
        "Real-world Projects & Case Studies",
        "Best Practices & Industry Standards",
        "Tools & Technologies",
        "Community & Networking",
        "Continuous Learning & Growth",
        "Certification & Validation"
      ],
      difficulty: "Beginner to Advanced",
      estimatedDuration: "3-8 months",
      priority: "Medium"
    });
  }

  return suggestions;
}

// Generate MCQ Quiz for Revision - owner only
router.get("/plans/:id/quiz", auth, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (String(plan.userId) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const useOpenAI = String(process.env.USE_OPENAI || "false").toLowerCase() === "true";
    const key = process.env.OPENAI_API_KEY;

    if (useOpenAI && key) {
      const topicList = plan.tasks.map(t => t.title).join(", ");
      const prompt = `Create a multiple-choice quiz with exactly 15 questions to evaluate a user's knowledge on the course "${plan.rawInput}".
The specific topics/tasks they covered are: ${topicList}.
Each question should test concepts related to these topics.

Generate the output ONLY as a JSON array of objects (do not include markdown syntax, code blocks, or extra text).
Each object in the array must have exactly the following structure:
{
  "question": "...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswerIndex": <0, 1, 2, or 3>,
  "topic": "..."
}

Ensure the questions range from beginner to intermediate difficulty.`;

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an expert technical evaluator. You create clear, accurate multiple-choice evaluation quizzes for student topics and return ONLY JSON arrays." },
            { role: "user", content: prompt }
          ],
          temperature: 0.5,
          max_tokens: 2500
        })
      });

      const d = await resp.json();
      const raw = d?.choices?.[0]?.message?.content || "";
      const parsed = parseJSONSafe(raw);
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ quiz: parsed });
      }
    }

    // Fallback static quiz if OpenAI fails or is not enabled
    const fallbackQuiz = plan.tasks.slice(0, 15).map((t, idx) => ({
      question: `Which of the following best describes the core concept of "${t.title}"?`,
      options: [
        `Implementing best practices for ${t.title}`,
        `Ignoring fundamental standards of ${t.title}`,
        `Replacing ${t.title} with unrelated tasks`,
        `None of the above`
      ],
      correctAnswerIndex: 0,
      topic: t.title
    }));
    res.json({ quiz: fallbackQuiz });
  } catch (err) {
    console.error("mcq quiz generation error", err);
    res.status(500).json({ message: "Failed to generate evaluation quiz" });
  }
});

// Evaluate MCQ Quiz Answers - owner only
router.post("/plans/:id/evaluate", auth, async (req, res) => {
  try {
    const { answers, quiz } = req.body;
    if (!answers || !quiz) return res.status(400).json({ message: "answers and quiz are required" });

    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (String(plan.userId) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    let score = 0;
    const details = quiz.map((q, idx) => {
      const userAns = answers[idx];
      const isCorrect = userAns === q.correctAnswerIndex;
      if (isCorrect) score++;
      return {
        question: q.question,
        topic: q.topic,
        correct: isCorrect,
        userAnswer: q.options[userAns] || "Unanswered",
        correctAnswer: q.options[q.correctAnswerIndex]
      };
    });

    const useOpenAI = String(process.env.USE_OPENAI || "false").toLowerCase() === "true";
    const key = process.env.OPENAI_API_KEY;

    let feedback = "";
    let improvementTopics = [];

    if (useOpenAI && key) {
      const incorrectList = details.filter(d => !d.correct).map(d => `${d.topic}: "${d.question}" (answered: ${d.userAnswer}, correct: ${d.correctAnswer})`).join("\n");
      const correctList = details.filter(d => d.correct).map(d => d.topic).join(", ");
      
      const prompt = `A student completed a quiz for the course "${plan.rawInput}".
Total Score: ${score} out of ${quiz.length}.
Topics they answered correctly: ${correctList || 'None'}.
Details of questions they answered incorrectly:
${incorrectList || 'None (Perfect Score!)'}

Please analyze their performance and return a JSON object with:
{
  "feedback": "A concise paragraph summarizing their performance and encouraging them.",
  "improvementTopics": ["Topic 1", "Topic 2"]
}
Limit improvementTopics to maximum 3 items, representing specific areas they should review.`;

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an expert tutor. Evaluate the quiz results and provide structured feedback and topic improvement suggestions in JSON." },
            { role: "user", content: prompt }
          ],
          temperature: 0.4,
          max_tokens: 800
        })
      });

      const d = await resp.json();
      const raw = d?.choices?.[0]?.message?.content || "";
      const parsed = parseJSONSafe(raw);
      if (parsed) {
        feedback = parsed.feedback || "";
        improvementTopics = parsed.improvementTopics || [];
      }
    }

    if (!feedback) {
      feedback = `You scored ${score}/${quiz.length}. ${score === quiz.length ? 'Perfect job!' : 'Good effort, review the incorrect topics to improve your score!'}`;
      improvementTopics = details.filter(d => !d.correct).map(d => d.topic).slice(0, 3);
    }

    res.json({
      score,
      total: quiz.length,
      feedback,
      improvementTopics,
      details
    });
  } catch (err) {
    console.error("quiz evaluation error", err);
    res.status(500).json({ message: "Failed to evaluate quiz" });
  }
});

module.exports = router;
