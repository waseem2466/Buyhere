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
  writeBatch,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Product, Order, StoreSettings } from '../types';
import { MOCK_PRODUCTS } from '../constants';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

class StoreService {
  
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });

      // SEED DATA: If DB is empty, upload mock products automatically
      if (products.length === 0) {
        return await this.seedProducts();
      }

      return products;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'products');
    }
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    try {
      const q = query(collection(db, 'products'), where("slug", "==", slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Product;
      }
      return undefined;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'products');
    }
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...product, createdAt: new Date().toISOString() } as Product;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  }

  async updateProduct(product: Product): Promise<void> {
    try {
      const productRef = doc(db, 'products', product.id);
      const { id, ...data } = product; // Exclude ID from data payload
      await updateDoc(productRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${product.id}`);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  }

  // Orders
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const newOrderData = {
      ...order,
      createdAt: new Date().toISOString()
    };
    try {
      const docRef = await addDoc(collection(db, 'orders'), newOrderData);
      return { id: docRef.id, ...newOrderData } as Order;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      return orders;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'orders');
    }
  }

  async getUserOrders(email: string): Promise<Order[]> {
    try {
      const q = query(collection(db, 'orders'), where("userEmail", "==", email));
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      // Sort in-memory to prevent requiring custom index
      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'orders');
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
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

    try {
      await batch.commit();
      return createdProducts;
    } catch (error) {
      console.warn("Firestore seeding skipped or unauthorized (requires admin account). Falling back to local mock products:", error);
      return MOCK_PRODUCTS;
    }
  }

  // Store & Webhook Settings
  async getSettings(): Promise<StoreSettings> {
    try {
      const docRef = doc(db, 'settings', 'whatsapp');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          whatsappNumber: data.whatsappNumber || "947649500844",
          whatsappWebhookEnabled: data.whatsappWebhookEnabled ?? false,
          whatsappWebhookUrl: data.whatsappWebhookUrl || "",
        };
      }
      const local = localStorage.getItem('store_settings');
      if (local) {
        try {
          return JSON.parse(local);
        } catch (e) {}
      }
      return {
        whatsappNumber: "947649500844",
        whatsappWebhookEnabled: false,
        whatsappWebhookUrl: ""
      };
    } catch (error) {
      console.warn("Failed to fetch settings from Firestore, using localStorage fallback:", error);
      const local = localStorage.getItem('store_settings');
      if (local) {
        try {
          return JSON.parse(local);
        } catch (e) {}
      }
      return {
        whatsappNumber: "947649500844",
        whatsappWebhookEnabled: false,
        whatsappWebhookUrl: ""
      };
    }
  }

  async saveSettings(settings: StoreSettings): Promise<void> {
    try {
      localStorage.setItem('store_settings', JSON.stringify(settings));
      const docRef = doc(db, 'settings', 'whatsapp');
      await setDoc(docRef, settings, { merge: true });
    } catch (error) {
      console.warn("Failed to save settings to Firestore, saved to local storage:", error);
      localStorage.setItem('store_settings', JSON.stringify(settings));
    }
  }
}

export const storeService = new StoreService();
