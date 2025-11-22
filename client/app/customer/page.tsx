'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import { ClipboardList, Calendar, Settings, ShoppingBag, CalendarPlus } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';

const QuickLinkCard = ({ to, title, description, icon: Icon }: { to: string; title: string; description: string; icon: React.ElementType }) => (
    <Link href={to} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow text-center flex flex-col items-center justify-start h-full border border-gray-200/50 dark:border-gray-700/50">
        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400 p-4 rounded-full mb-5">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">{description}</p>
    </Link>
);

const CustomerDashboard: React.FC = () => {
    const { user } = useAuth();

    // Set to null to demonstrate empty states. In a real app, this would come from an API.
    const mockLatestOrder = null;
    // const mockLatestOrder = {
    //     id: '102',
    //     imageUrl: 'https://i.imgur.com/L3Q29t6.png',
    // };

    const mockNextReservation = null;
    // const mockNextReservation = {
    //     id: 1,
    //     imageUrl: 'https://i.imgur.com/G5zG9N0.png',
    // };

    const customerName = user?.first_name || 'there';
    const breadcrumbs = [{ name: 'Dashboard', path: '/customer' }];

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-10">
                    Welcome back, {customerName}!
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                    {/* Latest Order Card */}
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Your Latest Order</h2>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex-grow border border-gray-200/80 dark:border-gray-700/60 flex flex-col">
                            {mockLatestOrder ? (
                                <>
                                    <img src={(mockLatestOrder as any).imageUrl} alt="Latest order of spaghetti" className="w-full h-64 object-cover" />
                                    <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                                        <div className="flex-grow">
                                            <p className="text-gray-900 dark:text-white font-semibold text-lg">Status: In the Kitchen</p>
                                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">Your order is being prepared with care.</p>
                                            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">Estimated Arrival: 8:15 PM</p>
                                        </div>
                                        <Link href={`/customer/orders/${(mockLatestOrder as any).id}`} className="bg-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 whitespace-nowrap self-start sm:self-end">
                                            View Details
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[300px]">
                                    <ShoppingBag size={48} className="text-gray-300 dark:text-gray-600 mb-4" strokeWidth={1.5} />
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No orders yet</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Your recent orders will be displayed here.</p>
                                    <Link href="/menu" className="bg-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors">
                                        Browse Menu
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Next Reservation Card */}
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Your Next Reservation</h2>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex-grow border border-gray-200/80 dark:border-gray-700/60 flex flex-col">
                            {mockNextReservation ? (
                                <>
                                    <img src={(mockNextReservation as any).imageUrl} alt="Restaurant interior for reservation" className="w-full h-64 object-cover" />
                                    <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                                        <div className="flex-grow">
                                            <p className="text-gray-900 dark:text-white font-semibold text-lg">Tomorrow at 7:30 PM</p>
                                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">Table for 4 guests.</p>
                                            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">A confirmation has been sent to your email.</p>
                                        </div>
                                        <Link href={`/customer/reservations/${(mockNextReservation as any).id}`} className="bg-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 whitespace-nowrap self-start sm:self-end">
                                            Manage
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[300px]">
                                    <CalendarPlus size={48} className="text-gray-300 dark:text-gray-600 mb-4" strokeWidth={1.5} />
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No upcoming reservations</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Book a table for a memorable dining experience.</p>
                                    <Link href="/reserve" className="bg-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors">
                                        Book a Table
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Quick Links</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        <QuickLinkCard
                            to="/customer/orders"
                            title="View Order History"
                            description="Review your past orders and quickly reorder your favorites."
                            icon={ClipboardList}
                        />
                        <QuickLinkCard
                            to="/customer/reservations"
                            title="See All Reservations"
                            description="Manage all your upcoming and past table bookings."
                            icon={Calendar}
                        />
                        <QuickLinkCard
                            to="/customer/profile"
                            title="Edit Profile"
                            description="Update your personal information and payment methods."
                            icon={Settings}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerDashboard;
