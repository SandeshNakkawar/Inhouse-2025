import axiosInstance from '../lib/axiosConfig';

// Use the configured axios instance
const api = axiosInstance;

// Get all subjects
export const getSubjects = async () => {
  try {
    const response = await api.get('/admin/subjects');
    return response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
};

// Get a specific subject by ID
export const getSubjectById = async (id) => {
  try {
    const response = await api.get(`/admin/subjects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subject:', error);
    throw error;
  }
};

// Create a new subject
export const createSubject = async (subjectData) => {
  try {
    const response = await api.post('/admin/subjects', subjectData);
    return response.data;
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

// Update a subject
export const updateSubject = async (id, subjectData) => {
  try {
    const response = await api.put(`/admin/subjects/${id}`, subjectData);
    return response.data;
  } catch (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
};

// Delete a subject
export const deleteSubject = async (id) => {
  try {
    const response = await api.delete(`/admin/subjects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
}; 