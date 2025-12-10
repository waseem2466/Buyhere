import { Product, Order } from '../types.ts';
import { MOCK_PRODUCTS } from '../constants.ts';

// Simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class StoreService {
  private products: Product[] = [...MOCK_PRODUCTS];
  private orders: Order[] = [];

  async getProducts(): Promise<Product[]> {
    await delay(500);
    return this.products;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    await delay(300);
    return this.products.find(p => p.slug === slug);
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    await delay(800);
    const newOrder: Order = {
      ...order,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  // Admin functions
  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    await delay(600);
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await delay(400);
    this.products = this.products.filter(p => p.id !== id);
  }

  async getOrders(): Promise<Order[]> {
    await delay(500);
    return this.orders;
  }
}

export const storeService = new StoreService();