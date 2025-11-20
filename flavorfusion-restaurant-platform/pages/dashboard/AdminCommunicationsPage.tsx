
import React from 'react';
import { Send } from 'lucide-react';

const AdminCommunicationsPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Communications</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">Send New Announcement</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Audience</label>
                                <select className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <option>All Users</option>
                                    <option>Customers Only</option>
                                    <option>Riders Only</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject / Title</label>
                                <input type="text" placeholder="e.g., Weekend Special Offer!" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                                <textarea rows={6} placeholder="Compose your message..." className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"></textarea>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 flex items-center gap-2 float-right">
                                    <Send size={16}/> Send Now
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-1">
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">Sent History</h2>
                        <ul className="space-y-3">
                            <li className="p-3 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                <p className="font-semibold text-sm dark:text-gray-200">Weekend Special Offer!</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Sent to Customers on Oct 26</p>
                            </li>
                             <li className="p-3 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                <p className="font-semibold text-sm dark:text-gray-200">New Payout System</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Sent to Riders on Oct 20</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCommunicationsPage;
