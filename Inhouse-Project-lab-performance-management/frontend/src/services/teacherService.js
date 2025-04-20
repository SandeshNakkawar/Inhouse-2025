import axiosInstance from '../lib/axiosConfig';

// Use the configured axios instance
const api = axiosInstance;

// Get current teacher's profile
export const getCurrentTeacher = async () => {
  try {
    const response = await api.get('/teachers/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    throw error;
  }
};

// Get current teacher's batches
export const getCurrentTeacherBatches = async () => {
  try {
    console.log('🔍 Fetching current teacher batches...');
    const token = localStorage.getItem('token');
    console.log('🔑 Token available:', !!token);
    
    // Fetch the teacher's batches directly from the /batches endpoint
    const response = await api.get('/teachers/batches');
    console.log('📦 Raw response:', response);
    console.log('📦 Response data:', response.data);
    console.log('📦 Response data type:', typeof response.data);
    console.log('📦 Is response.data array?', Array.isArray(response.data));

    // The response data is already in the correct format
    const batches = Array.isArray(response.data) ? response.data : [];
    
    console.log('✅ Final processed batches:', batches);
    console.log('✅ Final batches length:', batches.length);
    console.log('✅ Final batches type:', typeof batches);
    console.log('✅ Final batches isArray:', Array.isArray(batches));

    return batches;
  } catch (error) {
    console.error('❌ Error fetching teacher batches:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return []; // Always return an empty array on error
  }
};

// Get batch details for current teacher
export const getBatchDetails = async (batchId) => {
  try {
    console.log(`🔍 Fetching batch details for ID: ${batchId}`);
    const response = await api.get(`/teachers/batches/${batchId}`);
    console.log('📦 Raw response:', response);
    console.log('📦 Response data:', response.data);

    if (!response.data || !response.data.batch) {
      throw new Error('Invalid batch data received');
    }

    return {
      batch: response.data.batch,
      students: response.data.students || []
    };
  } catch (error) {
    console.error('❌ Error fetching batch details:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Get all teachers
export const getAllTeachers = async () => {
  try {
    console.log('Fetching all teachers from:', `${API_URL}/teachers`);
    const response = await api.get('/teachers');
    console.log('Teachers fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

// Get a specific teacher by ID
export const getTeacherById = async (id) => {
  try {
    console.log(`Fetching teacher with ID: ${id} from:`, `${API_URL}/teachers/${id}`);
    const response = await api.get(`/teachers/${id}`);
    console.log('Teacher fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }
};

// Get teachers by department
export const getTeachersByDepartment = async (department) => {
  try {
    console.log(`Fetching teachers in department: ${department} from:`, `${API_URL}/teachers?department=${department}`);
    const response = await api.get(`/teachers?department=${department}`);
    console.log('Teachers fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers by department:', error);
    throw error;
  }
};

// Create a new teacher
export const createTeacher = async (teacherData) => {
  try {
    console.log('Creating teacher with data:', teacherData);
    const response = await api.post('/teachers', teacherData);
    console.log('Teacher created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }
};

// Update a teacher
export const updateTeacher = async (id, teacherData) => {
  try {
    console.log(`Updating teacher with ID: ${id} with data:`, teacherData);
    const response = await api.put(`/teachers/${id}`, teacherData);
    console.log('Teacher updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }
};

// Delete a teacher
export const deleteTeacher = async (id) => {
  try {
    console.log(`Deleting teacher with ID: ${id}`);
    const response = await api.delete(`/teachers/${id}`);
    console.log('Teacher deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
}; 