import axiosInstance from '../lib/axiosConfig';

// Use the configured axios instance
const api = axiosInstance;

// Save assessment
export const saveAssessment = async (assessmentData) => {
  try {
    console.log('Sending assessment data to server:', assessmentData);
    const response = await api.post('/assessments', assessmentData);
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

// Get student assessments
export const getStudentAssessments = async (studentId) => {
  try {
    console.log('Fetching student assessments for', studentId);
    const response = await api.get(`/assessments/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student assessments:', error);
    throw error;
  }
};

// Get batch assessments
export const getBatchAssessments = async (batchId) => {
  try {
    const response = await api.get(`/assessments/batch/${batchId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batch assessments:', error);
    throw error;
  }
};

// Update assessment
export const updateAssessment = async (assessmentId, assessmentData) => {
  try {
    const response = await api.put(`/assessments/${assessmentId}`, assessmentData);
    return response.data;
  } catch (error) {
    console.error('Error updating assessment:', error);
    throw error;
  }
};

// Delete assessment
export const deleteAssessment = async (assessmentId) => {
  try {
    const response = await api.delete(`/assessments/${assessmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting assessment:', error);
    throw error;
  }
}; 