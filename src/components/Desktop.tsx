/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, Reorder } from 'motion/react';
import { DesktopIcon, OSConfig } from '../types';
import { initialDesktopIcons } from '../data';
import * as Lucide from 'lucide-react';
import { Edit2, Sparkles, X, Check } from 'lucide-react';
import { playXpClick, playXpError, playXpBalloon } from '../lib/sounds';
import { triggerHaptic } from '../lib/haptics';
import { DesktopIconGrid } from './desktop/DesktopIconGrid';
import { DesktopContextMenu } from './desktop/DesktopContextMenu';
import { useDesktopContextMenu } from './desktop/useDesktopContextMenu';
import { useDesktopIconLayout } from './desktop/useDesktopIconLayout';

interface DesktopProps {
  icons: DesktopIcon[];
  setIcons: React.Dispatch<React.SetStateAction<DesktopIcon[]>>;
  openApp: (appId: 'bio' | 'projects' | 'dashboard' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'terminal') => void;
  config: OSConfig;
  isKreatorMode?: boolean;
  setIsKreatorMode?: (val: boolean) => void;
  isPublicView?: boolean;
}

export const Desktop: React.FC<DesktopProps> = ({
  icons,
  setIcons,
  openApp,
  config,
  isKreatorMode = false,
  setIsKreatorMode,
  isPublicView = false
}) => {
  // Track mobile state and heatmap toggle
  const [isMobile, setIsMobile] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  const isDraggingRef = useRef(false);
  const hasLongPressed = useRef(false);
  const longPressTimer = useRef<any>(null);
  
  const handleWidgetClick = (appId: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDraggingRef.current) return;
    openApp(appId);
  };
  
  const displayedIcons = isPublicView 
    ? icons.filter(i => i.appId !== 'wizard' && i.appId !== 'settings') 
    : icons.filter(i => i.appId !== 'settings');
  
  // Custom device UA and orientation help states
  const [deviceUA, setDeviceUA] = useState('');
  const [browserUA, setBrowserUA] = useState('');
  const [showOrientationHint, setShowOrientationHint] = useState(() => {
    return localStorage.getItem('adrianOrientationDismissed') !== 'true';
  });
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const handleResize = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < 768);
        setIsPortrait(window.innerHeight > window.innerWidth);
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    const ua = navigator.userAgent;
    let dev = 'MIUI / ColorOS';
    let brow = 'Mobile';
    
    if (/android/i.test(ua)) {
      dev = 'MIUI v14 / ColorOS (Android)';
      if (/chrome/i.test(ua)) brow = 'Chrome Mobile';
      else if (/firefox/i.test(ua)) brow = 'Firefox';
    } else if (/iphone|ipad|ipod/i.test(ua)) {
      dev = 'iOS Device (iPhone)';
      if (/safari/i.test(ua) && !/chrome/i.test(ua)) brow = 'Safari Mobile';
      else if (/chrome/i.test(ua)) brow = 'Chrome Mobile';
    } else if (/windows/i.test(ua)) {
      dev = 'Windows Workstation';
      brow = 'Edge/Chrome';
    } else if (/linux/i.test(ua)) {
      dev = 'Linux Kernel Workstation';
      brow = 'Chromium';
    }
    setDeviceUA(dev);
    setBrowserUA(brow);
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
    if (config.viewerMode || isPublicView) {
      setIsWiggling(false);
    } else {
      setIsWiggling(isKreatorMode);
    }
  }, [isKreatorMode, config.viewerMode]);

  const toggleWiggling = (val: boolean) => {
    if (config.viewerMode || isPublicView) return;
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
    widgetType: 'weather' as 'weather' | 'clock' | 'notes' | 'inbox'
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
    if (icons.length >= 30) {
      alert("Osiągnięto maksymalną liczbę elementów na pulpicie.");
      return;
    }
    if (!addingCell) return;
    
    let finalLabel = addForm.label;
    let finalIcon = addForm.icon;
    let finalColor = addForm.color;
    let finalUrl: string | undefined = undefined;
    let isWidget = false;
    let widgetType: DesktopIcon['widgetType'] = undefined;

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
      } else if (widgetType === 'inbox') {
        finalLabel = 'Skrzynka Poczty';
        finalIcon = 'Mail';
        finalColor = 'from-purple-500/20 to-indigo-500/10 border-purple-500/20';
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
    const { contextMenu, setContextMenu, handleContextMenu } = useDesktopContextMenu(config);

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
            container: 'bg-gradient-to-br from-[#E95420] via-[#b33e4f] to-[#77216F] border-2 border-orange-500/80 shadow-[0_0_20px_rgba(233,84,32,0.45),0_4px_12px_rgba(233,84,32,0.35),inset_0_1px_2px_rgba(255,255,255,0.45)] rounded-[18px] text-white',
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

  const getWidgetStyleClasses = (widgetType: string) => {
    const styles: Record<string, { card: string; iconBg: string; text: string }> = {
      weather: {
        card: 'bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-slate-950/80 border-amber-500/20 hover:border-amber-400/40 shadow-[0_4px_20px_rgba(245,158,11,0.05)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.15)]',
        iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        text: 'text-amber-400'
      },
      clock: {
        card: 'bg-gradient-to-br from-indigo-500/10 via-slate-900/60 to-slate-950/80 border-indigo-500/20 hover:border-indigo-400/40 shadow-[0_4px_20px_rgba(124,58,237,0.05)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.15)]',
        iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
        text: 'text-indigo-400'
      },
      notes: {
        card: 'bg-gradient-to-br from-emerald-500/10 via-slate-900/60 to-slate-950/80 border-emerald-500/20 hover:border-emerald-400/40 shadow-[0_4px_20px_rgba(16,185,129,0.05)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.15)]',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        text: 'text-emerald-400'
      },
      bio: {
        card: 'bg-gradient-to-br from-purple-500/10 via-slate-900/60 to-slate-950/80 border-purple-500/20 hover:border-purple-400/40 shadow-[0_4px_20px_rgba(168,85,247,0.05)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.15)]',
        iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        text: 'text-purple-400'
      },
      projects: {
        card: 'bg-gradient-to-br from-blue-500/10 via-slate-900/60 to-slate-950/80 border-blue-500/20 hover:border-blue-400/40 shadow-[0_4px_20px_rgba(59,130,246,0.05)] hover:shadow-[0_4px_30px_rgba(59,130,246,0.15)]',
        iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        text: 'text-blue-400'
      },
      lab: {
        card: 'bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-slate-950/80 border-amber-500/20 hover:border-amber-400/40 shadow-[0_4px_20px_rgba(245,158,11,0.05)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.15)]',
        iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        text: 'text-amber-400'
      },
      certificates: {
        card: 'bg-gradient-to-br from-emerald-500/10 via-slate-900/60 to-slate-950/80 border-emerald-500/20 hover:border-emerald-400/40 shadow-[0_4px_20px_rgba(16,185,129,0.05)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.15)]',
        iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        text: 'text-emerald-400'
      },
      contact: {
        card: 'bg-gradient-to-br from-rose-500/10 via-slate-900/60 to-slate-950/80 border-rose-500/20 hover:border-rose-400/40 shadow-[0_4px_20px_rgba(244,63,94,0.05)] hover:shadow-[0_4px_30px_rgba(244,63,94,0.15)]',
        iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        text: 'text-rose-400'
      },
      planned: {
        card: 'bg-gradient-to-br from-cyan-500/10 via-slate-900/60 to-slate-950/80 border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_4px_20px_rgba(6,182,212,0.05)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.15)]',
        iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
        text: 'text-cyan-400'
      },
      inbox: {
        card: 'bg-gradient-to-br from-purple-500/10 via-slate-900/60 to-slate-950/80 border-purple-500/20 hover:border-purple-400/40 shadow-[0_4px_20px_rgba(168,85,247,0.05)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.15)]',
        iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        text: 'text-purple-400'
      }
    };
    return styles[widgetType] || styles.bio;
  };

  // HTML5 Drag-and-Drop Handlers for Icon Movement
  
  
    const { handleDragEnd, handleMobileReorder } = useDesktopIconLayout(setIcons);const handleOpenEdit = (icon: DesktopIcon, e?: React.MouseEvent) => {
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
    if (e.button !== 0 && e.pointerType === 'mouse') return; // Left click/touch only
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
    }, 500);
  };

  const endPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleIconClick = (icon: DesktopIcon, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDraggingRef.current) {
      return;
    }
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

  return (
    <div 
      onClick={() => toggleWiggling(false)}
      className={`absolute inset-0 pb-28 px-4 ${isMobile ? 'overflow-y-auto flex flex-col gap-3 content-start pt-24' : 'pt-28 overflow-hidden grid grid-cols-[repeat(6,min-content)] grid-rows-[repeat(5,min-content)] gap-8 p-4 content-start justify-start'}`}
      
    >
      {/* Wiggle mode edit overlay banner */}
      {isWiggling && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-[999] bg-purple-500/10 border border-purple-500/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-xl shadow-purple-950/20 animate-bounce">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs text-purple-200 font-sans font-medium">Tryb edycji włączony. Kliknij w puste miejsce, aby zakończyć.</span>
        </div>
      )}

            {/* Grid or Stack items */}
      <DesktopIconGrid
        icons={icons}
        displayedIcons={displayedIcons}
        config={config}
        isMobile={isMobile}
        isWiggling={isWiggling}
        gridCells={gridCells}
        isDraggingRef={isDraggingRef}
        handleIconClick={handleIconClick}
        handleContextMenu={handleContextMenu}
        handleDeleteIcon={handleDeleteIcon}
        handleOpenEdit={handleOpenEdit}
        handleOpenAddElement={handleOpenAddElement}
        startPress={startPress}
        endPress={endPress}
        handleDragEnd={handleDragEnd}
        handleMobileReorder={handleMobileReorder}
        openApp={openApp}
      />

            {/* Context Menu Component */}
      <DesktopContextMenu 
        contextMenu={contextMenu} 
        setContextMenu={setContextMenu} 
        handleOpenEdit={handleOpenEdit} 
        handleDeleteIcon={handleDeleteIcon} 
      />
{/* Inline Icon Customize Modal */}
      {editingIcon && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-md backdrop-blur-md bg-slate-900/60 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5 animate-scaleIn">
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
                <span className="text-[10px] text-slate-400 uppercase font-mono">Etykieta Ikony</span>
                <input
                  type="text"
                  value={editForm.label}
                  onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-1.5 backdrop-blur-md bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Select lucide icon symbol */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Symbol wektorowy</span>
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
                          : 'backdrop-blur-md bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {renderIcon(sym, "w-4 h-4")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select color gradient style */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Styl tła (Gradient poświatowy)</span>
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
                          : 'border-white/10 text-slate-300 bg-slate-950/20'
                      }`}
                    >
                      {grad.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-white/10">
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
          <div className="w-full max-w-lg backdrop-blur-md bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-xl space-y-6 animate-scaleIn">
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
            <div className="grid grid-cols-3 gap-1 backdrop-blur-md bg-slate-950/60 p-1 rounded-xl border border-white/5">
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
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Wybierz sieć społecznościową</span>
                    <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto pr-1 backdrop-blur-md bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
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
                                : 'backdrop-blur-md bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
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
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Etykieta skrótu</span>
                      <input
                        type="text"
                        value={addForm.label}
                        onChange={(e) => setAddForm(prev => ({ ...prev, label: e.target.value }))}
                        className="w-full px-3 py-1.5 backdrop-blur-md bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="np. Mój LinkedIn"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Adres URL / Kontakt</span>
                      <input
                        type="text"
                        value={addForm.url}
                        onChange={(e) => setAddForm(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-3 py-1.5 backdrop-blur-md bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {addForm.type === 'widget' && (
                <div className="space-y-4">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Wybierz interaktywny widget</span>
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
                      { id: 'planned', name: 'Plany / Sprint', desc: 'Wizualny status postępów i sprintu', icon: 'Compass', color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/20 text-cyan-400' },
                      { id: 'inbox', name: 'Poczta Rekrutera', desc: 'Skrzynka odbiorcza na wiadomości z formularza', icon: 'Mail', color: 'from-purple-400/20 to-indigo-500/10 border-purple-500/20 text-purple-400' }
                    ].map((w) => {
                      const isSel = addForm.widgetType === w.id;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setAddForm(prev => ({ ...prev, widgetType: w.id as any }))}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-28 select-none relative cursor-pointer hover:scale-[1.02] active:scale-95 ${
                            isSel
                              ? 'backdrop-blur-md bg-slate-950/60 border-amber-500 text-white ring-1 ring-amber-500/20'
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
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Etykieta</span>
                      <input
                        type="text"
                        value={addForm.label}
                        onChange={(e) => setAddForm(prev => ({ ...prev, label: e.target.value }))}
                        className="w-full px-3 py-1.5 backdrop-blur-md bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="np. Mój Blog"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Adres URL</span>
                      <input
                        type="text"
                        value={addForm.url}
                        onChange={(e) => setAddForm(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-3 py-1.5 backdrop-blur-md bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Symbol wektorowy</span>
                      <div className="grid grid-cols-5 gap-1 backdrop-blur-md bg-slate-950/60 p-2 rounded-xl border border-white/5">
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
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Tło poświatowe</span>
                      <div className="grid grid-cols-2 gap-1 max-h-[85px] overflow-y-auto pr-1 backdrop-blur-md bg-slate-950/60 p-2 rounded-xl border border-white/5">
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
            <div className="flex gap-2 justify-end pt-3 border-t border-white/10">
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

            {/* Context Menu Component */}
      <DesktopContextMenu 
        contextMenu={contextMenu} 
        setContextMenu={setContextMenu} 
        handleOpenEdit={handleOpenEdit} 
        handleDeleteIcon={handleDeleteIcon} 
      />
{/* Inline Icon Customize Modal */}
      {editingIcon && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-md backdrop-blur-md bg-slate-900/60 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5 animate-scaleIn">
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
                <span className="text-[10px] text-slate-400 uppercase font-mono">Etykieta Ikony</span>
                <input
                  type="text"
                  value={editForm.label}
                  onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-1.5 backdrop-blur-md bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Select lucide icon symbol */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Symbol wektorowy</span>
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
                          : 'backdrop-blur-md bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {renderIcon(sym, "w-4 h-4")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select color gradient style */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Styl tła (Gradient poświatowy)</span>
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
                          : 'border-white/10 text-slate-300 bg-slate-950/20'
                      }`}
                    >
                      {grad.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-white/10">
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
};





