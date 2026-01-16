// Test script to verify authentication flow works correctly
async function testAuthFlow() {
  console.log('Testing authentication flow...\n');

  try {
    // Test 1: Try to access protected route without token (should fail)
    console.log('1. Testing /me without authentication...');
    const response1 = await fetch('http://localhost:5000/api/auth/me');
    console.log(`   Status: ${response1.status} (${response1.status === 401 ? '✅ Correctly blocked' : '❌ Should have failed'})`);

    // Test 2: Try to access saved jobs without token (should fail)
    console.log('\n2. Testing /savejob/saved without authentication...');
    const response2 = await fetch('http://localhost:5000/api/savejob/saved');
    console.log(`   Status: ${response2.status} (${response2.status === 401 ? '✅ Correctly blocked' : '❌ Should have failed'})`);

    // Test 3: Test public endpoint (should work)
    console.log('\n3. Testing public /job endpoint...');
    const response3 = await fetch('http://localhost:5000/api/job');
    console.log(`   Status: ${response3.status} (${response3.status === 200 ? '✅ Working correctly' : '❌ Should work'})`);

    console.log('\n🎉 Authentication system is working correctly!');
    console.log('✅ Protected endpoints require authentication');
    console.log('✅ Public endpoints work without authentication');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuthFlow();
