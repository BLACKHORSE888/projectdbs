import React, { createContext, useCallback, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, isEmailAdmin } from '../lib/firebase';
import { ensureUserDocument } from '../services/userService';
import { UserProfile } from '../types';

interface AuthContextValue {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = useCallback(async (firebaseUser: User) => {
    try {
      const profile = await ensureUserDocument(firebaseUser);
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to ensure user document:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadUserProfile]);

  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Profile creation/loading is handled once by onAuthStateChanged
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code || '';
      const host = typeof window !== 'undefined' ? window.location.hostname : '';
      if (code === 'auth/unauthorized-domain') {
        throw new Error(
          `Domain "${host}" is not authorized in Firebase Auth. Add it under Firebase Console -> Authentication -> Settings -> Authorized domains.`
        );
      }
      if (code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked by your browser. Please allow popups and try again.');
      }
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in window was closed before completing login.');
      }
      if (code === 'auth/operation-not-allowed') {
        throw new Error('Google Sign-In is not enabled in Firebase Authentication -> Sign-in method.');
      }
      const msg = error instanceof Error ? error.message : 'Google Sign-In failed.';
      throw new Error(code ? `${msg} (${code})` : msg);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadUserProfile(user);
    }
  }, [user, loadUserProfile]);

  const isAdmin = Boolean(user && isEmailAdmin(user.email));

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        signInWithGoogle,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
