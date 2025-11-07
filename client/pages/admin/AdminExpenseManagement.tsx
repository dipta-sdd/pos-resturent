import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Expense } from '../../types';
// FIX: Import mockExpenses which was missing.
import { mockExpenses } from '../../data/mockData';
import { useSettings } from '../../contexts/SettingsContext';

const AdminExpenseManagement: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const { settings } = useSettings();

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleSave = () => {
        // In a real app, you would collect form data and save it.
        console.log("Saving new expense...");
        closeModal();
    };

    const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Expense Management</h1>
        <button onClick={openModal} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center gap-2">
            <Plus size={20} /> Log New Expense
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold dark:text-white">Total Expenses This Month</h2>
          <p className="text-3xl font-bold text-red-500 mt-2">{settings.currencySymbol}{totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
      </div>

       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {mockExpenses.map(expense => (
                    <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{expense.expense_date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{expense.expense_category?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-medium">{settings.currencySymbol}{expense.amount.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

       {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Log New Expense</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input type="date" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option>Ingredients</option>
                    <option>Utilities</option>
                    <option>Payroll</option>
                    <option>Marketing</option>
                    <option>Rent</option>
                    <option>Other</option>
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <input type="text" placeholder="e.g., Monthly rent" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">{settings.currencySymbol}</span>
                    </div>
                    <input type="number" step="0.01" placeholder="0.00" className="block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 pl-7 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                </div>
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
              <button onClick={handleSave} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExpenseManagement;