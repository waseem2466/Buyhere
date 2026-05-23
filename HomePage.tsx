import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Truck, Shield, Headphones, RotateCcw, Star, Quote, Zap, TrendingUp, Award } from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.featured);
  const newArrivals = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center hero-gradient overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-rose-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-violet-200 dark:border-violet-800 text-sm font-medium text-violet-600 dark:text-violet-400"
              >
                <Zap className="w-4 h-4" />
                Premium Sri Lankan Online Store
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Discover{' '}
                <span className="text-gradient">Luxury</span>
                <br />
                Shopping
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                Experience the finest collection of hand-picked products delivered to your doorstep. 
                From fashion to electronics, we bring quality to every corner of Sri Lanka.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary inline-flex items-center gap-2 text-base">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop?filter=new"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                >
                  New Arrivals
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-6">
                {[
                  { value: '10K+', label: 'Happy Customers' },
                  { value: '500+', label: 'Products' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-3xl blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
                  alt="Shopping"
                  className="relative rounded-3xl shadow-2xl shadow-violet-500/10 w-full h-[500px] object-cover"
                />
                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -left-8 top-20 glass-panel rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Free Delivery</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">On orders 5000+</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -right-4 bottom-20 glass-panel rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Best Quality</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Guaranteed</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-slate-400 dark:bg-slate-500" />
          </div>
        </motion.div>
      </section>

      {/* Features Bar */}
      <section className="py-12 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'Orders over LKR 5,000' },
              { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
              { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '30-day policy' },
            ].map((feature, i) => (
              <AnimatedSection key={feature.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{feature.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{feature.desc}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-sm font-semibold mb-4">
              Browse by Category
            </span>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Shop by <span className="text-gradient">Category</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Explore our curated collections across multiple categories designed for every lifestyle
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((category, i) => {
              const images: Record<string, string> = {
                'Baby Items': 'https://images.unsplash.com/photo-1515488042361-404e9250afef?q=80&w=600',
                'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
                'Hand Bags': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600',
                'Wallets': 'https://images.unsplash.com/photo-1627123424538-76afeaf82658?q=80&w=600',
                'Kitchen': 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=600',
                'Electrical': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600',
                'Toys': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=600',
                'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600',
              };
              return (
                <AnimatedSection key={category}>
                  <Link to={`/shop?category=${category}`}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="category-card aspect-[4/5] relative group"
                    >
                      <img
                        src={images[category] || images['Hand Bags']}
                        alt={category}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                        <h3 className="text-white font-bold text-lg">{category}</h3>
                        <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          Explore Collection →
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 text-sm font-semibold mb-4">
                Featured
              </span>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
                Trending <span className="text-gradient">Now</span>
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold hover:gap-3 transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <AnimatedSection key={product.id}>
                <ProductCard product={product} index={i} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-white/80" />
                <span className="text-white/80 font-medium">New Collection 2026</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Fresh Arrivals<br />Every Week
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-md">
                Be the first to discover our latest products. New styles, new trends, new possibilities — updated weekly just for you.
              </p>
              <Link
                to="/shop?filter=new"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-600 rounded-xl font-bold hover:bg-white/90 transition-colors shadow-xl"
              >
                Explore New Arrivals <ArrowRight className="w-5 h-5" />
              </Link>
            </AnimatedSection>
            <AnimatedSection className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {newArrivals.slice(0, 4).map((product, i) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                    className="rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm font-semibold mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Loved by <span className="text-gradient">Thousands</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Perera',
                location: 'Colombo',
                text: 'Absolutely love the quality! The hand bag I ordered exceeded my expectations. Fast delivery and beautiful packaging. Will definitely shop again!',
                rating: 5,
                avatar: 'https://ui-avatars.com/api/?name=Sarah+Perera&background=f0abfc&color=7c3aed'
              },
              {
                name: 'Dinesh Fernando',
                location: 'Kandy',
                text: 'Best online shopping experience in Sri Lanka. The customer service is exceptional and products are exactly as described. Highly recommend!',
                rating: 5,
                avatar: 'https://ui-avatars.com/api/?name=Dinesh+Fernando&background=c4b5fd&color=5b21b6'
              },
              {
                name: 'Amaya Silva',
                location: 'Galle',
                text: 'The beauty products are authentic and affordable. I appreciate the cash on delivery option. Shopora.lk is now my go-to store!',
                rating: 5,
                avatar: 'https://ui-avatars.com/api/?name=Amaya+Silva&background=fce7f3&color=be185d'
              }
            ].map((testimonial, i) => (
              <AnimatedSection key={testimonial.name}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="testimonial-card h-full"
                >
                  <Quote className="w-8 h-8 text-violet-300 dark:text-violet-700 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">{testimonial.text}</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">{testimonial.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{testimonial.location}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="newsletter-gradient rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Join Our VIP List
                </h2>
                <p className="text-white/80 mb-8 max-w-md mx-auto">
                  Subscribe for exclusive deals, early access to new arrivals, and special discounts delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60"
                  />
                  <button className="px-6 py-3 bg-white text-violet-600 rounded-xl font-bold hover:bg-white/90 transition-colors">
                    Subscribe
                  </button>
                </div>
                <p className="text-white/50 text-xs mt-4">No spam, unsubscribe anytime. We respect your privacy.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
