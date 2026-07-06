/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { ParticleOverlay } from './components/ParticleOverlay';
import { Desktop } from './components/Desktop';
import { WindowFrame } from './components/WindowFrame';
import { AppBio } from './components/AppBio';
import { AppProjects } from './components/AppProjects';
import { AppLab } from './components/AppLab';
import { AppCertificates } from './components/AppCertificates';
import { AppSettings } from './components/AppSettings';
import { AppContact } from './components/AppContact';
import { AppGDrive } from './components/AppGDrive';
import { AppCalendar } from './components/AppCalendar';
import { AppPlanned } from './components/AppPlanned';
import { PortfolioView } from './components/PortfolioView';
import { Wizard } from './components/Wizard';
import { Dock } from './components/Dock';
import { SpotlightSearch } from './components/SpotlightSearch';
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
import { playXpStartup, playXpShutdown, playXpError, playXpBalloon, playXpClick, setSoundsEnabled } from './lib/sounds';

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

  // Set global HTML scale for font accessibility scaling
  useEffect(() => {
    const scale = config.fontSizeScale || 1.0;
    document.documentElement.style.setProperty('--font-size-scale', `${scale}`);
  }, [config.fontSizeScale]);

  const [currentView, setCurrentView] = useState<'portfolio' | 'generator'>('portfolio');
  const [activeApp, setActiveApp] = useState<ActiveAppId>(null);
  const [openApps, setOpenApps] = useState<{ [key: string]: boolean }>({});
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [isKreatorMode, setIsKreatorMode] = useState(false);
  
  // Real-time dynamic clock state
  const [timeStr, setTimeStr] = useState('');
  const [greeting, setGreeting] = useState('');

  // Customizable dataset states
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

  // Depth layering manager for window focus
  const [zIndices, setZIndices] = useState<{ [key: string]: number }>({
    bio: 10,
    projects: 10,
    lab: 10,
    certificates: 10,
    settings: 10,
    contact: 10,
    wizard: 10,
    gdrive: 10,
    calendar: 10,
    planned: 10
  });

  // Tick the system clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Formatting clock (e.g. 14:32:05)
      const formattedTime = now.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      // Formatting date (e.g. Pon., 5 Lipca)
      const formattedDate = now.toLocaleDateString('pl-PL', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });

      setTimeStr(`${formattedDate} • ${formattedTime}`);

      // Set greeting based on active system hour
      const hour = now.getHours();
      if (hour >= 5 && hour < 12) setGreeting('Dzień dobry');
      else if (hour >= 12 && hour < 18) setGreeting('Witaj na pulpicie');
      else setGreeting('Dobry wieczór');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

      if (diffMins < 1) return 'Przed chwilą';
      if (diffMins < 60) {
        if (diffMins === 1) return '1 minutę temu';
        if (diffMins % 10 >= 2 && diffMins % 10 <= 4 && (diffMins % 100 < 10 || diffMins % 100 >= 20)) {
          return `${diffMins} minuty temu`;
        }
        return `${diffMins} minut temu`;
      }
      if (diffHours < 24) {
        if (diffHours === 1) return '1 godzinę temu';
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
    let isMounted = true;
    const fetchGitHubProjects = async () => {
      const username = config.githubUsername || 'krymszuch-stack';
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
        console.warn('Could not fetch real GitHub repos, using fallbacks:', err);
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

  // System actions
  const handleOpenApp = (appId: 'bio' | 'projects' | 'lab' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'gdrive' | 'calendar' | 'planned') => {
    setOpenApps(prev => ({ ...prev, [appId]: true }));
    handleFocusApp(appId);
    if (config.playSounds) {
      playXpBalloon();
    }
  };

  const handleCloseApp = (appId: string) => {
    setOpenApps(prev => ({ ...prev, [appId]: false }));
    if (activeApp === appId) {
      setActiveApp(null);
    }
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

  const handleFocusApp = (appId: string) => {
    setZIndices(prev => {
      const values = Object.values(prev) as number[];
      const maxZ = Math.max(...values, 10);
      return {
        ...prev,
        [appId]: maxZ + 1
      };
    });
    setActiveApp(appId as any);
  };

  const handleSystemReset = () => {
    if (confirm('Czy na pewno chcesz zresetować system? Spowoduje to przywrócenie domyślnych danych demonstracyjnych.')) {
      setConfig(defaultOSConfig);
      setProjects(initialProjects);
      setCertificates(initialCertificates);
      setTimeline(initialTimeline);
      setSprints(initialSprints);
      setIcons(initialDesktopIcons);
      setOpenApps({});
      setActiveApp(null);
    }
  };

  // Get active wallpaper object
  const activeWallpaper = wallpaperOptions.find(w => w.id === config.wallpaper) || wallpaperOptions[0];

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
      />
    );
  }

  return (
    <div 
      className={`cv-builder-scope relative w-screen h-screen overflow-hidden text-[#e0e0e0] transition-all duration-500 ease-in-out font-sans ${config.pixelTheme ? 'pixel-theme' : ''}`}
      style={{ background: activeWallpaper.value }}
    >
      {/* CRT Scanline Nostalgic effect */}
      {config.pixelTheme && <div className="crt-overlay" />}

      {/* Immersive Theme Ambient Glow Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute -bottom-[150px] -left-[150px] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px]"></div>
      </div>

      {/* Decorative cyber grid lines layering overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Utility System Menu Bar */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-black/20 border-b border-white/5 backdrop-blur-md z-[999] px-6 flex items-center justify-between select-none">
        
        {/* Brand logo & Account mode indicator */}
        <div className="flex items-center space-x-4">
          {currentView === 'generator' ? (
            <button
              onClick={() => {
                if (config.playSounds) {
                  playXpShutdown();
                }
                setCurrentView('portfolio');
                setIsKreatorMode(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-sans text-xs font-semibold tracking-wide transition-all uppercase duration-200 cursor-pointer mr-2 hover:border-purple-500/50"
              title="Wróć do głównego portfolio"
            >
              <ArrowLeft size={12} className="text-purple-400" /> Podgląd Portfolio
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
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/35 border border-yellow-500/30 text-yellow-400 font-sans text-xs font-bold tracking-wider transition-all uppercase duration-200 cursor-pointer mr-2 animate-pulse hover:border-yellow-400"
              title="Uruchom kreator i edytuj swoje portfolio"
            >
              <Sparkles size={12} className="text-yellow-400" /> Zarządzanie / Edycja OS
            </button>
          )}
          <span className="text-white/10">|</span>

          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
          </div>
          
          <div className="flex items-center space-x-2.5 cursor-default">
            <Monitor size={14} className="text-[#e0e0e0]/60" />
            <span className="font-sans font-semibold tracking-widest text-xs uppercase opacity-80 text-white">
              PortfolioOS v1.0.4
            </span>
            <span className="text-[9px] tracking-wider bg-white/5 text-white/50 px-2 py-0.5 rounded-full border border-white/10 font-bold uppercase">
              {config.proMode ? 'PRO BUILD' : 'DEMO BUILD'}
            </span>
          </div>
        </div>

        {/* Dynamic dynamic clocks and greetings */}
        <div className="flex items-center space-x-2 text-[11px] font-sans font-medium text-white/60 tracking-wider uppercase">
          <Clock size={12} className="text-white/40" />
          <span className="font-light">{greeting}, gość •</span>
          <span className="text-[#e0e0e0] font-semibold">{timeStr}</span>
        </div>

        {/* Action quick links */}
        <div className="flex items-center space-x-4 text-[10px] uppercase tracking-wider font-medium text-white/45">
          <div className="hidden lg:flex items-center gap-1.5 border-r border-white/5 pr-4 mr-1">
            {[
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
            ].map((item) => {
              const IconComp = (Lucide as any)[item.icon] || Lucide.File;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.label}
                  className={`p-1 rounded-full transition-all duration-200 hover:scale-115 flex items-center justify-center bg-white/5 border border-white/5 hover:border-white/20 shadow-sm ${item.color}`}
                >
                  <IconComp size={11} />
                </a>
              );
            })}
          </div>

          <button
            onClick={() => setShowSpotlight(true)}
            className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-cyan-400 hover:text-cyan-300 transition-all uppercase tracking-widest cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1.5 rounded-lg border border-cyan-500/20"
            title="Szukaj aplikacji (Ctrl+K)"
          >
            <Search size={11} className="text-cyan-400 animate-pulse" /> Szukaj <span className="text-[9px] font-mono opacity-60 bg-black/40 px-1 py-0.2 rounded border border-cyan-500/10">Ctrl+K</span>
          </button>

          <span className="text-white/10">|</span>
          
          <button
            id="btn-quick-wizard"
            onClick={() => {
              handleOpenApp('wizard');
              setIsKreatorMode(true);
            }}
            className="flex items-center gap-1.5 text-[11px] font-sans font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest cursor-pointer"
          >
            <Sparkles size={11} /> Kreator
          </button>
          
          <span className="text-white/10">|</span>
          
          <button
            id="btn-system-reset"
            onClick={handleSystemReset}
            className="flex items-center gap-1.5 text-[11px] font-sans text-white/40 hover:text-rose-400 transition-colors uppercase tracking-widest cursor-pointer"
            title="Reset danych demonstracyjnych"
          >
            <RefreshCw size={11} /> Reset
          </button>
        </div>
      </header>

      {/* Interactive Desktop Grid Area */}
      <main className="relative w-full h-full">
        <Desktop
          icons={icons}
          setIcons={setIcons}
          openApp={handleOpenApp}
          config={config}
          isKreatorMode={isKreatorMode}
          setIsKreatorMode={setIsKreatorMode}
        />

        {/* Floating Interactive Glass Windows */}
        
        {/* BIO / ABOUT ME APPLICATION */}
        <AnimatePresence>
          {openApps['bio'] && (
            <WindowFrame
              id="bio"
              title="O mnie - Kwalifikacje i Osiągnięcia"
              isOpen={true}
              onClose={() => handleCloseApp('bio')}
              onFocus={() => handleFocusApp('bio')}
              zIndex={zIndices['bio'] || 10}
              config={config}
            >
              <AppBio
                config={config}
                setConfig={setConfig}
                timeline={timeline}
                setTimeline={setTimeline}
              />
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* PROJECTS APPLICATION */}
        <AnimatePresence>
          {openApps['projects'] && (
            <WindowFrame
              id="projects"
              title="Moje Projekty & Integracja GitHub"
              isOpen={true}
              onClose={() => handleCloseApp('projects')}
              onFocus={() => handleFocusApp('projects')}
              zIndex={zIndices['projects'] || 10}
              config={config}
            >
              <AppProjects
                projects={projects}
                setProjects={setProjects}
              />
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* ACTIVE SPRINTS APPLICATION */}
        <AnimatePresence>
          {openApps['lab'] && (
            <WindowFrame
              id="lab"
              title="Aktualne Sprinty & Lab deweloperski"
              isOpen={true}
              onClose={() => handleCloseApp('lab')}
              onFocus={() => handleFocusApp('lab')}
              zIndex={zIndices['lab'] || 10}
              config={config}
            >
              <AppLab
                sprints={sprints}
                setSprints={setSprints}
              />
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* CERTIFICATES APPLICATION */}
        <AnimatePresence>
          {openApps['certificates'] && (
            <WindowFrame
              id="certificates"
              title="Zweryfikowane Certyfikaty"
              isOpen={true}
              onClose={() => handleCloseApp('certificates')}
              onFocus={() => handleFocusApp('certificates')}
              zIndex={zIndices['certificates'] || 10}
              config={config}
            >
              <AppCertificates
                certificates={certificates}
                setCertificates={setCertificates}
              />
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* SETTINGS / SYSTEM CONFIG APPLICATION */}
        <AnimatePresence>
          {openApps['settings'] && (
            <WindowFrame
              id="settings"
              title="Ustawienia systemowe & Personalizacja"
              isOpen={true}
              onClose={() => handleCloseApp('settings')}
              onFocus={() => handleFocusApp('settings')}
              zIndex={zIndices['settings'] || 10}
              config={config}
            >
              <AppSettings
                config={config}
                onSave={setConfig}
              />
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* CONTACT FORM APPLICATION */}
        <AnimatePresence>
          {openApps['contact'] && (
            <WindowFrame
              id="contact"
              title="Napisz do mnie - Formularz kontaktowy"
              isOpen={true}
              onClose={() => handleCloseApp('contact')}
              onFocus={() => handleFocusApp('contact')}
              zIndex={zIndices['contact'] || 10}
              config={config}
            >
              <AppContact />
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* ONBOARDING GENERATOR WIZARD */}
        <AnimatePresence>
          {openApps['wizard'] && (
            <WindowFrame
              id="wizard"
              title="Kreator Portfolio - Wygeneruj Własny Szablon"
              isOpen={true}
              onClose={() => handleCloseApp('wizard')}
              onFocus={() => handleFocusApp('wizard')}
              zIndex={zIndices['wizard'] || 10}
              config={config}
            >
              <Wizard
                config={config}
                setConfig={setConfig}
                onClose={() => handleCloseApp('wizard')}
                openApp={handleOpenApp}
              />
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* GOOGLE DRIVE APPLICATION */}
        <AnimatePresence>
          {openApps['gdrive'] && (
            <WindowFrame
              id="gdrive"
              title="Google Drive - Przeglądarka Plików"
              isOpen={true}
              onClose={() => handleCloseApp('gdrive')}
              onFocus={() => handleFocusApp('gdrive')}
              zIndex={zIndices['gdrive'] || 10}
              config={config}
            >
              <AppGDrive />
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* GOOGLE CALENDAR APPLICATION */}
        <AnimatePresence>
          {openApps['calendar'] && (
            <WindowFrame
              id="calendar"
              title="Kalendarz Google - Agenda & Harmonogram"
              isOpen={true}
              onClose={() => handleCloseApp('calendar')}
              onFocus={() => handleFocusApp('calendar')}
              zIndex={zIndices['calendar'] || 10}
              config={config}
            >
              <AppCalendar />
            </WindowFrame>
          )}
        </AnimatePresence>

        {/* PLANNED PROJECTS APPLICATION */}
        <AnimatePresence>
          {openApps['planned'] && (
            <WindowFrame
              id="planned"
              title="Planowane projekty - Scam Identifier"
              isOpen={true}
              onClose={() => handleCloseApp('planned')}
              onFocus={() => handleFocusApp('planned')}
              zIndex={zIndices['planned'] || 10}
              config={config}
            >
              <AppPlanned />
            </WindowFrame>
          )}
        </AnimatePresence>
      </main>

      {/* Floating docked system launch bar */}
      <Dock
        activeApp={activeApp}
        openApp={handleOpenApp}
        openAppsList={openApps}
        config={config}
      />

      {/* Terraria-like retro pixel sparks rendering canvas */}
      <ParticleOverlay triggerRef={triggerSparksRef} />

      {/* Free watermark and helper banner at desktop base */}
      {!config.proMode && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 pointer-events-none select-none text-center bg-slate-950/45 px-3 py-1.5 rounded-full border border-slate-800/40 backdrop-blur-sm">
          <p className="text-[10px] text-slate-400 font-sans tracking-wide flex items-center gap-1.5">
            <HelpCircle size={11} className="text-amber-400" />
            Zasilane przez <strong>PortfolioOS</strong> • Kliknij dwukrotnie w ikonę <strong>Generatora</strong> lub ikonę w doku aby stworzyć własną stronę.
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
