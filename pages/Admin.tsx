import React, { useEffect, useState } from 'react';
import { 
  Package, Plus, Trash, Search, X, Save, Upload, Edit, 
  ChevronDown, ChevronUp, ShoppingBag, Sparkles, Sliders, 
  TrendingUp, Users, DollarSign, BarChart3, PieChart, Settings, Tag
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, Cell, 
  PieChart as ReChartsPieChart, Pie
} from 'recharts';
import { storeService } from '../services/storeService';
import { Product, Order, StoreSettings, Coupon } from '../types';
import { CURRENCY_SYMBOL, CATEGORIES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StudioFrame from '../components/StudioFrame';

const Admin: React.FC = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'coupons' | 'settings'>('dashboard');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Custom WhatsApp and Webhook states
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({
    whatsappNumber: '',
    whatsappWebhookEnabled: false,
    whatsappWebhookUrl: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  
  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState<Omit<Coupon, 'id' | 'createdAt'>>({
    code: '',
    type: 'percent',
    value: 0,
    minSpend: 0,
    isActive: true
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '',
    category: 'Electrical',
    price_retail: 0,
    discount: 0,
    stock: 0,
    description: '',
    images: [''],
    featured: false,
    studioFrame: 'none',
    studioReflection: true,
    studioShadow: true,
    studioScale: 90
  });

  const [outOfStockSizes, setOutOfStockSizes] = useState<string[]>([]);

  // Variant Inputs States (string represent comma separated input)
  const [variantInputs, setVariantInputs] = useState({
    sizes: '',
    colors: '',
    materials: ''
  });

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = () => {
    storeService.getProducts()
      .then(setProducts)
      .catch(err => console.error("Admin: failed to load products:", err instanceof Error ? err.message : String(err)));
      
    storeService.getOrders()
      .then(setOrders)
      .catch(err => console.error("Admin: failed to load orders:", err instanceof Error ? err.message : String(err)));
      
    storeService.getSettings()
      .then(setSettingsForm)
      .catch(err => console.error("Admin: failed to load settings:", err instanceof Error ? err.message : String(err)));
      
    storeService.getCoupons()
      .then(setCoupons)
      .catch(err => console.error("Admin: failed to load coupons:", err instanceof Error ? err.message : String(err)));
  };

  const openCouponAddModal = () => {
    setEditingCoupon(null);
    setCouponForm({
      code: '',
      type: 'percent',
      value: 0,
      minSpend: 0,
      isActive: true
    });
    setIsCouponModalOpen(true);
  };

  const openCouponEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minSpend: coupon.minSpend || 0,
      isActive: coupon.isActive
    });
    setIsCouponModalOpen(true);
  };

  const handleCouponSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        const updatedCoupon: Coupon = {
          ...editingCoupon,
          ...couponForm,
          code: couponForm.code.toUpperCase().trim()
        };
        await storeService.updateCoupon(updatedCoupon);
      } else {
        await storeService.addCoupon(couponForm);
      }
      setIsCouponModalOpen(false);
      const coupons = await storeService.getCoupons();
      setCoupons(coupons);
    } catch (error) {
      console.error("Failed to save coupon:", error instanceof Error ? error.message : String(error));
    }
  };

  const handleCouponDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await storeService.deleteCoupon(id);
        const coupons = await storeService.getCoupons();
        setCoupons(coupons);
      } catch (error) {
        console.error("Failed to delete coupon:", error instanceof Error ? error.message : String(error));
      }
    }
  };

  const handleCouponToggleActive = async (coupon: Coupon) => {
    try {
      const updated = { ...coupon, isActive: !coupon.isActive };
      await storeService.updateCoupon(updated);
      const coupons = await storeService.getCoupons();
      setCoupons(coupons);
    } catch (error) {
      console.error("Failed to toggle coupon active state:", error instanceof Error ? error.message : String(error));
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: 'Electrical',
      price_retail: 0,
      discount: 0,
      stock: 0,
      description: '',
      images: [''],
      featured: false,
      studioFrame: 'none',
      studioReflection: true,
      studioShadow: true,
      studioScale: 90
    });
    setVariantInputs({
      sizes: '',
      colors: '',
      materials: ''
    });
    setOutOfStockSizes([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ 
      ...product,
      studioFrame: product.studioFrame || 'none',
      studioReflection: product.studioReflection !== false,
      studioShadow: product.studioShadow !== false,
      studioScale: product.studioScale || 90
    });
    setVariantInputs({
      sizes: product.sizes ? product.sizes.join(', ') : '',
      colors: product.colors ? product.colors.join(', ') : '',
      materials: product.materials ? product.materials.join(', ') : ''
    });
    setOutOfStockSizes(product.outOfStockSizes || []);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setProductForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setProductForm(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setProductForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (value: string) => {
    setProductForm(prev => ({ ...prev, images: [value] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price_retail) return;

    // Parse Variants comma text
    const sizesArr = variantInputs.sizes.split(',').map(s => s.trim()).filter(s => s !== '');
    const colorsArr = variantInputs.colors.split(',').map(s => s.trim()).filter(s => s !== '');
    const materialsArr = variantInputs.materials.split(',').map(s => s.trim()).filter(s => s !== '');

    const finalProductData = {
      ...productForm,
      sizes: sizesArr,
      colors: colorsArr,
      materials: materialsArr,
      outOfStockSizes: outOfStockSizes.filter(s => sizesArr.includes(s)),
      discount: Number(productForm.discount) || 0
    };

    if (editingProduct) {
      // Update existing
      await storeService.updateProduct({
        ...editingProduct,
        ...finalProductData as any
      });
    } else {
      // Create new
      const slug = productForm.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      await storeService.addProduct({
        ...finalProductData as any,
        slug
      });
    }
    
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await storeService.deleteProduct(id);
      loadData();
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await storeService.updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const toggleOrderExpand = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  if (!isAdmin) return null;

  // --- Dashboard Analytics Calculations ---
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const uniqueCustomers = new Set(orders.map(o => o.customerPhone?.trim() || o.customerName?.trim()));
  const totalCustomersCount = uniqueCustomers.size;
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stock, 0);
  
  // Best selling products aggregation
  const productQuantityMap: { [key: string]: { title: string, qty: number, revenue: number, category: string, image: string } } = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const slug = item.slug;
      if (!productQuantityMap[slug]) {
        productQuantityMap[slug] = {
          title: item.title,
          qty: 0,
          revenue: 0,
          category: item.category,
          image: item.images?.[0] || ''
        };
      }
      const finalItemPrice = item.discount 
        ? item.price_retail * (1 - item.discount / 100) 
        : item.price_retail;
      productQuantityMap[slug].qty += item.qty;
      productQuantityMap[slug].revenue += finalItemPrice * item.qty;
    });
  });

  const bestSellers = Object.values(productQuantityMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Revenue Day-on-Day group aggregation
  const revenueByDayMap: { [key: string]: number } = {};
  orders.forEach(o => {
    const day = o.createdAt ? o.createdAt.split('T')[0] : 'N/A';
    revenueByDayMap[day] = (revenueByDayMap[day] || 0) + o.total;
  });

  const chartData = Object.keys(revenueByDayMap)
    .sort()
    .map(day => ({
      date: day,
      Revenue: revenueByDayMap[day]
    }))
    .slice(-7);

  const finalChartData = chartData.length > 0 ? chartData : [
    { date: '05-15', Revenue: 45000 },
    { date: '05-16', Revenue: 85000 },
    { date: '05-17', Revenue: 120000 },
    { date: '05-18', Revenue: 95000 },
    { date: '05-19', Revenue: 165000 },
    { date: '05-20', Revenue: 210000 },
    { date: '05-21', Revenue: 185000 },
  ];

  // Category distribution aggregation
  const categorySalesMap: { [key: string]: number } = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      categorySalesMap[item.category] = (categorySalesMap[item.category] || 0) + (item.price_retail * (1 - (item.discount || 0)/100) * item.qty);
    });
  });

  const categoryChartData = Object.keys(categorySalesMap).map(category => ({
    name: category,
    value: categorySalesMap[category]
  }));

  const finalCategoryChartData = categoryChartData.length > 0 ? categoryChartData : [
    { name: 'Electrical', value: 120000 },
    { name: 'Cosmetics', value: 65000 },
    { name: 'Sarees', value: 95000 },
    { name: 'Handbags', value: 80000 },
  ];

  const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 font-sans">Admin Control Center</h1>
        
        {/* Glass Pill Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-white/40 dark:bg-white/5 rounded-xl w-fit border border-white/20">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'dashboard' 
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-md ring-1 ring-black/5' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
             <BarChart3 size={16} /> Analytics Info
          </button>

          <button 
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'products' 
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-md ring-1 ring-black/5' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
             <Package size={16} /> Products ({products.length})
          </button>

          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'orders' 
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-md ring-1 ring-black/5' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
             <ShoppingBag size={16} /> Orders ({orders.length})
          </button>

          <button 
            onClick={() => setActiveTab('coupons')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'coupons' 
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-md ring-1 ring-black/5' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
             <Tag size={16} /> Promo Coupons ({coupons.length})
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'settings' 
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-md ring-1 ring-black/5' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
             <Settings size={16} /> WhatsApp Agent
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden min-h-[500px]">
        {activeTab === 'dashboard' && (
          <div className="p-8 space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-600 dark:text-purple-400" />
                  Live Marketplace Insights
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Real-time performance analytics of Shopora.lk seller network</p>
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400 font-mono bg-purple-50 dark:bg-purple-950/30 px-3 py-1.5 rounded-lg border border-purple-100 dark:border-purple-900/30">
                Data refreshed just now • Auto Sync active
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Revenue */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/10 dark:to-indigo-950/10 border border-purple-100/50 dark:border-purple-900/20 rounded-2xl shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <DollarSign size={80} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400 mb-2">
                  <span className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                    <TrendingUp size={20} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Revenue</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  {CURRENCY_SYMBOL} {totalRevenue.toLocaleString()}
                </h3>
                <p className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-1">▲ 14.2% Growth than last month</p>
              </div>

              {/* Orders */}
              <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/10 dark:to-rose-950/10 border border-pink-100/50 dark:border-pink-900/20 rounded-2xl shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={80} className="text-pink-600 dark:text-pink-400" />
                </div>
                <div className="flex items-center gap-3 text-pink-600 dark:text-pink-400 mb-2">
                  <span className="p-2 bg-pink-100 dark:bg-pink-900/50 rounded-xl">
                    <ShoppingBag size={20} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Purchase Orders</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  {totalOrdersCount}
                </h3>
                <p className="text-[10px] text-gray-500 mt-1">Overall conversion: 4.8% CTR</p>
              </div>

              {/* Customers */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/10 dark:to-sky-950/10 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Users size={80} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-2">
                  <span className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                    <Users size={20} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Registered Patrons</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  {totalCustomersCount}
                </h3>
                <p className="text-[10px] text-blue-600 dark:text-green-400 font-bold mt-1">▲ 8% New customer registration</p>
              </div>

              {/* Active Stock */}
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/10 dark:to-teal-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-2xl shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Package size={80} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                  <span className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                    <Package size={20} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Stock Qty</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  {totalInventoryUnits} <span className="text-xs text-gray-400 font-medium">units</span>
                </h3>
                <p className="text-[10px] text-gray-500 mt-1">Products across {CATEGORIES.length} categories</p>
              </div>
            </div>

            {/* Charts Panel */}
            <div className="grid md:grid-cols-5 gap-6">
              {/* Sales area chart */}
              <div className="md:col-span-3 p-6 bg-white dark:bg-black/10 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    📈 Revenue Timeline Trend
                  </h3>
                  <span className="text-[11px] text-gray-400">Daily transaction volumes recorded in local currency</span>
                </div>
                <div className="h-64 wc-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={finalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-10" />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(val) => `Rs.${val/1000}k`} tickLine={false} />
                      <Tooltip 
                        formatter={(val: any) => [`Rs. ${val.toLocaleString()}`, 'Revenue']} 
                        contentStyle={{ backgroundColor: '#1F2937', borderRadius: '8px', color: '#fff', border: 'none', fontSize: 12 }}
                      />
                      <Area type="monotone" dataKey="Revenue" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#purpleGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown Bar chart */}
              <div className="md:col-span-2 p-6 bg-white dark:bg-black/10 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    📊 Category Distribution
                  </h3>
                  <span className="text-[11px] text-gray-400">Revenue contribution weighted across departments</span>
                </div>
                <div className="h-64 wc-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={finalCategoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:opacity-10" />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(val) => `Rs.${val/1000}k`} tickLine={false} />
                      <Tooltip 
                        formatter={(val: any) => [`Rs. ${val.toLocaleString()}`, 'Sales']}
                        contentStyle={{ backgroundColor: '#1F2937', borderRadius: '8px', color: '#fff', border: 'none', fontSize: 12 }}
                      />
                      <Bar dataKey="value" fill="#EC4899" radius={[6, 6, 0, 0]}>
                        {finalCategoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Best Sellers Board */}
            <div className="p-6 bg-white dark:bg-black/10 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    🔥 Hot Sellers Leaderboard
                  </h3>
                  <p className="text-[11px] text-gray-400">Our best performing list of items according to global checkouts done on Shopora.lk</p>
                </div>
              </div>

              {bestSellers.length === 0 ? (
                <div className="text-center text-gray-400 dark:text-gray-500 py-12 text-sm leading-relaxed">
                  🛒 No checkout transactions recorded yet.<br/>We've shown sample charts above. When buyers start placing WhatsApp orders, this leaderboard updates instantly!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left bg-gray-50/50 dark:bg-white/5 text-gray-450 dark:text-gray-400 text-[10px] uppercase font-extrabold tracking-widest border-b border-gray-100 dark:border-gray-800">
                        <th className="p-3">Rank / Product</th>
                        <th className="p-3">Category</th>
                        <th className="p-3 text-center">Quantities Sold</th>
                        <th className="p-3 text-right">Sum Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-850">
                      {bestSellers.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50/55 dark:hover:bg-white/5 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <span className="w-6 h-6 flex items-center justify-center font-bold text-xs ring-2 ring-purple-600/10 text-purple-600 bg-purple-50 dark:bg-purple-950/40 rounded-full">
                              {index + 1}
                            </span>
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-150 dark:border-gray-800 flex-shrink-0">
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-gray-850 dark:text-gray-200 text-sm line-clamp-1">{item.title}</span>
                          </td>
                          <td className="p-3">
                            <span className="bg-purple-100/50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-gray-700 dark:text-gray-300 text-sm">
                            {item.qty} units
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">
                            {CURRENCY_SYMBOL} {item.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white text-sm" />
              </div>
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30 text-sm font-bold"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 rounded-tl-xl font-semibold">Product</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Stock</th>
                    <th className="p-4 rounded-tr-xl font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {products.map(p => (
                    <tr key={p.id} className="group hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700">
                           <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="font-semibold text-gray-900 dark:text-white text-sm">{p.title}</p>
                           <div className="flex flex-wrap items-center gap-1.5 mt-1">
                             <span className="text-xs text-gray-400 dark:text-gray-500">{p.category}</span>
                             {p.discount ? (
                               <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                                 🏷️ {p.discount}% OFF
                               </span>
                             ) : null}
                             {p.outOfStockSizes && p.outOfStockSizes.length > 0 ? (
                               <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400">
                                 ⚠️ Sold out: {p.outOfStockSizes.join(', ')}
                               </span>
                             ) : null}
                           </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-300 font-medium text-sm">
                         {CURRENCY_SYMBOL} {p.price_retail.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.stock < 10 ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
           <div className="p-6">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
             </div>
             {orders.length === 0 ? (
               <div className="text-center text-gray-500 dark:text-gray-400 py-20 flex flex-col items-center">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p>No orders found yet</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {orders.map(order => (
                   <div key={order.id} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-700/50 rounded-xl overflow-hidden transition-all hover:shadow-md">
                     <div 
                        className="p-5 flex flex-wrap justify-between items-center cursor-pointer"
                        onClick={() => toggleOrderExpand(order.id)}
                      >
                       <div className="flex gap-4 items-center">
                         <div className={`p-2 rounded-full transition-colors ${expandedOrder === order.id ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
                            {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                         </div>
                         <div>
                           <div className="flex items-center gap-3">
                              <span className="font-bold text-gray-900 dark:text-white">Order #{order.id}</span>
                              <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                           </div>
                           <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerName}</p>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-6 mt-4 sm:mt-0">
                         <div className="text-right">
                           <p className="font-bold text-gray-900 dark:text-white">{CURRENCY_SYMBOL} {order.total.toLocaleString()}</p>
                           <p className="text-xs text-gray-500">{order.items.length} items</p>
                         </div>
                         <div onClick={(e) => e.stopPropagation()}>
                           <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold uppercase border-none focus:ring-2 focus:ring-purple-500 cursor-pointer ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                         </div>
                       </div>
                     </div>

                     {/* Expanded Details */}
                     {expandedOrder === order.id && (
                       <div className="px-5 pb-5 pt-0 border-t border-gray-100 dark:border-gray-800 mt-2 pt-4">
                         <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                              <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-bold mb-3 tracking-wider">Delivery Details</h4>
                              <div className="space-y-2 text-sm">
                                <p className="flex justify-between"><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900 dark:text-white">{order.customerPhone}</span></p>
                                <p className="flex justify-between"><span className="text-gray-500">Address:</span> <span className="font-medium text-gray-900 dark:text-white text-right">{order.shippingAddress || 'N/A'}</span></p>
                                {order.userEmail && <p className="flex justify-between"><span className="text-gray-500">User Email:</span> <span className="font-medium text-gray-900 dark:text-white">{order.userEmail}</span></p>}
                                {order.couponCode && (
                                  <p className="flex justify-between text-green-600 dark:text-green-400 font-bold"><span className="text-gray-500">Promo Code:</span> <span>{order.couponCode} (-{CURRENCY_SYMBOL} {(order.couponDiscount || 0).toLocaleString()})</span></p>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-bold mb-3 tracking-wider">Items Ordered</h4>
                              <ul className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <li key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                       <img src={item.images[0]} alt="" className="w-8 h-8 rounded object-cover bg-gray-200" />
                                       <span className="text-gray-700 dark:text-gray-200">{item.title} <span className="text-gray-400 text-xs">x{item.qty}</span></span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{CURRENCY_SYMBOL} {(item.price_retail * item.qty).toLocaleString()}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                         </div>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             )}
           </div>
        )}
      </div>

        {activeTab === 'settings' && (
          <div className="p-8 space-y-8 animate-fade-in-up">
            <div className="border-b border-gray-150 dark:border-gray-800 pb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="text-purple-600 dark:text-purple-400" size={22} />
                WhatsApp Agent & Automation Settings
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Configure your custom customer-facing WhatsApp destination or dispatch webhook transactions to your automatic AI bot agents.
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setSavingSettings(true);
              setSettingsSuccess(false);
              await storeService.saveSettings(settingsForm);
              setSavingSettings(false);
              setSettingsSuccess(true);
              setTimeout(() => setSettingsSuccess(false), 4000);
            }} className="max-w-2xl space-y-6">
              
              {/* WhatsApp Number Section */}
              <div className="bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-900/20 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-purple-900 dark:text-purple-300">WhatsApp Destination Agent</h3>
                    <p className="text-xs text-gray-500">Number where customers' self-checkout order is directed</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    Agent Phone Number
                  </label>
                  <input 
                    type="text" 
                    required
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="947649500844"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:text-white"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
                    Provide the destination phone number in fully formatted international syntax with no plus signs, dashes or spacing (e.g., <code>947649500844</code>).
                  </p>
                </div>
              </div>

              {/* Automatic Webhook Agent Integration Section */}
              <div className="bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-300">Automated Webhook Integration</h3>
                      <p className="text-xs text-gray-500">Post transactions instantly to your custom WhatsApp bot</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={settingsForm.whatsappWebhookEnabled}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappWebhookEnabled: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {settingsForm.whatsappWebhookEnabled && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                        Automatic Endpoint URL (HTTP POST)
                      </label>
                      <input 
                        type="url" 
                        required
                        value={settingsForm.whatsappWebhookUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappWebhookUrl: e.target.value })}
                        placeholder="https://your-custom-automatic-agent.com/api/order-webhook"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-500 outline-none text-sm dark:text-white"
                      />
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 align-middle">
                        Whenever an order is checked out, our shop system will transmit an asynchronous <code>POST</code> request containing the order document. Secure your web server or custom agent server to parse this request body automatically.
                      </p>
                    </div>

                    <div className="bg-white/50 dark:bg-black/10 border border-zinc-200/50 dark:border-zinc-800 rounded-xl p-4">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Example Bot JSON Body payload:</span>
                      <pre className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 overflow-x-auto mt-2 max-h-44 p-2 bg-zinc-50 dark:bg-black/30 rounded-lg">
{`{
  "event": "order.created",
  "order": {
    "id": "A7z9Xp4Q10Ld",
    "customerName": "Waseem Khan",
    "customerPhone": "0771234567",
    "shippingAddress": "123 Market Street, Kandy",
    "total": 13750,
    "items": [
      {
        "id": "prod_1",
        "title": "Smart Watch",
        "qty": 1,
        "price_retail": 8500
      }
    ]
  }
}`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Rows */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {savingSettings ? 'Saving Integrated Changes...' : 'Save Settings'}
                </button>

                {settingsSuccess && (
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-lg border border-green-100 dark:border-green-900/30 animate-fade-in flex items-center gap-1.5">
                    Integration configurations updated successfully! ✅
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="p-8 space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-150 dark:border-gray-800 pb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Tag className="text-purple-600 dark:text-purple-400" size={22} />
                  Promo Coupon Codes
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Manage active discount and promotional codes for customer checkout on your store.
                </p>
              </div>
              <button 
                onClick={openCouponAddModal}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 w-fit cursor-pointer"
              >
                <Plus size={16} /> Create Coupon
              </button>
            </div>

            {coupons.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl border border-dashed border-gray-205 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                <Tag size={40} className="mx-auto text-gray-400/50 mb-3" />
                <p className="font-bold text-sm text-gray-900 dark:text-white">No promo codes yet</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">Create your first promo code to incentivize checkout transactions.</p>
                <button 
                  onClick={openCouponAddModal}
                  className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Create Promo Code
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm text-gray-600 dark:text-gray-300">
                  <thead>
                    <tr className="border-b border-gray-150 dark:border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Coupon Code</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Value</th>
                      <th className="py-3.5 px-4">Min Spend</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} className="border-b border-gray-100 dark:border-zinc-850 hover:bg-gray-50/50 dark:hover:bg-zinc-850/20 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-bold text-gray-900 dark:text-white bg-purple-50 dark:bg-purple-950/20 px-2.5 py-1 rounded-md text-xs font-mono tracking-wider border border-purple-100 dark:border-purple-900/10">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="py-4 px-4 capitalize font-semibold">{coupon.type}</td>
                        <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">
                          {coupon.type === 'percent' ? `${coupon.value}%` : `${CURRENCY_SYMBOL} ${coupon.value.toLocaleString()}`}
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-500 dark:text-gray-400">
                          {coupon.minSpend ? `${CURRENCY_SYMBOL} ${coupon.minSpend.toLocaleString()}` : 'None'}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleCouponToggleActive(coupon)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer capitalize ${
                              coupon.isActive 
                                ? 'bg-green-100/60 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-900/25' 
                                : 'bg-gray-100/60 dark:bg-zinc-800 text-gray-500 border-gray-250 dark:border-zinc-700'
                            }`}
                          >
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => openCouponEditModal(coupon)}
                              className="p-1 px-2.5 hover:bg-gray-150 dark:hover:bg-zinc-800 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleCouponDelete(coupon.id)}
                              className="p-1 px-2.5 hover:bg-red-50 dark:hover:bg-red-950/10 text-red-500 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      {/* Add/Edit Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCouponModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-gray-200 dark:border-gray-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingCoupon ? 'Edit Promo Coupon' : 'Create Promo Coupon'}
              </h2>
              <button onClick={() => setIsCouponModalOpen(false)} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCouponSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 font-sans">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SAVE10"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase().trim() })}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white uppercase font-bold font-mono tracking-wider text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 font-sans">Discount Type</label>
                  <select 
                    value={couponForm.type}
                    onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as 'percent' | 'fixed' })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed LKR Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 font-sans">Deduction Value</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={couponForm.value || ''}
                    onChange={(e) => setCouponForm({ ...couponForm, value: parseFloat(e.target.value) || 0 })}
                    placeholder={couponForm.type === 'percent' ? '15' : '500'}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 font-sans">Minimum Spend ({CURRENCY_SYMBOL}, optional)</label>
                <input 
                  type="number" 
                  min="0"
                  value={couponForm.minSpend || ''}
                  onChange={(e) => setCouponForm({ ...couponForm, minSpend: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g. 2000"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-black/10 rounded-xl">
                <input 
                  type="checkbox" 
                  id="coupon_active"
                  checked={couponForm.isActive}
                  onChange={(e) => setCouponForm({ ...couponForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <label htmlFor="coupon_active" className="text-gray-800 dark:text-gray-200 text-sm font-medium select-none cursor-pointer">
                  Activate Promo Coupon Immediately
                </label>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer text-sm"
              >
                <Save size={16} /> {editingCoupon ? 'Update Promo Coupon' : 'Create Promo Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-gray-200 dark:border-gray-800">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Preview */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Real-time Visual Preview</span>
                  <div className="w-full h-56 max-w-sm rounded-[2rem] bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 flex items-center justify-center overflow-hidden relative group transition-colors">
                    {productForm.images?.[0] ? (
                      productForm.studioFrame && productForm.studioFrame !== 'none' ? (
                        <StudioFrame 
                          src={productForm.images[0]} 
                          alt="Preview" 
                          frame={productForm.studioFrame as any}
                          reflection={productForm.studioReflection}
                          shadow={productForm.studioShadow}
                          scale={productForm.studioScale}
                        />
                      ) : (
                        <img src={productForm.images[0]} alt="Preview" className="max-h-[85%] w-auto object-contain drop-shadow-xl" referrerPolicy="no-referrer" />
                      )
                    ) : (
                      <div className="text-center p-4">
                         <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                         <span className="text-xs text-gray-400">No Image URL Configured</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wide">Product Title</label>
                    <input 
                      name="title"
                      value={productForm.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white transition-all"
                      placeholder="e.g. Wireless Headphones"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wide">Category</label>
                    <div className="relative">
                       <select 
                        name="category"
                        value={productForm.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white appearance-none transition-all"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat} className="text-black">{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wide">Price ({CURRENCY_SYMBOL})</label>
                    <input 
                      name="price_retail"
                      type="number"
                      value={productForm.price_retail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-purple-600 dark:text-purple-455 uppercase mb-2 tracking-wide flex items-center gap-1">
                      <Sparkles size={12} /> Offer/Discount (%)
                    </label>
                    <input 
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={productForm.discount ?? 0}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-purple-50/30 dark:bg-purple-950/10 border border-purple-200/60 dark:border-purple-900/40 focus:ring-2 focus:ring-purple-500 outline-none text-purple-900 dark:text-purple-300 font-bold transition-all"
                      placeholder="e.g. 10 for 10% Off"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wide">Stock Qty</label>
                    <input 
                      name="stock"
                      type="number"
                      value={productForm.stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wide">Product Image Gallery (URLs)</label>
                  <div className="space-y-3">
                    {(productForm.images || ['']).map((url, index) => (
                      <div key={index} className="flex gap-2.5">
                        <input 
                          type="text"
                          value={url}
                          onChange={(e) => {
                            const updatedUrls = [...(productForm.images || [''])];
                            updatedUrls[index] = e.target.value;
                            setProductForm(prev => ({ ...prev, images: updatedUrls }));
                          }}
                          className="flex-1 px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white font-mono text-xs"
                          placeholder={`Image URL #${index + 1}`}
                        />
                        {(productForm.images || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedUrls = (productForm.images || ['']).filter((_, idx) => idx !== index);
                              setProductForm(prev => ({ ...prev, images: updatedUrls }));
                            }}
                            className="p-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-900/30 rounded-xl"
                          >
                            <Trash size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setProductForm(prev => ({ ...prev, images: [...(prev.images || ['']), ''] }))}
                      className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline font-extrabold"
                    >
                      <Plus size={14} /> Add Another Gallery Image URL
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
                    💡 <strong>Pro-Tip:</strong> Use web services like <b>remove.bg</b> to make your image background transparent first, then add the URL here to let our <b>Shopora AI Studio Framer</b> render studio textures!
                  </p>
                </div>

                {/* --- Shopora AI Studio Backdrop Framer --- */}
                <div className="bg-purple-50/50 dark:bg-purple-950/15 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 px-2.5 bg-purple-600 dark:bg-purple-500 text-white rounded-full text-[10px] uppercase font-extrabold tracking-wider">NEW</span>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5 font-sans">
                      ✨ Shopora AI Studio Backdrop Framer
                    </h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wide">Studio Backdrop Style</label>
                      <select 
                        name="studioFrame"
                        value={productForm.studioFrame || 'none'}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all font-sans font-medium"
                      >
                        <option value="none">❌ No Studio Backdrop (Raw Photo Only)</option>
                        <option value="minimalist">🥚 Modern Minimalist (Clean Floor & Radial Spotlight)</option>
                        <option value="velvet">👑 Luxury Black Velvet (Premium Satin Drapes & Neon Glow)</option>
                        <option value="marble">🏛️ Cosmic Slate / Dark Marble (Gold Backlight Spotlight)</option>
                        <option value="glass">💎 Liquid Reflections (Abstract Teal Glass Bokeh)</option>
                        <option value="wood">🪵 Cedar Wood Terrace (Organic Leaf Contrast Overlay)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wide">Product Zoom Scale ({productForm.studioScale || 90}%)</label>
                      <input 
                        type="range"
                        name="studioScale"
                        min="40"
                        max="145"
                        value={productForm.studioScale || 90}
                        onChange={(e) => setProductForm(prev => ({ ...prev, studioScale: Number(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600 mt-2"
                      />
                    </div>
                  </div>

                  {productForm.studioFrame !== 'none' && (
                    <div className="flex flex-wrap gap-5 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                        <input 
                          type="checkbox"
                          checked={productForm.studioReflection !== false}
                          onChange={(e) => setProductForm(prev => ({ ...prev, studioReflection: e.target.checked }))}
                          className="h-4 w-4 rounded text-purple-600 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-purple-500"
                        />
                        <span>Enable Real-time Floor Glass Mirror Reflection</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                        <input 
                          type="checkbox"
                          checked={productForm.studioShadow !== false}
                          onChange={(e) => setProductForm(prev => ({ ...prev, studioShadow: e.target.checked }))}
                          className="h-4 w-4 rounded text-purple-600 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-purple-500"
                        />
                        <span>Cast Soft Natural Dropped Floor Shadow</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* --- Boutique Product Variants (Sizes, Colors, Materials) --- */}
                <div className="bg-zinc-50/50 dark:bg-zinc-950/15 border border-zinc-150 dark:border-zinc-800/50 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 font-sans">
                    <Sliders size={16} className="text-purple-500" />
                    Boutique Product Variants Customizer
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wide">Sizes</label>
                      <input 
                        type="text" 
                        placeholder="e.g. S, M, L, XL"
                        value={variantInputs.sizes}
                        onChange={(e) => setVariantInputs(prev => ({ ...prev, sizes: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/25 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block font-medium">Comma separated list</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wide">Colors</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Crimson, Obsidian, Pearl"
                        value={variantInputs.colors}
                        onChange={(e) => setVariantInputs(prev => ({ ...prev, colors: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/25 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block font-medium">Comma separated list</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 tracking-wide">Materials</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Silk, Cotton, Leather"
                        value={variantInputs.materials}
                        onChange={(e) => setVariantInputs(prev => ({ ...prev, materials: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black/25 border border-gray-200 dark:border-gray-700 text-gray-950 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block font-medium">Comma separated list</span>
                    </div>
                  </div>

                  {variantInputs.sizes.split(',').map(s => s.trim()).filter(Boolean).length > 0 && (
                    <div className="pt-4 border-t border-dashed border-gray-200 dark:border-zinc-850 space-y-2">
                      <span className="block text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                        Toggle Size Stock Status (Click size to toggle OUT-OF-STOCK):
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {variantInputs.sizes.split(',').map(s => s.trim()).filter(Boolean).map((sz) => {
                          const isOutOfStock = outOfStockSizes.includes(sz);
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => {
                                if (isOutOfStock) {
                                  setOutOfStockSizes(outOfStockSizes.filter(s => s !== sz));
                                } else {
                                  setOutOfStockSizes([...outOfStockSizes, sz]);
                                }
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                                isOutOfStock
                                  ? 'bg-red-500/10 border-red-500/40 text-red-500 dark:text-red-400 line-through animate-pulse'
                                  : 'bg-green-500/10 border-green-500/40 text-green-600 dark:text-green-400 font-sans'
                              }`}
                              title={isOutOfStock ? `Mark size "${sz}" back in stock` : `Mark size "${sz}" as out of stock`}
                            >
                              <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                              <span>{sz} {isOutOfStock ? '(OUT OF STOCK)' : '(Available)'}</span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        💡 Flagged sizes will display a distinctive 'Out of stock' badge for customers and block them from adding that size to their cart.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 tracking-wide">Description</label>
                  <textarea 
                    name="description"
                    value={productForm.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-black/20 rounded-xl">
                  <input 
                    type="checkbox" 
                    name="featured"
                    checked={productForm.featured}
                    onChange={handleInputChange}
                    id="featured"
                    className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="featured" className="text-gray-900 dark:text-white font-medium select-none cursor-pointer">Mark as Featured Product</label>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} /> {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;