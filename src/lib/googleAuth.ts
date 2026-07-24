import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider, onAuthStateChanged, User, type Auth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export let app: FirebaseApp | undefined;
export let auth: Auth;

try {
  // Rzutowanie appId i messagingSenderId na stringi, aby uniknąć błędów notacji naukowej
  const config = {
    ...firebaseConfig,
    appId: String(firebaseConfig.appId),
    messagingSenderId: String(firebaseConfig.messagingSenderId)
  };
  app = initializeApp(config);
  auth = getAuth(app);
} catch (error) {
  console.error("Błąd inicjalizacji Firebase - sprawdź firebase-applet-config.json", error);
  // Provide dummy mock to prevent crashes when auth object is imported
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInWithPopup: async () => { throw new Error("Firebase offline"); },
    signOut: async () => {}
  } as unknown as Auth;
}

const provider = new GoogleAuthProvider();
// Request Drive, Calendar and Gmail send scopes
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/gmail.send');

export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({ prompt: 'select_account' });

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  try {
    if (!auth || !auth.name) {
      if (onAuthFailure) onAuthFailure();
      return () => {};
    }
    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        if (cachedAccessToken) {
          if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        } else if (!isSigningIn) {
          cachedAccessToken = null;
          if (onAuthFailure) onAuthFailure();
        }
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    });
  } catch (error) {
    console.error("Firebase auth listen error:", error);
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const microsoftSignIn = async (): Promise<{ user: User } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, microsoftProvider);
    return { user: result.user };
  } catch (error) {
    console.error('Microsoft Firebase sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};
