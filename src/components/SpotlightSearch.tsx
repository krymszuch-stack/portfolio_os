/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Search, User, Folder, FlaskConical, Award, Settings, Mail, Sparkles, 
  HardDrive, Calendar, Shield, Cpu, HelpCircle, CornerDownLeft
} from 'lucide-react';

interface SpotlightApp {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'system' | 'projects' | 'google' | 'tools';
  appId?: 'bio' | 'projects' | 'lab' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'gdrive' | 'calendar' | 'planned';
  specialAction?: () => void;
}

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp: (appId: 'bio' | 'projects' | 'lab' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'gdrive' | 'calendar' | 'planned') => void;
  onLaunchWinFixer?: () => void;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  isOpen,
  onClose,
  onLaunchApp,
  onLaunchWinFixer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ⚡ Bolt: Memoize static app list configuration to prevent recreating this array on every search query change or re-render
  const availableApps = useMemo<SpotlightApp[]>(() => [
    {
      id: 'app-bio',
      title: 'O mnie (Bio)',
      description: 'Poznaj moje kwalifikacje, doświadczenie zawodowe, historię zatrudnienia i wykształcenie.',
      icon: <User className="w-5 h-5" />,
      category: 'system',
      appId: 'bio'
    },
    {
      id: 'app-projects',
      title: 'Moje Projekty',
      description: 'Zarządzaj i przeglądaj projekty deweloperskie zsynchronizowane z moim profilem GitHub.',
      icon: <Folder className="w-5 h-5" />,
      category: 'projects',
      appId: 'projects'
    },
    {
      id: 'app-winfix',
      title: 'WinFix AI - Naprawiacz Windows',
      description: 'Inteligentne skanowanie systemu, usuwanie malware, naprawa jądra i hardening zabezpieczeń Windows.',
      icon: <Shield className="w-5 h-5 text-cyan-400" />,
      category: 'tools',
      specialAction: () => {
        if (onLaunchWinFixer) {
          onLaunchWinFixer();
        } else {
          onLaunchApp('projects');
          // Give simple delay for window to render, then open simulated fixer
          setTimeout(() => {
            const btn = document.getElementById('btn-start-winfix-scan');
            if (btn) btn.click();
          }, 400);
        }
      }
    },
    {
      id: 'app-lab',
      title: 'Aktualne Projekty (Lab)',
      description: 'Podgląd aktualnych sprintów, wskaźniki produktywności deweloperskiej i backlog zadań.',
      icon: <FlaskConical className="w-5 h-5" />,
      category: 'projects',
      appId: 'lab'
    },
    {
      id: 'app-certificates',
      title: 'Certyfikaty i Odznaczenia',
      description: 'Sprawdź moje zweryfikowane certyfikaty technologiczne, w tym GCP oraz Meta.',
      icon: <Award className="w-5 h-5" />,
      category: 'system',
      appId: 'certificates'
    },
    {
      id: 'app-settings',
      title: 'Personalizacja & Ustawienia',
      description: 'Dostosuj tapety pulpitu, głośność dźwięków systemowych, motyw retro oraz intensywność neonów.',
      icon: <Settings className="w-5 h-5" />,
      category: 'system',
      appId: 'settings'
    },
    {
      id: 'app-contact',
      title: 'Napisz do mnie',
      description: 'Formularz kontaktowy z walidacją e-mail, linki społecznościowe (GitHub, LinkedIn, Instagram).',
      icon: <Mail className="w-5 h-5" />,
      category: 'system',
      appId: 'contact'
    },
    {
      id: 'app-wizard',
      title: 'Generator Portfolio',
      description: 'Interaktywny kreator pozwalający wygenerować Twój własny profesjonalny szablon strony.',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      category: 'tools',
      appId: 'wizard'
    },
    {
      id: 'app-gdrive',
      title: 'Google Drive Integrator',
      description: 'Dostęp do dokumentów i archiwów hostowanych w chmurze dzięki integracji OAuth.',
      icon: <HardDrive className="w-5 h-5" />,
      category: 'google',
      appId: 'gdrive'
    },
    {
      id: 'app-calendar',
      title: 'Terminarz Google Calendar',
      description: 'Pobierz harmonogram spotkań i zarezerwuj konsultację techniczną w czasie rzeczywistym.',
      icon: <Calendar className="w-5 h-5" />,
      category: 'google',
      appId: 'calendar'
    },
    {
      id: 'app-planned',
      title: 'Planowane Projekty',
      description: 'Lista nadchodzących mikroserwisów oraz skaner fałszywych ofert pracy (Scam Identifier).',
      icon: <Cpu className="w-5 h-5" />,
      category: 'projects',
      appId: 'planned'
    }
  ], [onLaunchApp, onLaunchWinFixer]);

  // ⚡ Bolt: Memoize filtered results so we only recalculate when the search query actually changes
  const filteredApps = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return availableApps;
    return availableApps.filter(app =>
      app.title.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q)
    );
  }, [availableApps, searchQuery]);

  // Keep selected index in bounds when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      setSearchQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation & Esc key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredApps.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredApps.length) % Math.max(1, filteredApps.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredApps[selectedIndex]) {
          handleLaunch(filteredApps[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredApps, selectedIndex]);

  // Close when clicking outside modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLaunch = (app: SpotlightApp) => {
    if (app.specialAction) {
      app.specialAction();
    } else if (app.appId) {
      onLaunchApp(app.appId);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-start justify-center pt-[15vh] px-4 animate-fadeIn">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-xl bg-[#090d16]/95 border border-slate-800/80 shadow-xl rounded-2xl overflow-hidden flex flex-col max-h-[60vh]"
      >
        {/* Search Input Area */}
        <div className="flex items-center space-x-3 p-4 border-b border-slate-800/80 bg-slate-950/40">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj aplikacji lub modułów systemu (np. Bio, WinFix, Certyfikaty...)"
            className="w-full bg-transparent border-none text-white text-sm focus:outline-none placeholder-slate-500 font-sans font-light"
          />
          <div className="flex items-center space-x-1 shrink-0">
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
              ESC
            </span>
          </div>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {filteredApps.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-sans">Brak wyników wyszukiwania dla "{searchQuery}"</p>
              <p className="text-[10px] text-slate-500 font-sans">Spróbuj wpisać inną frazę lub skasuj zapytanie.</p>
            </div>
          ) : (
            <>
              <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase px-3 py-1 bg-slate-950/20 rounded">
                Wybierz aplikację i naciśnij Enter
              </div>
              {filteredApps.map((app, index) => (
                <div
                  key={app.id}
                  onClick={() => handleLaunch(app)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer border ${
                    selectedIndex === index
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-white shadow-lg shadow-cyan-500/5'
                      : 'bg-transparent border-transparent text-slate-300 hover:text-white hover:bg-slate-900/30'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`p-2 rounded-lg ${
                      selectedIndex === index
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {app.icon}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-sans font-bold">
                          {app.title}
                        </span>
                        <span className="text-[8px] font-mono uppercase tracking-wide px-1.5 py-0.2 rounded bg-slate-950/60 text-slate-400 border border-slate-800">
                          {app.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans font-light truncate max-w-sm">
                        {app.description}
                      </p>
                    </div>
                  </div>

                  {selectedIndex === index && (
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 shrink-0 animate-fadeIn">
                      Uruchom <CornerDownLeft size={10} />
                    </span>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
          <div className="flex items-center space-x-1">
            <span>Użyj klawiszy</span>
            <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1 py-0.1 rounded">▲</span>
            <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1 py-0.1 rounded">▼</span>
            <span>do nawigacji</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Skrót globalny:</span>
            <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1 py-0.1 rounded">Ctrl</span>
            <span>+</span>
            <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-1 py-0.1 rounded">K</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
