export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price_retail: number;
  price_wholesale?: number;
  discount?: number;
  stock: number;
  category: string;
  images: string[];
  featured: boolean;
  createdAt: string;
  studioFrame?: 'minimalist' | 'velvet' | 'marble' | 'glass' | 'wood' | 'none';
  studioReflection?: boolean;
  studioShadow?: boolean;
  studioScale?: number;
  sizes?: string[];
  outOfStockSizes?: string[];
  colors?: string[];
  materials?: string[];
}

export interface CartItem extends Product {
  qty: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedMaterial?: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface Order {
  id: string;
  userEmail?: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  shippingAddress: string; // Added address field
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  couponCode?: string;
  couponDiscount?: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSpend?: number;
  isActive: boolean;
  createdAt: string;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  search: string;
}

export interface StoreSettings {
  whatsappNumber: string;
  whatsappWebhookEnabled: boolean;
  whatsappWebhookUrl: string;
}