import { useState, useEffect } from 'react';
import { DesktopIcon, OSConfig } from '../../types';
import { playXpClick } from '../../lib/sounds';

export type ContextMenuState = {
  x: number;
  y: number;
  icon: DesktopIcon;
} | null;

export function useDesktopContextMenu(config: OSConfig) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, icon: DesktopIcon) => {
    e.preventDefault();
    e.stopPropagation();
    if (config.playSounds) {
      playXpClick();
    }
    
    const menuWidth = 192;
    const menuHeight = 120;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    setContextMenu({ x, y, icon });
  };

  return { contextMenu, setContextMenu, handleContextMenu };
}
