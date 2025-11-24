




import axiosInstance from './axiosConfig';
import { Promotion, PaymentMethod, Order, Reservation, LoginResponse, RegisterResponse, User, Category, AddOn, MenuItem, LaravelPaginatedResponse, LaravelErrorResponse, NormalizedErrorResponse } from '../types';
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
      first_name: data.first_name,
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
    const response = await axiosInstance.get<MenuItem[]>('/public/featured-items');
    return response.data;
  },
  getPublicMenuItems: async () => {
    const response = await axiosInstance.get<MenuItem[]>('/public/menu-items');
    return response.data;
  },
  getPublicCategories: async () => {
    const response = await axiosInstance.get<Category[]>('/public/categories');
    return response.data;
  },
  // end public
  getMenuItems: async (categoryId?: number) => {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await axiosInstance.get<LaravelPaginatedResponse<MenuItem>>('/menu/items', { params });
    return response.data;
  },
  getMenuItemById: async (id: number) => {
    const response = await axiosInstance.get<MenuItem>(`/menu/items/${id}`);
    return response.data;
  },
  createMenuItem: async (data: FormData) => {
    const response = await axiosInstance.post<MenuItem>('/menu/items', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  updateMenuItem: async (id: number, data: FormData) => {
    // Laravel requires _method: PUT for FormData updates
    data.append('_method', 'PUT');
    const response = await axiosInstance.post<MenuItem>(`/menu/items/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deleteMenuItem: async (id: number) => {
    const response = await axiosInstance.delete(`/menu/items/${id}`);
    return response.data;
  },
  updateMenuItemStatus: async (id: number, isActive: boolean) => {
    const response = await axiosInstance.patch<MenuItem>(`/menu/items/${id}/status`, { is_active: isActive });
    return response.data;
  },
  
  // Categories
  getCategories: async () => {
    const response = await axiosInstance.get<Category[]>('/menu/categories');
    return response.data;
  },
  createCategory: async (data: Partial<Category>) => {
    const response = await axiosInstance.post<Category>('/menu/categories', data);
    return response.data;
  },
  updateCategory: async (id: number, data: Partial<Category>) => {
    const response = await axiosInstance.put<Category>(`/menu/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: number) => {
    const response = await axiosInstance.delete(`/menu/categories/${id}`);
    return response.data;
  },
  
  // Add-ons
  getAddOns: async () => {
    const response = await axiosInstance.get<LaravelPaginatedResponse<AddOn>>('/menu/add-ons');
    return response.data;
  },
  createAddOn: async (data: Partial<AddOn>) => {
    const response = await axiosInstance.post<AddOn>('/menu/add-ons', data);
    return response.data;
  },
  updateAddOn: async (id: number, data: Partial<AddOn>) => {
    const response = await axiosInstance.put<AddOn>(`/menu/add-ons/${id}`, data);
    return response.data;
  },
  deleteAddOn: async (id: number) => {
    const response = await axiosInstance.delete(`/menu/add-ons/${id}`);
    return response.data;
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
  },

  normalizeErrors: (errors: LaravelErrorResponse) => {
    const normalizedErrors: NormalizedErrorResponse = {};
    Object.entries(errors).forEach(([key, value]) => {
      normalizedErrors[key] = value[0];
    });
    return normalizedErrors;
  },
};