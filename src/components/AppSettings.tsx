import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OSConfig, DesktopIcon } from '../types';
import { triggerHaptic } from '../lib/haptics';
import { useMsal } from '@azure/msal-react';
import { loginRequest, isMicrosoftConfigured } from '../lib/microsoftAuth';
import { googleSignIn, logout as logoutGoogle } from '../lib/googleAuth';
import { getAuth, onAuthStateChanged, linkWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { checkSlugAvailability } from '../lib/firestoreStore';
import { THEME_ICONS_MAP } from '../lib/themeIcons';

import { SettingsAppearance } from './settings/SettingsAppearance';
import { SettingsSystem } from './settings/SettingsSystem';
import { SettingsIntegrations } from './settings/SettingsIntegrations';
import { Paintbrush, Monitor, Share2, ChevronRight, ArrowLeft } from 'lucide-react';

interface AppSettingsProps {
  config: OSConfig;
  onSave: (newConfig: OSConfig) => void;
  icons?: DesktopIcon[];
  setIcons?: React.Dispatch<React.SetStateAction<DesktopIcon[]>>;
  projects?: any[];
  setProjects?: React.Dispatch<React.SetStateAction<any[]>>;
  certificates?: any[];
  setCertificates?: React.Dispatch<React.SetStateAction<any[]>>;
  timeline?: any[];
  setTimeline?: React.Dispatch<React.SetStateAction<any[]>>;
}

const DEFAULT_APPS_LIST = [
  { appId: 'bio', label: 'O mnie (Bio)', icon: 'đź‘¤', color: 'from-purple-500/30 to-purple-500/10 hover:shadow-purple-500/20 border-purple-500/20' },
  { appId: 'projects', label: 'Moje Projekty', icon: 'đź“', color: 'from-cyan-500/30 to-cyan-500/10 hover:shadow-cyan-500/20 border-cyan-500/20' },
  { appId: 'dashboard', label: 'MĂłj Ekosystem', icon: 'đź“Š', color: 'from-orange-500/30 to-orange-500/10 hover:shadow-orange-500/20 border-orange-500/20' },
  { appId: 'certificates', label: 'Certyfikaty', icon: 'đźŹ†', color: 'from-pink-500/30 to-pink-500/10 hover:shadow-pink-500/20 border-pink-500/20' },
  { appId: 'contact', label: 'Napisz do mnie', icon: 'âś‰ď¸Ź', color: 'from-emerald-500/30 to-emerald-500/10 hover:shadow-emerald-500/20 border-emerald-500/20' },
  { appId: 'wizard', label: 'Generator Portfolio', icon: 'âś¨', color: 'from-amber-500/30 to-amber-500/10 hover:shadow-amber-500/20 border-amber-500/20' },
  { appId: 'terminal', label: 'Terminal OS', icon: 'đź“ź', color: 'from-indigo-500/30 to-indigo-500/10 hover:shadow-indigo-500/20 border-indigo-500/20' }
];

export const AppSettings: React.FC<AppSettingsProps> = ({
  config,
  onSave,
  icons,
  setIcons,
  projects,
  setProjects,
  certificates,
  setCertificates,
  timeline,
  setTimeline
}) => {
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'main' | 'appearance' | 'system' | 'integrations'>('main');
  const [localConfig, setLocalConfig] = useState<OSConfig>({
    ...config,
    systemTheme: config.systemTheme || 'terraria',
    particles: config.particles || 'leaves',
    clockFormat: config.clockFormat || '24h',
    windowStyle: config.windowStyle || 'curved-classic',
    pixelTheme: config.pixelTheme !== false,
    playSounds: config.playSounds !== false,
    portfolioStyle: config.portfolioStyle || 'modern',
    fontSizeScale: config.fontSizeScale || 2.0,
    glassBlur: config.glassBlur || 'medium',
    borderStyle: config.borderStyle || 'thin',
    systemFont: config.systemFont || 'apple',
    customSlug: config.customSlug || ''
  });

  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [slugErrorMsg, setSlugErrorMsg] = useState('');
  
  React.useEffect(() => {
    if (localConfig.customSlug === config.customSlug) {
      setSlugStatus('idle');
      return;
    }
    
    if (!localConfig.customSlug) {
      setSlugStatus('idle');
      return;
    }
    
    const isValid = /^[a-z0-9-]{3,32}$/.test(localConfig.customSlug);
    if (!isValid) {
      setSlugStatus('invalid');
      setSlugErrorMsg('Tylko maĹ‚e litery, cyfry i myĹ›lniki. 3 do 32 znakĂłw.');
      return;
    }
    
    setSlugStatus('checking');
    const timer = setTimeout(async () => {
      const auth = getAuth();
      const currentUserId = auth.currentUser?.uid;
      const isAvailable = await checkSlugAvailability(localConfig.customSlug || '', currentUserId);
      setSlugStatus(isAvailable ? 'available' : 'taken');
      if (!isAvailable) setSlugErrorMsg('Ten adres jest juĹĽ zajÄ™ty!');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [localConfig.customSlug, config.customSlug]);

  const { instance, accounts } = useMsal();
  const [googleUser, setGoogleUser] = useState<{ displayName: string | null; email: string | null } | null>(null);

  React.useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setGoogleUser({
          displayName: user.displayName,
          email: user.email
        });
      } else {
        setGoogleUser(null);
      }
    });
    return () => unsub();
  }, []);

  const handleConnectMicrosoft = async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        const msProvider = new OAuthProvider('microsoft.com');
        msProvider.setCustomParameters({ prompt: 'select_account' });
        try {
          await linkWithPopup(auth.currentUser, msProvider);
        } catch (linkErr: any) {
          console.warn("Firebase Microsoft account linkage notice/error:", linkErr);
        }
      }

      const response = await instance.loginPopup(loginRequest);
      if (response && response.account) {
        setLocalConfig(prev => ({
          ...prev,
          emailProvider: 'microsoft'
        }));
      }
    } catch (err) {
      console.error("Microsoft login failed:", err);
    }
  };

  const handleDisconnectMicrosoft = async () => {
    try {
      const currentAccount = accounts[0] || instance.getAllAccounts()[0];
      if (currentAccount) {
        await instance.logoutPopup({
          account: currentAccount,
          postLogoutRedirectUri: window.location.origin,
        });
      }
      setLocalConfig(prev => ({
        ...prev,
        emailProvider: 'smtp'
      }));
    } catch (err) {
      console.error("Microsoft logout failed:", err);
      setLocalConfig(prev => ({ ...prev, emailProvider: 'smtp' }));
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        const googleProvider = new GoogleAuthProvider();
        googleProvider.addScope('https://www.googleapis.com/auth/drive');
        googleProvider.addScope('https://www.googleapis.com/auth/calendar');
        googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
        try {
          await linkWithPopup(auth.currentUser, googleProvider);
        } catch (linkErr: any) {
          console.warn("Firebase Google account linkage notice/error:", linkErr);
        }
        setGoogleUser({
          displayName: auth.currentUser.displayName,
          email: auth.currentUser.email
        });
        setLocalConfig(prev => ({
          ...prev,
          emailProvider: 'google'
        }));
      } else {
        const response = await googleSignIn();
        if (response) {
          setLocalConfig(prev => ({
            ...prev,
            emailProvider: 'google'
          }));
        }
      }
    } catch (err) {
      console.error("Google sign in failed:", err);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await logoutGoogle();
      setLocalConfig(prev => ({
        ...prev,
        emailProvider: 'smtp'
      }));
    } catch (err) {
      console.error("Google sign out failed:", err);
    }
  };

  const handleSave = () => {
    triggerHaptic('success');
    onSave(localConfig);
    
    if (localConfig.systemTheme !== config.systemTheme && setIcons && icons) {
      const themeId = localConfig.systemTheme || 'terraria';
      const iconPack = THEME_ICONS_MAP[themeId];
      if (iconPack) {
        setIcons(prev => prev.map(icon => {
          if (iconPack[icon.appId]) {
            return { ...icon, icon: iconPack[icon.appId] };
          }
          return icon;
        }));
      }
    }
    
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2500);
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext && localConfig.playSounds) {
        const ctx = new AudioContext();
        const playBeep = (freq: number, delay: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.04, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.15);
        };
        playBeep(440, 0);
        playBeep(880, 0.1);
      }
    } catch (e) { /* noop */ }
  };

  const handleExportBackup = () => {
    try {
      const backupData = {
        config: localConfig,
        projects: projects || [],
        certificates: certificates || [],
        timeline: timeline || [],
        icons: icons || []
      };
      
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.download = `portfolio_os_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Backup export failed:", err);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.config) {
          setLocalConfig(parsed.config);
          onSave(parsed.config);
        }
        if (parsed.projects && setProjects) {
          setProjects(parsed.projects);
        }
        if (parsed.certificates && setCertificates) {
          setCertificates(parsed.certificates);
        }
        if (parsed.timeline && setTimeline) {
          setTimeline(parsed.timeline);
        }
        if (parsed.icons && setIcons) {
          setIcons(parsed.icons);
        }
        alert("Kopia zapasowa zostaĹ‚a przywrĂłcona pomyĹ›lnie!");
      } catch (err) {
        console.error("Restore failed:", err);
        alert("BĹ‚Ä…d przywracania: Niepoprawny format pliku kopii zapasowej.");
      }
    };
    reader.readAsText(file);
  };

  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [parsingLoading, setParsingLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseSuccess, setParseSuccess] = useState<boolean>(false);

  const handleParseCV = async () => {
    setParsingLoading(true);
    setParseError(null);
    setParseSuccess(false);

    try {
      let fileData: string | null = null;
      let mimeType: string | null = null;

      if (cvFile) {
        const filePromise = new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(cvFile);
        });
        const dataUrl = await filePromise;
        const parts = dataUrl.split(',');
        fileData = parts[1];
        mimeType = dataUrl.split(';')[0].split(':')[1];
      }

      if (!cvText.trim() && !fileData) {
        throw new Error("Wklej profil LinkedIn lub zaĹ‚Ä…cz plik CV przed analizÄ….");
      }

      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: cvText,
          fileData,
          mimeType
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'BĹ‚Ä…d komunikacji z kompilatorem.');
      }

      const result = await response.json();

      if (result.bio) {
        const parsedSkills = result.bio.skills || [];
        const fSkills: string[] = [];
        const bSkills: string[] = [];
        const dSkills: string[] = [];
        
        parsedSkills.forEach((s: any) => {
          const name = s.name;
          const nameLower = name.toLowerCase();
          if (nameLower.includes('css') || nameLower.includes('html') || nameLower.includes('react') || nameLower.includes('vue') || nameLower.includes('angular') || nameLower.includes('javascript') || nameLower.includes('typescript') || nameLower.includes('frontend') || nameLower.includes('ui') || nameLower.includes('tailwind')) {
            fSkills.push(name);
          } else if (nameLower.includes('design') || nameLower.includes('figma') || nameLower.includes('photoshop') || nameLower.includes('illustrator') || nameLower.includes('ux') || nameLower.includes('graphics')) {
            dSkills.push(name);
          } else {
            bSkills.push(name);
          }
        });

        const updatedConfig = {
          ...localConfig,
          fullName: result.bio.fullName || localConfig.fullName,
          title: result.bio.title || localConfig.title,
          biography: result.bio.biography || localConfig.biography,
          skills: result.bio.skills || localConfig.skills,
          frontendSkills: fSkills.length > 0 ? fSkills : localConfig.frontendSkills,
          backendSkills: bSkills.length > 0 ? bSkills : localConfig.backendSkills,
          designSkills: dSkills.length > 0 ? dSkills : localConfig.designSkills
        };
        setLocalConfig(updatedConfig);
        onSave(updatedConfig);
      }

      if (result.projects && setProjects) {
        const parsedProjects = result.projects.map((p: any, idx: number) => ({
          id: `proj-ai-${idx}-${Date.now()}`,
          title: p.title || 'Projekt AI',
          description: p.description || '',
          role: p.role || '',
          techStack: p.techStack || [],
          synonyms: p.synonyms || [],
          icon: 'đź“',
          link: p.link || ''
        }));
        setProjects(prev => [...parsedProjects, ...prev]);
      }

      if (result.certificates && setCertificates) {
        const parsedCerts = result.certificates.map((c: any, idx: number) => ({
          id: `cert-ai-${idx}-${Date.now()}`,
          title: c.title || 'Certyfikat',
          issuer: c.issuer || '',
          date: c.date || '',
          url: c.url || ''
        }));
        setCertificates(prev => [...parsedCerts, ...prev]);
      }

      if (result.timeline && setTimeline) {
        const parsedTimeline = result.timeline.map((t: any, idx: number) => ({
          id: `time-ai-${idx}-${Date.now()}`,
          period: t.year || t.period || '2025',
          role: t.role || '',
          company: t.company || '',
          description: t.description || ''
        }));
        setTimeline(prev => [...parsedTimeline, ...prev]);
      }

      setParseSuccess(true);
      setCvText('');
      setCvFile(null);
    } catch (err: any) {
      console.error("[PARSER ERROR]", err);
      setParseError(err.message || 'BĹ‚Ä…d kompilacji CV.');
    } finally {
      setParsingLoading(false);
    }
  };

  const [gitHubSyncStatus, setGitHubSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const handleForceSyncGitHub = async () => {
    if (!projects || !setProjects) return;
    setGitHubSyncStatus('syncing');
    
    try {
      const githubProjects = projects.filter(p => p.type === 'github');
      if (githubProjects.length === 0) {
        setGitHubSyncStatus('success');
        setLastSyncTime(new Date().toLocaleTimeString('pl-PL'));
        return;
      }

      const updatedProjects = [...projects];
      for (let i = 0; i < updatedProjects.length; i++) {
        const p = updatedProjects[i];
        if (p.type === 'github' && p.link) {
          const match = p.link.match(/github\.com\/([^/]+)\/([^/]+)/);
          if (match) {
            const owner = match[1];
            const repo = match[2];
            try {
              const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
              if (res.ok) {
                const data = await res.json();
                p.stars = data.stargazers_count;
                p.lastSync = new Date().toISOString();
              }
            } catch (err) {
              console.error(`Failed to sync repo ${owner}/${repo}:`, err);
            }
          }
        }
      }

      setProjects(updatedProjects);
      setGitHubSyncStatus('success');
      setLastSyncTime(new Date().toLocaleTimeString('pl-PL'));
    } catch (err) {
      console.error("Force sync failed:", err);
      setGitHubSyncStatus('error');
    }
  };


  return (
    <div className="p-4 text-black space-y-6 select-none max-h-full flex flex-col justify-between">
      <div>
        <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Ustawienia systemowe</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">Personalizacja i parametry AdrianOS</p>
          </div>
          {activeCategory !== 'main' && (
            <button
              onClick={() => setActiveCategory('main')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Menu główne</span>
            </button>
          )}
        </div>

        {activeCategory === 'main' ? (
          <div className="space-y-3 pb-4">
            <button
              onClick={() => {
                setActiveCategory('appearance');
              }}
              className="w-full text-left p-4 bg-white hover:bg-slate-50/80 border border-slate-200/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                <Paintbrush size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-sm text-slate-800">Wygląd i personalizacja</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Motywy graficzne, tapety pulpitu, style ikon oraz ramki okien</p>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>

            {!config.viewerMode && (
              <button
                onClick={() => {
                  setActiveCategory('system');
                }}
                className="w-full text-left p-4 bg-white hover:bg-slate-50/80 border border-slate-200/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                  <Monitor size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-800">Zarządzanie systemem i pulpitem</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Skróty aplikacji, dźwięki systemowe, kopie zapasowe (backup)</p>
                </div>
                <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            )}

            {!config.viewerMode && (
              <button
                onClick={() => {
                  setActiveCategory('integrations');
                }}
                className="w-full text-left p-4 bg-white hover:bg-slate-50/80 border border-slate-200/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                  <Share2 size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-800">Konta i integracje zewnętrzne</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Autoryzacja Google/Microsoft, synchronizacja GitHub i import CV przez AI</p>
                </div>
                <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar pb-6">
            {activeCategory === 'appearance' && (
              <SettingsAppearance
                localConfig={localConfig}
                setLocalConfig={setLocalConfig}
                config={config}
                slugStatus={slugStatus}
                slugErrorMsg={slugErrorMsg}
              />
            )}

            {activeCategory === 'system' && !config.viewerMode && (
              <SettingsSystem
                localConfig={localConfig}
                setLocalConfig={setLocalConfig}
                icons={icons}
                setIcons={setIcons}
                DEFAULT_APPS_LIST={DEFAULT_APPS_LIST}
                handleExportBackup={handleExportBackup}
                handleImportBackup={handleImportBackup}
              />
            )}

            {activeCategory === 'integrations' && !config.viewerMode && (
              <SettingsIntegrations
                localConfig={localConfig}
                setLocalConfig={setLocalConfig}
                googleUser={googleUser}
                handleConnectGoogle={handleConnectGoogle}
                handleDisconnectGoogle={handleDisconnectGoogle}
                isMicrosoftConfigured={isMicrosoftConfigured}
                accounts={accounts}
                handleConnectMicrosoft={handleConnectMicrosoft}
                handleDisconnectMicrosoft={handleDisconnectMicrosoft}
                gitHubSyncStatus={gitHubSyncStatus}
                lastSyncTime={lastSyncTime}
                handleForceSyncGitHub={handleForceSyncGitHub}
                cvText={cvText}
                setCvText={setCvText}
                cvFile={cvFile}
                setCvFile={setCvFile}
                parsingLoading={parsingLoading}
                parseError={parseError}
                parseSuccess={parseSuccess}
                handleParseCV={handleParseCV}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center pt-2 border-t border-slate-100">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={handleSave}
          className="w-full max-w-xs min-h-[48px] h-12 px-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-400/30 text-white font-sans font-bold text-xs uppercase tracking-widest shadow-lg cursor-pointer backdrop-blur-md select-none relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {showSavedMsg ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1, rotate: [0, 15, -10, 0] }} 
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  ✅
                </motion.span>
                <span>ZAPISANO</span>
              </motion.div>
            ) : (
              <motion.div
                key="save"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <span>💰</span>
                <span>ZAPISZ USTAWIENIA</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};
