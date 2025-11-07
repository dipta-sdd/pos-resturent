import React from 'react';
import { HashRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <CartProvider>
              <AppRouter />
            </CartProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
