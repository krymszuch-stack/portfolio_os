import React, { useState, useEffect } from 'react';
import { Project, Certificate, TimelineItem, OSConfig } from '../types';
import { User, Briefcase, Award, Settings, Sparkles } from 'lucide-react';
import { DesktopIcon } from './DesktopIcon';
import { RetroWindow } from './RetroWindow';
import { TopBar } from './TopBar';
import { AppSettings } from './AppSettings';
import { DesktopHero } from './DesktopHero';
import { SocialDock } from './SocialDock';
import { ProjectShowcase } from './ProjectShowcase';
import { RecruiterAdvisor } from './RecruiterAdvisor';

interface PortfolioViewProps {
  config: OSConfig;
  projects: Project[];
  certificates: Certificate[];
  timeline: TimelineItem[];
  onLaunchGenerator?: () => void;
  syncStatus?: 'synced' | 'saving' | 'error';
  onRetrySync?: () => void;
  guestMode?: boolean;
  onLoginClick?: () => void;
}

// Custom 8-Bit falling / rising particle system (forest leaves, magic sparkles, bubble pop)
const FallingParticles: React.FC<{ type: 'leaves' | 'sparkles' | 'bubbles' | 'none' }> = ({ type }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (type === 'none' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const particles = Array.from({ length: 24 }).map((_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 6 + 4,
      color: type === 'leaves' 
        ? ['#4caf50', '#81c784', '#e57373', '#ffb74d', '#a1887f'][Math.floor(Math.random() * 5)] 
        : type === 'sparkles' 
          ? '#fffb96' 
          : '#e0f7fa',
      speed: Math.random() * 0.8 + 0.4,
      angle: Math.random() * 360
    }));

    let animationFrameId: number;
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        if (type === 'bubbles') {
          p.y -= p.speed * 0.6;
        } else {
          p.y += p.speed * 0.6;
        }
        p.x += Math.sin(p.angle) * 0.5;
        p.angle += 0.04;

        if (p.y > canvas.height + 5 && type !== 'bubbles') {
          p.y = -5;
          p.x = Math.random() * canvas.width;
        } else if (p.y < -5 && type === 'bubbles') {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }

        ctx.fillStyle = p.color;
        if (type === 'bubbles') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(0,0,0,0.4)';
          ctx.stroke();
        } else {
          ctx.fillRect(p.x, p.y, p.size, p.size);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(0,0,0,0.4)';
          ctx.strokeRect(p.x, p.y, p.size, p.size);
          if (type === 'sparkles') {
             ctx.shadowColor = '#fffb96';
             ctx.shadowBlur = 6;
          }
        }
      }
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  if (type === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  config: initialConfig,
  projects,
  certificates,
  timeline,
  onLaunchGenerator,
  syncStatus,
  onRetrySync,
  guestMode,
  onLoginClick
}) => {
  const [activeWindows, setActiveWindows] = useState<string[]>([]);
  const [config, setConfig] = useState<OSConfig>(() => {
    const saved = localStorage.getItem('adrianOSConfig');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialConfig,
          ...parsed,
          systemTheme: parsed.systemTheme || 'terraria',
          particles: parsed.particles || 'leaves',
          clockFormat: parsed.clockFormat || '24h',
          windowStyle: parsed.windowStyle || 'curved-classic',
          pixelTheme: parsed.pixelTheme !== false,
          playSounds: parsed.playSounds !== false,
        };
      } catch (e) {
        return initialConfig;
      }
    }
    return {
      ...initialConfig,
      systemTheme: 'terraria',
      particles: 'leaves',
      clockFormat: '24h',
      windowStyle: 'curved-classic',
      pixelTheme: true,
      playSounds: true,
    };
  });

  const handleSaveConfig = (newConfig: OSConfig) => {
    setConfig(newConfig);
    localStorage.setItem('adrianOSConfig', JSON.stringify(newConfig));
  };

  const handleOpenWindow = (windowId: string) => {
    if (!activeWindows.includes(windowId)) {
      setActiveWindows([...activeWindows, windowId]);
    }
  };

  const handleCloseWindow = (windowId: string) => {
    setActiveWindows(activeWindows.filter(id => id !== windowId));
  };

  // Theme Wallpaper gradient configs
  const wallpaperStyles: Record<string, { gradient: string; dockBg: string; dockBorder: string; bgOverlay?: string }> = {
    'terraria': {
      gradient: 'linear-gradient(to bottom, #1d3c1e, #0c170c)',
      dockBg: 'bg-[#5d4037]/80',
      dockBorder: 'border-[#3d2723]',
      bgOverlay: 'radial-gradient(ellipse at 30% 20%, rgba(76, 175, 80, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139, 69, 19, 0.06) 0%, transparent 50%)'
    },
    'classic-mac': {
      gradient: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 50%, #8e9eab 100%)',
      dockBg: 'bg-[#C0C0C0]/90',
      dockBorder: 'border-black',
      bgOverlay: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,0.02) 35px, rgba(0,0,0,0.02) 36px)'
    },
    'cyberpunk': {
      gradient: 'linear-gradient(to bottom, #120921, #040207)',
      dockBg: 'bg-black/80',
      dockBorder: 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
      bgOverlay: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.04) 0%, transparent 60%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.02) 2px, rgba(6,182,212,0.02) 4px)'
    },
    'retro-gold': {
      gradient: 'linear-gradient(to bottom, #422910, #130a03)',
      dockBg: 'bg-[#4e2f09]/80',
      dockBorder: 'border-[#321c05]',
      bgOverlay: 'radial-gradient(ellipse at 50% 30%, rgba(245,158,11,0.06) 0%, transparent 50%)'
    }
  };

  const currentTheme = config.systemTheme || 'terraria';
  let activeWallpaper = wallpaperStyles[currentTheme] || wallpaperStyles['terraria'];

  if (config.accentColor === 'black-gold') {
    activeWallpaper = {
      gradient: 'linear-gradient(to bottom, #050505, #000000)',
      dockBg: 'bg-black/90 border border-amber-500/50',
      dockBorder: 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
      bgOverlay: 'radial-gradient(circle at 50% 40%, rgba(245,158,11,0.04) 0%, transparent 50%)'
    };
  } else if (config.accentColor === 'white-clean') {
    activeWallpaper = {
      gradient: 'linear-gradient(to bottom, #fcfcfc, #f4f6f8)',
      dockBg: 'bg-white/90 border border-slate-300/80',
      dockBorder: 'border-slate-300 shadow-sm',
      bgOverlay: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,0.01) 35px, rgba(0,0,0,0.01) 36px)'
    };
  }

  // Synthesis double play retro click beep for Dock buttons
  const playDockBeep = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext && config.playSounds) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 note
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.05); // E5 note
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch (e) {}
  };

  return (
    <div 
      className="min-h-screen font-mono text-black select-none relative overflow-hidden transition-all duration-500" 
      style={{
        backgroundImage: activeWallpaper.bgOverlay
          ? `${activeWallpaper.bgOverlay}, ${activeWallpaper.gradient}, url("https://www.transparenttextures.com/patterns/pixel-weave.png")`
          : `${activeWallpaper.gradient}, url("https://www.transparenttextures.com/patterns/pixel-weave.png")`,
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Top Bar Navigation */}
      <TopBar 
        config={config} 
        syncStatus={syncStatus}
        onRetrySync={onRetrySync}
        guestMode={guestMode}
        onLoginClick={onLoginClick}
      />

      {/* Dynamic 8-bit Falling Particles */}
      <FallingParticles type={config.particles || 'leaves'} />

      {/* Vintage CRT Scanline Filter */}
      {config.pixelTheme !== false && <div className="crt-overlay pointer-events-none" />}
      
      {/* Hero + Social + Projects Showcase */}
      <div className="px-6 md:px-10 pt-20 md:pt-24 pb-6 flex flex-col items-center gap-6 relative z-10 max-w-6xl mx-auto w-full">
        <DesktopHero config={config} onOpenContact={() => handleOpenWindow('contact')} onLaunchGenerator={onLaunchGenerator} />
        <SocialDock config={config} />
        <ProjectShowcase projects={projects} config={config} onOpenProjects={() => handleOpenWindow('projects')} />
      </div>

      {/* Desktop Grid Area */}
      <div className="px-10 pb-10 flex flex-wrap gap-10 justify-start items-start relative z-10 max-w-6xl mx-auto">
        <DesktopIcon label="O Mnie" icon={<User />} onClick={() => handleOpenWindow('bio')} />
        <DesktopIcon label="Projekty" icon={<Briefcase />} onClick={() => handleOpenWindow('projects')} />
        <DesktopIcon label="Certyfikaty" icon={<Award />} onClick={() => handleOpenWindow('certificates')} />
        <DesktopIcon label="Ustawienia" icon={<Settings />} onClick={() => handleOpenWindow('settings')} />
        {onLaunchGenerator && (
          <DesktopIcon 
            label="Kreator Wizytówki" 
            icon={<Sparkles className="text-yellow-400 animate-pulse" />} 
            onClick={onLaunchGenerator} 
          />
        )}
      </div>

      {/* Dynamic Windows Rendering */}
      {activeWindows.includes('bio') && (
        <RetroWindow title="O Mnie - Adrian" onClose={() => handleCloseWindow('bio')} config={config} className="left-10 top-28 w-[420px]">
           <div className="space-y-4">
             <div className="flex items-center gap-4 border-b-2 border-black/10 pb-3">
               <div className="w-16 h-16 bg-emerald-500 rounded border-2 border-black flex items-center justify-center text-white text-3xl font-bold font-mono shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                 A
               </div>
               <div>
                 <h2 className="text-2xl font-bold tracking-tight text-blue-900 leading-none">Adrian</h2>
                 <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Full-stack Developer & Designer</p>
               </div>
             </div>
             <p className="text-xs leading-relaxed font-semibold">
               Witaj w moim pikselowym systemie operacyjnym! TworzÄ™ interaktywne aplikacje Ĺ‚Ä…czÄ…ce retro estetykÄ™ z nowoczesnÄ… wydajnoĹ›ciÄ….
             </p>
             <div className="bg-black/5 p-3 rounded border border-black/10">
               <h3 className="text-[10px] font-bold uppercase text-gray-600 mb-1">GĹ‚Ăłwne umiejÄ™tnoĹ›ci:</h3>
               <div className="flex flex-wrap gap-1">
                 {['React', 'TypeScript', 'Node.js', 'Vite', 'Tailwind CSS', 'D3.js', 'Firestore'].map(skill => (
                   <span key={skill} className="text-[9px] bg-white border border-black px-1.5 py-0.5 rounded font-bold">{skill}</span>
                 ))}
               </div>
             </div>
           </div>
        </RetroWindow>
      )}

      {activeWindows.includes('projects') && (
        <RetroWindow title="Moje Projekty" onClose={() => handleCloseWindow('projects')} config={config} className="left-20 top-36 w-[450px]">
          <div className="space-y-4">
            <h3 className="text-sm font-bold border-b-2 border-black/10 pb-1">UkoĹ„czone Projekty</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {projects.slice(0, 3).map((proj) => (
                <div key={proj.id} className="p-3 bg-white border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-blue-900">{proj.title}</span>
                    <span className="text-[8px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1 py-0.2 rounded font-black uppercase">Real</span>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1 leading-snug">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </RetroWindow>
      )}

      {activeWindows.includes('certificates') && (
        <RetroWindow title="Certyfikaty i Odznaczenia" onClose={() => handleCloseWindow('certificates')} config={config} className="left-24 top-40 w-[420px]">
          <div className="space-y-3">
            <h3 className="text-sm font-bold border-b-2 border-black/10 pb-1">Zweryfikowane Kwalifikacje</h3>
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-2.5 bg-yellow-50 border-2 border-black rounded flex gap-2 items-center">
                  <Award className="text-amber-600 shrink-0" size={18} />
                  <div className="leading-none">
                    <div className="font-bold text-xs text-amber-950">{cert.title}</div>
                    <span className="text-[8px] text-gray-500 font-bold">{cert.issuer} â€˘ {cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RetroWindow>
      )}

      {activeWindows.includes('settings') && (
        <RetroWindow title="Ustawienia Systemu" onClose={() => handleCloseWindow('settings')} config={config} className="right-10 top-24 w-[380px]">
           <AppSettings config={config} onSave={handleSaveConfig} />
        </RetroWindow>
      )}

      {/* Mac OS Pixelated Pedestal Shelf Dock */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl flex items-end gap-5 select-none relative">
        {/* Wooden/Stone platform background */}
        <div className={`absolute inset-x-0 bottom-0 top-2 border-2 border-black rounded-xl ${activeWallpaper.dockBg} ${activeWallpaper.dockBorder}`}>
          {/* Beveled shelf line highlight */}
          <div className="h-[3px] bg-white/20 border-b border-black w-full" />
          {/* Supporting shelf bracket shadows */}
          <div className="absolute -bottom-2 left-6 w-4 h-2 bg-black/40 rounded" />
          <div className="absolute -bottom-2 right-6 w-4 h-2 bg-black/40 rounded" />
        </div>

        {/* Real Dynamic Dock App Icons */}
        {[
          { id: 'bio', label: 'O mnie', icon: <User size={24} /> },
          { id: 'projects', label: 'Projekty', icon: <Briefcase size={24} /> },
          { id: 'certificates', label: 'Certyfikaty', icon: <Award size={24} /> },
          { id: 'settings', label: 'Ustawienia', icon: <Settings size={24} /> }
        ].map((app) => {
          const isWindowActive = activeWindows.includes(app.id);
          return (
            <button
              key={app.id}
              onClick={() => {
                playDockBeep();
                handleOpenWindow(app.id);
              }}
              title={app.label}
              className="relative group pb-2 flex flex-col items-center cursor-pointer transition-transform duration-150 hover:-translate-y-2 active:translate-y-0"
            >
              {/* Tooltip */}
              <div className="absolute bottom-16 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all pointer-events-none bg-black text-white px-2.5 py-0.5 rounded text-[9px] border border-black font-bold whitespace-nowrap shadow-md uppercase">
                {app.label}
              </div>

              {/* Icon graphic wrapper with pixel art double outline */}
              <div 
                className="text-white p-1 relative flex items-center justify-center transition-colors hover:text-yellow-300"
                style={{
                  filter: 'drop-shadow(1px 0px 0px #000) drop-shadow(-1px 0px 0px #000) drop-shadow(0px 1px 0px #000) drop-shadow(0px -1px 0px #000)'
                }}
              >
                {app.icon}
              </div>

              {/* Open status dot */}
              <div className={`absolute bottom-0 w-2 h-2 rounded-full border border-black transition-all duration-300 ${
                isWindowActive ? 'bg-green-400 scale-100 animate-pulse shadow-[0_0_4px_#4caf50]' : 'bg-gray-400 scale-75'
              }`} />
            </button>
          );
        })}

        {/* Separator and Generator/OS Builder mode switch */}
        {onLaunchGenerator && (
          <>
            <div className="h-10 w-[2px] bg-black/45 self-center mx-1 z-10 opacity-70 shadow-sm" />
            
            <button
              onClick={() => {
                playDockBeep();
                onLaunchGenerator();
              }}
              title="Uruchom Kreator BuilderOS"
              className="relative group pb-2 flex flex-col items-center cursor-pointer transition-transform duration-150 hover:-translate-y-2 active:translate-y-0 z-10"
            >
              <div className="absolute bottom-16 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all pointer-events-none bg-yellow-400 text-black px-2.5 py-0.5 rounded text-[9px] border border-black font-black whitespace-nowrap shadow-md uppercase">
                âšˇ ZarzÄ…dzanie OS
              </div>
              <div 
                className="text-yellow-400 hover:text-yellow-300 p-1 relative flex items-center justify-center animate-pulse"
                style={{
                  filter: 'drop-shadow(1px 0px 0px #000) drop-shadow(-1px 0px 0px #000) drop-shadow(0px 1px 0px #000) drop-shadow(0px -1px 0px #000)'
                }}
              >
                <Sparkles size={24} />
              </div>
              <div className="absolute bottom-0 w-2 h-2 rounded-full border border-black bg-yellow-400 shadow-[0_0_5px_#facc15]" />
            </button>
          </>
        )}
      </div>

      {/* Recruiter Advisor Chatbot Widget */}
      <RecruiterAdvisor 
        config={config} 
        projects={projects} 
        certificates={certificates} 
        timeline={timeline} 
      />
    </div>
  );
};
