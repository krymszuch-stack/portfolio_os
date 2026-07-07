import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { app } from './googleAuth';
import { OSConfig, Project, Certificate, TimelineItem, DesktopIcon } from '../types';

const db = getFirestore(app);

export const savePortfolioConfig = async (
  userId: string,
  config: OSConfig,
  projects: Project[],
  certificates: Certificate[],
  timeline: TimelineItem[],
  icons: DesktopIcon[]
) => {
  try {
    const docRef = doc(db, 'portfolios', userId);
    
    // Generate public slug
    const suffix = Math.random().toString(36).substring(2, 6);
    const slugBase = config.portfolioName 
      ? config.portfolioName.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      : 'portfolio';
    const publicSlug = `${slugBase}-${suffix}`;

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
