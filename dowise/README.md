# DoWise - AI-Powered Learning Path Planner

A full-stack web application for creating personalized learning plans with AI assistance.

## 📁 Project Structure

```
dowise/
├── client/          # React frontend application
├── server/          # Express backend API
├── docs/            # Project documentation
└── scripts/         # Utility scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dowise
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Set up environment variables**

   Create `.env` file in `server/` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/dowise
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

   Create `.env` file in `client/` directory (optional):
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development servers**

   In separate terminals:
   ```bash
   # Terminal 1: Start backend server
   cd server
   npm run dev

   # Terminal 2: Start frontend client
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 Documentation

- [Environment Setup](docs/ENV_SETUP.md)
- [API Documentation](docs/API.md) (coming soon)

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs

## 📝 Scripts

- `npm start` - Start the backend server
- `npm run dev` - Start the backend server with nodemon
- `node scripts/seed.js` - Seed the database with initial data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

