import axiosInstance from '../lib/axiosConfig';

// Use the configured axios instance
const api = axiosInstance;

// Get all teachers (admin only)
export const getAllTeachers = async () => {
  try {
    const response = await api.get('/admin/teachers');
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

// Get a specific teacher by ID (admin only)
export const getTeacherById = async (id) => {
  try {
    const response = await api.get(`/admin/teachers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }
};

// Create a new teacher (admin only)
export const createTeacher = async (teacherData) => {
  try {
    const response = await api.post('/admin/teachers', teacherData);
    return response.data;
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }
};

// Update a teacher (admin only)
export const updateTeacher = async (id, teacherData) => {
  try {
    const response = await api.put(`/admin/teachers/${id}`, teacherData);
    return response.data;
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }
};

// Delete a teacher (admin only)
export const deleteTeacher = async (id) => {
  try {
    const response = await api.delete(`/admin/teachers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};

// Get all teacher allocations
export const getTeacherAllocations = async () => {
  try {
    const response = await api.get('/admin/allocations');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher allocations:', error);
    throw error;
  }
};

// Create a new teacher allocation
export const createTeacherAllocation = async (allocationData) => {
  try {
    const response = await api.post('/admin/allocations', allocationData);
    return response.data;
  } catch (error) {
    console.error('Error creating teacher allocation:', error);
    throw error;
  }
};

// Update a teacher allocation
export const updateTeacherAllocation = async (id, allocationData) => {
  try {
    const response = await api.put(`/admin/allocations/${id}`, allocationData);
    return response.data;
  } catch (error) {
    console.error('Error updating teacher allocation:', error);
    throw error;
  }
};

// Delete a teacher allocation
export const deleteTeacherAllocation = async (id) => {
  try {
    const response = await api.delete(`/admin/allocations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting teacher allocation:', error);
    throw error;
  }
};

// Get all teachers
export const getTeachers = async () => {
  try {
    const response = await api.get('/admin/teachers');
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

// Get all students
export const getAllStudents = async () => {
  try {
    const response = await api.get('/admin/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

// Delete a student
export const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// Upload students CSV
export const uploadStudentsCSV = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/admin/upload/students', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading students data:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}; 