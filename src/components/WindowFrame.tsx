/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
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
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  id,
  title,
  isOpen,
  onClose,
  onFocus,
  zIndex,
  config,
  children
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

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
    }
  }[config.accentColor || 'purple'];

  // Apply custom glow intensity multiplier
  const glowStyle = {
    boxShadow: config.glowIntensity > 0 
      ? `0 0 ${config.glowIntensity * 0.4}px ${
          config.accentColor === 'purple' ? 'rgba(168,85,247,0.2)' :
          config.accentColor === 'cyan' ? 'rgba(6,182,212,0.2)' :
          config.accentColor === 'orange' ? 'rgba(249,115,22,0.2)' :
          'rgba(16,185,129,0.2)'
        }` 
      : 'none'
  };

  const windowVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: 15,
      x: 0
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.25, ease: 'easeOut' }
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
        scale: 0.95,
        y: 15,
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
    medium: 'backdrop-blur-3xl bg-black/30',
    high: 'backdrop-blur-[50px] saturate-150 bg-black/25'
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
      style={{ zIndex, ...glowStyle }}
      onClick={onFocus}
      className={`
        absolute
        ${isMaximized 
          ? 'top-16 left-4 right-4 bottom-24 md:bottom-22' 
          : 'top-[12%] left-[5%] md:left-[15%] w-[90%] md:w-[70%] max-w-4xl h-[70vh]'
        }
        flex flex-col
        rounded-2xl
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
        className="flex items-center justify-between px-4 py-3 bg-black/25 border-b border-white/5 select-none cursor-default"
        onDoubleClick={() => setIsMaximized(!isMaximized)}
      >
        <div className="flex items-center space-x-2">
          {/* Active indicator dot */}
          <span className={`w-2 h-2 rounded-full ${
            config.accentColor === 'purple' ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]' :
            config.accentColor === 'cyan' ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]' :
            config.accentColor === 'orange' ? 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.6)]' :
            'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
          }`} />
          <span className={config.pixelTheme ? 'pixel-heading text-slate-300 uppercase' : 'font-sans font-medium text-xs tracking-wide text-slate-300'}>
            {title}
          </span>
        </div>

        {/* Windows Control Actions */}
        <div className="flex items-center space-x-2.5">
          <button
            id={`btn-minimize-${id}`}
            onClick={(e) => {
              handleControlClick(e);
              onClose();
            }}
            className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            title="Minimalizuj"
          >
            <Minus size={14} />
          </button>
          <button
            id={`btn-maximize-${id}`}
            onClick={(e) => {
              handleControlClick(e);
              setIsMaximized(!isMaximized);
            }}
            className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            title={isMaximized ? "Przywróć" : "Maksymalizuj"}
          >
            {isMaximized ? <RotateCcw size={14} /> : <Square size={13} />}
          </button>
          <button
            id={`btn-close-${id}`}
            onClick={(e) => {
              handleControlClick(e);
              onClose();
            }}
            className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            title="Zamknij"
          >
            <X size={14} />
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
