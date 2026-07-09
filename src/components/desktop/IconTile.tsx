import React, { useRef } from 'react';
import { motion } from 'motion/react';
import * as Lucide from 'lucide-react';
import { X, Edit2 } from 'lucide-react';
import { DesktopIcon, OSConfig } from '../../types';
import { triggerHaptic } from '../../lib/haptics';
import { TechRadarWidget, GitHubActivityWidget, QuickContactWidget } from '../Widgets';
import { ClockWidgetComponent, NoteWidgetComponent, InboxWidgetComponent, getIconStyleClasses, getWidgetStyleClasses, getWidgetSizeClasses, renderIcon } from './DesktopUtils';

interface IconTileProps {
  icon: DesktopIcon;
  config: OSConfig;
  isMobile: boolean;
  isWiggling: boolean;
  isDraggingRef: React.MutableRefObject<boolean>;
  handleIconClick: (icon: DesktopIcon, e: any) => void;
  handleContextMenu: (e: any, icon: DesktopIcon) => void;
  handleDeleteIcon: (id: string) => void;
  handleOpenEdit: (icon: DesktopIcon, e?: any) => void;
  startPress: (id: string, e: any) => void;
  endPress: () => void;
  handleDragEnd: (e: any, info: any, id: string) => void;
  openApp: (appId: string) => void;
}

export const IconTile: React.FC<IconTileProps> = ({
  icon,
  config,
  isMobile,
  isWiggling,
  isDraggingRef,
  handleIconClick,
  handleContextMenu,
  handleDeleteIcon,
  handleOpenEdit,
  startPress,
  endPress,
  handleDragEnd,
  openApp
}) => {
  const iconStyles = getIconStyleClasses(config, isWiggling);

  if (icon.isWidget) {
    return (
      <motion.div
        layout
        layoutId={icon.id}
        drag={!isMobile}
        dragElastic={0}
        dragSnapToOrigin={true}
        whileDrag={{ 
          scale: 1.1, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.7)', 
          zIndex: 100,
          cursor: 'grabbing',
          opacity: 0.95,
          filter: 'brightness(1.15) contrast(1.05)'
        }}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={(e, info) => {
          handleDragEnd(e, info, icon.id);
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 250);
        }}
        onPointerDown={(e) => startPress(icon.id, e)}
        onPointerUp={endPress}
        onPointerLeave={endPress}
        onTap={(e) => {
          if (icon.widgetType === 'notes' || icon.widgetType === 'weather' || icon.widgetType === 'clock') {
            return;
          }
          triggerHaptic('light');
          if (isWiggling) {
            handleOpenEdit(icon, e);
          } else {
            openApp(icon.appId as any);
          }
        }}
        className={`group flex flex-col justify-between rounded-2xl text-left backdrop-blur-md transition-all duration-300 relative ${!isMobile ? 'cursor-grab active:cursor-grabbing p-3.5' : 'w-full !w-full !h-32 mb-1'} ${getWidgetSizeClasses(isMobile, icon.widgetType)} ${
          isWiggling ? 'animate-wiggle border-dashed border-purple-500/55' : getWidgetStyleClasses(icon.widgetType || '').card
        }`}
        animate={isWiggling ? { rotate: [-2, 2, -2] } : { rotate: 0 }}
        transition={isWiggling ? { repeat: Infinity, duration: 0.3 } : {}}
      >
        {isWiggling && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteIcon(icon.id);
            }}
            className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-rose-500 hover:bg-rose-600 border border-white/20 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 z-20 cursor-pointer animate-scaleIn"
          >
            <X size={10} strokeWidth={3} />
          </button>
        )}

        {icon.widgetType === 'tech-radar' && <TechRadarWidget />}
        {icon.widgetType === 'github-activity' && <GitHubActivityWidget />}
        {icon.widgetType === 'quick-contact' && <QuickContactWidget />}

        {icon.widgetType === 'weather' && (
          <div className="flex flex-col h-full justify-between select-none">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase font-mono tracking-wider">Warszawa</p>
                <h4 className="text-[11px] font-bold text-amber-400">Słonecznie</h4>
              </div>
              <Lucide.Sun className="text-amber-400 animate-spin-slow w-6 h-6" style={{ animationDuration: '8s' }} />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-extrabold text-white">22°C</span>
              <span className="text-[9px] text-white/50">Odczuwalna 23°</span>
            </div>
          </div>
        )}

        {icon.widgetType === 'clock' && <ClockWidgetComponent config={config} />}
        {icon.widgetType === 'notes' && <NoteWidgetComponent iconId={icon.id} />}
        {icon.widgetType === 'inbox' && <InboxWidgetComponent />}
        
        {icon.widgetType === 'bio' && (
          <div className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full p-1">
            <div className="flex gap-2.5 items-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${getWidgetStyleClasses(icon.widgetType).iconBg}`}>
                <Lucide.User size={16} />
              </div>
              <div className="truncate">
                <h4 className="text-xs font-extrabold text-white leading-tight">O mnie</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">Adrian - Portfolio</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 italic my-2">
              {config.portfolioBio || "Architekt systemów full-stack, pasjonat AI."}
            </p>
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-purple-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5 mt-1">
              Otwórz profil &rarr;
            </span>
          </div>
        )}

        {icon.widgetType === 'projects' && (
          <div className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full p-1">
            <div className="flex justify-between items-start">
              <div className="flex gap-2.5 items-center">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${getWidgetStyleClasses(icon.widgetType).iconBg}`}>
                  <Lucide.FolderGit2 size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white leading-tight">Projekty</h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">Repozytoria</p>
                </div>
              </div>
              <span className="text-[8px] font-bold bg-blue-500/20 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">LIVE</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 my-2">
              Integracje AI, AdrianOS, Micro-SaaS i eksperymenty WebGL.
            </p>
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-blue-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5 mt-1">
              Zobacz wszystkie &rarr;
            </span>
          </div>
        )}

        {icon.widgetType === 'lab' && (
          <div className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full p-1">
            <div className="flex gap-2.5 items-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${getWidgetStyleClasses(icon.widgetType).iconBg}`}>
                <Lucide.Flame size={16} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white leading-tight">Lab AI</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">Symulatory i fizyka</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 my-2">
              Testuj cząsteczki i symulator optymalizacji WindowsFixer.
            </p>
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-amber-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5 mt-1">
              Wejdź do labu &rarr;
            </span>
          </div>
        )}

        {icon.widgetType === 'certificates' && (
          <div className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full p-1">
            <div className="flex gap-2.5 items-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${getWidgetStyleClasses(icon.widgetType).iconBg}`}>
                <Lucide.Award size={16} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white leading-tight">Certyfikaty</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">AWS, GCP & Scrum</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 my-2">
              Zweryfikowane kwalifikacje chmurowe, DevOps oraz architektury.
            </p>
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-emerald-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5 mt-1">
              Przeglądaj &rarr;
            </span>
          </div>
        )}

        {icon.widgetType === 'contact' && (
          <div className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full p-1">
            <div className="flex gap-2.5 items-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${getWidgetStyleClasses(icon.widgetType).iconBg}`}>
                <Lucide.Mail size={16} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white leading-tight">Kontakt</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">Napisz do mnie</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 my-2">
              Szybka wiadomość, LinkedIn lub połączenie. Odpowiadam w 24h.
            </p>
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-rose-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5 mt-1">
              Wyślij wiadomość &rarr;
            </span>
          </div>
        )}

        {icon.widgetType === 'planned' && (
          <div className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full p-1">
            <div className="flex gap-2.5 items-center">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${getWidgetStyleClasses(icon.widgetType).iconBg}`}>
                <Lucide.Compass size={16} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white leading-tight">Kolejne projekty</h4>
                <p className="text-[10px] text-slate-400 font-semibold leading-none mt-0.5">Status Sprintu</p>
              </div>
            </div>
            <div className="space-y-1.5 my-2">
              <div className="flex justify-between text-[9px] font-mono font-bold text-slate-450 tracking-wider">
                <span>FAZA 3: INTEGRACJA</span>
                <span className="text-cyan-400 font-extrabold">85%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5 shadow-inner">
                <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-cyan-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5 mt-1">
              Sprinty &rarr;
            </span>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      layoutId={icon.id}
      drag={!isMobile}
      dragElastic={0}
      dragSnapToOrigin={true}
      whileDrag={{ 
        scale: 1.12, 
        boxShadow: '0 20px 40px rgba(0,0,0,0.7)', 
        zIndex: 100,
        cursor: 'grabbing',
        opacity: 0.95,
        filter: 'brightness(1.15) contrast(1.05)'
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={(e, info) => {
        handleDragEnd(e, info, icon.id);
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 250);
      }}
      onPointerDown={(e) => startPress(icon.id, e)}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      onContextMenu={(e) => handleContextMenu(e, icon)}
      onTap={(e) => {
        triggerHaptic('light');
        handleIconClick(icon, e as any);
      }}
      className={`group flex ${
        isMobile 
          ? 'flex-row items-center justify-start w-full gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-md' 
          : 'flex-col items-center justify-center p-3 rounded-[24px] w-[120px] h-[132px] text-center cursor-grab active:cursor-grabbing hover:bg-white/[0.06] hover:border-white/10 hover:shadow-2xl hover:shadow-black/40 border border-transparent'
      } transition-all duration-300 relative ${
        isWiggling ? 'animate-wiggle' : ''
      }`}
      animate={isWiggling ? { rotate: [-2, 2, -2] } : { rotate: 0 }}
      transition={isWiggling ? { repeat: Infinity, duration: 0.3 } : {}}
    >
      <div className={`
        ${isMobile ? 'w-12 h-12 shrink-0' : 'w-20 h-20 group-hover:scale-105 group-hover:-translate-y-0.5'} flex items-center justify-center
        transition-all duration-300 relative
        ${iconStyles.container}
      `}>
        {renderIcon(icon.icon, `${isMobile ? 'w-5 h-5' : 'w-10 h-10'} ${iconStyles.icon}`)}
        {config.portfolioStyle !== 'retro' && (
          <span className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-white/30" />
        )}
      </div>

      {!config.viewerMode && !isMobile && (
        <button
          id={`btn-edit-icon-${icon.id}`}
          onClick={(e) => handleOpenEdit(icon, e)}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-black/60 rounded-md border border-white/10 text-slate-400 hover:text-white transition-all duration-200"
          title="Edytuj wygląd ikony"
        >
          <Edit2 size={10} />
        </button>
      )}

      <div className={`${isMobile ? 'flex flex-col text-left' : 'mt-1.5'}`}>
        <span className={`truncate max-w-[180px] leading-tight select-none ${isMobile ? 'font-bold text-[13px] text-white/90 drop-shadow-md' : iconStyles.text}`}>
          {icon.label}
        </span>
        {isMobile && (
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">Stuknij, aby otworzyć</span>
        )}
      </div>

      {isWiggling && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteIcon(icon.id);
          }}
          className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-rose-500 hover:bg-rose-600 border border-white/20 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 z-20 cursor-pointer animate-scaleIn"
          title="Usuń"
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}
    </motion.div>
  );
};
