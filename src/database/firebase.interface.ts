import { Firestore } from 'firebase/firestore';

export interface IFirebaseService {
  getFirestore(): Firestore;
}