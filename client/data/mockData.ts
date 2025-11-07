// FIX: Added missing types to import.
import { User, MenuItem, Category, Order, OrderStatus, OrderType, AddOn, Table, Reservation, Address, PaymentMethod, Notification, ExpenseCategory, Payout, Role, ItemVariant, CustomerPaymentMethod, Expense, OrderItem, OrderItemAddOn, Settings } from '../types';

export const mockRoles: Role[] = [
  { id: 1, name: 'admin', can_manage_shop_settings: true, can_manage_billing_and_plan: true, can_manage_branches_and_counters: true, can_manage_payment_methods: true, can_configure_taxes: true, can_customize_receipts: true, can_manage_staff: true, can_manage_roles_and_permissions: true, can_view_user_activity_log: true, can_view_products: true, can_manage_products: true, can_manage_categories: true, can_manage_units_of_measure: true, can_import_products: true, can_export_products: true, can_view_inventory_levels: true, can_perform_stock_adjustments: true, can_manage_stock_transfers: true, can_manage_purchase_orders: true, can_receive_purchase_orders: true, can_manage_suppliers: true, can_use_pos: true, can_view_sales_history: true, can_override_prices: true, can_apply_manual_discounts: true, can_void_sales: true, can_process_returns: true, can_issue_cash_refunds: true, can_issue_store_credit: true, can_view_customers: true, can_manage_customers: true, can_open_close_cash_register: true, can_perform_cash_transactions: true, can_manage_expenses: true, can_view_dashboard: true, can_view_reports: true, can_view_profit_loss_data: true, can_export_data: true, created_at: new Date(), updated_at: new Date(), created_by: null, updated_by: null },
  { id: 2, name: 'staff', can_manage_shop_settings: false, can_manage_billing_and_plan: false, can_manage_branches_and_counters: false, can_manage_payment_methods: false, can_configure_taxes: false, can_customize_receipts: false, can_manage_staff: false, can_manage_roles_and_permissions: false, can_view_user_activity_log: false, can_view_products: true, can_manage_products: false, can_manage_categories: false, can_manage_units_of_measure: false, can_import_products: false, can_export_products: false, can_view_inventory_levels: true, can_perform_stock_adjustments: false, can_manage_stock_transfers: false, can_manage_purchase_orders: false, can_receive_purchase_orders: false, can_manage_suppliers: false, can_use_pos: true, can_view_sales_history: true, can_override_prices: false, can_apply_manual_discounts: true, can_void_sales: false, can_process_returns: true, can_issue_cash_refunds: false, can_issue_store_credit: true, can_view_customers: true, can_manage_customers: false, can_open_close_cash_register: true, can_perform_cash_transactions: true, can_manage_expenses: false, can_view_dashboard: true, can_view_reports: false, can_view_profit_loss_data: false, can_export_data: false, created_at: new Date(), updated_at: new Date(), created_by: 1, updated_by: 1 },
  { id: 3, name: 'rider', can_manage_shop_settings: false, can_manage_billing_and_plan: false, can_manage_branches_and_counters: false, can_manage_payment_methods: false, can_configure_taxes: false, can_customize_receipts: false, can_manage_staff: false, can_manage_roles_and_permissions: false, can_view_user_activity_log: false, can_view_products: false, can_manage_products: false, can_manage_categories: false, can_manage_units_of_measure: false, can_import_products: false, can_export_products: false, can_view_inventory_levels: false, can_perform_stock_adjustments: false, can_manage_stock_transfers: false, can_manage_purchase_orders: false, can_receive_purchase_orders: false, can_manage_suppliers: false, can_use_pos: false, can_view_sales_history: false, can_override_prices: false, can_apply_manual_discounts: false, can_void_sales: false, can_process_returns: false, can_issue_cash_refunds: false, can_issue_store_credit: false, can_view_customers: false, can_manage_customers: false, can_open_close_cash_register: false, can_perform_cash_transactions: false, can_manage_expenses: false, can_view_dashboard: true, can_view_reports: false, can_view_profit_loss_data: false, can_export_data: false, created_at: new Date(), updated_at: new Date(), created_by: 1, updated_by: 1 },
  { id: 4, name: 'customer', can_manage_shop_settings: false, can_manage_billing_and_plan: false, can_manage_branches_and_counters: false, can_manage_payment_methods: false, can_configure_taxes: false, can_customize_receipts: false, can_manage_staff: false, can_manage_roles_and_permissions: false, can_view_user_activity_log: false, can_view_products: true, can_manage_products: false, can_manage_categories: false, can_manage_units_of_measure: false, can_import_products: false, can_export_products: false, can_view_inventory_levels: false, can_perform_stock_adjustments: false, can_manage_stock_transfers: false, can_manage_purchase_orders: false, can_receive_purchase_orders: false, can_manage_suppliers: false, can_use_pos: false, can_view_sales_history: true, can_override_prices: false, can_apply_manual_discounts: false, can_void_sales: false, can_process_returns: false, can_issue_cash_refunds: false, can_issue_store_credit: false, can_view_customers: true, can_manage_customers: false, can_open_close_cash_register: false, can_perform_cash_transactions: false, can_manage_expenses: false, can_view_dashboard: true, can_view_reports: false, can_view_profit_loss_data: false, can_export_data: false, created_at: new Date(), updated_at: new Date(), created_by: 1, updated_by: 1 },
];

export const mockUsers: User[] = [
  { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@example.com', mobile: '111-222-3333', email_verified_at: new Date(), mobile_verified_at: new Date(), remember_token: null, created_at: new Date(), updated_at: new Date(), role_id: 1, avatar_url: 'https://picsum.photos/seed/admin/100' },
  { id: 2, firstName: 'Staff', lastName: 'User', email: 'staff@example.com', mobile: '222-333-4444', email_verified_at: new Date(), mobile_verified_at: new Date(), remember_token: null, created_at: new Date(), updated_at: new Date(), role_id: 2, avatar_url: 'https://picsum.photos/seed/staff/100' },
  { id: 3, firstName: 'Rider', lastName: 'User', email: 'rider@example.com', mobile: '333-444-5555', email_verified_at: new Date(), mobile_verified_at: new Date(), remember_token: null, created_at: new Date(), updated_at: new Date(), role_id: 3, avatar_url: 'https://picsum.photos/seed/rider/100' },
  { id: 4, firstName: 'Customer', lastName: 'User', email: 'customer@example.com', mobile: '444-555-6666', email_verified_at: new Date(), mobile_verified_at: new Date(), remember_token: null, created_at: new Date(), updated_at: new Date(), role_id: 4, avatar_url: 'https://i.imgur.com/CR1N22g.png' },
];

// FIX: Added missing properties to conform to the Category type.
export const mockCategories: Category[] = [
  { id: 1, name: 'Appetizers', description: 'Start your meal with a tasty bite.', parent_id: null, image_url: null, sort_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 2, name: 'Soups & Salads', description: 'Fresh and hearty options.', parent_id: null, image_url: null, sort_order: 2, created_at: new Date(), updated_at: new Date() },
  { id: 3, name: 'Main Course', description: 'Hearty and delicious main dishes.', parent_id: null, image_url: null, sort_order: 3, created_at: new Date(), updated_at: new Date() },
  { id: 4, name: 'Breads & Rice', description: 'Classic Indian breads and rice dishes.', parent_id: null, image_url: null, sort_order: 4, created_at: new Date(), updated_at: new Date()},
  { id: 5, name: 'Desserts', description: 'Sweet treats to end your meal.', parent_id: null, image_url: null, sort_order: 5, created_at: new Date(), updated_at: new Date() },
  { id: 6, name: 'Beverages', description: 'Refreshing beverages.', parent_id: null, image_url: null, sort_order: 6, created_at: new Date(), updated_at: new Date() },
  // Sub-categories
  { id: 7, name: 'Vegetarian Mains', description: 'Delicious plant-based main courses.', parent_id: 3, image_url: null, sort_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 8, name: 'Non-Vegetarian Mains', description: 'Flavorful meat and poultry main courses.', parent_id: 3, image_url: null, sort_order: 2, created_at: new Date(), updated_at: new Date() },
  { id: 9, name: 'Lassi & Shakes', description: 'Yogurt-based drinks and milkshakes.', parent_id: 6, image_url: null, sort_order: 1, created_at: new Date(), updated_at: new Date() },
  { id: 10, name: 'Hot Beverages', description: 'Warm and comforting drinks.', parent_id: 6, image_url: null, sort_order: 2, created_at: new Date(), updated_at: new Date() },
];

export const mockAddOns: AddOn[] = [
    { id: 1, name: 'Extra Paneer', price: 2.50 },
    { id: 2, name: 'Extra Chicken', price: 3.00 },
    { id: 3, name: 'Garlic Naan Upgrade', price: 1.50 },
    { id: 4, name: 'Spicy Sauce', price: 0.75 },
];

// FIX: Added mockItemVariants to be used in mockMenuItems and throughout the app.
export const mockItemVariants: ItemVariant[] = [
  { id: 1, menu_item_id: 1, name: 'Regular', price: 6.99, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 2, menu_item_id: 2, name: 'Regular', price: 10.50, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 15, menu_item_id: 15, name: 'Regular', price: 5.50, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 16, menu_item_id: 16, name: 'Regular', price: 6.75, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 4, menu_item_id: 4, name: 'Full Portion', price: 17.50, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 20, menu_item_id: 4, name: 'Half Portion', price: 10.50, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 17, menu_item_id: 17, name: 'Regular', price: 21.00, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 22, menu_item_id: 17, name: 'Family Pack', price: 38.00, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 18, menu_item_id: 18, name: 'Regular', price: 13.50, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 3, menu_item_id: 3, name: 'Regular', price: 15.00, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 19, menu_item_id: 19, name: 'Regular', price: 4.50, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 6, menu_item_id: 6, name: 'Regular', price: 5.50, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 7, menu_item_id: 7, name: 'Regular', price: 6.00, is_available: false, created_at: new Date(), updated_at: new Date() },
  { id: 8, menu_item_id: 8, name: 'Regular', price: 4.50, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 21, menu_item_id: 8, name: 'Large', price: 6.00, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 9, menu_item_id: 9, name: 'Regular', price: 3.50, is_available: true, created_at: new Date(), updated_at: new Date() },
  { id: 10, menu_item_id: 10, name: 'Regular', price: 12.50, is_available: false, created_at: new Date(), updated_at: new Date() },
  { id: 11, menu_item_id: 11, name: 'Regular', price: 3.50, is_available: false, created_at: new Date(), updated_at: new Date() },
  { id: 12, menu_item_id: 12, name: 'Regular', price: 5.50, is_available: false, created_at: new Date(), updated_at: new Date() },
  { id: 13, menu_item_id: 13, name: 'Regular', price: 42.00, is_available: false, created_at: new Date(), updated_at: new Date() },
  { id: 14, menu_item_id: 14, name: 'Regular', price: 34.00, is_available: false, created_at: new Date(), updated_at: new Date() },
];

// FIX: Removed 'price' property and added 'variants' to conform to the MenuItem type.
export const mockMenuItems: MenuItem[] = [
  // Appetizers (category_id: 1)
  { id: 1, category_id: 1, name: 'Vegetable Samosas', description: 'Crispy pastry filled with spiced potatoes and peas.', image_url: 'https://picsum.photos/seed/samosa/400/300', is_available: true, is_featured: false, add_ons: [mockAddOns[3]], variants: mockItemVariants.filter(v => v.menu_item_id === 1), created_at: new Date(), updated_at: new Date() },
  { id: 2, category_id: 1, name: 'Chicken Tikka Skewers', description: 'Tender chicken pieces marinated in yogurt and spices, grilled in a tandoor.', image_url: 'https://picsum.photos/seed/chickentikka/400/300', is_available: true, is_featured: false, add_ons: [mockAddOns[3]], variants: mockItemVariants.filter(v => v.menu_item_id === 2), created_at: new Date(), updated_at: new Date() },
  
  // Soups & Salads (category_id: 2)
  { id: 15, category_id: 2, name: 'Lentil Soup (Dal Shorba)', description: 'A traditional and flavorful soup made from yellow lentils and spices.', image_url: 'https://picsum.photos/seed/dalsoup/400/300', is_available: true, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 15), created_at: new Date(), updated_at: new Date() },
  { id: 16, category_id: 2, name: 'Kachumber Salad', description: 'A refreshing salad of chopped onions, tomatoes, cucumbers, and a lemon-coriander dressing.', image_url: 'https://picsum.photos/seed/salad/400/300', is_available: true, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 16), created_at: new Date(), updated_at: new Date() },
  
  // Non-Vegetarian Mains (category_id: 8)
  { id: 4, category_id: 8, name: 'Butter Chicken', description: 'Grilled chicken simmered in a rich, buttery tomato gravy. A classic favorite.', image_url: 'https://picsum.photos/seed/butterchicken/400/300', is_available: true, is_featured: true, add_ons: [mockAddOns[1]], variants: mockItemVariants.filter(v => v.menu_item_id === 4), created_at: new Date(), updated_at: new Date() },
  { id: 17, category_id: 8, name: 'Lamb Biryani', description: 'Aromatic basmati rice cooked with tender lamb and fragrant spices.', image_url: 'https://picsum.photos/seed/biryani/400/300', is_available: true, is_featured: true, variants: mockItemVariants.filter(v => v.menu_item_id === 17), created_at: new Date(), updated_at: new Date() },
  
  // Vegetarian Mains (category_id: 7)
  { id: 18, category_id: 7, name: 'Chana Masala', description: 'Hearty chickpea curry cooked with onions, tomatoes, and a blend of spices.', image_url: 'https://picsum.photos/seed/chana/400/300', is_available: true, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 18), created_at: new Date(), updated_at: new Date() },
  { id: 3, category_id: 7, name: 'Paneer Butter Masala', description: 'Cottage cheese cubes in a creamy tomato and butter sauce.', image_url: 'https://picsum.photos/seed/paneer/400/300', is_available: true, is_featured: true, add_ons: [mockAddOns[0]], variants: mockItemVariants.filter(v => v.menu_item_id === 3), created_at: new Date(), updated_at: new Date() },

  // Breads & Rice (category_id: 4)
  { id: 19, category_id: 4, name: 'Garlic Naan', description: 'Soft, fluffy flatbread baked in a tandoor oven with fresh garlic and cilantro.', image_url: 'https://picsum.photos/seed/naan/400/300', is_available: true, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 19), created_at: new Date(), updated_at: new Date() },

  // Desserts (category_id: 5)
  { id: 6, category_id: 5, name: 'Gulab Jamun', description: 'Soft, deep-fried dough balls soaked in a sweet, fragrant syrup.', image_url: 'https://picsum.photos/seed/gulabjamun/400/300', is_available: true, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 6), created_at: new Date(), updated_at: new Date() },
  { id: 7, category_id: 5, name: 'Ras Malai', description: 'Spongy cottage cheese patties soaked in thickened, sweet, saffron-flavored milk.', image_url: 'https://picsum.photos/seed/rasmalai/400/300', is_available: false, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 7), created_at: new Date(), updated_at: new Date() },
  
  // Lassi & Shakes (category_id: 9)
  { id: 8, category_id: 9, name: 'Mango Lassi', description: 'A refreshing yogurt-based drink blended with sweet mango pulp.', image_url: 'https://picsum.photos/seed/lassi/400/300', is_available: true, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 8), created_at: new Date(), updated_at: new Date() },

  // Hot Beverages (category_id: 10)
  { id: 9, category_id: 10, name: 'Masala Chai', description: 'Traditional Indian spiced tea brewed with milk and aromatic spices.', image_url: 'https://picsum.photos/seed/chai/400/300', is_available: true, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 9), created_at: new Date(), updated_at: new Date() },
  
  // Uncategorized / Disabled
  { id: 10, category_id: 1, name: 'Spicy Tuna Roll', description: 'Fresh tuna with a spicy mayo sauce.', image_url: 'https://i.imgur.com/U8A9UfU.png', is_available: false, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 10), created_at: new Date(), updated_at: new Date() },
  { id: 11, category_id: 1, name: 'Miso Soup', description: 'Traditional Japanese soup with tofu and seaweed.', image_url: 'https://i.imgur.com/9564Bpe.png', is_available: false, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 11), created_at: new Date(), updated_at: new Date() },
  { id: 12, category_id: 1, name: 'Edamame', description: 'Steamed soybeans with sea salt.', image_url: 'https://i.imgur.com/A68A7QW.png', is_available: false, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 12), created_at: new Date(), updated_at: new Date() },
  { id: 13, category_id: 3, name: 'Prime Ribeye Steak', description: '14oz steak with garlic mashed potatoes and asparagus.', image_url: 'https://picsum.photos/seed/ribeye/400/300', is_available: false, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 13), created_at: new Date(), updated_at: new Date() },
  { id: 14, category_id: 4, name: 'Lobster Ravioli', description: 'House-made pasta filled with fresh lobster in a cream sauce.', image_url: 'https://picsum.photos/seed/ravioli/400/300', is_available: false, is_featured: false, variants: mockItemVariants.filter(v => v.menu_item_id === 14), created_at: new Date(), updated_at: new Date() },
];

export const mockTables: Table[] = [
    { id: 1, name_or_number: 'Table 1', capacity: 2, status: 'available' },
    { id: 2, name_or_number: 'Table 2', capacity: 4, status: 'occupied' },
    { id: 3, name_or_number: 'Table 3', capacity: 4, status: 'reserved' },
    { id: 4, name_or_number: 'Patio 1', capacity: 6, status: 'available' },
];

export const mockAddresses: Address[] = [
    { id: 1, user_id: 4, label: 'Default Address', full_address: '123 Main Street, Anytown, USA', is_default: true, city: 'Anytown', zip_code: '12345' },
    { id: 2, user_id: 4, label: 'Work Address', full_address: '456 Oak Avenue, Springfield, USA', is_default: false, city: 'Springfield', zip_code: '54321' },
];

const customerUser = mockUsers.find(u => u.id === 4)!;
const staffUser = mockUsers.find(u => u.id === 2)!;
const riderUser = mockUsers.find(u => u.id === 3)!;
const table1 = mockTables.find(t => t.id === 1)!;
const table2 = mockTables.find(t => t.id === 2)!;
const table3 = mockTables.find(t => t.id === 3)!;
const table4 = mockTables.find(t => t.id === 4)!;
const address1 = mockAddresses.find(a => a.id === 1)!;
const address2 = mockAddresses.find(a => a.id === 2)!;


// Helper variables for creating consistent mock order items
const order101_item1_variant = mockItemVariants.find(v => v.id === 20)!; // Butter chicken half
const order101_item1_menu_item = mockMenuItems.find(mi => mi.id === order101_item1_variant.menu_item_id)!;
const order101_item2_variant = mockItemVariants.find(v => v.id === 19)!; // Garlic Naan
const order101_item2_menu_item = mockMenuItems.find(mi => mi.id === order101_item2_variant.menu_item_id)!;
const order101_subtotal = order101_item1_variant.price * 1 + order101_item2_variant.price * 2; // 10.50 + 4.50*2 = 19.50
const order101_tax = order101_subtotal * 0.08;
const order101_delivery = 3.00;
const order101_total = order101_subtotal + order101_tax + order101_delivery;

const order102_item1_variant = mockItemVariants.find(v => v.id === 1)!; // Samosas
const order102_item1_menu_item = mockMenuItems.find(mi => mi.id === order102_item1_variant.menu_item_id)!;
const order102_item2_variant = mockItemVariants.find(v => v.id === 8)!; // Mango Lassi
const order102_item2_menu_item = mockMenuItems.find(mi => mi.id === order102_item2_variant.menu_item_id)!;
const order102_subtotal = order102_item1_variant.price * 1 + order102_item2_variant.price * 1; // 6.99 + 4.50 = 11.49
const order102_tax = order102_subtotal * 0.08;
const order102_total = order102_subtotal + order102_tax;

const order103_item1_variant = mockItemVariants.find(v => v.id === 17)!; // Lamb Biryani
const order103_item1_menu_item = mockMenuItems.find(mi => mi.id === order103_item1_variant.menu_item_id)!;
const order103_subtotal = order103_item1_variant.price * 2; // 21.00 * 2 = 42.00
const order103_tax = order103_subtotal * 0.08;
const order103_total = order103_subtotal + order103_tax;

// FIX: Corrected all mock data to match the defined types in types.ts.
export const mockOrders: Order[] = [
  { id: 101, user_id: 4, user: customerUser, status: 'delivered', order_type: 'delivery', subtotal: order101_subtotal, tax_amount: order101_tax, discount_amount: 0, delivery_charge: order101_delivery, total_amount: order101_total, created_at: new Date('2023-10-27T10:00:00Z'), 
    items: [
        { id: 1, order_id: 101, item_variant_id: 20, quantity: 1, unit_price: order101_item1_variant.price, add_ons: [], customization_notes: null, created_at: new Date(), updated_at: new Date(), variant: order101_item1_variant, menu_item: order101_item1_menu_item }, 
        { id: 2, order_id: 101, item_variant_id: 19, quantity: 2, unit_price: order101_item2_variant.price, add_ons: [], customization_notes: null, created_at: new Date(), updated_at: new Date(), variant: order101_item2_variant, menu_item: order101_item2_menu_item }
    ], 
    payments: [{id: 1, order_id: 101, payment_method_id: 1, amount: order101_total, status: 'paid', transaction_id: 'ch_123', payment_date: new Date() }], delivery_address: address1, rider_id: 3, rider: riderUser, special_instructions: null, delivery_address_id: 1, table_id: null, staff_id: null, updated_at: new Date() },
  { id: 102, user_id: 4, user: customerUser, status: 'preparing', order_type: 'takeaway', subtotal: order102_subtotal, tax_amount: order102_tax, discount_amount: 0, delivery_charge: 0, total_amount: order102_total, created_at: new Date('2023-10-28T12:30:00Z'), 
    items: [
        { id: 3, order_id: 102, item_variant_id: 1, quantity: 1, unit_price: order102_item1_variant.price, add_ons: [], customization_notes: null, created_at: new Date(), updated_at: new Date(), variant: order102_item1_variant, menu_item: order102_item1_menu_item }, 
        { id: 4, order_id: 102, item_variant_id: 8, quantity: 1, unit_price: order102_item2_variant.price, add_ons: [], customization_notes: null, created_at: new Date(), updated_at: new Date(), variant: order102_item2_variant, menu_item: order102_item2_menu_item }
    ], 
    payments: [{id: 2, order_id: 102, payment_method_id: 2, amount: order102_total, status: 'paid', transaction_id: null, payment_date: new Date()}], special_instructions: null, delivery_address_id: null, table_id: null, rider_id: null, staff_id: 2, staff: staffUser, updated_at: new Date() },
  { id: 103, user_id: 2, user: staffUser, status: 'confirmed', order_type: 'dine-in', subtotal: order103_subtotal, tax_amount: order103_tax, discount_amount: 0, delivery_charge: 0, total_amount: order103_total, created_at: new Date('2023-10-28T19:00:00Z'), 
    items: [
        { id: 5, order_id: 103, item_variant_id: 17, quantity: 2, unit_price: order103_item1_variant.price, add_ons: [], customization_notes: null, created_at: new Date(), updated_at: new Date(), variant: order103_item1_variant, menu_item: order103_item1_menu_item }
    ], 
    payments: [{id: 3, order_id: 103, payment_method_id: 1, amount: order103_total/2, status: 'paid', transaction_id: 'ch_456', payment_date: new Date()}, {id: 4, order_id: 103, payment_method_id: 2, amount: order103_total/2, status: 'paid', transaction_id: null, payment_date: new Date()}], special_instructions: 'Allergy to nuts', delivery_address_id: null, table_id: 2, table: table2, rider_id: null, staff_id: 2, staff: staffUser, updated_at: new Date() },
  { id: 104, user_id: 4, user: customerUser, status: 'delivered', order_type: 'delivery', subtotal: 40, tax_amount: 5.5, discount_amount: 0, delivery_charge: 0, total_amount: 45.50, created_at: new Date('2023-10-26T10:00:00Z'), items: [], payments: [], special_instructions: null, delivery_address_id: 1, delivery_address: address1, table_id: null, rider_id: 3, rider: riderUser, staff_id: null, updated_at: new Date() },
  { id: 105, user_id: 4, user: customerUser, status: 'preparing', order_type: 'takeaway', subtotal: 20, tax_amount: 2.75, discount_amount: 0, delivery_charge: 0, total_amount: 22.75, created_at: new Date('2023-10-22T12:30:00Z'), items: [], payments: [], special_instructions: null, delivery_address_id: null, table_id: null, rider_id: null, staff_id: 2, staff: staffUser, updated_at: new Date() },
  { id: 106, user_id: 4, user: customerUser, status: 'cancelled', order_type: 'dine-in', subtotal: 80, tax_amount: 9.1, discount_amount: 0, delivery_charge: 0, total_amount: 89.10, created_at: new Date('2023-09-15T19:00:00Z'), items: [], payments: [], special_instructions: null, delivery_address_id: null, table_id: 4, table: table4, rider_id: null, staff_id: 2, staff: staffUser, updated_at: new Date() },
  { id: 107, user_id: 4, user: customerUser, status: 'delivered', order_type: 'delivery', subtotal: 28, tax_amount: 3, discount_amount: 0, delivery_charge: 0, total_amount: 31.00, created_at: new Date('2023-08-30T11:00:00Z'), items: [], payments: [], special_instructions: null, delivery_address_id: 2, delivery_address: address2, table_id: null, rider_id: 3, rider: riderUser, staff_id: null, updated_at: new Date() },
  { id: 108, user_id: 4, user: customerUser, status: 'delivered', order_type: 'delivery', subtotal: 50, tax_amount: 5.2, discount_amount: 0, delivery_charge: 0, total_amount: 55.20, created_at: new Date('2023-08-25T14:20:00Z'), items: [], payments: [], special_instructions: null, delivery_address_id: 1, delivery_address: address1, table_id: null, rider_id: 3, rider: riderUser, staff_id: null, updated_at: new Date() },
  { id: 109, user_id: 4, user: customerUser, status: 'preparing', order_type: 'takeaway', subtotal: 16, tax_amount: 2, discount_amount: 0, delivery_charge: 0, total_amount: 18.00, created_at: new Date('2023-08-21T09:45:00Z'), items: [], payments: [], special_instructions: null, delivery_address_id: null, table_id: null, rider_id: null, staff_id: 2, staff: staffUser, updated_at: new Date() },
  { id: 110, user_id: 4, user: customerUser, status: 'cancelled', order_type: 'delivery', subtotal: 40, tax_amount: 2, discount_amount: 0, delivery_charge: 0, total_amount: 42.00, created_at: new Date('2023-08-15T18:00:00Z'), items: [], payments: [], special_instructions: null, delivery_address_id: 1, delivery_address: address1, table_id: null, rider_id: null, staff_id: null, updated_at: new Date() },
  { id: 111, user_id: 4, user: customerUser, status: 'delivered', order_type: 'dine-in', subtotal: 100, tax_amount: 12.5, discount_amount: 0, delivery_charge: 0, total_amount: 112.50, created_at: new Date('2023-08-10T20:10:00Z'), items: [], payments: [], special_instructions: null, delivery_address_id: null, table_id: 1, table: table1, rider_id: null, staff_id: 2, staff: staffUser, updated_at: new Date() },
  { id: 112, user_id: 4, user: customerUser, status: 'delivered', order_type: 'takeaway', subtotal: 22, tax_amount: 3, discount_amount: 0, delivery_charge: 0, total_amount: 25.00, created_at: new Date('2023-08-05T13:00:00Z'), items: [], payments: [], special_instructions: null, delivery_address_id: null, table_id: null, rider_id: null, staff_id: 2, staff: staffUser, updated_at: new Date() },
  { id: 113, user_id: 4, user: customerUser, status: 'preparing', order_type: 'delivery', subtotal: 70, tax_amount: 8.3, discount_amount: 0, delivery_charge: 0, total_amount: 78.30, created_at: new Date('2023-08-01T19:55:00Z'), items: [], payments: [], special_instructions: null, delivery_address_id: 2, delivery_address: address2, table_id: null, rider_id: 3, rider: riderUser, staff_id: null, updated_at: new Date() },
];

export const mockReservations: Reservation[] = [
    { id: 1, user_id: 4, table_id: 3, user: customerUser, table: table3, num_guests: 4, reservation_time: new Date('2023-11-15T19:30:00Z'), status: 'confirmed', notes: 'Window seat if possible.', created_at: new Date(), updated_at: new Date() },
    { id: 2, user_id: 4, table_id: 4, user: customerUser, table: table4, num_guests: 2, reservation_time: new Date('2024-12-24T20:00:00Z'), status: 'pending', notes: null, created_at: new Date(), updated_at: new Date() },
    { id: 3, user_id: 4, table_id: 1, user: customerUser, table: table1, num_guests: 2, reservation_time: new Date('2023-10-25T19:30:00Z'), status: 'completed', notes: null, created_at: new Date(), updated_at: new Date() },
    { id: 4, user_id: 4, table_id: 2, user: customerUser, table: table2, num_guests: 3, reservation_time: new Date('2023-09-10T18:00:00Z'), status: 'cancelled', notes: 'User cancelled due to schedule conflict.', created_at: new Date(), updated_at: new Date() },
    { id: 5, user_id: 4, table_id: null, user: customerUser, table: undefined, num_guests: 1, reservation_time: new Date('2023-11-20T20:30:00Z'), status: 'confirmed', notes: null, created_at: new Date(), updated_at: new Date()},
    { id: 6, user_id: 2, table_id: 4, user: staffUser, table: table4, num_guests: 5, reservation_time: new Date('2023-10-30T18:30:00Z'), status: 'pending', notes: null, created_at: new Date(), updated_at: new Date() },
];

export const mockCustomerPaymentMethods: CustomerPaymentMethod[] = [
    { id: 1, user_id: 4, type: 'Card', card_brand: 'Visa', last4: '4242', expiry_date: '12/25', is_default: true },
    { id: 2, user_id: 4, type: 'Card', card_brand: 'Mastercard', last4: '5555', expiry_date: '08/26', is_default: false },
];

export const mockNotifications: Notification[] = [
    { id: '1', user_id: 4, title: 'Order Delivered!', message: 'Your order #101 has been successfully delivered.', created_at: new Date('2023-10-27T10:35:00Z'), is_read: true },
    { id: '2', user_id: 4, title: 'Order Update', message: 'Your order #102 is now being prepared.', created_at: new Date('2023-10-28T12:32:00Z'), is_read: false },
];

export const mockExpenseCategories: ExpenseCategory[] = [
    { id: 1, name: 'Ingredients', description: 'Raw food materials and supplies.', created_at: new Date(), updated_at: new Date() },
    { id: 2, name: 'Payroll', description: 'Staff salaries and wages.', created_at: new Date(), updated_at: new Date() },
    { id: 3, name: 'Utilities', description: 'Electricity, water, gas, internet.', created_at: new Date(), updated_at: new Date() },
    { id: 4, name: 'Marketing', description: 'Advertising and promotional costs.', created_at: new Date(), updated_at: new Date() },
];

export const mockExpenses: Expense[] = [
    { id: 1, expense_category_id: 1, user_id: 1, amount: 1200.50, description: 'Weekly vegetable supply', expense_date: '2023-10-25', created_at: new Date(), updated_at: new Date(), expense_category: mockExpenseCategories[0] },
    { id: 2, expense_category_id: 3, user_id: 1, amount: 350.00, description: 'October electricity bill', expense_date: '2023-10-28', created_at: new Date(), updated_at: new Date(), expense_category: mockExpenseCategories[2] },
];

export const mockPayouts: Payout[] = [
    { id: 1, user_id: 3, amount: 250.75, requested_at: new Date('2023-10-25'), status: 'approved', completed_at: new Date('2023-10-26') },
    { id: 2, user_id: 3, amount: 180.50, requested_at: new Date('2023-10-28'), status: 'pending', completed_at: null },
    { id: 3, user_id: 3, amount: 50.00, requested_at: new Date('2023-10-22'), status: 'rejected', completed_at: null },
];

export const mockSettings: Settings = {
  restaurantName: "Jaipur Palace",
  restaurantAddress: "123 Spice Street, Downtown, City 12345",
  restaurantPhone: "(555) 123-4567",
  restaurantEmail: "contact@jaipurpalace.com",
  // FIX: Added 'Mon-Fri' and 'Sat-Sun' to satisfy the WorkingHours type.
  workingHours: {
    'Mon-Fri': '11am - 10pm',
    'Sat-Sun': '11am - 11pm',
    'Mon - Thu': '11am - 10pm',
    'Fri - Sat': '11am - 11pm',
    'Sunday': '12pm - 9pm',
  },
  socials: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
  },
  taxRatePercent: 15,
  currencySymbol: "$",
  currencyCode: "USD",
  deliveryChargeFlat: 5.00,
  deliveryRadiusKm: 10,
  minOrderAmountDelivery: 20.00,
  freeDeliveryAt: 50
};