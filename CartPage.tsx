import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Tag, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CURRENCY_SYMBOL } from '../constants';
import { useState } from 'react';

export default function CartPage() {
  const { cartItems, updateQty, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const shipping = cartTotal > 5000 ? 0 : 350;
  const discount = couponApplied ? cartTotal * 0.1 : 0;
  const finalTotal = cartTotal + shipping - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'shopora10') {
      setCouponApplied(true);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Cart is Empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Looks like you haven't added anything yet</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </motion.button>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Shopping <span className="text-gradient">Cart</span>
          <span className="text-lg font-normal text-slate-500 dark:text-slate-400 ml-2">({cartItems.length} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="glass-panel rounded-2xl p-4 flex gap-4"
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{item.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.category}</p>
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && ' | '}
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {CURRENCY_SYMBOL} {(item.price_retail * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Order Summary</h2>

              {/* Coupon */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl input-premium text-sm"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  Coupon SHOPORA10 applied! 10% off
                </motion.div>
              )}

              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{CURRENCY_SYMBOL} {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `${CURRENCY_SYMBOL} ${shipping}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Discount</span>
                    <span>-{CURRENCY_SYMBOL} {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span>Total</span>
                  <span>{CURRENCY_SYMBOL} {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Add {CURRENCY_SYMBOL} {(5000 - cartTotal).toLocaleString()} more for free delivery
                </p>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary py-3.5 text-base"
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
