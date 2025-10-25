import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { User } from '@/domain/user/user.entity';
import { CreateUserData } from '@/domain/user/user.repository';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export class FirebaseUserService {
  private auth;
  private db;

  constructor() {
    // Initialize Firebase if not already initialized
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    this.auth = getAuth(app);
    this.db = getFirestore(app);
  }

  /**
   * Creates a user in Firebase Auth and creates corresponding Firestore document
   */
  async createUserWithAuth(data: CreateUserData): Promise<User> {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;
      const now = new Date();

      // Create user document in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
        status: 'active',
        emailVerified: firebaseUser.emailVerified,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        metadata: {
          totalOrders: 0,
          preferences: {}
        }
      };

      // Save to Firestore
      await setDoc(doc(this.db, 'users', firebaseUser.uid), userData);

      return userData;
    } catch (error) {
      console.error('Error creating user with auth:', error);
      throw error;
    }
  }
}