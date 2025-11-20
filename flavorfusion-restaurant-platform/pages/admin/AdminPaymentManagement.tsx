
import React, { useState } from 'react';

const AdminPaymentManagement: React.FC = () => {
    const [methods, setMethods] = useState({
        creditCard: true,
        cashOnDelivery: true,
        paypal: false
    });

    const handleToggle = (method: keyof typeof methods) => {
        setMethods(prev => ({ ...prev, [method]: !prev[method] }));
    };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Payment Management</h1>
      <form>
        <div className="space-y-8 max-w-2xl">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-3 dark:border-gray-700">Payment Methods</h2>
                <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Credit/Debit Card</span>
                         <button type="button" onClick={() => handleToggle('creditCard')} className={`w-12 h-6 rounded-full p-1 transition-colors ${methods.creditCard ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${methods.creditCard ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Cash on Delivery</span>
                         <button type="button" onClick={() => handleToggle('cashOnDelivery')} className={`w-12 h-6 rounded-full p-1 transition-colors ${methods.cashOnDelivery ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${methods.cashOnDelivery ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">PayPal</span>
                         <button type="button" onClick={() => handleToggle('paypal')} className={`w-12 h-6 rounded-full p-1 transition-colors ${methods.paypal ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${methods.paypal ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-3 dark:border-gray-700">Gateway Settings (Stripe)</h2>
                <div className="space-y-4 mt-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Publishable Key</label>
                        <input type="text" placeholder="pk_test_..." className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Secret Key</label>
                        <input type="password" placeholder="sk_test_..." className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                    </div>
                </div>
            </div>

             <div className="flex justify-end">
                <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600">
                    Save Settings
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default AdminPaymentManagement;