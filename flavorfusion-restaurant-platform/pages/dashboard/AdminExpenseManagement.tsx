import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { Expense, ExpenseCategory } from '../../types';
import { api } from '../../services/api';
import { useSettings } from '../../contexts/SettingsContext';
import Pagination from '../../components/common/Pagination';

type SortableKeys = keyof Expense | 'category_name';

const AdminExpenseManagement: React.FC = () => {
    const { settings } = useSettings();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // New state for category modal
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');

    // Table state
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' } | null>({ key: 'expense_date', direction: 'descending' });
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.getAllExpenses(),
            api.getExpenseCategories()
        ]).then(([allExpenses, allCategories]) => {
            setExpenses(allExpenses);
            setCategories(allCategories);
            setLoading(false);
        });
    }, []);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const handleSave = () => {
        console.log("Saving new expense...");
        closeModal();
    };

    const handleSaveCategory = () => {
        if (!newCategoryName.trim()) {
            alert('Category name cannot be empty.');
            return;
        }
        const newCategory: ExpenseCategory = {
            id: Date.now(), // mock ID
            name: newCategoryName,
            description: newCategoryDescription,
            created_at: new Date(),
            updated_at: new Date(),
        };
        setCategories(prev => [...prev, newCategory]);
        setShowCategoryModal(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
    };
    
    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const categoryMatch = categoryFilter ? expense.expense_category_id === parseInt(categoryFilter) : true;
            const searchMatch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
            return categoryMatch && searchMatch;
        });
    }, [expenses, searchTerm, categoryFilter]);

    const sortedExpenses = useMemo(() => {
        let sortableItems = [...filteredExpenses];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                if (sortConfig.key === 'category_name') {
                    aValue = categories.find(c => c.id === a.expense_category_id)?.name || '';
                    bValue = categories.find(c => c.id === b.expense_category_id)?.name || '';
                } else {
                    aValue = a[sortConfig.key as keyof Expense];
                    bValue = b[sortConfig.key as keyof Expense];
                }
                
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredExpenses, sortConfig, categories]);

    const paginatedExpenses = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedExpenses, currentPage]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const getSortIcon = (key: SortableKeys) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4 ml-1 opacity-60" /> : <ArrowDown className="h-4 w-4 ml-1 opacity-60" />;
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

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

       <div className="bg-white dark:bg-gray-800 p-4 rounded-t-lg shadow-md border-b dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input type="text" placeholder="Search by description..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 pl-10 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <option value="">All Categories</option>
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
              </div>
          </div>
      </div>
       <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('expense_date')} className="flex items-center">Date {getSortIcon('expense_date')}</button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        <button onClick={() => requestSort('category_name')} className="flex items-center">Category {getSortIcon('category_name')}</button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                         <button onClick={() => requestSort('description')} className="flex items-center">Description {getSortIcon('description')}</button>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                         <button onClick={() => requestSort('amount')} className="flex items-center">Amount {getSortIcon('amount')}</button>
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                     Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div></td></tr>
                     ))
                ) : paginatedExpenses.length > 0 ? paginatedExpenses.map(expense => (
                    <tr key={expense.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(expense.expense_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{categories.find(c => c.id === expense.expense_category_id)?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-medium">{settings.currencySymbol}{expense.amount.toFixed(2)}</td>
                    </tr>
                )) : (
                    <tr><td colSpan={4} className="text-center py-10 text-gray-500 dark:text-gray-400">No expenses found.</td></tr>
                )}
            </tbody>
            <Pagination colSpan={4} currentPage={currentPage} totalPages={Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE)} onPageChange={setCurrentPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={sortedExpenses.length} />
        </table>
      </div>

       {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Log New Expense</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input type="date" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <div className="flex items-center gap-2 mt-1">
                    <select className="flex-grow block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        <option>Other</option>
                    </select>
                     <button type="button" onClick={() => setShowCategoryModal(true)} title="Add new category" className="p-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        <Plus size={20} />
                    </button>
                </div>
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

      {/* New Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">Add New Category</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                        <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                        <textarea value={newCategoryDescription} onChange={(e) => setNewCategoryDescription(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-orange-500 focus:border-orange-500"></textarea>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={() => setShowCategoryModal(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSaveCategory} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save Category</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminExpenseManagement;