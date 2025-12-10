import React, { useEffect, useState } from 'react';
import { Package, Plus, Trash, Search, X, Save, Upload, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { storeService } from '../services/storeService.ts';
import { Product, Order } from '../types.ts';
import { CURRENCY_SYMBOL, CATEGORIES } from '../constants.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '',
    category: 'Electronics',
    price_retail: 0,
    stock: 0,
    description: '',
    images: [''],
    featured: false
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
    storeService.getProducts().then(setProducts);
    storeService.getOrders().then(setOrders);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: 'Electronics',
      price_retail: 0,
      stock: 0,
      description: '',
      images: [''],
      featured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
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

    if (editingProduct) {
      // Update existing
      await storeService.updateProduct({
        ...editingProduct,
        ...productForm as any
      });
    } else {
      // Create new
      const slug = productForm.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      await storeService.addProduct({
        ...productForm as any,
        slug,
        discount: 0
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

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
        <div className="flex gap-2 p-1 bg-white/40 dark:bg-white/10 rounded-lg backdrop-blur-sm">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-md transition-all ${activeTab === 'products' ? 'bg-white dark:bg-gray-700 shadow text-purple-600 dark:text-purple-300 font-bold' : 'text-gray-500 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-md transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-gray-700 shadow text-purple-600 dark:text-purple-300 font-bold' : 'text-gray-500 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'}`}
          >
            Orders
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden min-h-[500px]">
        {activeTab === 'products' ? (
          <div className="p-6">
            <div className="flex justify-between mb-6">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/50 dark:bg-white/10 dark:text-white dark:border-gray-600 border border-white focus:outline-none" />
              </div>
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-left bg-white/30 dark:bg-black/30 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="p-4 rounded-tl-xl">Product</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-white" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">{p.title}</span>
                      </td>
                      <td className="p-4 text-gray-800 dark:text-gray-200">{CURRENCY_SYMBOL} {p.price_retail}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock < 10 ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300'}`}>
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
           <div className="p-6">
             <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Order Management</h2>
             {orders.length === 0 ? (
               <div className="text-center text-gray-500 dark:text-gray-400 py-12">No orders found</div>
             ) : (
               <div className="space-y-4">
                 {orders.map(order => (
                   <div key={order.id} className="bg-white/40 dark:bg-white/10 rounded-xl overflow-hidden border border-white/50 dark:border-white/5 transition-all">
                     <div 
                        className="p-4 flex flex-wrap justify-between items-center cursor-pointer hover:bg-white/30 dark:hover:bg-white/5"
                        onClick={() => toggleOrderExpand(order.id)}
                      >
                       <div className="flex gap-4 items-center">
                         <div className={`p-2 rounded-full ${expandedOrder === order.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'} dark:bg-white/10`}>
                            {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                         </div>
                         <div>
                           <p className="font-bold text-gray-800 dark:text-gray-200">Order #{order.id}</p>
                           <p className="text-sm text-gray-600 dark:text-gray-400">{order.customerName}</p>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-4 mt-2 sm:mt-0">
                         <div className="text-right mr-4">
                           <p className="font-bold text-purple-600 dark:text-purple-400">{CURRENCY_SYMBOL} {order.total.toLocaleString()}</p>
                           <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                         </div>
                         <select 
                           onClick={(e) => e.stopPropagation()}
                           value={order.status}
                           onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                           className={`px-3 py-1.5 rounded-lg text-sm font-bold uppercase border-none focus:ring-2 focus:ring-purple-500 cursor-pointer ${
                             order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                             order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                             'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                           }`}
                         >
                           <option value="pending">Pending</option>
                           <option value="confirmed">Confirmed</option>
                           <option value="shipped">Shipped</option>
                           <option value="delivered">Delivered</option>
                         </select>
                       </div>
                     </div>

                     {/* Expanded Details */}
                     {expandedOrder === order.id && (
                       <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/30 bg-white/20 dark:bg-black/20">
                         <div className="grid md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-bold mb-2">Delivery Details</h4>
                              <p className="text-sm text-gray-800 dark:text-gray-200"><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
                              <p className="text-sm text-gray-800 dark:text-gray-200"><span className="font-semibold">Address:</span> {order.shippingAddress || 'N/A'}</p>
                              {order.userEmail && <p className="text-sm text-gray-800 dark:text-gray-200"><span className="font-semibold">User:</span> {order.userEmail}</p>}
                            </div>
                            <div>
                              <h4 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-bold mb-2">Items</h4>
                              <ul className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <li key={idx} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                                    <span>{item.qty}x {item.title}</span>
                                    <span>{CURRENCY_SYMBOL} {(item.price_retail * item.qty).toLocaleString()}</span>
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

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-8 max-h-[90vh] overflow-y-auto animate-fade-in-up shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Preview */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-2xl bg-white/50 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative group">
                  {productForm.images?.[0] ? (
                    <img src={productForm.images[0]} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="text-gray-400" size={32} />
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Title</label>
                  <input 
                    name="title"
                    value={productForm.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-white/10 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white"
                    placeholder="e.g. Wireless Headphones"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select 
                    name="category"
                    value={productForm.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-white/10 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="text-black">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price ({CURRENCY_SYMBOL})</label>
                  <input 
                    name="price_retail"
                    type="number"
                    value={productForm.price_retail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-white/10 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stock Qty</label>
                  <input 
                    name="stock"
                    type="number"
                    value={productForm.stock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-white/10 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                <input 
                  name="images"
                  value={productForm.images?.[0] || ''}
                  onChange={(e) => handleImageChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-white/10 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea 
                  name="description"
                  value={productForm.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-white/10 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="featured"
                  checked={productForm.featured}
                  onChange={handleInputChange}
                  id="featured"
                  className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                />
                <label htmlFor="featured" className="text-gray-700 dark:text-gray-300">Mark as Featured Product</label>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-purple-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} /> {editingProduct ? 'Update Product' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;