import React from 'react';
import { DesktopIcon } from '../../types';

export function useDesktopIconLayout(
  setIcons: React.Dispatch<React.SetStateAction<DesktopIcon[]>>
) {
  const handleMobileReorder = (newOrder: DesktopIcon[], viewerMode?: boolean) => {
    if (viewerMode) return;
    setIcons(prev => {
      const newIcons = [...prev];
      const orderMap = new Map(newOrder.map((item, index) => [item.id, index]));
      return newIcons.sort((a, b) => {
        const indexA = orderMap.has(a.id) ? orderMap.get(a.id) : 999;
        const indexB = orderMap.has(b.id) ? orderMap.get(b.id) : 999;
        return (indexA as number) - (indexB as number);
      });
    });
  };

  const handleDragEnd = (e: unknown, info: { point: { x: number; y: number } }, iconId: string) => {
    const dropX = info.point.x;
    const dropY = info.point.y;
    
    let targetR = -1;
    let targetC = -1;
    
    // Performance optimization: Use elementsFromPoint which is significantly faster than querySelectorAll + getBoundingClientRect
    // This avoids triggering synchronous layout thrashing and querying the entire DOM.
    if (typeof document.elementsFromPoint === 'function') {
      const elements = document.elementsFromPoint(dropX, dropY);
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.classList && el.classList.contains('desktop-grid-cell')) {
          targetR = parseInt(el.getAttribute('data-grid-r') || '-1', 10);
          targetC = parseInt(el.getAttribute('data-grid-c') || '-1', 10);
          break;
        }
      }
    } else {
      // Fallback for older browsers
      const el = document.elementFromPoint(dropX, dropY);
      const cell = el ? el.closest('.desktop-grid-cell') : null;
      if (cell) {
        targetR = parseInt(cell.getAttribute('data-grid-r') || '-1', 10);
        targetC = parseInt(cell.getAttribute('data-grid-c') || '-1', 10);
      }
    }

    if (targetR !== -1 && targetC !== -1) {
      setIcons(prev => {
        const draggedIcon = prev.find(i => i.id === iconId);
        if (!draggedIcon) return prev;
        
        if (draggedIcon.x === targetR && draggedIcon.y === targetC) return prev;

        const targetIcon = prev.find(i => i.x === targetR && i.y === targetC);

        if (targetIcon) {
          return prev.map(icon => {
            if (icon.id === draggedIcon.id) return { ...icon, x: targetR, y: targetC };
            if (icon.id === targetIcon.id) return { ...icon, x: draggedIcon.x, y: draggedIcon.y };
            return icon;
          });
        } else {
          return prev.map(icon => icon.id === iconId ? { ...icon, x: targetR, y: targetC } : icon);
        }
      });
    }
  };

  return {
    handleDragEnd,
    handleMobileReorder
  };
}
