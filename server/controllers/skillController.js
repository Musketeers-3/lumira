import SkillTracking from '../models/SkillTracking.js';

/**
 * Skill Controller
 * Handles skill tracking endpoints
 */

/**
 * @route GET /api/skills
 * @desc Get all user skills
 * @access Private
 */
export const getSkills = async (req, res, next) => {
  try {
    const skills = await SkillTracking.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route GET /api/skills/:skillName
 * @desc Get specific skill
 * @access Private
 */
export const getSkill = async (req, res, next) => {
  try {
    const { skillName } = req.params;

    const skill = await SkillTracking.findOne({
      userId: req.user._id,
      skillName
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route PUT /api/skills
 * @desc Update or create skill mastery
 * @access Private
 */
export const updateSkill = async (req, res, next) => {
  try {
    const {
      skillName,
      skillCategory,
      proficiencyLevel,
      masteryScore,
      status,
      insight,
      rarity
    } = req.body;

    if (!skillName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skillName'
      });
    }

    // Check if skill exists
    let skill = await SkillTracking.findOne({
      userId: req.user._id,
      skillName
    });

    if (skill) {
      // Update existing skill
      if (skillCategory) skill.skillCategory = skillCategory;
      if (proficiencyLevel !== undefined) skill.proficiencyLevel = proficiencyLevel;
      if (masteryScore !== undefined) skill.masteryScore = masteryScore;
      if (status) skill.status = status;
      if (insight) skill.insight = insight;
      if (rarity) skill.rarity = rarity;

      skill.lastPracticed = new Date();
      if (status === 'unlocked' && !skill.unlockedAt) {
        skill.unlockedAt = new Date();
      }

      await skill.save();
    } else {
      // Create new skill
      skill = await SkillTracking.create({
        userId: req.user._id,
        skillName,
        skillCategory: skillCategory || 'General',
        proficiencyLevel: proficiencyLevel || 0,
        masteryScore: masteryScore || 0,
        status: status || 'locked',
        insight,
        rarity: rarity || 'common',
        unlockedAt: status === 'unlocked' ? new Date() : null,
        timesPracticed: 1
      });
    }

    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route POST /api/skills
 * @desc Alternative route for updating skill (supports upsert)
 * @access Private
 */
export const upsertSkill = async (req, res, next) => {
  try {
    const {
      skillName,
      skillCategory,
      proficiencyLevel,
      masteryScore,
      status,
      insight,
      rarity
    } = req.body;

    if (!skillName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skillName'
      });
    }

    // Find and update or create
    const updateData = {
      skillName,
      skillCategory: skillCategory || 'General',
      proficiencyLevel: proficiencyLevel || 0,
      masteryScore: masteryScore || 0,
      status: status || 'locked',
      lastPracticed: new Date(),
      timesPracticed: 1
    };

    if (insight) updateData.insight = insight;
    if (rarity) updateData.rarity = rarity;
    if (status === 'unlocked') {
      updateData.unlockedAt = new Date();
    }

    const skill = await SkillTracking.findOneAndUpdate(
      { userId: req.user._id, skillName },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSkills,
  getSkill,
  updateSkill,
  upsertSkill
};