



import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockMenuItems, mockCategories, mockAddOns, mockItemVariants } from '../../data/mockData';
import { MenuItem, Category, AddOn } from '../../types';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';

// FIX: Extracted props to an interface and used React.FC to solve typing issues with the `key` prop and other props.
interface DraggableCategoryItemProps {
    // FIX: Changed type from `any` to `Category` to enforce proper typing and resolve downstream errors.
    category: Category; 
    level: number; 
    onEdit: (cat: Category) => void; 
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
    handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
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
                    {/* FIX: Removed explicit 'any' type to allow for proper type inference from the strongly-typed 'category' prop. */}
                    {category.children.map((child) => (
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
  const [activeTab, setActiveTab] = useState('items');
  
  // App data state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [addOns, setAddOns] = useState<AddOn[]>(mockAddOns);

  // State for modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | Partial<MenuItem> | null>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | Partial<Category> | null>(null);

  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [currentAddOn, setCurrentAddOn] = useState<AddOn | Partial<AddOn> | null>(null);
  
  // State for category drag and drop
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<{ id: number | null; position: 'top' | 'bottom' | 'middle' | null }>({ id: null, position: null });


  // Modal handlers for Menu Items
  const openItemModal = (item?: MenuItem) => {
    // FIX: Removed price property from the default object to match MenuItem type.
    setCurrentItem(item || { name: '', category_id: 1, description: '', is_available: true, variants: [{id: 0, menu_item_id: 0, name: 'Regular', price: 0, is_available: true, created_at: new Date(), updated_at: new Date()}] });
    setShowItemModal(true);
  };
  const closeItemModal = () => {
    setShowItemModal(false);
    setCurrentItem(null);
  };
  const handleSaveItem = () => {
    console.log('Saving item:', currentItem);
    closeItemModal();
  };
  
  // Modal handlers for Categories
  const openCategoryModal = (category?: Category) => {
    setCurrentCategory(category || { name: '', description: '' });
    setShowCategoryModal(true);
  };
  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setCurrentCategory(null);
  };
  const handleSaveCategory = () => {
    console.log('Saving category:', currentCategory);
    closeCategoryModal();
  };
  
  const handleDeleteCategory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? Any sub-categories and menu items may be affected.')) {
        // Mock deletion
        console.log(`Deleting category ${id}`);
    }
  }

  // Modal handlers for Add-Ons
  const openAddOnModal = (addOn?: AddOn) => {
    setCurrentAddOn(addOn || { name: '', price: 0 });
    setShowAddOnModal(true);
  };
  const closeAddOnModal = () => {
    setShowAddOnModal(false);
    setCurrentAddOn(null);
  };
  const handleSaveAddOn = () => {
    console.log('Saving add-on:', currentAddOn);
    closeAddOnModal();
  };

  const handleAddNew = () => {
    if (activeTab === 'items') openItemModal();
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
        if (!child || !child.parent_id) {
            return false;
        }
        if (child.parent_id === potentialAncestorId) {
            return true;
        }
        return isAncestor(potentialAncestorId, child.parent_id);
    };

    const performDrop = (draggedId: number, targetId: number, position: 'top' | 'bottom' | 'middle' | null) => {
        if (!position) return;

        if (draggedId === targetId || isAncestor(draggedId, targetId)) {
            console.error("Cannot move a category into one of its own children.");
            return;
        }

        const newCategories = [...categories];
        const draggedItemIndex = newCategories.findIndex(c => c.id === draggedId);
        if (draggedItemIndex === -1) return;

        const [draggedItem] = newCategories.splice(draggedItemIndex, 1);

        const targetCategory = categories.find(c => c.id === targetId)!;

        if (position === 'middle') {
            draggedItem.parent_id = targetId;
        } else {
            draggedItem.parent_id = targetCategory.parent_id;
        }
        
        const targetItemIndex = newCategories.findIndex(c => c.id === targetId);
        
        let insertIndex = targetItemIndex;
        if (position === 'bottom') {
            insertIndex++;
        }
        
        // This is a simplified sort for visual purposes in a flat list that becomes a tree.
        // It does not guarantee perfect sibling order across different parent branches.
        if (position === 'middle') {
            newCategories.splice(targetItemIndex + 1, 0, draggedItem);
        } else {
            newCategories.splice(insertIndex, 0, draggedItem);
        }
        
        setCategories(newCategories);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(id));
        setDraggedItemId(id);
    };

    const handleDragEnd = () => {
        setDraggedItemId(null);
        setDropTarget({ id: null, position: null });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, category: Category) => {
        e.preventDefault();
        if (category.id === draggedItemId) return;
        
        const targetRect = e.currentTarget.getBoundingClientRect();
        const dropPositionRatio = (e.clientY - targetRect.top) / targetRect.height;
        let position: 'top' | 'bottom' | 'middle';
        if (dropPositionRatio < 0.25) {
            position = 'top';
        } else if (dropPositionRatio > 0.75) {
            position = 'bottom';
        } else {
            position = 'middle';
        }
        setDropTarget({ id: category.id, position });
    };

    const handleDragLeave = () => {
        setDropTarget({ id: null, position: null });
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const draggedId = Number(e.dataTransfer.getData('text/plain'));
        if (draggedId && dropTarget.id) {
            performDrop(draggedId, dropTarget.id, dropTarget.position);
        }
        handleDragEnd();
    };
    
    // Touch Handlers for Mobile
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, id: number) => {
        setDraggedItemId(id);
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!draggedItemId) return;
    
        const touch = e.touches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (!targetElement) return;

        const categoryContainer = targetElement.closest<HTMLDivElement>('[data-category-id]');
    
        if (!categoryContainer) {
            setDropTarget({ id: null, position: null });
            return;
        }
    
        const targetId = Number(categoryContainer.dataset.categoryId);
    
        if (targetId === draggedItemId) return;

        const targetRect = categoryContainer.getBoundingClientRect();
        const dropPositionRatio = (touch.clientY - targetRect.top) / targetRect.height;
        
        let position: 'top' | 'bottom' | 'middle';
        if (dropPositionRatio < 0.25) {
            position = 'top';
        } else if (dropPositionRatio > 0.75) {
            position = 'bottom';
        } else {
            position = 'middle';
        }
        
        if (dropTarget.id !== targetId || dropTarget.position !== position) {
          setDropTarget({ id: targetId, position });
        }
    };
    
    const handleTouchEnd = () => {
        if (draggedItemId && dropTarget.id) {
            performDrop(draggedItemId, dropTarget.id, dropTarget.position);
        }
        handleDragEnd();
    };

    const categoryTree = useMemo(() => {
        const categoriesById: Map<number, Category> = new Map(categories.map(cat => [cat.id, { ...cat, children: [] }]));
        const rootCategories: Category[] = [];

        // FIX: Iterate over the map's values to ensure we're working with the objects that have the `children` array.
        for (const category of categoriesById.values()) {
            if (category.parent_id && categoriesById.has(category.parent_id)) {
                const parent = categoriesById.get(category.parent_id)!;
                // Since `children` is optional on Category, ensure it exists before pushing. It will, due to initialization.
                if (parent.children) {
                    parent.children.push(category);
                }
            } else {
                rootCategories.push(category);
            }
        }
        return rootCategories;
    }, [categories]);

  const renderItems = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Available</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {menuItems.map(item => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`/menu/${item.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center group">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-md object-cover" src={item.image_url ?? ''} alt={item.name} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">{item.name}</div>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {categories.find(c => c.id === item.category_id)?.name}
              </td>
              {/* FIX: Use price from variants array. */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${item.variants?.[0]?.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_available ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {item.is_available ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => openItemModal(item)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-4"><Edit size={18} /></button>
                <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCategories = () => {
    return (
        <div className="space-y-1">
             {categoryTree.map(category => (
                <DraggableCategoryItem 
                    key={category.id} 
                    category={category} 
                    level={0} 
                    onEdit={openCategoryModal} 
                    onDelete={handleDeleteCategory}
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
    );
  };
  
  const renderAddOns = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {addOns.map(addOn => (
            <tr key={addOn.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{addOn.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${addOn.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => openAddOnModal(addOn)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 mr-4"><Edit size={18} /></button>
                <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

      {/* Item Modal */}
      {showItemModal && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{'id' in currentItem ? 'Edit' : 'Add'} Menu Item</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" defaultValue={currentItem.name} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea defaultValue={currentItem.description ?? ''} rows={3} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                  {/* FIX: Use price from variants array */}
                  <input type="number" step="0.01" defaultValue={currentItem.variants?.[0]?.price} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <select defaultValue={currentItem.category_id} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                 <input type="checkbox" defaultChecked={currentItem.is_available} className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
                 <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Is Available</label>
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={closeItemModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
              <button onClick={handleSaveItem} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && currentCategory && (
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
                <textarea defaultValue={currentCategory.description ?? ''} rows={3} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Parent Category</label>
                <select
                    defaultValue={currentCategory.parent_id ?? ''}
                    className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="">-- No Parent --</option>
                    {categories
                        .filter(cat => !('id' in currentCategory) || cat.id !== currentCategory.id) // Prevent a category from being its own parent
                        .map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))
                    }
                </select>
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={closeCategoryModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
              <button onClick={handleSaveCategory} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add-On Modal */}
      {showAddOnModal && currentAddOn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{'id' in currentAddOn ? 'Edit' : 'Add'} Add-On</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Add-On Name</label>
                <input type="text" defaultValue={currentAddOn.name} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                <input type="number" step="0.01" defaultValue={currentAddOn.price} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={closeAddOnModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
              <button onClick={handleSaveAddOn} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminMenuManagement;