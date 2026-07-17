import React, { useState, useEffect } from 'react';
import { OSConfig } from '../types';
import { Cloud, CloudUpload, CloudOff, Key, Menu, X, AlertCircle } from 'lucide-react';

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

  // Simplified, modern theme color mapping
  const themeStyles: Record<string, { bar: string; time: string; icon: string; accent: string }> = {
    'terraria': {
      bar: 'bg-[#4e342e]/95 border-b border-[#3e2723]/50 text-[#f1c40f]',
      time: 'text-[#f1c40f] text-lg font-semibold',
      icon: 'text-emerald-400',
      accent: 'text-emerald-400'
    },
    'classic-mac': {
      bar: 'bg-[#DCDCDC]/95 border-b border-black/20 text-black',
      time: 'text-black text-lg font-semibold',
      icon: 'text-black',
      accent: 'text-black'
    },
    'cyberpunk': {
      bar: 'bg-black/95 border-b border-cyan-500/50 text-cyan-400',
      time: 'text-cyan-400 text-lg font-semibold',
      icon: 'text-pink-500',
      accent: 'text-pink-500'
    },
    'retro-gold': {
      bar: 'bg-[#5c3e16]/95 border-b border-[#3e270f]/50 text-[#f39c12]',
      time: 'text-[#f39c12] text-lg font-semibold',
      icon: 'text-yellow-400',
      accent: 'text-yellow-300'
    }
  };

  const currentStyle = themeStyles[activeTheme] || themeStyles['terraria'];
  const hasSyncOrAuth = syncStatus || (guestMode && onLoginClick);

  return (
    <div className={`fixed top-0 left-0 right-0 h-11 z-[100] flex items-center justify-between px-4 font-sans border-black backdrop-blur-sm ${currentStyle.bar}`}>
      {/* Left: System name */}
      <div className="flex items-center select-none">
        <span className="text-xs font-bold tracking-wide uppercase opacity-75">
          {config?.portfolioName ? `${config.portfolioName}` : 'Adrian'} OS
        </span>
      </div>

      {/* Center: Time - Large and prominent */}
      <div className={`${currentStyle.time} font-mono tabular-nums`}>
        {time}
      </div>

      {/* Right: Status and controls - Minimal and clean */}
      <div className="flex items-center gap-2 select-none relative">
        {/* Sync indicator - compact and clear */}
        {syncStatus && (
          <div className="flex items-center gap-1.5" title={
            syncStatus === 'saving' ? 'Zapisywanie...' :
            syncStatus === 'synced' ? 'Zsynchronizowano' :
            'Błąd synchronizacji'
          }>
            {syncStatus === 'saving' && (
              <>
                <CloudUpload size={13} className={`${currentStyle.accent} animate-bounce`} />
              </>
            )}
            {syncStatus === 'synced' && (
              <Cloud size={13} className={currentStyle.accent} />
            )}
            {syncStatus === 'error' && (
              <AlertCircle size={13} className="text-red-500 animate-pulse" />
            )}
          </div>
        )}

        {/* Menu toggle - only show if needed */}
        {hasSyncOrAuth && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors cursor-pointer ${
              menuOpen ? `${currentStyle.accent} bg-white/10` : `${currentStyle.icon} hover:bg-white/5`
            }`}
            aria-label="Menu systemowe"
          >
            {menuOpen ? <X size={13} /> : <Menu size={13} />}
          </button>
        )}

        {/* Dropdown menu - clean and modern */}
        {menuOpen && (
          <div className={`absolute top-10 right-0 backdrop-blur-xl rounded-lg shadow-lg p-3 min-w-max z-50 ${
            activeTheme === 'classic-mac' 
              ? 'bg-[#DCDCDC]/95 border border-black/20' 
              : 'bg-black/80 border border-white/10'
          }`}>
            <div className="space-y-1.5">
              {syncStatus && (
                <div className="pb-2 border-b border-white/10">
                  {syncStatus === 'saving' && (
                    <div className={`text-xs font-semibold uppercase flex items-center gap-2 ${currentStyle.accent}`}>
                      <CloudUpload size={12} className="animate-bounce" /> 
                      <span>Zapisywanie...</span>
                    </div>
                  )}
                  {syncStatus === 'synced' && (
                    <div className={`text-xs font-semibold uppercase flex items-center gap-2 ${currentStyle.accent}`}>
                      <Cloud size={12} /> 
                      <span>Zsynchronizowano</span>
                    </div>
                  )}
                  {syncStatus === 'error' && (
                    <button
                      onClick={() => { onRetrySync?.(); setMenuOpen(false); }}
                      className={`text-xs font-semibold uppercase flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity text-red-500`}
                    >
                      <CloudOff size={12} /> 
                      <span>Ponów sync</span>
                    </button>
                  )}
                </div>
              )}
              {guestMode && onLoginClick && (
                <button
                  onClick={() => { onLoginClick(); setMenuOpen(false); }}
                  className={`w-full text-xs font-semibold uppercase cursor-pointer flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                    activeTheme === 'classic-mac'
                      ? 'text-black hover:bg-black/10'
                      : 'text-amber-400 hover:bg-amber-400/10'
                  }`}
                >
                  <Key size={12} /> 
                  <span>Połącz z chmurą</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
