/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Certificate, TimelineItem, ActiveSprint, DesktopIcon, OSConfig } from './types';

export const initialProjects: Project[] = [];

export const initialCertificates: Certificate[] = [];

export const initialTimeline: TimelineItem[] = [];

export const initialSprints: ActiveSprint[] = [];

export const initialDesktopIcons: DesktopIcon[] = [
  {
    id: 'icon-bio',
    label: 'O mnie (Bio)',
    appId: 'bio',
    icon: 'user',
    color: 'from-purple-500/30 to-purple-500/10 hover:shadow-purple-500/20 border-purple-500/20',
    x: 0,
    y: 0
  },
  {
    id: 'icon-projects',
    label: 'Moje Projekty',
    appId: 'projects',
    icon: 'folder',
    color: 'from-cyan-500/30 to-cyan-500/10 hover:shadow-cyan-500/20 border-cyan-500/20',
    x: 0,
    y: 1
  },
  {
    id: 'icon-lab',
    label: 'Aktualne Projekty',
    appId: 'lab',
    icon: 'flask',
    color: 'from-orange-500/30 to-orange-500/10 hover:shadow-orange-500/20 border-orange-500/20',
    x: 0,
    y: 2
  },
  {
    id: 'icon-certificates',
    label: 'Certyfikaty',
    appId: 'certificates',
    icon: 'award',
    color: 'from-pink-500/30 to-pink-500/10 hover:shadow-pink-500/20 border-pink-500/20',
    x: 1,
    y: 0
  },
  {
    id: 'icon-settings',
    label: 'Personalizacja',
    appId: 'settings',
    icon: 'settings',
    color: 'from-purple-500/30 to-purple-500/10 hover:shadow-purple-500/20 border-purple-500/20',
    x: 1,
    y: 1
  },
  {
    id: 'icon-contact',
    label: 'Napisz do mnie',
    appId: 'contact',
    icon: 'mail',
    color: 'from-emerald-500/30 to-emerald-500/10 hover:shadow-emerald-500/20 border-emerald-500/20',
    x: 1,
    y: 2
  },
  {
    id: 'icon-wizard',
    label: 'Generator Portfolio',
    appId: 'wizard',
    icon: 'sparkles',
    color: 'from-amber-500/30 to-amber-500/10 hover:shadow-amber-500/20 border-amber-500/20',
    x: 2,
    y: 0
  },
  {
    id: 'icon-gdrive',
    label: 'Google Drive',
    appId: 'gdrive',
    icon: 'hardDrive',
    color: 'from-blue-500/30 to-blue-500/10 hover:shadow-blue-500/20 border-blue-500/20',
    x: 2,
    y: 1
  },
  {
    id: 'icon-calendar',
    label: 'Kalendarz Google',
    appId: 'calendar',
    icon: 'calendar',
    color: 'from-emerald-500/30 to-emerald-500/10 hover:shadow-emerald-500/20 border-emerald-500/20',
    x: 2,
    y: 2
  },
  {
    id: 'icon-planned',
    label: 'Planowane projekty',
    appId: 'planned',
    icon: 'phone',
    color: 'from-rose-500/30 to-rose-500/10 hover:shadow-rose-500/20 border-rose-500/20',
    x: 3,
    y: 0
  }
];

export const defaultOSConfig: OSConfig = {
  glowIntensity: 85,
  accentColor: 'cyan',
  visualMode: 'deep-space',
  wallpaper: 'ubuntu-pixel',
  proMode: true,
  portfolioName: '',
  portfolioBio: '',
  isInitialized: false,
  playSounds: true,
  pixelTheme: false,
  portfolioStyle: 'modern',
  iconStyleModern: 'lumine-ubuntu-style',
  iconStyleRetro: 'classic-windows-95',
  fontSizeScale: 1.0,
  glassBlur: 'medium',
  borderStyle: 'thin',
  systemFont: 'apple',
  systemTheme: 'terraria'
};

export const wallpaperOptions = [
  { id: 'ubuntu-pixel', name: 'Klasyczna Oberżyna (Mroczny Fiolet)', value: 'linear-gradient(135deg, #120e16 0%, #09070c 50%, #040306 100%)' },
  { id: 'space-nebula', name: 'Głęboki Kosmos (Mroczny Granat)', value: 'linear-gradient(135deg, #090c15 0%, #05070c 50%, #020306 100%)' },
  { id: 'amber-sunset', name: 'Bursztynowa Cisza (Głęboki Bursztyn)', value: 'linear-gradient(135deg, #120d09 0%, #0a0705 50%, #040302 100%)' },
  { id: 'neon-cyber', name: 'Neonowy Cyber-Glow (Mroczna Czerń)', value: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.02) 0%, transparent 60%), #07070a' },
  { id: 'emerald-aurora', name: 'Szmaragdowa Zorza (Głęboka Zieleń)', value: 'linear-gradient(135deg, #08120d 0%, #040a07 50%, #020403 100%)' }
];
