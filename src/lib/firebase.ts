import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  initializeFirestore,
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  onSnapshot, 
  query,
  Firestore 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserCareerProfile, ApplicationRecord } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function isFirestorePermissionError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  const code = (error as any)?.code;
  return (
    code === 'permission-denied' ||
    msg.toLowerCase().includes('permission-denied') ||
    msg.toLowerCase().includes('insufficient permissions') ||
    msg.toLowerCase().includes('missing or insufficient')
  );
}

export function isFirestoreOfflineError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  const code = (error as any)?.code;
  return (
    code === 'unavailable' ||
    code === 'failed-precondition' ||
    msg.toLowerCase().includes('client is offline') ||
    msg.toLowerCase().includes('offline') ||
    msg.toLowerCase().includes('could not reach') ||
    msg.toLowerCase().includes('network')
  );
}

// Validate connection to Firestore on boot
export async function testFirestoreConnection() {
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection check timeout')), 4000)
    );
    await Promise.race([
      getDocFromServer(doc(db, 'test', 'connection')),
      timeoutPromise
    ]);
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firestore] Notice: Firestore client currently offline or connecting in preview sandbox.');
    }
  }
}

// Trigger initial connection verification
testFirestoreConnection();

// Authentication Helpers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Firebase Auth Sign-In Error:', error);
    throw error;
  }
}

export async function signUpWithEmail(email: string, password: string, displayName?: string): Promise<User | null> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    return result.user;
  } catch (error: any) {
    console.error('Firebase Auth Sign-Up Error:', error);
    throw error;
  }
}

export async function loginWithEmail(email: string, password: string): Promise<User | null> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Firebase Auth Email Sign-In Error:', error);
    throw error;
  }
}

export async function resetUserPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Firebase Auth Password Reset Error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Firebase Auth Sign-Out Error:', error);
    throw error;
  }
}

// Cloud Persistence API: Profile
export async function saveUserProfileToCloud(userId: string, profile: Partial<UserCareerProfile>): Promise<void> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const sanitizedPayload: Record<string, any> = {
      id: userId,
      name: profile.name || 'Candidate',
      email: profile.email || auth.currentUser?.email || '',
      country: profile.country || 'Nigeria',
      city: profile.city || 'Lagos',
      timezone: profile.timezone || 'WAT (UTC+1)',
      targetRoles: profile.targetRoles || ['Junior Data Analyst'],
      experienceLevel: profile.experienceLevel || '0_1_years',
      yearsOfExperience: profile.yearsOfExperience || 1,
      skills: profile.skills || [],
      tools: profile.tools || [],
      programmingLanguages: profile.programmingLanguages || [],
      certifications: profile.certifications || [],
      education: profile.education || '',
      cvText: profile.cvText || '',
      preferredSalaryMin: profile.preferredSalaryMin || 1500,
      preferredCurrency: profile.preferredCurrency || 'USD',
      availability: profile.availability || 'Immediate (Full-time Remote)',
      preferredContractType: profile.preferredContractType || 'Contractor (Deel/Wise)',
      preferredPayoutMethods: profile.preferredPayoutMethods || ['Deel', 'Grey', 'Payoneer'],
      subscriptionPlan: profile.subscriptionPlan || 'free',
      hasCompletedOnboarding: profile.hasCompletedOnboarding === true,
      updatedAt: new Date().toISOString()
    };

    if (profile.uploadedResumeName) sanitizedPayload.uploadedResumeName = profile.uploadedResumeName;
    if (profile.careerTrack) sanitizedPayload.careerTrack = profile.careerTrack;
    if (profile.careerTracks) sanitizedPayload.careerTracks = profile.careerTracks;
    if (profile.preferredWorkTypes) sanitizedPayload.preferredWorkTypes = profile.preferredWorkTypes;
    if (typeof profile.careerReadinessScore === 'number') sanitizedPayload.careerReadinessScore = profile.careerReadinessScore;
    if (profile.readinessImprovements) sanitizedPayload.readinessImprovements = profile.readinessImprovements;
    if (profile.portfolioUrl) sanitizedPayload.portfolioUrl = profile.portfolioUrl;
    if (profile.linkedinUrl) sanitizedPayload.linkedinUrl = profile.linkedinUrl;
    if (profile.githubUrl) sanitizedPayload.githubUrl = profile.githubUrl;

    await setDoc(docRef, sanitizedPayload, { merge: true });
  } catch (error) {
    if (isFirestorePermissionError(error)) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    if (isFirestoreOfflineError(error)) {
      console.warn(`[Firestore] Profile write stored in local cache while offline.`);
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfileFromCloud(userId: string): Promise<UserCareerProfile | null> {
  const path = `users/${userId}`;
  const docRef = doc(db, 'users', userId);

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as UserCareerProfile;
      }
      return null;
    } catch (error: any) {
      if (isFirestorePermissionError(error)) {
        handleFirestoreError(error, OperationType.GET, path);
      }

      if (isFirestoreOfflineError(error)) {
        if (attempt < 2) {
          // Pause briefly to allow WebChannel connection to finish establishing
          await new Promise(res => setTimeout(res, 350 * (attempt + 1)));
          continue;
        }
        console.warn(`[Firestore] Offline: unable to fetch document at ${path}. Using local profile.`);
        return null;
      }

      handleFirestoreError(error, OperationType.GET, path);
    }
  }
  return null;
}

// Cloud Persistence API: Saved Jobs
export async function saveJobToCloud(userId: string, jobId: string, jobMetadata?: { title?: string; company?: string; salary?: string; location?: string }): Promise<void> {
  const path = `users/${userId}/savedJobs/${jobId}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedJobs', jobId);
    await setDoc(docRef, {
      id: jobId,
      userId,
      jobId,
      title: jobMetadata?.title || '',
      company: jobMetadata?.company || '',
      salary: jobMetadata?.salary || '',
      location: jobMetadata?.location || '',
      savedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    if (isFirestorePermissionError(error)) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    if (isFirestoreOfflineError(error)) {
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeSavedJobFromCloud(userId: string, jobId: string): Promise<void> {
  const path = `users/${userId}/savedJobs/${jobId}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedJobs', jobId);
    await deleteDoc(docRef);
  } catch (error) {
    if (isFirestorePermissionError(error)) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
    if (isFirestoreOfflineError(error)) {
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Cloud Persistence API: Applications
export async function saveApplicationToCloud(userId: string, application: ApplicationRecord): Promise<void> {
  const path = `users/${userId}/applications/${application.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'applications', application.id);
    const payload: Record<string, any> = {
      id: application.id,
      userId,
      jobId: application.jobId,
      jobTitle: application.jobTitle,
      company: application.company,
      status: application.status,
      updatedAt: new Date().toISOString()
    };

    if (application.salary) payload.salary = application.salary;
    if (application.appliedAt) payload.appliedAt = application.appliedAt;
    if (application.interviewDate) payload.interviewDate = application.interviewDate;
    if (application.followUpDate) payload.followUpDate = application.followUpDate;
    if (application.notes) payload.notes = application.notes;
    if (application.coverLetter) payload.coverLetter = application.coverLetter;
    if (application.pitch) payload.pitch = application.pitch;

    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    if (isFirestorePermissionError(error)) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    if (isFirestoreOfflineError(error)) {
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteApplicationFromCloud(userId: string, applicationId: string): Promise<void> {
  const path = `users/${userId}/applications/${applicationId}`;
  try {
    const docRef = doc(db, 'users', userId, 'applications', applicationId);
    await deleteDoc(docRef);
  } catch (error) {
    if (isFirestorePermissionError(error)) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
    if (isFirestoreOfflineError(error)) {
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Cloud Persistence API: Watched Companies
export async function saveWatchedCompanyToCloud(userId: string, companyId: string, companyName?: string): Promise<void> {
  const path = `users/${userId}/watchedCompanies/${companyId}`;
  try {
    const docRef = doc(db, 'users', userId, 'watchedCompanies', companyId);
    await setDoc(docRef, {
      id: companyId,
      userId,
      companyId,
      companyName: companyName || '',
      watchedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    if (isFirestorePermissionError(error)) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    if (isFirestoreOfflineError(error)) {
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeWatchedCompanyFromCloud(userId: string, companyId: string): Promise<void> {
  const path = `users/${userId}/watchedCompanies/${companyId}`;
  try {
    const docRef = doc(db, 'users', userId, 'watchedCompanies', companyId);
    await deleteDoc(docRef);
  } catch (error) {
    if (isFirestorePermissionError(error)) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
    if (isFirestoreOfflineError(error)) {
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
