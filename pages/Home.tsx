import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck, Zap, Sparkles, Smartphone, ShoppingBag, Wallet, Laptop, Heart } from 'lucide-react';
import { storeService } from '../services/storeService';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../constants';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await storeService.getProducts();
        // Filter featured products or get the first 3
        const featured = products.filter(p => p.featured);
        setFeaturedProducts(featured.length > 0 ? featured.slice(0, 3) : products.slice(0, 3));
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Category Icon & Details Map
  const categoryMeta: Record<string, { icon: string; desc: string; color: string }> = {
    "Baby Items": { icon: "🍼", desc: "Safe, organic infant goods", color: "from-pink-500/20 to-purple-500/20" },
    "Footwear": { icon: "👟", desc: "Premium sport & class shoes", color: "from-blue-500/20 to-indigo-500/20" },
    "Hand Bags": { icon: "👜", desc: "Elegant designer bags", color: "from-purple-500/20 to-fuchsia-500/20" },
    "Wallets": { icon: "💼", desc: "Genuine leather bi-folds", color: "from-amber-500/20 to-orange-500/20" },
    "Kitchen": { icon: "🍳", desc: "Chef-grade accessories", color: "from-teal-500/20 to-cyan-500/20" },
    "Electrical": { icon: "🔌", desc: "Advanced smart gear", color: "from-red-500/20 to-yellow-500/20" },
    "Toys": { icon: "🧸", desc: "Creative block playsets", color: "from-sky-500/20 to-emerald-500/20" },
    "Beauty": { icon: "✨", desc: "Nourishing vitamin serums", color: "from-fuchsia-500/20 to-rose-500/20" },
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-x-hidden font-sans">
      
      {/* Immersive Dark Radial Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/15 blur-[120px] filter animate-pulse duration-[8000ms]"></div>
        <div className="absolute top-[40%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[130px] filter"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/15 blur-[120px] filter animate-pulse duration-[6000ms]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-36 pb-20 grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-8 animate-fade-in">
            {/* Sri Lanka Luxe Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium tracking-wide shadow-2xl backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span>✨ Sri Lanka's Luxury Smart Marketplace</span>
            </div>

            {/* Dynamic Typography Header */}
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
              Smart Shopping
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-450 text-transparent bg-clip-text animate-gradient-text">
                Starts Here
              </span>
              In One Place
            </h1>

            {/* Structured Description */}
            <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
              Discover premium fashion, footwear, handbags, beauty products, smart electronics, kitchen accessories and thousands of verified household products in one modern luxury experience.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/shop" 
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold hover:scale-105 active:scale-95 transition duration-300 shadow-2xl shadow-indigo-500/20 flex items-center gap-2"
              >
                <span>Shop Now</span>
                <ArrowRight size={18} />
              </Link>

              <a 
                href="#categories" 
                className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors font-semibold"
              >
                Explore Categories
              </a>
            </div>

            {/* Multi-counter Stats */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/5">
              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">5K+</h2>
                <p className="text-gray-400 mt-1 text-xs uppercase font-semibold tracking-wider">Products</p>
              </div>

              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">2K+</h2>
                <p className="text-gray-400 mt-1 text-xs uppercase font-semibold tracking-wider">Customers</p>
              </div>

              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">24/7</h2>
                <p className="text-gray-400 mt-1 text-xs uppercase font-semibold tracking-wider">Support</p>
              </div>
            </div>
          </div>

          {/* Hero Premium Visual Feature Card */}
          <div className="relative group">
            {/* Background Blur Orbs */}
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-violet-600/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-600/20 blur-3xl rounded-full" />

            {/* Frame Container */}
            <div className="relative overflow-hidden bg-white/5 border border-white/15 rounded-[40px] p-6 backdrop-blur-2xl shadow-3xl">
              <img
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop"
                alt="Shopora Banner Fashion Model"
                className="w-full h-[450px] object-cover rounded-[30px] filter brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Floating Trending Banner overlaid */}
              <div className="absolute bottom-10 left-10 right-10 bg-black/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={12} /> Trending Collection
                    </p>
                    <h3 className="text-xl font-bold mt-1 text-white">Classic Mode Arrivals</h3>
                  </div>

                  <Link 
                    to="/shop" 
                    className="px-5 py-3 rounded-2xl bg-white text-black font-semibold hover:bg-neutral-200 transition-colors text-sm"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* TOP CATEGORIES SECTION */}
        <section id="categories" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-24">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <div className="text-sm font-bold tracking-widest text-violet-400 uppercase mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Catalog Highlights
              </div>
              <h2 className="text-4xl font-extrabold text-white">Top Categories</h2>
              <p className="text-gray-400 mt-2 text-sm">
                Explore our handpicked luxury collection tailored for premium tastes
              </p>
            </div>

            <Link 
              to="/shop" 
              className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold text-gray-200"
            >
              View Shop
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {CATEGORIES.map((category, index) => {
              const meta = categoryMeta[category] || { icon: "✨", desc: "Premium quality selection", color: "from-white/10 to-transparent" };
              return (
                <div
                  key={index}
                  onClick={() => handleCategoryClick(category)}
                  className="group relative p-6 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-white/15 backdrop-blur-xl hover:-translate-y-2 hover:bg-neutral-900 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Subtle Gradient Glow in Corner */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${meta.color} blur-xl rounded-full opacity-50`} />
                  
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform">
                    {meta.icon}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{category}</h3>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                    {meta.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>


        {/* TRENDING PRODUCTS */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <div className="text-sm font-bold tracking-widest text-cyan-450 uppercase mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Hot Right Now
              </div>
              <h2 className="text-4xl font-extrabold text-white">Trending Products</h2>
              <p className="text-gray-400 mt-2 text-sm">
                Most popular products on Shopora.lk updated live
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/shop"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 font-bold hover:scale-105 active:scale-95 transition-transform text-sm"
              >
                Flash Sale live
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-[2.5rem] bg-neutral-900 border border-white/5 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>


        {/* ISLANDWIDE DELIVERY & LANKA QR PAYMENT ASSURANCE */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-violet-950/30 via-indigo-950/20 to-neutral-900 backdrop-blur-3xl p-8 md:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-violet-600/10 blur-[90px] rounded-full" />
            
            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  🚚 Island Wide Fast Delivery
                </div>

                <h2 className="text-4xl lg:text-5xl font-black leading-tight text-white">
                  Upgrade Your Sri Lankan Shopping Experience
                </h2>

                <p className="text-gray-300 text-base leading-relaxed max-w-xl">
                  Shopora.lk ensures premium buyer protection. Shop secure orders using PayPal, Lanka QR local deposits, or standard Cash on Delivery (COD) service directly via WhatsApp.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link 
                    to="/shop" 
                    className="px-7 py-3.5 rounded-2xl bg-white text-black font-semibold hover:bg-neutral-200 hover:scale-105 transition-all outline-none"
                  >
                    Start Shopping
                  </Link>

                  <Link 
                    to="/contact" 
                    className="px-7 py-3.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors font-medium"
                  >
                    Become a Partner
                  </Link>
                </div>
              </div>

              {/* Bento Grid Features Layout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-neutral-900 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-4 font-bold text-sm">
                    QR
                  </div>
                  <h3 className="text-lg font-bold text-white">Lanka QR</h3>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                    Scan to pay locally via central bank supported QR codes.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-900 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 font-bold text-sm">
                    PP
                  </div>
                  <h3 className="text-lg font-bold text-white">PayPal</h3>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                    Worry-free international online checkout gateway.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-950/50 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4 font-bold text-sm">
                    COD
                  </div>
                  <h3 className="text-lg font-bold text-white">Cash on Delivery</h3>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                    Verify goods and pay on doorstep arrival island-wide.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-950/50 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4 font-bold text-sm">
                    24/7
                  </div>
                  <h3 className="text-lg font-bold text-white">Active Support</h3>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                    Responsive agent chats on WhatsApp for any order inquiries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
