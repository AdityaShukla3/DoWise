// scripts/seed.js
// Database seeding script
// Run this script to seed the database with initial data

// Example usage:
// node scripts/seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../server/.env') });

// Import models
const Template = require('../server/models/Template');

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    // Seed templates
    const templates = [
      {
        name: 'Frontend',
        tasks: [
          { title: 'HTML Basics', days: 2, resource: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
          { title: 'CSS Fundamentals', days: 3, resource: 'https://web.dev/learn/css/' },
          { title: 'JavaScript Core', days: 7, resource: 'https://javascript.info/' },
        ],
      },
      {
        name: 'Backend',
        tasks: [
          { title: 'Node.js Basics', days: 4, resource: 'https://nodejs.org/en/docs' },
          { title: 'Express API', days: 3, resource: 'https://expressjs.com/' },
        ],
      },
    ];

    // Clear existing templates
    await Template.deleteMany({});
    console.log('🗑️  Cleared existing templates');

    // Insert new templates
    await Template.insertMany(templates);
    console.log('🌱 Seeded templates');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

