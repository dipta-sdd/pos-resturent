'use client';

import React from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';

const MakeReservationPage: React.FC = () => {
    const breadcrumbs = [{ name: 'Reserve', path: '/reserve' }];
    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-4xl font-bold text-center mb-10 dark:text-white">Make a Reservation</h1>
                <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                            <input type="date" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                            <input type="time" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Guests</label>
                            <input type="number" min="1" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border rounded-md text-white bg-orange-600 hover:bg-orange-700">
                                Book Table
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default MakeReservationPage;
