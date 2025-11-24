#!/bin/bash

# Base URL
BASE_URL="http://localhost:8000/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Login as admin to get token
echo "Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gmail.com", "password": "Spider@2580"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}Login failed!${NC}"
  echo $LOGIN_RESPONSE
  exit 1
fi

echo -e "${GREEN}Login successful! Token acquired.${NC}"

# 1. Test Menu Item Pagination
echo -e "\nTesting Menu Item Pagination (Page 1)..."
PAGE1_RESPONSE=$(curl -s -X GET "$BASE_URL/menu/items?page=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

TOTAL=$(echo $PAGE1_RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)
echo "Total Menu Items: $TOTAL"

if [ "$TOTAL" -gt 0 ]; then
    echo -e "${GREEN}Pagination test passed.${NC}"
else
    echo -e "${RED}Pagination test failed or no items found.${NC}"
fi

# 2. Test Menu Item Search
SEARCH_TERM="Pizza"
echo -e "\nTesting Menu Item Search (Term: '$SEARCH_TERM')..."
SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/menu/items?search=$SEARCH_TERM" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

SEARCH_COUNT=$(echo $SEARCH_RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)
echo "Found $SEARCH_COUNT items matching '$SEARCH_TERM'"

# 3. Test Menu Item Category Filter
# First get a category ID
CATEGORY_ID=$(curl -s -X GET "$BASE_URL/menu/categories" \
  -H "Authorization: Bearer $TOKEN" | grep -o '"id":[0-9]*' | head -n 1 | cut -d':' -f2)

if [ -n "$CATEGORY_ID" ]; then
    echo -e "\nTesting Category Filter (Category ID: $CATEGORY_ID)..."
    CAT_RESPONSE=$(curl -s -X GET "$BASE_URL/menu/items?category_id=$CATEGORY_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json")
    
    CAT_COUNT=$(echo $CAT_RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)
    echo "Found $CAT_COUNT items in category $CATEGORY_ID"
else
    echo -e "${RED}Could not fetch a category ID for testing.${NC}"
fi

# 4. Test Add-on Pagination & Search
echo -e "\nTesting Add-on Pagination & Search..."
ADDON_RESPONSE=$(curl -s -X GET "$BASE_URL/menu/add-ons?page=1&search=Cheese" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

ADDON_TOTAL=$(echo $ADDON_RESPONSE | grep -o '"total":[0-9]*' | cut -d':' -f2)
echo "Total Add-ons matching 'Cheese': $ADDON_TOTAL"

echo -e "\n${GREEN}Verification Complete!${NC}"
