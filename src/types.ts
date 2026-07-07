/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  stars?: number;
  lastSync?: string;
  tags: string[];
  type: 'github' | 'manual';
  thumbnail?: string;
  link?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  logoUrl?: string;
  verified: boolean;
}

export interface TimelineItem {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
}

export interface ActiveSprint {
  id: string;
  title: string;
  phase: string;
  progress: number;
  status: string;
  tags: string[];
}

export interface DesktopIcon {
  id: string;
  label: string;
  appId: string; // Opens specific application windows ('bio' | 'projects' | 'lab' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'planned')
  icon: string; // Lucide icon identifier or name
  color: string; // Gradient color theme for the 3D glass icon
  x: number; // Row index (0-based) on grid or fractional X
  y: number; // Col index (0-based) on grid or fractional Y
  url?: string; // Optional URL for direct opening (e.g. social media profiles)
  isWidget?: boolean; // If true, render inline desktop widget
  widgetType?: 'weather' | 'clock' | 'notes' | 'bio' | 'projects' | 'lab' | 'certificates' | 'contact' | 'planned'; // Type of widget
}

export interface OSConfig {
  glowIntensity: number; // 0 to 100
  accentColor: 'purple' | 'cyan' | 'orange' | 'emerald' | 'amber-retro' | 'mono-terminal';
  themePack?: 'purple' | 'cyan' | 'orange' | 'emerald' | 'amber-retro' | 'mono-terminal';
  visualMode: 'deep-space' | 'aurora';
  wallpaper: string; // image ID or class name
  proMode: boolean; // Controls demo tier
  portfolioName: string;
  portfolioBio: string;
  portfolioCategory?: 'tech' | 'craft' | 'agriculture' | 'gardening' | 'creative' | 'business' | 'general';
  isInitialized?: boolean;
  phone?: string;
  address?: string;
  githubUsername?: string;
  instagramUsername?: string;
  linkedinUsername?: string;
  instagramPhotos?: string[];
  playSounds?: boolean;
  pixelTheme?: boolean;
  systemTheme?: 'terraria' | 'classic-mac' | 'cyberpunk' | 'retro-gold';
  particles?: 'sparkles' | 'leaves' | 'bubbles' | 'none';
  clockFormat?: '24h' | '12h';
  windowStyle?: 'curved-classic' | 'sharp-chunky';
  portfolioStyle?: 'modern' | 'retro';
  iconStyleModern?: string;
  iconStyleRetro?: string;
  fontSizeScale?: number;
  glassBlur?: 'none' | 'low' | 'medium' | 'high';
  borderStyle?: 'none' | 'thin' | 'thick' | 'double';
  wizardTags?: string[];
  wizardFocusInput?: string;
  wizardManualProfessionId?: string;
  wizardAnswers?: { [key: string]: string };
  viewerMode?: boolean;
  systemFont?: 'apple' | 'ubuntu' | 'inter' | 'retro';
}

export type ActiveAppId = 'bio' | 'projects' | 'lab' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'gdrive' | 'calendar' | 'planned' | null;
