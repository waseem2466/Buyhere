import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { CURRENCY_SYMBOL, WHATSAPP_NUMBER } from '../constants.ts';
import { storeService } from '../services/storeService.ts';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });

  // Pre-fill data if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
      }));
    }
  }, [user]);

  if (cart.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-gray-800 dark:text-gray-100">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="text-purple-600 dark:text-purple-400 hover:underline">Go Shopping</button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fullAddress = `${formData.address}, ${formData.city}`;

    // 1. Create Order in Backend (LocalStorage)
    await storeService.createOrder({
      items: cart,
      total: cartTotal,
      customerName: formData.name,
      customerPhone: formData.phone,
      shippingAddress: fullAddress, // Save the address
      userEmail: user?.email, 
      status: 'pending'
    });

    // 2. Format WhatsApp Message
    const itemsList = cart.map(item => `• ${item.title} (x${item.qty}) - ${CURRENCY_SYMBOL} ${item.price_retail * item.qty}`).join('%0a');
    
    const message = `*New Order Request* 🛍️%0a%0a` +
      `*Customer:* ${formData.name}%0a` +
      `*Phone:* ${formData.phone}%0a` +
      `*Address:* ${fullAddress}%0a%0a` +
      `*Items:*%0a${itemsList}%0a%0a` +
      `*Total:* ${CURRENCY_SYMBOL} ${cartTotal.toLocaleString()}`;

    // 3. Clear Cart & Redirect
    clearCart();
    setLoading(false);
    
    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
      if (user) {
        navigate('/profile');
      } else {
        navigate('/');
      }
    }, 500);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="glass-card p-8 rounded-3xl h-fit order-2 md:order-1">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Order Summary</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-gray-200/30 dark:border-gray-700/30 last:border-0">
                <img src={item.images[0]} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.title}</h4>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Qty: {item.qty}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{CURRENCY_SYMBOL} {(item.price_retail * item.qty).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 space-y-2">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Subtotal</span>
              <span>{CURRENCY_SYMBOL} {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Shipping</span>
              <span className="text-green-600 dark:text-green-400 font-medium">Calculated via WhatsApp</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white pt-4">
              <span>Total</span>
              <span>{CURRENCY_SYMBOL} {cartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="glass-panel p-8 rounded-3xl order-1 md:order-2">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <MapPin className="text-purple-600 dark:text-purple-400" /> Delivery Details
          </h2>
          
          <form onSubmit={handleWhatsAppCheckout} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input 
                required 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type="text" 
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white dark:border-gray-600 border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input 
                required 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel" 
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white dark:border-gray-600 border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="077 123 4567"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                <input 
                  required 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white dark:border-gray-600 border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  placeholder="Colombo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Postal Code</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white dark:border-gray-600 border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  placeholder="10000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
              <textarea 
                required 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white dark:border-gray-600 border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Street address, apartment, etc."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {loading ? 'Processing...' : (
                <>
                  <Send size={20} /> Order via WhatsApp
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              By clicking above, you will be redirected to WhatsApp to confirm your order with our agent.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;