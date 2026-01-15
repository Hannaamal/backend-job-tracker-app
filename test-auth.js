const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuthFlow() {
  console.log('Testing authentication flow...\n');

  try {
    // Test 1: Try to access protected route without token (should fail)
    console.log('1. Testing /me without authentication...');
    try {
      await axios.get(`${BASE_URL}/auth/me`);
      console.log('❌ Should have failed - unauthorized access allowed');
    } catch (error) {
      console.log('✅ Correctly blocked unauthorized access:', error.response?.status);
    }

    // Test 2: Try to access saved jobs without token (should fail)
    console.log('\n2. Testing /savejob/saved without authentication...');
    try {
      await axios.get(`${BASE_URL}/savejob/saved`);
      console.log('❌ Should have failed - unauthorized access allowed');
    } catch (error) {
      console.log('✅ Correctly blocked unauthorized access:', error.response?.status);
    }

    // Test 3: Login to get token
    console.log('\n3. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token received');

    // Test 4: Access /me with valid token
    console.log('\n4. Testing /me with valid token...');
    const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ /me endpoint working:', meResponse.data.user.name);

    // Test 5: Access saved jobs with valid token
    console.log('\n5. Testing /savejob/saved with valid token...');
    const savedJobsResponse = await axios.get(`${BASE_URL}/savejob/saved`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Saved jobs endpoint working:', savedJobsResponse.data.length, 'jobs');

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAuthFlow();
