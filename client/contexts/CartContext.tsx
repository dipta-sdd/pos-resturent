

'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { CartItem, MenuItem, AddOn, ItemVariant } from '@/types';
// FIX: Import 'mockItemVariants' which was missing.
import { mockMenuItems, mockItemVariants } from '../data/mockData';

interface CartContextType {
  cartItems: CartItem[];
  addItem: (item: MenuItem, variant: ItemVariant, quantity: number, add_ons: AddOn[], notes?: string) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Pre-populate cart for demo purposes
const initialCartItems: CartItem[] = [
  {
    menuItem: mockMenuItems.find(i => i.id === 4)!, // Butter Chicken
    variant: mockItemVariants.find(v => v.menu_item_id === 4)!,
    quantity: 1,
    selected_add_ons: [],
  },
  {
    menuItem: mockMenuItems.find(i => i.id === 19)!, // Garlic Naan
    variant: mockItemVariants.find(v => v.menu_item_id === 19)!,
    quantity: 2,
    selected_add_ons: [],
  },
  {
    menuItem: mockMenuItems.find(i => i.id === 8)!, // Mango Lassi
    variant: mockItemVariants.find(v => v.menu_item_id === 8)!,
    quantity: 1,
    selected_add_ons: [],
  }
].filter(item => item.menuItem && item.variant); // Filter out undefined items


export const CartProvider = ({ children }: { children?: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const addItem = useCallback((menuItem: MenuItem, variant: ItemVariant, quantity: number, selected_add_ons: AddOn[], customization_notes?: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.variant.id === variant.id && JSON.stringify(item.selected_add_ons) === JSON.stringify(selected_add_ons));
      if (existingItem) {
        return prevItems.map(item =>
          item.variant.id === variant.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { menuItem, variant, quantity, selected_add_ons, customization_notes }];
    });
  }, []);

  const removeItem = useCallback((variantId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.variant.id !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.variant.id === variantId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => {
    const addOnsTotal = item.selected_add_ons.reduce((sum, addon) => sum + addon.price, 0);
    return total + (item.variant.price + addOnsTotal) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};