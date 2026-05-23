import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product & { qty?: number; selectedSize?: string; selectedColor?: string }) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product & { qty?: number; selectedSize?: string; selectedColor?: string }) => {
    setCartItems(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === (product.selectedSize || item.selectedSize) &&
        item.selectedColor === (product.selectedColor || item.selectedColor)
      );

      if (existing) {
        return prev.map(item =>
          item.id === product.id &&
          item.selectedSize === (product.selectedSize || item.selectedSize) &&
          item.selectedColor === (product.selectedColor || item.selectedColor)
            ? { ...item, qty: item.qty + (product.qty || 1) }
            : item
        );
      }

      return [...prev, { ...product, qty: product.qty || 1, selectedSize: product.selectedSize, selectedColor: product.selectedColor } as CartItem];
    });
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setCartItems(prev =>
      qty <= 0
        ? prev.filter(item => item.id !== id)
        : prev.map(item => (item.id === id ? { ...item, qty } : item))
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price_retail * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
