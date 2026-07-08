import React, { useState, useEffect } from 'react';
import { OSConfig } from '../types';
import { Cloud, CloudUpload, CloudOff, Key } from 'lucide-react';

interface TopBarProps {
  config: OSConfig;
  syncStatus?: 'synced' | 'saving' | 'error';
  onRetrySync?: () => void;
  guestMode?: boolean;
  onLoginClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ config, syncStatus, onRetrySync, guestMode, onLoginClick }) => {
  const [time, setTime] = useState('');
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

  return (
    <div className={`fixed top-0 left-0 right-0 h-12 z-[100] flex items-center justify-between px-6 font-mono border-black ${currentStyle.bar}`}>
      <div className="flex items-center gap-4 font-bold select-none">
        <span className="tracking-widest text-sm uppercase">{config?.portfolioName ? `${config.portfolioName} OS` : 'AdrianOS'}</span>
      </div>
      <div className={currentStyle.time}>{time}</div>
      <div className="flex items-center gap-3 select-none">
        {syncStatus && (
          <div className="flex items-center gap-1.5 mr-2">
            {syncStatus === 'saving' && (
              <span className="text-[10px] text-yellow-400 font-bold uppercase animate-pulse flex items-center gap-1">
                <CloudUpload size={11} className="animate-bounce" /> Zapisywanie...
              </span>
            )}
            {syncStatus === 'synced' && (
              <span className="text-[10px] text-green-400 font-bold uppercase flex items-center gap-1" title="Zsynchronizowano z chmurą">
                <Cloud size={11} /> Zsynchronizowano
              </span>
            )}
            {syncStatus === 'error' && (
              <button 
                onClick={onRetrySync}
                className="text-[10px] text-red-500 hover:underline font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <CloudOff size={11} /> Błąd synchronizacji (Ponów)
              </button>
            )}
          </div>
        )}
        {guestMode && onLoginClick && (
          <button 
            onClick={onLoginClick}
            className="text-[10px] text-amber-400 hover:bg-amber-400/10 hover:underline font-bold uppercase mr-2 cursor-pointer flex items-center gap-1 px-2 py-1 rounded border border-amber-400/20"
          >
            <Key size={10} /> Połącz z chmurą
          </button>
        )}
        <span className={`text-xs tracking-wider uppercase font-bold ${currentStyle.status}`}>Status: Dostępny</span>
      </div>
    </div>
  );
};
