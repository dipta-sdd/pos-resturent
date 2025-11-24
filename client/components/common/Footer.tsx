'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container max-w-full ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16 px-4 sm:px-6 lg:px-8 pb-4">

          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 text-3xl font-bold text-white mb-4 font-serif">
              {settings.restaurantName}
            </Link>
            <p className="text-gray-400 max-w-sm">Savor authentic flavors crafted with fresh, locally-sourced ingredients, for an unforgettable dining experience.</p>
            <div className="flex space-x-5 mt-6">
              {settings.socials.facebook && <a href={settings.socials.facebook} className="text-gray-400 hover:text-orange-400" aria-label="Facebook"><Facebook size={22} /></a>}
              {settings.socials.twitter && <a href={settings.socials.twitter} className="text-gray-400 hover:text-orange-400" aria-label="Twitter"><Twitter size={22} /></a>}
              {settings.socials.instagram && <a href={settings.socials.instagram} className="text-gray-400 hover:text-orange-400" aria-label="Instagram"><Instagram size={22} /></a>}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/" className="text-base text-gray-300 hover:text-orange-400">Home</Link></li>
              <li><Link href="/menu" className="text-base text-gray-300 hover:text-orange-400">Menu</Link></li>
              <li><Link href="/about" className="text-base text-gray-300 hover:text-orange-400">About Us</Link></li>
              <li><Link href="/contact" className="text-base text-gray-300 hover:text-orange-400">Contact</Link></li>
              <li><Link href="/reserve" className="text-base text-gray-300 hover:text-orange-400">Reservations</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold tracking-wider">Contact Us</h3>
            <ul className="mt-4 space-y-4 text-gray-300">
              <li className="flex items-start gap-3"><MapPin className="text-orange-400 mt-1 flex-shrink-0" size={18} /><span>{settings.restaurantAddress}</span></li>
              <li className="flex items-start gap-3"><Phone className="text-orange-400 mt-1 flex-shrink-0" size={18} /><span>{settings.restaurantPhone}</span></li>
              <li className="flex items-start gap-3"><Mail className="text-orange-400 mt-1 flex-shrink-0" size={18} /><span>{settings.restaurantEmail}</span></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold tracking-wider">Opening Hours</h3>
            <ul className="mt-4 space-y-3 text-gray-300">
              <li>Monday - Friday: <span className="float-right">{settings.workingHours['Mon-Fri']}</span></li>
              <li>Saturday - Sunday: <span className="float-right">{settings.workingHours['Sat-Sun']}</span></li>
            </ul>
          </div>

        </div>
        <div className=" border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 py-4 px-4 sm:px-6 lg:px-8 ">
          <p>&copy; {new Date().getFullYear()} {settings.restaurantName}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/terms-of-service" className="hover:text-orange-400">Terms of Service</Link>
            <Link href="/privacy-policy" className="hover:text-orange-400">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
