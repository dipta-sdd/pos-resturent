"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link"; // 1. Use next/link
import { usePathname, useRouter } from "next/navigation"; // 2. Use next/navigation for path and routing
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Moon,
  Sun,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  MapPin,
  UserPlus,
} from "lucide-react";
// Assuming these context files are correctly structured and exist in your project:
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useSettings } from "../../contexts/SettingsContext";
import { ThemeSwitch } from "./theme-switch";

const Header: React.FC = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const { settings } = useSettings();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Initialize Next.js router
  const pathname = usePathname(); // Get current path for active link styling

  // Function to determine if a link is active based on the current pathname
  const isActive = (href: string) => {
    // Check if the current path matches the link exactly, or is a subpath
    // For exact match: pathname === href
    // For partial/subpath match: pathname.startsWith(href)
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    router.push("/"); // 3. Use router.push() instead of navigate()
  };

  // --- Re-mapping Class Logic for Next.js Link ---

  // NOTE: In Next.js, we don't use a NavLink-like component, we apply the logic directly to the Link component's children.
  const navLinkClass = (href: string) =>
    `text-gray-300 hover:text-orange-400 transition-colors ${isActive(href) ? "text-orange-400 font-semibold" : ""}`;

  const mobileNavLinkClass = (href: string) =>
    `block py-2 px-3 rounded-md text-base font-medium ${isActive(href) ? "bg-orange-500 text-white" : "text-gray-200 hover:bg-gray-700"}`;

  const dropdownLinkClass =
    "flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors";

  const userName = user ? `${user.firstName} ${user.lastName}` : "";

  return (
    <>
      <header className="bg-gray-900 sticky top-0 z-40 border-b border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-10">
              {/* Replace React Router <Link> with Next.js <Link> */}
              <Link
                href="/"
                className="flex items-center gap-3"
                aria-label={`${settings.restaurantName} Home`}
              >
                <span className="text-3xl font-bold text-white tracking-wider font-serif">
                  {settings.restaurantName}
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-8">
                {/* NavLinks are replaced with Next.js Link and custom active logic */}
                <Link href="/menu" className={navLinkClass("/menu")}>
                  Menu
                </Link>
                <Link href="/reserve" className={navLinkClass("/reserve")}>
                  Reservations
                </Link>
                <Link href="/about" className={navLinkClass("/about")}>
                  About
                </Link>
                <Link href="/contact" className={navLinkClass("/contact")}>
                  Contact
                </Link>
              </nav>
            </div>

            {/* Right: Search & Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Checkout Link */}
              <Link
                href="/checkout"
                className="relative p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                aria-label={`View cart, ${cartCount} items`}
              >
                <ShoppingCart className="h-6 w-6 text-white" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-gray-900"
                    aria-hidden="true"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Theme Toggle Button */}
              <ThemeSwitch />

              {/* Search Bar */}

              {isAuthenticated ? (
                // Authenticated Profile Dropdown
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500"
                    aria-label="User account"
                    aria-haspopup="true"
                    aria-expanded={isProfileDropdownOpen}
                  >
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="User"
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-7 w-7 text-white" />
                    )}
                  </button>

                  {isProfileDropdownOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex={-1}
                    >
                      <div className="py-1" role="none">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm text-white" role="none">
                            Signed in as
                          </p>
                          <p
                            className="text-sm font-medium text-white truncate"
                            role="none"
                          >
                            {userName}
                          </p>
                        </div>
                        {/* Profile Dropdown Links */}
                        <Link
                          href="/customer/dashboard"
                          className={dropdownLinkClass}
                          role="menuitem"
                          tabIndex={-1}
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link
                          href="/customer/profile"
                          className={dropdownLinkClass}
                          role="menuitem"
                          tabIndex={-1}
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <User size={16} /> Profile Settings
                        </Link>
                        <Link
                          href="/customer/addresses"
                          className={dropdownLinkClass}
                          role="menuitem"
                          tabIndex={-1}
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <MapPin size={16} /> My Addresses
                        </Link>
                        <Link
                          href="/customer/orders"
                          className={dropdownLinkClass}
                          role="menuitem"
                          tabIndex={-1}
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <ClipboardList size={16} /> Order History
                        </Link>
                        <div className="border-t border-gray-700 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className={`w-full text-left ${dropdownLinkClass}`}
                          role="menuitem"
                          tabIndex={-1}
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Unauthenticated Links
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-gray-300 hover:bg-gray-800 transition-colors font-semibold py-2.5 px-5 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/reserve"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors"
                  >
                    Book a table
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              {/* Mobile Cart Link */}
              <Link
                href="/checkout"
                className="relative p-2 text-gray-300 mr-2"
                aria-label={`View cart, ${cartCount} items`}
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center border-2 border-gray-900"></span>
                )}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-300"
                aria-label="Open main menu"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-transform transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-gray-800 shadow-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold text-white">
              {settings.restaurantName}
            </span>
            <div className="flex items-center gap-2">
              <ThemeSwitch />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-300"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>
          </div>

          <nav className="flex-grow flex flex-col space-y-4">
            {/* Mobile Nav Links */}
            <Link
              href="/menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass("/menu")}
            >
              Menu
            </Link>
            <Link
              href="/reserve"
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass("/reserve")}
            >
              Reservations
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass("/about")}
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={mobileNavLinkClass("/contact")}
            >
              Contact
            </Link>
          </nav>

          <div className="mt-auto space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/customer/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full justify-center py-3 px-4 rounded-md text-lg text-gray-200 bg-gray-700 hover:bg-gray-600"
                >
                  <User size={20} /> My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full justify-center py-3 px-4 rounded-md text-lg text-red-400 bg-red-900/30 hover:bg-red-900/50"
                >
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full justify-center py-3 px-4 rounded-md text-lg text-gray-200 bg-gray-700 hover:bg-gray-600"
                >
                  <LogOut size={20} className="transform rotate-180" /> Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 w-full justify-center py-3 px-4 rounded-md text-lg text-white bg-orange-500 hover:bg-orange-600"
                >
                  <UserPlus size={20} /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
