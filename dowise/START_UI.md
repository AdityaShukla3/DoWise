# 🚀 How to View the DoWise UI

## Quick Start

To see the beautiful UI we've created, you need to start both the backend server and frontend client.

### Option 1: Start Both Servers (Recommended)

Open **two separate terminal windows**:

#### Terminal 1 - Backend Server:
```bash
cd dowise/server
npm install  # if not already installed
npm run dev
```
Server will run on: **http://localhost:5000**

#### Terminal 2 - Frontend Client:
```bash
cd dowise/client
npm install  # if not already installed
npm start
```
Client will automatically open: **http://localhost:3000**

### Option 2: Using Root Scripts

From the `dowise` root directory:

```bash
# Terminal 1
npm run server

# Terminal 2  
npm run client
```

## What You'll See

### 🎨 **Login Page** (`/login`)
- Beautiful gradient background (purple/blue)
- Smooth GSAP animations:
  - Card scale-in animation
  - Logo text reveal
  - Form fade-in
  - Error shake animation
- Modern form design with focus states

### ✨ **Signup Page** (`/signup`)
- Pink/red gradient background
- Same smooth animations as login
- Clean, modern form layout

### 📊 **Dashboard** (`/`)
- Welcome header with personalized greeting
- AI-powered learning assistant section
- Plan cards with:
  - Hover animations
  - Progress bars with smooth animations
  - Staggered entrance animations
- Task management with:
  - Staggered list animations
  - Interactive task cards
  - Animated progress tracking
- Modern card-based layout
- Smooth GSAP transitions throughout

### 🎯 **Navigation Bar**
- Sticky header with backdrop blur
- Gradient logo
- Smooth fade-in animations
- User greeting

## Features to Try

1. **Hover Effects**: Hover over cards and buttons to see smooth animations
2. **Form Interactions**: Type in forms to see focus states
3. **Error Handling**: Submit invalid forms to see shake animations
4. **Progress Bars**: Watch them animate smoothly
5. **Staggered Animations**: Notice how elements appear one after another

## Troubleshooting

### Server won't start?
- Make sure MongoDB is running
- Check if `.env` file exists in `server/` directory
- Ensure port 5000 is not in use

### Client won't start?
- Check if port 3000 is available
- Make sure all dependencies are installed (`npm install` in client folder)
- Check for any console errors

### No animations?
- Make sure GSAP is installed: `npm install gsap` in client folder
- Check browser console for errors
- Try refreshing the page

## Environment Setup

If you haven't set up the server `.env` file:

1. Create `dowise/server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/dowise
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

2. Make sure MongoDB is running locally or update `MONGO_URI` to your MongoDB connection string.

## Enjoy the UI! 🎉

The frontend features:
- ✅ Modern design system
- ✅ Smooth GSAP animations
- ✅ Responsive layout
- ✅ Beautiful gradients
- ✅ Interactive hover effects
- ✅ Professional typography
- ✅ Loading states
- ✅ Error handling with animations

