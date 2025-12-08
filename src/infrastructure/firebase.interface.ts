import { FirebaseStorage } from 'firebase/storage';

export interface IFirebaseService {
  getStorage(): FirebaseStorage;
}
