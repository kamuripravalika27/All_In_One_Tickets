const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/onetrip';
    
    // Attempt standard connection with 3s timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected to MongoDB at: ${mongoUri}`);
  } catch (error) {
    console.warn(`[Database] Local MongoDB connection failed (${error.message}). Initializing In-Memory MongoDB Server...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected successfully to In-Memory MongoDB at: ${inMemoryUri}`);
    } catch (memError) {
      console.error(`[Database] Critical Error initializing In-Memory MongoDB:`, memError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
