import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { Link } from 'react-router-dom';
import { CURRENCY_SYMBOL } from '../constants.ts';

const CartSidebar: React.FC = () => {
  const { cart, isCartOpen, toggleCart, updateQty, removeFromCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={() => toggleCart(false)}
      />

      {/* Sidebar */}
      <div className="relative w-full max-w-md h-full glass-panel border-l border-white/40 shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-6 flex items-center justify-between border-b border-gray-200/30 dark:border-gray-700/30">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Cart</h2>
          <button 
            onClick={() => toggleCart(false)}
            className="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 gap-4">
              <ShoppingBagIcon className="w-16 h-16 opacity-30" />
              <p className="text-lg">Your cart is empty</p>
              <button 
                onClick={() => toggleCart(false)}
                className="px-6 py-2 bg-purple-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 glass-card rounded-xl">
                <img 
                  src={item.images[0]} 
                  alt={item.title} 
                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{item.title}</h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">
                    {CURRENCY_SYMBOL} {(item.price_retail * (1 - (item.discount || 0)/100)).toLocaleString()}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 bg-white/40 dark:bg-white/10 rounded-lg px-2 py-1">
                      <button 
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="p-1 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-200 disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center text-gray-800 dark:text-gray-200">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="p-1 hover:text-purple-600 dark:hover:text-purple-400 dark:text-gray-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200/30 dark:border-gray-700/30 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                {CURRENCY_SYMBOL} {cartTotal.toLocaleString()}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={() => toggleCart(false)}
              className="block w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-bold rounded-xl shadow-lg hover:shadow-purple-500/40 hover:scale-[1.02] transition-all"
            >
              Checkout Now
            </Link>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for empty state icon
const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export default CartSidebar;