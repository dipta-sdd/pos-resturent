

// FIX: Corrected imports to match exported members from mockData.
import { mockUsers, mockCategories, mockMenuItems, mockOrders, mockTables, mockReservations, mockAddOns, mockCustomerPaymentMethods, mockNotifications, mockExpenseCategories, mockPayouts, mockAddresses, mockExpenses, mockItemVariants } from '../data/mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Mock API functions
export const api = {
  // Public
  getFeaturedMenuItems: async () => {
    await delay(300);
    return mockMenuItems.filter(item => item.is_featured);
  },
  getMenuItems: async (categoryId?: number) => {
    await delay(500);
    if (categoryId) {
      return mockMenuItems.filter(item => item.category_id === categoryId);
    }
    return mockMenuItems;
  },
  getMenuItemById: async (id: number) => {
    await delay(200);
    const item = mockMenuItems.find(item => item.id === id) || null;
    if (item) {
        // Simple mock for variants if they are not explicitly defined on the item
        if (!item.variants || item.variants.length === 0) {
            const variant = mockItemVariants.find(v => v.menu_item_id === id);
            return { ...item, variants: variant ? [variant] : [] };
        }
    }
    return item;
  },
  getCategories: async () => {
    await delay(200);
    return mockCategories;
  },
  getAddOns: async () => {
    await delay(100);
    return mockAddOns;
  },

  // Customer
  getCustomerOrders: async (userId: number) => {
    await delay(600);
    return mockOrders.filter(order => order.user_id === userId).sort((a, b) => (b.created_at?.getTime() || 0) - (a.created_at?.getTime() || 0));
  },
  getOrderById: async (orderId: string | number) => {
    await delay(300);
    const numericId = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;
    return mockOrders.find(order => order.id === numericId) || null;
  },
  placeOrder: async (orderData: any) => {
    await delay(1000);
    const newOrder = {
        ...orderData,
        id: Math.floor(Math.random() * 10000) + 1000,
        status: 'confirmed',
        created_at: new Date(),
    };
    mockOrders.unshift(newOrder as any);
    return { success: true, order: newOrder };
  },
  getCustomerReservations: async (userId: number) => {
      await delay(500);
      return mockReservations.filter(r => r.user_id === userId).sort((a, b) => b.reservation_time.getTime() - a.reservation_time.getTime());
  },
  getReservationById: async (reservationId: number) => {
      await delay(300);
      return mockReservations.find(r => r.id === reservationId) || null;
  },
  createReservation: async (reservationData: any) => {
      await delay(800);
      const newReservation = {
          ...reservationData,
          id: Math.floor(Math.random() * 100) + 10,
          status: 'pending',
          created_at: new Date(),
          reservation_time: new Date(reservationData.reservation_time),
      };
      mockReservations.push(newReservation as any);
      return { success: true, reservation: newReservation };
  },
  getCustomerAddresses: async (userId: number) => {
      await delay(300);
      return mockAddresses.filter(a => a.user_id === userId);
  },
  getCustomerPaymentMethods: async (userId: number) => {
      await delay(300);
      return mockCustomerPaymentMethods.filter(pm => pm.user_id === userId);
  },
  getNotifications: async (userId: number) => {
    await delay(400);
    return mockNotifications.filter(n => n.user_id === userId);
  },

  // POS/Staff
  getActiveOrders: async () => {
    await delay(400);
    return mockOrders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  },
  getTables: async () => {
      await delay(300);
      return mockTables;
  },

  // Rider
  getRiderDeliveries: async (riderId: number) => {
    await delay(500);
    return mockOrders.filter(o => o.order_type === 'delivery' && o.status !== 'delivered');
  },
  getRiderDeliveryHistory: async (riderId: number) => {
    await delay(700);
    return mockOrders.filter(o => o.order_type === 'delivery' && o.status === 'delivered');
  },

  // Admin
  getAllUsers: async () => {
      await delay(500);
      return mockUsers;
  },
  getAllOrders: async () => {
      await delay(800);
      return mockOrders;
  },
  getAllReservations: async () => {
      await delay(600);
      return mockReservations;
  },
  getExpenseCategories: async () => {
    await delay(200);
    return mockExpenseCategories;
  },
  getPayouts: async () => {
    await delay(500);
    return mockPayouts;
  },
};
