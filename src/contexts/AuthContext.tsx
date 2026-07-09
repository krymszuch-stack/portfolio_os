import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/googleAuth';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  currentUser: any;
  guestMode: boolean;
  setGuestMode: (val: boolean) => void;
  authLoading: boolean;
  setAuthLoading: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [guestMode, setGuestMode] = useState<boolean>(() => {
    return localStorage.getItem('portfolio_os_guest_mode') === 'true';
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Firebase Auth timeout failsafe
  useEffect(() => {
    let timeoutId: any;
    if (authLoading) {
      timeoutId = setTimeout(() => {
        console.warn('Firebase Auth timeout - przełączono na tryb offline/gościa');
        setAuthLoading(false);
        setGuestMode(true);
        localStorage.setItem('portfolio_os_guest_mode', 'true');
      }, 8000);
    }
    return () => clearTimeout(timeoutId);
  }, [authLoading]);

  useEffect(() => {
    try {
      if (!auth || !auth.name) {
        throw new Error("Invalid Auth object - likely Firebase failed to initialize");
      }
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setAuthLoading(false);
        setCurrentUser(firebaseUser || null);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Firebase auth listen error:", err);
      // Fallback to offline/guest mode immediately if auth is completely broken
      setAuthLoading(false);
      setGuestMode(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, guestMode, setGuestMode, authLoading, setAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
