import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';
import { storeService } from '../services/storeService.ts';
import { Product } from '../types.ts';
import ProductCard from '../components/ProductCard.tsx';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await storeService.getProducts();
        setFeaturedProducts(products.filter(p => p.featured).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/40 dark:bg-white/10 border border-white/50 backdrop-blur-md text-purple-700 dark:text-purple-300 font-medium text-sm shadow-sm">
              New Collection 2024
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
              Discover the <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
                Future of Style
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
              Experience the clarity of premium shopping. Handpicked essentials curated for the modern aesthetic lifestyle.
            </p>
            <div className="flex gap-4">
              <Link 
                to="/shop" 
                className="px-8 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <button className="px-8 py-4 glass-card rounded-xl font-semibold text-gray-800 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-white/10 transition-colors">
                View Catalog
              </button>
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full blur-[100px] opacity-40"></div>
            <div className="relative z-10 glass-card p-6 rounded-3xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://picsum.photos/800/800?random=hero" 
                alt="Hero Product" 
                className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3]"
              />
              <div className="absolute bottom-10 left-10 right-10 glass-panel p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Featured</p>
                  <p className="font-bold text-gray-800 dark:text-gray-100">Premium Audio Series</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
                  <ArrowRight className="text-gray-800 dark:text-white" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Secure Payments", desc: "100% protected transactions via WhatsApp or Card" },
            { icon: Truck, title: "Fast Delivery", desc: "Island-wide delivery within 2-3 working days" },
            { icon: Star, title: "Premium Quality", desc: "Authentic products with manufacturer warranty" }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 rounded-2xl flex flex-col items-center text-center hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4 shadow-inner">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Trending Now</h2>
            <p className="text-gray-500 dark:text-gray-400">Top picks for this week</p>
          </div>
          <Link to="/shop" className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(n => (
              <div key={n} className="h-80 glass-card rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter / CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="glass-panel rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 z-[-1]"></div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Join the Inner Circle</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">Subscribe to get exclusive access to new drops, special offers, and secret sales.</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <button className="px-6 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;