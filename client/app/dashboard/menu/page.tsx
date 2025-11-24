'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MenuItem, Category, AddOn } from '../../../types';
import { api } from '../../../services/api';
import { Plus, Edit, Trash2, GripVertical, Search, ArrowUp, ArrowDown } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import toast from 'react-hot-toast';
import { LaravelErrorResponse } from '@/types';

interface DraggableCategoryItemProps {
    category: Category;
    level: number;
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
    draggedItemId: number | null;
    dropTarget: { id: number | null; position: 'top' | 'bottom' | 'middle' | null };
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
    handleDragEnd: () => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>, category: Category) => void;
    handleDragLeave: () => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    handleTouchStart: (e: React.TouchEvent<HTMLDivElement>, id: number) => void;
    handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
    handleTouchEnd: () => void;
}

// A recursive component to render draggable category items
const DraggableCategoryItem: React.FC<DraggableCategoryItemProps> = ({
    category,
    level,
    onEdit,
    onDelete,
    draggedItemId,
    dropTarget,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
}) => {
    const isBeingDragged = draggedItemId === category.id;
    const isDropTarget = dropTarget.id === category.id;

    const dropIndicatorClass = () => {
        if (!isDropTarget) return '';
        switch (dropTarget.position) {
            case 'top': return 'border-t-2 border-orange-500';
            case 'bottom': return 'border-b-2 border-orange-500';
            case 'middle': return 'bg-orange-100 dark:bg-orange-500/20';
            default: return '';
        }
    };

    return (
        <div className={`rounded-lg ${isBeingDragged ? 'opacity-50' : ''}`}>
            <div
                draggable="true"
                onDragStart={(e) => handleDragStart(e, category.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, category)}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onTouchStart={(e) => handleTouchStart(e, category.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                data-category-id={category.id}
                className={`flex items-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-150 ${dropIndicatorClass()}`}
                style={{ paddingLeft: `${1 + level * 2}rem` }}
            >
                <div className="p-4 cursor-grab text-gray-400">
                    <GripVertical size={20} />
                </div>
                <div className="flex-grow py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{category.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{category.description}</div>
                </div>
                <div className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onEdit(category)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-4"><Edit size={18} /></button>
                    <button onClick={() => onDelete(category.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                </div>
            </div>
            {category.children && category.children.length > 0 && (
                <div className="border-l border-gray-200 dark:border-gray-700">
                    {category.children?.map((child: Category) => (
                        <DraggableCategoryItem
                            key={child.id}
                            category={child}
                            level={level + 1}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            draggedItemId={draggedItemId}
                            dropTarget={dropTarget}
                            handleDragStart={handleDragStart}
                            handleDragEnd={handleDragEnd}
                            handleDragOver={handleDragOver}
                            handleDragLeave={handleDragLeave}
                            handleDrop={handleDrop}
                            handleTouchStart={handleTouchStart}
                            handleTouchMove={handleTouchMove}
                            handleTouchEnd={handleTouchEnd}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const AdminMenuManagement: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('items');

    // Data state
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [addOns, setAddOns] = useState<AddOn[]>([]);

    // Modals state
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Category | Partial<Category> | null>(null);
    const [categoryErrors, setCategoryErrors] = useState<{ [key: string]: string }>({});
    const [showAddOnModal, setShowAddOnModal] = useState(false);
    const [currentAddOn, setCurrentAddOn] = useState<AddOn | Partial<AddOn> | null>(null);
    const [addOnErrors, setAddOnErrors] = useState<{ [key: string]: string }>({});
    const [isSavingCategory, setIsSavingCategory] = useState(false);
    const [isSavingAddOn, setIsSavingAddOn] = useState(false);

    // Drag and drop state
    const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
    const [dropTarget, setDropTarget] = useState<{ id: number | null; position: 'top' | 'bottom' | 'middle' | null }>({ id: null, position: null });

    // Menu Items Table State
    const [loadingItems, setLoadingItems] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMenuItems, setTotalMenuItems] = useState(0);
    const [menuItemsTotalPages, setMenuItemsTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof MenuItem | 'price'; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Addons table state
    const [addOnSearchTerm, setAddOnSearchTerm] = useState('');
    const [debouncedAddOnSearchTerm, setDebouncedAddOnSearchTerm] = useState('');
    const [addOnCurrentPage, setAddOnCurrentPage] = useState(1);
    const [totalAddOns, setTotalAddOns] = useState(0);
    const [addOnTotalPages, setAddOnTotalPages] = useState(1);
    const [addOnSortConfig, setAddOnSortConfig] = useState<{ key: keyof AddOn; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const [addOnsPerPage, setAddOnsPerPage] = useState(10);

    useEffect(() => {
        fetchInitialData();
    }, []);

    // Debounce search terms
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch menu items when params change
    useEffect(() => {
        fetchMenuItems();
    }, [currentPage, debouncedSearchTerm, categoryFilter, itemsPerPage]);

    // Fetch add-ons when params change
    useEffect(() => {
        fetchAddOns();
    }, [addOnCurrentPage, debouncedAddOnSearchTerm, addOnsPerPage]);

    // Modal handlers
    const openCategoryModal = (category?: Category) => {
        setCurrentCategory(category || { name: '' });
        setCategoryErrors({}); // Clear errors when opening modal
        setShowCategoryModal(true);
    };
    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setCurrentCategory(null);
        setCategoryErrors({});
    };
    const handleSaveCategory = async () => {
        if (!currentCategory) return;

        setCategoryErrors({}); // Clear previous errors
        setIsSavingCategory(true);
        try {
            if ('id' in currentCategory && currentCategory.id) {
                // Update existing category
                await api.updateCategory(currentCategory.id, currentCategory);
                toast.success('Category updated successfully');
            } else {
                // Create new category
                await api.createCategory(currentCategory);
                toast.success('Category created successfully');
            }

            // Refresh categories
            const updatedCategories = await api.getCategories();
            setCategories(updatedCategories);
            closeCategoryModal();
        } catch (error: any) {
            console.error('Error saving category:', error);

            // Handle Laravel validation errors
            if (error.response?.data) {
                const backendErrors: LaravelErrorResponse = error.response.data;
                setCategoryErrors(api.normalizeErrors(backendErrors));
                toast.error('Please fix the validation errors');
            } else {
                toast.error('Failed to save category. Please try again.');
            }
        } finally {
            setIsSavingCategory(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category? Any sub-categories and menu items may be affected.')) {
            try {
                await api.deleteCategory(id);
                toast.success('Category deleted successfully');
                // Refresh categories
                const updatedCategories = await api.getCategories();
                setCategories(updatedCategories);
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Failed to delete category. Please try again.');
            }
        }
    }

    const fetchInitialData = async () => {
        setLoadingItems(true);
        try {
            const categoriesData = await api.getCategories();
            setCategories(categoriesData);
            // Initial fetch for items and addons is handled by useEffects
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoadingItems(false);
        }
    };

    const fetchMenuItems = async () => {
        setLoadingItems(true);
        try {
            const response = await api.getMenuItems({
                page: currentPage,
                search: debouncedSearchTerm,
                categoryId: categoryFilter,
                perPage: itemsPerPage
            });
            setMenuItems(response.data);
            setTotalMenuItems(response.total);
            setMenuItemsTotalPages(response.last_page);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            toast.error('Failed to load menu items');
        } finally {
            setLoadingItems(false);
        }
    };

    const fetchAddOns = async () => {
        try {
            const response = await api.getAddOns({
                page: addOnCurrentPage,
                search: debouncedAddOnSearchTerm,
                perPage: addOnsPerPage
            });
            setAddOns(response.data);
            setTotalAddOns(response.total);
            setAddOnTotalPages(response.last_page);
        } catch (error) {
            console.error('Error fetching add-ons:', error);
            toast.error('Failed to load add-ons');
        }
    };

    const openAddOnModal = (addOn?: AddOn) => {
        setCurrentAddOn(addOn || { name: '', price: 0 });
        setAddOnErrors({}); // Clear errors when opening modal
        setShowAddOnModal(true);
    };
    const closeAddOnModal = () => {
        setShowAddOnModal(false);
        setCurrentAddOn(null);
        setAddOnErrors({});
    };
    const handleSaveAddOn = async () => {
        if (!currentAddOn) return;

        setAddOnErrors({}); // Clear previous errors
        setIsSavingAddOn(true);
        try {
            if ('id' in currentAddOn && currentAddOn.id) {
                // Update existing add-on
                const updatedAddOn = await api.updateAddOn(currentAddOn.id, currentAddOn);
                toast.success('Add-on updated successfully');

                setAddOns((prev) => prev.map((item) => item.id === updatedAddOn.id ? updatedAddOn : item));
            } else {
                // Create new add-on
                await api.createAddOn(currentAddOn);
                toast.success('Add-on created successfully');
                // Refresh will happen via fetchAddOns
            }

            // Refresh add-ons
            fetchAddOns();

            // Refresh add-ons

            closeAddOnModal();
        } catch (error: any) {
            console.error('Error saving add-on:', error);

            // Handle Laravel validation errors
            if (error.response?.data) {
                const backendErrors: LaravelErrorResponse = error.response.data;
                setAddOnErrors(api.normalizeErrors(backendErrors));
                toast.error('Please fix the validation errors');
            } else {
                toast.error('Failed to save add-on. Please try again.');
            }
        } finally {
            setIsSavingAddOn(false);
        }
    };

    const handleDeleteAddOn = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this add-on?')) {
            try {
                await api.deleteAddOn(id);
                toast.success('Add-on deleted successfully');
                // Refresh add-ons
                // Refresh add-ons
                fetchAddOns();
            } catch (error) {
                console.error('Error deleting add-on:', error);
                toast.error('Failed to delete add-on. Please try again.');
            }
        }
    };

    const handleSaveItem = async () => {
        // We need to implement this for the new item modal
        // For now, since the item form is on a separate page (/dashboard/menu/new or /edit/[id]),
        // this function might not be needed here if we are not using a modal for items.
        // However, if we are using a modal, we need it.
        // Looking at the renderItems function, the "Add New Item" button redirects to /dashboard/menu/new.
        // And the Edit button redirects to /dashboard/menu/edit/[id].
        // So we don't need handleSaveItem here for items!
        // We only need handleDeleteItem.
    };

    const handleDeleteItem = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.deleteMenuItem(id);
                toast.success('Menu item deleted successfully');
                toast.success('Menu item deleted successfully');
                fetchMenuItems();
            } catch (error) {
                console.error('Error deleting menu item:', error);
                toast.error('Failed to delete menu item');
            }
        }
    };

    const handleAddNew = () => {
        if (activeTab === 'items') router.push('/dashboard/menu/new');
        else if (activeTab === 'categories') openCategoryModal();
        else if (activeTab === 'addons') openAddOnModal();
    };

    const addButtonText = {
        items: 'Add New Item',
        categories: 'Add New Category',
        addons: 'Add New Add-On'
    }[activeTab];

    // Drag and Drop Handlers for Categories
    const isAncestor = (potentialAncestorId: number, childId: number): boolean => {
        const child = categories.find(c => c.id === childId);
        if (!child || !child.parent_id) return false;
        if (child.parent_id === potentialAncestorId) return true;
        return isAncestor(potentialAncestorId, child.parent_id);
    };

    const performDrop = async (draggedId: number, targetId: number, position: 'top' | 'bottom' | 'middle' | null) => {
        if (!position) return;
        if (draggedId === targetId || isAncestor(draggedId, targetId)) return;

        const newCategories = [...categories];
        const draggedItemIndex = newCategories.findIndex(c => c.id === draggedId);
        if (draggedItemIndex === -1) return;
        const [draggedItem] = newCategories.splice(draggedItemIndex, 1);
        const targetCategory = categories.find(c => c.id === targetId)!;

        // Determine new parent_id based on drop position
        let newParentId: number | null;
        if (position === 'middle') {
            newParentId = targetId;
        } else {
            newParentId = targetCategory.parent_id ?? null;
        }

        // Update local state
        draggedItem.parent_id = newParentId;
        const targetItemIndex = newCategories.findIndex(c => c.id === targetId);
        let insertIndex = targetItemIndex + (position === 'bottom' ? 1 : 0);
        if (position === 'middle') newCategories.splice(targetItemIndex + 1, 0, draggedItem);
        else newCategories.splice(insertIndex, 0, draggedItem);
        setCategories(newCategories);

        // Save to backend
        try {
            await api.updateCategory(draggedId, { parent_id: newParentId });
            toast.success('Category hierarchy updated');
        } catch (error) {
            console.error('Error updating category parent:', error);
            // Revert on error
            const revertedCategories = await api.getCategories();
            setCategories(revertedCategories);
            toast.error('Failed to update category hierarchy.');
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(id)); setDraggedItemId(id); };
    const handleDragEnd = () => { setDraggedItemId(null); setDropTarget({ id: null, position: null }); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, category: Category) => { e.preventDefault(); if (category.id === draggedItemId) return; const targetRect = e.currentTarget.getBoundingClientRect(); const dropPositionRatio = (e.clientY - targetRect.top) / targetRect.height; let position: 'top' | 'bottom' | 'middle' = dropPositionRatio < 0.25 ? 'top' : dropPositionRatio > 0.75 ? 'bottom' : 'middle'; setDropTarget({ id: category.id, position }); };
    const handleDragLeave = () => { setDropTarget({ id: null, position: null }); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); const draggedId = Number(e.dataTransfer.getData('text/plain')); if (draggedId && dropTarget.id) performDrop(draggedId, dropTarget.id, dropTarget.position); handleDragEnd(); };
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, id: number) => { setDraggedItemId(id); if ('vibrate' in navigator) navigator.vibrate(50); };
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => { if (!draggedItemId) return; const touch = e.touches[0]; const targetElement = document.elementFromPoint(touch.clientX, touch.clientY); if (!targetElement) return; const categoryContainer = targetElement.closest<HTMLDivElement>('[data-category-id]'); if (!categoryContainer) { setDropTarget({ id: null, position: null }); return; } const targetId = Number(categoryContainer.dataset.categoryId); if (targetId === draggedItemId) return; const targetRect = categoryContainer.getBoundingClientRect(); const dropPositionRatio = (touch.clientY - targetRect.top) / targetRect.height; let position: 'top' | 'bottom' | 'middle' = dropPositionRatio < 0.25 ? 'top' : dropPositionRatio > 0.75 ? 'bottom' : 'middle'; if (dropTarget.id !== targetId || dropTarget.position !== position) setDropTarget({ id: targetId, position }); };
    const handleTouchEnd = () => { if (draggedItemId && dropTarget.id) performDrop(draggedItemId, dropTarget.id, dropTarget.position); handleDragEnd(); };

    const categoryTree = useMemo(() => {
        const categoriesById: Map<number, Category> = new Map(categories.map(cat => [cat.id, { ...cat, children: [] }]));
        const rootCategories: Category[] = [];
        for (const category of categoriesById.values()) {
            if (category.parent_id && categoriesById.has(category.parent_id)) {
                const parent = categoriesById.get(category.parent_id)!;
                if (parent.children) parent.children.push(category);
            } else {
                rootCategories.push(category);
            }
        }
        return rootCategories;
    }, [categories]);

    // Menu items table logic
    // Server-side pagination is used, so we don't need to filter/sort/paginate locally for the main list
    // However, we might want to sort the *current page* locally if the user clicks sort headers
    // or we could implement server-side sorting. For now, let's sort the current page locally.

    const sortedItems = useMemo(() => {
        let sortableItems = [...menuItems];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let aValue: any; let bValue: any;
                if (sortConfig.key === 'price') { aValue = a.variants?.[0]?.price ?? 0; bValue = b.variants?.[0]?.price ?? 0; }
                else { aValue = a[sortConfig.key as keyof MenuItem]; bValue = b[sortConfig.key as keyof MenuItem]; }
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [menuItems, sortConfig]);

    const paginatedItems = useMemo(() => {
        // Since we are doing server side pagination, we just return the sorted items
        // But if we were doing client side sorting on the current page, we might need to slice?
        // Actually, the API returns only the items for the current page.
        // So we don't need to slice. sortedItems contains only the items for the current page.
        return sortedItems;
    }, [sortedItems]);

    const requestSort = (key: keyof MenuItem | 'price') => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const getSortIcon = (key: keyof MenuItem | 'price') => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4 ml-1 opacity-60" /> : <ArrowDown className="h-4 w-4 ml-1 opacity-60" />;
    };

    // Addons table logic
    const sortedAddOns = useMemo(() => {
        let sortableItems = [...addOns];
        if (addOnSortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[addOnSortConfig.key];
                const bValue = b[addOnSortConfig.key];
                if (aValue < bValue) {
                    return addOnSortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return addOnSortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [addOns, addOnSortConfig]);

    const paginatedAddOns = useMemo(() => {
        // Same as above, server side pagination returns only current page items
        return sortedAddOns;
    }, [sortedAddOns]);

    const requestAddOnSort = (key: keyof AddOn) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (addOnSortConfig && addOnSortConfig.key === key && addOnSortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setAddOnSortConfig({ key, direction });
        setAddOnCurrentPage(1);
    };

    const getAddOnSortIcon = (key: keyof AddOn) => {
        if (!addOnSortConfig || addOnSortConfig.key !== key) {
            return null;
        }
        return addOnSortConfig.direction === 'ascending' ? <ArrowUp className="h-4 w-4 ml-1 opacity-60" /> : <ArrowDown className="h-4 w-4 ml-1 opacity-60" />;
    };

    const renderItems = () => (
        <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-t-lg shadow-md border-b dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="Search by item name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 pl-10 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
                    </div>
                    <div>
                        <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"><button onClick={() => requestSort('name')} className="flex items-center hover:text-gray-700 dark:hover:text-gray-100">Item {getSortIcon('name')}</button></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"><button onClick={() => requestSort('price')} className="flex items-center hover:text-gray-700 dark:hover:text-gray-100">Price {getSortIcon('price')}</button></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Available</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"><button onClick={() => requestSort('created_at')} className="flex items-center hover:text-gray-700 dark:hover:text-gray-100">Created At {getSortIcon('created_at')}</button></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"><button onClick={() => requestSort('updated_at')} className="flex items-center hover:text-gray-700 dark:hover:text-gray-100">Updated At {getSortIcon('updated_at')}</button></th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loadingItems ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}><td className="px-6 py-4" colSpan={7}><div className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div></td></tr>
                            ))
                        ) : sortedItems.length > 0 ? sortedItems.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link href={`/dashboard/menu/edit/${item.id}`} className="flex items-center group">
                                        <div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-md object-cover" src={item.image_url ?? ''} alt={item.name} /></div>
                                        <div className="ml-4"><div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">{item.name}</div></div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{categories.find(c => c.id === item.category_id)?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${item.variants?.[0]?.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>{item.is_active ? 'Yes' : 'No'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => router.push(`/dashboard/menu/edit/${item.id}`)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-4"><Edit size={18} /></button>
                                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400">No menu items found.</td></tr>
                        )}
                    </tbody>
                    <Pagination colSpan={7} currentPage={currentPage} totalPages={menuItemsTotalPages} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} totalItems={totalMenuItems} />
                </table>
            </div>
        </>
    );

    const renderCategories = () => (
        <div className="space-y-1">
            {categoryTree.map(category => (
                <DraggableCategoryItem
                    key={category.id} category={category} level={0} onEdit={openCategoryModal} onDelete={handleDeleteCategory}
                    draggedItemId={draggedItemId} dropTarget={dropTarget} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd}
                    handleDragOver={handleDragOver} handleDragLeave={handleDragLeave} handleDrop={handleDrop}
                    handleTouchStart={handleTouchStart} handleTouchMove={handleTouchMove} handleTouchEnd={handleTouchEnd}
                />
            ))}
        </div>
    );

    const renderAddOns = () => (
        <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-t-lg shadow-md border-b dark:border-gray-700 flex justify-between items-center gap-4">
                <div className="relative max-w-sm flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by add-on name..." value={addOnSearchTerm} onChange={e => setAddOnSearchTerm(e.target.value)} className="w-full p-2 pl-10 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                    <select value={addOnsPerPage} onChange={e => { setAddOnsPerPage(Number(e.target.value)); setAddOnCurrentPage(1); }} className="p-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button onClick={() => requestAddOnSort('name')} className="flex items-center hover:text-gray-700 dark:hover:text-gray-100">Name {getAddOnSortIcon('name')}</button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <button onClick={() => requestAddOnSort('price')} className="flex items-center hover:text-gray-700 dark:hover:text-gray-100">Price {getAddOnSortIcon('price')}</button>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedAddOns.map(addOn => (
                            <tr key={addOn.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{addOn.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${addOn.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openAddOnModal(addOn)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-4"><Edit size={18} /></button>
                                    <button onClick={() => handleDeleteAddOn(addOn.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                        {sortedAddOns.length === 0 && (
                            <tr><td colSpan={3} className="text-center py-10 text-gray-500 dark:text-gray-400">No add-ons found.</td></tr>
                        )}
                    </tbody>
                    <Pagination
                        colSpan={3}
                        currentPage={addOnCurrentPage}
                        totalPages={addOnTotalPages}
                        onPageChange={setAddOnCurrentPage}
                        itemsPerPage={addOnsPerPage}
                        totalItems={totalAddOns}
                    />
                </table>
            </div>
        </>
    );


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Menu Management</h1>
                <button onClick={handleAddNew} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center gap-2">
                    <Plus size={20} /> {addButtonText}
                </button>
            </div>

            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('items')} className={`${activeTab === 'items' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Menu Items</button>
                    <button onClick={() => setActiveTab('categories')} className={`${activeTab === 'categories' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Categories</button>
                    <button onClick={() => setActiveTab('addons')} className={`${activeTab === 'addons' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Add-Ons</button>
                </nav>
            </div>

            <div>
                {activeTab === 'items' && renderItems()}
                {activeTab === 'categories' && renderCategories()}
                {activeTab === 'addons' && renderAddOns()}
            </div>

            {showCategoryModal && currentCategory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">{'id' in currentCategory ? 'Edit' : 'Add'} Category</h2>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveCategory(); }}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                                <input
                                    type="text"
                                    value={currentCategory.name || ''}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                    className={`mt-1 block w-full border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${categoryErrors.name
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500'
                                        }`}
                                    required
                                />
                                {categoryErrors.name && <p className="mt-1 text-xs text-red-500">{categoryErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Parent Category</label>
                                <select
                                    value={currentCategory.parent_id ?? ''}
                                    onChange={(e) => setCurrentCategory({ ...currentCategory, parent_id: e.target.value ? Number(e.target.value) : null })}
                                    className={`mt-1 block w-full border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${categoryErrors.parent_id
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500'
                                        }`}
                                >
                                    <option value="">-- No Parent --</option>
                                    {categories.filter(cat => !('id' in currentCategory) || cat.id !== currentCategory.id).map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                </select>
                                {categoryErrors.parent_id && <p className="mt-1 text-xs text-red-500">{categoryErrors.parent_id}</p>}
                            </div>
                        </form>
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={closeCategoryModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500" disabled={isSavingCategory}>Cancel</button>
                            <button
                                onClick={handleSaveCategory}
                                className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSavingCategory}
                            >
                                {isSavingCategory ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddOnModal && currentAddOn && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">{'id' in currentAddOn ? 'Edit' : 'Add'} Add-On</h2>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveAddOn(); }}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Add-On Name</label>
                                <input
                                    type="text"
                                    value={currentAddOn.name || ''}
                                    onChange={(e) => setCurrentAddOn({ ...currentAddOn, name: e.target.value })}
                                    className={`mt-1 block w-full border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${addOnErrors.name
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500'
                                        }`}
                                    required
                                />
                                {addOnErrors.name && <p className="mt-1 text-xs text-red-500">{addOnErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={currentAddOn.price || 0}
                                    onChange={(e) => setCurrentAddOn({ ...currentAddOn, price: parseFloat(e.target.value) })}
                                    className={`mt-1 block w-full border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${addOnErrors.price
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-orange-500'
                                        }`}
                                    required
                                />
                                {addOnErrors.price && <p className="mt-1 text-xs text-red-500">{addOnErrors.price}</p>}
                            </div>
                        </form>
                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={closeAddOnModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500" disabled={isSavingAddOn}>Cancel</button>
                            <button
                                onClick={handleSaveAddOn}
                                className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSavingAddOn}
                            >
                                {isSavingAddOn ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminMenuManagement;
