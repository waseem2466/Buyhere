import React, { useEffect, useState } from 'react';
import { User, Package, Clock, LogOut, MapPin, Settings, ChevronRight, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storeService } from '../services/storeService';
import { Order } from '../types';
import { useNavigate } from 'react-router-dom';
import { CURRENCY_SYMBOL } from '../constants';

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
    <div className="py-28 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3">
          <div className="sticky top-28">
            <div className="flex items-center gap-4 mb-8 p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-gray-800">
               <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg text-lg font-bold">
                  {user.name.charAt(0).toUpperCase()}
               </div>
               <div className="overflow-hidden">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm">{user.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
               </div>
            </div>

            <nav className="space-y-1">
               <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-medium text-sm ${
                    activeTab === 'orders' 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-600 dark:border-indigo-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'
                  }`}
               >
                  <div className="flex items-center gap-3">
                     <Package size={18} />
                     <span>Your Orders</span>
                  </div>
                  {activeTab === 'orders' && <ChevronRight size={16} />}
               </button>

               <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-medium text-sm ${
                    activeTab === 'addresses' 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-600 dark:border-indigo-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'
                  }`}
               >
                  <div className="flex items-center gap-3">
                     <MapPin size={18} />
                     <span>Addresses</span>
                  </div>
                  {activeTab === 'addresses' && <ChevronRight size={16} />}
               </button>

               <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-medium text-sm ${
                    activeTab === 'settings' 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-600 dark:border-indigo-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'
                  }`}
               >
                  <div className="flex items-center gap-3">
                     <Settings size={18} />
                     <span>Settings</span>
                  </div>
                  {activeTab === 'settings' && <ChevronRight size={16} />}
               </button>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
               <button 
                 onClick={handleLogout}
                 className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium text-sm"
               >
                 <LogOut size={18} />
                 Sign Out
               </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          {activeTab === 'orders' && (
             <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order History</h2>
                
                {loadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-40 glass-card rounded-2xl animate-pulse"></div>)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="glass-panel p-16 rounded-3xl text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">No orders yet</p>
                    <p className="mb-8 text-sm">Looks like you haven't bought anything yet.</p>
                    <button 
                      onClick={() => navigate('/shop')}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-colors font-bold text-sm"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white/70 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all">
                         {/* Order Header */}
                         <div className="bg-gray-50/80 dark:bg-black/20 p-5 flex flex-wrap gap-6 justify-between items-center border-b border-gray-100 dark:border-gray-700/50">
                            <div className="flex flex-wrap gap-8 text-sm">
                               <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide mb-1">Date Placed</p>
                                  <p className="font-semibold text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                               </div>
                               <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide mb-1">Total Amount</p>
                                  <p className="font-semibold text-gray-900 dark:text-white">{CURRENCY_SYMBOL} {order.total.toLocaleString()}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xs text-gray-400 font-mono mb-1">#{order.id}</p>
                               <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                 order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                 order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                               }`}>
                                 {order.status}
                               </span>
                            </div>
                         </div>

                         {/* Order Items */}
                         <div className="p-5 space-y-4">
                           {order.items.map((item, idx) => (
                             <div key={idx} className="flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.category}</p>
                                  <div className="flex items-center gap-2 text-sm">
                                     <span className="text-gray-500">Qty: {item.qty}</span>
                                     <span className="text-gray-300">|</span>
                                     <span className="font-bold text-indigo-600 dark:text-indigo-400">{CURRENCY_SYMBOL} {item.price_retail.toLocaleString()}</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => navigate(`/product/${item.slug}`)}
                                  className="hidden sm:block px-4 py-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 transition-colors"
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Addresses</h2>
                <div className="grid md:grid-cols-2 gap-6">
                   {/* Mock Address Card */}
                   <div className="bg-white/60 dark:bg-white/5 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 relative shadow-sm">
                      <div className="absolute top-4 right-4">
                         <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2 py-1 rounded">Default</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold">
                         <HomeIcon size={18} className="text-indigo-500" /> Home
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p>411/7 Kandy Road</p>
                        <p>Mollipothana, Kanthale, 31300</p>
                        <p>Sri Lanka</p>
                      </div>
                      
                      <div className="mt-6 flex gap-4 text-sm font-medium">
                         <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline">Edit</button>
                         <button className="text-red-500 hover:text-red-600 hover:underline">Delete</button>
                      </div>
                   </div>

                   {/* Add New Address */}
                   <button className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-all min-h-[200px] bg-gray-50/50 dark:bg-white/5 hover:bg-white">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                         <Settings size={24} />
                      </div>
                      <span className="font-bold text-sm">Add New Address</span>
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
                         <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Full Name</label>
                         <input 
                           type="text" 
                           value={user.name} 
                           readOnly
                           className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed text-sm"
                         />
                         <p className="text-xs text-gray-400 mt-2">Name managed via Authentication Provider</p>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Email Address</label>
                         <input 
                           type="email" 
                           value={user.email} 
                           readOnly
                           className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed text-sm"
                         />
                      </div>
                      <div className="pt-4">
                         <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg opacity-50 cursor-not-allowed text-sm">
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