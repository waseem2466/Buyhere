import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User } from '../types';

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

const googleProvider = new GoogleAuthProvider();

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      // 2. Fetch extra profile data from Firestore with secure error wrapping
      let role = 'customer';
      let name = fbUser.displayName || 'User';

      try {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          role = userData.role || 'customer';
          name = userData.name || name;
        }
      } catch (firestoreError) {
        handleFirestoreError(firestoreError, OperationType.GET, `users/${fbUser.uid}`);
      }

      // Hardcoded admin overrides (Case-insensitive check)
      const lowercaseEmail = email?.toLowerCase();
      if (lowercaseEmail === 'admin@wrsmile.com' || lowercaseEmail === 'waseemkhan2466@gmail.com') {
        role = 'admin';
      }

      return {
        uid: fbUser.uid,
        name,
        email: fbUser.email!,
        role: role as 'admin' | 'customer'
      };
    } catch (error) {
      console.error("Firebase Login Error:", error);
      throw error;
    }
  },

  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      await updateProfile(fbUser, { displayName: name });

      // Determine role: specific emails are admin (Case-insensitive check)
      const lowercaseEmail = email?.toLowerCase();
      const role = (lowercaseEmail === 'admin@wrsmile.com' || lowercaseEmail === 'waseemkhan2466@gmail.com') ? 'admin' : 'customer';

      const newUser: User = {
        uid: fbUser.uid,
        name,
        email,
        role
      };

      // Save user details to Firestore for persistence
      try {
        await setDoc(doc(db, 'users', fbUser.uid), newUser);
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, `users/${fbUser.uid}`);
      }

      return newUser;
    } catch (error) {
      console.error("Firebase Register Error:", error);
      throw error;
    }
  },

  async loginWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const userDocRef = doc(db, 'users', fbUser.uid);
      let role = 'customer';
      let name = fbUser.displayName || 'User';

      try {
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          // Existing user
          const userData = userDoc.data();
          role = userData.role || 'customer';
          name = userData.name || name;
        } else {
          // New Google user - Create Firestore Doc (Case-insensitive check)
          const lowercaseEmail = fbUser.email?.toLowerCase();
          if (lowercaseEmail === 'admin@wrsmile.com' || lowercaseEmail === 'waseemkhan2466@gmail.com') {
            role = 'admin';
          }
          
          const newUser: User = {
            uid: fbUser.uid,
            name,
            email: fbUser.email!,
            role: role as 'admin' | 'customer'
          };
          
          await setDoc(userDocRef, newUser);
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${fbUser.uid}`);
      }

      // Enforce admin check (Case-insensitive check)
      const finalLowercaseEmail = fbUser.email?.toLowerCase();
      if (finalLowercaseEmail === 'admin@wrsmile.com' || finalLowercaseEmail === 'waseemkhan2466@gmail.com') {
        role = 'admin';
      }

      return {
        uid: fbUser.uid,
        name,
        email: fbUser.email!,
        role: role as 'admin' | 'customer'
      };

    } catch (error) {
      console.error("Google Login Error:", error);
      throw error;
    }
  },

  async loginAsDemoUser(): Promise<User> {
    // Simulate network delay for realistic feels
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      uid: 'demo-user-' + Math.random().toString(36).substring(2, 9),
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'customer'
    };
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout error", e);
    }
  }
};
