import axiosInstance from '../lib/axiosConfig';
import { getCurrentUser } from '../lib/auth';

// Use the configured axios instance
const api = axiosInstance;

// Get current student's profile
export const getCurrentStudent = async () => {
  try {
    const response = await api.get('/students/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }
};

// Get student's batch details
export const getStudentBatch = async () => {
  try {
    const response = await api.get('/students/batch');
    console.log('Student batch response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching student batch:', error);
    throw error;
  }
};

// Get student's assessments
export const getStudentAssessments = async () => {
  try {
    const user = getCurrentUser();
    if (!user || !user.rollNumber) {
      throw new Error('Student roll number not found');
    }
    const response = await api.get(`/assessments/student/${user.rollNumber}`);
    console.log('Student assessments response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching student assessments:', error);
    throw error;
  }
};

// Get student's attendance
export const getStudentAttendance = async () => {
  try {
    const response = await api.get('/students/attendance');
    console.log('Student attendance response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    throw error;
  }
};

// Get student's performance summary
export const getStudentPerformance = async () => {
  try {
    const response = await api.get('/students/performance');
    console.log('Student performance response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching student performance:', error);
    throw error;
  }
}; 