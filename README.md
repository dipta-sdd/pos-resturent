### **Revised Database Schema (MySQL DDL)**

```sql
-- This schema is designed for the 2025 Restaurant Web App.
-- REVISIONS: Role management simplified, categories now support hierarchy, favorites/reviews removed.

-- ---------------------------------
-- 1. Core User & Auth Tables
-- ---------------------------------

CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `phone` VARCHAR(20) UNIQUE NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'staff', 'rider', 'customer') NOT NULL DEFAULT 'customer' COMMENT 'Simplified role management in a single column.',
  `avatar_url` VARCHAR(255) NULL,
  `email_verified_at` TIMESTAMP NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

-- Laravel's default password reset table
CREATE TABLE `password_resets` (
  `email` VARCHAR(255) NOT NULL PRIMARY KEY,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL
);

-- ---------------------------------
-- 2. Menu & Category Tables
-- ---------------------------------

CREATE TABLE `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `parent_id` BIGINT UNSIGNED NULL COMMENT 'For creating sub-categories (e.g., Drinks -> Hot Drinks).',
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(255) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
);

CREATE TABLE `menu_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  -- NOTE: price column is REMOVED. Price is now in the item_variants table.
  `image_url` VARCHAR(255) NULL,
  `is_available` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Master availability for the item',
  `is_featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
);

CREATE TABLE `item_variants` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `menu_item_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL COMMENT 'e.g., Small, Medium, Large, 250ml',
    `price` DECIMAL(10, 2) NOT NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Availability for this specific variant',
    `created_at` TIMESTAMP NULL,
    `updated_at` TIMESTAMP NULL,
    FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON DELETE CASCADE
) COMMENT='Stores different versions of a menu item, each with its own price.';


CREATE TABLE `add_ons` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE `menu_item_add_ons` (
  `menu_item_id` BIGINT UNSIGNED NOT NULL,
  `add_on_id` BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (`menu_item_id`, `add_on_id`),
  FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`add_on_id`) REFERENCES `add_ons`(`id`) ON DELETE CASCADE
) COMMENT='This pivot table defines which add-ons are applicable to which menu items.';


-- ---------------------------------
-- 3. Order & Checkout Tables
-- ---------------------------------

CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  `order_type` ENUM('delivery', 'dine-in', 'takeaway') NOT NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `tax_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `delivery_charge` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  -- NOTE: payment_method, payment_status, and transaction_id have been removed.
  -- Payment details are now handled in the 'order_payments' table to support split payments.
  `special_instructions` TEXT NULL,
  `delivery_address_id` BIGINT UNSIGNED NULL,
  `table_id` BIGINT UNSIGNED NULL,
  `rider_id` BIGINT UNSIGNED NULL,
  `staff_id` BIGINT UNSIGNED NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`delivery_address_id`) REFERENCES `addresses`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`rider_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`staff_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE `payment_methods` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'e.g., Cash, Stripe, bKash, Card POS',
  `code` VARCHAR(50) UNIQUE NOT NULL COMMENT 'e.g., cash, stripe, bkash, card_pos',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

CREATE TABLE `order_payments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `payment_method_id` BIGINT UNSIGNED NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('paid', 'failed', 'refunded') NOT NULL DEFAULT 'paid',
  `transaction_id` VARCHAR(255) NULL COMMENT 'Unique ID from payment gateway, if applicable',
  `payment_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON DELETE RESTRICT
);

CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `item_variant_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL COMMENT 'Price of the variant at the time of order',
  `customization_notes` TEXT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`item_variant_id`) REFERENCES `item_variants`(`id`) ON DELETE RESTRICT
);

CREATE TABLE `order_item_add_ons` (
  `order_item_id` BIGINT UNSIGNED NOT NULL,
  `add_on_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `price` DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (`order_item_id`, `add_on_id`),
  FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`add_on_id`) REFERENCES `add_ons`(`id`) ON DELETE RESTRICT
);

-- ---------------------------------
-- 4. Reservations & Tables
-- ---------------------------------

CREATE TABLE `tables` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name_or_number` VARCHAR(50) NOT NULL UNIQUE,
  `capacity` INT UNSIGNED NOT NULL,
  `status` ENUM('available', 'occupied', 'reserved') NOT NULL DEFAULT 'available'
);

CREATE TABLE `reservations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `table_id` BIGINT UNSIGNED NULL,
  `num_guests` INT UNSIGNED NOT NULL,
  `reservation_time` DATETIME NOT NULL,
  `status` ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  `notes` TEXT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON DELETE SET NULL
);

-- ---------------------------------
-- 5. User Profile
-- ---------------------------------

CREATE TABLE `addresses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `label` VARCHAR(100) NOT NULL,
  `full_address` TEXT NOT NULL,
  `city` VARCHAR(100) NULL,
  `zip_code` VARCHAR(20) NULL,
  `is_default` BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);


-- ---------------------------------
-- 6. Delivery Rider Specific Tables
-- ---------------------------------

CREATE TABLE `rider_details` (
  `user_id` BIGINT UNSIGNED NOT NULL PRIMARY KEY,
  `vehicle_type` VARCHAR(100) NULL,
  `license_plate` VARCHAR(50) NULL,
  `id_document_url` VARCHAR(255) NULL,
  `license_document_url` VARCHAR(255) NULL,
  `is_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `availability_status` ENUM('online', 'offline') NOT NULL DEFAULT 'offline',
  `current_latitude` DECIMAL(10, 8) NULL,
  `current_longitude` DECIMAL(11, 8) NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- ---------------------------------
-- 7. Promotions, Tips & Payouts
-- ---------------------------------

CREATE TABLE `coupons` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) UNIQUE NOT NULL,
  `type` ENUM('percentage', 'fixed') NOT NULL,
  `value` DECIMAL(10, 2) NOT NULL,
  `expiry_date` DATE NULL,
  `usage_limit` INT NULL,
  `times_used` INT NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

CREATE TABLE `tips` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `recipient_id` BIGINT UNSIGNED NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('received', 'payout_requested', 'paid') NOT NULL DEFAULT 'received',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`recipient_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
);

CREATE TABLE `payouts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('requested', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'requested',
  `payout_method` VARCHAR(100) NULL,
  `transaction_details` TEXT NULL,
  `requested_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT
);

-- ---------------------------------
-- 8. System & Admin Tables
-- ---------------------------------

CREATE TABLE `settings` (
  `key` VARCHAR(255) NOT NULL PRIMARY KEY,
  `value` TEXT NULL
);

CREATE TABLE `notifications` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `type` VARCHAR(255) NOT NULL,
  `notifiable_type` VARCHAR(255) NOT NULL,
  `notifiable_id` BIGINT UNSIGNED NOT NULL,
  `data` TEXT NOT NULL,
  `read_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  INDEX `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`, `notifiable_id`)
);

CREATE TABLE `audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL,
  `action` VARCHAR(255) NOT NULL,
  `loggable_id` BIGINT UNSIGNED NOT NULL,
  `loggable_type` VARCHAR(255) NOT NULL,
  `old_values` JSON NULL,
  `new_values` JSON NULL,
  `created_at` TIMESTAMP NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- ---------------------------------
-- 9. Business Operations & Finance -- [NEW SECTION]
-- ---------------------------------

CREATE TABLE `expense_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) UNIQUE NOT NULL COMMENT 'e.g., Rent, Utilities, Staff Salary, Inventory',
  `description` TEXT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL
);

CREATE TABLE `expenses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `expense_category_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NULL COMMENT 'Staff/Admin who logged the expense',
  `amount` DECIMAL(10, 2) NOT NULL,
  `description` TEXT NOT NULL COMMENT 'e.g., Electricity bill for October 2024',
  `expense_date` DATE NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  FOREIGN KEY (`expense_category_id`) REFERENCES `expense_categories`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

```

## 🍽️ **Restaurant Web App — Full Feature List (Final Revision)**

---

### 🧑‍💻 **1. Customer Features**

#### 🔐 Authentication & Profile

- Register using email, phone, or social login
- Login / logout / forgot password
- Manage profile (name, phone, address, photo)
- View order & reservation history
- Manage saved addresses and preferred payment methods

#### 🍔 Menu & Ordering

- Browse menu with images, categories, and prices
- Search and filter by category, price, popularity
- Add items to cart, update quantity, add customization (add-ons, notes)
- Apply coupon or promo code
- Floating cart button on small devices
- Checkout (supports multiple payment options)
- Option to **add tip** for waiter (dine-in) or rider (delivery)
- View invoice/receipt with full breakdown (items, tax, service charge, tips, payments)
- Track order status in real time (Preparing → Ready → Out for delivery → Delivered)

#### 🍽️ Reservations

- Make a reservation (select date, time, number of guests)
- Get instant or manual approval
- Modify or cancel reservations
- Notification reminders for upcoming bookings

#### 🔔 Notifications

- Receive push/email alerts for orders, reservations, offers, and delivery updates

#### 💳 Payments

- Pay via multiple payment methods (Card, Cash, bKash, Nagad, etc.)
- Save preferred payment method for quick checkout
- View detailed payment breakdown per order
- **Support for split/multi-payments:** one order can include multiple payment IDs (e.g., 50% card + 50% cash)

#### 🌐 General

- Multi-language support (English, Bangla, etc.)
- Dark/light mode (optional)
- Fully responsive design for desktop, tablet, and mobile

---

### 🧑‍🍳 **2. Staff / Waiter / POS Operator Features**

#### 💻 POS (Offline Orders)

- Login to POS dashboard
- Create dine-in/takeaway orders manually
- Add multiple items, apply discounts, or promo codes
- Select **payment types** (cash, card, etc.) — supports multiple payment IDs per order
- Print or view invoices
- Add tips manually for waiter service
- Manage dine-in orders (mark served, paid, completed)

#### 🧾 Table & Order Management

- View all ongoing and completed orders
- Update order status (preparing, ready, served, etc.)
- Assign orders to riders (for delivery)
- Manage table occupancy and reservation status
- Shift summary (sales + tips + payment summary)

#### 💸 Tips

- Receive tips (direct or pooled)
- View personal tip history
- Request payout to admin

---

### 🚴‍♂️ **3. Delivery Rider Features (Dedicated Rider Page)**

#### 🔐 Authentication & Profile

- Login/logout
- Upload ID, driving license, and vehicle documents
- Toggle availability (Online / Offline)

#### 📦 Delivery Management

- View assigned deliveries (pickup + drop addresses)
- See customer contact info (masked)
- Update order status: Accepted → Picked Up → Delivered
- Route navigation via Google Maps
- Automatic or manual assignment (configurable by admin)

#### 💰 Earnings & Tips

- View earnings (daily, weekly, monthly)
- Separate section for tips received
- Request payouts / withdrawals
- View payout history

#### 📲 Notifications

- Real-time alerts for new deliveries, tips, or status changes

#### ⚙️ Settings & Help

- Set preferred working hours & delivery zones
- Access help, FAQs, and issue reporting

---

### 🧑‍💼 **4. Admin / Restaurant Owner Features**

#### 📊 Dashboard

- Overview of:

  - Total sales & orders
  - Total expenses
  - Net profit/loss
  - Active orders & reservations
  - Top-selling items
  - Riders online
  - Tips summary

#### 🍕 Menu Management

- Add, edit, delete menu items (with name, price, image, category, availability)
- Add optional add-ons (extra cheese, toppings, etc.)
- Mark bestsellers or featured dishes

#### 📂 Category Management

- Create, rename, or delete menu categories
- Sort display order

#### 🛒 Order Management

- View all orders (online + offline)
- Filter by status, date, user, or payment type
- Edit order details (status, items, assigned staff)
- View all **payment IDs associated with each order**
- Issue refunds (if supported by payment gateway)

#### 💳 Payment Management (New)

- **Payment Type Management**

  - Create, edit, and delete payment types (e.g., Cash, Card, bKash, Nagad, etc.)
  - Set default payment types for POS and online orders
  - Define transaction fees (optional, e.g., 1.5% for cards)

- **Multi-Payment Order Support**

  - Each order can have multiple payment entries (partial payments, mixed methods, refunds)
  - Track each payment with: payment ID, type, amount, date, and status
  - Generate payment summary per order and per payment type

- **Payment Reports**

  - Total payments collected by type (cash/card/mobile)
  - Outstanding/unpaid balance reports
  - Export payment records (CSV/PDF)

#### 📅 Reservation Management

- Approve or reject reservations
- Modify table allocations
- Block time slots for special events or maintenance

#### 🧑‍🤝‍🧑 User Management

- Manage customers, staff, and riders
- Assign roles and permissions
- Activate, suspend, or delete accounts

#### 💸 Tip Management

- Enable/disable tipping globally
- Configure tip options (suggested % values)
- Choose tip handling mode: direct / pooled / split
- View and approve payout requests
- Generate tip reports (by user, role, date range)

#### 💼 Expense Management

- Add new expenses manually (date, amount, description)
- Assign expense category (e.g., Ingredients, Rent, Utilities, Marketing)
- Manage expense categories (create/edit/delete)
- View expense list with filtering and search
- Generate reports by category, date range, and total expenses
- Calculate profit/loss = Sales - Expenses
- Export reports (CSV/PDF)

#### 🧾 Reports & Analytics

- Sales and revenue reports
- Expense reports
- Payment reports
- Reservation and table utilization reports
- Tip and payout reports
- Rider performance analytics
- Export all as CSV/PDF

#### 🎟️ Promotions & Coupons

- Create, edit, or delete promo codes
- Set usage limit and expiration date
- Apply specific discounts (percentage/fixed)

#### 🏪 Restaurant Settings

- Edit restaurant info (name, logo, address, hours, contact)
- Configure taxes, service charges, delivery charges, and tips
- Set delivery zones & radius

#### 💬 Notifications & Communication

- Send announcements or alerts to users or riders
- Internal messages for staff
- Push or email marketing campaigns

---

### ⚙️ **5. System / Core Features**

- Multi-role authentication (Customer, Staff, Rider, Admin)
- Role-based access control (RBAC)
- Real-time notifications (WebSocket / Firebase)
- Secure authentication (JWT/OAuth2)
- Data encryption & backup system
- Audit logs for admin and staff actions
- SEO optimization & analytics integration
- API-ready backend for mobile app expansion

---

### 🌍 **6. Optional / Future Phase Enhancements**

- Loyalty points & rewards
- Referral system
- Multi-branch/franchise management
- QR code menu for dine-in
- AI-powered recommendation system
- Inventory & supplier management
- Auto expense import from invoices
- Admin mobile app

---

# 🍽️ **Restaurant Web App — REST API Endpoint Plan**

**Base URL:** `/api`

---

## **1. Authentication & User Access (/api/auth)**

| Method | URI                | Description                                            | Auth     |
| ------ | ------------------ | ------------------------------------------------------ | -------- |
| POST   | `/register`        | Register a new customer.                               | [Public] |
| POST   | `/login`           | Log in user and issue JWT.                             | [Public] |
| POST   | `/logout`          | Log out and invalidate token.                          | [Auth]   |
| POST   | `/forgot-password` | Send password reset link.                              | [Public] |
| POST   | `/reset-password`  | Reset password with token.                             | [Public] |
| GET    | `/me`              | Get current authenticated user info.                   | [Auth]   |
| PUT    | `/me`              | Update basic info (name, phone, role-specific fields). | [Auth]   |

---

## **2. Public Endpoints (/api/public)**

| Method | URI                | Description                                                              | Auth     |
| ------ | ------------------ | ------------------------------------------------------------------------ | -------- |
| GET    | `/menu-items`      | Get all menu items with optional filters (`?category`, `?search`, etc.). | [Public] |
| GET    | `/menu-items/{id}` | Get menu item details with add-ons.                                      | [Public] |
| GET    | `/categories`      | List all menu categories/subcategories.                                  | [Public] |
| GET    | `/settings`        | Get public restaurant info (logo, name, hours, contact).                 | [Public] |

---

## **3. Customer Endpoints (/api/customer)**

| Method | URI                  | Description                                                        | Auth       |
| ------ | -------------------- | ------------------------------------------------------------------ | ---------- |
| GET    | `/profile`           | View customer profile.                                             | [Customer] |
| PUT    | `/profile`           | Update name, phone, preferences.                                   | [Customer] |
| POST   | `/profile/avatar`    | Upload/change profile photo.                                       | [Customer] |
| GET    | `/addresses`         | List saved delivery addresses.                                     | [Customer] |
| POST   | `/addresses`         | Add new address.                                                   | [Customer] |
| PUT    | `/addresses/{id}`    | Edit existing address.                                             | [Customer] |
| DELETE | `/addresses/{id}`    | Remove address.                                                    | [Customer] |
| GET    | `/orders`            | Get customer’s order history.                                      | [Customer] |
| POST   | `/orders`            | Place new order (supports multiple payment entries, tips, coupon). | [Customer] |
| GET    | `/orders/{id}`       | Get single order details.                                          | [Customer] |
| GET    | `/reservations`      | View table reservations.                                           | [Customer] |
| POST   | `/reservations`      | Create new reservation.                                            | [Customer] |
| PUT    | `/reservations/{id}` | Update or cancel reservation.                                      | [Customer] |

---

## **4. POS / Staff Endpoints (/api/pos)**

| Method | URI                         | Description                                         | Auth    |
| ------ | --------------------------- | --------------------------------------------------- | ------- |
| GET    | `/orders`                   | List current/active orders for POS dashboard.       | [Staff] |
| POST   | `/orders`                   | Create offline order (dine-in/takeaway).            | [Staff] |
| GET    | `/orders/{id}`              | View complete order with items, payments, and tips. | [Staff] |
| PATCH  | `/orders/{id}/status`       | Update order status (e.g., preparing → served).     | [Staff] |
| POST   | `/orders/{id}/assign-rider` | Assign delivery order to rider.                     | [Staff] |
| POST   | `/orders/{id}/payments`     | Add new payment record (split payments supported).  | [Staff] |
| GET    | `/tables`                   | Get all tables with current occupancy status.       | [Staff] |
| PATCH  | `/tables/{id}/status`       | Mark table as available/occupied/cleaning.          | [Staff] |
| GET    | `/shifts/summary`           | View sales, payments, and tip summary for shift.    | [Staff] |

---

## **5. Rider Endpoints (/api/rider)**

| Method | URI                       | Description                                         | Auth    |
| ------ | ------------------------- | --------------------------------------------------- | ------- |
| GET    | `/profile`                | Get rider profile.                                  | [Rider] |
| PUT    | `/profile`                | Update profile info.                                | [Rider] |
| POST   | `/profile/documents`      | Upload ID/license docs.                             | [Rider] |
| PATCH  | `/status`                 | Toggle availability (online/offline).               | [Rider] |
| GET    | `/deliveries`             | Get active/assigned deliveries.                     | [Rider] |
| GET    | `/deliveries/history`     | Delivery history with filters (date range, status). | [Rider] |
| PATCH  | `/deliveries/{id}/status` | Update delivery progress (accepted → delivered).    | [Rider] |
| GET    | `/earnings`               | Total earnings and tips summary.                    | [Rider] |
| GET    | `/payouts`                | List previous payout requests.                      | [Rider] |
| POST   | `/payouts`                | Request payout for balance and tips.                | [Rider] |

---

## **6. Admin / Owner Endpoints (/api/admin)**

### 📊 **Dashboard & Reports**

| Method | URI                 | Description                                 | Auth    |
| ------ | ------------------- | ------------------------------------------- | ------- |
| GET    | `/dashboard/stats`  | Overview (sales, orders, expenses, profit). | [Admin] |
| GET    | `/reports/sales`    | Filterable sales report.                    | [Admin] |
| GET    | `/reports/expenses` | Expense summary and breakdown.              | [Admin] |
| GET    | `/reports/payments` | Payment method usage and totals.            | [Admin] |

---

### ⚙️ **CRUD Management**

| Resource          | URI                                   | Methods     | Auth    | Description                      |
| ----------------- | ------------------------------------- | ----------- | ------- | -------------------------------- |
| **Menu Items**    | `/menu-items`                         | GET, POST   | [Admin] | Manage food items.               |
| **Item Variants** | `/menu-items/{menu_item_id}/variants` | GET, POST   | [Admin] | Manage variants for a menu item. |
|                   | `/variants/{id}`                      | PUT, DELETE | [Admin] | Edit/remove single variant.      |
|                   |                                       |             |         |                                  |

| | `/menu-items/{id}` | GET, PUT, DELETE | [Admin] | Edit/remove single item. |
| **Categories** | `/categories` | GET, POST | [Admin] | Manage food categories. |
| | `/categories/{id}` | GET, PUT, DELETE | [Admin] | |
| **Add-ons** | `/add-ons` | GET, POST | [Admin] | Manage extra add-ons. |
| | `/add-ons/{id}` | GET, PUT, DELETE | [Admin] | |
| **Orders** | `/orders` | GET | [Admin] | View all orders. |
| | `/orders/{id}` | GET, PUT, DELETE | [Admin] | Modify order info. |
| **Payment Methods** | `/payment-methods` | GET, POST | [Admin] | Create/manage payment types (Cash, Card, BKash). |
| | `/payment-methods/{id}` | GET, PUT, DELETE | [Admin] | |
| **Reservations** | `/reservations` | GET | [Admin] | View all reservations. |
| | `/reservations/{id}` | GET, PUT | [Admin] | Approve/reject/edit. |
| **Users** | `/users` | GET, POST | [Admin] | Create or list users. |
| | `/users/{id}` | GET, PUT | [Admin] | Update role/status. |
| **Coupons** | `/coupons` | GET, POST | [Admin] | Manage discount codes. |
| | `/coupons/{id}` | GET, PUT, DELETE | [Admin] | |
| **Expenses** | `/expenses` | GET, POST | [Admin] | Log expenses by category. |
| | `/expenses/{id}` | GET, PUT, DELETE | [Admin] | |
| **Expense Categories** | `/expense-categories` | GET, POST | [Admin] | Manage categories (e.g., utilities, supplies). |
| | `/expense-categories/{id}` | GET, PUT, DELETE | [Admin] | |
| **Tips & Payouts** | `/payouts` | GET | [Admin] | View all payout requests. |
| | `/payouts/{id}` | PATCH | [Admin] | Approve/reject payout. |
| **Settings** | `/settings` | GET, PUT | [Admin] | Update restaurant details (hours, contact info). |

---

## ✅ **Extra Technical Notes**

- **Multi-Payment Orders:**
  `/orders/{id}/payments` allows multiple `payment_id` entries (e.g., half cash, half card).

- **Tips System:**

  - `tip` field stored per order, split into waiter & rider share.
  - Shown in `/rider/earnings` and `/pos/shifts/summary`.

- **Expense Management:**

  - `/expenses` uses `expense_category_id`.
  - Total expenses shown in admin reports.

- **Authorization Flow:**

  - Use **JWT** for API authentication.
  - Laravel Sanctum or Passport recommended.

- **Pagination & Filters:**

  - All list endpoints support standard params: `?page`, `?limit`, `?sort`, `?search`, `?from`, `?to`.

---

### **All Pages**

---

**Page: Homepage**

- **Purpose:** To serve as the primary landing page, attracting customers and guiding them to key actions.
- **Key Components & Features:**
  - Header with navigation (Menu, Reservations, Login/Register) and logo.
  - Hero section with a prominent call-to-action (e.g., "Order Now").
  - Display of featured menu items or daily specials.
  - Section highlighting the reservation system.
  - Brief "About Us" snippet.
  - Customer testimonials or reviews.
  - Footer with contact info, social media links, and legal pages.
- **API Endpoints Used:**
  - `GET /api/public/settings` (for restaurant name, logo)
  - `GET /api/public/menu-items?featured=true` (to fetch featured items)

---

**Page: Menu Page**

- **Purpose:** To allow users to browse, search, and filter the entire restaurant menu.
- **Key Components & Features:**
  - Sticky category navigation sidebar or top bar.
  - Search bar for finding specific items by name.
  - Filter options (e.g., by category, price range).
  - Grid or list view of menu items, each displayed as a card.
  - Each menu item card shows: image, name, price, and a quick "Add to Cart" button.
  - Clicking an item card navigates to the Menu Item Detail Page.
- **API Endpoints Used:**
  - `GET /api/public/menu-items` (with query params for filtering/searching)
  - `GET /api/public/categories`

---

**Page: Menu Item Detail Page**

- **Purpose:** To provide a detailed view of a single menu item and allow for customization before adding to the cart.
- **Key Components & Features:**
  - Large, high-quality image of the item.
  - Item name, detailed description, and price.
  - Quantity selector (e.g., +/- buttons).
  - Customization section for selecting add-ons (e.g., checkboxes for toppings).
  - Text area for "Special Instructions".
  - "Add to Cart" button that updates the cart with the customized item.
- **API Endpoints Used:**
  - `GET /api/public/menu-items/{id}`

---

**Page: Login Page**

- **Purpose:** To allow all registered users (customers, staff, riders, admin) to authenticate.
- **Key Components & Features:**
  - Form with fields for email and password.
  - "Login" button to submit the form.
  - Links to "Forgot Password?" and "Don't have an account? Register".
  - Optional social login buttons (Google, Facebook).
- **API Endpoints Used:**
  - `POST /api/auth/login`

---

**Page: Registration Page**

- **Purpose:** To enable new customers to create an account.
- **Key Components & Features:**
  - Form with fields for name, email, phone number, and password.
  - "Register" button to submit the form.
  - Link to "Already have an account? Login".
- **API Endpoints Used:**
  - `POST /api/auth/register`

---

**Page: Forgot Password Page**

- **Purpose:** To initiate the password reset process for a user who has forgotten their password.
- **Key Components & Features:**
  - Form with a single field for the user's email address.
  - "Send Reset Link" button.
  - A confirmation message is shown after submission.
- **API Endpoints Used:**
  - `POST /api/auth/forgot-password`

---

**Page: Reset Password Page**

- **Purpose:** To allow a user to set a new password using a token from their email.
- **Key Components & Features:**
  - Form with fields for "New Password" and "Confirm New Password".
  - The page URL will contain the reset token.
  - "Reset Password" button.
- **API Endpoints Used:**
  - `POST /api/auth/reset-password`

---

**Page: About Us Page**

- **Purpose:** To share the restaurant's story, mission, and values with visitors.
- **Key Components & Features:**
  - Static content including text and images about the restaurant's history.
  - Information about the chefs or team members.
- **API Endpoints Used:**
  - (Likely none, content is static)

---

**Page: Contact Us Page**

- **Purpose:** To provide users with ways to get in touch with the restaurant.
- **Key Components & Features:**
  - Restaurant's physical address.
  - Embedded map (e.g., Google Maps).
  - Phone number and email address.
  - Operating hours.
  - Optional contact form.
- **API Endpoints Used:**
  - `GET /api/public/settings` (to fetch address, phone, hours)

---

**Page: Terms of Service / Privacy Policy Pages**

- **Purpose:** To display the restaurant's legal terms, conditions, and data privacy policies.
- **Key Components & Features:**
  - Static text content detailing the policies.
- **API Endpoints Used:**
  - (None, content is static)

---

**Component: Cart View (Modal or Sidebar)**

- **Purpose:** To provide a quick and accessible summary of items in the cart, allowing for easy modification.
- **Key Components & Features:**
  - A list of all items added to the cart.
  - For each item: name, quantity selector (+/-), price, and a "remove" button.
  - Subtotal calculation.
  - Input field to enter a coupon code.
  - "Checkout" button that navigates to the full Checkout Page.
- **API Endpoints Used:**
  - `GET /api/public/menu-items/{id}` (To get item details if not already stored in the frontend state).
  - `POST /api/admin/coupons/verify` (A potential endpoint to validate a coupon code and get the discount amount).

---

**Page: Checkout Page **

- **Purpose:** To provide a single, streamlined page for the customer to confirm their delivery address, add a tip, provide payment details via Stripe, and finalize their order.
- **Key Components & Features:**
  - **Delivery Address Section:**
    - Displays the user's default address prominently.
    - Provides an option to select from other saved addresses.
    - Includes an "Add New Address" button that opens a form (modal or inline) for entering a new address.
  - **Order Summary & Tip Section:**
    - An itemized list of all items in the cart.
    - A clear breakdown of costs: Subtotal, Tax, Delivery Fee, and any applied Discounts.
    - A simple input section to add a tip (e.g., buttons for 10%, 15%, 20% and a field for a custom amount).
    - A final, dynamically updated "Total" amount.
  - **Payment Section (Powered by Stripe):**
    - An embedded Stripe Elements form for securely entering card details (Card Number, Expiry, CVC).
    - If the user has saved cards, it will display them as an option to choose from instead of entering new details.
  - **Final Action Button:**
    - A single "Confirm & Pay" button that validates all fields and submits the order.
- **API Endpoints Used:**
  - `GET /api/customer/addresses` (To display the list of saved addresses)
  - `POST /api/customer/addresses` (If the user adds a new address)
  - **Stripe API** (Frontend directly interacts with Stripe to tokenize card information securely)
  - `POST /api/customer/orders` (The final submission, sending the selected `address_id`, `tip_amount`, and the secure payment token from Stripe to the backend)

---

**Page: Order Confirmation / Thank You Page**

- **Purpose:** To confirm that the order has been successfully placed and provide key details.
- **Key Components & Features:**
  - A prominent "Thank You" message.
  - Order confirmation number.
  - A summary of the order placed.
  - Estimated delivery/pickup time.
  - A link to the Live Order Tracking Page.
- **API Endpoints Used:**
  - (Typically receives order data passed from the checkout page, but might call `GET /api/customer/orders/{id}` to refresh details).

---

**Page: Live Order Tracking Page**

- **Purpose:** To provide the customer with real-time updates on the status of their ongoing order.
- **Key Components & Features:**
  - A visual progress bar or timeline showing the order status (e.g., Confirmed → Preparing → Out for Delivery → Delivered).
  - The current status is highlighted.
  - For delivery orders, an embedded map showing the rider's location in real-time.
  - Rider's contact information (masked).
- **API Endpoints Used:**
  - `GET /api/customer/orders/{id}` (called periodically or via WebSocket to get status updates).

---

**Page: Dashboard Home (Customer)**

- **Purpose:** To act as the main landing page for a logged-in customer, providing quick access to key information.
- **Key Components & Features:**
  - Welcome message (e.g., "Hello, [User Name]").
  - A summary of the most recent order's status.
  - Details of the next upcoming reservation.
  - Quick links to "Order History," "My Reservations," and "Profile Settings."
- **API Endpoints Used:**
  - `GET /api/auth/me`
  - `GET /api/customer/orders?limit=1`
  - `GET /api/customer/reservations?upcoming=true&limit=1`

---

**Page: Order History Page**

- **Purpose:** To display a comprehensive list of all past and current orders for the customer.
- **Key Components & Features:**
  - A list or table of orders.
  - Each list item shows: order ID, date, total amount, and current status.
  - Clicking an order navigates to the Order Details Page.
- **API Endpoints Used:**
  - `GET /api/customer/orders`

---

**Page: Order Details Page**

- **Purpose:** To show a detailed receipt and breakdown of a specific past or current order.
- **Key Components & Features:**
  - All order information: ID, date, status.
  - Itemized list of products, quantities, and prices.
  - Detailed cost breakdown: subtotal, tax, delivery charge, tip, discount, and total amount.
  - Payment method(s) used.
  - Delivery address.
- **API Endpoints Used:**
  - `GET /api/customer/orders/{id}`

---

**Page: Reservation History Page**

- **Purpose:** To display a list of the customer's upcoming and past table reservations.
- **Key Components & Features:**
  - Tabs for "Upcoming" and "Past" reservations.
  - Each reservation in the list shows: date, time, number of guests, and status (e.g., Confirmed, Cancelled).
  - Upcoming reservations have options to "Modify" or "Cancel".
- **API Endpoints Used:**
  - `GET /api/customer/reservations`

---

**Page: Reservation Details Page**

- **Purpose:** To allow a customer to view and manage a specific upcoming reservation.
- **Key Components & Features:**
  - Full details of the reservation.
  - A form to modify the date, time, or number of guests.
  - A button to cancel the reservation.
- **API Endpoints Used:**
  - `PUT /api/customer/reservations/{id}`

---

**Page: Profile Settings Page**

- **Purpose:** To allow a customer to manage their personal information and account security.
- **Key Components & Features:**
  - Form to update name and phone number.
  - Section to upload or change their profile avatar.
  - Form to change their password.
- **API Endpoints Used:**
  - `GET /api/customer/profile`
  - `PUT /api/customer/profile`
  - `POST /api/customer/profile/avatar`

---

**Page: Manage Addresses Page**

- **Purpose:** To provide a CRUD interface for the customer's saved delivery addresses.
- **Key Components & Features:**
  - A list of all saved addresses.
  - Each address card shows the details and has "Edit" and "Delete" buttons.
  - A button to "Add New Address," which opens a form.
  - Ability to set one address as the default.
- **API Endpoints Used:**
  - `GET /api/customer/addresses`
  - `POST /api/customer/addresses`
  - `PUT /api/customer/addresses/{id}`
  - `DELETE /api/customer/addresses/{id}`

---

**Page: Manage Payment Methods Page**

- **Purpose:** To allow customers to securely save and manage their payment information for faster checkouts.
- **Key Components & Features:**
  - A list of saved payment methods (e.g., "Visa ending in 1234").
  - Each saved method has a "Delete" button.
  - A form to add a new payment method (integrates with a payment gateway like Stripe).
- **API Endpoints Used:**
  - (Endpoints for managing payment methods, often provided directly by the payment gateway's SDK, but proxied through your backend for security).

---

**Page: Notifications History Page**

- **Purpose:** To provide a central place for users to view all past notifications.
- **Key Components & Features:**
  - A chronological list of notifications.
  - Each notification shows the message and the time it was received.
  - Ability to mark notifications as read.
- **API Endpoints Used:**
  - `GET /api/auth/notifications` (A potential generic endpoint for all user roles).

---

**Page: Make a Reservation Page**

- **Purpose:** To provide a simple form for customers to book a table.
- **Key Components &Features:**
  - A date picker.
  - A time selector (showing available slots).
  - An input for the number of guests.
  - A text area for any special notes.
  - "Book Table" button.
- **API Endpoints Used:**
  - `POST /api/customer/reservations`

---

**Page: POS Dashboard**

- **Purpose:** To provide a real-time, high-level overview of the restaurant's current operations for staff members. This is the main screen for POS users.
- **Key Components & Features:**
  - **Live Order Feed:** A primary column or grid displaying all active orders, color-coded by status (e.g., New, Preparing, Ready). Each order card shows key info like order ID, type (Dine-in/Takeaway), and total items.
  - **Table Layout View:** A visual representation of the restaurant's floor plan, with each table showing its current status (Available, Occupied, Reserved).
  - **Quick Action Buttons:** Prominent buttons for "New Dine-In Order," "New Takeaway Order," and "View Today's Reservations."
  - **Shift Summary Widget:** A small box showing the current staff member's total sales and tips for their active shift.
- **API Endpoints Used:**
  - `GET /api/pos/orders?status=active`
  - `GET /api/pos/tables`
  - `GET /api/pos/shifts/summary`

---

**Page: Order Creation / Management View**

- **Purpose:** To serve as the primary interface for creating new offline orders and managing the details of any existing order.
- **Key Components & Features:**
  - **Order Details Pane:** Displays the current order's items, subtotal, tax, and total. Allows for adding customer notes. For dine-in, allows assigning a table number.
  - **Menu Pane:** A searchable and categorized list of all menu items. Clicking an item adds it to the current order.
  - **Item Customization Modal:** Opens when a menu item is clicked, allowing staff to select add-ons and add specific notes for that item.
  - **Action Buttons:** "Save Order," "Send to Kitchen," and a "Go to Payment" button that transitions to the Payment Screen.
- **API Endpoints Used:**
  - `POST /api/pos/orders` (for new orders)
  - `PUT /api/pos/orders/{id}` (for updating existing orders)
  - `GET /api/public/menu-items` (to populate the menu pane)
  - `PATCH /api/pos/orders/{id}/status` (to send to kitchen)
  - `POST /api/pos/orders/{id}/assign-rider` (for delivery orders)

---

**Component: Payment Screen (Modal or Full Page)**

- **Purpose:** To handle the entire payment process for an order, with robust support for split payments.
- **Key Components & Features:**
  - **Order Total Display:** Clearly shows the total amount due.
  - **Payment Method Selector:** Buttons for each configured payment type (e.g., Cash, Card, bKash).
  - **Amount Input:** A numeric keypad or input field to enter the amount being paid for a transaction.
  - **Quick Amount Buttons:** Buttons for "Pay in Full" or common cash denominations.
  - **Payment Log:** A running list of payments already applied to this order (e.g., "$20.00 - Card", "$15.50 - Cash").
  - **Remaining Balance:** Dynamically updates to show the amount still due.
  - "Complete Order" button, which becomes active only when the remaining balance is zero.
- **API Endpoints Used:**
  - `POST /api/pos/orders/{id}/payments` (This endpoint is called for each partial payment added).
  - `GET /api/admin/payment-methods` (to get the list of available payment buttons)

---

**Page: Shift Summary Page**

- **Purpose:** To provide the logged-in staff member with a detailed report of their activity during their current or most recent shift.
- **Key Components & Features:**
  - **Total Sales:** The total monetary value of all orders processed.
  - **Payment Breakdown:** A summary of total amounts collected per payment type (e.g., Total Cash: $550, Total Card: $1230).
  - **Total Tips:** The total amount of tips received during the shift.
  - **Order Count:** The number of orders processed.
  - "End Shift" button (if applicable).
- **API Endpoints Used:**
  - `GET /api/pos/shifts/summary`

---

**Page: Rider Dashboard**

- **Purpose:** To serve as the rider's main hub for managing their work status and incoming delivery requests.
- **Key Components & Features:**
  - **Availability Toggle:** A prominent "Go Online" / "Go Offline" switch that controls the rider's working status.
  - **New Deliveries Queue:** A section that displays incoming delivery requests. Each request shows the pickup location and estimated earnings, with "Accept" and "Decline" buttons.
  - **Active Delivery List:** A list of all deliveries the rider has accepted but not yet completed. Each item shows the order ID and current status (e.g., "Heading to Restaurant," "Picked Up"). Clicking an item navigates to the Delivery Details Page.
- **API Endpoints Used:**
  - `PATCH /api/rider/status` (to toggle availability)
  - `GET /api/rider/deliveries?status=pending` (to populate the new deliveries queue, likely via WebSocket)
  - `GET /api/rider/deliveries?status=active` (to show the list of ongoing deliveries)

---

**Page: Delivery Details Page**

- **Purpose:** To provide all necessary information and tools for a rider to complete a single delivery from start to finish.
- **Key Components & Features:**
  - **Status Update Controls:** Large, easy-to-tap buttons to progress the delivery status (e.g., "Confirm Pickup" → "Confirm Delivery").
  - **Map View:** An embedded map (e.g., Google Maps) showing the route from the rider's current location to the pickup point, and then to the drop-off point.
  - **Address Information:** Clearly displayed restaurant (pickup) and customer (drop-off) addresses.
  - **Order Details:** A summary of the order contents (e.g., "3 items, 1 bag").
  - **Customer Contact:** Buttons to call or message the customer (using masked numbers for privacy).
- **API Endpoints Used:**
  - `GET /api/rider/deliveries/{id}` (to fetch all details for the specific delivery)
  - `PATCH /api/rider/deliveries/{id}/status` (called when the rider updates the status)

---

**Page: Delivery History Page**

- **Purpose:** To allow riders to view a log of their completed deliveries.
- **Key Components & Features:**
  - A chronological list of all past deliveries.
  - Each list item displays key information: date, order ID, total distance, and earnings for that trip.
  - Filters to view deliveries by date range (e.g., "Today," "This Week," "Custom Date").
- **API Endpoints Used:**
  - `GET /api/rider/deliveries/history` (with query parameters for filtering)

---

**Page: Earnings & Payouts Page**

- **Purpose:** To provide a clear breakdown of the rider's earnings, tips, and payout history.
- **Key Components & Features:**
  - **Dashboard Summary:** Key metrics displayed prominently (e.g., "Today's Earnings," "This Week's Earnings," "Current Balance").
  - **Earnings Breakdown:** A section showing total delivery fees earned, separate from total tips received.
  - **Payout History:** A table listing all past payout requests with their status (Pending, Processed, Failed) and amount.
  - **Request Payout Button:** A button that initiates the payout process for the rider's current balance.
- **API Endpoints Used:**
  - `GET /api/rider/earnings`
  - `GET /api/rider/payouts`
  - `POST /api/rider/payouts`

---

**Page: Rider Profile Page**

- **Purpose:** To allow riders to view and manage their personal information and verification documents.
- **Key Components & Features:**
  - Displays the rider's name, phone number, and email.
  - A form to update basic profile information.
  - A section for "Verification Documents."
  - For each document (ID, License): displays its current status (Not Uploaded, Pending Review, Approved) and provides a file uploader to submit or update the document.
- **API Endpoints Used:**
  - `GET /api/rider/profile`
  - `PUT /api/rider/profile`
  - `POST /api/rider/profile/documents`

---

**Page: Rider Settings Page**

- **Purpose:** To allow riders to configure their work preferences.
- **Key Components & Features:**
  - **Delivery Zones:** An interface (possibly a map) to select or view the geographical areas the rider prefers to work in.
  - **Working Hours:** Options to set preferred working hours or schedule availability in advance.
  - **Notification Preferences:** Toggles to enable or disable different types of push notifications.
- **API Endpoints Used:**
  - (These would likely be part of the `PUT /api/rider/profile` endpoint, or a dedicated `PUT /api/rider/settings` endpoint).

---

**Page: Admin Dashboard**

- **Purpose:** To provide a single-glance, high-level overview of the entire business's health and activity.
- **Key Components & Features:**
  - **KPI Cards:** Prominent cards displaying key metrics like Total Sales (today/month), Total Expenses, Net Profit/Loss, and Active Orders.
  - **Charts/Graphs:** Visualizations for sales trends over the last week/month, and a pie chart of top-selling items.
  - **Quick View Lists:** A short list of the latest orders and recent reservations.
  - **Rider Status:** A counter showing how many riders are currently online.
- **API Endpoints Used:**
  - `GET /api/admin/dashboard/stats`

---

**Page: Menu Item List Page**

- **Purpose:** To manage all menu items in a central location.
- **Key Components & Features:**
  - A searchable and filterable table of all menu items.
  - Table columns: Image, Name, Category, Price, Availability Status.
  - A toggle switch in the "Availability" column to quickly mark an item as in/out of stock.
  - "Edit" and "Delete" buttons for each item.
  - A primary "Add New Item" button that navigates to the create/edit form.
- **API Endpoints Used:**
  - `GET /api/admin/menu-items`
  - `DELETE /api/admin/menu-items/{id}`
  - `PUT /api/admin/menu-items/{id}` (for the availability toggle)

---

**Page: Menu Item Create/Edit Form Page**

- **Purpose:** To provide a form for adding a new menu item or updating an existing one.
- **Key Components & Features:**
  - Form fields for Name, Description, Price.
  - A dropdown to select the item's Category.
  - An image uploader for the item's photo.
  - Checkboxes or a multi-select field to associate available Add-ons.
  - Toggles for "Is Available" and "Is Featured."
  - "Save" button.
- **API Endpoints Used:**
  - `POST /api/admin/menu-items` (for creating)
  - `PUT /api/admin/menu-items/{id}` (for updating)
  - `GET /api/admin/menu-items/{id}` (to pre-fill the form for editing)
  - `GET /api/admin/categories` (to populate the category dropdown)
  - `GET /api/admin/add-ons` (to populate the add-ons selector)

---

**Page: Category Management Page**

- **Purpose:** To create, edit, and organize menu categories and sub-categories.
- **Key Components & Features:**
  - A list or tree view of all categories.
  - Drag-and-drop functionality to reorder categories or create sub-categories.
  - "Edit" and "Delete" buttons for each category.
  - A form to add a new category (with fields for name, description, and parent category).
- **API Endpoints Used:**
  - `GET /api/admin/categories`
  - `POST /api/admin/categories`
  - `PUT /api/admin/categories/{id}`
  - `DELETE /api/admin/categories/{id}`

---

**Page: Add-on Management Page**

- **Purpose:** To manage the master list of all possible add-ons (e.g., toppings, sides).
- **Key Components & Features:**
  - A simple table listing all add-ons.
  - Table columns: Name, Price.
  - "Edit" and "Delete" actions for each add-on.
  - A form to add a new add-on.
- **API Endpoints Used:**
  - `GET /api/admin/add-ons`
  - `POST /api/admin/add-ons`
  - `PUT /api/admin/add-ons/{id}`
  - `DELETE /api/admin/add-ons/{id}`

---

**Page: All Orders Page**

- **Purpose:** To provide a comprehensive and searchable view of every order ever placed.
- **Key Components & Features:**
  - A master table of all orders.
  - Advanced filters: by date range, status, order type, customer, or payment status.
  - Table columns: Order ID, Customer Name, Date, Total Amount, Status.
  - Clicking an order navigates to the detailed admin view.
- **API Endpoints Used:**
  - `GET /api/admin/orders` (with extensive query parameters for filtering)

---

**Page: Order Details Page (Admin View)**

- **Purpose:** To give the admin full control and visibility over a single order.
- **Key Components & Features:**
  - Complete order details (items, customer info, address).
  - A section to manually change the order status via a dropdown.
  - **Payment Details Section:** A list of all payment transactions associated with the order (showing payment ID, method, amount, status).
  - Ability to assign a rider (if it's a delivery order).
  - Option to trigger a refund (if supported by the payment gateway).
- **API Endpoints Used:**
  - `GET /api/admin/orders/{id}`
  - `PUT /api/admin/orders/{id}` (to modify details or status)

---

**Page: Payment Methods Page**

- **Purpose:** To allow the admin to configure which payment methods are accepted by the restaurant.
- **Key Components & Features:**
  - A table listing all configured payment methods (e.g., Cash, Card, bKash).
  - "Edit" and "Delete" actions.
  - A toggle to activate or deactivate a payment method.
  - A form to add a new payment method (name, code, optional transaction fee).
- **API Endpoints Used:**
  - `GET /api/admin/payment-methods`
  - `POST /api/admin/payment-methods`
  - `PUT /api/admin/payment-methods/{id}`
  - `DELETE /api/admin/payment-methods/{id}`

---

**Page: Expense List Page**

- **Purpose:** To track and manage all business expenses.
- **Key Components & Features:**
  - A filterable table of all logged expenses.
  - Filters for date range and expense category.
  - Table columns: Date, Category, Description, Amount.
  - "Edit" and "Delete" actions for each expense.
  - "Add New Expense" button.
- **API Endpoints Used:**
  - `GET /api/admin/expenses`
  - `DELETE /api/admin/expenses/{id}`

---

**Page: Expense Create/Edit Form Page**

- **Purpose:** To provide a form for logging a new expense or editing an existing one.
- **Key Components & Features:**
  - Form fields for Amount and Description.
  - A date picker for the expense date.
  - A dropdown to select the Expense Category.
  - "Save Expense" button.
- **API Endpoints Used:**
  - `POST /api/admin/expenses`
  - `PUT /api/admin/expenses/{id}`
  - `GET /api/admin/expense-categories` (to populate the dropdown)

---

**Page: Expense Category Management Page**

- **Purpose:** To manage the categories used for classifying expenses.
- **Key Components & Features:**
  - A simple table listing all expense categories (e.g., Rent, Utilities, Marketing).
  - "Edit" and "Delete" actions for each category.
  - A form to add a new category.
- **API Endpoints Used:**
  - `GET /api/admin/expense-categories`
  - `POST /api/admin/expense-categories`
  - `PUT /api/admin/expense-categories/{id}`
  - `DELETE /api/admin/expense-categories/{id}`

---

**Page: User List Page**

- **Purpose:** To manage all users in the system.
- **Key Components & Features:**
  - A master table of all users.
  - Filters by role (Customer, Staff, Rider, Admin) and status (Active, Suspended).
  - Table columns: Name, Email, Role, Status.
  - Actions for each user: "Edit," "Suspend," "Delete."
  - "Add New User" button.
- **API Endpoints Used:**
  - `GET /api/admin/users`

---

**Page: User Create/Edit Page**

- **Purpose:** To create a new user or modify an existing one.
- **Key Components & Features:**
  - Form fields for Name, Email, Phone, Password (on create).
  - A dropdown to assign/change the user's Role.
  - A toggle to set the user's status to Active or Suspended.
  - For riders, a section to view their verification status and documents.
- **API Endpoints Used:**
  - `POST /api/admin/users`
  - `PUT /api/admin/users/{id}`

---

**Page: All Reservations Page**

- **Purpose:** To manage all table reservations.
- **Key Components & Features:**
  - A filterable list/calendar of all reservations.
  - Filters for date, time, and status (Pending, Confirmed, Cancelled).
  - Actions for pending reservations: "Approve" and "Reject."
  - Ability to edit reservation details (time, guests, assigned table).
- **API Endpoints Used:**
  - `GET /api/admin/reservations`
  - `PUT /api/admin/reservations/{id}` (to approve/reject/edit)

---

**Page: Coupon List Page**

- **Purpose:** To manage all promotional codes.
- **Key Components & Features:**
  - A table of all coupons.
  - Columns: Code, Type (Fixed/Percentage), Value, Expiry Date, Usage Count.
  - "Edit" and "Delete" actions.
  - "Add New Coupon" button.
- **API Endpoints Used:**
  - `GET /api/admin/coupons`
  - `DELETE /api/admin/coupons/{id}`

---

**Page: Coupon Create/Edit Form Page**

- **Purpose:** To create or update a coupon.
- **Key Components & Features:**
  - Form fields for Code, Type (dropdown), Value, Expiration Date, and Usage Limit.
  - "Save Coupon" button.
- **API Endpoints Used:**
  - `POST /api/admin/coupons`
  - `PUT /api/admin/coupons/{id}`

---

**Page: Payout Requests Page**

- **Purpose:** To manage and process payout requests from staff and riders.
- **Key Components & Features:**
  - A table listing all pending payout requests.
  - Columns: User Name, Role, Requested Amount, Request Date.
  - "Approve" and "Reject" buttons for each request.
  - A tab to view a history of processed payouts.
- **API Endpoints Used:**
  - `GET /api/admin/payouts?status=pending`
  - `PATCH /api/admin/payouts/{id}` (to approve/reject)

---

**Page: Communications/Announcements Page**

- **Purpose:** To send broadcast messages to specific user groups.
- **Key Components & Features:**
  - A form to compose a message.
  - Recipient selector (e.g., checkboxes for "All Customers," "All Riders").
  - Message subject and body fields.
  - "Send Announcement" button.
- **API Endpoints Used:**
  - `POST /api/admin/communications/broadcast` (A potential endpoint for this feature).

---

**Page: Reports Section**

- **Purpose:** To provide detailed, exportable reports on business performance.
- **Sub-Pages:**
  - **Sales Report Page:** Displays sales data with filters for date range and item/category. Includes charts and an "Export to CSV/PDF" button.
  - **Expense Report Page:** Shows a breakdown of expenses by category and date range, with totals and export options.
  - **Profit/Loss Report Page:** A simple report comparing total revenue against total expenses for a selected period.
  - **Payment Report Page:** A summary of revenue collected per payment method.
- **API Endpoints Used:**
  - `GET /api/admin/reports/sales`
  - `GET /api/admin/reports/expenses`
  - `GET /api/admin/reports/payments`

---

**Page: Restaurant Settings Page**

- **Purpose:** To provide a central place for the admin to configure global settings for the entire application.
- **Key Components & Features:**
  - A tabbed interface for organization.
  - **Tab 1: General:** Form fields for Restaurant Name, Logo, Address, Phone, Working Hours.
  - **Tab 2: Financial:** Inputs for Tax Rate, Service Charge, and Delivery Charges.
  - **Tab 3: Tipping:** Options to enable/disable tipping, set suggested percentages, and configure the tip handling mode (direct/pooled).
  - **Tab 4: Delivery:** Settings for delivery radius and zones.
  - A single "Save Settings" button.
- **API Endpoints Used:**
  - `GET /api/admin/settings` (to populate the form with current values)
  - `PUT /api/admin/settings` (to save all changes)
