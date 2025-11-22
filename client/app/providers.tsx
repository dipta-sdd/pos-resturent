'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { SettingsProvider } from '../contexts/SettingsContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import ToastProvider from '../components/ToastProvider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <AuthProvider>
                    <CartProvider>
                        {children}
                        <ToastProvider />
                    </CartProvider>
                </AuthProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
}
