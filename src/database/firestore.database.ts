import { injectable } from 'inversify';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Firestore 
} from 'firebase/firestore';
import { IDatabase } from './database.interface';

@injectable()
export class FirestoreDatabase implements IDatabase {
  private db: Firestore;

  constructor() {
    this.db = getFirestore();
  }

  async create<T>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(this.db, collectionName), data);
    return docRef.id;
  }

  async getById<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(this.db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  async getAll<T>(collectionName: string): Promise<T[]> {
    const querySnapshot = await getDocs(collection(this.db, collectionName));
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as T));
  }

  async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.db, collectionName, id);
    await updateDoc(docRef, data as any);
  }

  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(this.db, collectionName, id);
    await deleteDoc(docRef);
  }

  async query<T>(
    collectionName: string, 
    field: string, 
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=', 
    value: any
  ): Promise<T[]> {
    const q = query(collection(this.db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as T));
  }
}