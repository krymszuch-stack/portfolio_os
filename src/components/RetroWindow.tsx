import React from 'react';
import { motion } from 'motion/react';
import { OSConfig } from '../types';

interface RetroWindowProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  config?: OSConfig;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({
  title,
  onClose,
  children,
  className = '',
  config
}) => {
  const activeTheme = config?.systemTheme || 'terraria';
  const isChunky = config?.windowStyle === 'sharp-chunky';

  // Styles map for the window components
  const windowStyles: Record<string, {
    container: string;
    titleBar: string;
    titleText: string;
    body: string;
  }> = {
    'terraria': {
      container: 'bg-[#ebdcb9] border-black text-[#5d4037]',
      titleBar: 'bg-[#5d4037] border-b-4 border-[#3d2723] text-[#f1c40f]',
      titleText: 'text-[#f1c40f] drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]',
      body: 'bg-[#f5ebd5] text-[#3e2723]'
    },
    'classic-mac': {
      container: 'bg-[#E0E0E0] border-black text-black',
      titleBar: 'bg-[#B0B0B0] border-b-2 border-black text-black',
      titleText: 'text-black font-extrabold',
      body: 'bg-white text-black'
    },
    'cyberpunk': {
      container: 'bg-[#0d0e15] border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
      titleBar: 'bg-black border-b-2 border-pink-500 text-pink-500',
      titleText: 'text-pink-500 font-bold tracking-widest uppercase drop-shadow-[0_0_6px_rgba(236,72,153,0.5)]',
      body: 'bg-[#08090d] text-cyan-300'
    },
    'retro-gold': {
      container: 'bg-[#fdf6e3] border-yellow-950 text-amber-900',
      titleBar: 'bg-[#5c3e16] border-b-4 border-[#3e270f] text-yellow-400',
      titleText: 'text-yellow-400 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]',
      body: 'bg-[#fffdf6] text-amber-950'
    }
  };

  const currentStyle = windowStyles[activeTheme] || windowStyles['terraria'];
  const borderThickness = isChunky ? 'border-[6px]' : 'border-4';
  const corners = isChunky ? 'rounded-none' : 'rounded-xl';
  const controlBtnRadius = isChunky ? 'rounded-none' : 'rounded-full';
  const shadowEffect = isChunky 
    ? 'shadow-[12px_12px_0px_rgba(0,0,0,0.65)]' 
    : 'shadow-[8px_8px_0px_rgba(0,0,0,0.5)]';

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragListener={true}
      className={`fixed z-[150] flex flex-col overflow-hidden ${borderThickness} ${corners} ${shadowEffect} ${currentStyle.container} ${className}`}
      style={{ minWidth: '340px', minHeight: '220px' }}
    >
      {/* Dynamic Themed Title Bar */}
      <div className={`absolute top-0 left-0 right-0 z-30 h-12 px-4 flex items-center justify-between cursor-move shadow-md ${currentStyle.titleBar}`}>
        {/* Modern Control Buttons - Mac/Aero Style */}
        <div className="flex space-x-2 items-center">
          <button
            onClick={onClose}
            title="Zamknij"
            className={`w-6 h-6 flex items-center justify-center font-bold text-xs transition-all hover:scale-110 ${activeTheme === 'classic-mac' ? 'bg-red-500 text-white rounded-full border-2 border-black' : 'bg-red-500/80 text-white rounded-lg'}`}
          >
            ✕
          </button>
          <button
            className={`w-6 h-6 flex items-center justify-center font-bold transition-all hover:scale-110 ${activeTheme === 'classic-mac' ? 'bg-yellow-400 rounded-full border-2 border-black' : 'bg-yellow-500/70 rounded-lg'}`}
            title="Minimalizuj"
          >
            −
          </button>
          <button
            className={`w-6 h-6 flex items-center justify-center font-bold transition-all hover:scale-110 ${activeTheme === 'classic-mac' ? 'bg-green-500 rounded-full border-2 border-black' : 'bg-green-500/70 rounded-lg'}`}
            title="Maksymalizuj"
          >
            ▢
          </button>
        </div>

        {/* Window Title */}
        <span className={`font-bold font-mono text-sm truncate absolute left-1/2 transform -translate-x-1/2 select-none pointer-events-none ${currentStyle.titleText}`}>
          {title}
        </span>

        {/* Right empty anchor for symmetry */}
        <div className="w-20 h-4" />
      </div>

      {/* Window Content Body */}
      <div className={`px-5 pb-5 overflow-auto font-mono flex-1 ${currentStyle.body}`} style={{ maxHeight: '70vh', paddingTop: '44px' }}>
        {children}
      </div>
    </motion.div>
  );
};
