'use client';

import React from 'react';
import { useAuth } from '@/components//AuthContext';
import { Upload } from 'lucide-react';

const RiderProfilePage: React.FC = () => {
    const { user } = useAuth();
    const userName = user ? `${user.first_name} ${user.last_name}` : '';

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Rider Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <img src={user?.avatar_url} alt={userName} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
                        <h2 className="text-xl font-bold dark:text-white">{userName}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                        <button className="mt-4 w-full bg-orange-100 text-orange-600 font-semibold py-2 rounded-lg dark:bg-orange-500/20 dark:text-orange-400">
                            Change Photo
                        </button>
                    </div>
                </div>
                <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <form className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-white dark:border-gray-700">Personal Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                    <input type="text" defaultValue={userName} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <input type="email" defaultValue={user?.email} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                    <input type="tel" defaultValue={user?.mobile || "123-456-7890"} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-white dark:border-gray-700">Vehicle Information</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vehicle Type & License Plate</label>
                                <input type="text" defaultValue="Motorcycle - ABCD123" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-4 dark:text-white dark:border-gray-700">Documents</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 border rounded-lg dark:border-gray-600">
                                    <div>
                                        <p className="font-medium dark:text-white">Driver's License</p>
                                        <p className="text-sm text-green-600">Verified</p>
                                    </div>
                                    <button type="button" className="text-orange-500 font-semibold flex items-center gap-1"><Upload size={16} /> Update</button>
                                </div>
                                <div className="flex justify-between items-center p-3 border rounded-lg dark:border-gray-600">
                                    <div>
                                        <p className="font-medium dark:text-white">Vehicle Registration</p>
                                        <p className="text-sm text-green-600">Verified</p>
                                    </div>
                                    <button type="button" className="text-orange-500 font-semibold flex items-center gap-1"><Upload size={16} /> Update</button>
                                </div>
                            </div>
                        </div>


                        <div className="flex justify-end">
                            <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RiderProfilePage;
