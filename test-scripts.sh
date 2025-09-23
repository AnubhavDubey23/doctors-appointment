#!/bin/bash

# Doctor Appointment System - Automated Testing Script

echo "🧪 Starting Doctor Appointment System Tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:4000"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    
    echo -n "Testing: $description... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -o /dev/null -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi
    
    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAILED (Expected: $expected_status, Got: $response)${NC}"
        ((TESTS_FAILED++))
    fi
}

# Check if backend is running
echo "🔍 Checking if backend server is running..."
if curl -s "$BASE_URL/api/test" > /dev/null; then
    echo -e "${GREEN}✓ Backend server is running${NC}"
else
    echo -e "${RED}✗ Backend server is not running. Please start it first.${NC}"
    exit 1
fi

echo ""
echo "🔐 Testing Authentication Endpoints..."

# Test user registration
test_endpoint "POST" "/api/user/register" \
    '{"name":"Test User","email":"test@example.com","password":"password123"}' \
    200 "User Registration"

# Test user login
test_endpoint "POST" "/api/user/login" \
    '{"email":"test@example.com","password":"password123"}' \
    200 "User Login"

# Test doctor login
test_endpoint "POST" "/api/doctor/login" \
    '{"email":"doctor@example.com","password":"password123"}' \
    200 "Doctor Login"

# Test admin login
test_endpoint "POST" "/api/admin/login" \
    '{"email":"admin@prescripto.com","password":"admin123"}' \
    200 "Admin Login"

echo ""
echo "👨‍⚕️ Testing Doctor Endpoints..."

# Test get doctors list
test_endpoint "GET" "/api/doctor/list" "" 200 "Get Doctors List"

echo ""
echo "📅 Testing Appointment Endpoints..."

# Test book appointment (will fail without auth token, but tests endpoint exists)
test_endpoint "POST" "/api/user/book-appointment" \
    '{"docId":"test","slotDate":"2024-01-15","slotTime":"10:00 am"}' \
    401 "Book Appointment (No Auth)"

echo ""
echo "💬 Testing Chat Endpoints..."

# Test create chat (will fail without auth token)
test_endpoint "POST" "/api/chat/create" \
    '{"doctorId":"test"}' \
    401 "Create Chat (No Auth)"

echo ""
echo "🎥 Testing Video Call Endpoints..."

# Test create video call (will fail without auth token)
test_endpoint "POST" "/api/video/create" \
    '{"doctorId":"test","appointmentId":"test"}' \
    401 "Create Video Call (No Auth)"

echo ""
echo "📋 Testing Medical Records Endpoints..."

# Test get medical record (will fail without auth token)
test_endpoint "GET" "/api/medical/get-record" "" 401 "Get Medical Record (No Auth)"

echo ""
echo "⭐ Testing Review Endpoints..."

# Test create review (will fail without auth token)
test_endpoint "POST" "/api/review/create" \
    '{"doctorId":"test","appointmentId":"test","rating":5,"comment":"Great!"}' \
    401 "Create Review (No Auth)"

echo ""
echo "📊 Test Results Summary:"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check the output above for details.${NC}"
    exit 1
fi
