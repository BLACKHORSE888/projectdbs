import { collection, addDoc, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SurveyResponse } from '../types';

const COLLECTION = 'surveys';

const toMillis = (ts?: Timestamp | Date | null): number => {
  if (!ts) return 0;
  if (ts instanceof Timestamp) return ts.toMillis();
  if (ts instanceof Date) return ts.getTime();
  return 0;
};

export const submitSurvey = async (
  payload: Omit<SurveyResponse, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      userId: payload.userId,
      userEmail: payload.userEmail.slice(0, 150),
      userName: payload.userName.slice(0, 100),
      currentSnackingHabits: payload.currentSnackingHabits.slice(0, 120),
      monthlySpend: payload.monthlySpend.slice(0, 60),
      preferredFlavours: payload.preferredFlavours.slice(0, 10),
      willingnessToPay: payload.willingnessToPay,
      tasteRating: payload.tasteRating,
      wouldBuyAgain: payload.wouldBuyAgain,
      comments: payload.comments.trim().slice(0, 1000),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION);
  }
};

export const getAllSurveys = async (): Promise<SurveyResponse[]> => {
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SurveyResponse));
    return list.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
  }
};
