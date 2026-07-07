/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { DesktopIcon, OSConfig } from '../types';
import * as Lucide from 'lucide-react';
import { Edit2, Sparkles, X, Check } from 'lucide-react';
import { playXpClick, playXpError, playXpBalloon } from '../lib/sounds';

const ClockWidgetComponent: React.FC<{ config: OSConfig }> = ({ config }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hrs = time.getHours();
  const mins = time.getMinutes();
  const secs = time.getSeconds();
  
  const hStr = hrs.toString().padStart(2, '0');
  const mStr = mins.toString().padStart(2, '0');
  const sStr = secs.toString().padStart(2, '0');

  const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  const dayStr = days[time.getDay()];

  return (
    <div className="flex flex-col h-full justify-between select-none font-mono">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">{dayStr}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      </div>
      <div className="text-lg font-black text-white/90 flex items-center justify-center tracking-wider bg-black/20 py-1.5 px-2.5 rounded-xl border border-white/5 my-1">
        <span>{hStr}</span>
        <span className="animate-pulse mx-0.5 text-cyan-400">:</span>
        <span>{mStr}</span>
        <span className="animate-pulse mx-0.5 text-cyan-400 opacity-60">:</span>
        <span className="text-xs text-white/50">{sStr}</span>
      </div>
    </div>
  );
};

const NoteWidgetComponent: React.FC<{ iconId: string }> = ({ iconId }) => {
  const [noteText, setNoteText] = useState(() => localStorage.getItem(`note-${iconId}`) || '');
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteText(e.target.value);
    localStorage.setItem(`note-${iconId}`, e.target.value);
  };
  return (
    <div className="flex flex-col h-full w-full justify-between gap-1">
      <span className="text-[8px] font-bold text-white/40 uppercase font-mono tracking-wider">Moje Notatki</span>
      <textarea
        value={noteText}
        onChange={handleChange}
        placeholder="Napisz coś..."
        className="w-full flex-grow bg-black/40 text-white/90 text-[10px] p-1.5 focus:outline-none resize-none font-sans rounded-xl border border-white/5 shadow-inner"
      />
    </div>
  );
};

interface DesktopProps {
  icons: DesktopIcon[];
  setIcons: React.Dispatch<React.SetStateAction<DesktopIcon[]>>;
  openApp: (appId: 'bio' | 'projects' | 'lab' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'gdrive' | 'calendar') => void;
  config: OSConfig;
  isKreatorMode?: boolean;
  setIsKreatorMode?: (val: boolean) => void;
}

export const Desktop: React.FC<DesktopProps> = ({
  icons,
  setIcons,
  openApp,
  config,
  isKreatorMode = false,
  setIsKreatorMode
}) => {
  // Track mobile state and heatmap toggle
  const [isMobile, setIsMobile] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [editingIcon, setEditingIcon] = useState<DesktopIcon | null>(null);
  const [editForm, setEditForm] = useState({
    label: '',
    icon: 'user',
    color: ''
  });

  const [isWiggling, setIsWiggling] = useState(false);

  // Sync isWiggling state with isKreatorMode prop
  useEffect(() => {
    if (config.viewerMode) {
      setIsWiggling(false);
    } else {
      setIsWiggling(isKreatorMode);
    }
  }, [isKreatorMode, config.viewerMode]);

  const toggleWiggling = (val: boolean) => {
    if (config.viewerMode) return;
    setIsWiggling(val);
    if (setIsKreatorMode) {
      setIsKreatorMode(val);
    }
  };

  // Predefined Social / Messengers Presets
  const socialPresets = [
    { id: 'linkedin', label: 'LinkedIn', icon: 'Linkedin', color: 'from-[#0a66c2]/30 to-[#0a66c2]/10 hover:shadow-[#0a66c2]/20 border-[#0a66c2]/20', url: 'https://linkedin.com' },
    { id: 'skype', label: 'Skype', icon: 'Phone', color: 'from-[#00aff0]/30 to-[#00aff0]/10 hover:shadow-[#00aff0]/20 border-[#00aff0]/20', url: 'https://skype.com' },
    { id: 'teams', label: 'Teams', icon: 'Users', color: 'from-[#6264a7]/30 to-[#6264a7]/10 hover:shadow-[#6264a7]/20 border-[#6264a7]/20', url: 'https://teams.microsoft.com' },
    { id: 'discord', label: 'Discord', icon: 'MessageSquare', color: 'from-[#5865f2]/30 to-[#5865f2]/10 hover:shadow-[#5865f2]/20 border-[#5865f2]/20', url: 'https://discord.com' },
    { id: 'mail', label: 'Mail', icon: 'Mail', color: 'from-[#ea4335]/30 to-[#ea4335]/10 hover:shadow-[#ea4335]/20 border-[#ea4335]/20', url: 'mailto:contact@adrian.dev' },
    { id: 'steam', label: 'Steam', icon: 'Gamepad2', color: 'from-[#171a21]/30 to-[#171a21]/10 hover:shadow-[#171a21]/20 border-[#171a21]/20', url: 'https://store.steampowered.com' },
    { id: 'facebook', label: 'Facebook', icon: 'Facebook', color: 'from-[#1877f2]/30 to-[#1877f2]/10 hover:shadow-[#1877f2]/20 border-[#1877f2]/20', url: 'https://facebook.com' },
    { id: 'instagram', label: 'Instagram', icon: 'Instagram', color: 'from-[#e1306c]/30 to-[#e1306c]/10 hover:shadow-[#e1306c]/20 border-[#e1306c]/20', url: 'https://instagram.com' },
    { id: 'vk', label: 'VK', icon: 'Share2', color: 'from-[#0077ff]/30 to-[#0077ff]/10 hover:shadow-[#0077ff]/20 border-[#0077ff]/20', url: 'https://vk.com' },
    { id: 'telegram', label: 'Telegram', icon: 'Send', color: 'from-[#229ed9]/30 to-[#229ed9]/10 hover:shadow-[#229ed9]/20 border-[#229ed9]/20', url: 'https://t.me' },
    { id: 'whatsapp', label: 'WhatsApp', icon: 'MessageCircle', color: 'from-[#25d366]/30 to-[#25d366]/10 hover:shadow-[#25d366]/20 border-[#25d366]/20', url: 'https://whatsapp.com' },
    { id: 'viber', label: 'Viber', icon: 'PhoneCall', color: 'from-[#7360f2]/30 to-[#7360f2]/10 hover:shadow-[#7360f2]/20 border-[#7360f2]/20', url: 'https://viber.com' },
    { id: 'messenger', label: 'Messenger', icon: 'Zap', color: 'from-[#006aff]/30 to-[#006aff]/10 hover:shadow-[#006aff]/20 border-[#006aff]/20', url: 'https://messenger.com' }
  ];

  const [addingCell, setAddingCell] = useState<{ r: number, c: number } | null>(null);
  const [addForm, setAddForm] = useState({
    type: 'social' as 'social' | 'widget' | 'custom',
    label: '',
    icon: 'Linkedin',
    color: 'from-blue-500/30 to-blue-500/10 hover:shadow-blue-500/20 border-blue-500/20',
    url: '',
    socialPreset: 'linkedin',
    widgetType: 'weather' as 'weather' | 'clock' | 'notes'
  });

  const handleOpenAddElement = (r: number, c: number) => {
    setAddingCell({ r, c });
    const p = socialPresets[0];
    setAddForm({
      type: 'social',
      label: p.label,
      icon: p.icon,
      color: p.color,
      url: p.url,
      socialPreset: p.id,
      widgetType: 'weather'
    });
  };

  const handleSelectPreset = (presetId: string) => {
    const p = socialPresets.find(x => x.id === presetId);
    if (p) {
      setAddForm(prev => ({
        ...prev,
        socialPreset: presetId,
        label: p.label,
        icon: p.icon,
        color: p.color,
        url: p.url
      }));
    }
  };

  const handleAddElement = () => {
    if (!addingCell) return;
    
    let finalLabel = addForm.label;
    let finalIcon = addForm.icon;
    let finalColor = addForm.color;
    let finalUrl: string | undefined = undefined;
    let isWidget = false;
    let widgetType: 'weather' | 'clock' | 'notes' | undefined = undefined;

    if (addForm.type === 'social') {
      const p = socialPresets.find(x => x.id === addForm.socialPreset) || socialPresets[0];
      finalLabel = addForm.label || p.label;
      finalIcon = p.icon;
      finalColor = p.color;
      finalUrl = addForm.url || p.url;
    } else if (addForm.type === 'widget') {
      isWidget = true;
      widgetType = addForm.widgetType as any;
      if (widgetType === 'weather') {
        finalLabel = 'Pogoda';
        finalIcon = 'Sun';
        finalColor = 'from-amber-400/20 to-orange-500/10 border-amber-500/20';
      } else if (widgetType === 'clock') {
        finalLabel = 'Zegar';
        finalIcon = 'Clock';
        finalColor = 'from-indigo-400/20 to-purple-500/10 border-indigo-500/20';
      } else if (widgetType === 'notes') {
        finalLabel = 'Notatnik';
        finalIcon = 'FileText';
        finalColor = 'from-emerald-400/20 to-teal-500/10 border-emerald-500/20';
      } else if (widgetType === 'bio') {
        finalLabel = 'O mnie';
        finalIcon = 'User';
        finalColor = 'from-purple-500/20 to-pink-500/10 border-purple-500/20';
      } else if (widgetType === 'projects') {
        finalLabel = 'Projekty';
        finalIcon = 'FolderGit2';
        finalColor = 'from-blue-500/20 to-indigo-500/10 border-blue-500/20';
      } else if (widgetType === 'lab') {
        finalLabel = 'Laboratorium';
        finalIcon = 'Flame';
        finalColor = 'from-amber-500/20 to-red-500/10 border-amber-500/20';
      } else if (widgetType === 'certificates') {
        finalLabel = 'Certyfikaty';
        finalIcon = 'Award';
        finalColor = 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20';
      } else if (widgetType === 'contact') {
        finalLabel = 'Kontakt';
        finalIcon = 'Mail';
        finalColor = 'from-rose-500/20 to-pink-500/10 border-rose-500/20';
      } else if (widgetType === 'planned') {
        finalLabel = 'Plany i Sprint';
        finalIcon = 'Compass';
        finalColor = 'from-cyan-500/20 to-blue-500/10 border-cyan-500/20';
      }
    } else {
      finalLabel = addForm.label || 'Mój Skrót';
      finalIcon = addForm.icon;
      finalColor = addForm.color;
      finalUrl = addForm.url || undefined;
    }

    const newIcon: DesktopIcon = {
      id: `custom-element-${Date.now()}`,
      label: finalLabel,
      appId: 'planned',
      icon: finalIcon,
      color: finalColor,
      x: addingCell.r,
      y: addingCell.c,
      url: finalUrl,
      isWidget,
      widgetType
    };

    setIcons(prev => [...prev, newIcon]);
    setAddingCell(null);
    if (config.playSounds) {
      playXpBalloon();
    }
  };
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    icon: DesktopIcon;
  } | null>(null);

  const longPressTimer = useRef<any>(null);
  const hasLongPressed = useRef(false);

  // Close context menu on any outside click
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  // Dynamic Lucide icon lookup helper
  const renderIcon = (name: string, className = '') => {
    // Normalise name to capitalised format (e.g. 'user' -> 'User', 'folder' -> 'Folder')
    const key = name.charAt(0).toUpperCase() + name.slice(1);
    const IconComponent = (Lucide as any)[key] || Lucide.File;
    return <IconComponent size={24} className={className} />;
  };

  const getIconStyleClasses = () => {
    const isRetro = config.portfolioStyle === 'retro';
    if (isRetro) {
      const variant = config.iconStyleRetro || 'classic-windows-95';
      switch (variant) {
        case 'classic-windows-95':
          return {
            container: 'bg-[#C0C0C0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-[1px_1px_0px_black] rounded-none text-black',
            icon: 'text-black',
            text: 'text-black font-mono font-bold text-[10px] bg-[#C0C0C0] px-1 border border-black/20 mt-1'
          };
        case 'gameboy-green':
          return {
            container: 'bg-[#8bac0f] border-2 border-[#0f380f] shadow-[2px_2px_0px_#306230] rounded-none text-[#0f380f]',
            icon: 'text-[#0f380f]',
            text: 'text-[#0f380f] font-mono font-bold text-[10px] mt-1'
          };
        case 'nes-retro-console':
          return {
            container: 'bg-[#333333] border-2 border-[#E30B5C] shadow-[2px_2px_0px_#111111] rounded-none text-[#E30B5C]',
            icon: 'text-[#E30B5C]',
            text: 'text-white font-mono font-bold text-[10px] mt-1'
          };
        case 'arcade-cabinet':
          return {
            container: 'bg-black border border-purple-500 shadow-[inset_0_0_4px_#a855f7,0_0_8px_#a855f7] rounded-none text-purple-400',
            icon: 'text-purple-400',
            text: 'text-purple-400 font-mono font-bold text-[10px] mt-1'
          };
        case 'c64-blue':
          return {
            container: 'bg-[#3e5dfd] border-2 border-[#a4b2ff] shadow-[2px_2px_0px_#000088] rounded-none text-[#a4b2ff]',
            icon: 'text-[#a4b2ff]',
            text: 'text-[#a4b2ff] font-mono font-bold text-[10px] mt-1'
          };
        case 'minecraft-brick':
          return {
            container: 'bg-[#795548] border-2 border-[#5d4037] shadow-[2px_2px_0px_#3e2723] rounded-none text-amber-100',
            icon: 'text-amber-100',
            text: 'text-amber-100 font-mono font-bold text-[10px] mt-1'
          };
        case 'stealth-retro':
          return {
            container: 'bg-[#1a1a1a] border-2 border-[#333] shadow-[2px_2px_0px_black] rounded-none text-[#888]',
            icon: 'text-[#888]',
            text: 'text-[#888] font-mono font-bold text-[10px] mt-1'
          };
        case 'candy-pixel':
          return {
            container: 'bg-[#ff8da1] border-2 border-[#ff3b64] shadow-[2px_2px_0px_#ff003c] rounded-none text-white',
            icon: 'text-white',
            text: 'text-[#ff3b64] font-mono font-bold text-[10px] mt-1'
          };
        case 'cyber-8bit':
          return {
            container: 'bg-[#000] border-2 border-[#ffff00] shadow-[2px_2px_0px_#888800] rounded-none text-[#ffff00]',
            icon: 'text-[#ffff00]',
            text: 'text-[#ffff00] font-mono font-bold text-[10px] mt-1'
          };
        case 'doom-crimson':
          return {
            container: 'bg-[#660000] border-2 border-[#ff0000] shadow-[2px_2px_0px_#330000] rounded-none text-[#ff0000]',
            icon: 'text-[#ff0000]',
            text: 'text-[#ff0000] font-mono font-bold text-[10px] mt-1'
          };
        default:
          return {
            container: 'bg-[#C0C0C0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-[1px_1px_0px_black] rounded-none text-black',
            icon: 'text-black',
            text: 'text-black font-mono font-bold text-[10px] mt-1'
          };
      }
    } else {
      const variant = config.iconStyleModern || 'lumine-minimalist-glass';
      switch (variant) {
        case 'lumine-ubuntu-style':
          return {
            container: 'bg-gradient-to-br from-[#E95420] via-[#b33e4f] to-[#77216F] border border-white/20 shadow-[0_4px_12px_rgba(233,84,32,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] rounded-[18px] text-white',
            icon: 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]',
            text: 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans font-medium text-[11px] mt-3.5'
          };
        case 'lumine-minimalist-glass':
          return {
            container: 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-[22px] text-[#e0e0e0]',
            icon: 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]',
            text: 'text-white/80 group-hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
          };
        case 'lumine-neon-glow':
          return {
            container: 'bg-slate-950/85 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-[22px] text-cyan-400',
            icon: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
            text: 'text-cyan-400/80 group-hover:text-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
          };
        case 'lumine-cyberpunk-gold':
          return {
            container: 'bg-yellow-950/35 border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.35)] rounded-[22px] text-yellow-400',
            icon: 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]',
            text: 'text-yellow-400/80 group-hover:text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
          };
        case 'lumine-aurora-hologram':
          return {
            container: 'bg-gradient-to-br from-indigo-500/25 via-pink-500/20 to-cyan-500/25 border border-indigo-400/40 shadow-[0_4px_20px_rgba(124,58,237,0.25)] rounded-[22px] text-indigo-100',
            icon: 'text-indigo-100 drop-shadow-[0_2px_4px_rgba(99,102,241,0.5)]',
            text: 'text-indigo-200/80 group-hover:text-indigo-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
          };
        case 'lumine-dark-slate-chrome':
          return {
            container: 'bg-slate-800/60 border-2 border-slate-600 shadow-inner rounded-[22px] text-slate-100',
            icon: 'text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]',
            text: 'text-slate-200/80 group-hover:text-slate-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
          };
        case 'lumine-vaporwave-sunset':
          return {
            container: 'bg-pink-950/45 border border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.4)] rounded-[22px] text-fuchsia-300',
            icon: 'text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]',
            text: 'text-fuchsia-300/80 group-hover:text-fuchsia-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
          };
        case 'lumine-forest-emerald':
          return {
            container: 'bg-emerald-950/45 border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] rounded-[22px] text-emerald-300',
            icon: 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]',
            text: 'text-emerald-300/80 group-hover:text-emerald-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
          };
        case 'lumine-cosmic-nebula':
          return {
            container: 'bg-violet-950/45 border border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.45)] rounded-[22px] text-purple-200',
            icon: 'text-purple-200 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]',
            text: 'text-purple-200/80 group-hover:text-purple-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
          };
        case 'lumine-solar-flare':
          return {
            container: 'bg-amber-950/45 border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.45)] rounded-[22px] text-amber-300',
            icon: 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]',
            text: 'text-amber-300/80 group-hover:text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
          };
        case 'lumine-monochromatic-carbon':
          return {
            container: 'bg-neutral-900/90 border border-neutral-700 shadow-md rounded-[22px] text-neutral-300',
            icon: 'text-neutral-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]',
            text: 'text-neutral-400/80 group-hover:text-neutral-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
          };
        default:
          return {
            container: 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-[22px] text-[#e0e0e0]',
            icon: 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]',
            text: 'text-white/80 group-hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
          };
      }
    }
  };

  // HTML5 Drag-and-Drop Handlers for Icon Movement
  const handleDragStart = (e: React.DragEvent, iconId: string) => {
    endPress();
    e.dataTransfer.setData('text/plain', iconId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetX: number, targetY: number) => {
    e.preventDefault();
    const iconId = e.dataTransfer.getData('text/plain');
    if (!iconId) return;

    setIcons(prev => prev.map(icon => {
      if (icon.id === iconId) {
        return {
          ...icon,
          x: targetX,
          y: targetY
        };
      }
      return icon;
    }));
  };

  const handleOpenEdit = (icon: DesktopIcon, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingIcon(icon);
    setEditForm({
      label: icon.label,
      icon: icon.icon,
      color: icon.color
    });
  };

  const handleSaveEdit = () => {
    if (!editingIcon) return;
    setIcons(prev => prev.map(icon => {
      if (icon.id === editingIcon.id) {
        return {
          ...icon,
          label: editForm.label,
          icon: editForm.icon,
          color: editForm.color
        };
      }
      return icon;
    }));
    setEditingIcon(null);
  };

  const handleDeleteIcon = (iconId: string) => {
    setIcons(prev => prev.filter(i => i.id !== iconId));
    if (config.playSounds) {
      playXpError();
    }
  };

  // Long press press-and-hold handlers
  const startPress = (iconId: string, e: React.PointerEvent) => {
    if (e.button !== 0) return; // Left click/touch only
    hasLongPressed.current = false;
    longPressTimer.current = setTimeout(() => {
      hasLongPressed.current = true;
      toggleWiggling(true);
      if (config.playSounds) {
        playXpBalloon();
      }
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 1000);
  };

  const endPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleIconClick = (icon: DesktopIcon, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLongPressed.current) {
      hasLongPressed.current = false;
      return;
    }
    
    // In wiggle mode, click triggers the fully functional full edit modal instead of opening!
    if (isWiggling) {
      handleOpenEdit(icon, e);
      return;
    }

    if (icon.url) {
      if (config.playSounds) {
        playXpClick();
      }
      window.open(icon.url, '_blank');
    } else {
      openApp(icon.appId as any);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, icon: DesktopIcon) => {
    e.preventDefault();
    e.stopPropagation();
    if (config.playSounds) {
      playXpClick();
    }
    
    // Position menu clamping it inside viewport
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

  // Render a grid cell layout (e.g. 5 rows x 6 columns)
  const rows = 5;
  const cols = 6;
  
  const gridCells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gridCells.push({ r, c });
    }
  }

  // Segment icons for mobile thumb heatmap priority groups
  const highPriorityIds = ['projects', 'bio', 'contact', 'wizard'];
  const mediumPriorityIds = ['lab', 'certificates', 'gdrive'];
  const lowPriorityIds = ['calendar', 'settings', 'planned'];

  const getMobileIconsByPriority = () => {
    const high = icons.filter(i => highPriorityIds.includes(i.appId));
    const medium = icons.filter(i => mediumPriorityIds.includes(i.appId));
    const low = icons.filter(i => lowPriorityIds.includes(i.appId));
    return { high, medium, low };
  };

  const mobilePriorityGroups = getMobileIconsByPriority();

  // If mobile, render a thumb-ergonomically stacked list/grid with live heatmap visualization
  if (isMobile) {
    const iconStyles = getIconStyleClasses();
    return (
      <div 
        onClick={() => toggleWiggling(false)}
        className="absolute inset-0 pt-16 pb-24 px-4 overflow-y-auto select-none space-y-4 font-sans flex flex-col justify-between relative"
      >
        {/* Heatmap active background sweep glow visualizer */}
        {showHeatmap && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex flex-col justify-between">
            {/* Red glow at top (unreachable) */}
            <div className="h-[25%] bg-red-500/10 w-full blur-2xl border-b border-red-500/10" />
            {/* Yellow glow in middle */}
            <div className="h-[25%] bg-amber-500/10 w-full blur-2xl border-y border-amber-500/10" />
            {/* Green glow at bottom sweep zone */}
            <div className="h-[50%] bg-emerald-500/20 w-full blur-2xl border-t border-emerald-500/20 relative">
              <div className="absolute right-0 bottom-0 w-[280px] h-[280px] rounded-full border border-dashed border-emerald-400/30 bg-emerald-500/5 translate-x-10 translate-y-10 animate-pulse" />
            </div>
          </div>
        )}

        {/* Top Header info area (Zone 3 - Hardest Reach) */}
        <div className="z-10 flex items-center justify-between mt-1">
          <div className="space-y-0.5">
            <h4 className={`text-xs font-bold text-white/80 tracking-wide uppercase ${config.pixelTheme ? 'pixel-heading' : 'font-sans'}`}>
              Pulpit Mobilny (ErgoUX)
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">Dopasowano do fizjologii dłoni</p>
          </div>
          
          {/* Heatmap toggler floating button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHeatmap(!showHeatmap);
              if (config.playSounds) {
                playXpBalloon();
              }
            }}
            className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
              showHeatmap 
                ? 'bg-purple-600 border-purple-500 text-white shadow-purple-500/20' 
                : 'bg-slate-900/80 border-white/10 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles size={11} className={showHeatmap ? "animate-spin text-amber-300" : "text-purple-400"} />
            {showHeatmap ? 'Ukryj Heatmapę' : 'Heatmapa Kciuka'}
          </button>
        </div>

        {/* Wiggle mode edit overlay banner */}
        {isWiggling && (
          <div className="z-20 w-full bg-purple-500/20 border border-purple-500/30 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2 justify-center shadow-lg text-center animate-bounce">
            <span className="text-[10px] text-purple-200 font-sans font-bold uppercase tracking-wider">Tryb edycji włączony. Tapnij wolne tło, by zapisać.</span>
          </div>
        )}

        {/* STACK OF THREE HEATP-MAP REACHABILITY ZONES */}
        <div className="space-y-3 z-10 flex-grow flex flex-col justify-end pb-2">
          
          {/* ZONE 3: Niski priorytet / Trudny zasięg (Top portion of stack) */}
          <div className={`p-3 rounded-2xl border transition-all duration-300 ${
            showHeatmap 
              ? 'bg-red-950/20 border-red-500/30 ring-1 ring-red-500/20' 
              : 'bg-slate-950/35 border-white/5 backdrop-blur-md'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                showHeatmap ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-slate-400'
              }`}>
                {showHeatmap ? '🔴 Strefa 3: Trudny Zasięg (Niski priorytet)' : 'Ustawienia i narzędzia'}
              </span>
              {showHeatmap && <span className="text-[9px] text-red-400 font-mono font-semibold">CTR ~3%</span>}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {mobilePriorityGroups.low.map((icon) => (
                <div
                  key={icon.id}
                  onPointerDown={(e) => startPress(icon.id, e)}
                  onPointerUp={endPress}
                  onPointerLeave={endPress}
                  onContextMenu={(e) => handleContextMenu(e, icon)}
                  onClick={(e) => handleIconClick(icon, e)}
                  className={`relative flex flex-col items-center p-2 rounded-xl border border-transparent active:scale-95 active:bg-white/5 transition-all ${
                    isWiggling ? 'animate-wiggle border-dashed border-purple-500/30' : ''
                  }`}
                >
                  <div className={`w-11 h-11 flex items-center justify-center border shrink-0 ${iconStyles.container} !w-11 !h-11 !rounded-xl shadow`}>
                    {renderIcon(icon.icon, `w-5 h-5 ${iconStyles.icon}`)}
                  </div>
                  <span className={`text-[9px] mt-1.5 truncate max-w-full select-none text-center ${iconStyles.text}`}>
                    {icon.label}
                  </span>
                  {isWiggling && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteIcon(icon.id);
                      }}
                      className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-rose-500 border border-white/25 rounded-full flex items-center justify-center text-white"
                    >
                      <X size={8} strokeWidth={3} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ZONE 2: Średni priorytet / Średni zasięg (Middle portion of stack) */}
          <div className={`p-3 rounded-2xl border transition-all duration-300 ${
            showHeatmap 
              ? 'bg-amber-950/20 border-amber-500/30 ring-1 ring-amber-500/20' 
              : 'bg-slate-950/35 border-white/5 backdrop-blur-md'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                showHeatmap ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-slate-400'
              }`}>
                {showHeatmap ? '🟡 Strefa 2: Średni Zasięg (Średni priorytet)' : 'Rozwój i Certyfikaty'}
              </span>
              {showHeatmap && <span className="text-[9px] text-amber-400 font-mono font-semibold">CTR ~18%</span>}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {mobilePriorityGroups.medium.map((icon) => (
                <div
                  key={icon.id}
                  onPointerDown={(e) => startPress(icon.id, e)}
                  onPointerUp={endPress}
                  onPointerLeave={endPress}
                  onContextMenu={(e) => handleContextMenu(e, icon)}
                  onClick={(e) => handleIconClick(icon, e)}
                  className={`relative flex flex-col items-center p-2 rounded-xl border border-transparent active:scale-95 active:bg-white/5 transition-all ${
                    isWiggling ? 'animate-wiggle border-dashed border-purple-500/30' : ''
                  }`}
                >
                  <div className={`w-11 h-11 flex items-center justify-center border shrink-0 ${iconStyles.container} !w-11 !h-11 !rounded-xl shadow`}>
                    {renderIcon(icon.icon, `w-5 h-5 ${iconStyles.icon}`)}
                  </div>
                  <span className={`text-[9px] mt-1.5 truncate max-w-full select-none text-center ${iconStyles.text}`}>
                    {icon.label}
                  </span>
                  {isWiggling && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteIcon(icon.id);
                      }}
                      className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-rose-500 border border-white/25 rounded-full flex items-center justify-center text-white"
                    >
                      <X size={8} strokeWidth={3} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ZONE 1: Najwyższy priorytet / Najłatwiejszy zasięg kciuka (Bottom sweep) */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
            showHeatmap 
              ? 'bg-emerald-950/20 border-emerald-500/40 ring-2 ring-emerald-500/30 shadow-[0_4px_25px_rgba(16,185,129,0.15)]' 
              : 'bg-slate-900/50 border-white/10 backdrop-blur-xl shadow-lg'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                showHeatmap ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-300'
              }`}>
                {showHeatmap ? '🟢 Strefa 1: Strefa Komfortu (Wysoki priorytet)' : 'Najważniejsze sekcje portfolio'}
              </span>
              {showHeatmap && <span className="text-[9px] text-emerald-400 font-mono font-semibold">CTR &gt; 80%</span>}
            </div>

            {/* Natural bottom-right curve alignment of high priority items */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
              {mobilePriorityGroups.high.map((icon) => (
                <div
                  key={icon.id}
                  onPointerDown={(e) => startPress(icon.id, e)}
                  onPointerUp={endPress}
                  onPointerLeave={endPress}
                  onContextMenu={(e) => handleContextMenu(e, icon)}
                  onClick={(e) => handleIconClick(icon, e)}
                  className={`relative flex items-center gap-3 p-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl active:scale-95 transition-all ${
                    isWiggling ? 'animate-wiggle border-dashed border-purple-500/30' : ''
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${iconStyles.container} !w-10 !h-10 !rounded-xl`}>
                    {renderIcon(icon.icon, `w-4 h-4 ${iconStyles.icon}`)}
                  </div>
                  <div className="text-left overflow-hidden">
                    <span className="text-[10px] font-bold text-white truncate block select-none">
                      {icon.label}
                    </span>
                    <span className="text-[8px] text-slate-400 truncate block">Kliknij by otworzyć</span>
                  </div>
                  {isWiggling && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteIcon(icon.id);
                      }}
                      className="absolute -top-1 -left-1 w-5 h-5 bg-rose-500 border border-white/25 rounded-full flex items-center justify-center text-white"
                    >
                      <X size={10} strokeWidth={3} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Context Menu Component */}
        {contextMenu && (
          <div 
            style={{ 
              position: 'fixed',
              top: contextMenu.y, 
              left: contextMenu.x,
              zIndex: 999999
            }}
            className="bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl py-2 w-48 shadow-2xl animate-scaleIn text-left select-none flex flex-col gap-0.5 p-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1.5 border-b border-white/5 mb-1">
              <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest leading-none">Opcje ikony</p>
              <p className="text-xs font-semibold text-white truncate mt-1">{contextMenu.icon.label}</p>
            </div>
            <button
              onClick={(e) => {
                setContextMenu(null);
                handleOpenEdit(contextMenu.icon);
              }}
              className="w-full px-3 py-2 text-xs text-left text-white/80 hover:text-white hover:bg-white/10 rounded-xl flex items-center gap-2 transition-all cursor-pointer font-sans"
            >
              <Edit2 size={13} className="text-purple-400" />
              Zmień nazwę / edytuj
            </button>
            <button
              onClick={() => {
                handleDeleteIcon(contextMenu.icon.id);
                setContextMenu(null);
              }}
              className="w-full px-3 py-2 text-xs text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition-all cursor-pointer font-sans"
            >
              <X size={13} className="text-rose-400" />
              Usuń ikonę
            </button>
          </div>
        )}

        {/* Inline Icon Customize Modal */}
        {editingIcon && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-scaleIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-sans font-bold text-white flex items-center gap-1.5">
                  <Sparkles size={16} className="text-amber-400" />
                  Dostosuj Wygląd Ikony: {editingIcon.label}
                </h3>
                <button
                  onClick={() => setEditingIcon(null)}
                  className="text-slate-400 hover:text-white rounded"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Rename input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono">Etykieta Ikony</label>
                  <input
                    type="text"
                    value={editForm.label}
                    onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Select lucide icon symbol */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono">Symbol wektorowy</label>
                  <div className="grid grid-cols-6 gap-2">
                    {['user', 'folder', 'flask', 'award', 'mail', 'settings', 'sparkles', 'heart', 'star', 'terminal', 'clock', 'globe'].map((sym) => (
                      <button
                        key={sym}
                        id={`btn-select-sym-${sym}`}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, icon: sym }))}
                        className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                          editForm.icon === sym
                            ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {renderIcon(sym, "w-4 h-4")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select color gradient style */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono">Styl tła (Gradient poświatowy)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Fioletowy', value: 'from-purple-500/30 to-purple-500/10 border-purple-500/20' },
                      { name: 'Morski', value: 'from-cyan-500/30 to-cyan-500/10 border-cyan-500/20' },
                      { name: 'Ognisty', value: 'from-orange-500/30 to-orange-500/10 border-orange-500/20' },
                      { name: 'Różowy', value: 'from-pink-500/30 to-pink-500/10 border-pink-500/20' },
                      { name: 'Szmaragd', value: 'from-emerald-500/30 to-emerald-500/10 border-emerald-500/20' },
                      { name: 'Złoty', value: 'from-amber-500/30 to-amber-500/10 border-amber-500/20' }
                    ].map((grad, idx) => (
                      <button
                        key={idx}
                        id={`btn-select-grad-${idx}`}
                        type="button"
                        onClick={() => setEditForm(prev => ({ ...prev, color: grad.value }))}
                        className={`p-2 rounded-lg border text-[10px] font-sans font-medium transition-all text-center ${
                          editForm.color === grad.value
                            ? 'border-amber-500 text-amber-400 bg-slate-950/60'
                            : 'border-slate-800 text-slate-300 bg-slate-950/20'
                        }`}
                      >
                        {grad.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                <button
                  id="btn-save-icon-custom"
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-sans font-bold flex items-center gap-1"
                >
                  <Check size={12} /> Zapisz zmiany
                </button>
                <button
                  onClick={() => setEditingIcon(null)}
                  className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={() => toggleWiggling(false)}
      className="absolute inset-0 pt-16 pb-28 px-4 overflow-hidden grid grid-cols-6 grid-rows-5 gap-3 p-4"
      onDragOver={handleDragOver}
    >
      {/* Wiggle mode edit overlay banner */}
      {isWiggling && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-[999] bg-purple-500/10 border border-purple-500/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-xl shadow-purple-950/20 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs text-purple-200 font-sans font-medium">Tryb edycji włączony. Kliknij w puste miejsce, aby zakończyć.</span>
        </div>
      )}

      {/* 2D Grid Cells for Drop targeting */}
      {gridCells.map(({ r, c }) => {
        // Find icon in this grid cell
        const icon = icons.find(i => i.x === r && i.y === c);
        const iconStyles = getIconStyleClasses();

        return (
          <div
            key={`${r}-${c}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, r, c)}
            className="flex items-center justify-center relative rounded-xl border border-transparent transition-all"
          >
            {icon ? (
              icon.isWidget ? (
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, icon.id)}
                  onPointerDown={(e) => startPress(icon.id, e)}
                  onPointerUp={endPress}
                  onPointerLeave={endPress}
                  className={`group flex flex-col justify-between p-3.5 rounded-2xl w-40 h-28 text-left bg-slate-900/60 border border-white/10 hover:border-white/25 backdrop-blur-md shadow-xl transition-all duration-200 relative cursor-grab active:cursor-grabbing ${
                    isWiggling ? 'animate-wiggle border-dashed border-purple-500/55' : ''
                  }`}
                >
                  {/* Delete button inside wiggle mode */}
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

                  {/* Widget inner rendering */}
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

                  {icon.widgetType === 'clock' && (
                    <ClockWidgetComponent config={config} />
                  )}

                  {icon.widgetType === 'notes' && (
                    <NoteWidgetComponent iconId={icon.id} />
                  )}

                  {icon.widgetType === 'bio' && (
                    <div 
                      onClick={() => openApp('bio')}
                      className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full"
                    >
                      <div className="flex gap-1.5 items-center">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                          <Lucide.User size={12} />
                        </div>
                        <div className="truncate">
                          <h4 className="text-[10px] font-bold text-white leading-tight">O mnie</h4>
                          <p className="text-[8px] text-slate-400 font-medium leading-none">Adrian - Portfolio</p>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-300 leading-snug line-clamp-2 italic my-1">
                        {config.portfolioBio || "Architekt systemów full-stack, pasjonat AI."}
                      </p>
                      <span className="text-[8px] font-bold uppercase font-mono tracking-wider text-purple-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                        Otwórz profil &rarr;
                      </span>
                    </div>
                  )}

                  {icon.widgetType === 'projects' && (
                    <div 
                      onClick={() => openApp('projects')}
                      className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-1.5 items-center">
                          <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                            <Lucide.FolderGit2 size={12} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-white leading-tight">Projekty</h4>
                            <p className="text-[8px] text-slate-400 leading-none">Repozytoria</p>
                          </div>
                        </div>
                        <span className="text-[7px] font-bold bg-blue-500/20 border border-blue-500/30 text-blue-400 px-1 py-0.2 rounded font-mono">LIVE</span>
                      </div>
                      <p className="text-[9px] text-slate-300 leading-tight line-clamp-2 my-1">
                        Integracje AI, AdrianOS, Micro-SaaS i eksperymenty WebGL.
                      </p>
                      <span className="text-[8px] font-bold uppercase font-mono tracking-wider text-blue-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                        Zobacz wszystkie &rarr;
                      </span>
                    </div>
                  )}

                  {icon.widgetType === 'lab' && (
                    <div 
                      onClick={() => openApp('lab')}
                      className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full"
                    >
                      <div className="flex gap-1.5 items-center">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                          <Lucide.Flame size={12} />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-white leading-tight">Lab AI</h4>
                          <p className="text-[8px] text-slate-400 leading-none">Symulatory i fizyka</p>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-300 leading-tight line-clamp-2 my-1">
                        Testuj cząsteczki i symulator optymalizacji WindowsFixer.
                      </p>
                      <span className="text-[8px] font-bold uppercase font-mono tracking-wider text-amber-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                        Wejdź do labu &rarr;
                      </span>
                    </div>
                  )}

                  {icon.widgetType === 'certificates' && (
                    <div 
                      onClick={() => openApp('certificates')}
                      className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full"
                    >
                      <div className="flex gap-1.5 items-center">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                          <Lucide.Award size={12} />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-white leading-tight">Certyfikaty</h4>
                          <p className="text-[8px] text-slate-400 leading-none">AWS, GCP & Scrum</p>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-300 leading-tight line-clamp-2 my-1">
                        Zweryfikowane kwalifikacje chmurowe, DevOps oraz architektury.
                      </p>
                      <span className="text-[8px] font-bold uppercase font-mono tracking-wider text-emerald-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                        Przeglądaj &rarr;
                      </span>
                    </div>
                  )}

                  {icon.widgetType === 'contact' && (
                    <div 
                      onClick={() => openApp('contact')}
                      className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full"
                    >
                      <div className="flex gap-1.5 items-center">
                        <div className="w-6 h-6 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-400">
                          <Lucide.Mail size={12} />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-white leading-tight">Kontakt</h4>
                          <p className="text-[8px] text-slate-400 leading-none">Napisz do mnie</p>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-300 leading-tight line-clamp-2 my-1">
                        Szybka wiadomość, LinkedIn lub połączenie. Odpowiadam w 24h.
                      </p>
                      <span className="text-[8px] font-bold uppercase font-mono tracking-wider text-rose-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                        Wyślij wiadomość &rarr;
                      </span>
                    </div>
                  )}

                  {icon.widgetType === 'planned' && (
                    <div 
                      onClick={() => openApp('planned')}
                      className="flex flex-col h-full justify-between select-none cursor-pointer group/widget w-full"
                    >
                      <div className="flex gap-1.5 items-center">
                        <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                          <Lucide.Compass size={12} />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-white leading-tight">Kolejne projekty</h4>
                          <p className="text-[8px] text-slate-400 leading-none">Status Sprintu</p>
                        </div>
                      </div>
                      <div className="space-y-1 my-1">
                        <div className="flex justify-between text-[7px] font-mono font-bold text-slate-400">
                          <span>FAZA 3: INTEGRACJA</span>
                          <span className="text-cyan-400">85%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden border border-white/5">
                          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1 rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>
                      <span className="text-[8px] font-bold uppercase font-mono tracking-wider text-cyan-400 group-hover/widget:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                        Sprinty &rarr;
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, icon.id)}
                  onPointerDown={(e) => startPress(icon.id, e)}
                  onPointerUp={endPress}
                  onPointerLeave={endPress}
                  onContextMenu={(e) => handleContextMenu(e, icon)}
                  onClick={(e) => handleIconClick(icon, e)}
                  className={`group flex flex-col items-center justify-center p-3 rounded-2xl w-28 h-28 text-center cursor-grab active:cursor-grabbing hover:bg-white/5 border border-transparent hover:border-white/5 hover:backdrop-blur-sm transition-all duration-200 relative ${
                    isWiggling ? 'animate-wiggle' : ''
                  }`}
                >
                  {/* Dynamic Style variant wrapper container */}
                  <div className={`
                    w-16 h-16 flex items-center justify-center
                    group-hover:scale-105 group-hover:-translate-y-0.5
                    transition-all duration-300 relative
                    ${iconStyles.container}
                  `}>
                    {renderIcon(icon.icon, `w-6 h-6 ${iconStyles.icon}`)}
                    
                    {/* Subtle inner reflection dot - only for modern styles */}
                    {config.portfolioStyle !== 'retro' && (
                      <span className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-white/30" />
                    )}
                  </div>

                  {/* Edit options trigger */}
                  {!config.viewerMode && (
                    <button
                      id={`btn-edit-icon-${icon.id}`}
                      onClick={(e) => handleOpenEdit(icon, e)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-black/60 rounded-md border border-white/10 text-slate-400 hover:text-white transition-all duration-200"
                      title="Edytuj wygląd ikony"
                    >
                      <Edit2 size={10} />
                    </button>
                  )}

                  <span className={`truncate max-w-full leading-tight select-none mt-1.5 ${iconStyles.text}`}>
                    {icon.label}
                  </span>

                  {/* Delete direct badge button in wiggle mode */}
                  {isWiggling && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteIcon(icon.id);
                      }}
                      className="absolute -top-1 -left-1 w-5 h-5 bg-rose-500 hover:bg-rose-600 border border-white/20 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 z-20 cursor-pointer animate-scaleIn"
                      title="Usuń"
                    >
                      <X size={10} strokeWidth={3} />
                    </button>
                  )}
                </div>
              )
            ) : (
              isWiggling && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenAddElement(r, c);
                  }}
                  className="w-14 h-14 rounded-2xl border border-dashed border-white/20 hover:border-amber-400/50 flex items-center justify-center text-white/40 hover:text-amber-400 hover:bg-amber-400/10 transition-all cursor-pointer shadow-inner"
                  title="Dodaj nową ikonę lub widget"
                >
                  <Lucide.Plus size={16} />
                </button>
              )
            )}
          </div>
        );
      })}

      {/* Context Menu Component */}
      {contextMenu && (
        <div 
          style={{ 
            position: 'fixed',
            top: contextMenu.y, 
            left: contextMenu.x,
            zIndex: 999999
          }}
          className="bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl py-2 w-48 shadow-2xl animate-scaleIn text-left select-none flex flex-col gap-0.5 p-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 border-b border-white/5 mb-1">
            <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest leading-none">Opcje ikony</p>
            <p className="text-xs font-semibold text-white truncate mt-1">{contextMenu.icon.label}</p>
          </div>
          <button
            onClick={(e) => {
              setContextMenu(null);
              handleOpenEdit(contextMenu.icon);
            }}
            className="w-full px-3 py-2 text-xs text-left text-white/80 hover:text-white hover:bg-white/10 rounded-xl flex items-center gap-2 transition-all cursor-pointer font-sans"
          >
            <Edit2 size={13} className="text-purple-400" />
            Zmień nazwę / edytuj
          </button>
          <button
            onClick={() => {
              handleDeleteIcon(contextMenu.icon.id);
              setContextMenu(null);
            }}
            className="w-full px-3 py-2 text-xs text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition-all cursor-pointer font-sans"
          >
            <X size={13} className="text-rose-400" />
            Usuń ikonę
          </button>
        </div>
      )}

      {/* Inline Icon Customize Modal */}
      {editingIcon && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-scaleIn">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-sans font-bold text-white flex items-center gap-1.5">
                <Sparkles size={16} className="text-amber-400" />
                Dostosuj Wygląd Ikony: {editingIcon.label}
              </h3>
              <button
                onClick={() => setEditingIcon(null)}
                className="text-slate-400 hover:text-white rounded"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Rename input */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono">Etykieta Ikony</label>
                <input
                  type="text"
                  value={editForm.label}
                  onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Select lucide icon symbol */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono">Symbol wektorowy</label>
                <div className="grid grid-cols-6 gap-2">
                  {['user', 'folder', 'flask', 'award', 'mail', 'settings', 'sparkles', 'heart', 'star', 'terminal', 'clock', 'globe'].map((sym) => (
                    <button
                      key={sym}
                      id={`btn-select-sym-${sym}`}
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, icon: sym }))}
                      className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                        editForm.icon === sym
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {renderIcon(sym, "w-4 h-4")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select color gradient style */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-mono">Styl tła (Gradient poświatowy)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'Fioletowy', value: 'from-purple-500/30 to-purple-500/10 border-purple-500/20' },
                    { name: 'Morski', value: 'from-cyan-500/30 to-cyan-500/10 border-cyan-500/20' },
                    { name: 'Ognisty', value: 'from-orange-500/30 to-orange-500/10 border-orange-500/20' },
                    { name: 'Różowy', value: 'from-pink-500/30 to-pink-500/10 border-pink-500/20' },
                    { name: 'Szmaragd', value: 'from-emerald-500/30 to-emerald-500/10 border-emerald-500/20' },
                    { name: 'Złoty', value: 'from-amber-500/30 to-amber-500/10 border-amber-500/20' }
                  ].map((grad, idx) => (
                    <button
                      key={idx}
                      id={`btn-select-grad-${idx}`}
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, color: grad.value }))}
                      className={`p-2 rounded-lg border text-[10px] font-sans font-medium transition-all text-center ${
                        editForm.color === grad.value
                          ? 'border-amber-500 text-amber-400 bg-slate-950/60'
                          : 'border-slate-800 text-slate-300 bg-slate-950/20'
                      }`}
                    >
                      {grad.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
              <button
                id="btn-save-icon-custom"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-sans font-bold flex items-center gap-1"
              >
                <Check size={12} /> Zapisz zmiany
              </button>
              <button
                onClick={() => setEditingIcon(null)}
                className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Element / Widget Modal */}
      {addingCell && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-400">
                  <Lucide.Plus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-sans font-bold text-white">Dodaj nowy element</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Pozycja siatki: Rząd {addingCell.r + 1}, Kolumna {addingCell.c + 1}</p>
                </div>
              </div>
              <button
                onClick={() => setAddingCell(null)}
                className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mode selection tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-white/5">
              {[
                { id: 'social', label: 'Social Media', icon: 'Share2' },
                { id: 'widget', label: 'Widgety OS', icon: 'LayoutGrid' },
                { id: 'custom', label: 'Własny skrót', icon: 'Link2' }
              ].map((tab) => {
                const isActive = addForm.type === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAddForm(prev => ({ 
                      ...prev, 
                      type: tab.id as any,
                      label: tab.id === 'social' ? 'LinkedIn' : tab.id === 'widget' ? 'Pogoda' : 'Mój Skrót'
                    }))}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] uppercase tracking-wider font-bold font-sans transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-amber-500 text-slate-950 shadow' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {renderIcon(tab.icon === 'Share2' ? 'globe' : tab.icon === 'LayoutGrid' ? 'sparkles' : 'terminal', 'w-3 h-3')}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* FORM CONTENT BASED ON TAB */}
            <div className="space-y-4 py-2 min-h-[160px]">
              {addForm.type === 'social' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Wybierz sieć społecznościową</label>
                    <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto pr-1 bg-slate-950 p-2.5 rounded-xl border border-white/5">
                      {socialPresets.map((preset) => {
                        const isSel = addForm.socialPreset === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset.id)}
                            className={`p-2 rounded-xl border text-[10px] font-sans font-medium transition-all flex flex-col items-center gap-1 text-center truncate ${
                              isSel
                                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                                : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span className="w-5 h-5 flex items-center justify-center">
                              {renderIcon(preset.icon, 'w-4 h-4')}
                            </span>
                            <span className="text-[9px] truncate max-w-full">{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-mono">Etykieta skrótu</label>
                      <input
                        type="text"
                        value={addForm.label}
                        onChange={(e) => setAddForm(prev => ({ ...prev, label: e.target.value }))}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="np. Mój LinkedIn"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-mono">Adres URL / Kontakt</label>
                      <input
                        type="text"
                        value={addForm.url}
                        onChange={(e) => setAddForm(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {addForm.type === 'widget' && (
                <div className="space-y-4">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Wybierz interaktywny widget</label>
                  <div className="grid grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-1.5 custom-scrollbar">
                    {[
                      { id: 'weather', name: 'Pogoda', desc: 'Pokazuje aktualną pogodę w Warszawie', icon: 'Sun', color: 'from-amber-400/20 to-orange-500/10 border-amber-500/20 text-amber-400' },
                      { id: 'clock', name: 'Zegar', desc: 'Wyświetla czas i dzień tygodnia na żywo', icon: 'Clock', color: 'from-indigo-400/20 to-purple-500/10 border-indigo-500/20 text-purple-400' },
                      { id: 'notes', name: 'Notatnik', desc: 'Możliwość wpisywania i zapisu notatek', icon: 'FileText', color: 'from-emerald-400/20 to-teal-500/10 border-emerald-500/20 text-emerald-400' },
                      { id: 'bio', name: 'Bio O mnie', desc: 'Podsumowanie profilu i szybkie wejście', icon: 'User', color: 'from-purple-500/20 to-pink-500/10 border-purple-500/20 text-purple-400' },
                      { id: 'projects', name: 'Projekty', desc: 'Skrócony podgląd projektów i repozytoriów', icon: 'FolderGit2', color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/20 text-blue-400' },
                      { id: 'lab', name: 'Laboratorium', desc: 'Szybki dostęp do eksperymentów AI', icon: 'Flame', color: 'from-amber-500/20 to-red-500/10 border-amber-500/20 text-amber-400' },
                      { id: 'certificates', name: 'Certyfikaty', desc: 'Kwalifikacje i dyplomy zawodowe', icon: 'Award', color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-400' },
                      { id: 'contact', name: 'Kontakt', desc: 'Szybkie wysłanie wiadomości e-mail', icon: 'Mail', color: 'from-rose-500/20 to-pink-500/10 border-rose-500/20 text-rose-400' },
                      { id: 'planned', name: 'Plany / Sprint', desc: 'Wizualny status postępów i sprintu', icon: 'Compass', color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/20 text-cyan-400' }
                    ].map((w) => {
                      const isSel = addForm.widgetType === w.id;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setAddForm(prev => ({ ...prev, widgetType: w.id as any }))}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-28 select-none relative cursor-pointer hover:scale-[1.02] active:scale-95 ${
                            isSel
                              ? 'bg-slate-950 border-amber-500 text-white ring-1 ring-amber-500/20'
                              : 'bg-slate-950/40 border-white/5 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <span className="text-[10px] font-bold font-sans block leading-tight">{w.name}</span>
                            <span className={`w-5 h-5 rounded flex items-center justify-center bg-white/5 border ${w.color.split(' ').pop()}`}>
                              {renderIcon(w.icon, 'w-3 h-3')}
                            </span>
                          </div>
                          <p className="text-[8px] text-slate-500 mt-1 font-sans leading-tight line-clamp-2">{w.desc}</p>
                          {isSel && (
                            <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {addForm.type === 'custom' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-mono">Etykieta</label>
                      <input
                        type="text"
                        value={addForm.label}
                        onChange={(e) => setAddForm(prev => ({ ...prev, label: e.target.value }))}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="np. Mój Blog"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-mono">Adres URL</label>
                      <input
                        type="text"
                        value={addForm.url}
                        onChange={(e) => setAddForm(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Symbol wektorowy</label>
                      <div className="grid grid-cols-5 gap-1 bg-slate-950 p-2 rounded-xl border border-white/5">
                        {['globe', 'terminal', 'folder', 'star', 'mail', 'settings', 'phone', 'zap', 'award', 'heart'].map((sym) => (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => setAddForm(prev => ({ ...prev, icon: sym }))}
                            className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
                              addForm.icon === sym
                                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {renderIcon(sym, "w-3.5 h-3.5")}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Tło poświatowe</label>
                      <div className="grid grid-cols-2 gap-1 max-h-[85px] overflow-y-auto pr-1 bg-slate-950 p-2 rounded-xl border border-white/5">
                        {[
                          { name: 'Morski', value: 'from-cyan-500/30 to-cyan-500/10 border-cyan-500/20' },
                          { name: 'Fioletowy', value: 'from-purple-500/30 to-purple-500/10 border-purple-500/20' },
                          { name: 'Szmaragd', value: 'from-emerald-500/30 to-emerald-500/10 border-emerald-500/20' },
                          { name: 'Złoty', value: 'from-amber-500/30 to-amber-500/10 border-amber-500/20' }
                        ].map((grad, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAddForm(prev => ({ ...prev, color: grad.value }))}
                            className={`p-1 py-1.5 rounded-lg border text-[9px] font-sans font-medium transition-all text-center ${
                              addForm.color === grad.value
                                ? 'border-amber-500 text-amber-400 bg-slate-900'
                                : 'border-transparent text-slate-400 bg-transparent hover:text-slate-200'
                            }`}
                          >
                            {grad.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom action row */}
            <div className="flex gap-2 justify-end pt-3 border-t border-slate-800">
              <button
                onClick={handleAddElement}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/15 cursor-pointer active:scale-95 transition-all"
              >
                <Check size={14} strokeWidth={2.5} /> Utwórz element
              </button>
              <button
                onClick={() => setAddingCell(null)}
                className="px-5 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-750 hover:text-white rounded-xl text-xs font-sans cursor-pointer active:scale-95 transition-all"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
