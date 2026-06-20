import { register, login, getUserById } from "../services/authService.js";

/**
 * Auth Controller
 * Handles authentication endpoints
 */

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const { user, token } = await register({ email, password, name, role });

    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const { user, token } = await login(email, password);

    res.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  registerUser,
  loginUser,
  getMe,
};
