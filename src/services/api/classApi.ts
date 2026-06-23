import apiClient from "./apiClient";

/**
 * Class API
 * Class management endpoints
 */

export interface ClassData {
  _id: string;
  className: string;
  classCode: string;
  description?: string;
  teacherId: string;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassData {
  className: string;
  description?: string;
}

export interface UpdateClassData {
  className?: string;
  description?: string;
}

export interface JoinClassData {
  classCode: string;
}

export interface EnrolledClassData {
  _id: string;
  className: string;
  classCode: string;
  description?: string;
  teacherName: string;
  studentCount: number;
  joinedAt: string;
}

export interface ClassStudentData {
  _id: string;
  studentId: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}

/**
 * Lesson Assignment Types
 */
export interface AssignedLessonData {
  _id: string;
  lessonId: string;
  title: string;
  description?: string;
  topic?: string;
  realm?: string;
  difficulty?: string;
  estimatedDuration?: number;
  isPublished: boolean;
  assignedAt: string;
  dueDate?: string;
  isActive: boolean;
}

export interface AssignLessonData {
  lessonId: string;
  dueDate?: string;
}

/**
 * Create a new class
 */
export const createClass = async (data: CreateClassData): Promise<ClassData> => {
  const response = await apiClient.post<{ success: boolean; data: ClassData }>(
    "/classes/create",
    data,
  );
  return response.data.data;
};

/**
 * Get all classes for the current teacher
 */
export const getMyClasses = async (): Promise<ClassData[]> => {
  const response = await apiClient.get<{ success: boolean; data: ClassData[] }>(
    "/classes/my-classes",
  );
  return response.data.data;
};

/**
 * Get a single class by ID
 */
export const getClassById = async (classId: string): Promise<ClassData> => {
  const response = await apiClient.get<{ success: boolean; data: ClassData }>(
    `/classes/${classId}`,
  );
  return response.data.data;
};

/**
 * Update a class
 */
export const updateClass = async (classId: string, data: UpdateClassData): Promise<ClassData> => {
  const response = await apiClient.put<{ success: boolean; data: ClassData }>(
    `/classes/${classId}`,
    data,
  );
  return response.data.data;
};

/**
 * Delete a class
 */
export const deleteClass = async (classId: string): Promise<boolean> => {
  const response = await apiClient.delete<{ success: boolean }>(`/classes/${classId}`);
  return response.data.success;
};

/**
 * Join a class using class code
 */
export const joinClass = async (
  data: JoinClassData,
): Promise<{
  className: string;
  classCode: string;
  teacherName: string;
}> => {
  const response = await apiClient.post<{
    success: boolean;
    data: { className: string; classCode: string; teacherName: string };
  }>("/classes/join", data);
  return response.data.data;
};

/**
 * Get all classes the current student is enrolled in
 */
export const getEnrolledClasses = async (): Promise<EnrolledClassData[]> => {
  const response = await apiClient.get<{ success: boolean; data: EnrolledClassData[] }>(
    "/classes/enrolled",
  );
  return response.data.data;
};

/**
 * Get enrolled students for a class (teacher only)
 */
export const getClassStudents = async (classId: string): Promise<ClassStudentData[]> => {
  const response = await apiClient.get<{ success: boolean; data: ClassStudentData[] }>(
    `/classes/${classId}/students`,
  );
  return response.data.data;
};

/**
 * Assign a lesson to a class
 */
export const assignLessonToClass = async (
  classId: string,
  data: AssignLessonData,
): Promise<AssignedLessonData> => {
  const response = await apiClient.post<{ success: boolean; data: AssignedLessonData }>(
    `/classes/${classId}/lessons`,
    data,
  );
  return response.data.data;
};

/**
 * Get lessons assigned to a class
 */
export const getClassLessons = async (classId: string): Promise<AssignedLessonData[]> => {
  const response = await apiClient.get<{ success: boolean; data: AssignedLessonData[] }>(
    `/classes/${classId}/lessons`,
  );
  return response.data.data;
};

/**
 * Remove lesson assignment from a class
 */
export const removeLessonFromClass = async (
  classId: string,
  lessonId: string,
): Promise<boolean> => {
  const response = await apiClient.delete<{ success: boolean }>(
    `/classes/${classId}/lessons/${lessonId}`,
  );
  return response.data.success;
};

export default {
  createClass,
  getMyClasses,
  getClassById,
  updateClass,
  deleteClass,
  joinClass,
  getEnrolledClasses,
  getClassStudents,
  assignLessonToClass,
  getClassLessons,
  removeLessonFromClass,
};
