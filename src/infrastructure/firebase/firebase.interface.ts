import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';

export interface IFirebaseService {
  getFirestore(): Firestore;
  getAuth(): Auth;
  getStorage(): FirebaseStorage;
}
