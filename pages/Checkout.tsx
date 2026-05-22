import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CURRENCY_SYMBOL, WHATSAPP_NUMBER } from '../constants';
import { storeService } from '../services/storeService';
import { StoreSettings, Coupon } from '../types';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });

  // Pre-fill data if user is logged in
  useEffect(() => {
    storeService.getSettings()
      .then(setSettings)
      .catch(err => console.error("Checkout: failed to fetch settings:", err));

    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
      }));
    }
  }, [user]);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setCouponError('');
    setCouponSuccess('');
    
    try {
      const coupon = await storeService.getCouponByCode(couponCodeInput);
      if (!coupon) {
        setCouponError('Invalid promo code. Please try again.');
        return;
      }
      if (!coupon.isActive) {
        setCouponError('This promo code is no longer active.');
        return;
      }
      if (coupon.minSpend && cartTotal < coupon.minSpend) {
        setCouponError(`Minimum purchase of ${CURRENCY_SYMBOL} ${coupon.minSpend.toLocaleString()} is required.`);
        return;
      }
      
      setAppliedCoupon(coupon);
      setCouponSuccess(`Promo code "${coupon.code}" applied!`);
    } catch (err) {
      setCouponError('Error verifying promo code.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      return Math.round((cartTotal * appliedCoupon.value) / 100);
    } else {
      return Math.min(cartTotal, appliedCoupon.value);
    }
  };

  const discountAmount = getDiscountAmount();
  const finalTotal = cartTotal - discountAmount;

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

    // 1. Create Order in Backend (LocalStorage / Firestore)
    let createdOrder = null;
    try {
      createdOrder = await storeService.createOrder({
        items: cart,
        total: finalTotal,
        customerName: formData.name,
        customerPhone: formData.phone,
        shippingAddress: fullAddress, // Save the address
        userEmail: user?.email, 
        status: 'pending',
        couponCode: appliedCoupon?.code || undefined,
        couponDiscount: discountAmount || undefined
      });
    } catch (orderError) {
      console.warn("Could not save order details to database (operating in offline/resilient fallback mode):", orderError);
    }

    // 1.5. If Custom WhatsApp Automation Webhook is enabled and order was successfully created, dispatch order JSON to the agent
    if (createdOrder && settings?.whatsappWebhookEnabled && settings?.whatsappWebhookUrl) {
      try {
        await fetch(settings.whatsappWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'order.created',
            order: createdOrder
          }),
        });
      } catch (webhookError) {
        console.error("Failed to push to automated WhatsApp agent webhook:", webhookError);
        // Do not block checkout flow if webhook setup fails
      }
    }

    // 2. Format WhatsApp Message
    const itemsList = cart.map(item => {
      const variantSpecs = [];
      if (item.selectedSize) variantSpecs.push(`Size: ${item.selectedSize}`);
      if (item.selectedColor) variantSpecs.push(`Color: ${item.selectedColor}`);
      if (item.selectedMaterial) variantSpecs.push(`Mat: ${item.selectedMaterial}`);
      const variantStr = variantSpecs.length > 0 ? ` (${variantSpecs.join(', ')})` : '';
      const unitPrice = item.price_retail * (1 - (item.discount || 0) / 100);
      return `• ${item.title}${variantStr} (x${item.qty}) - ${CURRENCY_SYMBOL} ${(unitPrice * item.qty).toLocaleString()}`;
    }).join('%0a');
    
    let couponMessagePart = '';
    if (appliedCoupon) {
      couponMessagePart = `*Subtotal:* ${CURRENCY_SYMBOL} ${cartTotal.toLocaleString()}%0a` +
        `*Coupon Code:* ${appliedCoupon.code} (-${CURRENCY_SYMBOL} ${discountAmount.toLocaleString()})%0a`;
    }

    const message = `*New Order Request* 🛍️%0a%0a` +
      `*Customer:* ${formData.name}%0a` +
      `*Phone:* ${formData.phone}%0a` +
      `*Address:* ${fullAddress}%0a%0a` +
      `*Items:*%0a${itemsList}%0a%0a` +
      couponMessagePart +
      `*Total:* ${CURRENCY_SYMBOL} ${finalTotal.toLocaleString()}`;

    // 3. Clear Cart & Redirect
    clearCart();
    setLoading(false);
    
    const targetWhatsapp = settings?.whatsappNumber || WHATSAPP_NUMBER;
    setTimeout(() => {
      window.open(`https://wa.me/${targetWhatsapp}?text=${message}`, '_blank');
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
            {cart.map(item => {
              const uniqueKey = `${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}-${item.selectedMaterial || ''}`;
              const unitPrice = item.price_retail * (1 - (item.discount || 0) / 100);
              return (
                <div key={uniqueKey} className="flex gap-4 py-4 border-b border-gray-200/30 dark:border-gray-700/30 last:border-0">
                  <img src={item.images[0]} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.title}</h4>
                    
                    {/* Render variant labels */}
                    {(item.selectedSize || item.selectedColor || item.selectedMaterial) && (
                      <div className="flex flex-wrap gap-1 mt-1 text-[11px]">
                        {item.selectedSize && (
                          <span className="px-1.5 py-0.2 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="px-1.5 py-0.2 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        {item.selectedMaterial && (
                          <span className="px-1.5 py-0.2 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 rounded">
                            Mat: {item.selectedMaterial}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between mt-1 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Qty: {item.qty}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{CURRENCY_SYMBOL} {(unitPrice * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Coupon Promo Widget */}
          <div className="mt-6 pt-6 border-t border-gray-200/30 dark:border-gray-700/30">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-3">🏷️ Have a Promo Code?</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. WELCOME10"
                value={couponCodeInput}
                onChange={(e) => {
                  setCouponCodeInput(e.target.value);
                  setCouponError('');
                  setCouponSuccess('');
                }}
                disabled={!!appliedCoupon}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/50 dark:bg-zinc-800 dark:text-white dark:border-gray-700 border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none uppercase text-xs font-bold font-mono tracking-wider"
              />
              {appliedCoupon ? (
                <button 
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="px-4 py-2 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 font-bold rounded-xl text-xs hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-5 py-2.5 bg-purple-650 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              )}
            </div>
            {couponError && <p className="text-red-500 text-xs font-semibold mt-2">{couponError}</p>}
            {couponSuccess && <p className="text-green-600 dark:text-green-400 text-xs font-bold mt-2">{couponSuccess}</p>}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 space-y-2">
            <div className="flex justify-between text-gray-600 dark:text-gray-300 text-sm">
              <span>Subtotal</span>
              <span>{CURRENCY_SYMBOL} {cartTotal.toLocaleString()}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600 dark:text-green-400 text-sm font-semibold">
                <span>Promo Discount ({appliedCoupon.code})</span>
                <span>-{CURRENCY_SYMBOL} {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 dark:text-gray-300 text-sm">
              <span>Shipping</span>
              <span className="text-green-600 dark:text-green-400 font-medium">Calculated via WhatsApp</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-100 dark:border-zinc-800">
              <span>Total</span>
              <span>{CURRENCY_SYMBOL} {finalTotal.toLocaleString()}</span>
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