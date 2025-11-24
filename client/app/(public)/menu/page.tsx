'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Category, MenuItem, ItemVariant } from '../../../types';
import { api } from '../../../services/api';
import { useCart } from '@/contexts/CartContext';
import {
    Plus, Soup, UtensilsCrossed, Cake, GlassWater, Wine, LucideIcon, Utensils, // Category Icons
    ArrowUpDown, ChevronDown, LayoutGrid, List, SlidersHorizontal, X, Search, ChevronRight
} from 'lucide-react';
import VariantSelectionModal from '@/components/common/VariantSelectionModal';
import Breadcrumb from '@/components/common/Breadcrumb';

const categoryIcons: { [key: string]: LucideIcon } = {
    'Appetizers': Wine,
    'Soups & Salads': Soup,
    'Main Course': UtensilsCrossed,
    'Breads & Rice': Utensils,
    'Desserts': Cake,
    'Beverages': GlassWater,
};

const MenuItemCard: React.FC<{ item: MenuItem; view: 'grid' | 'list', onAddToCart: (item: MenuItem) => void }> = ({ item, view, onAddToCart }) => {
    const variant = item.variants?.[0];

    if (!variant) return null; // Don't render if there's no variant/price

    if (view === 'list') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden flex flex-col sm:flex-row group transition-shadow duration-300 hover:shadow-lg">
                <Link href={`/menu/${item.id}`} className="block flex-shrink-0">
                    <img src={item.image_url || ''} alt={item.name} className="w-full sm:w-48 aspect-square object-cover" />
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                    <Link href={`/menu/${item.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-orange-500 transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex-grow">{item.description}</p>
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                        {/* FIX: Use price from variant */}
                        <span className="text-2xl font-black text-gray-900 dark:text-gray-100">${variant.price}</span>
                        <button
                            onClick={() => onAddToCart(item)}
                            className="bg-orange-100 text-orange-600 rounded-full w-11 h-11 flex items-center justify-center hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:hover:bg-orange-900/60 transition-colors"
                            aria-label={`Add ${item.name} to cart`}
                        >
                            <Plus size={22} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden flex flex-col group transition-shadow duration-300 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600">
            <Link href={`/menu/${item.id}`} className="overflow-hidden relative block">
                <img src={item.image_url || ''} alt={item.name} className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500" />
            </Link>
            <div className="p-5 flex flex-col flex-grow">
                <Link href={`/menu/${item.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-orange-500 transition-colors">{item.name}</h3>
                </Link>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex-grow">{item.description}</p>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                    {/* FIX: Use price from variant */}
                    <span className="text-2xl font-black text-gray-900 dark:text-gray-100">${variant.price}</span>
                    <button
                        onClick={() => onAddToCart(item)}
                        className="bg-orange-100 text-orange-600 rounded-full w-11 h-11 flex items-center justify-center hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:hover:bg-orange-900/60 transition-colors"
                        aria-label={`Add ${item.name} to cart`}
                    >
                        <Plus size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// New recursive component for rendering category tree
const CategoryListItem: React.FC<{
    category: Category;
    selectedCategory: number | null;
    onSelectCategory: (id: number | null) => void;
    level: number;
}> = ({ category, selectedCategory, onSelectCategory, level }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = category.children && category.children.length > 0;
    const isSelected = selectedCategory === category.id;

    const Icon = categoryIcons[category.name] || UtensilsCrossed;

    return (
        <li>
            <div
                onClick={() => {
                    onSelectCategory(category.id);
                    if (hasChildren) setIsOpen(!isOpen);
                }}
                className={`w-full text-left flex items-center justify-between p-3 rounded-lg font-semibold transition-colors cursor-pointer ${isSelected
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                style={{ paddingLeft: `${level * 16 + 12}px` }}
            >
                <span className="flex items-center gap-3">
                    <Icon size={20} />
                    {category.name}
                </span>
                {hasChildren && (
                    <ChevronRight size={16} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                )}
            </div>
            {hasChildren && isOpen && (
                <ul className="space-y-1 mt-1">
                    {category.children?.map(subcat => (
                        <CategoryListItem
                            key={subcat.id}
                            category={subcat}
                            selectedCategory={selectedCategory}
                            onSelectCategory={onSelectCategory}
                            level={level + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};


const Sidebar: React.FC<{
    categories: Category[];
    selectedCategory: number | null;
    onSelectCategory: (id: number | null) => void;
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
}> = ({ categories, selectedCategory, onSelectCategory, priceRange, onPriceChange }) => {
    const min = 0, max = 50;

    const categoryTree = useMemo(() => {
        const categoriesById: Map<number, Category> = new Map(categories.map(cat => [cat.id, { ...cat, children: [] }]));
        const tree: Category[] = [];
        for (const category of categories) {
            if (category.parent_id && categoriesById.has(category.parent_id)) {
                categoriesById.get(category.parent_id)!.children!.push(categoriesById.get(category.id)!);
            } else {
                tree.push(categoriesById.get(category.id)!);
            }
        }
        return tree;
    }, [categories]);

    return (
        <aside className="lg:w-72 xl:w-80 flex-shrink-0 space-y-8">
            {/* Menu Categories */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Menu Categories</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Browse by section</p>
                <ul className="space-y-1">
                    <li>
                        <div
                            onClick={() => onSelectCategory(null)}
                            className={`w-full text-left flex items-center justify-between p-3 rounded-lg font-semibold transition-colors cursor-pointer ${selectedCategory === null
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            <span className="flex items-center gap-3">
                                <UtensilsCrossed size={20} />
                                All Items
                            </span>
                        </div>
                    </li>
                    {categoryTree.map(cat => (
                        <CategoryListItem
                            key={cat.id}
                            category={cat}
                            selectedCategory={selectedCategory}
                            onSelectCategory={onSelectCategory}
                            level={0}
                        />
                    ))}
                </ul>
            </div>

            {/* Price Range */}
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Price Range</h3>
                <div className="relative h-9">
                    <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-600 w-full rounded-full"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 h-1 bg-orange-400" style={{ left: `${((priceRange[0] - min) / (max - min)) * 100}%`, right: `${100 - ((priceRange[1] - min) / (max - min)) * 100}%` }}></div>
                    <input type="range" min={min} max={max} value={priceRange[0]} onChange={e => onPriceChange([Math.min(Number(e.target.value), priceRange[1] - 1), priceRange[1]])} className="absolute w-full h-1 appearance-none bg-transparent pointer-events-auto range-thumb" />
                    <input type="range" min={min} max={max} value={priceRange[1]} onChange={e => onPriceChange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 1)])} className="absolute w-full h-1 appearance-none bg-transparent pointer-events-auto range-thumb" />
                </div>
                <div className="flex justify-between items-center mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
        </aside>
    );
};

const MenuPage: React.FC = () => {
    const { addItem } = useCart();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([10, 50]);
    const [sortBy, setSortBy] = useState('price-asc');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [variantModalItem, setVariantModalItem] = useState<MenuItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const breadcrumbs = [{ name: 'Menu', path: '/menu' }];

    const handleAddToCartClick = (item: MenuItem) => {
        if (item.variants.length > 1) {
            setVariantModalItem(item);
        } else if (item.variants.length === 1) {
            addItem(item, item.variants[0], 1, []);
        }
    };

    const handleVariantSelected = (variant: ItemVariant) => {
        if (variantModalItem) {
            addItem(variantModalItem, variant, 1, []);
        }
        setVariantModalItem(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [fetchedCategories, fetchedMenuItems] = await Promise.all([
                    api.getPublicCategories(),
                    api.getPublicMenuItems()
                ]);
                setCategories(fetchedCategories);
                setMenuItems(fetchedMenuItems);
                console.log(fetchedMenuItems);
            } catch (error) {
                console.error("Failed to fetch menu data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getAllChildCategoryIds = (categoryId: number, allCategories: Category[]): number[] => {
        let ids: number[] = [categoryId];
        const children = allCategories.filter(c => c.parent_id === categoryId);
        for (const child of children) {
            ids = [...ids, ...getAllChildCategoryIds(child.id, allCategories)];
        }
        return ids;
    };


    const filteredAndSortedItems = useMemo(() => {
        let categoryIdsToFilter: number[] = [];
        if (selectedCategory) {
            categoryIdsToFilter = getAllChildCategoryIds(selectedCategory, categories);
        }

        return menuItems
            .filter(item => {
                const price = item.variants?.[0]?.price ?? 0;
                const inCategory = selectedCategory ? categoryIdsToFilter.includes(item.category_id) : true;
                const inPrice = price >= priceRange[0] && price <= priceRange[1];

                const searchLower = searchTerm.toLowerCase();
                if (!searchTerm) {
                    return inCategory && inPrice;
                } else {
                    const nameMatch = item.name.toLowerCase().includes(searchLower);
                    const descriptionMatch = item.description?.toLowerCase().includes(searchLower) ?? false;
                    const inSearch = searchTerm ? nameMatch || descriptionMatch : true;
                    return inCategory && inPrice && inSearch;
                }
            })
            .sort((a, b) => {
                const priceA = a.variants?.[0]?.price ?? 0;
                const priceB = b.variants?.[0]?.price ?? 0;
                switch (sortBy) {
                    case 'price-asc': return priceA - priceB;
                    case 'price-desc': return priceB - priceA;
                    case 'name-asc': return a.name.localeCompare(b.name);
                    default: return 0;
                }
            });
    }, [menuItems, selectedCategory, priceRange, sortBy, categories, searchTerm]);

    console.log(filteredAndSortedItems);

    const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name;

    return (
        <>
            <Breadcrumb crumbs={breadcrumbs} />
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {variantModalItem && (
                    <VariantSelectionModal
                        item={variantModalItem}
                        onClose={() => setVariantModalItem(null)}
                        onAddToCart={handleVariantSelected}
                    />
                )}
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
                    {/* Mobile Sidebar Toggle */}
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden flex items-center gap-2 mb-4 p-2 border rounded-lg dark:border-gray-600">
                        <SlidersHorizontal size={18} /> Filters
                    </button>

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block">
                        <Sidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            priceRange={priceRange}
                            onPriceChange={setPriceRange}
                        />
                    </div>

                    {/* Mobile Sidebar (Drawer) */}
                    <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div onClick={() => setIsSidebarOpen(false)} className="absolute inset-0 bg-black/40"></div>
                        <div className={`absolute top-0 left-0 h-full w-80 bg-[#FAF9F6] dark:bg-gray-950 p-6 shadow-xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Filters</h2>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-1"><X /></button>
                            </div>
                            <Sidebar
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onSelectCategory={(id) => { setSelectedCategory(id); setIsSidebarOpen(false); }}
                                priceRange={priceRange}
                                onPriceChange={setPriceRange}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                            {selectedCategoryName ? `Explore Our ${selectedCategoryName}` : 'Our Full Menu'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Delicious dishes crafted with the finest ingredients.</p>

                        <div className="relative mb-6">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for dishes by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700/50 rounded-lg bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            />
                        </div>

                        {/* Filters & View Controls */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700/50">
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="relative">
                                    {/* Sort by dropdown can be implemented here */}
                                    <button className="flex items-center gap-2 py-2 px-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium">
                                        <ArrowUpDown size={16} /> Sort by <ChevronDown size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                <button onClick={() => setView('grid')} className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-white dark:bg-gray-800 text-orange-500' : 'text-gray-500'}`}><LayoutGrid size={20} /></button>
                                <button onClick={() => setView('list')} className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-white dark:bg-gray-800 text-orange-500' : 'text-gray-500'}`}><List size={20} /></button>
                            </div>
                        </div>

                        {loading ? (
                            <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 animate-pulse">
                                        <div className="w-full h-52 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                                {filteredAndSortedItems.length > 0 ? (
                                    filteredAndSortedItems.map(item => <MenuItemCard key={item.id} item={item} view={view} onAddToCart={handleAddToCartClick} />)
                                ) : (
                                    <div className="col-span-full text-center py-16">
                                        <Search size={48} className="mx-auto text-gray-400" />
                                        <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">No Dishes Found</h3>
                                        <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters to find what you&apos;re looking for.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
                <style jsx global>{`
                    .range-thumb::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 20px;
                        height: 20px;
                        background: white;
                        border: 2px solid #F97316;
                        border-radius: 50%;
                        cursor: pointer;
                        margin-top: -8px; /* Centers thumb on track */
                        pointer-events: all;
                        position: relative;
                        z-index: 10;
                    }
                    .range-thumb::-moz-range-thumb {
                        width: 20px;
                        height: 20px;
                        background: white;
                        border: 2px solid #F97316;
                        border-radius: 50%;
                        cursor: pointer;
                        pointer-events: all;
                        position: relative;
                        z-index: 10;
                    }
                    .range-thumb::-webkit-slider-runnable-track,
                    .range-thumb::-moz-range-track {
                        pointer-events: none;
                    }
                `}</style>
            </div>
        </>
    );
};

export default MenuPage;
