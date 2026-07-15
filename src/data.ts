/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Certificate, TimelineItem, ActiveSprint, DesktopIcon, OSConfig } from './types';

// Tutaj uzupełniasz swoje projekty. Pierwszy z nich to PortfolioOS!
export const initialProjects: Project[] = [
  {
    id: 'portfolio-os',
    title: 'PortfolioOS',
    description: 'Innowacyjna platforma webowa pozwalająca każdemu stworzyć interaktywny profil-wizytówkę w formie wirtualnego systemu operacyjnego. Projekt, który właśnie przeglądasz!',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    type: 'manual',
    link: 'https://oauthcry.com' // Link do kreatora lub repo
  },
  {
    id: 'project-2',
    title: '[Nazwa Twojego Projektu 2]',
    description: 'Krótki opis projektu, problemu, który rozwiązuje i Twojej roli. Wykorzystana architektura cloudowa, mikroserwisy itp.',
    tags: ['Node.js', 'Azure', 'Docker'],
    type: 'manual'
  },
  {
    id: 'project-3',
    title: '[Nazwa Twojego Projektu 3]',
    description: 'Aplikacja mobilna / webowa z naciskiem na wydajność. Opisz krótko stack technologiczny.',
    tags: ['React Native', 'Firebase', 'Redux'],
    type: 'manual'
  }
];

// Twoje certyfikaty i odznaki
export const initialCertificates: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Microsoft Certified: Azure Developer Associate',
    issuer: 'Microsoft',
    date: '2023-05-10',
    description: 'Certyfikat potwierdzający zaawansowane umiejętności tworzenia rozwiązań chmurowych na platformie Azure.',
    verified: true
  },
  {
    id: 'cert-2',
    title: '[Nazwa Twojego Certyfikatu]',
    issuer: '[Wydawca, np. AWS / Google / Coursera]',
    date: '2022-11-20',
    description: 'Opis zdobytej wiedzy lub certyfikacji.',
    verified: true
  }
];

// Oś czasu Twojej kariery / edukacji
export const initialTimeline: TimelineItem[] = [
  {
    id: 'timeline-1',
    period: '2023 - Obecnie',
    role: 'Senior Software Engineer',
    company: '[Nazwa Firmy / Freelance]',
    description: 'Projektowanie i wdrażanie skalowalnych aplikacji webowych. Wprowadzanie rozwiązań opartych na sztucznej inteligencji.'
  },
  {
    id: 'timeline-2',
    period: '2021 - 2023',
    role: 'Full-Stack Developer',
    company: '[Poprzednia Firma]',
    description: 'Rozwój systemów backendowych, optymalizacja baz danych i tworzenie interfejsów użytkownika w React.'
  }
];

// Aktywne sprinty lub to, czego się aktualnie uczysz
export const initialSprints: ActiveSprint[] = [
  {
    id: 'sprint-1',
    title: 'Rozwój AI Agentów w Azure',
    phase: 'Wdrażanie',
    progress: 75,
    status: 'In Progress',
    tags: ['Azure OpenAI', 'Python']
  },
  {
    id: 'sprint-2',
    title: 'Optymalizacja CI/CD',
    phase: 'Testowanie',
    progress: 40,
    status: 'In Progress',
    tags: ['GitHub Actions', 'Docker']
  }
];

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
    x: 1,
    y: 0
  },
  {
    id: 'icon-certificates',
    label: 'Certyfikaty',
    appId: 'certificates',
    icon: 'award',
    color: 'from-pink-500/30 to-pink-500/10 hover:shadow-pink-500/20 border-pink-500/20',
    x: 2,
    y: 0
  },
  {
    id: 'icon-terminal',
    label: 'Terminal',
    appId: 'terminal',
    icon: 'terminal',
    color: 'from-green-500/30 to-green-500/10 hover:shadow-green-500/20 border-green-500/20',
    x: 3,
    y: 0
  },
  {
    id: 'icon-settings',
    label: 'Personalizacja',
    appId: 'settings',
    icon: 'settings',
    color: 'from-purple-500/30 to-purple-500/10 hover:shadow-purple-500/20 border-purple-500/20',
    x: 0,
    y: 1
  },
  {
    id: 'widget-tech-radar',
    label: 'Tech Radar',
    appId: 'tech-radar',
    icon: 'radar',
    color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/20',
    x: 1,
    y: 1,
    isWidget: true,
    widgetType: 'tech-radar'
  },
  {
    id: 'widget-github-activity',
    label: 'GitHub Activity',
    appId: 'github-activity',
    icon: 'activity',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20',
    x: 3,
    y: 1,
    isWidget: true,
    widgetType: 'github-activity'
  },
  {
    id: 'widget-quick-contact',
    label: 'Szybki Kontakt',
    appId: 'quick-contact',
    icon: 'messageSquare',
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/20',
    x: 0,
    y: 3,
    isWidget: true,
    widgetType: 'quick-contact'
  }
];

export const defaultOSConfig: OSConfig = {
  glowIntensity: 85,
  accentColor: 'cyan',
  visualMode: 'deep-space',
  wallpaper: 'ubuntu-pixel',
  proMode: true,
  // Domyślna konfiguracja ustawiona pod Ciebie
  portfolioName: 'Adrian',
  fullName: 'Adrian',
  professionalRole: 'Software Engineer & Creator',
  portfolioBio: 'Witaj w moim wirtualnym systemie operacyjnym! Jestem inżynierem oprogramowania pasjonującym się nowoczesnymi technologiami webowymi, chmurą i rozwiązaniami AI. To portfolio zostało stworzone przy użyciu autorskiego narzędzia PortfolioOS.',
  skills: ['React', 'TypeScript', 'Node.js', 'Microsoft Azure', 'Tailwind CSS', 'AI Integration'],
  isInitialized: true, // Od razu zainicjowane, by pokazać Twoje portfolio jako domyślne
  playSounds: false,
  pixelTheme: false,
  portfolioStyle: 'lumine-ubuntu-style',
  iconStyleModern: 'lumine-ubuntu-style',
  iconStyleRetro: 'classic-windows-95',
  fontSizeScale: 2.0,
  glassBlur: 'medium',
  borderStyle: 'thin',
  systemFont: 'apple',
  systemTheme: 'terraria'
};

export const wallpaperOptions = [
  { id: 'ubuntu-matte', name: 'Ubuntu Matte (Matowy Fiolet)', value: 'linear-gradient(135deg, #2c001e 0%, #300a24 50%, #1a0011 100%)' },
  { id: 'dynamic-ubuntu', name: 'Ubuntu Dynamic (Płynny)', value: 'linear-gradient(-45deg, #300a24, #2c001e, #5e2750, #77216f)' },
  { id: 'dynamic-sunset', name: 'Dynamic Sunset (Płynny)', value: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)' },
  { id: 'dynamic-aurora', name: 'Zorza Polarna (Płynny)', value: 'linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #120e16)' },
  { id: 'ubuntu-pixel', name: 'Klasyczna Oberżyna (Mroczny Fiolet)', value: 'linear-gradient(135deg, #120e16 0%, #09070c 50%, #040306 100%)' },
  { id: 'space-nebula', name: 'Głęboki Kosmos (Mroczny Granat)', value: 'linear-gradient(135deg, #090c15 0%, #05070c 50%, #020306 100%)' },
  { id: 'neon-cyber', name: 'Neonowy Cyber-Glow (Mroczna Czerń)', value: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.02) 0%, transparent 60%), #07070a' }
];
