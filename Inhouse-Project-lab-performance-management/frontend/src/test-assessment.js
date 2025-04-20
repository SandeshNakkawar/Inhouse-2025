const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Test teacher credentials
const TEST_TEACHER = {
  email: 'bob@example.com',
  password: 'teacher123'
};

// Test assessment data
const TEST_ASSESSMENT = {
  studentRollNo: '23101', // First student in SE-A batch
  experimentNo: 1,
  rppMarks: 4,
  spoMarks: 3,
  assignmentMarks: 8
};

// Simple token management
const setToken = (token) => {
  global.token = token;
};

const removeToken = () => {
  global.token = null;
};

async function testAssessmentAPI() {
  try {
    // Step 1: Login to get token
    console.log('Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, TEST_TEACHER);
    const { token } = loginResponse.data.data;
    
    if (!token) {
      throw new Error('No token received from login');
    }
    
    console.log('Login successful, token received');
    
    // Step 2: Store token
    setToken(token);
    console.log('Token stored');
    
    // Step 3: Create assessment
    console.log('Creating assessment...');
    const createResponse = await axios.post(`${API_URL}/assessments`, TEST_ASSESSMENT, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Assessment created:', createResponse.data);
    
    // Step 4: Get student assessments
    console.log('Fetching student assessments...');
    const studentAssessments = await axios.get(
      `${API_URL}/assessments/student/${TEST_ASSESSMENT.studentRollNo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('Student assessments:', studentAssessments.data);
    
    // Step 5: Get batch assessments
    console.log('Fetching batch assessments...');
    const batchAssessments = await axios.get(
      `${API_URL}/assessments/batch/1`, // Assuming batch ID 1 exists
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('Batch assessments:', batchAssessments.data);
    
    // Clean up
    removeToken();
    console.log('Test completed successfully');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    removeToken();
  }
}

// Run the test
testAssessmentAPI(); 