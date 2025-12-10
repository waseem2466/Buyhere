import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { storeService } from '../services/storeService.ts';
import { Product } from '../types.ts';
import { CATEGORIES } from '../constants.ts';
import ProductCard from '../components/ProductCard.tsx';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(500000); // Max price default

  useEffect(() => {
    storeService.getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price_retail <= priceRange;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, priceRange]);

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white dark:border-gray-600 border border-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          {/* Categories */}
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Filter size={18} /> Categories
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === 'All' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'}`}
              >
                All Categories
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="glass-card p-6 rounded-2xl">
             <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Max Price</h3>
             <input 
               type="range" 
               min="0" 
               max="500000" 
               step="5000"
               value={priceRange}
               onChange={(e) => setPriceRange(Number(e.target.value))}
               className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
             />
             <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
               <span>0</span>
               <span>{priceRange.toLocaleString()} LKR</span>
             </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {selectedCategory} <span className="text-gray-400 font-normal text-lg">({filteredProducts.length} items)</span>
            </h1>
            
            {/* Active Filters Tags */}
            {(selectedCategory !== 'All' || searchQuery) && (
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1"
              >
                Clear Filters <X size={14} />
              </button>
            )}
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1,2,3,4,5,6].map(n => (
                 <div key={n} className="h-80 glass-card rounded-2xl animate-pulse"></div>
               ))}
             </div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400">
              <p className="text-xl">No products found.</p>
              <p className="mt-2 text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;