import express from "express";
import { getSkills, getSkill, updateSkill, upsertSkill } from "../controllers/skillController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Skill Routes
 * /api/skills
 */

/**
 * @route GET /api/skills
 * @desc Get all user skills
 * @access Private
 */
router.get("/", protect, getSkills);

/**
 * @route GET /api/skills/:skillName
 * @desc Get specific skill
 * @access Private
 */
router.get("/:skillName", protect, getSkill);

/**
 * @route PUT /api/skills
 * @desc Update skill mastery
 * @access Private
 */
router.put("/", protect, updateSkill);

/**
 * @route POST /api/skills
 * @desc Upsert skill (create or update)
 * @access Private
 */
router.post("/", protect, upsertSkill);

export default router;
