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
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await loadUserProfile(result.user);
    }
  }, [loadUserProfile]);

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
