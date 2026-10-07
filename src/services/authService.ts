import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import { UserProfile, UserRole, OperationType } from '../types';
import { handleFirestoreError } from './firestoreErrors';

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const cleanEmail = email.trim();
  try {
    const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
    try {
      await syncUserProfile(result.user);
    } catch (syncErr) {
      console.warn('Profile sync warning on email login:', syncErr);
    }
    return result.user;
  } catch (error: any) {
    // If the account has not been registered in Firebase Auth yet, auto-create it seamlessly
    if (error?.code === 'auth/user-not-found' || error?.code === 'auth/invalid-credential') {
      try {
        const createResult = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        try {
          await syncUserProfile(createResult.user);
        } catch (syncErr) {
          console.warn('Profile sync warning on email create:', syncErr);
        }
        return createResult.user;
      } catch (createErr) {
        console.error('Email sign-in / creation error:', createErr);
        throw error;
      }
    }
    console.error('Email Sign-In Error:', error);
    throw error;
  }
}

export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(result.user);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
}

export function isAdminUser(user: User | null): boolean {
  if (!user || !user.email) return false;
  const adminEmails = ['atlaspelet.com@gmail.com'];
  return adminEmails.includes(user.email.toLowerCase());
}

export async function syncUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const path = `users/${user.uid}`;

  try {
    const docSnap = await getDoc(userRef);
    const assignedRole: UserRole = isAdminUser(user) ? 'admin' : 'architect';

    if (!docSnap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Mimar / Kullanıcı',
        email: user.email || '',
        photoURL: user.photoURL || undefined,
        role: assignedRole,
        createdAt: new Date().toISOString(),
      };

      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      const existingData = docSnap.data() as UserProfile;
      if (isAdminUser(user) && existingData.role !== 'admin') {
        await setDoc(userRef, { role: 'admin' }, { merge: true });
        existingData.role = 'admin';
      }
      return existingData;
    }
  } catch (error) {
    return handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const path = `users/${uid}`;

  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, path);
  }
}
