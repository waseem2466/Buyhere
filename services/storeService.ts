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
import { Product, Order, StoreSettings, Coupon } from '../types';
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
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errInfo = {
    error: errorMessage,
    operationType,
    path,
    userId: auth.currentUser?.uid || null,
    email: auth.currentUser?.email || null,
  };
  
  let serialized = "";
  try {
    serialized = JSON.stringify(errInfo);
  } catch (e) {
    serialized = JSON.stringify({
      error: String(errorMessage),
      operationType: String(operationType),
      path: String(path)
    });
  }
  
  console.error('Firestore Error: ', serialized);
  throw new Error(serialized);
}

// Helper to implement a timeout on any Firestore operation
async function runWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 2000
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Firestore timeout"));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

class StoreService {
  // Products
  private getLocalProducts(): Product[] {
    try {
      const local = localStorage.getItem('cached_products');
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn("Failed to parse cached products:", e instanceof Error ? e.message : String(e));
    }
    return MOCK_PRODUCTS;
  }

  private saveLocalProducts(products: Product[]): void {
    try {
      localStorage.setItem('cached_products', JSON.stringify(products));
    } catch (e) {
      console.warn("Failed to serialize products to localStorage:", e instanceof Error ? e.message : String(e));
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const fetchPromise = (async () => {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products: Product[] = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() } as Product);
        });

        if (products.length === 0) {
          return await this.seedProducts();
        }
        return products;
      })();

      const products = await runWithTimeout(fetchPromise, 1500);
      this.saveLocalProducts(products);
      return products;
    } catch (error) {
      console.warn("Firestore: getProducts failed or timed out. Falling back to local/cached data.", error instanceof Error ? error.message : String(error));
      return this.getLocalProducts();
    }
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    try {
      const fetchPromise = (async () => {
        const q = query(collection(db, 'products'), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          return { id: doc.id, ...doc.data() } as Product;
        }
        return undefined;
      })();

      const product = await runWithTimeout(fetchPromise, 1500);
      return product;
    } catch (error) {
      console.warn(`Firestore: getProductBySlug failed/timed out for slug: ${slug}. Falling back to cached products.`, error instanceof Error ? error.message : String(error));
      const localProducts = this.getLocalProducts();
      return localProducts.find(p => p.slug === slug);
    }
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const localId = 'local_' + Math.random().toString(36).substring(2, 9);
    const mockProduct: Product = {
      id: localId,
      ...product,
      createdAt: new Date().toISOString()
    };

    try {
      const addPromise = (async () => {
        const docRef = await addDoc(collection(db, 'products'), {
          ...product,
          createdAt: new Date().toISOString()
        });
        return { id: docRef.id, ...product, createdAt: new Date().toISOString() } as Product;
      })();

      const added = await runWithTimeout(addPromise, 1500);
      const current = this.getLocalProducts().filter(p => p.id !== localId);
      current.unshift(added);
      this.saveLocalProducts(current);
      return added;
    } catch (error) {
      console.warn("Firestore: addProduct failed/timed out. Falling back to local localStorage update.", error instanceof Error ? error.message : String(error));
      const current = this.getLocalProducts();
      current.unshift(mockProduct);
      this.saveLocalProducts(current);
      return mockProduct;
    }
  }

  async updateProduct(product: Product): Promise<void> {
    const current = this.getLocalProducts();
    const updatedList = current.map(p => p.id === product.id ? product : p);
    this.saveLocalProducts(updatedList);

    try {
      const updatePromise = (async () => {
        const productRef = doc(db, 'products', product.id);
        const { id, ...data } = product;
        await updateDoc(productRef, data);
      })();
      await runWithTimeout(updatePromise, 1500);
    } catch (error) {
      console.warn(`Firestore: updateProduct failed/timed out for ${product.id}. Change persists in local storage.`, error instanceof Error ? error.message : String(error));
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const current = this.getLocalProducts();
    const updatedList = current.filter(p => p.id !== id);
    this.saveLocalProducts(updatedList);

    try {
      const deletePromise = deleteDoc(doc(db, 'products', id));
      await runWithTimeout(deletePromise, 1500);
    } catch (error) {
      console.warn(`Firestore: deleteProduct failed/timed out for product ${id}. Local cache remains updated.`, error instanceof Error ? error.message : String(error));
    }
  }

  // Orders
  private getLocalOrders(email?: string): Order[] {
    try {
      const local = localStorage.getItem('cached_orders');
      if (local) {
        const allOrders: Order[] = JSON.parse(local);
        if (email) {
          return allOrders.filter(o => o.userEmail === email);
        }
        return allOrders;
      }
    } catch (e) {
      console.warn("Failed to parse cached orders:", e instanceof Error ? e.message : String(e));
    }
    return [];
  }

  private saveLocalOrders(orders: Order[]): void {
    try {
      const existing = this.getLocalOrders();
      const orderMap = new Map<string, Order>();
      
      existing.forEach(o => orderMap.set(o.id, o));
      orders.forEach(o => orderMap.set(o.id, o));
      
      const combined = Array.from(orderMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      localStorage.setItem('cached_orders', JSON.stringify(combined));
    } catch (e) {
      console.warn("Failed to serialize orders to localStorage:", e instanceof Error ? e.message : String(e));
    }
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const localId = 'order_' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const mockOrder: Order = {
      id: localId,
      ...order,
      createdAt: new Date().toISOString()
    };

    try {
      const addPromise = (async () => {
        const newOrderData = {
          ...order,
          createdAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, 'orders'), newOrderData);
        return { id: docRef.id, ...newOrderData } as Order;
      })();

      const created = await runWithTimeout(addPromise, 1500);
      this.saveLocalOrders([created]);
      return created;
    } catch (error) {
      console.warn("Firestore: createOrder failed or timed out. Operates in elegant offline checkout mode.", error instanceof Error ? error.message : String(error));
      this.saveLocalOrders([mockOrder]);
      return mockOrder;
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const fetchPromise = (async () => {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const orders: Order[] = [];
        querySnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() } as Order);
        });
        return orders;
      })();

      const orders = await runWithTimeout(fetchPromise, 1500);
      this.saveLocalOrders(orders);
      return orders;
    } catch (error) {
      console.warn("Firestore: getOrders failed or timed out. Falling back to local offline cache.", error instanceof Error ? error.message : String(error));
      return this.getLocalOrders();
    }
  }

  async getUserOrders(email: string): Promise<Order[]> {
    try {
      const fetchPromise = (async () => {
        const q = query(collection(db, 'orders'), where("userEmail", "==", email));
        const querySnapshot = await getDocs(q);
        const orders: Order[] = [];
        querySnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() } as Order);
        });
        return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      })();

      const orders = await runWithTimeout(fetchPromise, 1500);
      this.saveLocalOrders(orders);
      return orders;
    } catch (error) {
      console.warn(`Firestore: getUserOrders failed/timed out for ${email}. Falling back to local storage.`, error instanceof Error ? error.message : String(error));
      return this.getLocalOrders(email);
    }
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const allLocal = this.getLocalOrders();
    const updated = allLocal.map(o => o.id === orderId ? { ...o, status } : o);
    this.saveLocalOrders(updated);

    try {
      const updatePromise = (async () => {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status });
      })();
      await runWithTimeout(updatePromise, 1500);
    } catch (error) {
      console.warn(`Firestore: updateOrderStatus failed or timed out for order ${orderId}. Changes persistent in local cache.`, error instanceof Error ? error.message : String(error));
    }
  }

  // Helper to seed initial data
  private async seedProducts(): Promise<Product[]> {
    const fetchPromise = (async () => {
      const batch = writeBatch(db);
      const productsCollection = collection(db, 'products');
      const createdProducts: Product[] = [];

      MOCK_PRODUCTS.forEach(product => {
        const docRef = doc(productsCollection);
        const { id, ...data } = product;
        const pData = { ...data, createdAt: new Date().toISOString() };
        batch.set(docRef, pData);
        createdProducts.push({ id: docRef.id, ...pData } as Product);
      });

      await batch.commit();
      return createdProducts;
    })();

    try {
      return await runWithTimeout(fetchPromise, 2500);
    } catch (error) {
      console.warn("Firestore seeding skipped or timed out. Falling back to local mock products:", error instanceof Error ? error.message : String(error));
      return MOCK_PRODUCTS;
    }
  }

  // Store & Webhook Settings
  async getSettings(): Promise<StoreSettings> {
    const defaultSettings: StoreSettings = {
      whatsappNumber: "947649500844",
      whatsappWebhookEnabled: false,
      whatsappWebhookUrl: ""
    };

    try {
      const fetchPromise = (async () => {
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
        return defaultSettings;
      })();

      const settings = await runWithTimeout(fetchPromise, 1500);
      localStorage.setItem('store_settings', JSON.stringify(settings));
      return settings;
    } catch (error) {
      console.warn("Firestore: getSettings failed or timed out. Falling back to local settings.", error instanceof Error ? error.message : String(error));
      try {
        const local = localStorage.getItem('store_settings');
        if (local) {
          return JSON.parse(local);
        }
      } catch (e) {}
      return defaultSettings;
    }
  }

  async saveSettings(settings: StoreSettings): Promise<void> {
    try {
      localStorage.setItem('store_settings', JSON.stringify(settings));
    } catch (e) {}

    try {
      const savePromise = (async () => {
        const docRef = doc(db, 'settings', 'whatsapp');
        await setDoc(docRef, settings, { merge: true });
      })();
      await runWithTimeout(savePromise, 1500);
    } catch (error) {
      console.warn("Firestore: saveSettings failed or timed out. Changes saved in local storage fallback.", error instanceof Error ? error.message : String(error));
    }
  }

  // Coupons
  private getLocalCoupons(): Coupon[] {
    try {
      const local = localStorage.getItem('cached_coupons');
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      console.warn("Failed to parse cached coupons:", e instanceof Error ? e.message : String(e));
    }
    return [
      { id: 'cp_welcome', code: 'WELCOME10', type: 'percent', value: 10, minSpend: 0, isActive: true, createdAt: new Date().toISOString() },
      { id: 'cp_smile', code: 'SMILE15', type: 'fixed', value: 15, minSpend: 50, isActive: true, createdAt: new Date().toISOString() }
    ];
  }

  private saveLocalCoupons(coupons: Coupon[]): void {
    try {
      localStorage.setItem('cached_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.warn("Failed to serialize coupons to localStorage:", e instanceof Error ? e.message : String(e));
    }
  }

  async getCoupons(): Promise<Coupon[]> {
    try {
      const fetchPromise = (async () => {
        const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const coupons: Coupon[] = [];
        querySnapshot.forEach((doc) => {
          coupons.push({ id: doc.id, ...doc.data() } as Coupon);
        });
        return coupons;
      })();

      const coupons = await runWithTimeout(fetchPromise, 1500);
      this.saveLocalCoupons(coupons);
      return coupons;
    } catch (error) {
      console.warn("Firestore: getCoupons failed or timed out. Falling back to local coupons cache.", error instanceof Error ? error.message : String(error));
      return this.getLocalCoupons();
    }
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    try {
      const fetchPromise = (async () => {
        const q = query(collection(db, 'coupons'), where("code", "==", code.toUpperCase().trim()));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          return { id: doc.id, ...doc.data() } as Coupon;
        }
        return undefined;
      })();

      const coupon = await runWithTimeout(fetchPromise, 1500);
      return coupon;
    } catch (error) {
      console.warn(`Firestore: getCouponByCode failed/timed out for code: ${code}. Using local coupons cache.`, error instanceof Error ? error.message : String(error));
      const localCoupons = this.getLocalCoupons();
      return localCoupons.find(c => c.code === code.toUpperCase().trim() && c.isActive);
    }
  }

  async addCoupon(coupon: Omit<Coupon, 'id' | 'createdAt'>): Promise<Coupon> {
    const localId = 'cp_' + Math.random().toString(36).substring(2, 9);
    const mockCoupon: Coupon = {
      id: localId,
      code: coupon.code.toUpperCase().trim(),
      type: coupon.type,
      value: coupon.value,
      minSpend: coupon.minSpend,
      isActive: coupon.isActive,
      createdAt: new Date().toISOString()
    };

    try {
      const addPromise = (async () => {
        const finalCoupon = {
          ...coupon,
          code: coupon.code.toUpperCase().trim(),
          createdAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, 'coupons'), finalCoupon);
        return { id: docRef.id, ...finalCoupon } as Coupon;
      })();

      const added = await runWithTimeout(addPromise, 1500);
      const current = this.getLocalCoupons().filter(c => c.id !== localId);
      current.unshift(added);
      this.saveLocalCoupons(current);
      return added;
    } catch (error) {
      console.warn("Firestore: addCoupon failed/timed out. Changes saved in local storage backup.", error instanceof Error ? error.message : String(error));
      const current = this.getLocalCoupons();
      current.unshift(mockCoupon);
      this.saveLocalCoupons(current);
      return mockCoupon;
    }
  }

  async updateCoupon(coupon: Coupon): Promise<void> {
    const current = this.getLocalCoupons();
    const updatedList = current.map(c => c.id === coupon.id ? coupon : c);
    this.saveLocalCoupons(updatedList);

    try {
      const updatePromise = (async () => {
        const couponRef = doc(db, 'coupons', coupon.id);
        const { id, ...data } = coupon;
        data.code = data.code.toUpperCase().trim();
        await updateDoc(couponRef, data);
      })();
      await runWithTimeout(updatePromise, 1500);
    } catch (error) {
      console.warn(`Firestore: updateCoupon failed or timed out for coupon ${coupon.id}. Changes saved locally.`, error instanceof Error ? error.message : String(error));
    }
  }

  async deleteCoupon(id: string): Promise<void> {
    const current = this.getLocalCoupons();
    const updatedList = current.filter(c => c.id !== id);
    this.saveLocalCoupons(updatedList);

    try {
      const deletePromise = deleteDoc(doc(db, 'coupons', id));
      await runWithTimeout(deletePromise, 1500);
    } catch (error) {
      console.warn(`Firestore: deleteCoupon failed or timed out for coupon ${id}. Deleted locally.`, error instanceof Error ? error.message : String(error));
    }
  }
}

export const storeService = new StoreService();
