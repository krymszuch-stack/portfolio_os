import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Imports
content = content.replace(
  "import { auth } from './lib/googleAuth';\r\nimport { onAuthStateChanged } from 'firebase/auth';",
  "import { useAuthContext } from './contexts/AuthContext';\nimport { useWindowContext } from './contexts/WindowContext';"
);
content = content.replace(
  "import { auth } from './lib/googleAuth';\nimport { onAuthStateChanged } from 'firebase/auth';",
  "import { useAuthContext } from './contexts/AuthContext';\nimport { useWindowContext } from './contexts/WindowContext';"
);

// 2. getInitialWindowState
content = content.replace(/const getInitialWindowState = \(\) => \{[\s\S]*?\};\r?\n\r?\n/, '');

// 3. initialWindowState in App
content = content.replace(/ {2}const initialWindowState = getInitialWindowState\(\);\r?\n\r?\n/, "");

// 4. Auth States
content = content.replace(
  / {2}const \[currentUser, setCurrentUser\] = useState<any>\(null\);\r?\n {2}const \[guestMode, setGuestMode\] = useState<boolean>\(\(\) => \{\r?\n {4}return localStorage\.getItem\('portfolio_os_guest_mode'\) === 'true';\r?\n {2}\}\);\r?\n {2}const \[authLoading, setAuthLoading\] = useState<boolean>\(true\);\r?\n/,
  "  const { currentUser, guestMode, setGuestMode, authLoading, setAuthLoading } = useAuthContext();\n"
);

// 5. Auth Failsafe
content = content.replace(/\r?\n {2}\/\/ Firebase Auth timeout failsafe[\s\S]*?\}, \[authLoading\]\);\r?\n/, '');

// 6. onAuthStateChanged listener
const fetchCloudDataCode = `  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\\/p\\/(.+)$/);
    
    if (match) {
      const slug = match[1];
      setIsPublicView(true);
      setConfig(prev => ({ ...prev, viewerMode: true, isInitialized: true }));
      setAuthLoading(false);
      setIsDataLoaded(true);
      
      loadPortfolioBySlug(slug).then(cloudData => {
        if (cloudData) {
          if (cloudData.config) setConfig(cloudData.config);
          if (cloudData.projects) setProjects(cloudData.projects);
          if (cloudData.certificates) setCertificates(cloudData.certificates);
          if (cloudData.timeline) setTimeline(cloudData.timeline);
          if (cloudData.icons) setIcons(cloudData.icons);
        }
      }).catch(err => console.error(err));
    }
  }, []);

  useEffect(() => {
    if (isPublicView) return;
    
    const fetchCloudData = async () => {
      if (currentUser) {
        setSyncStatus('saving');
        triggerHaptic('light');
        try {
          const cloudData = await loadPortfolioConfig(currentUser.uid);
          if (cloudData) {
            if (cloudData.config) setConfig(cloudData.config);
            if (cloudData.projects) setProjects(cloudData.projects);
            if (cloudData.certificates) setCertificates(cloudData.certificates);
            if (cloudData.timeline) setTimeline(cloudData.timeline);
            if (cloudData.icons) setIcons(cloudData.icons);
          }
          setSyncStatus('synced');
          triggerHaptic('success');
        } catch (err) {
          console.error("Failed to load cloud config", err);
          setSyncStatus('error');
          triggerHaptic('error');
        } finally {
          setIsDataLoaded(true);
        }
      } else if (!authLoading) {
        setIsDataLoaded(true);
      }
    };
    
    fetchCloudData();
  }, [currentUser, authLoading, isPublicView]);`;

content = content.replace(/ {2}useEffect\(\(\) => \{\r?\n {4}const path = window\.location\.pathname;[\s\S]*? {2}\}, \[\]\);/, fetchCloudDataCode);

// 7. Window States
content = content.replace(
  / {2}const \[activeApp, setActiveApp\] = useState<ActiveAppId>\(initialWindowState\.focus\);\r?\n {2}const \[openApps, setOpenApps\] = useState<\{ \[key: string\]: boolean \}>\(initialWindowState\.open\);\r?\n {2}const \[minimizedApps, setMinimizedApps\] = useState<\{ \[key: string\]: boolean \}>\(\{\}\);\r?\n/,
  "  const { activeApp, openApps, minimizedApps, zIndices, handleOpenApp: _handleOpenApp, handleCloseApp: _handleCloseApp, handleMinimizeApp, handleFocusApp, handleSystemReset: _handleSystemReset } = useWindowContext();\n"
);

// 8. zIndices state
content = content.replace(/ {2}\/\/ Depth layering manager for window focus[\s\S]*?\}\);\r?\n\r?\n/, '');

// 9. Sync state to URL and popstate
content = content.replace(/ {2}\/\/ Synchronize state to URL[\s\S]*?\}, \[\]\);\r?\n\r?\n/, '');

// 10. Window actions
const windowActionsCode = `  const handleOpenApp = (appId: ActiveAppId | string) => {
    _handleOpenApp(appId as ActiveAppId);
    if (config.playSounds) {
      playXpBalloon();
    }
  };

  const handleCloseApp = (appId: string) => {
    _handleCloseApp(appId);
    if (config.playSounds) {
      playXpClick();
    }
    
    // Emit a glorious burst of 25 sparks on the dock icon when the window completes its shrink transition
    setTimeout(() => {
      const dockBtn = document.getElementById(\`dock-btn-\${appId}\`);
      if (dockBtn && (window as any).triggerSparks) {
        const rect = dockBtn.getBoundingClientRect();
        (window as any).triggerSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
      }
    }, 400);
  };

  const handleSystemReset = () => {
    _handleSystemReset();
  };`;

content = content.replace(/ {2}\/\/ System actions[\s\S]*? {2}const handleFocusApp = \(appId: string\) => \{[\s\S]*? {2}\};\r?\n/g, '  // System actions\n' + windowActionsCode + '\n');

fs.writeFileSync('src/App.tsx', content);
console.log("Replaced successfully");
