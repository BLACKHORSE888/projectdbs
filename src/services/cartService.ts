import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { CartItem } from '../types';

const LOCAL_CART_KEY = 'milletly_guest_cart';

export const getLocalCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const saveLocalCart = (items: CartItem[]): void => {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items.slice(0, 30)));
  } catch {
    // Ignore storage quota errors
  }
};

export const clearLocalCart = (): void => {
  try {
    localStorage.removeItem(LOCAL_CART_KEY);
  } catch {
    // Ignore
  }
};

export const getRemoteCart = async (uid: string): Promise<CartItem[]> => {
  const path = `carts/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'carts', uid));
    if (!snap.exists()) return [];
    const data = snap.data();
    return Array.isArray(data?.items) ? (data.items as CartItem[]) : [];
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const saveRemoteCart = async (uid: string, items: CartItem[]): Promise<void> => {
  const path = `carts/${uid}`;
  try {
    await setDoc(doc(db, 'carts', uid), {
      items: items.slice(0, 30),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const mergeCarts = (remote: CartItem[], local: CartItem[]): CartItem[] => {
  const map = new Map<string, CartItem>();

  for (const item of remote) {
    map.set(`${item.productId}_${item.variant}`, { ...item });
  }

  for (const item of local) {
    const key = `${item.productId}_${item.variant}`;
    const existing = map.get(key);
    if (existing) {
      map.set(key, { ...existing, quantity: existing.quantity + item.quantity });
    } else {
      map.set(key, { ...item });
    }
  }

  return Array.from(map.values()).slice(0, 30);
};
