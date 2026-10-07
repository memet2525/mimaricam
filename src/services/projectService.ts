import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Project, PhotoCapture, OperationType } from '../types';
import { handleFirestoreError } from './firestoreErrors';

export async function getUserProjects(userId: string): Promise<Project[]> {
  const path = 'projects';
  try {
    const q = query(
      collection(db, path),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToUserProjects(
  userId: string,
  onUpdate: (projects: Project[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = 'projects';
  const q = query(
    collection(db, path),
    where('ownerId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const projects = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
      onUpdate(projects);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (err) {
        if (onError && err instanceof Error) onError(err);
      }
    }
  );
}

export async function createProject(
  projectData: Omit<Project, 'id' | 'createdAt' | 'ownerId'>
): Promise<Project> {
  const user = auth.currentUser;
  if (!user) throw new Error('Oturum açmış kullanıcı bulunamadı.');

  const projectId = 'proj_' + Math.random().toString(36).substring(2, 11);
  const path = `projects/${projectId}`;
  const now = new Date().toISOString();

  const newProject: Project = {
    id: projectId,
    ...projectData,
    ownerId: user.uid,
    createdAt: now,
  };

  try {
    await setDoc(doc(db, 'projects', projectId), newProject);
    return newProject;
  } catch (error) {
    return handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const path = `projects/${projectId}`;
  try {
    const docSnap = await getDoc(doc(db, 'projects', projectId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Project;
    }
    return null;
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function updateProject(
  projectId: string,
  updates: Partial<Pick<Project, 'title' | 'client' | 'location' | 'description' | 'status'>>
): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getProjectPhotos(projectId: string): Promise<PhotoCapture[]> {
  const path = `projects/${projectId}/photos`;
  try {
    const q = query(
      collection(db, path),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PhotoCapture));
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}
