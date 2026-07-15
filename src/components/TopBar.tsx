import React, { useState, useEffect } from 'react';
import { OSConfig } from '../types';
import { Cloud, CloudUpload, CloudOff, Key, Menu, X } from 'lucide-react';

interface TopBarProps {
  config: OSConfig;
  syncStatus?: 'synced' | 'saving' | 'error';
  onRetrySync?: () => void;
  guestMode?: boolean;
  onLoginClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ config, syncStatus, onRetrySync, guestMode, onLoginClick }) => {
  const [time, setTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const activeTheme = config?.systemTheme || 'terraria';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const format = config?.clockFormat || '24h';
      if (format === '12h') {
        setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      } else {
        setTime(now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', hour12: false }));
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [config?.clockFormat]);

  // Color mapping based on Terraria, Classic Mac, Cyberpunk or Golden Retro theme
  const themeStyles: Record<string, { bar: string; apple: string; time: string; status: string; dot: string }> = {
    'terraria': {
      bar: 'bg-[#4e342e] border-b-4 border-[#3e2723] text-[#f1c40f]',
      apple: 'text-emerald-400',
      time: 'text-[#f1c40f] text-2xl font-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]',
      status: 'text-emerald-400 font-bold',
      dot: 'bg-green-500 border-green-950 shadow-[0_0_8px_rgba(34,197,94,0.8)]'
    },
    'classic-mac': {
      bar: 'bg-[#DCDCDC] border-b-4 border-black text-black',
      apple: 'text-black',
      time: 'text-black text-xl font-extrabold',
      status: 'text-black font-extrabold uppercase',
      dot: 'bg-green-500 border-black shadow-none'
    },
    'cyberpunk': {
      bar: 'bg-black border-b-2 border-cyan-500 text-cyan-400 shadow-[0_3px_15px_rgba(6,182,212,0.4)]',
      apple: 'text-pink-500 animate-pulse',
      time: 'text-cyan-400 text-2xl font-black drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]',
      status: 'text-pink-500 font-black animate-pulse tracking-widest',
      dot: 'bg-pink-500 border-cyan-400 shadow-[0_0_12px_rgba(236,72,153,0.9)] animate-ping'
    },
    'retro-gold': {
      bar: 'bg-[#5c3e16] border-b-4 border-[#3e270f] text-[#f39c12]',
      apple: 'text-yellow-500',
      time: 'text-yellow-400 text-2xl font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]',
      status: 'text-yellow-300 font-bold',
      dot: 'bg-yellow-400 border-yellow-950 shadow-[0_0_8px_rgba(234,179,8,0.8)]'
    }
  };

  const currentStyle = themeStyles[activeTheme] || themeStyles['terraria'];

  const hasSyncOrAuth = syncStatus || (guestMode && onLoginClick);

  return (
    <div className={`fixed top-0 left-0 right-0 h-12 z-[100] flex items-center justify-between px-6 font-mono border-black ${currentStyle.bar}`}>
      <div className="flex items-center gap-4 font-bold select-none">
        <span className="tracking-widest text-sm uppercase">{config?.portfolioName ? `${config.portfolioName} OS` : 'AdrianOS'}</span>
      </div>
      <div className={currentStyle.time}>{time}</div>
      <div className="flex items-center gap-3 select-none relative">
        {/* Compact status dot — visible sync indicator */}
        {syncStatus && (
          <div className="flex items-center" title={
            syncStatus === 'saving' ? 'Zapisywanie...' :
            syncStatus === 'synced' ? 'Zsynchronizowano' :
            'Błąd synchronizacji'
          }>
            <div className={`w-2 h-2 rounded-full transition-all ${
              syncStatus === 'saving' ? 'bg-yellow-400 animate-pulse' :
              syncStatus === 'synced' ? 'bg-green-400' :
              'bg-red-500'
            }`} />
          </div>
        )}

        <span className={`text-xs tracking-wider uppercase font-bold ${currentStyle.status}`}>Status: Dostępny</span>

        {/* Compact menu toggle for sync/auth controls */}
        {hasSyncOrAuth && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Menu systemowe"
          >
            {menuOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        )}

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute top-12 right-0 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-3 min-w-[220px] space-y-2 z-50">
            {syncStatus && (
              <div className="space-y-1.5 pb-2 border-b border-white/10">
                {syncStatus === 'saving' && (
                  <span className="text-[10px] text-yellow-400 font-bold uppercase animate-pulse flex items-center gap-1.5">
                    <CloudUpload size={12} className="animate-bounce" /> Zapisywanie...
                  </span>
                )}
                {syncStatus === 'synced' && (
                  <span className="text-[10px] text-green-400 font-bold uppercase flex items-center gap-1.5" title="Zsynchronizowano z chmurą">
                    <Cloud size={12} /> Zsynchronizowano z chmurą
                  </span>
                )}
                {syncStatus === 'error' && (
                  <button
                    onClick={() => { onRetrySync?.(); setMenuOpen(false); }}
                    className="text-[10px] text-red-500 hover:underline font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <CloudOff size={12} /> Błąd synchronizacji (Ponów)
                  </button>
                )}
              </div>
            )}
            {guestMode && onLoginClick && (
              <button
                onClick={() => { onLoginClick(); setMenuOpen(false); }}
                className="w-full text-[10px] text-amber-400 hover:bg-amber-400/10 font-bold uppercase cursor-pointer flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-amber-400/20 transition-colors"
              >
                <Key size={11} /> Połącz z chmurą
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
