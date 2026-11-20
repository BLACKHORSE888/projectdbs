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
import { TrialRequest, TrialRequestStatus } from '../types';

const COLLECTION = 'trialRequests';

const toMillis = (ts?: Timestamp | Date | null): number => {
  if (!ts) return 0;
  if (ts instanceof Timestamp) return ts.toMillis();
  if (ts instanceof Date) return ts.getTime();
  return 0;
};

export const createTrialRequest = async (
  payload: Omit<TrialRequest, 'id' | 'status' | 'createdAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      userId: payload.userId,
      name: payload.name.trim().slice(0, 100),
      email: payload.email.trim().slice(0, 150),
      phone: payload.phone.trim().slice(0, 15),
      city: payload.city.trim().slice(0, 80),
      address: payload.address.trim().slice(0, 300),
      pincode: payload.pincode.trim().slice(0, 10),
      preferredFlavour: payload.preferredFlavour.trim().slice(0, 80),
      currentSnackHabit: payload.currentSnackHabit.trim().slice(0, 200),
      tasteFeedback: (payload.tasteFeedback || '').trim().slice(0, 600),
      feedbackConsent: Boolean(payload.feedbackConsent),
      status: 'Pending' as TrialRequestStatus,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION);
  }
};

export const getUserTrialRequests = async (userId: string): Promise<TrialRequest[]> => {
  try {
    const q = query(collection(db, COLLECTION), where('userId', '==', userId));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as TrialRequest));
    return list.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
  }
};

export const getAllTrialRequests = async (): Promise<TrialRequest[]> => {
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as TrialRequest));
    return list.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
  }
};

export const updateTrialRequestStatus = async (
  id: string,
  status: TrialRequestStatus
): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTION, id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION}/${id}`);
  }
};
