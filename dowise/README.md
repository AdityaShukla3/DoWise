# DoWise - AI-Powered Study Roadmap & Learning Path Planner

DoWise is a premium, modern full-stack web application designed to help users create, manage, and visualize personalized study paths with AI assistance. It features a vertical roadmap/timeline, progress tracker, interactive tasks, and responsive light/dark themes.

---

## 🚀 Key Features

* **AI-Powered Learning Assistant**: Request suggestions on topics and receive structured roadmap tasks, study durations, and curated resource links.
* **Interactive Vertical Study Timeline**: Visualize your learning path step-by-step with milestones, durations, study hours, and difficulty ratings.
* **Task Management**: Create, view, update, and complete tasks with animated progress bars.
* **JWT Authentication**: Secured sign-up and sign-in processes featuring OTP verification and password visibility reveal toggle. Note: Currently, JWTs are stored in `localStorage` for simplicity in this student project. For a production environment, it is highly recommended to store JWTs in secure, `httpOnly` cookies to mitigate XSS (Cross-Site Scripting) vulnerabilities.
* **GSAP Animation System**: Experience high-performance transitions, text reveals, error shakes, staggered list entry, and card hover effects.
* **Responsive Light/Dark Mode**: High-contrast user interface tailors the visual experience for late-night study sessions.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React 19, React Router, Axios
* **Animations**: GSAP (GreenSock Animation Platform)
* **Styling**: Vanilla CSS3 Custom Properties (CSS variables) for light/dark mode and responsive layouts

### Backend
* **Core**: Node.js, Express
* **Database**: MongoDB with Mongoose ODM
* **Security**: JSON Web Tokens (JWT) for session management, BcryptJS for password hashing

---

## 📁 Project Directory Structure

```
dowise/
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets
│   └── src/                    # Application Source Code
│       ├── components/         # Reusable widgets (AIAssistant, ResourcePlanner, etc.)
│       ├── context/            # AuthContext provider for sessions
│       ├── pages/              # Application pages (Dashboard, Login, Signup, Revision, History)
│       ├── services/           # Centralized API requests using Axios interceptors
│       └── utils/              # Animation utilities and custom GSAP hooks
├── server/                     # Express Backend API
│   ├── config/                 # Database and server config
│   ├── controllers/            # Controller layers for MVC pattern
│   ├── models/                 # Mongoose schemas (User, Plan, Template)
│   ├── routes/                 # API endpoint routing
│   └── tests/                  # Backend unit/route tests
├── docs/                       # Project Documentation
│   ├── API.md                  # Detailed API endpoints list
│   └── ENV_SETUP.md            # Environment setup guide
└── scripts/                    # Utility scripts
    └── seed.js                 # Database seeding script for default templates
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v14 or higher)
* **MongoDB** (local server running on `mongodb://localhost:27017` or MongoDB Atlas URI)
* **npm** (included with Node.js)

### Installation & Environment Configuration

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd dowise
   ```

2. **Install Root and Sub-Project Dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client && npm install

   # Install server dependencies
   cd ../server && npm install
   ```

3. **Set Up Server Environment Variables**
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/dowise
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Seed the Database**
   In the root directory, seed the database with initial study path templates:
   ```bash
   node scripts/seed.js
   ```

5. **Start the Development Servers**

   Option A (Separate Terminals):
   * **Terminal 1 (Backend)**: `cd server && npm run dev`
   * **Terminal 2 (Frontend)**: `cd client && npm start`

   Option B (Root Scripts):
   * Run `npm run server` in one window, and `npm run client` in another window.

6. **Access the App**
   * **Frontend Client**: [http://localhost:3000](http://localhost:3000)
   * **Backend Server**: [http://localhost:5000](http://localhost:5000)

---

## 📚 API Endpoints Summary

### Authentication Routes
* `POST /api/auth/signup` - Register a new user
* `POST /api/auth/login` - Sign in and receive a JWT

### Study Plan Routes
* `GET /api/plans` - Fetch all plans for the authenticated user
* `POST /api/plans` - Create a new personalized plan
* `PUT /api/plans/:id` - Update an existing plan

### AI Suggestions & Templates
* `POST /api/ai/suggest` - Ask the AI assistant for custom study roadmap recommendations
* `GET /api/templates` - Fetch standard predefined roadmap templates

---

## ✨ Animation System & UI Optimizations

### Interactive GSAP Animations
DoWise utilizes `gsap` for key user interactions located in `client/src/utils/animations.js`:
* **Typing reveal**: Logo and text animation.
* **Error shake**: Provides clear feedback on validation issues.
* **Staggered entries**: Task lists and plan cards fade in sequentially.
* **Progress counters**: Smoothly transitions progress percentage numbers.

### Premium Dark Mode Styling
The application supports a dark mode theme dynamically toggled via class updates on `body.dark`. 
* Overrides are implemented on badges, buttons, cards, and inputs.
* Badge contrast is optimized in [TechnologyResourcePlanner.css](file:///c:/Users/adity/.vscode/dowise/dowise/client/src/components/TechnologyResourcePlanner.css) (e.g. beginner, intermediate, and advanced badges utilize low-opacity dark backgrounds with high-contrast vibrant text tags to prevent text washout).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
