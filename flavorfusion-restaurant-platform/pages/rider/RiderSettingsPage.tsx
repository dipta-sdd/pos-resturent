
import React, { useState } from 'react';

const RiderSettingsPage: React.FC = () => {
    const [notifications, setNotifications] = useState({
        newRequests: true,
        updates: true,
        promos: false,
    });

    const handleToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Rider Settings</h1>
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Working Hours */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-3 dark:border-gray-700">Preferred Working Hours</h2>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                            <input type="time" defaultValue="09:00" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
                            <input type="time" defaultValue="17:00" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                    </div>
                </div>

                {/* Delivery Zones */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-3 dark:border-gray-700">Delivery Zones</h2>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Select the areas you'd like to receive delivery requests from.</p>
                    <div className="mt-4 space-y-2">
                         {['Downtown', 'Northside', 'Southside', 'West End'].map(zone => (
                             <label key={zone} className="flex items-center">
                                <input type="checkbox" defaultChecked={zone === 'Downtown'} className="h-5 w-5 rounded text-orange-500 focus:ring-orange-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                                <span className="ml-3 text-gray-700 dark:text-gray-300">{zone}</span>
                             </label>
                         ))}
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-3 dark:border-gray-700">Notification Settings</h2>
                    <div className="space-y-4 mt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">New Delivery Requests</span>
                            <button onClick={() => handleToggle('newRequests')} className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.newRequests ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${notifications.newRequests ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Delivery Status Updates</span>
                             <button onClick={() => handleToggle('updates')} className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.updates ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${notifications.updates ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">Promotions & News</span>
                            <button onClick={() => handleToggle('promos')} className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications.promos ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${notifications.promos ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RiderSettingsPage;