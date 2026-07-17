import React from 'react';
import { Reorder } from 'motion/react';
import { DesktopIcon, OSConfig } from '../../types';
import * as Lucide from 'lucide-react';
import { IconTile } from './IconTile';
import { getIconStyleClasses } from './DesktopUtils';

interface DesktopIconGridProps {
  icons: DesktopIcon[];
  displayedIcons: DesktopIcon[];
  config: OSConfig;
  isMobile: boolean;
  isWiggling: boolean;
  gridCells: any[];
  isDraggingRef: React.MutableRefObject<boolean>;
  handleIconClick: (icon: DesktopIcon, e: any) => void;
  handleContextMenu: (e: any, icon: DesktopIcon) => void;
  handleDeleteIcon: (id: string) => void;
  handleOpenEdit: (icon: DesktopIcon, e?: any) => void;
  handleOpenAddElement: (r: number, c: number) => void;
  startPress: (id: string, e: any) => void;
  endPress: () => void;
  handleDragEnd: (e: any, info: any, id: string) => void;
  handleMobileReorder: (newOrder: DesktopIcon[]) => void;
  openApp: (appId: 'bio' | 'projects' | 'dashboard' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'terminal') => void;
}

export const DesktopIconGrid: React.FC<DesktopIconGridProps> = ({
  icons,
  displayedIcons,
  config,
  isMobile,
  isWiggling,
  gridCells,
  isDraggingRef,
  handleIconClick,
  handleContextMenu,
  handleDeleteIcon,
  handleOpenEdit,
  handleOpenAddElement,
  startPress,
  endPress,
  handleDragEnd,
  handleMobileReorder,
  openApp
}) => {
  return (
    <>
      {isMobile ? (
        <div className="flex-1 w-full p-4 overflow-y-auto overflow-x-hidden flex flex-col items-center">
          <Reorder.Group 
            axis="y" 
            values={icons} 
            onReorder={handleMobileReorder}
            className="w-full max-w-sm flex flex-col gap-3 pb-32"
          >
            {displayedIcons.map((icon, idx) => (
              <Reorder.Item 
                key={icon.id} 
                value={icon}
                dragListener={isWiggling}
                className="relative"
                style={{ touchAction: isWiggling ? 'none' : 'auto' }}
              >
                <IconTile
                  icon={icon}
                  config={config}
                  isMobile={isMobile}
                  isWiggling={isWiggling}
                  isDraggingRef={isDraggingRef}
                  handleIconClick={handleIconClick}
                  handleContextMenu={handleContextMenu}
                  handleDeleteIcon={handleDeleteIcon}
                  handleOpenEdit={handleOpenEdit}
                  startPress={startPress}
                  endPress={endPress}
                  handleDragEnd={handleDragEnd}
                  openApp={openApp}
                />
                {isMobile && isWiggling && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const realIndex = icons.findIndex(i => i.id === icon.id);
                        if (realIndex > 0) {
                          const newIcons = [...icons];
                          [newIcons[realIndex - 1], newIcons[realIndex]] = [newIcons[realIndex], newIcons[realIndex - 1]];
                          handleMobileReorder(newIcons);
                        }
                      }}
                      disabled={idx === 0}
                      className={`p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md border border-white/20 transition-all ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      <Lucide.ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const realIndex = icons.findIndex(i => i.id === icon.id);
                        if (realIndex < icons.length - 1 && realIndex !== -1) {
                          const newIcons = [...icons];
                          [newIcons[realIndex], newIcons[realIndex + 1]] = [newIcons[realIndex + 1], newIcons[realIndex]];
                          handleMobileReorder(newIcons);
                        }
                      }}
                      disabled={idx === displayedIcons.length - 1}
                      className={`p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md border border-white/20 transition-all ${idx === displayedIcons.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      <Lucide.ChevronDown size={16} />
                    </button>
                  </div>
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      ) : (
        <React.Fragment>
          {(() => {
            const iconGrid: Record<number, Record<number, DesktopIcon>> = {};
            for (let i = 0; i < displayedIcons.length; i++) {
              const icon = displayedIcons[i];
              if (!iconGrid[icon.x]) iconGrid[icon.x] = {};
              iconGrid[icon.x][icon.y] = icon;
            }

            return gridCells.map((item, idx) => {
              const isGridCell = true;
              const r = (item as any).r;
              const c = (item as any).c;
              const icon = iconGrid[r]?.[c];

            // Empty cell for drop target on desktop
            if (!icon) {
              return (
                <div
                  key={`${r}-${c}`}
                  data-grid-r={r}
                  data-grid-c={c}
                  className={`flex items-center justify-center relative rounded-2xl border border-dashed transition-all duration-300 desktop-grid-cell group/cell h-full min-h-[110px] ${
                    isWiggling 
                      ? 'border-purple-500/25 bg-purple-500/5 shadow-[inset_0_0_12px_rgba(168,85,247,0.05)]' 
                      : 'border-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.01]'
                  }`}
                >
                  {isWiggling && (
                    <button
                      type="button"
                      aria-label="Dodaj element"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAddElement(r, c);
                      }}
                      className="w-8 h-8 rounded-full bg-purple-500/15 hover:bg-purple-500/30 flex items-center justify-center text-purple-400 hover:text-purple-300 border border-purple-500/20 hover:border-purple-500/40 transition-all opacity-0 group-hover/cell:opacity-100 duration-200"
                    >
                      <Lucide.Plus size={14} />
                    </button>
                  )}
                  {!isWiggling && (
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover/cell:opacity-[0.1] transition-opacity">
                      <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white" />
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white" />
                      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white" />
                      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white" />
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={`${r}-${c}`}
                data-grid-r={r}
                data-grid-c={c}
                className={`flex relative rounded-2xl border transition-all duration-300 desktop-grid-cell items-center justify-center border-white/[0.01] hover:border-white/[0.06] hover:bg-white/[0.01]`}
              >
                <IconTile
                  icon={icon}
                  config={config}
                  isMobile={isMobile}
                  isWiggling={isWiggling}
                  isDraggingRef={isDraggingRef}
                  handleIconClick={handleIconClick}
                  handleContextMenu={handleContextMenu}
                  handleDeleteIcon={handleDeleteIcon}
                  handleOpenEdit={handleOpenEdit}
                  startPress={startPress}
                  endPress={endPress}
                  handleDragEnd={handleDragEnd}
                  openApp={openApp}
                />
              </div>
            );
          })})()}
        </React.Fragment>
      )}
    </>
  );
};
