#!/bin/bash

# Base URL
BASE_URL="http://localhost:8000/api"

# Login
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"Spider@2580"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed. Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "Login successful. Token: $TOKEN"

# Get Categories (needed for creating item)
echo "Fetching categories..."
CATEGORIES_RESPONSE=$(curl -s -X GET $BASE_URL/menu/categories \
  -H "Authorization: Bearer $TOKEN")
echo "Categories Response: $CATEGORIES_RESPONSE"
CATEGORY_ID=$(echo $CATEGORIES_RESPONSE | grep -o '"id":[0-9]*' | head -n 1 | cut -d':' -f2)

if [ -z "$CATEGORY_ID" ]; then
  echo "No categories found. Creating a category..."
  CATEGORY_RESPONSE=$(curl -s -X POST $BASE_URL/menu/categories \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Category","description":"Test Description"}')
  echo "Create Category Response: $CATEGORY_RESPONSE"
  CATEGORY_ID=$(echo $CATEGORY_RESPONSE | grep -o '"id":[0-9]*' | head -n 1 | cut -d':' -f2)
fi

echo "Using Category ID: $CATEGORY_ID"

# Create Menu Item
echo "Creating menu item..."
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/menu/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Item\",
    \"description\": \"Test Description\",
    \"category_id\": $CATEGORY_ID,
    \"is_active\": 1,
    \"is_featured\": 0,
    \"variants\": [
      {\"name\": \"Regular\", \"price\": 10.00, \"is_active\": 1}
    ]
  }")

ITEM_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | head -n 1 | cut -d':' -f2)

if [ -z "$ITEM_ID" ]; then
  echo "Failed to create item. Response: $CREATE_RESPONSE"
  exit 1
fi

echo "Item created. ID: $ITEM_ID"

# Get Menu Item
echo "Fetching menu item..."
GET_RESPONSE=$(curl -s -X GET $BASE_URL/menu/items/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN")

if [[ $GET_RESPONSE != *"Test Item"* ]]; then
  echo "Failed to fetch item. Response: $GET_RESPONSE"
  exit 1
fi

echo "Item fetched successfully."

# Update Menu Item
echo "Updating menu item..."
UPDATE_RESPONSE=$(curl -s -X PUT $BASE_URL/menu/items/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Updated Test Item\",
    \"description\": \"Updated Description\",
    \"category_id\": $CATEGORY_ID,
    \"is_active\": 1,
    \"is_featured\": 1,
    \"variants\": [
      {\"name\": \"Large\", \"price\": 15.00, \"is_active\": 1}
    ]
  }")

if [[ $UPDATE_RESPONSE != *"Updated Test Item"* ]]; then
  echo "Failed to update item. Response: $UPDATE_RESPONSE"
  exit 1
fi

echo "Item updated successfully."

# Delete Menu Item
echo "Deleting menu item..."
DELETE_RESPONSE=$(curl -s -X DELETE $BASE_URL/menu/items/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN")

# Verify Deletion
VERIFY_DELETE=$(curl -s -X GET $BASE_URL/menu/items/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN")

if [[ $VERIFY_DELETE != *"not found"* && $VERIFY_DELETE != *"No query results"* ]]; then
    # Laravel might return 404 HTML or JSON with error
    # If it returns the item, then deletion failed.
    if [[ $VERIFY_DELETE == *"Updated Test Item"* ]]; then
        echo "Failed to delete item. Item still exists."
        exit 1
    fi
fi

echo "Item deleted successfully."
echo "Verification complete."
