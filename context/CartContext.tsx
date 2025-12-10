import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types.ts';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  toggleCart: (isOpen?: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('wr_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('wr_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, qty } : item));
  };

  const clearCart = () => setCart([]);

  const toggleCart = (isOpen?: boolean) => {
    setIsCartOpen(prev => isOpen ?? !prev);
  };

  const cartTotal = cart.reduce((sum, item) => {
    // Simple implementation using retail/discount logic
    const finalPrice = item.discount 
      ? item.price_retail * (1 - item.discount / 100) 
      : item.price_retail;
    return sum + (finalPrice * item.qty);
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQty, clearCart, 
      cartTotal, cartCount, isCartOpen, toggleCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};