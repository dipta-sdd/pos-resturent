

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useSettings } from '../../contexts/SettingsContext';

const ContactPage: React.FC = () => {
  const breadcrumbs = [{ name: 'Contact', path: '/contact' }];
  const { settings } = useSettings();

  return (
    <>
      <Breadcrumb crumbs={breadcrumbs} />
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Get In Touch</h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">We'd love to hear from you. Whether it's feedback, a question, or a reservation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Send us a Message</h2>
              <form className="space-y-6">
                  <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                      <input type="text" id="name" className="mt-1 block w-full p-3 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                  </div>
                   <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <input type="email" id="email" className="mt-1 block w-full p-3 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                  </div>
                   <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                      <textarea id="message" rows={5} className="mt-1 block w-full p-3 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"></textarea>
                  </div>
                   <div>
                      <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600">
                          Submit
                      </button>
                  </div>
              </form>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4 dark:text-white">Contact Information</h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                      <p className="flex items-start gap-3"><MapPin className="text-orange-500 mt-1 flex-shrink-0"/> <span>{settings.restaurantAddress}</span></p>
                      <p className="flex items-center gap-3"><Phone className="text-orange-500"/> <span>{settings.restaurantPhone}</span></p>
                      <p className="flex items-center gap-3"><Mail className="text-orange-500"/> <span>{settings.restaurantEmail}</span></p>
                  </div>
                  <div className="mt-6 border-t pt-4 dark:border-gray-700">
                      <h3 className="font-semibold dark:text-white">Hours</h3>
                      <p className="text-gray-600 dark:text-gray-300">Mon - Fri: {settings.workingHours['Mon-Fri']}</p>
                      <p className="text-gray-600 dark:text-gray-300">Sat - Sun: {settings.workingHours['Sat-Sun']}</p>
                  </div>
              </div>
               <div className="bg-gray-300 dark:bg-gray-700 h-60 rounded-lg shadow-md flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Map Placeholder</p>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;