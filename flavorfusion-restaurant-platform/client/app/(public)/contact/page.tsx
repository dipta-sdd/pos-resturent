'use client';

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { useSettings } from '../../../contexts/SettingsContext';

const ContactInfoCard = ({ icon: Icon, title, value }: { icon: React.ElementType; title: string; value: string }) => (
    <div className="flex items-center gap-6">
        <div className="flex-shrink-0 bg-stone-100 dark:bg-gray-700/50 p-4 rounded-xl">
            <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </div>
        <div>
            <p className="font-bold text-lg text-gray-800 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        </div>
    </div>
);


const ContactPage: React.FC = () => {
    const breadcrumbs = [{ name: 'Contact', path: '/contact' }];
    const { settings } = useSettings();

    // Statically define hours to match the design, as the data structure in settings is different.
    const hours = [
        { day: 'Monday - Friday', time: '11:00 AM - 10:00 PM', highlight: false },
        { day: 'Saturday', time: '10:00 AM - 11:00 PM', highlight: true },
        { day: 'Sunday', time: '10:00 AM - 09:00 PM', highlight: false },
    ];

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="bg-[#FAF9F6] dark:bg-gray-900">
                <div className="container mx-auto max-w-6xl py-16 px-4">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold text-gray-800 dark:text-white tracking-tight">Get in Touch</h1>
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                            We'd love to hear from you. Whether you have a question, a suggestion, or just want to say hello, here's how you can reach us.
                        </p>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

                        {/* Left Side (Contact Info + Form) */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="space-y-6">
                                <ContactInfoCard icon={MapPin} title="Address" value={settings.restaurantAddress} />
                                <ContactInfoCard icon={Phone} title="Phone Number" value={settings.restaurantPhone} />
                                <ContactInfoCard icon={Mail} title="Email Address" value={settings.restaurantEmail} />
                            </div>

                            {/* Contact Form Card */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Send us a message</h2>
                                <form className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                        <input type="text" id="name" name="name" className="w-full p-3 bg-stone-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                        <input type="email" id="email" name="email" className="w-full p-3 bg-stone-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition" />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                        <textarea id="message" name="message" rows={5} className="w-full p-3 bg-stone-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"></textarea>
                                    </div>
                                    <div>
                                        <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3.5 px-6 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Side (Map + Hours) */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Map Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                                <iframe
                                    className="w-full h-80"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.333039641491!2d-74.00923568459505!3d40.71077367933211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1e27a61dc1%3A0x1d6911142da5a41c!2sNew%20York%20City%20Hall!5e0!3m2!1sen!2sus!4v1622559771691!5m2!1sen!2sus"
                                    allowFullScreen
                                    loading="lazy"
                                    title="Restaurant Location"
                                ></iframe>
                            </div>

                            {/* Hours Card */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Hours of Operation</h2>
                                <ul className="space-y-3">
                                    {hours.map((item, index) => (
                                        <li
                                            key={index}
                                            className={`flex justify-between items-center text-gray-700 dark:text-gray-300 font-medium ${item.highlight ? 'bg-orange-50 dark:bg-orange-500/10 p-3 rounded-lg -m-3' : ''}`}
                                        >
                                            <span>{item.day}</span>
                                            <span className={item.highlight ? 'font-bold text-orange-600 dark:text-orange-400' : ''}>{item.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactPage;
