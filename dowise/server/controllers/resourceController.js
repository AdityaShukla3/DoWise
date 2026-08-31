// server/controllers/resourceController.js

// Technology resource database (can be expanded or moved to DB)
const technologyResources = {
  // Frontend Technologies
  react: {
    name: "React",
    resources: [
      { title: "React Official Documentation", url: "https://react.dev", type: "documentation", time: "2-3 weeks" },
      { title: "React Tutorial - freeCodeCamp", url: "https://www.freecodecamp.org/news/react-tutorial/", type: "tutorial", time: "1-2 weeks" },
      { title: "React - The Complete Guide (Udemy)", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", type: "course", time: "4-6 weeks" },
      { title: "React Patterns", url: "https://reactpatterns.com/", type: "reference", time: "1 week" }
    ],
    totalTime: "2-3 months",
    difficulty: "Intermediate",
    prerequisites: ["JavaScript", "HTML", "CSS"]
  },
  vue: {
    name: "Vue.js",
    resources: [
      { title: "Vue.js Official Guide", url: "https://vuejs.org/guide/", type: "documentation", time: "2-3 weeks" },
      { title: "Vue Mastery", url: "https://www.vuemastery.com/", type: "course", time: "3-4 weeks" },
      { title: "Vue.js Crash Course", url: "https://www.youtube.com/watch?v=qZXt1Aom3Cs", type: "video", time: "1 week" }
    ],
    totalTime: "2-3 months",
    difficulty: "Beginner to Intermediate",
    prerequisites: ["JavaScript", "HTML", "CSS"]
  },
  angular: {
    name: "Angular",
    resources: [
      { title: "Angular Documentation", url: "https://angular.io/docs", type: "documentation", time: "3-4 weeks" },
      { title: "Angular - The Complete Guide", url: "https://www.udemy.com/course/the-complete-guide-to-angular-2/", type: "course", time: "5-6 weeks" },
      { title: "Angular University", url: "https://angular-university.io/", type: "course", time: "4-5 weeks" }
    ],
    totalTime: "3-4 months",
    difficulty: "Intermediate to Advanced",
    prerequisites: ["TypeScript", "JavaScript", "HTML", "CSS"]
  },
  
  // Backend Technologies
  nodejs: {
    name: "Node.js",
    resources: [
      { title: "Node.js Official Documentation", url: "https://nodejs.org/en/docs/", type: "documentation", time: "2-3 weeks" },
      { title: "Node.js Tutorial - NodeSchool", url: "https://nodeschool.io/", type: "tutorial", time: "2-3 weeks" },
      { title: "The Complete Node.js Developer Course", url: "https://www.udemy.com/course/the-complete-nodejs-developer-course-2/", type: "course", time: "4-5 weeks" }
    ],
    totalTime: "2-3 months",
    difficulty: "Intermediate",
    prerequisites: ["JavaScript"]
  },
  express: {
    name: "Express.js",
    resources: [
      { title: "Express.js Documentation", url: "https://expressjs.com/", type: "documentation", time: "1-2 weeks" },
      { title: "Express.js Tutorial", url: "https://www.tutorialspoint.com/expressjs/", type: "tutorial", time: "1-2 weeks" },
      { title: "RESTful API with Node.js and Express", url: "https://www.youtube.com/watch?v=pKd0Rpw7Y48", type: "video", time: "1 week" }
    ],
    totalTime: "1-2 months",
    difficulty: "Intermediate",
    prerequisites: ["Node.js", "JavaScript"]
  },
  python: {
    name: "Python",
    resources: [
      { title: "Python Official Documentation", url: "https://docs.python.org/3/", type: "documentation", time: "3-4 weeks" },
      { title: "Python for Everybody (Coursera)", url: "https://www.coursera.org/specializations/python", type: "course", time: "4-5 weeks" },
      { title: "Automate the Boring Stuff with Python", url: "https://automatetheboringstuff.com/", type: "book", time: "2-3 weeks" },
      { title: "Real Python", url: "https://realpython.com/", type: "tutorial", time: "2-3 weeks" }
    ],
    totalTime: "2-4 months",
    difficulty: "Beginner to Advanced",
    prerequisites: []
  },
  django: {
    name: "Django",
    resources: [
      { title: "Django Documentation", url: "https://docs.djangoproject.com/", type: "documentation", time: "3-4 weeks" },
      { title: "Django for Beginners", url: "https://djangoforbeginners.com/", type: "book", time: "2-3 weeks" },
      { title: "Django Tutorial - Mozilla", url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django", type: "tutorial", time: "3-4 weeks" }
    ],
    totalTime: "2-3 months",
    difficulty: "Intermediate",
    prerequisites: ["Python"]
  },
  
  // Databases
  mongodb: {
    name: "MongoDB",
    resources: [
      { title: "MongoDB University", url: "https://university.mongodb.com/", type: "course", time: "2-3 weeks" },
      { title: "MongoDB Documentation", url: "https://docs.mongodb.com/", type: "documentation", time: "2 weeks" },
      { title: "MongoDB - The Complete Developer's Guide", url: "https://www.udemy.com/course/mongodb-the-complete-developers-guide/", type: "course", time: "3-4 weeks" }
    ],
    totalTime: "1-2 months",
    difficulty: "Beginner to Intermediate",
    prerequisites: []
  },
  postgresql: {
    name: "PostgreSQL",
    resources: [
      { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", type: "tutorial", time: "2-3 weeks" },
      { title: "PostgreSQL Official Documentation", url: "https://www.postgresql.org/docs/", type: "documentation", time: "2-3 weeks" },
      { title: "PostgreSQL for Everybody", url: "https://www.coursera.org/learn/postgresql-for-everybody", type: "course", time: "3-4 weeks" }
    ],
    totalTime: "1-2 months",
    difficulty: "Intermediate",
    prerequisites: ["SQL basics"]
  },
  
  // Cloud & DevOps
  aws: {
    name: "AWS (Amazon Web Services)",
    resources: [
      { title: "AWS Training and Certification", url: "https://aws.amazon.com/training/", type: "course", time: "4-6 weeks" },
      { title: "AWS Documentation", url: "https://docs.aws.amazon.com/", type: "documentation", time: "3-4 weeks" },
      { title: "AWS Certified Solutions Architect", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate/", type: "course", time: "6-8 weeks" }
    ],
    totalTime: "3-6 months",
    difficulty: "Intermediate to Advanced",
    prerequisites: ["Cloud computing basics", "Linux"]
  },
  docker: {
    name: "Docker",
    resources: [
      { title: "Docker Documentation", url: "https://docs.docker.com/", type: "documentation", time: "1-2 weeks" },
      { title: "Docker Mastery", url: "https://www.udemy.com/course/docker-mastery/", type: "course", time: "2-3 weeks" },
      { title: "Docker Tutorial for Beginners", url: "https://www.youtube.com/watch?v=fqMOX6JJhGo", type: "video", time: "1 week" }
    ],
    totalTime: "1-2 months",
    difficulty: "Intermediate",
    prerequisites: ["Linux basics"]
  },
  kubernetes: {
    name: "Kubernetes",
    resources: [
      { title: "Kubernetes Documentation", url: "https://kubernetes.io/docs/", type: "documentation", time: "3-4 weeks" },
      { title: "Kubernetes for the Absolute Beginners", url: "https://www.udemy.com/course/learn-kubernetes/", type: "course", time: "3-4 weeks" },
      { title: "Kubernetes Tutorial", url: "https://kubernetes.io/docs/tutorials/", type: "tutorial", time: "2-3 weeks" }
    ],
    totalTime: "2-3 months",
    difficulty: "Advanced",
    prerequisites: ["Docker", "Linux", "Cloud basics"]
  },
  
  // AI & Machine Learning
  machinelearning: {
    name: "Machine Learning",
    resources: [
      { title: "Machine Learning Course (Stanford)", url: "https://www.coursera.org/learn/machine-learning", type: "course", time: "8-10 weeks" },
      { title: "Fast.ai Practical Deep Learning", url: "https://www.fast.ai/", type: "course", time: "6-8 weeks" },
      { title: "Hands-On Machine Learning", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/", type: "book", time: "4-6 weeks" }
    ],
    totalTime: "4-6 months",
    difficulty: "Intermediate to Advanced",
    prerequisites: ["Python", "Mathematics", "Statistics"]
  },
  tensorflow: {
    name: "TensorFlow",
    resources: [
      { title: "TensorFlow Documentation", url: "https://www.tensorflow.org/learn", type: "documentation", time: "3-4 weeks" },
      { title: "TensorFlow Developer Certificate", url: "https://www.coursera.org/professional-certificates/tensorflow-in-practice", type: "course", time: "6-8 weeks" },
      { title: "TensorFlow Tutorial", url: "https://www.tensorflow.org/tutorials", type: "tutorial", time: "2-3 weeks" }
    ],
    totalTime: "2-4 months",
    difficulty: "Intermediate to Advanced",
    prerequisites: ["Python", "Machine Learning basics"]
  },
  
  // Mobile Development
  reactnative: {
    name: "React Native",
    resources: [
      { title: "React Native Documentation", url: "https://reactnative.dev/docs/getting-started", type: "documentation", time: "2-3 weeks" },
      { title: "React Native - The Practical Guide", url: "https://www.udemy.com/course/react-native-the-practical-guide/", type: "course", time: "4-5 weeks" },
      { title: "React Native Tutorial", url: "https://www.reactnative.express/", type: "tutorial", time: "2-3 weeks" }
    ],
    totalTime: "2-3 months",
    difficulty: "Intermediate",
    prerequisites: ["React", "JavaScript"]
  },
  flutter: {
    name: "Flutter",
    resources: [
      { title: "Flutter Documentation", url: "https://flutter.dev/docs", type: "documentation", time: "2-3 weeks" },
      { title: "Flutter & Dart - The Complete Guide", url: "https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/", type: "course", time: "5-6 weeks" },
      { title: "Flutter Tutorial", url: "https://flutter.dev/learn", type: "tutorial", time: "2-3 weeks" }
    ],
    totalTime: "2-3 months",
    difficulty: "Intermediate",
    prerequisites: ["Dart", "Programming basics"]
  }
};

// Helper function to detect technology from input
function detectTechnology(input) {
  const lowerInput = input.toLowerCase();
  const techMap = {
    'react': ['react', 'reactjs', 'react.js'],
    'vue': ['vue', 'vuejs', 'vue.js'],
    'angular': ['angular', 'angularjs'],
    'nodejs': ['node', 'nodejs', 'node.js'],
    'express': ['express', 'expressjs', 'express.js'],
    'python': ['python', 'py'],
    'django': ['django'],
    'mongodb': ['mongodb', 'mongo'],
    'postgresql': ['postgresql', 'postgres', 'pg'],
    'aws': ['aws', 'amazon web services'],
    'docker': ['docker', 'container'],
    'kubernetes': ['kubernetes', 'k8s'],
    'machinelearning': ['machine learning', 'ml', 'ai'],
    'tensorflow': ['tensorflow', 'tf'],
    'reactnative': ['react native', 'reactnative'],
    'flutter': ['flutter']
  };
  
  for (const [key, keywords] of Object.entries(techMap)) {
    if (keywords.some(kw => lowerInput.includes(kw))) {
      return key;
    }
  }
  return null;
}

// Main endpoint: AI-Powered Technology Resource Planner
exports.search = async (req, res) => {
  try {
    const { technology, userId } = req.body;
    
    if (!technology || !technology.trim()) {
      return res.status(400).json({ message: "Technology field is required" });
    }

    const techKey = detectTechnology(technology);
    let result;

    // Check if we have predefined resources
    if (techKey && technologyResources[techKey]) {
      result = technologyResources[techKey];
    } else {
      // Use AI to generate resources for unknown technologies
      const useOpenAI = String(process.env.USE_OPENAI || "false").toLowerCase() === "true";
      const key = process.env.OPENAI_API_KEY;

      if (useOpenAI && key) {
        const prompt = `You are an expert learning path designer. For the topic/technology "${technology}", evaluate if it's a technical subject or a non-tech subject (like History, Art, Business). Provide:
1. Best learning resources (documentation, courses, tutorials, books, videos)
2. Estimated time to learn each resource
3. Total learning time estimate
4. Difficulty level
5. Prerequisites
6. A "syllabus" array listing the core concepts (the Crux) to be learned.
7. A vertical roadmap containing 4-5 core milestone learning steps
8. Three projects or practical applications (Beginner, Intermediate, Advanced)
9. Three expert mentor tips
10. Five skills gained after completing this plan
11. If it is a professional field with clear job roles, list up to three career opportunities (role name, salary estimate, demand growth percentage). If it's purely a hobby or general knowledge topic with no direct salary/job roles, leave careerOpportunities empty or list relevant professional roles if applicable.

Return JSON format exactly matching:
{
  "name": "${technology}",
  "isTech": true/false,
  "syllabus": ["Concept 1", "Concept 2", "Concept 3", "Concept 4"],
  "resources": [
    {
      "title": "Resource name",
      "url": "https://example.com",
      "type": "documentation|course|tutorial|book|video",
      "time": "X weeks"
    }
  ],
  "totalTime": "X weeks or X months",
  "difficulty": "Beginner|Intermediate|Advanced",
  "prerequisites": ["prereq1", "prereq2"],
  "roadmap": [
    {
      "title": "Milestone title",
      "duration": "X weeks",
      "difficulty": "Beginner|Intermediate|Advanced",
      "studyHours": 2,
      "icon": "basics|core|state|advanced|deploy"
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "difficulty": "Beginner|Intermediate|Advanced",
      "description": "Short description of the project and what it entails",
      "skills": ["Skill 1", "Skill 2"]
    }
  ],
  "mentorTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ],
  "skillsGained": [
    { "name": "Skill Name 1", "icon": "architecture" },
    { "name": "Skill Name 2", "icon": "pattern" }
  ],
  "careerOpportunities": [
    {
      "role": "Role Name",
      "salary": "$Xk - $Yk",
      "growth": "+X% YoY"
    }
  ]
}`;

        try {
          const resp = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${key}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                { role: "system", content: "You are an expert learning path designer. Provide accurate, realistic learning resources and time estimates in the requested JSON structure." },
                { role: "user", content: prompt }
              ],
              temperature: 0.3,
              max_tokens: 2500
            })
          });

          const d = await resp.json();
          const raw = d?.choices?.[0]?.message?.content || "";
          
          // Parse JSON from response
          const jsonText = raw.trim().match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] || raw;
          result = JSON.parse(jsonText);
        } catch (e) {
          console.error("OpenAI request or parse error:", e);
          result = generateFallbackResources(technology);
        }
      } else {
        // Fallback for offline mode
        result = generateFallbackResources(technology);
      }
    }

    // Enrich the result to ensure all premium SaaS fields are present
    const enriched = enrichTechnologyData(technology, result);

    // Calculate total days estimate
    const totalDays = estimateTotalDays(enriched.totalTime || "2-3 months");
    
    // Add learning path structure
    const learningPath = {
      technology: enriched.name || technology,
      resources: enriched.resources || [],
      totalTime: enriched.totalTime || "2-3 months",
      totalDays: totalDays,
      difficulty: enriched.difficulty || "Intermediate",
      prerequisites: enriched.prerequisites || [],
      roadmap: enriched.roadmap || [],
      projects: enriched.projects || [],
      mentorTips: enriched.mentorTips || [],
      skillsGained: enriched.skillsGained || [],
      careerOpportunities: enriched.careerOpportunities || [],
      estimatedCompletion: new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000).toISOString(),
      source: techKey ? "curated" : (process.env.USE_OPENAI === "true" ? "ai-generated" : "fallback")
    };

    res.json(learningPath);
  } catch (err) {
    console.error("Resource search error:", err);
    res.status(500).json({ message: "Failed to search resources", error: err.message });
  }
};

// Helper function to estimate total days from time string
function estimateTotalDays(timeString) {
  const lower = timeString.toLowerCase();
  let days = 60; // default 2 months
  
  // Extract numbers and units
  const monthMatch = lower.match(/(\d+)\s*month/);
  const weekMatch = lower.match(/(\d+)\s*week/);
  
  if (monthMatch) {
    days = parseInt(monthMatch[1]) * 30;
  } else if (weekMatch) {
    days = parseInt(weekMatch[1]) * 7;
  }
  
  // Handle ranges like "2-3 months"
  const rangeMatch = lower.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1]);
    const max = parseInt(rangeMatch[2]);
    if (lower.includes('month')) {
      days = ((min + max) / 2) * 30;
    } else if (lower.includes('week')) {
      days = ((min + max) / 2) * 7;
    }
  }
  
  return Math.round(days);
}

// Fallback resource generator
function generateFallbackResources(technology) {
  const lower = technology.toLowerCase().trim();
  let totalTime = "2-3 weeks";
  let difficulty = "Intermediate";
  
  if (["react", "vue", "angular", "node", "python", "django", "spring", "javascript", "typescript"].some(t => lower.includes(t))) {
    totalTime = "4-6 weeks";
    difficulty = "Intermediate";
  } else if (["kubernetes", "aws", "docker", "devops", "cloud", "ai", "machine learning", "ml", "rag", "gen ai"].some(t => lower.includes(t))) {
    totalTime = "6-8 weeks";
    difficulty = "Advanced";
  } else if (["git", "github", "html", "css", "markdown", "prettier", "vscode"].some(t => lower.includes(t))) {
    totalTime = "1-2 weeks";
    difficulty = "Beginner";
  }

  return {
    name: technology,
    resources: [
      {
        title: `${technology} Official Documentation`,
        url: `https://www.google.com/search?q=${encodeURIComponent(technology + ' official documentation')}`,
        type: "documentation",
        time: "1-2 weeks"
      },
      {
        title: `Learn ${technology} - Free Tutorial`,
        url: `https://www.google.com/search?q=${encodeURIComponent('learn ' + technology + ' tutorial')}`,
        type: "tutorial",
        time: "1-2 weeks"
      },
      {
        title: `${technology} Complete Course`,
        url: `https://www.google.com/search?q=${encodeURIComponent(technology + ' course')}`,
        type: "course",
        time: "2-3 weeks"
      }
    ],
    totalTime: totalTime,
    difficulty: difficulty,
    prerequisites: [],
    careerOpportunities: []
  };
}

// Enrich base data with premium roadmap details (fallback/curated helper)
function enrichTechnologyData(techName, baseData) {
  const name = baseData.name || techName;
  const difficulty = baseData.difficulty || "Intermediate";
  const totalTime = baseData.totalTime || "2-3 months";
  const isTech = baseData.isTech !== undefined ? baseData.isTech : true;
  
  let syllabus = baseData.syllabus;
  if (!syllabus || !syllabus.length) {
    syllabus = [
      `Introduction to ${name}`,
      "Core Principles",
      "Practical Applications",
      "Advanced Techniques"
    ];
  }

  let roadmap = baseData.roadmap;
  if (!roadmap || !roadmap.length) {
    roadmap = [
      { title: `${name} Fundamentals & Setup`, duration: "1-2 weeks", difficulty: "Beginner", studyHours: 2, icon: "basics" },
      { title: `Core Concepts & Framework Basics`, duration: "2-3 weeks", difficulty: "Intermediate", studyHours: 3, icon: "core" },
      { title: `State Management & Data Flow`, duration: "2 weeks", difficulty: "Intermediate", studyHours: 3, icon: "state" },
      { title: `Advanced Patterns & API Integration`, duration: "2 weeks", difficulty: "Advanced", studyHours: 4, icon: "advanced" },
      { title: `Testing, Deployment & Production Prep`, duration: "1-2 weeks", difficulty: "Advanced", studyHours: 4, icon: "deploy" }
    ];
  }
  
  let projects = baseData.projects;
  if (!projects || !projects.length) {
    projects = [
      { name: `${name} Interactive Dashboard`, difficulty: "Beginner", description: `Build a clean, responsive interface to practice rendering, basic UI features, and component structure.`, skills: ["UI Design", "Data Binding", "Variables"] },
      { name: `AI-Powered SaaS Assistant`, difficulty: "Intermediate", description: `Develop a complete application featuring state management, API integration, routing, and user settings.`, skills: ["State Management", "API Integration", "Routing"] },
      { name: `Real-time Collaboration Platform`, difficulty: "Advanced", description: `Build a production-grade application featuring real-time synchronization, advanced caching, performance tuning, and test coverage.`, skills: ["Real-time Sync", "Optimization", "Testing"] }
    ];
  }
  
  let mentorTips = baseData.mentorTips;
  if (!mentorTips || !mentorTips.length) {
    mentorTips = [
      `Don't rush: spend time understanding the core rendering paradigm and lifecycle of ${name}.`,
      `Focus on building projects rather than just reading documentation. Hands-on coding builds muscle memory.`,
      `Learn how to read error traces and stack traces. Debugging is 80% of a developer's daily job.`,
      `Join community channels, review open-source repositories, and read official style guides for best practices.`
    ];
  }
  
  let skillsGained = baseData.skillsGained;
  if (!skillsGained || !skillsGained.length) {
    skillsGained = [
      { name: `${name} Architecture`, icon: "architecture" },
      { name: "Component Patterns", icon: "pattern" },
      { name: "State Handling", icon: "state" },
      { name: "Production Deployment", icon: "deployment" },
      { name: "Performance Profiling", icon: "performance" }
    ];
  }
  
  let careerOpportunities = baseData.careerOpportunities;
  if (careerOpportunities === undefined) {
    if (!isTech) {
      careerOpportunities = [];
    } else {
      const nameLower = name.toLowerCase();
      const isFrontend = ["react", "vue", "angular", "reactnative", "flutter", "frontend", "ui", "bootstrap", "tailwind", "css", "html", "javascript", "jquery", "sass", "less", "webpack", "vite"].some(t => nameLower.includes(t));
      const isCloud = ["aws", "docker", "kubernetes", "cloud", "devops", "gcp", "azure", "jenkins", "ansible", "terraform", "ci/cd"].some(t => nameLower.includes(t));
      const isAI = ["machinelearning", "tensorflow", "ai", "machine learning", "python", "data science", "datascience", "pytorch", "pandas", "numpy"].some(t => nameLower.includes(t));
      const isTool = ["git", "github", "gitlab", "vscode", "npm", "yarn", "pip", "jira", "confluence", "trello", "postman", "jest", "mocha", "cypress", "selenium", "eslint", "prettier"].some(t => nameLower === t);
      
      if (isFrontend) {
        careerOpportunities = [
          { role: `Web Developer`, salary: "$75,000 - $95,000", growth: "+12% YoY" },
          { role: `Frontend Developer`, salary: "$95,000 - $130,000", growth: "+18% YoY" },
          { role: `UI Developer / Designer`, salary: "$110,000 - $145,000", growth: "+15% YoY" }
        ];
      } else if (isCloud) {
        careerOpportunities = [
          { role: `Cloud Engineer`, salary: "$110,000 - $135,000", growth: "+25% YoY" },
          { role: `DevOps Systems Engineer`, salary: "$125,000 - $155,000", growth: "+30% YoY" },
          { role: `Solutions Architect`, salary: "$165,000 - $200,000", growth: "+20% YoY" }
        ];
      } else if (isAI) {
        careerOpportunities = [
          { role: `Data Analyst / Scientist`, salary: "$115,000 - $145,000", growth: "+28% YoY" },
          { role: `Machine Learning Engineer`, salary: "$135,000 - $170,000", growth: "+35% YoY" },
          { role: `AI Solutions Architect`, salary: "$165,000 - $220,000", growth: "+40% YoY" }
        ];
      } else if (isTool) {
        careerOpportunities = [
          { role: `Software Engineer`, salary: "$105,000 - $140,000", growth: "+15% YoY" },
          { role: `DevOps Engineer`, salary: "$120,000 - $150,000", growth: "+22% YoY" },
          { role: `QA Automation Engineer`, salary: "$95,000 - $125,000", growth: "+10% YoY" }
        ];
      } else {
        careerOpportunities = [
          { role: `${name} Developer`, salary: "$95,000 - $125,000", growth: "+15% YoY" },
          { role: `Backend Developer`, salary: "$110,000 - $145,000", growth: "+20% YoY" },
          { role: `Full Stack Engineer`, salary: "$120,000 - $160,000", growth: "+25% YoY" }
        ];
      }
    }
  }

  return {
    ...baseData,
    syllabus,
    roadmap,
    projects,
    mentorTips,
    skillsGained,
    careerOpportunities
  };
}

// Simple memory cache to speed up searches and avoid spamming external services
const linkCache = new Map();

exports.verifyLinks = async (req, res) => {
  try {
    const { topic } = req.query;
    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: "Topic query parameter is required" });
    }

    const cleanTopic = topic.trim().toLowerCase();
    
    // Check cache
    if (linkCache.has(cleanTopic)) {
      return res.json(linkCache.get(cleanTopic));
    }

    const resolvedLinks = {};

    // 1. Helper for MDN Web Docs search
    const fetchMDN = async (q) => {
      try {
        const url = `https://developer.mozilla.org/api/v1/search?q=${encodeURIComponent(q)}`;
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
        const data = await response.json();
        if (data.documents && data.documents.length > 0) {
          return `https://developer.mozilla.org${data.documents[0].mdn_url}`;
        }
      } catch (err) {
        console.error("MDN fetch error:", err.message);
      }
      return null;
    };

    // 2. Helper for Dev.to search
    const fetchDevTo = async (q) => {
      try {
        const url = `https://dev.to/api/articles?q=${encodeURIComponent(q)}&per_page=1`;
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
        const data = await response.json();
        if (data && data.length > 0) {
          return data[0].url;
        }
      } catch (err) {
        console.error("Dev.to fetch error:", err.message);
      }
      return null;
    };

    // 3. Helper for Yahoo scraping (W3Schools and GeeksforGeeks)
    const fetchYahoo = async (site, q) => {
      try {
        const query = `site:${site} ${q}`;
        const url = `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`;
        const response = await fetch(url, { 
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
          } 
        });
        const data = await response.text();
        const matches = [...data.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
        const redirectMatches = matches.filter(href => href.includes('r.search.yahoo.com'));

        for (const rawUrl of redirectMatches) {
          const ruMatch = rawUrl.match(/\/RU=([^/]+)/);
          if (ruMatch) {
            const decoded = decodeURIComponent(ruMatch[1]);
            if (decoded.includes(site) && !decoded.includes('yahoo.com')) {
              return decoded;
            }
          }
        }
      } catch (err) {
        console.error(`Yahoo search error for ${site}:`, err.message);
      }
      return null;
    };

    // Run searches in parallel
    const [mdnLink, devtoLink, w3sLink, gfgLink] = await Promise.all([
      fetchMDN(cleanTopic),
      fetchDevTo(cleanTopic),
      fetchYahoo('w3schools.com', cleanTopic),
      fetchYahoo('geeksforgeeks.org', cleanTopic)
    ]);

    if (mdnLink) resolvedLinks.mdn = mdnLink;
    if (devtoLink) resolvedLinks.devto = devtoLink;
    if (w3sLink) resolvedLinks.w3schools = w3sLink;
    if (gfgLink) resolvedLinks.geeksforgeeks = gfgLink;

    // Cache the result
    linkCache.set(cleanTopic, resolvedLinks);

    res.json(resolvedLinks);
  } catch (err) {
    console.error("Link verification failed:", err);
    res.status(500).json({ message: "Failed to verify resource links" });
  }
};

// Get all available technologies
exports.getTechnologies = (req, res) => {
  const technologies = Object.keys(technologyResources).map(key => ({
    key,
    name: technologyResources[key].name,
    difficulty: technologyResources[key].difficulty,
    totalTime: technologyResources[key].totalTime
  }));
  
  res.json({ technologies });
};



