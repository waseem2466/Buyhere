import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product, 
    qty: number, 
    selectedSize?: string, 
    selectedColor?: string, 
    selectedMaterial?: string
  ) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string, selectedMaterial?: string) => void;
  updateQty: (productId: string, qty: number, selectedSize?: string, selectedColor?: string, selectedMaterial?: string) => void;
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
        console.error("Failed to parse cart", e instanceof Error ? e.message : String(e));
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('wr_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: Product, 
    qty: number, 
    selectedSize?: string, 
    selectedColor?: string, 
    selectedMaterial?: string
  ) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor && 
        item.selectedMaterial === selectedMaterial
      );
      if (existingIndex > -1) {
        return prev.map((item, idx) => 
          idx === existingIndex ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { 
        ...product, 
        qty, 
        selectedSize, 
        selectedColor, 
        selectedMaterial 
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (
    productId: string, 
    selectedSize?: string, 
    selectedColor?: string, 
    selectedMaterial?: string
  ) => {
    setCart(prev => prev.filter(item => !(
      item.id === productId && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor && 
      item.selectedMaterial === selectedMaterial
    )));
  };

  const updateQty = (
    productId: string, 
    qty: number, 
    selectedSize?: string, 
    selectedColor?: string, 
    selectedMaterial?: string
  ) => {
    if (qty < 1) {
      removeFromCart(productId, selectedSize, selectedColor, selectedMaterial);
      return;
    }
    setCart(prev => prev.map(item => 
      (item.id === productId && 
       item.selectedSize === selectedSize && 
       item.selectedColor === selectedColor && 
       item.selectedMaterial === selectedMaterial) ? { ...item, qty } : item
    ));
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