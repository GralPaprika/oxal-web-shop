import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

export interface IFirebaseService {
  getFirestore(): Firestore;
  getAuth(): Auth;
}