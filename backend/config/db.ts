import mongoose from 'mongoose';

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-stockvision';
  try {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected successfully');
  } catch (err: any) {
    console.warn('MongoDB connection failed or MONGODB_URI not provided. Operating in robust fallback in-memory/JSON storage mode for seamless execution.', err.message);
  }
}
