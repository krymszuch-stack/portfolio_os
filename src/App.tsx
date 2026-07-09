/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ParticleOverlay } from './components/ParticleOverlay';
import { Desktop } from './components/Desktop';
import { BentoHub } from './components/BentoHub';
import { WindowFrame } from './components/WindowFrame';
import { lazy, Suspense } from 'react';
const AppBio = lazy(() => import('./components/AppBio').then(m => ({ default: m.AppBio })));
const AppProjects = lazy(() => import('./components/AppProjects').then(m => ({ default: m.AppProjects })));
const AppCertificates = lazy(() => import('./components/AppCertificates').then(m => ({ default: m.AppCertificates })));
const AppSettings = lazy(() => import('./components/AppSettings').then(m => ({ default: m.AppSettings })));
const AppContact = lazy(() => import('./components/AppContact').then(m => ({ default: m.AppContact })));
const AppTerminal = lazy(() => import('./components/AppTerminal').then(m => ({ default: m.AppTerminal })));
const AppDashboard = lazy(() => import('./components/AppDashboard').then(m => ({ default: m.AppDashboard })));
const Wizard = lazy(() => import('./components/Wizard').then(m => ({ default: m.Wizard })));
import { WindowSkeleton } from './components/WindowSkeleton';
import { PortfolioView } from './components/PortfolioView';
import { Dock } from './components/Dock';
import { SpotlightSearch } from './components/SpotlightSearch';
import { SystemClock } from './components/SystemClock';
import { SystemGreeting } from './components/SystemGreeting';
import { 
  initialProjects, 
  initialCertificates, 
  initialTimeline, 
  initialSprints, 
  initialDesktopIcons, 
  defaultOSConfig, 
  wallpaperOptions 
} from './data';
import { ActiveAppId, OSConfig, DesktopIcon } from './types';
import { Sparkles, RefreshCw, Clock, HelpCircle, Monitor, Search, ArrowLeft } from 'lucide-react';
import * as Lucide from 'lucide-react';
import { useAuthContext } from './contexts/AuthContext';
import { useWindowContext } from './contexts/WindowContext';
import { usePortfolioSave } from './lib/usePortfolioSave';
import { Check, Loader2, CloudUpload, Eye } from 'lucide-react';
import { triggerHaptic } from './lib/haptics';
import { loadPortfolioConfig, loadPortfolioBySlug, savePortfolioConfig } from './lib/firestoreStore';
import { playXpStartup, playXpShutdown, playXpError, playXpBalloon, playXpClick, setSoundsEnabled } from './lib/sounds';
import { AuthScreen } from './components/AuthScreen';
import { useDynamicFonts } from './hooks/useDynamicFonts';

const ALL_SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn', icon: 'Linkedin', color: 'text-[#0a66c2] hover:bg-[#0a66c2]/10', url: 'https://linkedin.com' },
  { id: 'skype', label: 'Skype', icon: 'Phone', color: 'text-[#00aff0] hover:bg-[#00aff0]/10', url: 'https://skype.com' },
  { id: 'teams', label: 'Teams', icon: 'Users', color: 'text-[#6264a7] hover:bg-[#6264a7]/10', url: 'https://teams.microsoft.com' },
  { id: 'discord', label: 'Discord', icon: 'MessageSquare', color: 'text-[#5865f2] hover:bg-[#5865f2]/10', url: 'https://discord.com' },
  { id: 'mail', label: 'Mail', icon: 'Mail', color: 'text-[#ea4335] hover:bg-[#ea4335]/10', url: 'mailto:contact@adrian.dev' },
  { id: 'steam', label: 'Steam', icon: 'Gamepad2', color: 'text-[#101822] hover:bg-[#101822]/10 dark:text-[#8cc2e6] dark:hover:bg-[#8cc2e6]/10', url: 'https://store.steampowered.com' },
  { id: 'facebook', label: 'Facebook', icon: 'Facebook', color: 'text-[#1877f2] hover:bg-[#1877f2]/10', url: 'https://facebook.com' },
  { id: 'instagram', label: 'Instagram', icon: 'Instagram', color: 'text-[#e1306c] hover:bg-[#e1306c]/10', url: 'https://instagram.com' },
  { id: 'vk', label: 'VK', icon: 'Share2', color: 'text-[#0077ff] hover:bg-[#0077ff]/10', url: 'https://vk.com' },
  { id: 'telegram', label: 'Telegram', icon: 'Send', color: 'text-[#229ed9] hover:bg-[#229ed9]/10', url: 'https://t.me' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle', color: 'text-[#25d366] hover:bg-[#25d366]/10', url: 'https://whatsapp.com' },
  { id: 'viber', label: 'Viber', icon: 'PhoneCall', color: 'text-[#7360f2] hover:bg-[#7360f2]/10', url: 'https://viber.com' },
  { id: 'messenger', label: 'Messenger', icon: 'Zap', color: 'text-[#006aff] hover:bg-[#006aff]/10', url: 'https://messenger.com' }
];

export default function App() {

  // Config & Core System states
  const [config, setConfig] = useState<OSConfig>(() => {
    const saved = localStorage.getItem('adrianOSConfig');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultOSConfig,
          ...parsed,
        };
      } catch (e) {
        return defaultOSConfig;
      }
    }
    return defaultOSConfig;
  });
  
  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem('adrianOSConfig', JSON.stringify(config));
  }, [config]);

  // Load dynamic fonts based on theme/settings
  useDynamicFonts(config);

  // Customizable dataset states (Declared first)
  const [isPublicView, setIsPublicView] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [timeline, setTimeline] = useState(initialTimeline);
  const [sprints, setSprints] = useState(initialSprints);
  const [icons, setIcons] = useState<DesktopIcon[]>(() => {
    const saved = localStorage.getItem('adrianDesktopIcons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialDesktopIcons;
      }
    }
    return initialDesktopIcons;
  });

  // Save icons to localStorage
  useEffect(() => {
    localStorage.setItem('adrianDesktopIcons', JSON.stringify(icons));
  }, [icons]);

  const { currentUser, guestMode, setGuestMode, authLoading, setAuthLoading } = useAuthContext();
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [activeSocials, setActiveSocials] = useState<string[]>(() => {
    const saved = localStorage.getItem('activeSocials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return ['linkedin', 'mail'];
  });
  const [showSocialsDropdown, setShowSocialsDropdown] = useState(false);

  useEffect(() => {
    localStorage.setItem('activeSocials', JSON.stringify(activeSocials));
  }, [activeSocials]);

  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/p\/(.+)$/);
    
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
  }, [currentUser, authLoading, isPublicView]);

  // Debounced Autosave to Firestore
  useEffect(() => {
    if (!currentUser || !isDataLoaded || isPublicView) return;

    setSyncStatus('saving');
    const timer = setTimeout(async () => {
      try {
        await savePortfolioConfig(
          currentUser.uid,
          config,
          projects,
          certificates,
          timeline,
          icons
        );
        setSyncStatus('synced');
      } catch (err) {
        console.error('Autosave failed:', err);
        setSyncStatus('error');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [config, projects, certificates, timeline, icons, currentUser, isDataLoaded, isPublicView]);

  const fontClass = config.systemFont ? `system-font-${config.systemFont}` : 'system-font-apple';

  // Set global HTML scale for font accessibility scaling
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size-scale', `${config.fontSizeScale || 1.0}`);
  }, [config.fontSizeScale]);

  const [currentView, setCurrentView] = useState<'portfolio' | 'generator'>('portfolio');
  const { activeApp, openApps, minimizedApps, zIndices, handleOpenApp: _handleOpenApp, handleCloseApp: _handleCloseApp, handleMinimizeApp, handleFocusApp, handleSystemReset: _handleSystemReset } = useWindowContext();
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [isKreatorMode, setIsKreatorMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { saveToCloud, saveStatus, publicSlug } = usePortfolioSave();
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 4000);
  };
  const handleSaveToCloud = async () => {
    const result = await saveToCloud(config, projects, certificates, timeline, icons);
    if (result.success) {
      showToast('Konfiguracja zapisana w chmurze!');
    }
  };

  // Listen for global Ctrl+K / Cmd+K shortcut to open Spotlight
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSpotlight(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Format GitHub relative date-time in Polish
  const formatRelativeTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Przed chwilĂ„â€¦';
      if (diffMins < 60) {
        if (diffMins === 1) return '1 minutĂ„â„˘ temu';
        if (diffMins % 10 >= 2 && diffMins % 10 <= 4 && (diffMins % 100 < 10 || diffMins % 100 >= 20)) {
          return `${diffMins} minuty temu`;
        }
        return `${diffMins} minut temu`;
      }
      if (diffHours < 24) {
        if (diffHours === 1) return '1 godzinĂ„â„˘ temu';
        if (diffHours % 10 >= 2 && diffHours % 10 <= 4 && (diffHours % 100 < 10 || diffHours % 100 >= 20)) {
          return `${diffHours} godziny temu`;
        }
        return `${diffHours} godzin temu`;
      }
      if (diffDays === 1) return 'Wczoraj';
      if (diffDays < 7) {
        return `${diffDays} dni temu`;
      }
      
      return date.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Niedawno';
    }
  };

  // Fetch real GitHub projects live
  useEffect(() => {
    if (!config.githubUsername) {
      setProjects(prev => prev.filter(p => p.type !== 'github'));
      return;
    }
    let isMounted = true;
    const fetchGitHubProjects = async () => {
      const username = config.githubUsername;
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=8`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        if (!Array.isArray(data)) return;
        
        const fetched: any[] = data.map((repo: any) => ({
          id: `github-${repo.id}`,
          title: repo.name,
          description: repo.description || 'Brak opisu w repozytorium GitHub.',
          stars: repo.stargazers_count,
          lastSync: `Ostatni push: ${formatRelativeTime(repo.pushed_at || repo.updated_at)}`,
          tags: repo.language ? [repo.language, ...(repo.topics || [])].slice(0, 3) : (repo.topics || []).slice(0, 3),
          type: 'github',
          link: repo.html_url
        }));

        if (isMounted) {
          setProjects(prev => {
            const manuals = prev.filter(p => p.type !== 'github');
            return [...manuals, ...fetched];
          });
        }
      } catch (err) {
        console.warn('Could not fetch real GitHub repos:', err);
      }
    };

    fetchGitHubProjects();
    return () => {
      isMounted = false;
    };
  }, [config.githubUsername]);

  // Synchronize sounds enabled state with core system
  useEffect(() => {
    if (config.playSounds !== undefined) {
      setSoundsEnabled(config.playSounds);
    }
  }, [config.playSounds]);

  // Play Windows XP Startup on first user click in generator mode
  useEffect(() => {
    if (currentView !== 'generator' || !config.playSounds) return;

    let started = false;
    const playStartupOnFirstClick = () => {
      if (started) return;
      started = true;
      playXpStartup();
      window.removeEventListener('click', playStartupOnFirstClick);
    };

    window.addEventListener('click', playStartupOnFirstClick);
    return () => window.removeEventListener('click', playStartupOnFirstClick);
  }, [currentView, config.playSounds]);

  // Monitor proMode state changes for fun retro sounds
  const [prevProMode, setPrevProMode] = useState<boolean>(config.proMode);
  useEffect(() => {
    if (config.proMode !== prevProMode) {
      if (config.proMode) {
        playXpStartup();
      } else {
        playXpShutdown();
      }
      setPrevProMode(config.proMode);
    }
  }, [config.proMode, prevProMode]);

  // Ref for launching retro pixel sparks
  const triggerSparksRef = useRef<((x: number, y: number, count?: number) => void) | null>(null);

  const getParticleVariant = () => {
    if (config.particles === 'none') return 'none';
    switch(config.themePack || config.accentColor) {
      case 'mono-terminal': return 'matrix-rain';
      case 'amber-retro': return 'dust';
      case 'emerald': return 'matrix-rain';
      case 'orange': return 'dust';
      case 'cyan': return 'snow';
      case 'purple': return 'snow';
      default: return 'none';
    }
  };


  // Expose spark trigger globally on mount
  useEffect(() => {
    (window as any).triggerSparks = (x: number, y: number, count?: number) => {
      if (triggerSparksRef.current) {
        triggerSparksRef.current(x, y, count);
      }
    };
    
    // Global click listener to spawn retro sparks on clicking anything in generator mode
    const handleGlobalClick = (e: MouseEvent) => {
      if (currentView === 'generator' && (window as any).triggerSparks) {
        (window as any).triggerSparks(e.clientX, e.clientY, 8); // subtle elegant count
      }
    };
    
    window.addEventListener('click', handleGlobalClick);
    
    return () => {
      delete (window as any).triggerSparks;
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [currentView]);

  const handleOpenApp = (appId: ActiveAppId | string) => {
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
      const dockBtn = document.getElementById(`dock-btn-${appId}`);
      if (dockBtn && (window as any).triggerSparks) {
        const rect = dockBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        (window as any).triggerSparks(centerX, centerY, 25);
      }
    }, 450);
  };


  const handleSystemReset = () => {
    if (confirm('Czy na pewno chcesz zresetować system? Spowoduje to przywrócenie domyślnych danych demonstracyjnych.')) {
      setConfig(defaultOSConfig);
      setProjects(initialProjects);
      setCertificates(initialCertificates);
      setTimeline(initialTimeline);
      setSprints(initialSprints);
      setIcons(initialDesktopIcons);
      _handleSystemReset();
    }
  };

  // Get active wallpaper object
  const activeWallpaper = wallpaperOptions.find(w => w.id === config.wallpaper) || wallpaperOptions[0];

  const getAppTitle = (appId: string, defaultTitle: string) => {
    const category = config.portfolioCategory || 'general';
    switch (appId) {
      case 'bio':
        if (category === 'tech') return 'O mnie - Kwalifikacje i Stos';
        if (category === 'craft') return 'O firmie - Moja Specjalizacja';
        if (category === 'agriculture') return 'O Gospodarstwie - Nasza Tradycja';
        if (category === 'gardening') return 'O Ogrodnictwie - Pasja do Zieleni';
        if (category === 'creative') return 'O mnie - Manifest Artystyczny';
        if (category === 'business') return 'O mnie - DoÄąâ€şwiadczenie Biznesowe';
        return 'O mnie - WizytÄ‚Ĺ‚wka Osobista';
      case 'projects':
        if (category === 'tech') return 'Moje Projekty & Integracja GitHub';
        if (category === 'craft') return 'Galeria Prac - Zrealizowane Zlecenia';
        if (category === 'agriculture') return 'Nasze Plony - Naturalna Oferta';
        if (category === 'gardening') return 'Realizacje OgrodÄ‚Ĺ‚w - Moje Portfolio';
        if (category === 'creative') return 'Moje Portfolio - Wybrane Prace';
        if (category === 'business') return 'Case Studies - Projekty i Efekty';
        return 'Moje Projekty i Realizacje';
      case 'certificates':
        if (category === 'tech') return 'Zweryfikowane Certyfikaty IT';
        if (category === 'craft') return 'Uprawnienia i Kwalifikacje Zawodowe';
        if (category === 'agriculture') return 'Certyfikaty JakoÄąâ€şci i Eko-atesty';
        if (category === 'gardening') return 'Uprawnienia i Certyfikaty Ogrodnicze';
        if (category === 'creative') return 'WyrÄ‚Ĺ‚ÄąÄ˝nienia, Dyplomy i Nagrody';
        if (category === 'business') return 'Certyfikaty i Akredytacje Biznesowe';
        return 'Moje Certyfikaty i OsiĂ„â€¦gniĂ„â„˘cia';
      case 'lab':
        if (category === 'tech') return 'Aktualne Sprinty & Lab deweloperski';
        if (category === 'craft') return 'Zlecenia w toku & Plany rozwojowe';
        if (category === 'agriculture') return 'Terminarz zbiorÄ‚Ĺ‚w i plany rozwoju';
        if (category === 'gardening') return 'Harmonogram Prac & RoÄąâ€şliny w Hodowli';
        if (category === 'creative') return 'Prace w toku & Inspiracje';
        if (category === 'business') return 'Metodologia pracy & Cele strategiczne';
        return 'Aktualne i Planowane Zadania';
      default:
        return defaultTitle;
    }
  };

  // Loading screen during initial Firebase auth check
  if (authLoading) {
    return (
      <div 
        className="w-screen h-screen bg-[#050507] text-[#e0e0e0] flex flex-col items-center justify-center p-6 space-y-4 font-mono"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.08) 0%, transparent 60%), #050507' }}
      >
        <Loader2 className="animate-spin text-amber-500" size={36} />
        <span className="uppercase text-xs tracking-widest font-bold text-amber-500">INICJALIZACJA SYSTEMU OPERACYJNEGO PORTFOLIOOS...</span>
      </div>
    );
  }

  // Pre-desktop authorization screen for visitors/creators
  if (!isPublicView && !currentUser && !guestMode) {
    return (
      <AuthScreen 
        onContinueGuest={() => {
          setGuestMode(true);
          localStorage.setItem('portfolio_os_guest_mode', 'true');
        }}
      />
    );
  }

  // Zero-state onboarding wizard screen
  if (!config.isInitialized) {
    return (
      <div 
        className={`relative w-screen h-screen overflow-y-auto bg-[#050507] text-[#e0e0e0] flex flex-col items-center justify-center p-4 md:p-8 ${fontClass}`}
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(124, 77, 255, 0.12) 0%, transparent 60%), #050507' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        {config.pixelTheme && <div className="crt-overlay" />}
        
        <div className="w-full max-w-2xl bg-slate-950/40 border border-white/5 backdrop-blur-md rounded-3xl shadow-xl p-6 md:p-8 space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2">
              <Sparkles size={26} className="animate-pulse" />
            </div>
            <h1 className="text-lg md:text-xl font-sans font-bold text-white tracking-tight">
              Instalator Systemu Portfolio
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Witaj w asystencie konfiguracji! Odpowiedz na kilka pytaÄąâ€ž, a Instalator Systemu automatycznie skonfiguruje spersonalizowane Äąâ€şrodowisko pracy i przygotuje TwÄ‚Ĺ‚j pulpit.
            </p>
          </div>

          <Suspense fallback={<WindowSkeleton />}>
            <Wizard
              config={config}
              setConfig={setConfig}
              projects={projects}
              setProjects={setProjects}
              certificates={certificates}
              setCertificates={setCertificates}
              timeline={timeline}
              setTimeline={setTimeline}
              icons={icons}
              setIcons={setIcons}
              onClose={() => {
                setConfig(prev => ({ ...prev, isInitialized: true }));
                if (config.playSounds) {
                  playXpStartup();
                }
              }}
              openApp={handleOpenApp}
              isZeroState={true}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  if (currentView === 'portfolio' && config.portfolioStyle === 'retro') {
    return (
      <PortfolioView
        config={config}
        projects={projects}
        certificates={certificates}
        timeline={timeline}
        onLaunchGenerator={() => {
          if (config.playSounds) {
            playXpStartup();
          }
          setCurrentView('generator');
        }}
        syncStatus={syncStatus}
        onRetrySync={handleSaveToCloud}
        guestMode={!currentUser && guestMode}
        onLoginClick={() => {
          setGuestMode(false);
          localStorage.setItem('portfolio_os_guest_mode', 'false');
        }}
      />
    );
  }

  return (
    <div 
      className={`cv-builder-scope relative w-screen h-screen overflow-hidden text-[#e0e0e0] transition-all duration-500 ease-in-out ${fontClass} ${config.pixelTheme ? 'pixel-theme' : ''}`}
      style={{ background: activeWallpaper.value }}
    >
      {/* CRT Scanline Nostalgic effect */}
      {config.pixelTheme && <div className="crt-overlay" />}

      {/* Immersive Theme Ambient Glow Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-blue-600/3 blur-[120px]"></div>
        <div className="absolute -bottom-[150px] -left-[150px] w-[500px] h-[500px] rounded-full bg-purple-600/3 blur-[100px]"></div>
      </div>

      {/* Decorative cyber grid lines layering overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Utility System Menu Bar */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-24 bg-black/25 border-b border-white/10 backdrop-blur-xl z-[999] px-6 md:px-8 items-center justify-between select-none shadow-[0_4px_30px_rgba(0,0,0,0.35)]">
        
        {/* Brand logo & Account mode indicator */}
        <div className="flex items-center space-x-3 md:space-x-5">
          {isPublicView ? (
            <div className="flex items-center gap-1.5 px-3 md:px-4.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-sans text-xs md:text-sm font-semibold tracking-wide cursor-default shadow-sm">
              <Lucide.Globe size={15} className="text-indigo-400 animate-pulse" /> <span className="hidden sm:inline">Wersja Publiczna</span><span className="inline sm:hidden">Publiczny</span>
            </div>
          ) : config.viewerMode ? (
            <div className="flex items-center gap-1.5 px-3 md:px-4.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-sans text-xs md:text-sm font-semibold tracking-wide cursor-default shadow-sm">
              <Lucide.Eye size={15} className="text-emerald-400 animate-pulse" /> <span className="hidden sm:inline">Tryb widza</span><span className="inline sm:hidden">Widz</span>
            </div>
          ) : currentView === 'generator' ? (
            <button
              onClick={() => {
                if (config.playSounds) {
                  playXpShutdown();
                }
                setCurrentView('portfolio');
                setIsKreatorMode(false);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-sans text-xs md:text-sm font-semibold tracking-wide transition-all uppercase duration-200 cursor-pointer hover:border-purple-500/50"
              title="Wróć do głównego portfolio"
            >
              <ArrowLeft size={15} className="text-purple-400" /> <span className="hidden sm:inline">Podgląd Portfolio</span><span className="inline sm:hidden">Portfolio</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (config.playSounds) {
                  playXpStartup();
                }
                setCurrentView('generator');
                setIsKreatorMode(true);
                handleOpenApp('wizard'); // Open generator wizard automatically!
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/35 border border-yellow-500/30 text-yellow-400 font-sans text-xs md:text-sm font-bold tracking-wider transition-all uppercase duration-200 cursor-pointer animate-pulse hover:border-yellow-400"
              title="Zarządzaj konfiguracją i edytuj system"
            >
              <Sparkles size={15} className="text-yellow-400" /> <span className="hidden sm:inline">Zarządzanie / Edycja OS</span><span className="inline sm:hidden">System</span>
            </button>
          )}
          
          <span className="text-white/10 hidden md:inline">|</span>

          <div className="hidden md:flex items-center space-x-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500/60 border border-red-500/10"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/60 border border-yellow-500/10"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-green-500/60 border border-green-500/10"></div>
          </div>
          
          <span className="text-white/10 hidden md:inline">|</span>

          <div className="hidden md:flex items-center space-x-3.5 cursor-default">
            <Monitor size={18} className="text-[#e0e0e0]/70" />
            <span className="font-sans font-extrabold tracking-widest text-xs uppercase opacity-90 text-white">
              PortfolioOS v1.0.4
            </span>
            <span className="text-[10px] tracking-wider bg-white/5 text-white/55 px-2.5 py-0.5 rounded-full border border-white/15 font-bold uppercase">
              {config.proMode ? 'PRO BUILD' : 'DEMO BUILD'}
            </span>
          </div>
        </div>

        {/* Dynamic clocks and greetings */}
        <div className="flex items-center space-x-2 text-xs md:text-sm font-sans font-medium text-white/60 tracking-wider uppercase">
          <Clock size={15} className="text-white/40 hidden sm:inline animate-pulse" />
          <SystemGreeting className="font-light hidden sm:inline" />
          <SystemClock className="text-[#e0e0e0] font-bold text-sm tracking-widest bg-white/5 sm:bg-transparent px-3 py-1 sm:p-0 rounded-full border border-white/10 sm:border-transparent" />
        </div>

        {/* Action quick links */}
        <div className="flex items-center space-x-4 text-[10px] uppercase tracking-wider font-medium text-white/45 relative">
          <div className="hidden lg:flex items-center gap-1.5 border-r border-white/5 pr-4 mr-1">
            {ALL_SOCIALS.filter(item => activeSocials.includes(item.id)).map((item) => {
              const IconComp = (Lucide as any)[item.icon] || Lucide.File;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.label}
                  className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center bg-white/5 border border-white/5 hover:border-white/20 shadow-sm ${item.color}`}
                >
                  <IconComp size={11} />
                </a>
              );
            })}
            
            {/* Plus Button */}
            <button
              onClick={() => {
                triggerHaptic('light');
                setShowSocialsDropdown(prev => !prev);
              }}
              className="p-1.5 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center bg-white/5 border border-white/5 hover:border-white/20 shadow-sm text-white/50 hover:text-white/80 cursor-pointer"
              title="Wybierz portale społecznościowe"
            >
              <Lucide.Plus size={11} />
            </button>

            {/* Dropdown for selecting social portals */}
            {showSocialsDropdown && (
              <div className="absolute top-8 left-0 z-[110] bg-slate-950/95 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 shadow-2xl w-48 max-h-64 overflow-y-auto space-y-1.5 custom-scrollbar text-white animate-scaleIn">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider px-1 pb-1 border-b border-white/5 mb-1 flex justify-between items-center">
                  <span>Dodaj do paska</span>
                  <button 
                    onClick={() => setShowSocialsDropdown(false)}
                    className="text-slate-500 hover:text-white text-[10px] lowercase cursor-pointer"
                  >
                    zamknij
                  </button>
                </div>
                {ALL_SOCIALS.map((item) => {
                  const IconComp = (Lucide as any)[item.icon] || Lucide.File;
                  const isActive = activeSocials.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        triggerHaptic('light');
                        if (isActive) {
                          setActiveSocials(prev => prev.filter(id => id !== item.id));
                        } else {
                          setActiveSocials(prev => [...prev, item.id]);
                        }
                      }}
                      className="w-full flex items-center justify-between p-1.5 hover:bg-white/5 rounded-lg text-left transition-colors cursor-pointer text-xs group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`${item.color} shrink-0`}><IconComp size={12} /></span>
                        <span className="font-semibold text-slate-200 truncate">{item.label}</span>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                        isActive ? 'bg-cyan-500 border-cyan-500 text-white font-bold' : 'border-slate-600 bg-transparent'
                      }`}>
                        {isActive && <Check size={10} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowSpotlight(true)}
            className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-cyan-400 hover:text-cyan-300 transition-all uppercase tracking-widest cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1.5 rounded-lg border border-cyan-500/20"
            title="Szukaj aplikacji (Ctrl+K)"
          >
            <Search size={11} className="text-cyan-400 animate-pulse" /> Szukaj <span className="text-[9px] font-mono opacity-60 bg-black/40 px-1 py-0.2 rounded border border-cyan-500/10">Ctrl+K</span>
          </button>
          
          {currentUser && <span className="text-white/10">|</span>}
          
          {currentUser && (
            <div className="flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-widest min-h-[16px]">
              <AnimatePresence mode="wait">
                {syncStatus === 'saving' && (
                  <motion.span 
                    key="saving"
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="text-yellow-400 flex items-center gap-1"
                  >
                    <Loader2 size={13} className="animate-spin" /> Zapisywanie...
                  </motion.span>
                )}
                {syncStatus === 'synced' && (
                  <motion.span 
                    key="synced"
                    initial={{ opacity: 0, y: -5, scale: 0.8 }} 
                    animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } }} 
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-emerald-400 flex items-center gap-1" 
                    title="Automatycznie zsynchronizowano z chmurą"
                  >
                    <Check size={13} className="drop-shadow-[0_0_2px_rgba(16,185,129,0.5)]" /> Zsynchronizowano
                  </motion.span>
                )}
                {syncStatus === 'error' && (
                  <motion.button 
                    key="error"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleSaveToCloud}
                    className="text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Lucide.CloudOff size={13} /> Błąd synchronizacji
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      {/* Interactive Desktop Grid Area */}
      <main className="relative w-full h-full">
        {/* Mobile Spotlight Search Bar Button */}
        <div className="md:hidden absolute top-4 left-0 right-0 px-4 w-full z-[100]">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowSpotlight(true); }}
            className="w-full flex items-center gap-3 px-4 py-3 min-h-[48px] bg-black/40 border border-white/20 rounded-2xl backdrop-blur-md shadow-lg text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <Search size={20} className="text-slate-400" />
            <span className="font-sans text-sm tracking-wide">Szukaj w systemie...</span>
          </button>
        </div>

        {isPublicView ? (
          <BentoHub 
            projects={projects}
            config={config}
            openApp={handleOpenApp}
          />
        ) : (
          <Desktop
            icons={icons}
            setIcons={setIcons}
            openApp={handleOpenApp}
            config={config}
            isKreatorMode={isKreatorMode}
            setIsKreatorMode={setIsKreatorMode}
            isPublicView={isPublicView}
          />
        )}

        {/* Floating Interactive Glass Windows */}
        
        {/* BIO / ABOUT ME APPLICATION */}
        <AnimatePresence>
          {openApps['bio'] && (
            <WindowFrame
              id="bio"
              isMinimized={minimizedApps['bio'] || false}
              onMinimize={() => handleMinimizeApp('bio')}
              title={getAppTitle('bio', 'O mnie - Kwalifikacje i OsiĂ„â€¦gniĂ„â„˘cia')}
              isOpen={true}
              onClose={() => handleCloseApp('bio')}
              onFocus={() => handleFocusApp('bio')}
              zIndex={zIndices['bio'] || 10}
              config={config}
            >
              <Suspense fallback={<WindowSkeleton />}><AppBio
                config={config}
                setConfig={setConfig}
                timeline={timeline}
                setTimeline={setTimeline}
              /></Suspense>
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* PROJECTS APPLICATION */}
        <AnimatePresence>
          {openApps['projects'] && (
            <WindowFrame
              id="projects"
              isMinimized={minimizedApps['projects'] || false}
              onMinimize={() => handleMinimizeApp('projects')}
              title={getAppTitle('projects', 'Moje Projekty & Integracja GitHub')}
              isOpen={true}
              onClose={() => handleCloseApp('projects')}
              onFocus={() => handleFocusApp('projects')}
              zIndex={zIndices['projects'] || 10}
              config={config}
            >
              <Suspense fallback={<WindowSkeleton />}><AppProjects
                projects={projects}
                setProjects={setProjects}
                config={config}
              /></Suspense>
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* DASHBOARD APPLICATION */}
        <AnimatePresence>
          {openApps['dashboard'] && (
            <WindowFrame
              id="dashboard"
              isMinimized={minimizedApps['dashboard'] || false}
              onMinimize={() => handleMinimizeApp('dashboard')}
              title={getAppTitle('dashboard', 'MĂłj Ekosystem')}
              isOpen={true}
              onClose={() => handleCloseApp('dashboard')}
              onFocus={() => handleFocusApp('dashboard')}
              zIndex={zIndices['dashboard'] || 10}
              config={config}
            >
              <Suspense fallback={<WindowSkeleton />}><AppDashboard config={config} /></Suspense>
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* TERMINAL APPLICATION */}
        <AnimatePresence>
          {openApps['terminal'] && (
            <WindowFrame
              id="terminal"
              isMinimized={minimizedApps['terminal'] || false}
              onMinimize={() => handleMinimizeApp('terminal')}
              title="Terminal - bash"
              isOpen={true}
              onClose={() => handleCloseApp('terminal')}
              onFocus={() => handleFocusApp('terminal')}
              zIndex={zIndices['terminal'] || 10}
              config={config}
            >
              <Suspense fallback={<WindowSkeleton />}><AppTerminal config={config} /></Suspense>
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* CERTIFICATES APPLICATION */}
        <AnimatePresence>
          {openApps['certificates'] && (
            <WindowFrame
              id="certificates"
              isMinimized={minimizedApps['certificates'] || false}
              onMinimize={() => handleMinimizeApp('certificates')}
              title={getAppTitle('certificates', 'Zweryfikowane Certyfikaty')}
              isOpen={true}
              onClose={() => handleCloseApp('certificates')}
              onFocus={() => handleFocusApp('certificates')}
              zIndex={zIndices['certificates'] || 10}
              config={config}
            >
              <Suspense fallback={<WindowSkeleton />}><AppCertificates
                certificates={certificates}
                setCertificates={setCertificates}
              /></Suspense>
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* SETTINGS / SYSTEM CONFIG APPLICATION */}
        <AnimatePresence>
          {openApps['settings'] && (
            <WindowFrame
              id="settings"
              isMinimized={minimizedApps['settings'] || false}
              onMinimize={() => handleMinimizeApp('settings')}
              title="Ustawienia systemowe & Personalizacja"
              isOpen={true}
              onClose={() => handleCloseApp('settings')}
              onFocus={() => handleFocusApp('settings')}
              zIndex={zIndices['settings'] || 10}
              config={config}
            >
              <Suspense fallback={<WindowSkeleton />}><AppSettings
                config={config}
                onSave={setConfig}
                icons={icons}
                setIcons={setIcons}
                projects={projects}
                setProjects={setProjects}
                certificates={certificates}
                setCertificates={setCertificates}
                timeline={timeline}
                setTimeline={setTimeline}
              /></Suspense>
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* CONTACT FORM APPLICATION */}
        <AnimatePresence>
          {openApps['contact'] && (
            <WindowFrame
              id="contact"
              isMinimized={minimizedApps['contact'] || false}
              onMinimize={() => handleMinimizeApp('contact')}
              title="Napisz do mnie - Formularz kontaktowy"
              isOpen={true}
              onClose={() => handleCloseApp('contact')}
              onFocus={() => handleFocusApp('contact')}
              zIndex={zIndices['contact'] || 10}
              config={config}
            >
              <Suspense fallback={<WindowSkeleton />}><AppContact
                config={config}
                setConfig={setConfig}
              /></Suspense>
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* ONBOARDING GENERATOR WIZARD */}
        <AnimatePresence>
          {openApps['wizard'] && (
            <WindowFrame
              id="wizard"
              isMinimized={minimizedApps['wizard'] || false}
              onMinimize={() => handleMinimizeApp('wizard')}
              title="Instalator Systemu Portfolio"
              isOpen={true}
              onClose={() => handleCloseApp('wizard')}
              onFocus={() => handleFocusApp('wizard')}
              zIndex={zIndices['wizard'] || 10}
              config={config}
            >
              <Suspense fallback={<WindowSkeleton />}>
                <Wizard
                  config={config}
                  setConfig={setConfig}
                  projects={projects}
                  setProjects={setProjects}
                  certificates={certificates}
                  setCertificates={setCertificates}
                  timeline={timeline}
                  setTimeline={setTimeline}
                  icons={icons}
                  setIcons={setIcons}
                  onClose={() => handleCloseApp('wizard')}
                  openApp={handleOpenApp}
                />
              </Suspense>
            </WindowFrame>
          )}
        </AnimatePresence>


      </main>

      {/* Floating docked system launch bar */}
      <Dock
        activeApp={activeApp}
        openApp={handleOpenApp}
        openAppsList={openApps}
        minimizedApps={minimizedApps}
        config={config}
        icons={icons}
      />

      {/* Terraria-like retro pixel sparks rendering canvas */}
      {config.particles !== 'none' && getParticleVariant() !== 'none' && (
        <ParticleOverlay triggerRef={triggerSparksRef} variant={getParticleVariant()} />
      )}

      {/* Free watermark and helper banner at desktop base */}
      {!config.proMode && (
        <div className="hidden md:block fixed bottom-24 left-1/2 -translate-x-1/2 pointer-events-none select-none text-center bg-slate-950/45 px-3 py-1.5 rounded-full border border-slate-800/40 backdrop-blur-sm">
          <p className="text-[10px] text-slate-400 font-sans tracking-wide flex items-center gap-1.5">
            <HelpCircle size={11} className="text-amber-400" />
            Zasilane przez <strong>PortfolioOS</strong> Ă˘â‚¬Ë Kliknij dwukrotnie w ikonĂ„â„˘ <strong>Generatora</strong> lub ikonĂ„â„˘ w doku aby stworzyĂ„â€ˇ wÄąâ€šasnĂ„â€¦ stronĂ„â„˘.
          </p>
        </div>
      )}

      {/* Global Spotlight-style search overlay */}
      <AnimatePresence>
        {showSpotlight && (
          <SpotlightSearch
            isOpen={showSpotlight}
            onClose={() => setShowSpotlight(false)}
            onLaunchApp={handleOpenApp}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
