import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuItem, Category, AddOn, ItemVariant } from '../../types';
import { api } from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import { Plus, Trash2, UploadCloud, X, Search } from 'lucide-react';

const AdminMenuItemManagement: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNew = id === undefined;

    const [item, setItem] = useState<MenuItem | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [allAddOns, setAllAddOns] = useState<AddOn[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [addOnSearch, setAddOnSearch] = useState('');
    const [isAddOnDropdownOpen, setIsAddOnDropdownOpen] = useState(false);
    const addOnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [cats, addons] = await Promise.all([
                api.getCategories(),
                api.getAddOns(),
            ]);
            setCategories(cats);
            setAllAddOns(addons);

            if (isNew) {
                setItem({
                    id: Date.now(),
                    name: '',
                    description: '',
                    category_id: cats[0]?.id || 1,
                    is_available: true,
                    is_featured: false,
                    image_url: null,
                    variants: [{ id: Date.now(), menu_item_id: 0, name: 'Regular', price: 0, is_available: true, created_at: new Date(), updated_at: new Date() }],
                    add_ons: [],
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            } else {
                const menuItem = await api.getMenuItemById(parseInt(id!));
                setItem(menuItem);
                if (menuItem?.image_url) {
                    setImagePreview(menuItem.image_url);
                }
            }
        };
        fetchData();
    }, [id, isNew]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (addOnRef.current && !addOnRef.current.contains(event.target as Node)) {
                setIsAddOnDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setItem(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setItem(prev => prev ? { ...prev, [name]: checked } : null);
    };

    const handleVariantChange = (variantId: number, field: 'name' | 'price', value: string | number) => {
        setItem(prev => {
            if (!prev) return null;
            const newVariants = prev.variants.map(v => 
                v.id === variantId ? { ...v, [field]: value } : v
            );
            return { ...prev, variants: newVariants };
        });
    };

    const addVariant = () => {
        setItem(prev => {
            if (!prev) return null;
            const newVariant: ItemVariant = {
                id: Date.now(),
                menu_item_id: prev.id,
                name: '',
                price: 0,
                is_available: true,
                created_at: new Date(),
                updated_at: new Date(),
            };
            return { ...prev, variants: [...prev.variants, newVariant] };
        });
    };

    const removeVariant = (variantId: number) => {
        setItem(prev => {
            if (!prev || prev.variants.length <= 1) return prev;
            const newVariants = prev.variants.filter(v => v.id !== variantId);
            return { ...prev, variants: newVariants };
        });
    };
    
    const handleAddOnSelect = (addOn: AddOn) => {
        setItem(prev => {
            if (!prev) return null;
            const currentAddOns = prev.add_ons || [];
            if (!currentAddOns.find(a => a.id === addOn.id)) {
                return { ...prev, add_ons: [...currentAddOns, addOn] };
            }
            return prev;
        });
        setAddOnSearch('');
        setIsAddOnDropdownOpen(false);
    };
    
    const handleAddOnRemove = (addOnId: number) => {
        setItem(prev => {
            if (!prev) return null;
            return { ...prev, add_ons: prev.add_ons?.filter(a => a.id !== addOnId) };
        });
    };

    const filteredAddOns = allAddOns.filter(a => 
      a.name.toLowerCase().includes(addOnSearch.toLowerCase()) &&
      !item?.add_ons?.some(sa => sa.id === a.id)
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        console.log("Saving item:", item);
        alert("Item saved successfully!");
        navigate('/dashboard/menu');
    };

    if (!item) return <div>Loading...</div>;

    const breadcrumbs = [
        { name: 'Menu Management', path: '/dashboard/menu' },
        { name: isNew ? 'New Item' : 'Edit Item', path: `/dashboard/menu/${isNew ? 'new' : `edit/${id}`}` },
    ];

    return (
        <div>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="flex justify-between items-center my-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{isNew ? 'Create Menu Item' : 'Edit Menu Item'}</h1>
                <div>
                    <button onClick={() => navigate('/dashboard/menu')} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 mr-2">Cancel</button>
                    <button onClick={handleSave} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600">Save Item</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                            <input type="text" name="name" value={item.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>
                         <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea name="description" value={item.description || ''} onChange={handleInputChange} rows={4} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Variants</h3>
                        <div className="space-y-4">
                            {item.variants.map((variant, index) => (
                                <div key={variant.id} className="grid grid-cols-12 gap-3 items-center">
                                    <div className="col-span-6">
                                        <label className="block text-xs text-gray-500">Variant Name</label>
                                        <input type="text" value={variant.name} onChange={(e) => handleVariantChange(variant.id, 'name', e.target.value)} placeholder="e.g., Small, Large" className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </div>
                                     <div className="col-span-4">
                                        <label className="block text-xs text-gray-500">Price</label>
                                        <input type="number" value={variant.price} onChange={(e) => handleVariantChange(variant.id, 'price', parseFloat(e.target.value) || 0)} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </div>
                                    <div className="col-span-2 pt-5">
                                        {item.variants.length > 1 && (
                                            <button onClick={() => removeVariant(variant.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50">
                                                <Trash2 size={18}/>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={addVariant} className="mt-4 text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-700">
                           <Plus size={16}/> Add Variant
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Add-ons</h3>
                        <div ref={addOnRef}>
                            <div className="flex flex-wrap gap-2 items-center p-2 border border-gray-300 dark:border-gray-600 rounded-md min-h-[44px]">
                                {item.add_ons?.map(addOn => (
                                    <div key={addOn.id} className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-200 text-sm font-semibold flex items-center gap-2 pl-3 pr-1 py-1 rounded-full">
                                        {addOn.name}
                                        <button onClick={() => handleAddOnRemove(addOn.id)} className="p-1 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        value={addOnSearch}
                                        onChange={e => setAddOnSearch(e.target.value)}
                                        onFocus={() => setIsAddOnDropdownOpen(true)}
                                        placeholder={item.add_ons?.length ? "" : "Search for add-ons..."}
                                        className="bg-transparent focus:outline-none w-full p-1 text-sm dark:text-white"
                                    />
                                </div>
                            </div>
                             {isAddOnDropdownOpen && (
                                <div className="relative">
                                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {filteredAddOns.length > 0 ? filteredAddOns.map(addOn => (
                                        <li key={addOn.id} onMouseDown={() => handleAddOnSelect(addOn)} className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200 flex justify-between">
                                            <span>{addOn.name}</span>
                                            <span className="text-gray-500 dark:text-gray-400">(+${addOn.price.toFixed(2)})</span>
                                        </li>
                                    )) : (
                                        <li className="p-3 text-sm text-gray-500 dark:text-gray-400">No add-ons found.</li>
                                    )}
                                </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Image</h3>
                        <div className="aspect-square rounded-md border-2 border-dashed dark:border-gray-600 flex items-center justify-center relative group overflow-hidden">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <button onClick={() => fileInputRef.current?.click()} className="text-white font-semibold">Change</button>
                                    </div>
                                </>
                            ) : (
                                <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                    <UploadCloud size={48} />
                                    <span className="mt-2 text-sm font-semibold">Upload Image</span>
                                </button>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*"/>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">Organization</h3>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                <select name="category_id" value={item.category_id} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 bg-white text-gray-900 rounded-md p-2 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Available</span>
                                <input type="checkbox" name="is_available" checked={item.is_available} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Is Featured</span>
                                <input type="checkbox" name="is_featured" checked={item.is_featured} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMenuItemManagement;
