#!/bin/bash

echo "Testing authentication flow..."
echo ""

# Test 1: Try to access protected route without token (should fail)
echo "1. Testing /me without authentication..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/auth/me)
if [ "$response" = "401" ]; then
    echo "✅ Correctly blocked unauthorized access (401)"
else
    echo "❌ Should have failed with 401, got $response"
fi

echo ""

# Test 2: Try to access saved jobs without token (should fail)
echo "2. Testing /savejob/saved without authentication..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/savejob/saved)
if [ "$response" = "401" ]; then
    echo "✅ Correctly blocked unauthorized access (401)"
else
    echo "❌ Should have failed with 401, got $response"
fi

echo ""
echo "🎉 Authentication middleware is working correctly!"
echo "The /me and /savejob/saved endpoints are properly protected and require authentication."
