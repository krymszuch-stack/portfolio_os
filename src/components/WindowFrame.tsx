/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, useDragControls, useMotionValue, animate } from 'motion/react';
import { Minus, Square, X, RotateCcw } from 'lucide-react';
import { OSConfig } from '../types';

interface WindowFrameProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onFocus: () => void;
  zIndex: number;
  config: OSConfig;
  children: React.ReactNode;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  id,
  title,
  isOpen,
  onClose,
  onFocus,
  zIndex,
  config,
  children,
  isMinimized,
  onMinimize
}) => {
  const [layoutMode, setLayoutMode] = useState<'floating' | 'full' | 'left-half' | 'right-half'>('floating');
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const hoverTimer = React.useRef<NodeJS.Timeout | null>(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMinimize = (e: React.MouseEvent) => {
    if (onMinimize) onMinimize();
    handleControlClick(e);
  };
  
  const handleSnap = (mode: 'floating' | 'full' | 'left-half' | 'right-half') => {
    setLayoutMode(mode);
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
    animate(y, 0, { type: 'spring', stiffness: 300, damping: 30 });
    setShowLayoutMenu(false);
  };

  const handleDragEnd = (e: any, info: any) => {
    const { x: pointerX, y: pointerY } = info.point;
    const screenW = window.innerWidth;
    
    if (pointerX < 30) handleSnap('left-half');
    else if (pointerX > screenW - 30) handleSnap('right-half');
    else if (pointerY < 30) handleSnap('full');
    else setLayoutMode('floating');
  };
  

  if (!isOpen) return null;

  // Real-time custom color configuration
  const accentClasses = {
    purple: {
      border: 'border-purple-500/30',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.15)]',
      text: 'text-purple-400',
      bgGlow: 'bg-purple-500/10'
    },
    cyan: {
      border: 'border-cyan-500/30',
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.15)]',
      text: 'text-cyan-400',
      bgGlow: 'bg-cyan-500/10'
    },
    orange: {
      border: 'border-orange-500/30',
      glow: 'shadow-[0_0_25px_rgba(249,115,22,0.15)]',
      text: 'text-orange-400',
      bgGlow: 'bg-orange-500/10'
    },
    emerald: {
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.15)]',
      text: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/10'
    },
    'amber-retro': {
      border: 'border-yellow-500/40',
      text: 'text-yellow-400',
      bgHeader: 'bg-yellow-950/40',
      bgGlow: 'bg-yellow-500/10'
    },
    'mono-terminal': {
      border: 'border-green-500/40',
      text: 'text-green-400',
      bgHeader: 'bg-green-950/40',
      bgGlow: 'bg-green-500/10'
    }
  }[config.accentColor || 'purple'];

  // Apply custom glow intensity multiplier
  const glowStyle = {
    boxShadow: config.glowIntensity > 0 
      ? `0 0 ${config.glowIntensity * 0.4}px ${
          config.accentColor === 'purple' ? 'rgba(168,85,247,0.2)' :
          config.accentColor === 'cyan' ? 'rgba(6,182,212,0.2)' :
          config.accentColor === 'orange' ? 'rgba(249,115,22,0.2)' :
          config.accentColor === 'amber-retro' ? 'rgba(234,179,8,0.2)' :
          config.accentColor === 'mono-terminal' ? 'rgba(34,197,94,0.2)' :
          'rgba(16,185,129,0.2)'
        }` 
      : 'none'
  };

  const windowVariants = {
    initial: {
      opacity: 0,
      scale: 0.92,
      y: 30,
      x: 0
    },
    animate: {
      opacity: isMinimized ? 0 : 1,
      scale: isMinimized ? 0.4 : 1,
      y: isMinimized ? window.innerHeight / 2 : 0,
      x: 0,
      pointerEvents: isMinimized ? "none" : "auto" as any,
      transition: { 
        type: 'spring',
        damping: 24,
        stiffness: 240
      }
    },
    exit: () => {
      const dockBtn = document.getElementById(`dock-btn-${id}`);
      const windowEl = document.getElementById(`window-${id}`);
      if (dockBtn && windowEl) {
        const dockRect = dockBtn.getBoundingClientRect();
        const winRect = windowEl.getBoundingClientRect();
        
        const winCenter = {
          x: winRect.left + winRect.width / 2,
          y: winRect.top + winRect.height / 2
        };
        const dockCenter = {
          x: dockRect.left + dockRect.width / 2,
          y: dockRect.top + dockRect.height / 2
        };
        
        return {
          x: dockCenter.x - winCenter.x,
          y: dockCenter.y - winCenter.y,
          scale: 0.05,
          opacity: 0,
          transition: {
            duration: 0.45,
            ease: [0.25, 1, 0.5, 1] // Smooth bezier curve for organic snapping
          }
        };
      }
      return {
        opacity: 0,
        scale: 0.92,
        y: 30,
        transition: { duration: 0.25 }
      };
    }
  };

  const handleControlClick = (e: React.MouseEvent) => {
    if ((window as any).triggerSparks) {
      (window as any).triggerSparks(e.clientX, e.clientY, 15);
    }
  };

  // Dynamic design variables based on config.glassBlur
  const blurClass = {
    none: 'backdrop-blur-none bg-black/65',
    low: 'backdrop-blur-md bg-black/45',
    medium: 'backdrop-blur-md bg-black/30',
    high: 'backdrop-blur-lg saturate-150 bg-black/25'
  }[config.glassBlur || 'medium'];

  // Dynamic border styling
  const borderClass = {
    none: 'border-0',
    thin: `border border-white/10 ${accentClasses.border}`,
    thick: `border-4 border-slate-700/80 ${accentClasses.border}`,
    double: `border-4 border-double border-slate-600/90 ${accentClasses.border}`
  }[config.borderStyle || 'thin'];

  return (
    <motion.div
      id={`window-${id}`}
      variants={windowVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ zIndex, x, y, ...glowStyle }}
      drag={layoutMode === "floating"}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onClick={onFocus}
      className={`
        fixed
        top-12 left-0 right-0 bottom-0 rounded-t-[28px] rounded-b-none border-t border-x border-white/10 border-b-0
        ${
          layoutMode === 'full' ? 'sm:absolute sm:top-4 sm:left-4 sm:right-4 sm:bottom-16 sm:rounded-2xl sm:border-b sm:w-auto sm:h-auto sm:max-w-none' :
          layoutMode === 'left-half' ? 'sm:absolute sm:top-4 sm:left-4 sm:right-1/2 sm:bottom-16 sm:rounded-2xl sm:border-b sm:w-auto sm:h-auto sm:max-w-none mr-2' :
          layoutMode === 'right-half' ? 'sm:absolute sm:top-4 sm:left-1/2 sm:right-4 sm:bottom-16 sm:rounded-2xl sm:border-b sm:w-auto sm:h-auto sm:max-w-none ml-2' :
          'sm:absolute sm:top-[12%] sm:left-[15%] sm:w-[70%] sm:h-[70vh] sm:max-w-4xl sm:rounded-2xl sm:border-b'
        }
        flex flex-col
        ${borderClass}
        ${blurClass}
        overflow-hidden
        transition-all duration-300
        window-box
      `}
    >
      {/* Decorative inner glow */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] ${accentClasses.bgGlow} pointer-events-none`} />

      {/* Title Bar */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-black/25 border-b border-white/5 select-none cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => { if (layoutMode === "floating") dragControls.start(e); }}
        onDoubleClick={() => handleSnap(layoutMode === "full" ? "floating" : "full")}
      >
        <div className="flex items-center space-x-2">
          {/* Active indicator dot */}
          <span className={`w-2 h-2 rounded-full ${
            config.accentColor === 'purple' ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]' :
            config.accentColor === 'cyan' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]' :
            config.accentColor === 'orange' ? 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.6)]' :
            config.accentColor === 'amber-retro' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]' :
            config.accentColor === 'mono-terminal' ? 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
            'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
          }`} />
          <span className={config.pixelTheme ? 'pixel-heading text-slate-300 uppercase' : 'font-sans font-medium text-xs tracking-wide text-slate-300'}>
            {title}
          </span>
        </div>

        {/* Windows Control Actions */}
        <div className="flex items-center space-x-2">
          <button
            id={`btn-minimize-${id}`}
            onClick={handleMinimize}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors hidden sm:inline-flex"
            title="Minimalizuj"
          >
            <Minus size={14} />
          </button>
          <button
            id={`btn-maximize-${id}`}
            onClick={(e) => {
              handleControlClick(e);
              handleSnap(layoutMode === 'full' ? 'floating' : 'full');
            }}
            onMouseEnter={() => { hoverTimer.current = setTimeout(() => setShowLayoutMenu(true), 400); }}
            onMouseLeave={() => { if (hoverTimer.current) clearTimeout(hoverTimer.current); setShowLayoutMenu(false); }}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors hidden sm:inline-flex relative"
            title={layoutMode === 'full' ? "Przywróć" : "Maksymalizuj"}

          >
            {layoutMode === 'full' ? <RotateCcw size={14} /> : <Square size={13} />}
            {showLayoutMenu && (
              <div className="absolute top-full right-0 mt-2 p-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl flex gap-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div 
                  onClick={(e) => { e.stopPropagation(); handleSnap('left-half'); }}
                  className="w-10 h-8 border-2 border-white/20 rounded hover:border-amber-400 cursor-pointer flex"
                ><div className="w-1/2 h-full bg-white/20"></div></div>
                <div 
                  onClick={(e) => { e.stopPropagation(); handleSnap('full'); }}
                  className="w-10 h-8 border-2 border-white/20 rounded hover:border-amber-400 cursor-pointer bg-white/20"
                ></div>
                <div 
                  onClick={(e) => { e.stopPropagation(); handleSnap('right-half'); }}
                  className="w-10 h-8 border-2 border-white/20 rounded hover:border-amber-400 cursor-pointer flex justify-end"
                ><div className="w-1/2 h-full bg-white/20"></div></div>
              </div>
            )}
          </button>
          <button
            id={`btn-close-${id}`}
            onClick={(e) => {
              handleControlClick(e);
              onClose();
            }}
            className="p-1.5 sm:p-1 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/10 sm:border-transparent transition-all flex items-center justify-center"
            title="Zamknij"
          >
            <X size={14} className="sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Space with custom scrollbar */}
      <div className="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar text-slate-200">
        {children}
      </div>
    </motion.div>
  );
};
