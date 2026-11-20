import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';

export const ensureUserDocument = async (firebaseUser: User): Promise<UserProfile> => {
  const path = `users/${firebaseUser.uid}`;
  const userRef = doc(db, 'users', firebaseUser.uid);

  try {
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const newUser = {
        name: (firebaseUser.displayName || 'Milletly Friend').slice(0, 100),
        email: (firebaseUser.email || '').slice(0, 150),
        photoURL: (firebaseUser.photoURL || '').slice(0, 500),
        role: 'customer' as const,
        phone: '',
        address: '',
        city: '',
        pincode: '',
        createdAt: serverTimestamp(),
      };

      await setDoc(userRef, newUser);
      return {
        uid: firebaseUser.uid,
        ...newUser,
        createdAt: new Date(),
      };
    }

    const data = snapshot.data() as Omit<UserProfile, 'uid'>;
    return {
      uid: firebaseUser.uid,
      ...data,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<Pick<UserProfile, 'name' | 'phone' | 'address' | 'city' | 'pincode'>>
): Promise<void> => {
  const path = `users/${uid}`;
  try {
    const sanitized: Record<string, string> = {};
    if (updates.name !== undefined) sanitized.name = updates.name.trim().slice(0, 100);
    if (updates.phone !== undefined) sanitized.phone = updates.phone.trim().slice(0, 15);
    if (updates.address !== undefined) sanitized.address = updates.address.trim().slice(0, 300);
    if (updates.city !== undefined) sanitized.city = updates.city.trim().slice(0, 80);
    if (updates.pincode !== undefined) sanitized.pincode = updates.pincode.trim().slice(0, 10);

    await updateDoc(doc(db, 'users', uid), sanitized);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};
