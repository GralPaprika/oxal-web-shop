import { injectable } from 'inversify';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { IFirebaseService } from '@/src/infrastructure/firebase.interface';

@injectable()
export class FirebaseService implements IFirebaseService {
  private app: FirebaseApp;
  private storage: FirebaseStorage;

  constructor() {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    this.app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    this.storage = getStorage(this.app);
  }

  getStorage(): FirebaseStorage {
    return this.storage;
  }
}
