import React, { useEffect, useState } from 'react';
import { User, Package, Clock, LogOut, MapPin, Settings, ChevronRight, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { storeService } from '../services/storeService.ts';
import { Order } from '../types.ts';
import { useNavigate } from 'react-router-dom';
import { CURRENCY_SYMBOL } from '../constants.ts';

type Tab = 'orders' | 'addresses' | 'settings';

const Profile: React.FC = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.email) {
      storeService.getUserOrders(user.email).then(data => {
        setOrders(data);
        setLoadingOrders(false);
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8 flex items-center justify-between">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Account</h1>
         <button 
            onClick={handleLogout}
            className="md:hidden p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-full"
          >
            <LogOut size={20} />
          </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-3xl sticky top-28">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
               </div>
               <div className="overflow-hidden">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">{user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
               </div>
            </div>

            <nav className="space-y-2">
               <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'}`}
               >
                  <div className="flex items-center gap-3">
                     <Package size={20} />
                     <span className="font-medium">Your Orders</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'orders' ? 'opacity-100' : 'opacity-0'} />
               </button>

               <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === 'addresses' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'}`}
               >
                  <div className="flex items-center gap-3">
                     <MapPin size={20} />
                     <span className="font-medium">Addresses</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'addresses' ? 'opacity-100' : 'opacity-0'} />
               </button>

               <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'}`}
               >
                  <div className="flex items-center gap-3">
                     <Settings size={20} />
                     <span className="font-medium">Settings</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'settings' ? 'opacity-100' : 'opacity-0'} />
               </button>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
               <button 
                 onClick={handleLogout}
                 className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
               >
                 <LogOut size={20} />
                 Sign Out
               </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'orders' && (
             <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order History</h2>
                
                {loadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-40 glass-card rounded-2xl animate-pulse"></div>)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="glass-panel p-12 rounded-3xl text-center text-gray-500 dark:text-gray-400">
                    <Package size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No orders yet</p>
                    <p className="mb-6">Looks like you haven't bought anything yet.</p>
                    <button 
                      onClick={() => navigate('/shop')}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="glass-card rounded-2xl overflow-hidden hover:bg-white/60 dark:hover:bg-white/10 transition-all border border-gray-100 dark:border-gray-700/50">
                         {/* Order Header */}
                         <div className="bg-gray-50/50 dark:bg-white/5 p-4 md:p-6 flex flex-wrap gap-6 justify-between items-center border-b border-gray-200/30 dark:border-gray-700/30">
                            <div className="flex flex-wrap gap-8 text-sm">
                               <div>
                                  <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold mb-1">Order Placed</p>
                                  <p className="font-medium text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                               </div>
                               <div>
                                  <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold mb-1">Total</p>
                                  <p className="font-medium text-gray-900 dark:text-white">{CURRENCY_SYMBOL} {order.total.toLocaleString()}</p>
                               </div>
                               <div>
                                  <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold mb-1">Ship To</p>
                                  <p className="font-medium text-gray-900 dark:text-white group relative cursor-pointer">
                                    {order.customerName}
                                  </p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold mb-1">Order # {order.id}</p>
                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                 order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                 order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                               }`}>
                                 {order.status}
                               </span>
                            </div>
                         </div>

                         {/* Order Items */}
                         <div className="p-4 md:p-6 space-y-4">
                           {order.items.map((item, idx) => (
                             <div key={idx} className="flex gap-4 items-center">
                                <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700">
                                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Category: {item.category}</p>
                                  <div className="flex items-center gap-2">
                                     <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">Qty: {item.qty}</span>
                                     <span className="font-medium text-purple-600 dark:text-purple-400">{CURRENCY_SYMBOL} {item.price_retail.toLocaleString()}</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => navigate(`/product/${item.slug}`)}
                                  className="hidden sm:block px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                  Buy Again
                                </button>
                             </div>
                           ))}
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          )}

          {activeTab === 'addresses' && (
             <div className="animate-slide-in-right">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Saved Addresses</h2>
                <div className="grid md:grid-cols-2 gap-6">
                   {/* Mock Address Card */}
                   <div className="glass-card p-6 rounded-2xl border-2 border-purple-500/30 relative">
                      <div className="absolute top-4 right-4">
                         <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold px-2 py-1 rounded">Default</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold">
                         <HomeIcon size={18} /> Home
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{user.name}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">411/7 Kandy Road</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Mollipothana, Kanthale, 31300</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Sri Lanka</p>
                      
                      <div className="mt-6 flex gap-3 text-sm font-medium text-purple-600 dark:text-purple-400">
                         <button className="hover:underline">Edit</button>
                         <span className="text-gray-300">|</span>
                         <button className="hover:underline">Delete</button>
                      </div>
                   </div>

                   {/* Add New Address */}
                   <button className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-all min-h-[200px]">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:bg-purple-100">
                         <Settings size={24} />
                      </div>
                      <span className="font-bold">Add New Address</span>
                   </button>
                </div>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="animate-slide-in-right space-y-6">
                <div className="glass-panel p-8 rounded-3xl">
                   <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                   <div className="space-y-6 max-w-xl">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                         <input 
                           type="text" 
                           value={user.name} 
                           readOnly
                           className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border-none text-gray-500 cursor-not-allowed"
                         />
                         <p className="text-xs text-gray-400 mt-1">Name managed via Google Account</p>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                         <input 
                           type="email" 
                           value={user.email} 
                           readOnly
                           className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border-none text-gray-500 cursor-not-allowed"
                         />
                      </div>
                      <div className="pt-4">
                         <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg opacity-50 cursor-not-allowed">
                           Save Changes
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;