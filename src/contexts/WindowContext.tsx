import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActiveAppId } from '../types';

interface WindowContextType {
  activeApp: ActiveAppId;
  openApps: { [key: string]: boolean };
  minimizedApps: { [key: string]: boolean };
  zIndices: { [key: string]: number };
  handleOpenApp: (appId: ActiveAppId, playSounds?: boolean) => void;
  handleCloseApp: (appId: string, playSounds?: boolean) => void;
  handleMinimizeApp: (appId: string) => void;
  handleFocusApp: (appId: string) => void;
  handleSystemReset: () => void;
}

const WindowContext = createContext<WindowContextType | null>(null);

const getInitialWindowState = () => {
  if (typeof window === 'undefined') return { open: {}, focus: null };
  const params = new URLSearchParams(window.location.search);
  const openParams = params.get('open');
  const focusParam = params.get('focus');
  
  const initialOpen: Record<string, boolean> = {};
  if (openParams) {
    openParams.split(',').forEach(app => {
      if (app) initialOpen[app] = true;
    });
  }
  return {
    open: initialOpen,
    focus: (focusParam as ActiveAppId) || null
  };
};

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialWindowState = getInitialWindowState();
  
  const [activeApp, setActiveApp] = useState<ActiveAppId>(initialWindowState.focus);
  const [openApps, setOpenApps] = useState<{ [key: string]: boolean }>(initialWindowState.open);
  const [minimizedApps, setMinimizedApps] = useState<{ [key: string]: boolean }>({});
  
  const [zIndices, setZIndices] = useState<{ [key: string]: number }>(() => {
    const defaultZs: { [key: string]: number } = {
      bio: 10, projects: 10, lab: 10, certificates: 10, settings: 10, contact: 10, wizard: 10, gdrive: 10, calendar: 10, planned: 10
    };
    if (initialWindowState.focus) {
      defaultZs[initialWindowState.focus] = 11;
    }
    return defaultZs;
  });

  // URL Sync
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const openAppIds = Object.entries(openApps)
      .filter(([_, isOpen]) => isOpen)
      .map(([id]) => id);
    
    if (openAppIds.length > 0) {
      params.set('open', openAppIds.join(','));
    } else {
      params.delete('open');
    }

    if (activeApp) {
      params.set('focus', activeApp);
    } else {
      params.delete('focus');
    }

    const currentSearch = window.location.search;
    const newSearch = params.toString() ? '?' + params.toString() : '';
    
    if (currentSearch !== newSearch) {
      const newUrl = `${window.location.pathname}${newSearch}${window.location.hash}`;
      window.history.pushState({}, '', newUrl);
    }
  }, [openApps, activeApp]);

  useEffect(() => {
    const handlePopState = () => {
      const state = getInitialWindowState();
      setOpenApps(state.open);
      setActiveApp(state.focus);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleFocusApp = (appId: string) => {
    setZIndices(prev => {
      const maxZ = Math.max(0, ...Object.values(prev));
      return {
        ...prev,
        [appId]: maxZ + 1
      };
    });
    setActiveApp(appId as ActiveAppId);
  };

  const handleOpenApp = (appId: ActiveAppId, playSounds = true) => {
    if (!appId) return;
    setOpenApps(prev => ({ ...prev, [appId]: true }));
    setMinimizedApps(prev => ({ ...prev, [appId]: false }));
    handleFocusApp(appId);
  };

  const handleMinimizeApp = (appId: string) => {
    setMinimizedApps(prev => ({ ...prev, [appId]: true }));
    if (activeApp === appId) setActiveApp(null);
  };

  const handleCloseApp = (appId: string, playSounds = true) => {
    setOpenApps(prev => ({ ...prev, [appId]: false }));
    setMinimizedApps(prev => ({ ...prev, [appId]: false }));
    if (activeApp === appId) {
      setActiveApp(null);
    }
  };

  const handleSystemReset = () => {
    setOpenApps({});
    setActiveApp(null);
  };

  return (
    <WindowContext.Provider value={{
      activeApp, openApps, minimizedApps, zIndices,
      handleOpenApp, handleCloseApp, handleMinimizeApp, handleFocusApp, handleSystemReset
    }}>
      {children}
    </WindowContext.Provider>
  );
};

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) throw new Error("useWindowContext must be used within WindowProvider");
  return context;
};
