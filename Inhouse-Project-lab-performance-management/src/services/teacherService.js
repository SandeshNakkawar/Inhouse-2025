import axios from 'axios';

// Configure axios with auth token and timeout
const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Configure axios with auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error (no response):', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get current teacher's profile
export const getCurrentTeacher = async () => {
  try {
    console.log('Fetching current teacher profile from:', `${API_URL}/teachers/me`);
    const response = await axiosInstance.get(`${API_URL}/teachers/me`);
    console.log('Current teacher profile fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching current teacher profile:', error);
    throw error;
  }
};

// Get current teacher's batches
export const getCurrentTeacherBatches = async () => {
  try {
    console.log('Fetching current teacher batches from:', `${API_URL}/teachers/me/batches`);
    const response = await axiosInstance.get(`${API_URL}/teachers/me/batches`);
    console.log('Current teacher batches fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching current teacher batches:', error);
    throw error;
  }
};

// Get batch details for current teacher
export const getBatchDetails = async (batchId) => {
  try {
    console.log(`Fetching batch details for ID: ${batchId} from:`, `${API_URL}/teachers/batches/${batchId}`);
    const response = await axiosInstance.get(`${API_URL}/teachers/batches/${batchId}`);
    console.log('Batch details fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching batch details:', error);
    throw error;
  }
}; 