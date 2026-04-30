const mongoose = require('mongoose');

async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('MONGODB_URI not set. Running with in-memory seed data only.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.warn('MongoDB connection failed, continuing with fallback data:', error.message);
  }
}

module.exports = connectMongo;
