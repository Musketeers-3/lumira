import mongoose from "mongoose";

/**
 * MongoDB Database Connection
 * Handles connection to MongoDB with proper error handling
 */

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // In development, continue without database but log warning
    if (process.env.NODE_ENV === "development") {
      console.warn("Running without database connection - some features may not work");
      return null;
    }
    process.exit(1);
  }
};

export default connectDB;
