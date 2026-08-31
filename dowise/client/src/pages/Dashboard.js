// src/pages/Dashboard.js
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import debounce from "lodash.debounce";
import AILearningAnalytics from "../components/AILearningAnalytics";
import TechnologyResourcePlanner from "../components/TechnologyResourcePlanner";
import CompletionModal from "../components/CompletionModal";
import { 
  fadeIn, 
  staggerFadeIn, 
  scrollReveal, 
  animateProgress, 
  cardHover, 
  cardHoverOut,
  scaleIn,
  buttonHover,
  buttonHoverOut
} from "../utils/animations";
import "./Dashboard.css";

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [input, setInput] = useState("");
  const [suggest, setSuggest] = useState(null);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [creating, setCreating] = useState(false);
  const [completedPlanData, setCompletedPlanData] = useState(null);
  const [showAI, setShowAI] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingOptimize, setLoadingOptimize] = useState(false);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingRecommend, setLoadingRecommend] = useState(false);
  const [optimizations, setOptimizations] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  
  // New AI input suggestions state
  const [inputSuggestions, setInputSuggestions] = useState([]);
  const [showInputSuggestions, setShowInputSuggestions] = useState(false);
  const [loadingInputSuggestions, setLoadingInputSuggestions] = useState(false);
  const [showCustomPlanModal, setShowCustomPlanModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [resourceModal, setResourceModal] = useState({ isOpen: false, topic: '', originalUrl: '' });
  const [verifiedResources, setVerifiedResources] = useState(null);
  const [loadingResources, setLoadingResources] = useState(false);
  const [forceExpand, setForceExpand] = useState(false);
  const [toast, setToast] = useState(null);

  // Use interceptor to gracefully handle token expiration
  const api = useMemo(() => {
    const instance = axios.create({ headers: { Authorization: `Bearer ${token}` } });
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          alert("Your session has expired. Please log out and log in again.");
          if (logout) logout();
        }
        return Promise.reject(error);
      }
    );
    return instance;
  }, [token, logout]);

  const handleResourceClick = async (topic, originalUrl) => {
    setResourceModal({
      isOpen: true,
      topic: topic || "",
      originalUrl: originalUrl || ""
    });

    if (topic) {
      setLoadingResources(true);
      setVerifiedResources(null);
      try {
        const { data } = await api.get(`/api/resources/verify?topic=${encodeURIComponent(topic)}`);
        setVerifiedResources(data);
      } catch (err) {
        console.error("Failed to verify resources:", err);
        setVerifiedResources({});
      } finally {
        setLoadingResources(false);
      }
    }
  };

  // load user's plans
  const loadPlans = useCallback(async () => {
    try {
      const { data } = await api.get("/api/plans");
      setPlans(data);
      setCurrent(data.find(p => !p.completed) || null);
    } catch {
      // ignore
    }
  }, [api]);

  useEffect(() => { if (token) loadPlans(); }, [token, loadPlans]);

  // Enhanced AI input suggestions with comprehensive topic breakdown
  const getInputSuggestions = useCallback(
    debounce(async (text) => {
      if (!text || !text.trim()) { 
        setInputSuggestions([]); 
        setShowInputSuggestions(false);
        setLoadingInputSuggestions(false); 
        return; 
      }
      
      setLoadingInputSuggestions(true);
      try {
        // Get comprehensive topic suggestions
        const { data } = await api.post("/api/ai/suggest-topics", { 
          input: text,
          userId: user?._id
        });
        
        setInputSuggestions(data.suggestions || []);
        setShowInputSuggestions(true);
      } catch (error) {
        console.error('Input suggestions error:', error);
        // Fallback to basic suggestions
        const fallbackSuggestions = generateFallbackSuggestions(text);
        setInputSuggestions(fallbackSuggestions);
        setShowInputSuggestions(true);
      } finally {
        setLoadingInputSuggestions(false);
      }
    }, 300),
    [user]
  );

  // Generate fallback suggestions when AI is unavailable
  const generateFallbackSuggestions = (text) => {
    const lowerText = text.toLowerCase();
    const suggestions = [];

    // Tech Topics
    if (lowerText.includes('backend') || lowerText.includes('server') || lowerText.includes('api')) {
      suggestions.push({
        title: "Backend Development Mastery",
        description: "Complete backend development learning path",
        topics: [
          "Node.js Fundamentals",
          "Express.js Framework",
          "Database Design (SQL/NoSQL)",
          "API Development & REST",
          "Authentication & Security",
          "Testing & Deployment",
          "Performance Optimization",
          "Microservices Architecture"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "3-6 months",
        priority: "High"
      });
    }

    if (lowerText.includes('frontend') || lowerText.includes('ui') || lowerText.includes('web')) {
      suggestions.push({
        title: "Frontend Development Excellence",
        description: "Master modern frontend technologies",
        topics: [
          "HTML5 & CSS3 Fundamentals",
          "JavaScript ES6+ Mastery",
          "React.js Deep Dive",
          "State Management (Redux/Context)",
          "Responsive Design & CSS Grid",
          "Performance & Optimization",
          "Testing & Debugging",
          "Build Tools & Deployment"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "4-7 months",
        priority: "High"
      });
    }

    if (lowerText.includes('ai') || lowerText.includes('machine') || lowerText.includes('ml')) {
      suggestions.push({
        title: "AI & Machine Learning Journey",
        description: "Comprehensive AI/ML learning path",
        topics: [
          "Python Programming Fundamentals",
          "Mathematics & Statistics",
          "Data Analysis with Pandas",
          "Machine Learning Algorithms",
          "Deep Learning with TensorFlow",
          "Natural Language Processing",
          "Computer Vision",
          "AI Ethics & Deployment"
        ],
        difficulty: "Intermediate to Advanced",
        estimatedDuration: "6-12 months",
        priority: "High"
      });
    }

    if (lowerText.includes('data') || lowerText.includes('analytics')) {
      suggestions.push({
        title: "Data Science & Analytics",
        description: "Master data analysis and visualization",
        topics: [
          "Python for Data Science",
          "SQL & Database Management",
          "Data Cleaning & Preprocessing",
          "Statistical Analysis",
          "Data Visualization (Tableau/PowerBI)",
          "Machine Learning Basics",
          "Big Data Technologies",
          "Business Intelligence"
        ],
        difficulty: "Beginner to Intermediate",
        estimatedDuration: "4-8 months",
        priority: "Medium"
      });
    }

    if (lowerText.includes('mobile') || lowerText.includes('app')) {
      suggestions.push({
        title: "Mobile App Development",
        description: "Cross-platform mobile development",
        topics: [
          "React Native Fundamentals",
          "Mobile UI/UX Design",
          "State Management",
          "Navigation & Routing",
          "API Integration",
          "Testing & Debugging",
          "App Store Deployment",
          "Performance Optimization"
        ],
        difficulty: "Intermediate",
        estimatedDuration: "3-6 months",
        priority: "Medium"
      });
    }

    if (lowerText.includes('devops') || lowerText.includes('deployment')) {
      suggestions.push({
        title: "DevOps & Deployment",
        description: "Master modern deployment practices",
        topics: [
          "Linux & Command Line",
          "Docker & Containerization",
          "CI/CD Pipelines",
          "Cloud Platforms (AWS/Azure)",
          "Infrastructure as Code",
          "Monitoring & Logging",
          "Security Best Practices",
          "Kubernetes Orchestration"
        ],
        difficulty: "Intermediate to Advanced",
        estimatedDuration: "4-8 months",
        priority: "Medium"
      });
    }

    // Language Learning
    if (lowerText.includes('spanish') || lowerText.includes('español')) {
      suggestions.push({
        title: "Spanish Language Mastery",
        description: "Complete Spanish learning journey from beginner to fluent",
        topics: [
          "Basic Greetings & Introductions",
          "Essential Vocabulary & Grammar",
          "Verb Conjugations (Present Tense)",
          "Common Phrases & Expressions",
          "Reading & Writing Skills",
          "Listening & Speaking Practice",
          "Cultural Context & History",
          "Advanced Grammar & Literature"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "6-18 months",
        priority: "High"
      });
    }

    if (lowerText.includes('french') || lowerText.includes('français')) {
      suggestions.push({
        title: "French Language Excellence",
        description: "Master the beautiful French language and culture",
        topics: [
          "Basic Pronunciation & Phonetics",
          "Essential Vocabulary & Articles",
          "Verb Conjugations & Tenses",
          "French Grammar Fundamentals",
          "Conversational French",
          "Reading French Literature",
          "French Culture & History",
          "Business French & Advanced Topics"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "8-20 months",
        priority: "High"
      });
    }

    if (lowerText.includes('german') || lowerText.includes('deutsch')) {
      suggestions.push({
        title: "German Language Journey",
        description: "Learn German systematically and effectively",
        topics: [
          "German Alphabet & Pronunciation",
          "Basic Grammar & Cases",
          "Essential Vocabulary Building",
          "Verb Conjugations & Tenses",
          "Reading German Texts",
          "Speaking & Listening Skills",
          "German Culture & Traditions",
          "Advanced Grammar & Literature"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "7-18 months",
        priority: "Medium"
      });
    }

    // Business & Finance
    if (lowerText.includes('business') || lowerText.includes('entrepreneur') || lowerText.includes('startup')) {
      suggestions.push({
        title: "Business & Entrepreneurship Mastery",
        description: "Build successful businesses from idea to execution",
        topics: [
          "Business Model Canvas",
          "Market Research & Validation",
          "Financial Planning & Budgeting",
          "Marketing & Branding Strategies",
          "Sales & Customer Acquisition",
          "Operations & Team Management",
          "Legal & Compliance Basics",
          "Scaling & Growth Strategies"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "6-12 months",
        priority: "High"
      });
    }

    if (lowerText.includes('finance') || lowerText.includes('investing') || lowerText.includes('money')) {
      suggestions.push({
        title: "Personal Finance & Investing",
        description: "Master your money and build wealth intelligently",
        topics: [
          "Budgeting & Expense Tracking",
          "Emergency Fund & Savings",
          "Debt Management & Credit",
          "Investment Fundamentals",
          "Stock Market Basics",
          "Retirement Planning",
          "Tax Optimization",
          "Advanced Investment Strategies"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "4-10 months",
        priority: "High"
      });
    }

    // Creative Arts
    if (lowerText.includes('drawing') || lowerText.includes('art') || lowerText.includes('sketch')) {
      suggestions.push({
        title: "Drawing & Art Fundamentals",
        description: "Develop your artistic skills and creative expression",
        topics: [
          "Basic Shapes & Forms",
          "Perspective & Composition",
          "Light & Shadow Techniques",
          "Color Theory & Mixing",
          "Figure Drawing Basics",
          "Landscape & Still Life",
          "Digital Art Tools",
          "Personal Style Development"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "6-15 months",
        priority: "Medium"
      });
    }

    // More specific art suggestions
    if (lowerText.includes('digital art') || lowerText.includes('photoshop') || lowerText.includes('illustrator')) {
      suggestions.push({
        title: "Digital Art & Design Mastery",
        description: "Master digital art tools and create stunning artwork",
        topics: [
          "Digital Drawing Fundamentals",
          "Photoshop Basics & Tools",
          "Illustrator Vector Graphics",
          "Digital Painting Techniques",
          "Character Design & Concept Art",
          "Digital Illustration Styles",
          "Workflow & Efficiency Tips",
          "Portfolio Development"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "6-18 months",
        priority: "High"
      });
    }

    if (lowerText.includes('painting') || lowerText.includes('watercolor') || lowerText.includes('acrylic')) {
      suggestions.push({
        title: "Painting Techniques & Mastery",
        description: "Learn various painting mediums and techniques",
        topics: [
          "Color Theory & Mixing",
          "Brush Techniques & Control",
          "Watercolor Fundamentals",
          "Acrylic Painting Basics",
          "Oil Painting Techniques",
          "Composition & Design",
          "Still Life & Landscape",
          "Personal Style Development"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "8-20 months",
        priority: "Medium"
      });
    }

    if (lowerText.includes('music') || lowerText.includes('guitar') || lowerText.includes('piano') || lowerText.includes('instrument')) {
      suggestions.push({
        title: "Music & Instrument Mastery",
        description: "Learn to create beautiful music and master instruments",
        topics: [
          "Music Theory Fundamentals",
          "Rhythm & Timing Practice",
          "Basic Chords & Progressions",
          "Reading Sheet Music",
          "Ear Training & Recognition",
          "Performance Techniques",
          "Songwriting & Composition",
          "Recording & Production Basics"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "8-20 months",
        priority: "Medium"
      });
    }

    // More specific music instrument suggestions
    if (lowerText.includes('guitar') || lowerText.includes('acoustic') || lowerText.includes('electric')) {
      suggestions.push({
        title: "Guitar Mastery Program",
        description: "Master the guitar from beginner to advanced player",
        topics: [
          "Guitar Basics & Posture",
          "Basic Chords (C, G, D, A, E)",
          "Strumming Patterns & Rhythm",
          "Fingerpicking Techniques",
          "Barre Chords & Power Chords",
          "Scales & Improvisation",
          "Song Learning & Performance",
          "Advanced Techniques (Bending, Hammer-ons)"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "6-18 months",
        priority: "High"
      });
    }

    if (lowerText.includes('piano') || lowerText.includes('keyboard')) {
      suggestions.push({
        title: "Piano & Keyboard Excellence",
        description: "Develop piano skills from fundamentals to advanced performance",
        topics: [
          "Piano Posture & Hand Position",
          "Reading Sheet Music & Notes",
          "Basic Scales & Finger Exercises",
          "Chord Progressions & Harmony",
          "Classical & Contemporary Pieces",
          "Sight Reading Practice",
          "Music Theory Application",
          "Performance & Stage Presence"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "8-24 months",
        priority: "High"
      });
    }

    if (lowerText.includes('singing') || lowerText.includes('voice') || lowerText.includes('vocal')) {
      suggestions.push({
        title: "Vocal Training & Singing Mastery",
        description: "Develop your voice and become a confident singer",
        topics: [
          "Vocal Warm-ups & Breathing",
          "Pitch & Tone Control",
          "Vocal Range Development",
          "Harmony & Ear Training",
          "Performance Techniques",
          "Song Interpretation",
          "Stage Presence & Confidence",
          "Vocal Health & Maintenance"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "6-16 months",
        priority: "Medium"
      });
    }

    // Health & Fitness
    if (lowerText.includes('fitness') || lowerText.includes('workout') || lowerText.includes('exercise')) {
      suggestions.push({
        title: "Fitness & Health Optimization",
        description: "Build strength, endurance, and overall wellness",
        topics: [
          "Basic Exercise Form & Safety",
          "Strength Training Fundamentals",
          "Cardiovascular Conditioning",
          "Nutrition & Meal Planning",
          "Recovery & Rest Principles",
          "Flexibility & Mobility",
          "Goal Setting & Progress Tracking",
          "Advanced Training Techniques"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "3-12 months",
        priority: "High"
      });
    }

    // More specific fitness suggestions
    if (lowerText.includes('yoga') || lowerText.includes('meditation')) {
      suggestions.push({
        title: "Yoga & Mindfulness Journey",
        description: "Develop physical strength, flexibility, and mental clarity",
        topics: [
          "Basic Yoga Poses & Alignment",
          "Breathing Techniques (Pranayama)",
          "Sun Salutation Sequences",
          "Meditation & Mindfulness",
          "Yoga Philosophy & History",
          "Advanced Asanas & Flow",
          "Stress Relief & Relaxation",
          "Spiritual Growth & Awareness"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "6-18 months",
        priority: "Medium"
      });
    }

    if (lowerText.includes('running') || lowerText.includes('marathon') || lowerText.includes('jogging')) {
      suggestions.push({
        title: "Running & Endurance Training",
        description: "Build stamina and achieve your running goals",
        topics: [
          "Running Form & Technique",
          "Building Endurance Gradually",
          "Speed Training & Intervals",
          "Race Preparation & Strategy",
          "Injury Prevention & Recovery",
          "Nutrition for Runners",
          "Mental Toughness & Motivation",
          "Advanced Training Plans"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "4-12 months",
        priority: "High"
      });
    }

    if (lowerText.includes('cooking') || lowerText.includes('culinary') || lowerText.includes('chef')) {
      suggestions.push({
        title: "Culinary Arts & Cooking Mastery",
        description: "Transform from kitchen novice to confident chef",
        topics: [
          "Kitchen Safety & Knife Skills",
          "Basic Cooking Techniques",
          "Ingredient Selection & Prep",
          "Flavor Profiles & Seasoning",
          "Recipe Reading & Adaptation",
          "Meal Planning & Timing",
          "International Cuisines",
          "Advanced Techniques & Presentation"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "4-12 months",
        priority: "Medium"
      });
    }

    // More specific cooking suggestions
    if (lowerText.includes('baking') || lowerText.includes('pastry') || lowerText.includes('dessert')) {
      suggestions.push({
        title: "Baking & Pastry Arts",
        description: "Master the art of baking and create delicious pastries",
        topics: [
          "Baking Fundamentals & Science",
          "Basic Bread Making",
          "Pastry Dough Techniques",
          "Cake Baking & Decorating",
          "Cookie & Biscuit Making",
          "Pie & Tart Creation",
          "Advanced Pastry Skills",
          "Professional Presentation"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "6-16 months",
        priority: "Medium"
      });
    }

    if (lowerText.includes('italian') || lowerText.includes('french') || lowerText.includes('asian') || lowerText.includes('indian')) {
      const cuisine = lowerText.includes('italian') ? 'Italian' : 
                     lowerText.includes('french') ? 'French' : 
                     lowerText.includes('asian') ? 'Asian' : 'Indian';
      suggestions.push({
        title: `${cuisine} Cuisine Mastery`,
        description: `Learn authentic ${cuisine} cooking techniques and recipes`,
        topics: [
          `${cuisine} Cooking Fundamentals`,
          "Essential Ingredients & Spices",
          "Traditional Cooking Methods",
          "Classic Recipe Mastery",
          "Regional Variations",
          "Wine & Food Pairing",
          "Cultural Context & History",
          `Modern ${cuisine} Fusion`
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "6-18 months",
        priority: "Medium"
      });
    }

    // Academic & Professional
    if (lowerText.includes('math') || lowerText.includes('mathematics') || lowerText.includes('algebra')) {
      suggestions.push({
        title: "Mathematics Mastery",
        description: "Build strong mathematical foundations and problem-solving skills",
        topics: [
          "Basic Arithmetic & Number Sense",
          "Algebra Fundamentals",
          "Geometry & Spatial Reasoning",
          "Trigonometry Basics",
          "Calculus Introduction",
          "Statistics & Probability",
          "Mathematical Proofs",
          "Applied Mathematics"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "6-18 months",
        priority: "High"
      });
    }

    if (lowerText.includes('writing') || lowerText.includes('author') || lowerText.includes('novel')) {
      suggestions.push({
        title: "Creative Writing & Storytelling",
        description: "Develop your voice and craft compelling narratives",
        topics: [
          "Writing Fundamentals & Grammar",
          "Character Development",
          "Plot Structure & Story Arc",
          "Dialogue & Voice",
          "Setting & World Building",
          "Editing & Revision",
          "Publishing & Marketing",
          "Genre-Specific Techniques"
        ],
        difficulty: "Beginner to Advanced",
        estimatedDuration: "6-15 months",
        priority: "Medium"
      });
    }

    // Generic learning suggestion - more intelligent fallback
    if (suggestions.length === 0) {
      // Try to provide more specific suggestions based on common learning areas
      if (lowerText.includes('learn') || lowerText.includes('study') || lowerText.includes('master')) {
        const subject = lowerText.replace(/\b(learn|study|master|get|become|improve)\b/g, '').trim();
        if (subject) {
          suggestions.push({
            title: `Master ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
            description: `Comprehensive learning path to become proficient in ${subject}`,
            topics: [
              `${subject} Fundamentals & Basics`,
              `Core ${subject} Concepts & Principles`,
              `Practical ${subject} Applications`,
              `Advanced ${subject} Techniques`,
              `Real-world ${subject} Projects`,
              `${subject} Best Practices & Standards`,
              `Community & ${subject} Resources`,
              `Continuous ${subject} Learning & Growth`
            ],
            difficulty: "Beginner to Advanced",
            estimatedDuration: "4-12 months",
            priority: "Medium"
          });
        }
      } else {
        // Very generic fallback
        suggestions.push({
          title: `Learn ${text.charAt(0).toUpperCase() + text.slice(1)}`,
          description: "Customized learning path for your goal",
          topics: [
            "Fundamentals & Basics",
            "Core Concepts & Principles",
            "Practical Applications",
            "Advanced Techniques & Methods",
            "Real-world Projects & Case Studies",
            "Best Practices & Industry Standards",
            "Community & Networking",
            "Continuous Learning & Growth"
          ],
          difficulty: "Beginner to Advanced",
          estimatedDuration: "3-6 months",
          priority: "Medium"
        });
      }
    }

    return suggestions;
  };

  // Handle input change with AI suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    getInputSuggestions(value);
  };

  // Select a topic suggestion
  const selectTopicSuggestion = (suggestion) => {
    setInput(suggestion.title);
    setShowInputSuggestions(false);
    setInputSuggestions([]);
    
    // Auto-generate tasks based on selected topic
    const tasks = suggestion.topics.map((topic, index) => ({
      title: topic,
      days: Math.max(2, Math.ceil(Math.random() * 5) + 1), // 2-6 days
      resource: `https://www.google.com/search?q=learn+${encodeURIComponent(topic)}`,
      difficulty: index < 3 ? "beginner" : index < 6 ? "intermediate" : "advanced",
      priority: index < 2 ? "high" : index < 5 ? "medium" : "low"
    }));

    setSuggest({
      source: "ai-suggestions",
      tasks: tasks,
      aiInsights: `AI-generated learning path for ${suggestion.title}`
    });
  };

  // Debounced AI suggest call with enhanced context
  const callSuggest = useCallback(
    debounce(async (text) => {
      if (!text || !text.trim()) { setSuggest(null); setLoadingSuggest(false); return; }
      setLoadingSuggest(true);
      try {
        const context = {
          previousPlans: plans.slice(0, 3).map(p => p.rawInput),
          preferredDuration: "7-14 days"
        };
        const { data } = await api.post("/api/ai/suggest", { 
          input: text, 
          maxTasks: 8,
          userId: user?._id,
          context
        });
        setSuggest(data);
      } catch {
        setSuggest(null);
      } finally { setLoadingSuggest(false); }
    }, 500),
    [setSuggest, setLoadingSuggest, plans, user]
  );

  useEffect(() => {
    callSuggest(input);
    return () => callSuggest.cancel();
  }, [input, callSuggest]);

  useEffect(() => {
    setForceExpand(false);
  }, [current]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showInputSuggestions && !event.target.closest('.input-wrapper')) {
        setShowInputSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showInputSuggestions]);

  // Accept suggestion: POST tasks directly so server saves exactly these tasks
  async function acceptSuggestion() {
    if (!token) return alert("Please login");
    if (!suggest?.tasks?.length) return alert("No suggested tasks to accept");
    setCreating(true);
    try {
      const payload = { input, tasks: suggest.tasks };
      const { data } = await api.post("/api/plans", payload);
      setPlans(prev => [data, ...prev]);
      setCurrent(data);
      setInput("");
      setSuggest(null);
      setShowCustomPlanModal(false);
    } catch (err) {
      console.error("Failed to create plan:", err);
      const detail = err.response?.data?.error || err.response?.data?.message || err.message;
      alert(`Failed to create plan: ${detail}`);
    } finally {
      setCreating(false);
    }
  }

  // Create plan from Technology Resource Planner selection
  async function createPlanFromResources(planData) {
    if (!token) return alert("Please login");
    if (!planData?.tasks?.length) return alert("No resources to create a plan from");
    setCreating(true);
    try {
      const payload = { input: planData.rawInput, tasks: planData.tasks };
      const { data } = await api.post("/api/plans", payload);
      setPlans(prev => [data, ...prev]);
      setCurrent(data);
    } catch (err) {
      console.error("Failed to create plan from resources:", err);
      const detail = err.response?.data?.error || err.response?.data?.message || err.message;
      alert(`Failed to create plan from resources: ${detail}`);
    } finally {
      setCreating(false);
    }
  }

  async function toggleTask(index) {
    if (!current) return;
    try {
      const { data } = await api.patch(`/api/plans/${current._id}/tasks/${index}/toggle`);
      setCurrent(data);
      setPlans(plans.map(p => p._id === data._id ? data : p));
    } catch {
      alert("Toggle failed");
    }
  }

  // Delete individual task
  async function deleteTask(index) {
    if (!current) return;
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      const { data } = await api.delete(`/api/plans/${current._id}/tasks/${index}`);
      setCurrent(data);
      setPlans(plans.map(p => p._id === data._id ? data : p));
    } catch (err) {
      alert("Failed to delete task");
    }
  }

  // Delete entire plan
  async function deletePlan(planId) {
    if (!window.confirm("Are you sure you want to delete this entire learning plan? This action cannot be undone.")) return;
    
    try {
      await api.delete(`/api/plans/${planId}`);
      setPlans(plans.filter(p => p._id !== planId));
      if (current && current._id === planId) {
        setCurrent(plans.find(p => p._id !== planId) || null);
      }
    } catch (err) {
      alert("Failed to delete plan");
    }
  }

  // Complete / Archive a learning plan
  async function archivePlanAsCompleted() {
    if (!current) return;
    const planToComplete = current;
    try {
      const { data } = await api.patch(`/api/plans/${current._id}/complete`);
      setPlans(plans.map(p => p._id === data._id ? data : p));
      
      setCurrent(null);
      setCompletedPlanData(planToComplete);
    } catch (err) {
      console.error("Failed to complete plan:", err);
      alert("Failed to complete plan");
    }
  }

  // AI-powered plan optimization
  async function optimizePlan() {
    if (!current) return alert("No plan selected");
    setLoadingOptimize(true);
    try {
      const { data } = await api.post("/api/ai/optimize", {
        planId: current._id,
        userId: user.id || user._id
      });
      setOptimizations(data);
      setAiInsights(data.aiInsights);
    } catch (err) {
      alert("Failed to optimize plan");
    } finally {
      setLoadingOptimize(false);
    }
  }

  // AI-powered progress analysis
  async function analyzeProgress() {
    setLoadingAnalyze(true);
    try {
      const { data } = await api.post("/api/ai/analyze", {
        userId: user.id || user._id
      });
      setAiInsights(data.aiInsights);
    } catch (err) {
      alert("Failed to analyze progress");
    } finally {
      setLoadingAnalyze(false);
    }
  }

  // AI-powered personalized recommendations
  async function getRecommendations() {
    setLoadingRecommend(true);
    try {
      const { data } = await api.post("/api/ai/recommend", {
        userId: user.id || user._id,
        interests: "technology, learning, personal development",
        skillLevel: "intermediate"
      });
      setRecommendations(data);
      setAiInsights(data.aiInsights);
    } catch (err) {
      alert("Failed to get recommendations");
    } finally {
      setLoadingRecommend(false);
    }
  }

  const progress = current?.tasks?.length ? Math.round(current.tasks.filter(t=>t.done).length / current.tasks.length * 100) : 0;

  // Refs for animations
  const headerRef = useRef(null);
  const plansGridRef = useRef(null);
  const tasksListRef = useRef(null);
  const progressBarRef = useRef(null);

  // Animate on mount and when plans change
  useEffect(() => {
    if (headerRef.current) {
      fadeIn(headerRef.current, { delay: 0.2 });
    }
  }, []);

  useEffect(() => {
    if (plansGridRef.current && plans.length > 0) {
      const planCards = plansGridRef.current.querySelectorAll('.plan-card');
      if (planCards.length > 0) {
        staggerFadeIn(planCards, { stagger: 0.1, delay: 0.3 });
      }
    }
  }, [plans]);

  useEffect(() => {
    if (tasksListRef.current && current?.tasks) {
      const taskItems = tasksListRef.current.querySelectorAll('.task-item');
      if (taskItems.length > 0) {
        staggerFadeIn(taskItems, { stagger: 0.05, delay: 0.2 });
      }
    }
  }, [current]);

  useEffect(() => {
    if (progressBarRef.current && current) {
      animateProgress(progressBarRef.current, progress, { delay: 0.5 });
    }
  }, [progress, current]);

  const activePlans = plans.filter(p => !p.completed);

  const completedPlans = plans.filter(p => p.completed);

  return (
    <>
      {completedPlanData && (
        <CompletionModal 
          plan={completedPlanData} 
          onClose={() => setCompletedPlanData(null)} 
        />
      )}
      <div className="dashboard-container">
        {/* Sidebar Toggle Button (floating on the left margin, stays sticky as you scroll) */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="sidebar-toggle-btn"
        title="Open menu"
      >
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1H17M1 6H17M1 11H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Sidebar Drawer overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
      {/* Sidebar Drawer */}
      <div className={`sidebar-drawer ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">Menu Options</span>
          <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <button 
            onClick={() => {
              setShowCustomPlanModal(true);
              setIsSidebarOpen(false);
            }}
            className="sidebar-menu-item"
          >
            <span style={{ fontSize: "1.1rem" }}>➕</span>
            <span>Create Custom Plan</span>
          </button>
          
          <button 
            onClick={() => {
              setIsSidebarOpen(false);
              document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="sidebar-menu-item"
          >
            <span style={{ fontSize: "1.1rem" }}>📚</span>
            <span>My Learning Plans</span>
          </button>

          <button 
            onClick={() => {
              setIsSidebarOpen(false);
              const topic = prompt("Enter a technology topic to start a curated revision quiz (e.g. React, Docker):");
              if (topic && topic.trim()) {
                window.open(`/quick-quiz/${encodeURIComponent(topic.trim())}`, '_blank');
              }
            }}
            className="sidebar-menu-item"
          >
            <span style={{ fontSize: "1.1rem" }}>📝</span>
            <span>Revise Topic</span>
          </button>
        </div>
      </div>
      {/* Dashboard Header */}
      <div className="dashboard-header fade-in" ref={headerRef}>
        <h1 className="dashboard-title">Welcome back, {user?.name}! 👋</h1>
        <p className="dashboard-subtitle">
          AI-Powered Technology Resource Planner - Discover learning resources and time estimates for any technology
        </p>
      </div>

      {/* AI Features Toggle */}
      <div className="ai-section">
        <div className="ai-header">
          <h2 className="ai-title">🤖 AI-Powered Learning Assistant</h2>
          <button 
            onClick={() => setShowAI(!showAI)} 
            className="ai-toggle-btn"
            style={{
              background: "transparent",
              border: "1px solid var(--gray-300)",
              borderRadius: "var(--radius-full)",
              padding: "6px 14px",
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "var(--text-secondary)",
              cursor: "pointer",
              transition: "var(--transition-fast)"
            }}
          >
            {showAI ? "✨ Hide AI Features" : "✨ Show AI Features"}
          </button>
        </div>

        {/* AI Features Section */}
        {showAI && (
          <>
            <div className="ai-buttons-grid">
              <button 
                onClick={optimizePlan} 
                disabled={loadingOptimize || !current}
                className="ai-button optimize"
                onMouseEnter={(e) => !loadingOptimize && !current && buttonHover(e.currentTarget)}
                onMouseLeave={(e) => !loadingOptimize && !current && buttonHoverOut(e.currentTarget)}
              >
                {loadingOptimize ? (
                  <>
                    <span className="loading-spinner" style={{ marginRight: "8px" }}></span>
                    Analyzing...
                  </>
                ) : (
                  "🔍 Optimize Current Plan"
                )}
              </button>

              <button 
                onClick={analyzeProgress} 
                disabled={loadingAnalyze}
                className="ai-button analyze"
                onMouseEnter={(e) => !loadingAnalyze && buttonHover(e.currentTarget)}
                onMouseLeave={(e) => !loadingAnalyze && buttonHoverOut(e.currentTarget)}
              >
                {loadingAnalyze ? (
                  <>
                    <span className="loading-spinner" style={{ marginRight: "8px" }}></span>
                    Analyzing...
                  </>
                ) : (
                  "📊 Analyze Learning Progress"
                )}
              </button>

              <button 
                onClick={getRecommendations} 
                disabled={loadingRecommend}
                className="ai-button recommend"
                onMouseEnter={(e) => !loadingRecommend && buttonHover(e.currentTarget)}
                onMouseLeave={(e) => !loadingRecommend && buttonHoverOut(e.currentTarget)}
              >
                {loadingRecommend ? (
                  <>
                    <span className="loading-spinner" style={{ marginRight: "8px" }}></span>
                    Thinking...
                  </>
                ) : (
                  "💡 Get Personalized Recommendations"
                )}
              </button>
            </div>

            {/* AI Insights Display */}
            {aiInsights && (
              <div className="ai-insights">
                <h4 className="ai-insights-title">🤖 AI Insights</h4>
                <p className="ai-insights-content">{aiInsights}</p>
              </div>
            )}

                         {/* Plan Optimizations */}
             {optimizations && (
               <div className="optimizations-section">
                 <h4>🎯 Plan Optimizations</h4>
                 <div className="optimizations-grid">
                   {optimizations.optimizations?.map((opt, idx) => (
                     <div key={idx} className={`optimization-item ${opt.impact}`}>
                       <strong>{opt.type.toUpperCase()}</strong> - {opt.description}
                       <span className={`impact-badge ${opt.impact}`}>
                         {opt.impact} impact
                       </span>
                     </div>
                   ))}
                 </div>
               </div>
             )}

                         {/* Personalized Recommendations */}
             {recommendations && (
               <div className="recommendations-section">
                 <h4>💡 Personalized Learning Paths</h4>
                 <div className="recommendations-grid">
                   {recommendations.recommendations?.map((rec, idx) => (
                     <div key={idx} className="recommendation-item">
                       <h5>{rec.title}</h5>
                       <p>{rec.description}</p>
                       <div className="recommendation-meta">
                         <span>⏱️ {rec.estimatedDuration}</span>
                         <span>📚 {rec.difficulty}</span>
                       </div>
                       {rec.resources?.length > 0 && (
                         <div className="resources-section">
                           <strong>Resources:</strong>
                           <div className="resources-grid">
                             {rec.resources.map((url, urlIdx) => (
                               <a 
                                 key={urlIdx} 
                                 href="#resource" 
                                 onClick={(e) => { e.preventDefault(); handleResourceClick(rec.title, url); }}
                                 className="resource-link"
                               >
                                 Resource {urlIdx + 1}
                               </a>
                             ))}
                           </div>
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
             )}

            {/* AI Learning Analytics */}
            <AILearningAnalytics userId={user?.id || user?._id} token={token} plans={plans} />
          </>
        )}
      </div>

      {/* Technology Resource Planner */}
      <TechnologyResourcePlanner
        token={token}
        onSelectPlan={createPlanFromResources}
        onResourceClick={handleResourceClick}
      />

      {/* Input Section (Custom Plan Creator Modal) */}
      {showCustomPlanModal && (
        <div className="modal-overlay" onClick={() => {
          setShowCustomPlanModal(false);
          setInput("");
          setSuggest(null);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => {
              setShowCustomPlanModal(false);
              setInput("");
              setSuggest(null);
            }}>×</button>
            <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: '10px' }}>
              <div className="input-section" style={{ margin: 0, border: "none", boxShadow: "none", padding: 0 }}>
                <div className="input-header" style={{ flexDirection: "column", alignItems: "flex-start", gap: "var(--spacing-xs)" }}>
                  <h2 className="input-title">📝 Create Custom Task Plan</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 var(--spacing-md) 0" }}>
                  Type a specific goal (e.g., "Build a chat app") to quickly generate a custom task checklist.
                </p>
              </div>
              
              {/* Enhanced AI Input Field with Topic Suggestions */}
              <div className="input-wrapper">
                <input 
                  className="input-field"
                  value={input} 
                  onChange={handleInputChange}
                  placeholder="e.g., React, Node.js, Python, AWS, Docker, Machine Learning, or any technology..."
                  onFocus={() => {
                    if (inputSuggestions.length > 0) setShowInputSuggestions(true);
                  }}
                />
                
                {/* AI Topic Suggestions Dropdown */}
                {showInputSuggestions && inputSuggestions.length > 0 && (
                  <div className="input-suggestions">
                    {loadingInputSuggestions ? (
                      <div className="loading-overlay">
                        <span className="loading-spinner" style={{ marginRight: "8px" }}></span>
                        🤔 AI is analyzing your learning goal...
                      </div>
                    ) : (
                      <>
                        <div style={{ 
                          padding: "var(--spacing-md)", 
                          background: "var(--bg-secondary)", 
                          borderBottom: "1px solid var(--gray-200)",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                          fontSize: "0.875rem"
                        }}>
                          🎯 AI Learning Path Suggestions
                        </div>
                        {inputSuggestions.map((suggestion, idx) => (
                          <div 
                            key={idx}
                            onClick={() => selectTopicSuggestion(suggestion)}
                            className="suggestion-item"
                          >
                            <div style={{ 
                              display: "flex", 
                              justifyContent: "space-between", 
                              alignItems: "flex-start",
                              marginBottom: "8px"
                            }}>
                              <h4 style={{ margin: 0, color: "#007bff", fontSize: "16px" }}>
                                {suggestion.title}
                              </h4>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <span style={{
                                  background: suggestion.priority === "high" ? "#dc3545" : 
                                             suggestion.priority === "low" ? "#6c757d" : "#ffc107",
                                  color: "white",
                                  padding: "2px 8px",
                                  borderRadius: "10px",
                                  fontSize: "10px",
                                  fontWeight: "bold"
                                }}>
                                  {suggestion.priority} priority
                                </span>
                                <span style={{
                                  background: "#17a2b8",
                                  color: "white",
                                  padding: "2px 8px",
                                  borderRadius: "10px",
                                  fontSize: "10px"
                                }}>
                                  {suggestion.difficulty}
                                </span>
                              </div>
                            </div>
                            
                            <p style={{ 
                              margin: "0 0 10px 0", 
                              color: "#666", 
                              fontSize: "14px",
                              lineHeight: "1.4"
                            }}>
                              {suggestion.description}
                            </p>
                            
                            <div style={{ marginBottom: "10px" }}>
                              <span style={{ 
                                background: "#28a745", 
                                color: "white", 
                                padding: "4px 8px", 
                                borderRadius: "15px", 
                                fontSize: "11px",
                                fontWeight: "bold"
                              }}>
                                ⏱️ {suggestion.estimatedDuration}
                              </span>
                            </div>
                            
                            <div>
                              <strong style={{ fontSize: "12px", color: "#333" }}>Learning Topics:</strong>
                              <div style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                                gap: "8px", 
                                marginTop: "8px" 
                              }}>
                                {suggestion.topics.map((topic, topicIdx) => (
                                  <div key={topicIdx} style={{
                                    background: "#f8f9fa",
                                    padding: "6px 10px",
                                    borderRadius: "15px",
                                    fontSize: "11px",
                                    color: "#666",
                                    border: "1px solid #e9ecef"
                                  }}>
                                    {topic}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div style={{ 
                          padding: "10px", 
                          textAlign: "center", 
                          background: "#f8f9fa",
                          fontSize: "12px",
                          color: "#666",
                          borderTop: "1px solid #dee2e6"
                        }}>
                          💡 Click any suggestion to auto-generate a complete learning plan
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="accept-btn-container">
                <button 
                  onClick={acceptSuggestion} 
                  disabled={creating || !suggest}
                  className="accept-btn"
                > 
                  {creating ? "Creating..." : "Accept Suggestion & Save"} 
                </button>
              </div>

              <div style={{ marginTop: 12 }}>
                <strong>Live AI suggestion</strong>
                {loadingSuggest && <div>🤔 AI is thinking...</div>}
                {!loadingSuggest && suggest?.tasks?.length ? (
                  <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                    {suggest.tasks.map((t,i) => (
                      <div key={i} className="mini" style={{ 
                        padding: "10px", 
                        background: "#f8f9fa", 
                        border: "1px solid #dee2e6",
                        borderRadius: "5px"
                      }}>
                        <div><strong>{t.title}</strong> — {t.days}d</div>
                        <div style={{ fontSize: 13, marginTop: "5px" }}>
                          <span style={{ 
                            background: t.difficulty === "beginner" ? "#28a745" : t.difficulty === "advanced" ? "#dc3545" : "#ffc107",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            marginRight: "10px"
                          }}>
                            {t.difficulty}
                          </span>
                          <span style={{ 
                            background: t.priority === "high" ? "#dc3545" : t.priority === "low" ? "#6c757d" : "#ffc107",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px"
                          }}>
                            {t.priority} priority
                          </span>
                        </div>
                        <div style={{ fontSize: 13, marginTop: "5px" }}>
                          <a href="#resource" onClick={(e) => { e.preventDefault(); handleResourceClick(t.title, t.resource); }}>📚 resource</a>
                        </div>
                      </div>
                    ))}
                    <div style={{ fontSize: 12, color: "#666", marginTop: "10px" }}>
                      🤖 {suggest.aiInsights} • source: {suggest.source}
                    </div>
                  </div>
                ) : (!loadingSuggest && input.trim()) ? <div>No suggestion</div> : <div style={{ color: "#888" }}>Start typing...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Current Plan Tasks */}
      {current && (
        <div className="tasks-section fade-in">
          <div className="tasks-header">
            <h2 className="tasks-title">My Plan: {current.rawInput}</h2>
          </div>
          
          <div className="plan-progress">
            <div className="progress-label">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                ref={progressBarRef}
                style={{ width: `${progress}%`}} 
              />
            </div>
          </div>
          
          {progress === 100 && !forceExpand ? (
            <div className="completed-prompt-box" style={{
              background: "rgba(16, 185, 129, 0.05)",
              border: "1px dashed var(--text-success, #10b981)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-xl)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--spacing-md)",
              margin: "var(--spacing-lg) 0"
            }}>
              <span style={{ fontSize: "2.5rem" }}>🎉</span>
              <h3 style={{ margin: 0, color: "var(--text-primary)" }}>Congratulations! Plan Completed!</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "450px", margin: 0 }}>
                You have finished all tasks for <strong>{current.rawInput}</strong>. What would you like to do next?
              </p>
              
              <div style={{ display: "flex", gap: "var(--spacing-md)", marginTop: "var(--spacing-xs)" }}>
                <button 
                  onClick={archivePlanAsCompleted}
                  className="plan-button success"
                  style={{ 
                    background: "var(--text-success, #10b981)",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  🎓 Completed
                </button>
                <button 
                  onClick={() => window.open(`/revision/${current._id}`, "_blank")}
                  className="plan-button secondary"
                  style={{ 
                    background: "transparent",
                    border: "1px solid var(--gray-300)",
                    color: "var(--text-primary)",
                    padding: "10px 20px",
                    borderRadius: "var(--radius-md)",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  🔄 Revision
                </button>
              </div>
            </div>
          ) : (
            <div className="task-list" ref={tasksListRef}>
              {progress === 100 && forceExpand && (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  background: "var(--gray-50)", 
                  padding: "var(--spacing-sm) var(--spacing-md)", 
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--gray-200)",
                  marginBottom: "var(--spacing-md)" 
                }}>
                  <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    💡 Revision Mode: You can view all tasks and study resources again.
                  </span>
                  <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                    <button 
                      onClick={archivePlanAsCompleted}
                      style={{
                        background: "var(--text-success, #10b981)",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      🎓 Completed
                    </button>
                    <button 
                      onClick={() => setForceExpand(false)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--gray-300)",
                        color: "var(--text-primary)",
                        padding: "6px 12px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      ⬅️ Back to Options
                    </button>
                  </div>
                </div>
              )}
              {current.tasks.map((t, idx) => (
                <div key={idx} className={`task-item ${t.done ? "completed" : ""} slide-in`}>
                  <div className="task-header">
                    <h4 className={`task-title ${t.done ? "completed" : ""}`}>
                      {t.done ? "✅ " : "⏳ "}{t.title}
                    </h4>
                    <div className="task-days-badge" style={{ 
                      background: t.done ? "var(--success)" : "var(--primary-gradient)", 
                      color: "white", 
                      padding: "4px 12px", 
                      borderRadius: "var(--radius-full)", 
                      fontSize: "0.75rem",
                      fontWeight: "600"
                    }}>
                      {t.days}d
                    </div>
                  </div>
                  
                  <div className="task-meta">
                    <div className="task-meta-item">
                      <span>📅</span>
                      <span>Deadline: {new Date(t.deadline).toLocaleDateString()}</span>
                    </div>
                    
                    {t.difficulty && (
                      <div className="task-meta-item">
                        <span className={`badge-difficulty ${t.difficulty}`} style={{
                          background: t.difficulty === "beginner" ? "var(--success)" : 
                                     t.difficulty === "advanced" ? "var(--error)" : "var(--warning)",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "11px",
                          fontWeight: "600",
                          textTransform: "capitalize"
                        }}>
                          {t.difficulty}
                        </span>
                      </div>
                    )}

                    {t.priority && (
                      <div className="task-meta-item">
                        <span className={`badge-priority ${t.priority}`} style={{
                          background: t.priority === "high" ? "var(--error)" : 
                                     t.priority === "low" ? "var(--gray-500)" : "var(--warning)",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "11px",
                          fontWeight: "600",
                          textTransform: "capitalize"
                        }}>
                          {t.priority}
                        </span>
                      </div>
                    )}

                    {t.resource && (
                      <div className="task-meta-item">
                        <a href="#resource" onClick={(e) => { e.preventDefault(); handleResourceClick(t.title, t.resource); }} className="task-resource-link" style={{ 
                          color: "var(--primary)", 
                          textDecoration: "none",
                          fontWeight: "500",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          📚 Resource
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="task-actions">
                    <button 
                      onClick={() => toggleTask(idx)}
                      className={`task-button ${t.done ? 'pending' : 'success'}`}
                    >
                      {t.done ? "🔄 Mark Pending" : "✅ Mark Completed"}
                    </button>
                    
                    <button 
                      onClick={() => deleteTask(idx)}
                      className="task-button danger"
                      title="Delete this task"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Plans Section */}
      <div className="plans-section" id="plans">
        <div className="section-header">
          <h2 className="section-title">My Active Plans</h2>
        </div>
        {activePlans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <p className="empty-state-text">No active learning plans yet</p>
            <p className="empty-state-subtext">Create your first plan above! 🚀</p>
          </div>
        ) : (
          <div className="plans-grid" ref={plansGridRef}>
            {activePlans.map((p) => {
              const planProgress = p.tasks?.length ? Math.round((p.tasks.filter(t => t.done).length / p.tasks.length) * 100) : 0;
              
              return (
                <div 
                  key={p._id} 
                  className={`plan-card ${current && current._id === p._id ? 'active' : ''} fade-in`}
                  onMouseEnter={(e) => cardHover(e.currentTarget)}
                  onMouseLeave={(e) => cardHoverOut(e.currentTarget)}
                >
                  <div className="plan-header">
                    <h3 className="plan-name">{p.rawInput}</h3>
                  </div>
                  
                  <div className="plan-progress">
                    <div className="progress-label">
                      <span>Progress</span>
                      <span>{planProgress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        ref={planProgress === 0 ? null : (el) => {
                          if (el) {
                            setTimeout(() => animateProgress(el, planProgress, { delay: 0.3 }), 100);
                          }
                        }}
                        style={{ width: `${planProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontSize: "0.875rem", 
                    color: "var(--text-secondary)",
                    display: "flex",
                    gap: "var(--spacing-md)",
                    marginTop: "var(--spacing-sm)"
                  }}>
                    <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                    <span>📋 {p.tasks?.length || 0} tasks</span>
                    <span>✅ {p.tasks?.filter(t => t.done).length || 0} completed</span>
                  </div>
                  
                  <div className="plan-actions">
                    <button 
                      onClick={() => setCurrent(p)}
                      className={`plan-button primary ${current && current._id === p._id ? '' : ''}`}
                    >
                      {current && current._id === p._id ? "👁️ Viewing" : "👁️ View"}
                    </button>
                    
                    <button 
                      onClick={() => deletePlan(p._id)}
                      className="plan-button danger"
                      title="Delete this learning plan"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resource Selector Modal */}
      {resourceModal.isOpen && (
        <div className="modal-overlay" onClick={() => setResourceModal({ isOpen: false, topic: '', originalUrl: '' })}>
          <div className="modal-content resource-selector-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setResourceModal({ isOpen: false, topic: '', originalUrl: '' })}>×</button>
            <h2 className="modal-title-premium" style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--spacing-xs)" }}>📚 Study Resources</h2>
            <p className="modal-subtitle-premium" style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "var(--spacing-lg)" }}>Choose where you want to study <strong>{resourceModal.topic}</strong></p>
            
            <div className="resource-options-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-lg)", marginTop: "var(--spacing-md)" }}>
              {/* Theory Column */}
              <div className="resource-column" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)", background: "var(--gray-50)", padding: "var(--spacing-md)", borderRadius: "var(--radius-lg)", border: "1px solid var(--gray-200)" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>📖 Theory Resources</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", margin: "0 0 var(--spacing-sm) 0" }}>Learn concepts, documentation, and written guides.</p>
                {loadingResources ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--spacing-md)", gap: "8px" }}>
                    <span className="loading-spinner-small"></span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Verifying articles...</span>
                  </div>
                ) : verifiedResources && Object.keys(verifiedResources).length > 0 ? (
                  <div className="resource-buttons" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
                    {verifiedResources.mdn && (
                      <a 
                        href={verifiedResources.mdn} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-btn-link mdn-btn"
                      >
                        <span>🌐</span> MDN Web Docs
                      </a>
                    )}
                    {verifiedResources.geeksforgeeks && (
                      <a 
                        href={verifiedResources.geeksforgeeks} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-btn-link gfg-btn"
                      >
                        <span>💻</span> GeeksforGeeks
                      </a>
                    )}
                    {verifiedResources.w3schools && (
                      <a 
                        href={verifiedResources.w3schools} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-btn-link w3s-btn"
                      >
                        <span>✏️</span> W3Schools
                      </a>
                    )}
                    {verifiedResources.devto && (
                      <a 
                        href={verifiedResources.devto} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-btn-link devto-btn"
                      >
                        <span>✍️</span> Dev.to Community
                      </a>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "var(--spacing-xs) 0", textAlign: "center" }}>
                    No direct articles found on standard reference platforms.
                  </p>
                )}
              </div>
              
              {/* Video Column */}
              <div className="resource-column" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)", background: "var(--gray-50)", padding: "var(--spacing-md)", borderRadius: "var(--radius-lg)", border: "1px solid var(--gray-200)" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>🎥 Video Resources</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", margin: "0 0 var(--spacing-sm) 0" }}>Choose a tutorial video to play directly on YouTube.</p>
                <div className="resource-buttons" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
                  {getVideoResources(resourceModal.topic).map((video, vIdx) => (
                    <a 
                      key={vIdx}
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="resource-btn-link youtube-btn"
                      style={{ fontSize: "0.825rem", padding: "10px 12px" }}
                    >
                      <span>▶️</span> {video.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Original Link (if it's not a generic google search url) */}
            {resourceModal.originalUrl && !resourceModal.originalUrl.includes("google.com/search") && (
              <div className="original-resource-link-wrapper" style={{ marginTop: "var(--spacing-lg)", borderTop: "1px solid var(--gray-200)", paddingTop: "var(--spacing-md)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-xs)" }}>
                <a 
                  href={resourceModal.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resource-btn-link original-link-btn"
                >
                  🔗 Open Curated Resource Link
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Modern Page Footer */}
      <footer className="planner-footer-premium" style={{ 
        marginTop: "var(--spacing-2xl)", 
        background: "var(--gray-50)", 
        border: "1px solid var(--gray-200)", 
        borderRadius: "var(--radius-xl)", 
        padding: "var(--spacing-xl) var(--spacing-2xl)",
        boxShadow: "var(--shadow-sm)"
      }}>
        <div className="footer-content">
          <div className="footer-brand-section" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
            <span className="footer-logo-brand">DoWise</span>
            <p className="footer-brand-tagline" style={{ color: "var(--text-secondary)", fontSize: "0.875rem", margin: "4px 0 0 0" }}>
              AI-powered skill architecture and learning schedules.
            </p>
          </div>
          <div className="nav-links" style={{ display: "flex", gap: "var(--spacing-2xl)", flexWrap: "wrap" }}>
            <div className="footer-link-group" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
              <strong style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Community</strong>
              <a href="https://github.com/AdityaShukla3/DoWise" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "var(--text-secondary)", fontSize: "0.875rem" }}>GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "var(--text-secondary)", fontSize: "0.875rem" }}>LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom-line" style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--gray-200)", paddingTop: "var(--spacing-md)", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
          <p>© {new Date().getFullYear()} DoWise. Built for premium learning experiences.</p>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification" style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
          zIndex: 1000,
          animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "1.25rem" }}>🎉</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
    </>
  );
}

const getVideoResources = (topic) => {
  const clean = (topic || "").toLowerCase().trim();
  
  const database = {
    react: [
      { title: "React JS Full Course for Beginners (freeCodeCamp)", url: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
      { title: "React JS Crash Course (Traversy Media)", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
      { title: "React Tutorial for Beginners (Programming with Mosh)", url: "https://www.youtube.com/watch?v=SqcY0GlETPk" }
    ],
    vue: [
      { title: "Vue.js Crash Course (Traversy Media)", url: "https://www.youtube.com/watch?v=qZXt1Aom3Cs" },
      { title: "Vue JS Full Course for Beginners (freeCodeCamp)", url: "https://www.youtube.com/watch?v=FXpIoQ_rT_c" }
    ],
    angular: [
      { title: "Angular Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=3qBXWUpoPHo" },
      { title: "Angular Tutorial for Beginners (Mosh)", url: "https://www.youtube.com/watch?v=k5E2AV5-8ME" }
    ],
    nodejs: [
      { title: "Node.js Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=RLtyhwFtXQA" },
      { title: "Node.js Crash Course (Traversy Media)", url: "https://www.youtube.com/watch?v=f2EqECyiU_4" }
    ],
    express: [
      { title: "ExpressJS Crash Course (Traversy Media)", url: "https://www.youtube.com/watch?v=SccSCuHhOw0" },
      { title: "ExpressJS Tutorial (Web Dev Simplified)", url: "https://www.youtube.com/watch?v=SccSCuHhOw0" }
    ],
    mongodb: [
      { title: "MongoDB Complete Tutorial (freeCodeCamp)", url: "https://www.youtube.com/watch?v=ExcRbA7Y_QA" },
      { title: "MongoDB Crash Course (Web Dev Simplified)", url: "https://www.youtube.com/watch?v=ofme2o290Y4" }
    ],
    python: [
      { title: "Python for Beginners - Full Course (Mosh)", url: "https://www.youtube.com/watch?v=kqtD5dpnC8U" },
      { title: "Python Full Course for Beginners (freeCodeCamp)", url: "https://www.youtube.com/watch?v=rfscVS0vtbw" }
    ],
    java: [
      { title: "Java Tutorial for Beginners (Mosh)", url: "https://www.youtube.com/watch?v=grEKMHGYyns" },
      { title: "Java Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=A74TOX803D0" }
    ],
    git: [
      { title: "Git & GitHub Crash Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=RGOj5yH7evk" },
      { title: "Git Tutorial for Beginners (Mosh)", url: "https://www.youtube.com/watch?v=8JJ101D3knE" }
    ],
    github: [
      { title: "GitHub Tutorial for Beginners (freeCodeCamp)", url: "https://www.youtube.com/watch?v=RGOj5yH7evk" }
    ],
    docker: [
      { title: "Docker Full Course (TechWorld with Nana)", url: "https://www.youtube.com/watch?v=3c-iQqg644U" },
      { title: "Docker Tutorial for Beginners (Mosh)", url: "https://www.youtube.com/watch?v=pTFZFxd4hOI" }
    ],
    kubernetes: [
      { title: "Kubernetes Tutorial for Beginners (Nana)", url: "https://www.youtube.com/watch?v=X48VuDVv0do" }
    ],
    bootstrap: [
      { title: "Bootstrap 5 Crash Course (Traversy Media)", url: "https://www.youtube.com/watch?v=4sosXZsDy-s" },
      { title: "Bootstrap Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=-qfEOE4vtxy" }
    ],
    tailwind: [
      { title: "Tailwind CSS Crash Course (Traversy Media)", url: "https://www.youtube.com/watch?v=UBOj6rqRUME" },
      { title: "Tailwind CSS Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=ft30zcMlFao" }
    ],
    css: [
      { title: "CSS Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=OXGznpKZ_sA" },
      { title: "CSS Crash Course (Traversy Media)", url: "https://www.youtube.com/watch?v=yfoY53QXENI" }
    ],
    html: [
      { title: "HTML Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg" },
      { title: "HTML Crash Course (Traversy Media)", url: "https://www.youtube.com/watch?v=UB1O30fR-EE" }
    ],
    javascript: [
      { title: "JavaScript Full Course for Beginners (freeCodeCamp)", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg" },
      { title: "JavaScript Tutorial for Beginners (Mosh)", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk" }
    ],
    sql: [
      { title: "SQL Tutorial for Beginners (Mosh)", url: "https://www.youtube.com/watch?v=7S_tz1z_5bA" },
      { title: "SQL Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" }
    ],
    django: [
      { title: "Django Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=F5mRW0q-A0o" },
      { title: "Django Crash Course (Traversy Media)", url: "https://www.youtube.com/watch?v=e1IyzVyrLSU" }
    ],
    rust: [
      { title: "Rust Programming Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=zF34dIPdyUM" }
    ],
    typescript: [
      { title: "TypeScript Tutorial for Beginners (Mosh)", url: "https://www.youtube.com/watch?v=d56mG7DezGs" },
      { title: "TypeScript Crash Course (Traversy Media)", url: "https://www.youtube.com/watch?v=gp5H0Vw39k0" }
    ]
  };

  for (const key in database) {
    if (clean.includes(key)) {
      return database[key];
    }
  }

  // Fallback to searching/playing first direct video result matching topic
  return [
    { 
      title: `${topic} Beginners Tutorial (YouTube Video)`, 
      url: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(topic + ' tutorial')}` 
    },
    { 
      title: `${topic} Crash Course (YouTube Video)`, 
      url: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(topic + ' crash course')}` 
    }
  ];
};
