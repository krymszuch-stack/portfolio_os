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
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = prefersReducedMotion || (typeof document !== 'undefined' && document.documentElement.classList.contains('reduce-motion'));
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

  // Modern design - Aero/macOS inspired with solid backgrounds and depth
  const blurClass = isWhiteClean
    ? 'bg-white'
    : isBlackGold
      ? 'bg-slate-950'
      : 'bg-slate-900/95 backdrop-blur-sm';

  // Modern border and shadow styling - more prominent and less glassmorphic
  const borderClass = isWhiteClean
    ? 'border border-slate-200 shadow-lg shadow-slate-400/20'
    : isBlackGold
      ? 'border border-amber-600/60 shadow-2xl shadow-black/40'
      : 'border border-slate-700/80 shadow-2xl shadow-black/50';

  const titleBarClass = isWhiteClean
    ? 'bg-gradient-to-b from-slate-50 to-slate-100 border-b border-slate-200 text-slate-800'
    : isBlackGold
      ? 'bg-gradient-to-b from-slate-950 to-slate-900 border-b border-amber-600/40 text-amber-400'
      : 'bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700/50 text-slate-100';

  const titleTextClass = isWhiteClean
    ? 'text-slate-800'
    : isBlackGold
      ? 'text-amber-400'
      : 'text-slate-300';

  const contentTextClass = isWhiteClean
    ? 'text-slate-900'
    : isBlackGold
      ? 'text-slate-50'
      : 'text-slate-100';

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
      {/* Subtle top highlight - Windows Aero style */}
      <div className={`absolute top-0 left-0 right-0 h-px ${isWhiteClean ? 'bg-white/30' : isBlackGold ? 'bg-amber-400/20' : 'bg-white/15'} pointer-events-none`} />

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
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('light');
              handleMinimize(e);
            }}
            className={`w-8 h-8 rounded-lg transition-all hidden sm:inline-flex items-center justify-center font-bold text-xs ${isWhiteClean ? 'bg-yellow-400 hover:bg-yellow-500 text-slate-800 shadow-sm' : isBlackGold ? 'bg-yellow-500/70 hover:bg-yellow-500 text-slate-900 shadow-sm' : 'bg-yellow-500/70 hover:bg-yellow-500 text-slate-900 shadow-sm'}`}
            title="Minimalizuj"
          >
            −
          </motion.button>
          <motion.button
            id={`btn-maximize-${id}`}
            type="button"
            aria-label={layoutMode === 'full' ? "Przywróć" : "Maksymalizuj"}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('light');
              handleControlClick(e);
              handleSnap(layoutMode === 'full' ? 'floating' : 'full');
            }}
            className={`w-8 h-8 rounded-lg transition-all hidden sm:inline-flex items-center justify-center font-bold text-xs ${isWhiteClean ? 'bg-green-400 hover:bg-green-500 text-slate-800 shadow-sm' : isBlackGold ? 'bg-green-500/70 hover:bg-green-500 text-slate-900 shadow-sm' : 'bg-green-500/70 hover:bg-green-500 text-slate-900 shadow-sm'}`}
            title={layoutMode === 'full' ? "Przywróć" : "Maksymalizuj"}
          >
            ▢
          </motion.button>
          {!isMobile && (
            <motion.button
              id={`btn-close-${id}`}
              type="button"
              aria-label="Zamknij"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('medium');
                handleControlClick(e);
                onClose();
              }}
              className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center font-bold text-sm ${isWhiteClean ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm' : isBlackGold ? 'bg-red-500/80 hover:bg-red-600 text-white shadow-sm' : 'bg-red-500/80 hover:bg-red-600 text-white shadow-sm'}`}
              title="Zamknij"
            >
              ✕
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
