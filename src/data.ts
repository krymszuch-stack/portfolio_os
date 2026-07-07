/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Certificate, TimelineItem, ActiveSprint, DesktopIcon, OSConfig } from './types';

export const initialProjects: Project[] = [
  {
    id: 'proj-win-fixer',
    title: 'WinFix AI - Inteligentny Naprawiacz Systemu Windows',
    description: 'Zaawansowany system ekspercki do zdalnej diagnozy, naprawy błędów i hardeningu zabezpieczeń systemu Windows na podstawie analizy zachowania oraz dzienników zdarzeń.',
    stars: 1420,
    lastSync: 'Przed chwilą',
    tags: ['React', 'TypeScript', 'Expert System', 'Tailwind CSS', 'Diagnostics'],
    type: 'manual',
    link: '#win-fixer-demo'
  },
  {
    id: 'proj-1',
    title: 'react-immersive-desktop',
    description: 'Immersyjne, trójwymiarowe środowisko pulpitu webowego zbudowane w oparciu o React, Tailwind v4 i zaawansowane efekty glassmorphism.',
    stars: 842,
    lastSync: '2 minuty temu',
    tags: ['TypeScript', 'React', 'Tailwind v4', 'Framer Motion'],
    type: 'github',
    link: 'https://github.com/adrianowicz11/react-immersive-desktop'
  },
  {
    id: 'proj-2',
    title: 'gemini-context-engine',
    description: 'Wysoko wydajny mikroserwis Node.js koordynujący okna kontekstowe LLM z dynamicznym semantycznym dzieleniem tekstu.',
    stars: 124,
    lastSync: '1 godzina temu',
    tags: ['Node.js', 'TypeScript', 'Gemini API', 'Vector DB'],
    type: 'github',
    link: 'https://github.com/adrianowicz11/gemini-context-engine'
  },
  {
    id: 'proj-3',
    title: 'Synapse Flow Visualizer',
    description: 'Zaawansowany edytor wizualny do modelowania maszyn stanowych i automatyzacji workflow, zintegrowany z bibliotekami D3.js i React Flow.',
    tags: ['React', 'D3.js', 'Tailwind CSS', 'XState'],
    type: 'manual',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&auto=format&fit=crop&q=80',
    link: 'https://synapse-flow.demo'
  },
  {
    id: 'proj-4',
    title: 'edge-cache-kv',
    description: 'Błyskawicznie szybka warstwa buforowania Cloudflare Workers Edge KV ze wsparciem dla predykcyjnego pobierania zasobów.',
    stars: 56,
    lastSync: '3 godziny temu',
    tags: ['Cloudflare Workers', 'Wasm', 'TypeScript'],
    type: 'github'
  },
  {
    id: 'proj-5',
    title: 'Lumina Sound Engine',
    description: 'Eksperymentalna synteza dźwięku ambientowego bezpośrednio w przeglądarce, zintegrowana z interaktywnymi falami CSS/Canvas.',
    tags: ['Web Audio API', 'React', 'Tailwind CSS'],
    type: 'manual',
    link: 'https://lumina-sound.demo'
  }
];

export const initialCertificates: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Google Professional Cloud Developer',
    issuer: 'Google Cloud',
    date: 'Październik 2024',
    description: 'Projektowanie, budowanie i zarządzanie wysoce skalowalnymi aplikacjami chmurowymi na platformie Google Cloud Platform.',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7ls7oNAcOpwuMA1f8UjBF83dyqre5IBOG8HOmnXhfaCe8lcXVKCWEBA2FVE4C4cCDvq8Rxv_2O_Is1nkBbm83zK_tMhUv-FrL1gxbaYCjZ4Op3cCNSeDoyD1VdxIzPSvv0WcJDA1m0N-7Qs4tXTZXe1QUSdw8rPUWpikTYMj692_qrhhWxrHRN9tDxJUig1uJoXHhMPMGa61l5pDYprqb0_VxoCRilmPWxAe5WZ5TkSR7TEbOhhlB',
    verified: true
  },
  {
    id: 'cert-2',
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta',
    date: 'Luty 2024',
    description: 'Zaawansowana architektura aplikacji SPA w bibliotece React, optymalizacja wydajności renderowania oraz zaawansowane wzorce projektowe.',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoqnsami9VYR9WgwnPjvYBVAXfisvzdpujLWVVdY7rM2Ig8wU3DaJigmCSxd9v3ESF6f3o4V0LDPzDTZVh51MGzwGPQqDLyaBeVa9f4WUN2whzcHI2-WGyzdiVStPpTWo_s6JYcqbEjoT7M4-hWjfTSg3gbYraR9CGaQ7Tv10EdKDzD5UzBGaqpXBQN-6SwG2UgIwmkA2Uc3_XVbY6B2Tcr34iP6nj6etwprEw9ndB2fHvwQOlgjMI',
    verified: true
  }
];

export const initialTimeline: TimelineItem[] = [
  {
    id: 'time-1',
    period: '2024 - Obecnie',
    role: 'Lead Full Stack Architect',
    company: 'NextGen AI Solutions',
    description: 'Projektowanie rozproszonych systemów mikroserwisów oraz zaawansowanych paneli sterowania z integracją modeli sztucznej inteligencji. Mentoring i zarządzanie 6-osobowym zespołem programistów.'
  },
  {
    id: 'time-2',
    period: '2022 - 2024',
    role: 'Senior Fullstack Developer',
    company: 'SaaS Builder Labs',
    description: 'Wdrażanie interaktywnych dashboardów analitycznych opartych na bazach PostgreSQL i technologiach czasu rzeczywistego (WebSockets). Optymalizacja czasu ładowania aplikacji o 40%.'
  },
  {
    id: 'time-3',
    period: '2020 - 2022',
    role: 'Software Engineer',
    company: 'Creative Tech House',
    description: 'Budowanie dopracowanych wizualnie stron internetowych, aplikacji mobilnych oraz systemów zarządzania treścią. Praca w oparciu o React, React Native i Node.js.'
  }
];

export const initialSprints: ActiveSprint[] = [
  {
    id: 'spr-1',
    title: 'PortfolioOS v1.0.4',
    phase: 'Core Dev',
    progress: 95,
    status: 'EST. RELEASE: TODAY',
    tags: ['React', 'Tailwind v4', 'Framer Motion']
  },
  {
    id: 'spr-2',
    title: 'Ethereal Space Canvas',
    phase: 'Beta Testing',
    progress: 60,
    status: 'SHADERS OPTIMIZATION',
    tags: ['Three.js', 'GLSL', 'TypeScript']
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
  systemFont: 'apple'
};

export const wallpaperOptions = [
  { id: 'space-nebula', name: 'Deep Space Nebula', value: 'radial-gradient(circle at 20% 20%, rgba(124, 77, 255, 0.12) 0%, transparent 45%), radial-gradient(circle at 80% 80%, rgba(0, 227, 253, 0.08) 0%, transparent 45%), #050507' },
  { id: 'neon-cyber', name: 'Neon Cyber Grid', value: 'radial-gradient(circle at 50% 50%, rgba(255, 64, 129, 0.08) 0%, transparent 60%), radial-gradient(circle at 10% 90%, rgba(0, 229, 255, 0.08) 0%, transparent 50%), #050507' },
  { id: 'emerald-aurora', name: 'Emerald Northern Lights', value: 'radial-gradient(circle at 30% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 20%, rgba(6, 182, 212, 0.06) 0%, transparent 45%), #050507' },
  { id: 'amber-sunset', name: 'Golden Sunset Glow', value: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.06) 0%, transparent 40%), #050507' },
  { id: 'ubuntu-pixel', name: 'Ubuntu Classic Aubergine', value: 'linear-gradient(135deg, #77216F 0%, #5E2750 40%, #E95420 100%)' }
];
