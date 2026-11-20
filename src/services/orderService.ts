import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { CartItem, Order, OrderStatus, PaymentMethod, ShippingAddress } from '../types';

const COLLECTION = 'orders';

const toMillis = (ts?: Timestamp | Date | null): number => {
  if (!ts) return 0;
  if (ts instanceof Timestamp) return ts.toMillis();
  if (ts instanceof Date) return ts.getTime();
  return 0;
};

export const createOrder = async (payload: {
  userId: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  address: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
}): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      userId: payload.userId,
      userEmail: payload.userEmail.slice(0, 150),
      items: payload.items.slice(0, 30),
      subtotal: payload.subtotal,
      shippingFee: payload.shippingFee,
      total: payload.total,
      address: {
        name: payload.address.name.trim().slice(0, 100),
        phone: payload.address.phone.trim().slice(0, 15),
        addressLine: payload.address.addressLine.trim().slice(0, 300),
        city: payload.address.city.trim().slice(0, 80),
        pincode: payload.address.pincode.trim().slice(0, 10),
      },
      phone: payload.address.phone.trim().slice(0, 15),
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentStatus,
      status: 'Placed' as OrderStatus,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION);
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(collection(db, COLLECTION), where('userId', '==', userId));
    const snap = await getDocs(q);
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
    return orders.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
    return orders.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTION, orderId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION}/${orderId}`);
  }
};
