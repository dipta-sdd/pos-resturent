#!/bin/bash

# Configuration
BASE_URL="http://localhost:8000/api"
EMAIL="admin@gmail.com"
PASSWORD="Spider@2580"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}Login failed!${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "Login successful! Token acquired."

# Test All Items Endpoint
echo -e "\nTesting All Items Endpoint (/menu/items/all)..."
ALL_ITEMS_RESPONSE=$(curl -s -X GET "$BASE_URL/menu/items/all" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

# Check if response is an array (starts with [)
if [[ $ALL_ITEMS_RESPONSE == [* ]]; then
    ITEM_COUNT=$(echo $ALL_ITEMS_RESPONSE | grep -o '"id":' | wc -l)
    echo "Response is an array. Found $ITEM_COUNT items."
    echo -e "${GREEN}All Items endpoint test passed.${NC}"
else
    echo -e "${RED}All Items endpoint test failed. Response is not an array.${NC}"
    echo "Response preview: ${ALL_ITEMS_RESPONSE:0:100}..."
fi
