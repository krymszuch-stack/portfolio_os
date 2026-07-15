import React, { useEffect, useState } from 'react';
import { Terminal, Activity, MessageSquare, Radar, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';

// === 1. Terminal Osiągnięć Widget (Zastępuje dawny Notatnik) ===
export const TerminalAchievementsWidget = () => {
  const achievements = [
    "[SYS] Zainicjowano Portfolio OS v2.0",
    "[DEV] Ukończono architekturę opartą o Vite + React",
    "[ACH] Zaimplementowano unikalny interfejs graficzny",
    "[SEC] Wdrożono reguły bezpieczeństwa Firestore",
    "[AI] Podłączono moduł kompilatora AI (Gemini Pro)",
    "[SYS] Oczekiwanie na interakcję rekrutera..."
  ];
  
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < achievements.length) {
        setLines(prev => [...prev, achievements[current]]);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full w-full justify-between select-none p-3 relative overflow-hidden bg-slate-950/80 rounded-2xl border border-white/10/50 shadow-inner">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="flex justify-between items-start relative z-10 mb-2 border-b border-white/10 pb-2">
        <div>
          <h4 className="text-[13px] font-bold text-slate-200 leading-tight flex items-center gap-1.5">
            <Terminal size={14} className="text-green-400" />
            Terminal Osiągnięć
          </h4>
        </div>
        <div className="flex gap-1.5 mt-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-1.5 text-slate-300 relative z-10">
        {lines.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${line.includes('[SYS]') ? 'text-blue-400' : line.includes('[ACH]') ? 'text-yellow-400' : line.includes('[AI]') ? 'text-purple-400' : 'text-green-400'}`}
          >
            <span className="opacity-50 select-none mr-1.5">~</span>
            {line}
          </motion.div>
        ))}
        <motion.div 
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-3 bg-green-400 inline-block align-middle ml-1"
        />
      </div>
    </div>
  );
};

// === 2. Tech Radar Widget ===
export const TechRadarWidget = () => (
  <div className="flex flex-col h-full w-full justify-between select-none p-3 relative overflow-hidden bg-slate-900/60 rounded-2xl border border-indigo-500/20 backdrop-blur-md">
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <h4 className="text-[13px] font-bold text-white leading-tight flex items-center gap-1.5">
          <Radar size={14} className="text-indigo-400" />
          Tech Radar
        </h4>
        <p className="text-[10px] text-slate-400 mt-0.5">Core Stack</p>
      </div>
      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
    </div>
    
    <div className="flex-1 mt-4 relative flex items-center justify-center z-10">
      <div className="w-full max-w-[120px] aspect-square border border-indigo-500/30 rounded-full flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]">
        <div className="w-[66%] h-[66%] border border-indigo-500/40 rounded-full flex items-center justify-center relative">
          <div className="w-[33%] h-[33%] border border-indigo-500/50 rounded-full bg-indigo-500/10" />
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan] z-20" title="React" />
          <div className="absolute bottom-1 -left-1 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_purple] z-20" title="Node.js" />
          <div className="absolute top-1/2 -left-2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_orange] z-20" title="TypeScript" />
          <div className="absolute -bottom-2 right-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] z-20" title="Tailwind" />
          <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-indigo-500/10 to-indigo-400/80 origin-left animate-spin-slow z-10" style={{ animationDuration: '4s' }} />
        </div>
      </div>
    </div>
    
    <div className="flex justify-between items-center text-[10px] mt-3 text-indigo-200/70 relative z-10">
      <span>React, TS, Node, AI</span>
      <span className="font-mono bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-300">Lv.99</span>
    </div>
  </div>
);

// === 3. GitHub Activity Widget ===
export const GitHubActivityWidget = () => (
  <div className="flex flex-col h-full w-full justify-between select-none p-3 relative overflow-hidden bg-slate-900/60 rounded-2xl border border-emerald-500/20 backdrop-blur-md">
    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <h4 className="text-[13px] font-bold text-white leading-tight flex items-center gap-1.5">
          <Activity size={14} className="text-emerald-400" />
          Aktywność
        </h4>
        <p className="text-[10px] text-slate-400 mt-0.5">Ostatnie 30 dni</p>
      </div>
      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-md border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
        +320 C
      </span>
    </div>
    
    <div className="flex-1 mt-4 relative z-10 flex flex-col justify-end">
      <div className="flex gap-1.5 items-end h-[70px] w-full opacity-90 px-1">
        {Array.from({length: 30}).map((_, i) => {
          const height = Math.random() * 100;
          const isHigh = height > 75;
          const isMed = height > 40 && !isHigh;
          const isLow = height <= 40 && height > 10;
          let color = 'bg-slate-700/50';
          if (isHigh) color = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
          else if (isMed) color = 'bg-emerald-500/70';
          else if (isLow) color = 'bg-emerald-600/40';

          return (
            <div 
              key={i} 
              className={`flex-1 rounded-sm transition-all duration-300 hover:brightness-125 ${color}`}
              style={{ height: `${Math.max(15, height)}%` }}
            />
          );
        })}
      </div>
      <div className="w-full h-[1px] bg-slate-700/50 mt-1" />
    </div>
  </div>
);

// === 4. Quick Contact Widget ===
export const QuickContactWidget = () => (
  <div className="flex flex-col h-full w-full justify-between select-none p-3 relative overflow-hidden group bg-slate-900/60 rounded-2xl border border-blue-500/20 backdrop-blur-md">
    <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none group-hover:bg-blue-500/30 transition-colors" />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <h4 className="text-[13px] font-bold text-white leading-tight flex items-center gap-1.5">
          <MessageSquare size={14} className="text-blue-400" />
          Szybki Kontakt
        </h4>
        <p className="text-[10px] text-slate-400 mt-0.5">Zazwyczaj odpisuję w 1h</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
        <Zap size={14} className="relative z-10" />
      </div>
    </div>
    
    <div className="mt-4 bg-black/50 rounded-xl p-2.5 border border-white/5 relative z-10 shadow-inner">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
        <span className="text-[11px] text-white font-medium">Dostępny (Gotowy do rozmowy)</span>
      </div>
    </div>
    
    <button className="mt-3 w-full py-2 rounded-xl bg-blue-600/90 text-white text-[11px] font-bold shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:bg-blue-500 transition-all relative z-10 active:scale-95 flex justify-center items-center gap-1.5">
      Rozpocznij konwersację <ChevronRight size={12} />
    </button>
  </div>
);

// === UNIFIED WIDGETS SIDEBAR ===
interface WidgetsSidebarProps {
  onWidgetClick?: (type: string) => void;
}

export const WidgetsSidebar: React.FC<WidgetsSidebarProps> = ({ onWidgetClick }) => {
  return (
    <div className="w-72 h-full hidden md:flex flex-col gap-4 p-4 pr-6 shrink-0 overflow-y-auto custom-scrollbar">
      {/* Czas i data w stylu iOS */}
      <div className="px-2 select-none mb-2">
        <h2 className="text-4xl font-extrabold text-white/90 drop-shadow-md tracking-tighter">
          {new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
        </h2>
        <p className="text-sm font-bold text-white/60 drop-shadow-sm ml-1 uppercase tracking-wider">
          {new Date().toLocaleDateString('pl-PL', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="h-44 shrink-0"
        onClick={() => onWidgetClick?.('terminal')}
      >
        <TerminalAchievementsWidget />
      </motion.div>

      <div className="grid grid-cols-2 gap-3 shrink-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="h-40 cursor-pointer"
          onClick={() => onWidgetClick?.('projects')}
        >
          <GitHubActivityWidget />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="h-40 cursor-pointer"
          onClick={() => onWidgetClick?.('bio')}
        >
          <TechRadarWidget />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="h-36 shrink-0 cursor-pointer"
        onClick={() => onWidgetClick?.('contact')}
      >
        <QuickContactWidget />
      </motion.div>
    </div>
  );
};
