import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { triggerHaptic } from '../lib/haptics';
import { User, Folder, Award, Settings, Mail, Sparkles, Terminal, MoreHorizontal } from 'lucide-react';
import { ActiveAppId, OSConfig } from '../types';

interface DockProps {
  activeApp: ActiveAppId;
  openApp: (appId: 'bio' | 'projects' | 'lab' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'gdrive' | 'calendar' | 'terminal') => void;
  openAppsList: { [key: string]: boolean };
  minimizedApps?: { [key: string]: boolean };
  config: OSConfig;
  icons?: any[];
}

const dockItemsDef = [
  { id: 'bio', label: 'O mnie', icon: <User size={18} />, color: 'hover:text-purple-400' },
  { id: 'projects', label: 'Projekty', icon: <Folder size={18} />, color: 'hover:text-cyan-400' },
  { id: 'certificates', label: 'Certyfikaty', icon: <Award size={18} />, color: 'hover:text-pink-400' },
  { id: 'terminal', label: 'Terminal', icon: <Terminal size={18} />, color: 'hover:text-green-400' },
  { id: 'settings', label: 'Ustawienia', icon: <Settings size={18} />, color: 'hover:text-purple-400' },
  { id: 'contact', label: 'Kontakt', icon: <Mail size={18} />, color: 'hover:text-emerald-400' },
  { id: 'wizard', label: 'Kreator', icon: <Sparkles size={18} />, color: 'hover:text-amber-400 text-amber-300' }
];

function DockItem({ item, mouseX, isMobile, isOpen, isActive, openApp, setShowMoreMenu, dotColorClass }: any) {
  const ref = useRef<HTMLButtonElement>(null);

  // MacOS magnification math
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  
  // Only magnify on desktop
  const scaleSync = useTransform(distance, [-100, 0, 100], [1, isMobile ? 1 : 1.4, 1]);
  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative group flex flex-col items-center flex-initial shrink-0 z-10 hover:z-20 mx-1">
      {/* Tooltip */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-0 md:group-hover:opacity-100 scale-95 md:group-hover:scale-100 transition-all duration-200 pointer-events-none bg-black/85 border border-white/10 text-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-sans font-medium tracking-wide whitespace-nowrap shadow-md z-[1000]">
        {item.label}
      </div>

      <motion.button
        ref={ref}
        id={`dock-btn-${item.id}`}
        type="button"
        aria-label={item.label}
        style={{ scale: isMobile ? 1 : scale }}
        whileHover={{ scale: isMobile ? 1.12 : undefined }}
        whileTap={{ scale: 0.88 }}
        onClick={() => {
          triggerHaptic('light');
          if (item.id === 'more') {
            setShowMoreMenu((prev: boolean) => !prev);
          } else {
            openApp(item.id);
            if (isMobile) setShowMoreMenu(false);
          }
        }}
        className={`
          w-12 h-12 md:w-11 md:h-11 rounded-xl 
          bg-white/5 border border-white/5
          md:hover:bg-white/10 md:hover:border-white/10
          text-slate-300 ${item.color}
          transition-colors duration-200 ease-out
          flex items-center justify-center
          relative origin-bottom
          ${isActive ? 'bg-white/15 text-white border-white/20 shadow-lg shadow-white/5' : ''}
        `}
      >
        <span className="flex items-center justify-center pointer-events-none">
          {isMobile ? React.cloneElement(item.icon, { size: 24 }) : item.icon}
        </span>
      </motion.button>

      {/* Active/Open status indicators */}
      {isOpen && (
        <span className={`absolute bottom-1 md:-bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-all duration-300 ${
          isActive ? dotColorClass : 'bg-white/30 shadow-none'
        }`} />
      )}
    </div>
  );
}

export const Dock: React.FC<DockProps> = ({
  activeApp,
  openApp,
  openAppsList,
  minimizedApps = {},
  config,
  icons
}) => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  const mouseX = useMotionValue(Infinity);

  useEffect(() => {
    let frameId: number;
    const handleResize = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < 768);
      });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  const dotColorClass = {
    purple: 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]',
    cyan: 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]',
    orange: 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]',
    emerald: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
    'amber-retro': 'bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]',
    'mono-terminal': 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]',
    'black-gold': 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    'white-clean': 'bg-slate-800 shadow-none'
  }[config.accentColor || 'purple'] || 'bg-purple-400';

  // Filter dock items based on icons list
  const getFilteredDockItems = (items: typeof dockItemsDef) => {
    if (!icons) return items;
    return items.filter(item => {
      // settings is always allowed in dock
      if (item.id === 'settings') return true;
      return icons.some(icon => icon.appId === item.id);
    });
  };

  let displayedItems = getFilteredDockItems(dockItemsDef);
  let moreItems: typeof dockItemsDef = [];
  
  if (isMobile) {
    const mainIds = ['bio', 'projects', 'wizard', 'contact'];
    displayedItems = getFilteredDockItems(dockItemsDef.filter(item => mainIds.includes(item.id)));
    moreItems = getFilteredDockItems(dockItemsDef.filter(item => !mainIds.includes(item.id)));
    displayedItems.push({ id: 'more', label: 'Więcej', icon: <MoreHorizontal size={24} />, color: 'hover:text-white' } as any);
  }

  return (
    <>
      {isMobile && showMoreMenu && (
        <div className="fixed bottom-20 left-4 right-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 grid grid-cols-4 gap-4 z-[999] shadow-2xl">
          {moreItems.map(item => {
            const isOpen = openAppsList[item.id];
            const isActive = activeApp === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                onClick={() => {
                  triggerHaptic('light');
                  openApp(item.id as any);
                  setShowMoreMenu(false);
                }}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-300'}`}
              >
                {React.cloneElement(item.icon as any, { size: 24 })}
                <span className="text-[10px] whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">{item.label}</span>
                {isOpen && <div className={`w-1 h-1 rounded-full mt-1 ${isActive ? dotColorClass : 'bg-white/30'}`} />}
              </button>
            );
          })}
        </div>
      )}
      
      <motion.div 
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`flex fixed bottom-0 md:bottom-2 left-0 right-0 md:left-1/2 md:-translate-x-1/2 z-[999] md:w-auto px-4 py-3 md:px-6 md:py-2 bg-black/80 md:bg-white/5 border-t md:border border-white/10 backdrop-blur-xl md:rounded-3xl md:shadow-[0_15px_35px_rgba(0,0,0,0.65)] items-center justify-around md:justify-start md:gap-1 select-none ${isMobile ? 'pb-8' : ''}`}
      >
        {displayedItems.map((item) => {
          const isOpen = item.id !== 'more' && openAppsList[item.id];
          const isActive = item.id !== 'more' ? activeApp === item.id : showMoreMenu;

          return (
            <DockItem 
              key={item.id}
              item={item}
              mouseX={mouseX}
              isMobile={isMobile}
              isOpen={isOpen}
              isActive={isActive}
              openApp={openApp}
              setShowMoreMenu={setShowMoreMenu}
              dotColorClass={dotColorClass}
            />
          );
        })}
      </motion.div>
    </>
  );
};
