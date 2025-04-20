import api from '../lib/axiosConfig';

// Get all batches
export const getBatches = async () => {
  try {
    const response = await api.get('/admin/batches');
    return response.data;
  } catch (error) {
    console.error('Error fetching batches:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch batches');
  }
};

// Get a specific batch by ID
export const getBatchById = async (id) => {
  try {
    const response = await api.get(`/admin/batches/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batch:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch batch');
  }
};

// Create a new batch
export const createBatch = async (batchData) => {
  try {
    const response = await api.post('/admin/batches', batchData);
    return response.data;
  } catch (error) {
    console.error('Error creating batch:', error);
    throw new Error(error.response?.data?.message || 'Failed to create batch');
  }
};

// Update a batch
export const updateBatch = async (id, batchData) => {
  try {
    const response = await api.put(`/admin/batches/${id}`, batchData);
    return response.data;
  } catch (error) {
    console.error('Error updating batch:', error);
    throw new Error(error.response?.data?.message || 'Failed to update batch');
  }
};

// Delete a batch
export const deleteBatch = async (id) => {
  try {
    const response = await api.delete(`/admin/batches/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting batch:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete batch');
  }
};

// Get teacher's batches
export const getBatchesByTeacher = async (teacherId) => {
  try {
    const response = await api.get(`/admin/batches/teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher batches:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch teacher batches');
  }
};

// Get batch details
export const getBatchDetails = async (batchId) => {
  try {
    const response = await api.get(`/teachers/batches/${batchId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batch details:', error);
    throw error;
  }
};

// Get batch students
export const getBatchStudents = async (batchId) => {
  try {
    const response = await api.get(`/batches/${batchId}/students`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batch students:', error);
    throw error;
  }
};

// Get batch assignments
export const getBatchAssignments = async (batchId) => {
  try {
    const response = await api.get(`/batches/${batchId}/assignments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batch assignments:', error);
    throw error;
  }
};

// Get batch attendance
export const getBatchAttendance = async (batchId) => {
  try {
    const response = await api.get(`/batches/${batchId}/attendance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching batch attendance:', error);
    throw error;
  }
}; 