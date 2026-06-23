import express from "express";
import cors from "cors";
import { config, validateEnv } from "./config/env.js";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

/**
 * Lumira Backend Server
 * MERN architecture - Express + MongoDB backend
 */

const app = express();

/**
 * Middleware
 */

// CORS - allow frontend (use array for multiple origins or allow all in dev)
app.use(
  cors({
    origin: config.isDevelopment
      ? ["http://localhost:5173", "http://localhost:8081", "http://localhost:8080"]
      : config.frontendUrl,
    credentials: true,
  }),
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Validate environment on startup
 */
try {
  validateEnv();
  console.log("✓ Environment variables validated");
} catch (error) {
  console.error("✗ Environment validation failed:", error.message);
  process.exit(1);
}

/**
 * Connect to MongoDB
 */
connectDB();

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/teacher", teacherRoutes);

/**
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Lumira API is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Error handling
 */
app.use(notFound);
app.use(errorHandler);

/**
 * Start server
 */
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🧙 Lumira API Server                           ║
║   Running on port ${PORT}                          ║
║   Environment: ${config.isDevelopment ? "development" : "production"}                  ║
║                                                   ║
║   Endpoints:                                      ║
║   • POST /api/auth/register                      ║
║   • POST /api/auth/login                         ║
║   • GET  /api/auth/me                            ║
║   • POST /api/sessions                           ║
║   • GET  /api/skills                             ║
║   • POST /api/ai/socratic                        ║
║   • POST /api/lessons                            ║
║   • POST /api/classes/create                    ║
║   • GET  /api/classes/my-classes                 ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

export default app;
