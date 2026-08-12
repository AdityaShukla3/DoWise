# 🚀 AI-Powered Technology Resource Planner

## Overview

DoWise has been transformed into an **AI-Powered Technology Resource Planner** that helps users discover the best learning resources and time estimates for any technology field.

## Key Features

### 1. **Technology Resource Search**
- Enter any technology (React, Node.js, Python, AWS, Docker, etc.)
- AI searches and curates the best learning resources
- Provides time estimates for each resource
- Shows total learning time

### 2. **Resource Types**
- **Documentation**: Official docs and references
- **Courses**: Online courses (Udemy, Coursera, etc.)
- **Tutorials**: Step-by-step guides
- **Books**: Recommended reading materials
- **Videos**: Video tutorials and courses

### 3. **Time Estimation**
- Individual resource time estimates (e.g., "2-3 weeks")
- Total learning time for the technology
- Estimated completion date
- Days calculation for planning

### 4. **Technology Detection**
- Intelligent technology detection from user input
- Supports 15+ popular technologies with curated resources
- Fallback to AI-generated resources for unknown technologies
- Auto-suggestions from available technologies

## Supported Technologies

### Frontend
- React
- Vue.js
- Angular

### Backend
- Node.js
- Express.js
- Python
- Django

### Databases
- MongoDB
- PostgreSQL

### Cloud & DevOps
- AWS
- Docker
- Kubernetes

### AI & Machine Learning
- Machine Learning
- TensorFlow

### Mobile
- React Native
- Flutter

## API Endpoints

### Search Resources
```
POST /api/resources/search
Body: { "technology": "React" }
Response: {
  "technology": "React",
  "resources": [...],
  "totalTime": "2-3 months",
  "totalDays": 75,
  "difficulty": "Intermediate",
  "prerequisites": ["JavaScript", "HTML", "CSS"],
  "estimatedCompletion": "2024-03-15T00:00:00.000Z",
  "source": "curated"
}
```

### Get Available Technologies
```
GET /api/resources/technologies
Response: {
  "technologies": [
    { "key": "react", "name": "React", "difficulty": "Intermediate", "totalTime": "2-3 months" },
    ...
  ]
}
```

## Usage

### In the Dashboard

1. **Search Technology**
   - Enter a technology name in the search box
   - Click "🔍 Search Resources"
   - View curated resources with time estimates

2. **View Resources**
   - See all available learning resources
   - Check time estimates for each resource
   - View prerequisites if any
   - See total learning time

3. **Create Learning Plan**
   - Click "📋 Create Learning Plan"
   - Resources are automatically converted to tasks
   - Plan is added to your learning plans

### Example Workflow

1. User enters: **"React"**
2. System searches and finds:
   - React Official Documentation (2-3 weeks)
   - React Tutorial - freeCodeCamp (1-2 weeks)
   - React Complete Guide Course (4-6 weeks)
   - React Patterns (1 week)
3. Shows total time: **2-3 months**
4. User clicks "Create Learning Plan"
5. Plan is created with all resources as tasks

## AI Integration

### With OpenAI (Optional)
- Set `USE_OPENAI=true` in server `.env`
- Add `OPENAI_API_KEY=your_key`
- AI generates resources for unknown technologies
- More accurate time estimates
- Better resource curation

### Without OpenAI (Fallback)
- Uses curated resource database
- Intelligent technology detection
- Fallback resource generation
- Works offline

## Resource Structure

Each resource includes:
- **Title**: Resource name
- **URL**: Direct link to resource
- **Type**: documentation, course, tutorial, book, video
- **Time**: Estimated learning time (e.g., "2-3 weeks")

## Time Estimation

Time estimates are calculated based on:
- Resource type (documentation vs. course)
- Technology complexity
- Typical learning pace
- Prerequisites required

Total time includes:
- All resources combined
- Practice and project time
- Review and reinforcement

## Future Enhancements

- [ ] Integration with real-time resource APIs
- [ ] User reviews and ratings for resources
- [ ] Personalized learning paths based on skill level
- [ ] Progress tracking for each resource
- [ ] Resource recommendations based on learning history
- [ ] Community-contributed resources
- [ ] Resource quality scoring
- [ ] Learning path optimization

## Notes

- Resources are curated from reliable sources
- Time estimates are approximate and may vary by individual
- Prerequisites help ensure proper learning sequence
- All resources open in new tabs for easy access
- Plans can be customized after creation

