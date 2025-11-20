
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ExpenseCategory } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminExpenseCategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<ExpenseCategory | Partial<ExpenseCategory> | null>(null);

    useEffect(() => {
        api.getExpenseCategories().then(setCategories);
    }, []);

    const openModal = (category?: ExpenseCategory) => {
        setCurrentCategory(category || { name: '', description: '' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentCategory(null);
    };

    const handleSave = () => {
        console.log('Saving category:', currentCategory);
        closeModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Expense Categories</h1>
                <button onClick={() => openModal()} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center gap-2">
                    <Plus size={20} /> Add New Category
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {categories.map(cat => (
                            <tr key={cat.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{cat.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{cat.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openModal(cat)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-4"><Edit size={18} /></button>
                                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && currentCategory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">{'id' in currentCategory ? 'Edit' : 'Add'} Category</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                                <input type="text" defaultValue={currentCategory.name} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea defaultValue={currentCategory.description} rows={3} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                            </div>
                        </form>
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
                            <button onClick={handleSave} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminExpenseCategoryManagement;