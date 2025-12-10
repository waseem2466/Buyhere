import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase.ts';
import { Product, Order } from '../types.ts';
import { MOCK_PRODUCTS } from '../constants.ts';

class StoreService {
  
  // Products
  async getProducts(): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });

    // SEED DATA: If DB is empty, upload mock products automatically
    if (products.length === 0) {
      return this.seedProducts();
    }

    return products;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const q = query(collection(db, 'products'), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Product;
    }
    return undefined;
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...product, createdAt: new Date().toISOString() } as Product;
  }

  async updateProduct(product: Product): Promise<void> {
    const productRef = doc(db, 'products', product.id);
    const { id, ...data } = product; // Exclude ID from data payload
    await updateDoc(productRef, data);
  }

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(db, 'products', id));
  }

  // Orders
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const newOrderData = {
      ...order,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'orders'), newOrderData);
    return { id: docRef.id, ...newOrderData } as Order;
  }

  async getOrders(): Promise<Order[]> {
    // Get all orders ordered by date
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
  }

  async getUserOrders(email: string): Promise<Order[]> {
    const q = query(collection(db, 'orders'), where("userEmail", "==", email));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    // Sort in memory since Firestore requires composite index for 'where' + 'orderBy'
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  }

  // Helper to seed initial data
  private async seedProducts(): Promise<Product[]> {
    const batch = writeBatch(db);
    const productsCollection = collection(db, 'products');
    const createdProducts: Product[] = [];

    MOCK_PRODUCTS.forEach(product => {
      const docRef = doc(productsCollection); // Create new doc ref with auto ID
      const { id, ...data } = product; // Remove the mock ID 1, 2, 3...
      const pData = { ...data, createdAt: new Date().toISOString() };
      batch.set(docRef, pData);
      createdProducts.push({ id: docRef.id, ...pData } as Product);
    });

    await batch.commit();
    return createdProducts;
  }
}

export const storeService = new StoreService();