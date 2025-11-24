'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useSettings } from '@/contexts/SettingsContext';

const FloatingCart: React.FC = () => {
    const { cartItems, cartCount, cartTotal, updateQuantity, removeItem } = useCart();
    const { settings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    if (cartCount === 0 && !isOpen) {
        return null;
    }

    const handleCheckout = () => {
        setIsOpen(false);
    }

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-lg w-16 h-16 hover:bg-orange-600 transition-all duration-300 ease-in-out transform hover:scale-110"
                aria-label={`View cart, ${cartCount} items`}
            >
                <ShoppingCart size={28} />
                {cartCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-orange-500"
                        aria-hidden="true"
                    >
                        {cartCount}
                    </span>
                )}
            </button>

            {/* Cart Panel */}
            <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Overlay */}
                <div onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

                {/* Cart Drawer */}
                <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ShoppingCart size={24} /> Your Cart
                        </h2>
                        <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    {cartCount > 0 ? (
                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {cartItems.map(item => (
                                // FIX: Use a more unique key combining menuItem and variant IDs
                                <div key={`${item.menuItem.id}-${item.variant.id}`} className="flex items-center gap-4">
                                    <img src={item.menuItem.image_url || '/placeholder-food.jpg'} alt={item.menuItem.name} className="w-20 h-20 rounded-lg object-cover" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{item.menuItem.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{item.variant.name}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {/* FIX: Use variant.id for updateQuantity */}
                                            <button onClick={() => updateQuantity(item.variant.id, item.quantity - 1)} className="p-1 border rounded-full dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><Minus size={14} /></button>
                                            <span className="font-semibold dark:text-white">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.variant.id, item.quantity + 1)} className="p-1 border rounded-full dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {/* FIX: Use variant price */}
                                        <p className="font-bold text-gray-800 dark:text-gray-100">{settings.currencySymbol}{(item.variant.price * item.quantity).toFixed(2)}</p>
                                        {/* FIX: Use variant.id for removeItem */}
                                        <button onClick={() => removeItem(item.variant.id)} className="text-xs text-red-500 hover:underline mt-1">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                            <ShoppingCart size={64} className="text-gray-300 dark:text-gray-600 mb-4" strokeWidth={1} />
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Your cart is empty</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Add items from the menu to get started.</p>
                        </div>
                    )}


                    {/* Footer */}
                    {cartCount > 0 && (
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Subtotal</span>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">{settings.currencySymbol}{cartTotal.toFixed(2)}</span>
                            </div>
                            <Link href="/checkout" onClick={handleCheckout} className="w-full bg-orange-500 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-orange-600 transition-colors text-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
                                Go to Checkout
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FloatingCart;