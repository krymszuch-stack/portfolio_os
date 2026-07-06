/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Folder, FlaskConical, Award, Settings, Mail, Sparkles, HardDrive, Calendar } from 'lucide-react';
import { ActiveAppId, OSConfig } from '../types';

interface DockProps {
  activeApp: ActiveAppId;
  openApp: (appId: 'bio' | 'projects' | 'lab' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'gdrive' | 'calendar') => void;
  openAppsList: { [key: string]: boolean };
  config: OSConfig;
}

export const Dock: React.FC<DockProps> = ({
  activeApp,
  openApp,
  openAppsList,
  config
}) => {
  
  const dockItems = [
    { id: 'bio', label: 'O mnie', icon: <User size={18} />, color: 'hover:text-purple-400' },
    { id: 'projects', label: 'Projekty', icon: <Folder size={18} />, color: 'hover:text-cyan-400' },
    { id: 'lab', label: 'Sprinty', icon: <FlaskConical size={18} />, color: 'hover:text-orange-400' },
    { id: 'certificates', label: 'Certyfikaty', icon: <Award size={18} />, color: 'hover:text-pink-400' },
    { id: 'gdrive', label: 'Google Drive', icon: <HardDrive size={18} />, color: 'hover:text-blue-400' },
    { id: 'calendar', label: 'Kalendarz', icon: <Calendar size={18} />, color: 'hover:text-emerald-400' },
    { id: 'settings', label: 'Ustawienia', icon: <Settings size={18} />, color: 'hover:text-purple-400' },
    { id: 'contact', label: 'Kontakt', icon: <Mail size={18} />, color: 'hover:text-emerald-400' },
    { id: 'wizard', label: 'Kreator', icon: <Sparkles size={18} />, color: 'hover:text-amber-400 text-amber-300' }
  ];

  const dotColorClass = {
    purple: 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]',
    cyan: 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]',
    orange: 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.8)]',
    emerald: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
  }[config.accentColor || 'purple'];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] px-6 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-end gap-3 select-none">
      
      {dockItems.map((item) => {
        const isOpen = openAppsList[item.id];
        const isActive = activeApp === item.id;

        return (
          <div key={item.id} className="relative group flex flex-col items-center">
            {/* Tooltip */}
            <div className="absolute bottom-16 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none bg-black/60 border border-white/10 text-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-sans font-medium tracking-wide whitespace-nowrap shadow-md">
              {item.label}
            </div>

            {/* Icon Button wrapper */}
            <button
              id={`dock-btn-${item.id}`}
              onClick={() => openApp(item.id)}
              className={`
                p-2.5 rounded-xl 
                bg-white/5 border border-white/5
                hover:bg-white/10 hover:border-white/10 hover:scale-110
                text-slate-300 ${item.color}
                transition-all duration-200 ease-out
                flex items-center justify-center
                relative
                ${isActive ? 'bg-white/15 text-white border-white/20 scale-105 shadow-lg shadow-white/5' : ''}
              `}
            >
              {item.icon}
            </button>

            {/* Active/Open status indicators */}
            {isOpen && (
              <span className={`absolute -bottom-1.5 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive ? dotColorClass : 'bg-white/30 shadow-none'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};
