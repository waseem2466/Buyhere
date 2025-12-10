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
}

export interface CartItem extends Product {
  qty: number;
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
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  search: string;
}