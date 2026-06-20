import dotenv from "dotenv";

/**
 * Load and validate environment variables
 * Ensures required configuration is present
 */

dotenv.config();

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

const optionalEnvVars = ["PORT", "OLLAMA_BASE_URL", "OLLAMA_MODEL", "FRONTEND_URL"];

export const config = {
  // Required
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,

  // Optional with defaults
  port: parseInt(process.env.PORT || "5002", 10),
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  ollamaModel: process.env.OLLAMA_MODEL || "qwen2:1.5b",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  // Environment
  isDevelopment: process.env.NODE_ENV !== "production",
  isProduction: process.env.NODE_ENV === "production",
};

/**
 * Validate required environment variables
 * @throws {Error} If required variables are missing
 */
export const validateEnv = () => {
  const missing = requiredEnvVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return true;
};

export default config;
