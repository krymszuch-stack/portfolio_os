/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useDragControls, useMotionValue, animate, useReducedMotion, Variants } from 'motion/react';
import { Minus, Square, X, RotateCcw, ChevronLeft } from 'lucide-react';
import { OSConfig } from '../types';
import { triggerHaptic } from '../lib/haptics';

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
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const hoverTimer = React.useRef<NodeJS.Timeout | null>(null);
  const touchStartX = React.useRef<number>(0);
  const touchStartY = React.useRef<number>(0);
  const dragControls = useDragControls();
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX.current;
    const dy = touchEndY - touchStartY.current;

    // Edge swipe right to close (like iOS back)
    if (touchStartX.current < 40 && dx > 80 && Math.abs(dy) < 50) {
      onClose();
    }
    
    // Global swipe down from top edge to close (only if content is at top, or started from top edge)
    if (touchStartY.current < 100 && dy > 100 && Math.abs(dx) < 50) {
      onClose();
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    if (onMinimize) onMinimize();
    handleControlClick(e);
  };
  
  const handleSnap = (mode: 'floating' | 'full' | 'left-half' | 'right-half') => {
    setLayoutMode(mode);
    animate(x, 0, { type: 'spring', stiffness: 350, damping: 25, duration: shouldReduceMotion ? 0.01 : undefined });
    animate(y, 0, { type: 'spring', stiffness: 350, damping: 25, duration: shouldReduceMotion ? 0.01 : undefined });
    setShowLayoutMenu(false);
  };

  const handleDragEnd = (e: any, info: any) => {
    if (isMobile) {
      if (info.offset.y > 100) {
        onClose();
      } else {
        animate(y, 0, { type: 'spring', stiffness: 350, damping: 25, duration: shouldReduceMotion ? 0.01 : undefined });
      }
      return;
    }

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
    },
    'black-gold': {
      border: 'border-amber-500/80',
      text: 'text-amber-400',
      bgHeader: 'bg-black',
      bgGlow: 'bg-amber-500/20'
    },
    'white-clean': {
      border: 'border-slate-300/80',
      text: 'text-slate-800',
      bgHeader: 'bg-slate-100',
      bgGlow: 'bg-slate-100'
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
          config.accentColor === 'black-gold' ? 'rgba(245,158,11,0.25)' :
          config.accentColor === 'white-clean' ? 'rgba(15, 23, 42, 0.08)' :
          'rgba(16,185,129,0.2)'
        }` 
      : 'none'
  };

  const windowVariants: Variants = {
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
      pointerEvents: isMinimized ? "none" : "auto",
      transition: { type: 'spring', damping: 25, stiffness: 350, duration: shouldReduceMotion ? 0.01 : undefined }
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
            ease: [0.25, 1, 0.5, 1] as const // Smooth bezier curve for organic snapping
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

  const isWhiteClean = config.accentColor === 'white-clean';
  const isBlackGold = config.accentColor === 'black-gold';

  // Dynamic design variables based on config.glassBlur
  const blurClass = isWhiteClean
    ? 'bg-white'
    : isBlackGold
      ? 'bg-black'
      : {
          none: 'backdrop-blur-none bg-black/65',
          low: 'backdrop-blur-md bg-black/45',
          medium: 'backdrop-blur-md bg-black/30',
          high: 'backdrop-blur-lg saturate-150 bg-black/25'
        }[config.glassBlur || 'medium'];

  // Dynamic border styling
  const borderClass = isWhiteClean
    ? 'border border-slate-300/80 shadow-md'
    : isBlackGold
      ? 'border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
      : {
          none: 'border-0',
          thin: `border border-white/10 ${accentClasses.border}`,
          thick: `border-4 border-slate-700/80 ${accentClasses.border}`,
          double: `border-4 border-double border-slate-600/90 ${accentClasses.border}`
        }[config.borderStyle || 'thin'];

  const titleBarClass = isWhiteClean
    ? 'bg-slate-100 border-b border-slate-200 text-slate-800'
    : isBlackGold
      ? 'bg-black border-b border-amber-500/50 text-amber-400'
      : 'bg-[#0e111a] border-b border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)]';

  const titleTextClass = isWhiteClean
    ? 'text-slate-800'
    : isBlackGold
      ? 'text-amber-400'
      : 'text-slate-300';

  const contentTextClass = isWhiteClean
    ? 'text-slate-800'
    : isBlackGold
      ? 'text-slate-100'
      : 'text-slate-200';

  return (
    <motion.div
      id={`window-${id}`}
      variants={windowVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ zIndex, x, y, ...glowStyle }}
      drag={isMobile ? "y" : (layoutMode === "floating")}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onClick={onFocus}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`
        fixed
        top-0 left-0 right-0 bottom-0 rounded-none border-0
        ${
          layoutMode === 'full' ? 'sm:absolute sm:top-4 sm:left-4 sm:right-4 sm:bottom-16 sm:rounded-2xl sm:border sm:w-auto sm:h-auto sm:max-w-none' :
          layoutMode === 'left-half' ? 'sm:absolute sm:top-4 sm:left-4 sm:right-1/2 sm:bottom-16 sm:rounded-2xl sm:border sm:w-auto sm:h-auto sm:max-w-none mr-2' :
          layoutMode === 'right-half' ? 'sm:absolute sm:top-4 sm:left-1/2 sm:right-4 sm:bottom-16 sm:rounded-2xl sm:border sm:w-auto sm:h-auto sm:max-w-none ml-2' :
          'sm:absolute sm:top-[12%] sm:left-[15%] sm:w-[70%] sm:h-[70vh] sm:min-w-[320px] sm:min-h-[400px] sm:max-w-4xl sm:rounded-2xl sm:border sm:resize sm:overflow-hidden'
        }
        flex flex-col
        ${borderClass}
        ${blurClass}
        overflow-hidden
        transition-[width,height,opacity,background-color,border-color,box-shadow] duration-300
        window-box
        ${isWhiteClean ? 'theme-white-clean' : ''}
        ${isBlackGold ? 'theme-black-gold' : ''}
      `}
    >
      {/* Decorative inner glow */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] ${accentClasses.bgGlow} pointer-events-none`} />

      {/* Title Bar */}
      <div 
        className={`absolute top-0 left-0 right-0 z-30 flex h-14 sm:h-12 items-center justify-between px-4 select-none cursor-grab active:cursor-grabbing ${titleBarClass}`}
        onPointerDown={(e) => { if (layoutMode === "floating" || isMobile) dragControls.start(e); }}
        onDoubleClick={() => { if (!isMobile) handleSnap(layoutMode === "full" ? "floating" : "full"); }}
      >
        <div className="flex items-center space-x-2">
          {/* Back button on mobile, Active indicator dot on desktop */}
          {isMobile ? (
            <motion.button
              type="button"
              aria-label="Wstecz"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('light');
                handleControlClick(e);
                onClose();
              }}
              className={`p-2 -ml-2 rounded-lg transition-colors flex items-center justify-center ${isWhiteClean ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' : isBlackGold ? 'text-amber-500 hover:text-amber-300 hover:bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
              title="Wstecz"
            >
              <ChevronLeft size={24} />
            </motion.button>
          ) : (
            <span className={`w-2 h-2 rounded-full ${
              isWhiteClean ? 'bg-slate-600 shadow-[0_0_8px_rgba(100,116,139,0.6)]' :
              isBlackGold ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' :
              config.accentColor === 'purple' ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]' :
              config.accentColor === 'cyan' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]' :
              config.accentColor === 'orange' ? 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.6)]' :
              config.accentColor === 'amber-retro' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.6)]' :
              config.accentColor === 'mono-terminal' ? 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
              'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
            }`} />
          )}
          <span className={config.pixelTheme ? `pixel-heading uppercase ${isWhiteClean ? 'text-slate-800' : isBlackGold ? 'text-amber-400' : 'text-slate-300'}` : `font-sans font-medium text-sm sm:text-xs tracking-wide ${titleTextClass}`}>
            {title}
          </span>
        </div>

        {/* Windows Control Actions */}
        <div className="flex items-center space-x-2">
          <motion.button
            id={`btn-minimize-${id}`}
            type="button"
            aria-label="Minimalizuj"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('light');
              handleMinimize(e);
            }}
            className={`p-1.5 rounded-lg transition-colors hidden sm:inline-flex ${isWhiteClean ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' : isBlackGold ? 'text-amber-500 hover:text-amber-300 hover:bg-amber-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            title="Minimalizuj"
          >
            <Minus size={14} />
          </motion.button>
          <motion.button
            id={`btn-maximize-${id}`}
            type="button"
            aria-label={layoutMode === 'full' ? "Przywróć" : "Maksymalizuj"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('light');
              handleControlClick(e);
              handleSnap(layoutMode === 'full' ? 'floating' : 'full');
            }}
            onMouseEnter={() => { hoverTimer.current = setTimeout(() => setShowLayoutMenu(true), 400); }}
            onMouseLeave={() => { if (hoverTimer.current) clearTimeout(hoverTimer.current); setShowLayoutMenu(false); }}
            className={`p-1.5 rounded-lg transition-colors hidden sm:inline-flex relative ${isWhiteClean ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' : isBlackGold ? 'text-amber-500 hover:text-amber-300 hover:bg-amber-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            title={layoutMode === 'full' ? "Przywróć" : "Maksymalizuj"}
          >
            {layoutMode === 'full' ? <RotateCcw size={14} /> : <Square size={13} />}
            {showLayoutMenu && (
              <div className="absolute top-full right-0 mt-2 p-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl flex gap-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <button 
                  type="button"
                  aria-label="Przypnij do lewej"
                  onClick={(e) => { e.stopPropagation(); triggerHaptic('light'); handleSnap('left-half'); }}
                  className="w-10 h-8 border-2 border-white/20 rounded hover:border-amber-400 cursor-pointer flex bg-transparent"
                ><div className="w-1/2 h-full bg-white/20"></div></button>
                <button 
                  type="button"
                  aria-label="Maksymalizuj"
                  onClick={(e) => { e.stopPropagation(); triggerHaptic('light'); handleSnap('full'); }}
                  className="w-10 h-8 border-2 border-white/20 rounded hover:border-amber-400 cursor-pointer bg-white/20"
                ></button>
                <button 
                  type="button"
                  aria-label="Przypnij do prawej"
                  onClick={(e) => { e.stopPropagation(); triggerHaptic('light'); handleSnap('right-half'); }}
                  className="w-10 h-8 border-2 border-white/20 rounded hover:border-amber-400 cursor-pointer flex justify-end bg-transparent"
                ><div className="w-1/2 h-full bg-white/20"></div></button>
              </div>
            )}
          </motion.button>
          {!isMobile && (
            <motion.button
              id={`btn-close-${id}`}
              type="button"
              aria-label="Zamknij"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('medium');
                handleControlClick(e);
                onClose();
              }}
              className={`p-1.5 sm:p-1 rounded-full transition-all flex items-center justify-center ${isWhiteClean ? 'bg-slate-100 hover:bg-rose-500/10 text-slate-600 hover:text-rose-600 border border-slate-200' : isBlackGold ? 'bg-amber-500/5 hover:bg-rose-500/20 text-amber-500 hover:text-amber-400 border border-amber-500/30' : 'bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/10 sm:border-transparent'}`}
              title="Zamknij"
            >
              <X size={14} className="sm:w-3.5 sm:h-3.5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Content Space with custom scrollbar */}
      <div className={`flex-1 overflow-y-auto px-5 md:px-6 pb-5 md:pb-6 custom-scrollbar ${contentTextClass}`} style={{ paddingTop: isMobile ? '72px' : '68px' }}>
        {children}
      </div>
    </motion.div>
  );
};
