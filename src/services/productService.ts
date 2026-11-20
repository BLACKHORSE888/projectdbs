import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';

const COLLECTION = 'products';

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
    return items.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const q = query(collection(db, COLLECTION), where('featured', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Product;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION}/${id}`);
  }
};

export const createProduct = async (
  data: Omit<Product, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      name: data.name.trim().slice(0, 120),
      description: data.description.trim().slice(0, 1500),
      flavour: data.flavour.trim().slice(0, 60),
      milletType: data.milletType.trim().slice(0, 60),
      images: data.images.slice(0, 6),
      ingredients: data.ingredients.slice(0, 20),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION);
  }
};

export const updateProduct = async (
  id: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTION, id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION}/${id}`);
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION}/${id}`);
  }
};
