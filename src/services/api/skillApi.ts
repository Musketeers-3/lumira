import apiClient from './apiClient';

/**
 * Skill API
 * Skill tracking endpoints
 */

export interface SkillTracking {
  _id: string;
  userId: string;
  skillName: string;
  skillCategory: string;
  proficiencyLevel: number;
  masteryScore: number;
  lastPracticed: string;
  timesPracticed: number;
  unlockedAt?: string;
  insight?: string;
  status: 'unlocked' | 'in-progress' | 'locked';
  rarity: 'common' | 'rare' | 'legendary';
  createdAt: string;
  updatedAt: string;
}

export interface UpsertSkillData {
  skillName: string;
  skillCategory?: string;
  proficiencyLevel?: number;
  masteryScore?: number;
  status?: 'unlocked' | 'in-progress' | 'locked';
  insight?: string;
  rarity?: 'common' | 'rare' | 'legendary';
}

export interface UpdateSkillData {
  proficiencyLevel?: number;
  masteryScore?: number;
  status?: 'unlocked' | 'in-progress' | 'locked';
  insight?: string;
}

/**
 * Get all user skills
 */
export const getSkills = async (): Promise<SkillTracking[]> => {
  const response = await apiClient.get<{ success: boolean; data: SkillTracking[] }>('/skills');
  return response.data.data;
};

/**
 * Get specific skill by name
 */
export const getSkill = async (skillName: string): Promise<SkillTracking | null> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: SkillTracking }>(
      `/skills/${encodeURIComponent(skillName)}`
    );
    return response.data.data;
  } catch {
    return null;
  }
};

/**
 * Update skill mastery (partial update)
 */
export const updateSkill = async (
  skillName: string,
  data: UpdateSkillData
): Promise<SkillTracking> => {
  const response = await apiClient.put<{ success: boolean; data: SkillTracking }>(
    `/skills`,
    { skillName, ...data }
  );
  return response.data.data;
};

/**
 * Upsert skill (create or update)
 */
export const upsertSkill = async (data: UpsertSkillData): Promise<SkillTracking> => {
  const response = await apiClient.post<{ success: boolean; data: SkillTracking }>(
    '/skills',
    data
  );
  return response.data.data;
};

export default {
  getSkills,
  getSkill,
  updateSkill,
  upsertSkill
};