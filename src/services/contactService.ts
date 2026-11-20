import { collection, addDoc, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ContactMessage } from '../types';

const COLLECTION = 'contactMessages';

const toMillis = (ts?: Timestamp | Date | null): number => {
  if (!ts) return 0;
  if (ts instanceof Timestamp) return ts.toMillis();
  if (ts instanceof Date) return ts.getTime();
  return 0;
};

export const submitContactMessage = async (
  payload: Omit<ContactMessage, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      name: payload.name.trim().slice(0, 100),
      email: payload.email.trim().slice(0, 150),
      subject: payload.subject.trim().slice(0, 150),
      message: payload.message.trim().slice(0, 2000),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION);
  }
};

export const getAllContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage));
    return list.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
  }
};

export const saveSubscriber = async (
  contact: string,
  channel: 'email' | 'whatsapp'
): Promise<void> => {
  try {
    await addDoc(collection(db, 'subscribers'), {
      contact: contact.trim().slice(0, 150),
      channel,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'subscribers');
  }
};
