import React, { useState } from 'react';
import { OSConfig, DesktopIcon } from '../types';
import { useMsal } from '@azure/msal-react';
import { loginRequest, isMicrosoftConfigured } from '../lib/microsoftAuth';
import { googleSignIn, logout as logoutGoogle } from '../lib/googleAuth';
import { getAuth, onAuthStateChanged, linkWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { Download, Upload, Cpu, FileText, Linkedin, Loader2, Sparkles, RefreshCw, Check, AlertCircle } from 'lucide-react';

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
  { appId: 'bio', label: 'O mnie (Bio)', icon: '👤', color: 'from-purple-500/30 to-purple-500/10 hover:shadow-purple-500/20 border-purple-500/20' },
  { appId: 'projects', label: 'Moje Projekty', icon: '📁', color: 'from-cyan-500/30 to-cyan-500/10 hover:shadow-cyan-500/20 border-cyan-500/20' },
  { appId: 'lab', label: 'Aktualne Projekty', icon: '🧪', color: 'from-orange-500/30 to-orange-500/10 hover:shadow-orange-500/20 border-orange-500/20' },
  { appId: 'certificates', label: 'Certyfikaty', icon: '🏆', color: 'from-pink-500/30 to-pink-500/10 hover:shadow-pink-500/20 border-pink-500/20' },
  { appId: 'contact', label: 'Napisz do mnie', icon: '✉️', color: 'from-emerald-500/30 to-emerald-500/10 hover:shadow-emerald-500/20 border-emerald-500/20' },
  { appId: 'wizard', label: 'Generator Portfolio', icon: '✨', color: 'from-amber-500/30 to-amber-500/10 hover:shadow-amber-500/20 border-amber-500/20' },
  { appId: 'gdrive', label: 'Google Drive', icon: '💾', color: 'from-blue-500/30 to-blue-500/10 hover:shadow-blue-500/20 border-blue-500/20' },
  { appId: 'calendar', label: 'Kalendarz Google', icon: '📅', color: 'from-emerald-500/30 to-emerald-500/10 hover:shadow-emerald-500/20 border-emerald-500/20' },
  { appId: 'planned', label: 'Planowane projekty', icon: '📞', color: 'from-rose-500/30 to-rose-500/10 hover:shadow-rose-500/20 border-rose-500/20' },
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
  const [localConfig, setLocalConfig] = useState<OSConfig>({
    ...config,
    systemTheme: config.systemTheme || 'terraria',
    particles: config.particles || 'leaves',
    clockFormat: config.clockFormat || '24h',
    windowStyle: config.windowStyle || 'curved-classic',
    pixelTheme: config.pixelTheme !== false, // default true
    playSounds: config.playSounds !== false, // default true
    portfolioStyle: config.portfolioStyle || 'modern',
    fontSizeScale: config.fontSizeScale || 1.0,
    glassBlur: config.glassBlur || 'medium',
    borderStyle: config.borderStyle || 'thin',
    systemFont: config.systemFont || 'apple'
  });

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
          // If already linked or fails, log and continue to MSAL authentication
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
      // Fallback: clear local states
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
    onSave(localConfig);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2500);
    // Custom audio confirmation
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext && localConfig.playSounds) {
        const ctx = new AudioContext();
        // A magical 2-note ascending chord (save success)
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
    } catch (e) {}
  };

  // --- LOCAL DATA BACKUP & RESTORE HANDLERS ---
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
        alert("Kopia zapasowa została przywrócona pomyślnie!");
      } catch (err) {
        console.error("Restore failed:", err);
        alert("Błąd przywracania: Niepoprawny format pliku kopii zapasowej.");
      }
    };
    reader.readAsText(file);
  };

  // --- CV & LINKEDIN AI COMPILER STATES ---
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
        throw new Error("Wklej profil LinkedIn lub załącz plik CV przed analizą.");
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
        throw new Error(errData.error || 'Błąd komunikacji z kompilatorem.');
      }

      const result = await response.json();

      // Apply result to bio
      if (result.bio) {
        const updatedConfig = {
          ...localConfig,
          fullName: result.bio.fullName || localConfig.fullName,
          title: result.bio.title || localConfig.title,
          biography: result.bio.biography || localConfig.biography,
          skills: result.bio.skills || localConfig.skills
        };
        setLocalConfig(updatedConfig);
        onSave(updatedConfig);
      }

      // Appending parsed datasets to user portfolio config
      if (result.projects && setProjects) {
        const parsedProjects = result.projects.map((p: any, idx: number) => ({
          id: `proj-ai-${idx}-${Date.now()}`,
          title: p.title || 'Projekt AI',
          description: p.description || '',
          role: p.role || '',
          techStack: p.techStack || [],
          synonyms: p.synonyms || [],
          icon: '📁',
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
          year: t.year || '2025',
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
      setParseError(err.message || 'Błąd kompilacji CV.');
    } finally {
      setParsingLoading(false);
    }
  };

  // --- GITHUB SYNC HANDLERS ---
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
    <div className="p-4 text-black space-y-6 select-none">
      <div className="border-b-2 border-black pb-2 mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-blue-900">Ustawienia AdrianOS</h2>
        <p className="text-[0.75rem] text-gray-600 font-bold uppercase tracking-wider leading-relaxed">Dostosuj 8-bitowy świat swojego portfolio</p>
      </div>

      {/* 0. Główny Styl Portfolio */}
      <div className="space-y-4 bg-[#f9f9f9] p-3 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
        <div>
          <h3 className="text-sm font-bold text-black border-l-4 border-blue-600 pl-2 uppercase">Główny Styl Portfolio</h3>
          <p className="text-[0.75rem] text-gray-500 font-bold leading-tight uppercase mt-1">Zdecyduj jak inni zobaczą Twoje Portfolio (np. jako strona główna)</p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'modern', name: '🌌 Modern Glassmorphism', desc: 'Szkło, płynne blaski neonów, nowoczesny desktop' }
          ].map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setLocalConfig({ 
                ...localConfig, 
                portfolioStyle: style.id as any
              })}
              className={`p-3 text-left border-2 border-black rounded transition-all flex flex-col justify-between cursor-pointer ${
                localConfig.portfolioStyle === style.id
                  ? 'bg-yellow-100 border-yellow-600 ring-2 ring-black'
                  : 'bg-[#F0F0F0] hover:bg-[#E5E5E5]'
              }`}
            >
              <span className="font-bold text-xs">{style.name}</span>
              <span className="text-[0.7rem] text-gray-500 mt-1 font-semibold leading-none">{style.desc}</span>
            </button>
          ))}
        </div>

        {/* 0.5. Icon Style Variants Selection based on chosen Portfolio Style */}
        <div className="border-t border-gray-200 pt-3 mt-1 space-y-2">
            <>
              <h4 className="text-xs font-bold text-blue-900 uppercase">Wybierz wariant ikon dla stylu Modern (Lumine)</h4>
              <p className="text-[0.7rem] text-gray-500 font-semibold uppercase leading-none mb-1">Dostępnych jest 10 ekskluzywnych stylów poświaty i kompozycji szklanej:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1 border border-gray-200 p-1.5 rounded bg-white">
                {[
                  { id: 'lumine-ubuntu-style', name: '🍥 Ubuntu Classic Style', desc: 'Ciepły, gładki gradient pomarańczu i oberżyny w stylu systemu Ubuntu' },
                  { id: 'lumine-minimalist-glass', name: '🌌 Minimalist Glass', desc: 'Czyste szkło, wysoki biały półcień i lekka poświata' },
                  { id: 'lumine-neon-glow', name: '🧪 Neon Glow', desc: 'Głęboka czerń otoczona laserową poświatą Cyan' },
                  { id: 'lumine-cyberpunk-gold', name: '🪙 Cyberpunk Gold', desc: 'Pajęczyna złotych mikropatternów z bursztynowym blaskiem' },
                  { id: 'lumine-aurora-hologram', name: '🎨 Aurora Hologram', desc: 'Wielobarwne pastelowe przejścia fioletu, różu i błękitu' },
                  { id: 'lumine-dark-slate-chrome', name: '⛓️ Dark Slate Chrome', desc: 'Matowa, szczotkowana stal z chromowanym obrzeżem' },
                  { id: 'lumine-vaporwave-sunset', name: '🌇 Vaporwave Sunset', desc: 'Fuksjowo-różowe gradienty rodem z lat 80-tych' },
                  { id: 'lumine-forest-emerald', name: '🍃 Forest Emerald', desc: 'Głęboki jadeit leśny rozświetlony szmaragdowym pyłem' },
                  { id: 'lumine-cosmic-nebula', name: '🔮 Cosmic Nebula', desc: 'Mistyczna poświata fioletu i kosmicznych obłoków' },
                  { id: 'lumine-solar-flare', name: '☀️ Solar Flare', desc: 'Dynamiczna, magnetyczna eksplozja słonecznego pomarańczu' },
                  { id: 'lumine-monochromatic-carbon', name: '🥷 Monochromatic Carbon', desc: 'Ciemna, karbonowa, minimalistyczna elegancja bez neonów' }
                ].map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setLocalConfig({ ...localConfig, iconStyleModern: variant.id })}
                    className={`p-2 text-left border rounded transition-all text-xs flex flex-col justify-center leading-normal cursor-pointer ${
                      (localConfig.iconStyleModern || 'lumine-minimalist-glass') === variant.id
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-[1px_1px_0px_black]'
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="font-bold text-[0.75rem]">{variant.name}</span>
                    <span className="text-[0.65rem] text-gray-500 mt-0.5 leading-none font-medium">{variant.desc}</span>
                  </button>
                ))}
              </div>
            </>
        </div>
      </div>

      {/* 1. System Theme Presets */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-black border-l-4 border-emerald-600 pl-2 uppercase">1. Motyw Graficzny (Gradienty i Styl)</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'terraria', name: '🌳 Terraria Forest', desc: 'Smaragdowa zieleń, ziemisty brąz' },
            { id: 'classic-mac', name: '💻 Classic Mac', desc: 'Retro szarość, idealne piksele 1991' },
            { id: 'cyberpunk', name: '🌆 Cyber Neon', desc: 'Czerń i jaskrawe, neonowe kontury' },
            { id: 'retro-gold', name: '🪙 Retro Gold', desc: 'Ciepły mosiądz, złote i miedziane tony' }
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => setLocalConfig({ ...localConfig, systemTheme: theme.id as any })}
              className={`p-3 text-left border-2 border-black rounded transition-all flex flex-col justify-between cursor-pointer ${
                localConfig.systemTheme === theme.id
                  ? 'bg-yellow-100 border-yellow-600 shadow-[inset_2px_2px_0px_rgba(0,0,0,0.15)] ring-2 ring-black'
                  : 'bg-[#F0F0F0] hover:bg-[#E5E5E5]'
              }`}
            >
              <span className="font-bold text-xs">{theme.name}</span>
              <span className="text-[0.7rem] text-gray-500 mt-1 font-semibold leading-none">{theme.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Window Frame Design */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-black border-l-4 border-yellow-600 pl-2 uppercase">2. Styl Ramki Okien</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'curved-classic', name: '💻 Zaokrąglony Mac', desc: 'Klasyczne linie retro' },
            { id: 'sharp-chunky', name: '🧱 Terraria Blocky', desc: 'Klockowe, grube kontury' }
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setLocalConfig({ ...localConfig, windowStyle: style.id as any })}
              className={`p-2.5 text-left border-2 border-black rounded transition-all flex flex-col justify-between cursor-pointer ${
                localConfig.windowStyle === style.id
                  ? 'bg-yellow-100 border-yellow-600 ring-2 ring-black'
                  : 'bg-[#F0F0F0] hover:bg-[#E5E5E5]'
              }`}
            >
              <span className="font-bold text-xs">{style.name}</span>
              <span className="text-[0.7rem] text-gray-500 mt-1 font-semibold leading-none">{style.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2.5. Kompozycja kolorów i motyw główny */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-black border-l-4 border-amber-600 pl-2 uppercase">2.5. Kolorystyka i Motyw Główny</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'black-gold', name: '👑 Opaque Black & Gold', desc: 'Szlachetna matowa czerń, złote krawędzie' },
            { id: 'white-clean', name: '🕊️ White Clean', desc: 'Minimalistyczna biel z subtelnymi krawędziami' },
            { id: 'purple', name: '🔮 Deep Purple', desc: 'Mroczny neon fioletowy' },
            { id: 'cyan', name: '💎 Laser Cyan', desc: 'Futurystyczny błękit' },
            { id: 'orange', name: '🔥 Solar Orange', desc: 'Gorący słoneczny pomarańcz' },
            { id: 'emerald', name: '🍃 Forest Emerald', desc: 'Szmaragdowa retro zieleń' },
            { id: 'amber-retro', name: '🪵 Amber Retro', desc: 'Klasyczny ciepły bursztyn CRT' },
            { id: 'mono-terminal', name: '📟 Green Terminal', desc: 'Matrix zielony monochrom' }
          ].map((color) => (
            <button
              key={color.id}
              onClick={() => setLocalConfig({ 
                ...localConfig, 
                accentColor: color.id as any,
                themePack: color.id as any
              })}
              className={`p-2.5 text-left border-2 border-black rounded transition-all flex flex-col justify-between cursor-pointer ${
                localConfig.accentColor === color.id
                  ? 'bg-yellow-100 border-yellow-600 ring-2 ring-black'
                  : 'bg-[#F0F0F0] hover:bg-[#E5E5E5]'
              }`}
            >
              <span className="font-bold text-xs">{color.name}</span>
              <span className="text-[0.7rem] text-gray-500 mt-1 font-semibold leading-none">{color.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Dynamic Particles Selector */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-black border-l-4 border-purple-600 pl-2 uppercase">3. Efekty Cząsteczkowe w Tle</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'leaves', name: '🍁 Spadające Liście', desc: 'Liście z dżungli Terrarii' },
            { id: 'sparkles', name: '✨ Magiczne Iskry', desc: 'Świetliste piksele kurzu' },
            { id: 'bubbles', name: '🫧 Bąbelki Powietrza', desc: 'Relaksujący motyw wodny' },
            { id: 'none', name: '🚫 Efekty cząsteczkowe w tle: Wyłączone', desc: 'Czysty pulpit, maksymalna wydajność' }
          ].map((pt) => (
            <button
              key={pt.id}
              onClick={() => setLocalConfig({ ...localConfig, particles: pt.id as any })}
              className={`p-2.5 text-left border-2 border-black rounded transition-all flex flex-col justify-between cursor-pointer ${
                localConfig.particles === pt.id
                  ? 'bg-yellow-100 border-yellow-600 ring-2 ring-black'
                  : 'bg-[#F0F0F0] hover:bg-[#E5E5E5]'
              }`}
            >
              <span className="font-bold text-xs">{pt.name}</span>
              <span className="text-[0.7rem] text-gray-500 mt-1 font-semibold leading-none">{pt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3.5. Ułatwienia dostępu i zaawansowany design */}
      <div className="space-y-4 bg-[#fbfbfb] p-3.5 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
        <div>
          <h3 className="text-sm font-bold text-black border-l-4 border-blue-600 pl-2 uppercase">3.5. Ułatwienia dostępu i design</h3>
          <p className="text-[0.75rem] text-gray-500 font-bold leading-tight uppercase mt-1">Skalowanie czcionek dla lepszej czytelności oraz dodatkowe parametry interfejsu</p>
        </div>

        {/* Font size adjustment slider */}
        <div className="space-y-2 bg-white p-2.5 border border-gray-200 rounded">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-black uppercase">🔍 Rozmiar Czcionki Systemowej:</span>
            <span className="text-xs font-black bg-blue-100 px-2.5 py-0.5 border border-black rounded text-blue-900">
              {Math.round((localConfig.fontSizeScale || 1.0) * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3 py-1">
            <span className="text-[0.75rem] font-bold text-gray-400">A</span>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={localConfig.fontSizeScale || 1.0}
              onChange={(e) => setLocalConfig({ ...localConfig, fontSizeScale: parseFloat(e.target.value) })}
              className="flex-grow accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-bold text-gray-800">A</span>
          </div>
          <p className="text-[0.65rem] text-gray-500 leading-normal uppercase font-semibold">Skaluje tekst całego interfejsu, aby ułatwić czytanie na mniejszych ekranach.</p>
        </div>

        {/* Design details row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Glass blur select */}
          <div className="space-y-1.5">
            <label className="text-[0.7rem] text-gray-600 font-bold uppercase block">Rozmycie tła szkła:</label>
            <select
              value={localConfig.glassBlur || 'medium'}
              onChange={(e) => setLocalConfig({ ...localConfig, glassBlur: e.target.value as any })}
              className="w-full p-1.5 bg-white border border-gray-300 rounded text-xs font-bold focus:outline-none focus:border-black"
            >
              <option value="none">Brak (Przezroczyste)</option>
              <option value="low">Lekkie (Low)</option>
              <option value="medium">Średnie (Medium)</option>
              <option value="high">Mocne (High)</option>
            </select>
          </div>

          {/* Border style select */}
          <div className="space-y-1.5">
            <label className="text-[0.7rem] text-gray-600 font-bold uppercase block">Obramowanie okien:</label>
            <select
              value={localConfig.borderStyle || 'thin'}
              onChange={(e) => setLocalConfig({ ...localConfig, borderStyle: e.target.value as any })}
              className="w-full p-1.5 bg-white border border-gray-300 rounded text-xs font-bold focus:outline-none focus:border-black"
            >
              <option value="none">Brak obramowania</option>
              <option value="thin">Cienka ramka</option>
              <option value="thick">Gruba retro ramka</option>
              <option value="double">Podwójna retro ramka</option>
            </select>
          </div>
        </div>

        {/* Czcionka selection */}
        <div className="space-y-1.5 pt-2 border-t border-gray-200">
          <label className="text-[0.7rem] text-gray-600 font-bold uppercase block">Czcionka Interfejsu (Font):</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'apple', name: '🍏 Apple SF', desc: 'System-ui' },
              { id: 'ubuntu', name: '🍥 Ubuntu', desc: 'Classic Linux' },
              { id: 'inter', name: '🌌 Inter', desc: 'Modern Sans' },
              { id: 'retro', name: '🕹️ 8-Bit', desc: 'Pixel Mono' }
            ].map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => setLocalConfig({ ...localConfig, systemFont: font.id as any })}
                className={`p-1.5 text-center border rounded transition-all text-[0.75rem] font-bold flex flex-col justify-center items-center leading-tight cursor-pointer ${
                  localConfig.systemFont === font.id
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-[1px_1px_0px_black]'
                    : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>{font.name}</span>
                <span className="text-[0.6rem] text-gray-400 font-normal">{font.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3.8. Zarządzanie Ikonami Pulpitu (Ilość ikon) */}
      {icons && setIcons && (
        <div className="space-y-3 bg-[#f3f9f3] p-3.5 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
          <div>
            <h3 className="text-sm font-bold text-black border-l-4 border-green-600 pl-2 uppercase">3.8. Zarządzanie Ikonami Pulpitu</h3>
            <p className="text-[0.75rem] text-gray-500 font-bold leading-tight uppercase mt-1">
              Włączaj lub wyłączaj ikony, aby uprościć pulpit (od pustego do pełnego zestawu)
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-2 border border-gray-200 rounded max-h-[180px] overflow-y-auto">
            {DEFAULT_APPS_LIST.map((app) => {
              const isEnabled = icons.some((i) => i.appId === app.appId);
              return (
                <button
                  key={app.appId}
                  type="button"
                  onClick={() => {
                    if (isEnabled) {
                      // Remove it
                      setIcons(prev => prev.filter(i => i.appId !== app.appId));
                    } else {
                      // Add it
                      let nextX = 0;
                      let nextY = 0;
                      const coords = new Set(icons.map(i => `${i.x},${i.y}`));
                      let found = false;
                      for (let y = 0; y < 6 && !found; y++) {
                        for (let x = 0; x < 6 && !found; x++) {
                          if (!coords.has(`${x},${y}`)) {
                            nextX = x;
                            nextY = y;
                            found = true;
                          }
                        }
                      }
                      setIcons(prev => [
                        ...prev,
                        {
                          id: `icon-${app.appId}`,
                          label: app.label,
                          appId: app.appId,
                          icon: app.appId === 'gdrive' ? 'hardDrive' : app.appId === 'planned' ? 'phone' : app.appId === 'contact' ? 'mail' : app.appId === 'wizard' ? 'sparkles' : app.appId === 'certificates' ? 'award' : app.appId === 'lab' ? 'flask' : app.appId === 'projects' ? 'folder' : app.appId === 'bio' ? 'user' : app.appId,
                          color: app.color,
                          x: nextX,
                          y: nextY
                        }
                      ]);
                    }
                  }}
                  className={`flex items-center justify-between p-2 rounded border text-xs font-bold transition-all cursor-pointer ${
                    isEnabled
                      ? 'bg-green-50 border-green-600 text-green-900 shadow-[1px_1px_0px_black]'
                      : 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm select-none">{app.icon}</span>
                    <span>{app.label}</span>
                  </div>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center font-sans ${
                    isEnabled ? 'bg-green-600 border-green-600 text-white font-bold' : 'border-gray-400 bg-white'
                  }`}>
                    {isEnabled && '✓'}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[0.65rem] text-gray-500 leading-normal uppercase font-semibold">
            Ikona "Personalizacja" (Ustawienia) jest zawsze widoczna, aby zagwarantować stały dostęp do panelu konfiguracji.
          </p>
        </div>
      )}

      {/* 4. Functional System Switches */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-black border-l-4 border-red-600 pl-2 uppercase">4. Przełączniki Systemowe</h3>
        <div className="bg-[#F5F5F5] p-3 border-2 border-black rounded space-y-2.5">
          <label className="flex items-center gap-3 font-bold text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={localConfig.pixelTheme}
              onChange={(e) => setLocalConfig({ ...localConfig, pixelTheme: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
            <span>Aktywuj Pikselowy Filtr Ekranu (CRT overlay)</span>
          </label>
          <label className="flex items-center gap-3 font-bold text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={localConfig.playSounds}
              onChange={(e) => setLocalConfig({ ...localConfig, playSounds: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
            <span>Dźwięki systemowe i kliknięcia 8-bit</span>
          </label>
          <div className="h-[1px] bg-gray-300 my-1" />
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs">Format zegara w TopBar:</span>
            <div className="flex gap-2">
              {['24h', '12h'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setLocalConfig({ ...localConfig, clockFormat: fmt as any })}
                  className={`px-3 py-1 border-2 border-black font-bold text-xs rounded cursor-pointer ${
                    localConfig.clockFormat === fmt ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {fmt === '24h' ? '24-godz' : '12-godz (AM/PM)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4.5. Integracje Chmurowe i Konta (Google & Microsoft) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-black border-l-4 border-blue-600 pl-2 uppercase">4.5. Integracje Chmurowe i Konta</h3>
        <p className="text-[0.7rem] text-gray-500 font-bold uppercase leading-relaxed">
          Połącz i autoryzuj swoje konta chmurowe, aby umożliwić integrację z Google Drive, Kalendarzem lub bezpiecznym dostarczaniem maili (Gmail/Outlook).
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F5F5F5] p-3 border-2 border-black rounded">
          {/* Połączenie Google */}
          <div className="p-2.5 bg-white border border-gray-300 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">🔵</span>
                <span className="text-xs font-bold text-gray-800 uppercase">Google Workspace</span>
              </div>
              <p className="text-[0.65rem] text-gray-500 font-medium leading-normal mb-2 uppercase font-semibold">
                Wymagane do działania Kalendarza, Dysku Google (Drive) i wysyłki e-maili przez Gmail API.
              </p>
            </div>

            <div className="pt-2 border-t border-gray-150 flex items-center justify-between">
              {googleUser ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[0.65rem] font-bold text-emerald-600 truncate max-w-[120px]" title={googleUser.email || ''}>
                    ● {googleUser.displayName || googleUser.email}
                  </span>
                  <button
                    onClick={handleDisconnectGoogle}
                    className="text-[0.65rem] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Rozłącz
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectGoogle}
                  className="w-full py-1 text-center bg-blue-600 hover:bg-blue-700 text-[0.65rem] font-bold text-white rounded cursor-pointer transition-colors uppercase"
                >
                  Połącz z Google
                </button>
              )}
            </div>
          </div>

          {/* Połączenie Microsoft */}
          <div className="p-2.5 bg-white border border-gray-300 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">🔷</span>
                <span className="text-xs font-bold text-gray-800 uppercase">Microsoft Live AD</span>
              </div>
              <p className="text-[0.65rem] text-gray-500 font-medium leading-normal mb-2 uppercase font-semibold">
                Umożliwia pełną integrację konta Microsoft, wysyłanie e-maili przez Microsoft Graph API i synchronizację.
              </p>
            </div>

            <div className="pt-2 border-t border-gray-150 flex items-center justify-between">
              {!isMicrosoftConfigured ? (
                <div className="w-full text-center py-1.5 bg-red-50 border border-red-200 text-red-600 text-[0.65rem] font-bold rounded uppercase leading-normal px-1">
                  Logowanie Microsoft niedostępne — brak konfiguracji
                </div>
              ) : accounts.length > 0 ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[0.65rem] font-bold text-emerald-600 truncate max-w-[120px]" title={accounts[0].username}>
                    ● {accounts[0].name || accounts[0].username}
                  </span>
                  <button
                    onClick={handleDisconnectMicrosoft}
                    className="text-[0.65rem] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Rozłącz
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectMicrosoft}
                  className="w-full py-1 text-center bg-sky-600 hover:bg-sky-700 text-[0.65rem] font-bold text-white rounded cursor-pointer transition-colors uppercase"
                >
                  Połącz z Microsoft
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Wybór domyślnego dostawcy poczty */}
        <div className="p-2.5 bg-[#F5F5F5] border-2 border-black rounded flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-blue-900 uppercase">Dostawca Poczty Formularza:</span>
            <p className="text-[0.65rem] text-gray-500 font-semibold uppercase leading-tight">
              Wybierz, który protokół ma obsługiwać Twój formularz kontaktowy.
            </p>
          </div>
          <select
            value={localConfig.emailProvider || 'smtp'}
            onChange={(e) => setLocalConfig({ ...localConfig, emailProvider: e.target.value as any })}
            className="p-1.5 bg-white border-2 border-black rounded text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="smtp">Symulowany SMTP (Bramka Demo)</option>
            <option value="google" disabled={!googleUser}>Gmail API (Google) {!googleUser ? '(Zablokowane)' : ''}</option>
            <option value="microsoft" disabled={!isMicrosoftConfigured || accounts.length === 0}>
              {!isMicrosoftConfigured 
                ? 'Outlook Graph (Niedostępne - brak konfiguracji)' 
                : accounts.length === 0 
                  ? 'Outlook Graph (Microsoft) (Zablokowane)' 
                  : 'Outlook Graph (Microsoft)'}
            </option>
          </select>
        </div>
      </div>

      {/* 4.6. Synchronizacja GitHub (Status & Manual Sync) */}
      <div className="space-y-3 bg-amber-50/20 border border-amber-300 p-3.5 rounded shadow-[1px_1px_0px_black]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-600 font-bold">🐙</span>
            <h3 className="text-sm font-bold text-black uppercase">4.6. Status Synchronizacji GitHub</h3>
          </div>
          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
            gitHubSyncStatus === 'syncing' 
              ? 'bg-yellow-100 border-yellow-400 text-yellow-700 animate-pulse'
              : gitHubSyncStatus === 'success'
                ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                : gitHubSyncStatus === 'error'
                  ? 'bg-rose-100 border-rose-400 text-rose-700'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
          }`}>
            {gitHubSyncStatus === 'syncing' && 'Trwa synchronizacja...'}
            {gitHubSyncStatus === 'success' && 'Zsynchronizowano'}
            {gitHubSyncStatus === 'error' && 'Błąd połączenia'}
            {gitHubSyncStatus === 'idle' && 'Bezczynny'}
          </span>
        </div>

        <p className="text-[0.7rem] text-gray-500 font-bold uppercase leading-relaxed text-left">
          Monitoruj oraz wymuś pobieranie aktualnych statystyk i liczby gwiazdek (Stars) Twoich repozytoriów zintegrowanych jako aplikacja Projekty.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-amber-200/50">
          <div className="text-[10px] font-mono text-gray-600 uppercase font-bold">
            Ostatnia udana synchronizacja: <span className="text-amber-700">{lastSyncTime || 'Nigdy (wymagane odświeżenie)'}</span>
          </div>
          <button
            onClick={handleForceSyncGitHub}
            disabled={gitHubSyncStatus === 'syncing'}
            className="px-3.5 py-1.5 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 text-slate-950 disabled:text-gray-400 font-sans font-bold text-xs rounded border border-black cursor-pointer transition-all uppercase select-none"
          >
            <RefreshCw size={12} className={gitHubSyncStatus === 'syncing' ? 'animate-spin' : ''} />
            <span>Wymuś Odświeżenie (Force Sync)</span>
          </button>
        </div>
      </div>

      {/* 4.7. Kopia Zapasowa (Backup & Restore) */}
      <div className="space-y-3 bg-[#f8fafc] border border-blue-200 p-3.5 rounded shadow-[1px_1px_0px_black]">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-bold">💾</span>
          <h3 className="text-sm font-bold text-black uppercase">4.7. Kopia Zapasowa i Przywracanie</h3>
        </div>

        <p className="text-[0.7rem] text-gray-500 font-bold uppercase leading-relaxed text-left">
          Pobierz pełną kopię zapasową konfiguracji systemu, projektów, certyfikatów, osi czasu oraz ikon, aby zapisać je bezpiecznie lokalnie w pliku JSON lub przywrócić je w dowolnym momencie.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-blue-100">
          <button
            onClick={handleExportBackup}
            className="p-2 flex items-center justify-center gap-2 bg-white hover:bg-blue-50 border border-blue-300 hover:border-blue-400 text-blue-700 font-sans font-bold text-xs rounded cursor-pointer transition-all uppercase"
          >
            <Download size={13} />
            <span>Pobierz Kopię Zapasową (JSON)</span>
          </button>

          <label className="p-2 flex items-center justify-center gap-2 bg-white hover:bg-blue-50 border border-dashed border-blue-300 hover:border-blue-400 text-blue-700 font-sans font-bold text-xs rounded cursor-pointer transition-all uppercase text-center select-none">
            <Upload size={13} />
            <span>Przywróć z pliku JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 4.8. Import Profilu CV / LinkedIn (Kompilator AI & OCR) */}
      <div className="space-y-3.5 bg-[#fdfaf7] border border-orange-300 p-3.5 rounded shadow-[1px_1px_0px_black]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="text-orange-600 w-4 h-4" />
            <h3 className="text-sm font-bold text-black uppercase">4.8. Kompilator AI CV / LinkedIn z OCR</h3>
          </div>
          <span className="text-[9px] bg-orange-100 border border-orange-200 text-orange-700 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
            Powered by Gemini AI
          </span>
        </div>

        <p className="text-[0.7rem] text-gray-500 font-bold uppercase leading-relaxed text-left">
          Prześlij swój plik CV (PDF, PNG, JPG) lub wklej profil LinkedIn. Zaawansowane modele Gemini przeprowadzą automatyczną ekstrakcję danych (w tym proces OCR dla skanów) oraz dopasują je inteligentnie do zmiennych PortfolioOS wraz z przypisaniem synonimów umiejętności.
        </p>

        <div className="space-y-2.5">
          {/* Paste profile text */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-600 font-bold uppercase block text-left">Wklej tekst profilu LinkedIn / CV:</label>
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Wklej tutaj surowy tekst profilu zawodowego lub CV..."
              rows={3}
              className="w-full p-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* PDF/Image File Upload with custom styles */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-600 font-bold uppercase block text-left">LUB prześlij dokument CV (PDF, Obraz):</label>
            <div className="border border-dashed border-gray-300 rounded p-2 bg-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="text-gray-400 w-4 h-4" />
                <span className="text-xs font-semibold text-gray-600 truncate max-w-[180px]">
                  {cvFile ? `${cvFile.name} (${Math.round(cvFile.size / 1024)} KB)` : 'Nie wybrano pliku (Formaty: pdf, png, jpg)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {cvFile && (
                  <button
                    onClick={() => setCvFile(null)}
                    className="text-[10px] font-bold text-red-500 hover:underline px-1.5 cursor-pointer"
                  >
                    Usuń
                  </button>
                )}
                <label className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-350 text-[10px] font-bold rounded cursor-pointer transition-colors uppercase">
                  Wybierz Plik
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setCvFile(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Feedback alerts */}
          {parseError && (
            <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded flex items-start gap-1.5">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{parseError}</span>
            </div>
          )}

          {parseSuccess && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded flex items-start gap-1.5">
              <Check size={14} className="shrink-0 mt-0.5" />
              <span>Kompilacja i import zakończone sukcesem! Twoje Bio, Projekty i inne sekcje zostały natychmiastowo zaktualizowane o wykryte atrybuty.</span>
            </div>
          )}

          {/* Parse button */}
          <button
            onClick={handleParseCV}
            disabled={parsingLoading || (!cvText.trim() && !cvFile)}
            className="w-full py-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-200 disabled:to-gray-200 text-white disabled:text-gray-400 font-sans font-extrabold text-xs rounded border border-black cursor-pointer transition-all uppercase select-none tracking-wider shadow-[0_2px_4px_rgba(249,115,22,0.2)]"
          >
            {parsingLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>URUCHAMIANIE KOMPILATORA AI (OCR + Analiza)...</span>
              </>
            ) : (
              <>
                <Cpu size={13} />
                <span>Kompiluj i Zaimplementuj Dane (AI Import)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5. Modern Glassmorphism Styled Save Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleSave}
          className="w-full max-w-xs min-h-[48px] h-12 px-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-400/30 text-white font-sans font-bold text-xs uppercase tracking-widest cursor-pointer shadow-[0_4px_12px_rgba(16,185,129,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] active:translate-y-0 transition-all duration-200 backdrop-blur-md select-none"
        >
          {showSavedMsg ? (
            <>
              <span className="animate-bounce">✅</span>
              <span>ZAPISANO Pomyślnie</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>ZAPISZ USTAWIENIA</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
