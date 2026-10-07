import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, testFirestoreConnection } from '../config/firebase';
import { UserProfile } from '../types';
import { signInWithGoogle, signInWithEmail, signOutUser, fetchUserProfile, syncUserProfile, isAdminUser } from '../services/authService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  firestoreConnected: boolean;
  loginWithGoogle: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(false);

  const isAdmin = isAdminUser(user) || userProfile?.role === 'admin';

  useEffect(() => {
    // Check Firestore server connectivity
    testFirestoreConnection().then((connected) => {
      setFirestoreConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profile = await fetchUserProfile(currentUser.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            const synced = await syncUserProfile(currentUser);
            setUserProfile(synced);
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const loggedUser = await signInWithGoogle();
      const profile = await syncUserProfile(loggedUser);
      setUserProfile(profile);
    } catch (error) {
      console.error('Sign-in failed:', error);
      throw error;
    }
  };

  const handleEmailSignIn = async (email: string, password: string): Promise<User> => {
    try {
      const loggedUser = await signInWithEmail(email, password);
      try {
        const profile = await syncUserProfile(loggedUser);
        setUserProfile(profile);
      } catch (profileErr) {
        console.warn('Profile sync skipped in handleEmailSignIn:', profileErr);
      }
      return loggedUser;
    } catch (error) {
      console.error('Email sign-in failed:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUserProfile(null);
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.uid);
      if (profile) setUserProfile(profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: userProfile,
        userProfile,
        isAdmin,
        loading,
        firestoreConnected,
        loginWithGoogle: handleSignIn,
        signInWithGoogle: handleSignIn,
        loginWithEmail: handleEmailSignIn,
        logout: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
