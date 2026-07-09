import { useState, useRef, useEffect } from 'react';
import { auth, googleSignIn } from './googleAuth';
import { savePortfolioConfig } from './firestoreStore';
import { OSConfig, Project, Certificate, TimelineItem, DesktopIcon } from '../types';

export function usePortfolioSave() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [publicSlug, setPublicSlug] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const saveToCloud = async (
    config: OSConfig,
    projects: Project[],
    certificates: Certificate[],
    timeline: TimelineItem[],
    icons: DesktopIcon[]
  ) => {
    try {
      setSaveStatus('saving');
      
      let currentUser = auth.currentUser;
      if (!currentUser) {
        const result = await googleSignIn();
        if (result) currentUser = result.user;
      }

      let slugToReturn = null;

      if (currentUser) {
        const result = await savePortfolioConfig(
          currentUser.uid,
          config,
          projects,
          certificates,
          timeline,
          icons
        );
        if (result.success && result.publicSlug) {
          setPublicSlug(result.publicSlug);
          slugToReturn = result.publicSlug;
        }
      }
      
      setSaveStatus('success');
      // Reset status after a few seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSaveStatus('idle'), 3000);
      return { success: true, publicSlug: slugToReturn };
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('error');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSaveStatus('idle'), 4000);
      return { success: false };
    }
  };

  return { saveToCloud, saveStatus, publicSlug };
}
