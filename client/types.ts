
// ===================================
// Laravel Pagination Types
// ===================================

/**
 * Link object in Laravel pagination response
 */
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

/**
 * Base Laravel pagination metadata (without data field)
 */
export interface LaravelPaginationMeta {
  current_page: number;
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

/**
 * Generic Laravel paginated response with data
 */
export interface LaravelPaginatedResponse<T> extends LaravelPaginationMeta {
  data: T[];
}

export interface LaravelErrorResponse {
  [key: string]: string[];
}
export interface NormalizedErrorResponse {
  [key: string]: string;
}

/**
 * Specific paginated response types
 */
export type PaginatedCategories = LaravelPaginatedResponse<Category>;
export type PaginatedMenuItems = LaravelPaginatedResponse<MenuItem>;
export type PaginatedAddOns = LaravelPaginatedResponse<AddOn>;
export type PaginatedUsers = LaravelPaginatedResponse<User>;
export type PaginatedOrders = LaravelPaginatedResponse<Order>;
export type PaginatedReservations = LaravelPaginatedResponse<Reservation>;

// ===================================
// Application Types
// ===================================

/**
 * Defines the structure for the restaurant's daily working hours.
 */
export interface WorkingHours {
  'Mon-Fri': string;
  'Sat-Sun': string;
  [key: string]: string; // Allows for flexibility if other day ranges are added
}

/**
 * Defines the structure for social media links.
 */
export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

/**
 * Defines the structure for the application's global restaurant settings.
 */
export interface Settings {
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  restaurantEmail: string;
  workingHours: WorkingHours;
  socials: SocialLinks;
  taxRatePercent: number;
  currencySymbol: string;
  currencyCode: string;
  deliveryChargeFlat: number;
  deliveryRadiusKm: number;
  minOrderAmountDelivery: number;
  freeDeliveryAt: number;
}


export type UserRole = 'admin' | 'staff' | 'rider' | 'customer';

/**
 * Maps to the 'Role' table.
 */
export interface Role {
  id: number;
  name: string;
  slug: string;
  // Shop & Organization Permissions
  can_manage_shop_settings: boolean;
  can_manage_payment_methods: boolean;
  // User Management Permissions
  can_manage_staff: boolean;
  can_manage_roles_and_permissions: boolean;
  can_view_user_activity_log: boolean;
  // Product & Catalog Permissions
  can_view_products: boolean;
  can_manage_products: boolean;
  can_manage_categories: boolean;
  can_import_products: boolean;
  can_export_products: boolean;
  // Sales & POS Permissions
  can_use_pos: boolean;
  can_view_sales_history: boolean;
  // Customer Management Permissions
  can_view_customers: boolean;
  can_manage_customers: boolean;
  // Financial & Reports Permissions
  can_manage_expenses: boolean;
  can_view_dashboard: boolean;
  can_view_reports: boolean;
  can_view_profit_loss_data: boolean;
  can_export_data: boolean;
  // New granular permissions
  can_manage_reservations: boolean;
  can_manage_payouts: boolean;
  can_send_communications: boolean;
  can_view_rider_profile: boolean;
  can_manage_promotions: boolean;
  // Audit fields
  created_at: Date | null;
  updated_at: Date | null;
  created_by: number | null;
  updated_by: number | null;
}

/**
 * Maps to the 'users' table.
 */
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  email_verified_at: string | null;
  // mobile_verified_at: Date | null; // Backend doesn't seem to have this yet
  // password?: string; // Should not be in frontend model
  remember_token: string | null;
  created_at: string | null; // Dates from JSON are strings
  updated_at: string | null;
  role_id: number | null;
  role?: Role;
  avatar_url?: string;
  is_active: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

/**
 * Maps to the 'addresses' table.
 */
export interface Address {
  id: number;
  user_id: number;
  label: string;
  full_address: string;
  city: string | null;
  zip_code: string | null;
  is_default: boolean;
}

/**
 * Maps to the 'rider_details' table.
 */
export interface RiderDetails {
  user_id: number;
  vehicle_type: string | null;
  license_plate: string | null;
  id_document_url: string | null;
  license_document_url: string | null;
  is_verified: boolean;
  availability_status: 'online' | 'offline';
  current_latitude: number | null;
  current_longitude: number | null;
}


/**
 * Maps to the 'categories' table.
 */
export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: Date | null;
  updated_at: Date | null;
  // Relationship: Optional Sub-categories
  children?: Category[];
}

/**
 * Maps to the 'add_ons' table.
 */
export interface AddOn {
  id: number;
  name: string;
  price: number;
}

/**
 * Maps to the 'item_variants' table.
 */
export interface ItemVariant {
  id: number;
  menu_item_id: number;
  name: string; // e.g., "Small", "Large", "Regular"
  price: number;
  is_available: boolean;
  created_at: Date | null;
  updated_at: Date | null;
  // Relationship: Optional Parent MenuItem
  menu_item?: MenuItem;
}

/**
 * Maps to the 'menu_items' table.
 */
export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  created_at: Date | null;
  updated_at: Date | null;
  // Relationships
  variants: ItemVariant[];
  add_ons?: AddOn[];
  category?: Category;
}

export interface CartItem {
  menuItem: MenuItem;
  variant: ItemVariant;
  quantity: number;
  selected_add_ons: AddOn[];
  customization_notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type OrderType = 'delivery' | 'dine-in' | 'takeaway';

export type TableStatus = 'available' | 'occupied' | 'reserved';
/**
 * Maps to the 'tables' table.
 */
export interface Table {
  id: number;
  name_or_number: string;
  capacity: number;
  status: TableStatus;
}

export type PaymentMethodType = 'cash' | 'card' | 'online' | 'bank' | 'others';

/**
 * Maps to the 'payment_methods' table (restaurant's methods).
 */
export interface PaymentMethod {
  id: number;
  name: string;
  type: PaymentMethodType;
  is_active: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}

export type PaymentStatus = 'paid' | 'failed' | 'refunded';

/**
 * Maps to the 'order_payments' table.
 */
export interface OrderPayment {
  id: number;
  order_id: number;
  payment_method_id: number;
  amount: number;
  status: PaymentStatus;
  transaction_id: string | null;
  payment_date: Date;
  // Relationship
  payment_method?: PaymentMethod;
}

/**
 * Maps to the 'order_item_add_ons' pivot table.
 */
export interface OrderItemAddOn {
  order_item_id: number;
  add_on_id: number;
  quantity: number;
  price: number;
  // Relationship
  add_on?: AddOn;
}

/**
 * Maps to the 'order_items' table.
 */
export interface OrderItem {
  id: number;
  order_id: number;
  item_variant_id: number;
  quantity: number;
  unit_price: number;
  customization_notes: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  // Relationships
  add_ons?: OrderItemAddOn[];
  variant?: ItemVariant;
  /** **NEW:** Relationship to the MenuItem, accessed via the variant's menu_item_id. */
  menu_item?: MenuItem; 
}

/**
 * Maps to the 'orders' table.
 */
export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  order_type: OrderType;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  delivery_charge: number;
  total_amount: number;
  special_instructions: string | null;
  delivery_address_id: number | null; // Foreign Key
  table_id: number | null;
  rider_id: number | null;
  staff_id: number | null;
  created_at: Date | null;
  updated_at: Date | null;
  
  // Relationships
  items?: OrderItem[];       
  payments?: OrderPayment[]; 
  table?: Table;             
  rider?: User;              
  staff?: User;
  user?: User; 
  /** **NEW:** Relationship to the Address table via delivery_address_id */
  delivery_address?: Address; 
}


export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

/**
 * Maps to the 'reservations' table.
 */
export interface Reservation {
  id: number;
  user_id: number;
  table_id: number | null;
  num_guests: number;
  reservation_time: Date;
  status: ReservationStatus;
  notes: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  // Relationships
  user?: User;
  table?: Table;
}

/**
 * For customer's saved cards.
 */
export interface CustomerPaymentMethod {
    id: number;
    user_id: number;
    type: 'Card';
    card_brand: string;
    last4: string;
    expiry_date: string;
    is_default: boolean;
}

export interface Notification {
    id: string;
    user_id: number;
    title: string;
    message: string;
    created_at: Date;
    is_read: boolean;
}

/**
 * Maps to the 'expense_categories' table.
 */
export interface ExpenseCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

/**
 * Maps to the 'expenses' table.
 */
export interface Expense {
  id: number;
  expense_category_id: number;
  user_id: number | null;
  amount: number;
  description: string;
  expense_date: string; // DATE
  created_at: Date | null;
  updated_at: Date | null;
  // Relationships
  expense_category?: ExpenseCategory;
  user?: User;
}

export interface Payout {
    id: number;
    user_id: number;
    amount: number;
    requested_at: Date;
    status: 'pending' | 'approved' | 'rejected';
    completed_at?: Date | null;
}

export interface Promotion {
  id: number;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  usage_limit: number | null;
  used_count: number;
}
