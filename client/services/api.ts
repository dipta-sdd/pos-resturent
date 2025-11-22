




import axiosInstance from './axiosConfig';
import { Promotion, PaymentMethod, Order, Reservation, LoginResponse, RegisterResponse, User, Category, AddOn, LaravelPaginatedResponse } from '../types';
import { mockUsers, mockCategories, mockMenuItems, mockOrders, mockTables, mockReservations, mockAddOns, mockCustomerPaymentMethods, mockNotifications, mockExpenseCategories, mockPayouts, mockAddresses, mockExpenses, mockItemVariants, mockPromotions, mockPaymentMethods } from '../data/mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// API functions
export const api = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
  register: async (data: any) => {
    const response = await axiosInstance.post<RegisterResponse>('/auth/register', {
      first_name: data.firstName,
      last_name: data.last_name,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  },

  // Public
  getFeaturedMenuItems: async () => {
    // await delay(300);
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
    const response = await axiosInstance.get<LaravelPaginatedResponse<Category>>('/menu/categories');
    return response.data.data;
  },
  getAddOns: async () => {
    const response = await axiosInstance.get<LaravelPaginatedResponse<AddOn>>('/menu/add-ons');
    return response.data.data;
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
  placeOrder: async (orderData: Omit<Order, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
    await delay(1000);
    const newOrder: Order = {
        ...orderData,
        id: Math.floor(Math.random() * 10000) + 1000,
        status: 'confirmed',
        created_at: new Date(),
        updated_at: new Date(),
    };
    mockOrders.unshift(newOrder);
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
  createReservation: async (reservationData: Omit<Reservation, 'id' | 'status' | 'created_at' | 'updated_at' | 'reservation_time'> & { reservation_time: string | Date }) => {
      await delay(800);
      const newReservation: Reservation = {
          ...reservationData,
          id: Math.floor(Math.random() * 100) + 10,
          status: 'pending',
          created_at: new Date(),
          updated_at: new Date(),
          reservation_time: new Date(reservationData.reservation_time),
      };
      mockReservations.push(newReservation);
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
  getAllExpenses: async () => {
    await delay(500);
    return mockExpenses;
  },
  getExpenseCategories: async () => {
    await delay(200);
    return mockExpenseCategories;
  },
  getPayouts: async () => {
    await delay(500);
    return mockPayouts;
  },
  // Payment Methods
  getAllPaymentMethods: async () => {
      await delay(300);
      return mockPaymentMethods;
  },
  savePaymentMethod: async (method: Partial<PaymentMethod>) => {
      await delay(300);
      if (method.id) {
          const index = mockPaymentMethods.findIndex(m => m.id === method.id);
          if (index !== -1) {
              mockPaymentMethods[index] = { ...mockPaymentMethods[index], ...method, updated_at: new Date() } as PaymentMethod;
              return mockPaymentMethods[index];
          }
      } else {
          const newMethod = { ...method, id: Date.now(), created_at: new Date(), updated_at: new Date() } as PaymentMethod;
          mockPaymentMethods.push(newMethod);
          return newMethod;
      }
      throw new Error("Method not found");
  },
  deletePaymentMethod: async (id: number) => {
      await delay(300);
      const index = mockPaymentMethods.findIndex(m => m.id === id);
      if (index !== -1) {
          mockPaymentMethods.splice(index, 1);
          return true;
      }
      return false;
  },
  // Promotions
  getAllPromotions: async () => {
    await delay(400);
    return mockPromotions;
  },
  createPromotion: async (promo: Partial<Promotion>) => {
    await delay(400);
    const newPromo = { ...promo, id: Date.now() } as Promotion;
    mockPromotions.push(newPromo);
    return newPromo;
  },
  updatePromotion: async (id: number, updates: Partial<Promotion>) => {
      await delay(300);
      const index = mockPromotions.findIndex(p => p.id === id);
      if (index !== -1) {
          mockPromotions[index] = { ...mockPromotions[index], ...updates };
          return mockPromotions[index];
      }
      throw new Error('Promotion not found');
  },
  deletePromotion: async (id: number) => {
      await delay(300);
      const index = mockPromotions.findIndex(p => p.id === id);
      if (index !== -1) {
          mockPromotions.splice(index, 1);
          return true;
      }
      return false;
  }
};