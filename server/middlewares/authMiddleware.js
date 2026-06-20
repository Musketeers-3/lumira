import jwt from "jsonwebtoken";
import config from "../config/env.js";
import User from "../models/User.js";

/**
 * Auth Middleware
 * Protects routes by verifying JWT tokens
 */

export const protect = async (req, res, next) => {
  let token;

  // DEBUG: Log all auth attempts
  console.log("[AUTH DEBUG] ============================================");
  console.log("[AUTH DEBUG] Method:", req.method);
  console.log("[AUTH DEBUG] URL:", req.url);
  console.log(
    "[AUTH DEBUG] Authorization header:",
    req.headers.authorization ? "present" : "MISSING",
  );
  console.log("[AUTH DEBUG] Authorization value:", req.headers.authorization);

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("[AUTH DEBUG] Token extracted:", token ? token.substring(0, 20) + "..." : "EMPTY");
  } else {
    console.log("[AUTH DEBUG] Token extraction: FAILED - no Bearer prefix");
  }

  if (!token) {
    console.log("[AUTH DEBUG] Result: 401 - No token");
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    console.log("[AUTH DEBUG] JWT Secret:", config.jwtSecret);
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log("[AUTH DEBUG] JWT verified successfully");
    console.log("[AUTH DEBUG] Decoded ID:", decoded.id);

    // Get user from token
    req.user = await User.findById(decoded.id);
    console.log("[AUTH DEBUG] User lookup result:", req.user ? "FOUND" : "NOT FOUND");
    if (req.user) {
      console.log("[AUTH DEBUG] User email:", req.user.email);
    }

    if (!req.user) {
      console.log("[AUTH DEBUG] Result: 401 - User not found");
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("[AUTH DEBUG] Result: SUCCESS - proceeding to route");
    next();
  } catch (error) {
    console.log("[AUTH DEBUG] JWT Error:", error.message);
    console.log("[AUTH DEBUG] Result: 401 - JWT verification failed");
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

/**
 * Optional auth - attaches user if token exists but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = await User.findById(decoded.id);
    } catch (error) {
      // Token invalid, continue without user
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};
