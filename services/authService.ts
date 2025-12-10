import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.ts';
import { User } from '../types.ts';

const googleProvider = new GoogleAuthProvider();

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      // 2. Try to fetch extra profile data from Firestore
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
        console.warn("Could not fetch user profile from Firestore:", firestoreError);
      }

      // Hardcoded admin check
      if (email === 'admin@wrsmile.com') {
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

      // Determine role: Only specific email is admin
      const role = email === 'admin@wrsmile.com' ? 'admin' : 'customer';

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
        console.warn("Could not save user profile to Firestore (likely permission issue)", e);
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
          // New Google user - Create Firestore Doc
          if (fbUser.email === 'admin@wrsmile.com') {
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
        console.warn("Firestore access error during Google Login", e);
      }

      // Enforce admin check again just in case
      if (fbUser.email === 'admin@wrsmile.com') role = 'admin';

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
    // Simulate network delay for realistic feel
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