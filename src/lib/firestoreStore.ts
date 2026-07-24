import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { app } from './googleAuth';
import { OSConfig, Project, Certificate, TimelineItem, DesktopIcon } from '../types';

const getDb = () => {
  if (!app) throw new Error("Firebase app not initialized");
  return getFirestore(app);
};

export const checkSlugAvailability = async (slug: string, currentUserId?: string): Promise<boolean> => {
  try {
    const db = getDb();
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(portfoliosRef, where('publicSlug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return true; // Available
    }
    
    if (currentUserId && querySnapshot.docs[0].id === currentUserId) {
      return true; // Taken, but belongs to the current user
    }
    
    return false; // Taken by someone else
  } catch (error) {
    console.error('Error checking slug availability:', error);
    return false;
  }
};

export const savePortfolioConfig = async (
  userId: string,
  config: OSConfig,
  projects: Project[],
  certificates: Certificate[],
  timeline: TimelineItem[],
  icons: DesktopIcon[]
) => {
  try {
    const db = getDb();
    const docRef = doc(db, 'portfolios', userId);
    
    // Check if the document already exists to preserve the publicSlug
    const existingSnap = await getDoc(docRef);
    let publicSlug = '';
    
    if (config.customSlug) {
      const isValid = /^[a-z0-9-]{3,32}$/.test(config.customSlug);
      if (!isValid) throw new Error("Invalid custom slug format.");
      
      const isAvailable = await checkSlugAvailability(config.customSlug, userId);
      if (!isAvailable) throw new Error("Custom slug is already taken.");
      
      publicSlug = config.customSlug;
    } else if (existingSnap.exists() && existingSnap.data().publicSlug) {
      publicSlug = existingSnap.data().publicSlug;
    } else {
      // Generate new public slug only if it doesn't exist
      const slugBase = config.portfolioName 
        ? config.portfolioName.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
        : 'portfolio';
      
      let attempts = 0;
      let generatedSlug = '';
      let isAvailable = false;
      
      while (attempts < 5 && !isAvailable) {
        const suffix = crypto.randomUUID().substring(0, 4);
        generatedSlug = `${slugBase}-${suffix}`;
        isAvailable = await checkSlugAvailability(generatedSlug, userId);
        attempts++;
      }
      
      if (!isAvailable) {
        throw new Error("Could not generate a unique public slug. Please try setting a custom one.");
      }
      
      publicSlug = generatedSlug;
    }

    const data = {
      config,
      projects,
      certificates,
      timeline,
      icons,
      publicSlug,
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(docRef, data, { merge: true });
    return { success: true, publicSlug };
  } catch (error) {
    console.error('Error saving portfolio config:', error);
    throw error;
  }
};

export const loadPortfolioConfig = async (userId: string) => {
  try {
    const db = getDb();
    const docRef = doc(db, 'portfolios', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error loading portfolio config:', error);
    throw error;
  }
};

export const loadPortfolioBySlug = async (slug: string) => {
  try {
    const db = getDb();
    const portfoliosRef = collection(db, 'portfolios');
    const q = query(portfoliosRef, where('publicSlug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error loading portfolio by slug:', error);
    throw error;
  }
};
