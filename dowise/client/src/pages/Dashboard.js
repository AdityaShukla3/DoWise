// src/pages/Dashboard.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import debounce from "lodash.debounce";
import AIAssistant from "../components/AIAssistant";
import AILearningAnalytics from "../components/AILearningAnalytics";
import "./Dashboard.css";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [input, setInput] = useState("");
  const [suggest, setSuggest] = useState(null);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [creating, setCreating] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [optimizations, setOptimizations] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
  
  // New AI input suggestions state
  const [inputSuggestions, setInputSuggestions] = useState([]);
  const [showInputSuggestions, setShowInputSuggestions] = useState(false);
  const [loadingInputSuggestions, setLoadingInputSuggestions] = useState(false);

  const api = axios.create({ headers: { Authorization: `Bearer ${token}` } });

  // load user's plans
  const loadPlans = useCallback(async () => {
    try {
      const { data } = await api.get("/api/plans");
      setPlans(data);
      setCurrent(data[0] || null);
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
        const { data } = await axios.post("/api/ai/suggest-topics", { 
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
          "Modern ${cuisine} Fusion"
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
        const { data } = await axios.post("/api/ai/suggest", { 
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showInputSuggestions && !event.target.closest('.ai-input-container')) {
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
    } catch (err) {
      alert("Failed to create plan");
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

  // AI-powered plan optimization
  async function optimizePlan() {
    if (!current) return alert("No plan selected");
    setLoadingAI(true);
    try {
      const { data } = await api.post("/api/ai/optimize", {
        planId: current._id,
        userId: user._id
      });
      setOptimizations(data);
      setAiInsights(data.aiInsights);
    } catch (err) {
      alert("Failed to optimize plan");
    } finally {
      setLoadingAI(false);
    }
  }

  // AI-powered progress analysis
  async function analyzeProgress() {
    setLoadingAI(true);
    try {
      const { data } = await api.post("/api/ai/analyze", {
        userId: user._id
      });
      setAiInsights(data);
    } catch (err) {
      alert("Failed to analyze progress");
    } finally {
      setLoadingAI(false);
    }
  }

  // AI-powered personalized recommendations
  async function getRecommendations() {
    setLoadingAI(true);
    try {
      const { data } = await api.post("/api/ai/recommend", {
        userId: user._id,
        interests: "technology, learning, personal development",
        skillLevel: "intermediate"
      });
      setRecommendations(data);
      setAiInsights(data.aiInsights);
    } catch (err) {
      alert("Failed to get recommendations");
    } finally {
      setLoadingAI(false);
    }
  }

  const progress = current?.tasks?.length ? Math.round(current.tasks.filter(t=>t.done).length / current.tasks.length * 100) : 0;

  return (
    <div>
             {/* AI Features Toggle */}
       <div className="card">
         <button 
           onClick={() => setShowAI(!showAI)} 
           className={`toggle-btn ${showAI ? 'active' : ''}`}
         >
           {showAI ? "Hide AI Features" : "Show AI Features"}
         </button>
       </div>

      {/* AI Features Section */}
      {showAI && (
        <>
          <div className="card">
            <h2>🤖 AI-Powered Learning Assistant</h2>
            
                         <div className="ai-buttons-grid">
               <button 
                 onClick={optimizePlan} 
                 disabled={loadingAI || !current}
                 className="ai-btn optimize-btn"
               >
                 {loadingAI ? "Analyzing..." : "🔍 Optimize Current Plan"}
               </button>

               <button 
                 onClick={analyzeProgress} 
                 disabled={loadingAI}
                 className="ai-btn analyze-btn"
               >
                 {loadingAI ? "Analyzing..." : "📊 Analyze Learning Progress"}
               </button>

               <button 
                 onClick={getRecommendations} 
                 disabled={loadingAI}
                 className="ai-btn recommend-btn"
               >
                 {loadingAI ? "Thinking..." : "💡 Get Personalized Recommendations"}
               </button>
             </div>

                         {/* AI Insights Display */}
             {aiInsights && (
               <div className="ai-insights">
                 <h4>🤖 AI Insights</h4>
                 <p>{aiInsights}</p>
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
                                 href={url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
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
          </div>

          {/* AI Learning Analytics */}
          <AILearningAnalytics userId={user?._id} token={token} plans={plans} />
        </>
      )}

      <div className="card">
        <h2>Create Plan (AI-driven)</h2>
        
        {/* Enhanced AI Input Field with Topic Suggestions */}
        <div className="ai-input-container" style={{ position: "relative" }}>
                     <input 
             value={input} 
             onChange={handleInputChange}
             placeholder="e.g., learn spanish, master guitar, study business, explore cooking, practice drawing..." 
             style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
             onFocus={() => {
               if (inputSuggestions.length > 0) setShowInputSuggestions(true);
             }}
           />
          
          {/* AI Topic Suggestions Dropdown */}
          {showInputSuggestions && inputSuggestions.length > 0 && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "white",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 1000,
              maxHeight: "400px",
              overflowY: "auto"
            }}>
              {loadingInputSuggestions ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                  🤔 AI is analyzing your learning goal...
                </div>
              ) : (
                <>
                  <div style={{ 
                    padding: "15px", 
                    background: "#f8f9fa", 
                    borderBottom: "1px solid #dee2e6",
                    fontWeight: "bold",
                    color: "#333"
                  }}>
                    🎯 AI Learning Path Suggestions
                  </div>
                  {inputSuggestions.map((suggestion, idx) => (
                    <div 
                      key={idx}
                      onClick={() => selectTopicSuggestion(suggestion)}
                      style={{
                        padding: "15px",
                        borderBottom: "1px solid #f0f0f0",
                        cursor: "pointer",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#f8f9fa"}
                      onMouseLeave={(e) => e.target.style.background = "white"}
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
                    <a href={t.resource} target="_blank" rel="noreferrer">📚 resource</a>
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

      {current && (
        <div className="card">
          <h3>My Plan: {current.rawInput}</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%`}} />
          </div>
          <div className="grid" style={{ marginTop: 10 }}>
                         {current.tasks.map((t, idx) => (
               <div key={idx} className={`card sm ${t.done ? "done" : ""}`}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                   <div style={{ flex: 1 }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                       <strong style={{ fontSize: "16px", color: t.done ? "#28a745" : "#333" }}>
                         {t.done ? "✅ " : "⏳ "}{t.title}
                       </strong>
                       <div style={{ 
                         background: t.done ? "#28a745" : "#ffc107", 
                         color: "white", 
                         padding: "4px 8px", 
                         borderRadius: "12px", 
                         fontSize: "12px",
                         fontWeight: "bold"
                       }}>
                         {t.days}d
                       </div>
                     </div>
                     
                     <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
                       📅 Deadline: {new Date(t.deadline).toDateString()}
                     </div>
                     
                     {t.difficulty && (
                       <div style={{ marginBottom: "8px" }}>
                         <span style={{
                           background: t.difficulty === "beginner" ? "#28a745" : 
                                      t.difficulty === "advanced" ? "#dc3545" : "#ffc107",
                           color: "white",
                           padding: "3px 8px",
                           borderRadius: "10px",
                           fontSize: "11px",
                           marginRight: "8px"
                         }}>
                           {t.difficulty}
                         </span>
                         {t.priority && (
                           <span style={{
                             background: t.priority === "high" ? "#dc3545" : 
                                        t.priority === "low" ? "#6c757d" : "#ffc107",
                             color: "white",
                             padding: "3px 8px",
                             borderRadius: "10px",
                             fontSize: "11px"
                           }}>
                             {t.priority} priority
                           </span>
                         )}
                       </div>
                     )}
                     
                     <div style={{ marginTop: "8px" }}>
                       <a 
                         href={t.resource} 
                         target="_blank" 
                         rel="noreferrer"
                         style={{
                           background: "#007bff",
                           color: "white",
                           padding: "6px 12px",
                           borderRadius: "15px",
                           textDecoration: "none",
                           fontSize: "12px",
                           display: "inline-block",
                           marginRight: "8px"
                         }}
                       >
                         📚 Open Resource
                       </a>
                     </div>
                   </div>
                 </div>
                 
                                   <div className="task-actions">
                    <button 
                      onClick={() => toggleTask(idx)}
                      className={`task-btn toggle-btn ${t.done ? 'pending' : 'complete'}`}
                    >
                      {t.done ? "🔄 Mark Pending" : "✅ Mark Completed"}
                    </button>
                    
                    <button 
                      onClick={() => deleteTask(idx)}
                      className="task-btn delete-btn"
                      title="Delete this task"
                    >
                      🗑️ Delete
                    </button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3>My Learning Plans</h3>
        {plans.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            <p>No learning plans yet. Create your first plan above! 🚀</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {plans.map(p => (
              <div 
                key={p._id} 
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  background: current && current._id === p._id ? "#e3f2fd" : "#f8f9fa",
                  border: current && current._id === p._id ? "2px solid #2196f3" : "1px solid #dee2e6",
                  borderRadius: "8px",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setCurrent(p)}>
                  <div style={{ 
                    fontWeight: "bold", 
                    color: "#333",
                    marginBottom: "4px"
                  }}>
                    {p.rawInput}
                  </div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#666",
                    display: "flex",
                    gap: "15px"
                  }}>
                    <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                    <span>📋 {p.tasks?.length || 0} tasks</span>
                    <span>✅ {p.tasks?.filter(t => t.done).length || 0} completed</span>
                  </div>
                </div>
                
                                 <div className="plan-actions">
                   <button 
                     onClick={() => setCurrent(p)}
                     className={`plan-btn view-btn ${current && current._id === p._id ? 'viewing' : ''}`}
                   >
                     {current && current._id === p._id ? "👁️ Viewing" : "👁️ View"}
                   </button>
                   
                   <button 
                     onClick={() => deletePlan(p._id)}
                     className="plan-btn delete-plan-btn"
                     title="Delete this learning plan"
                   >
                     🗑️ Delete
                   </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Assistant Chat Bot */}
      <AIAssistant userId={user?._id} token={token} />
    </div>
  );
}
