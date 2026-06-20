import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config/env.js";

/**
 * Auth Service
 * Handles authentication logic including JWT generation
 */

/**
 * Generate JWT token for user
 * @param {string} userId - User's MongoDB ID
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: "30d", // Token valid for 30 days
  });
};

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {object} User and token
 */
export const register = async ({ email, password, name, role }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Validate role if provided
  const validRoles = ["student", "teacher"];
  const userRole = role && validRoles.includes(role) ? role : "student";

  // Create new user
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    name: name || "Explorer",
    role: userRole,
  });

  // Generate token
  const token = generateToken(user._id);

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} User and token
 */
export const login = async (email, password) => {
  // Find user by email (include password for comparison)
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user._id);

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Get user by ID
 * @param {string} userId - User's MongoDB ID
 * @returns {object} User object
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user.toJSON();
};

export default {
  generateToken,
  register,
  login,
  getUserById,
};
