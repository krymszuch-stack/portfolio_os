import { usePortfolioSave } from '../lib/usePortfolioSave';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { OSConfig, Project, Certificate, TimelineItem, DesktopIcon } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Github, 
  Instagram, 
  Linkedin, 
  User, 
  Palette, 
  Eye, 
  HelpCircle,
  Phone,
  MapPin,
  Flame,
  Check,
  ChevronRight,
  X,
  Search,
  Globe,
  Laptop,
  Hammer,
  Tractor,
  Leaf,
  Briefcase,
  Camera,
  Sprout,
  Code,
  Cpu,
  Flower,
  Zap,
  Wrench,
  Paintbrush,
  Car,
  Film,
  TrendingUp,
  BarChart,
  Info
} from 'lucide-react';
import { googleSignIn, auth } from '../lib/googleAuth';

import { Loader2, Copy, ExternalLink } from 'lucide-react';
import { playXpClick, playXpStartup, playXpBalloon, playXpError, playPixelBeep } from '../lib/sounds';
import { triggerHaptic } from '../lib/haptics';
import Confetti from 'react-confetti';
import { 
  classifyIndustry, 
  industryCategories, 
  getSeedDataForCategory, 
  IndustryCategory, 
  professionalDictionary,
  findTopMatchedProfessions,
  MatchedProfessionResult
} from '../lib/industryClassification';

const CategoryIcon: React.FC<{ id: string; size?: number; className?: string }> = ({ id, size = 16, className = "" }) => {
  switch (id) {
    case 'tech': return <Laptop size={size} className={className} />;
    case 'craft': return <Hammer size={size} className={className} />;
    case 'agriculture': return <Tractor size={size} className={className} />;
    case 'gardening': return <Leaf size={size} className={className} />;
    case 'creative': return <Palette size={size} className={className} />;
    case 'business': return <Briefcase size={size} className={className} />;
    default: return <Sparkles size={size} className={className} />;
  }
};

const ProfessionIcon: React.FC<{ id: string; size?: number; className?: string }> = ({ id, size = 16, className = "" }) => {
  switch (id) {
    case 'wedding-photographer': return <Camera size={size} className={className} />;
    case 'gardener': return <Sprout size={size} className={className} />;
    case 'web-developer': return <Code size={size} className={className} />;
    case 'ai-engineer': return <Cpu size={size} className={className} />;
    case 'beekeeper': return <Flower size={size} className={className} />;
    case 'orchardist': return <Leaf size={size} className={className} />;
    case 'grain-farmer': return <Tractor size={size} className={className} />;
    case 'carpenter': return <Hammer size={size} className={className} />;
    case 'electrician': return <Zap size={size} className={className} />;
    case 'plumber': return <Wrench size={size} className={className} />;
    case 'renovator': return <Paintbrush size={size} className={className} />;
    case 'mechanic': return <Car size={size} className={className} />;
    case 'graphic-designer': return <Palette size={size} className={className} />;
    case 'video-editor': return <Film size={size} className={className} />;
    case 'marketing-specialist': return <TrendingUp size={size} className={className} />;
    case 'accountant': return <BarChart size={size} className={className} />;
    default: return <Info size={size} className={className} />;
  }
};

interface WizardProps {
  config: OSConfig;
  setConfig: React.Dispatch<React.SetStateAction<OSConfig>>;
  projects?: Project[];
  setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
  certificates?: Certificate[];
  setCertificates?: React.Dispatch<React.SetStateAction<Certificate[]>>;
  timeline?: TimelineItem[];
  setTimeline?: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
  icons?: DesktopIcon[];
  setIcons?: React.Dispatch<React.SetStateAction<DesktopIcon[]>>;
  onClose: () => void;
  openApp: (appId: any) => void;
  isZeroState?: boolean;
}

export const Wizard: React.FC<WizardProps> = ({
  config,
  setConfig,
  projects,
  setProjects,
  certificates,
  setCertificates,
  timeline,
  setTimeline,
  icons,
  setIcons,
  onClose,
  openApp,
  isZeroState = false
}) => {
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isForcedReduced = document.documentElement.classList.contains('reduce-motion');
    setShouldReduceMotion(mediaQuery.matches || isForcedReduced);
    const listener = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches || document.documentElement.classList.contains('reduce-motion'));
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);
  

  // Step 1 states
  const [tags, setTags] = useState<string[]>(() => config.wizardTags || []);
  const [tagInput, setTagInput] = useState('');
  const [focusInput, setFocusInput] = useState(() => config.wizardFocusInput || '');
  const [userName, setUserName] = useState(() => config.portfolioName || '');
  const [avatarUrl, setAvatarUrl] = useState(() => config.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [selectedCategory, setSelectedCategory] = useState<IndustryCategory>(() => {
    if (config.portfolioCategory) {
      const found = industryCategories.find(c => c.id === config.portfolioCategory);
      if (found) return found;
    }
    return industryCategories[industryCategories.length - 1];
  });
  const [manualProfessionId, setManualProfessionId] = useState<string>(() => config.wizardManualProfessionId || '');
  const [isFullListExpanded, setIsFullListExpanded] = useState(false);
  const [comboboxSearch, setComboboxSearch] = useState('');

  // Top 3 matched professions based on input text and tag list
  const topMatches = useMemo(() => {
    return findTopMatchedProfessions(focusInput);
  }, [focusInput]);

  // Filtered professions list for our custom searchable combobox (safety net)
  const filteredProfessions = useMemo(() => {
    if (!comboboxSearch.trim()) return professionalDictionary;
    const query = comboboxSearch.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return professionalDictionary.filter(p => {
      const normTitle = p.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const matchTitle = normTitle.includes(query);
      const matchKeywords = (p.anyOf || []).some(kw => {
        const normKw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return normKw.includes(query);
      });
      return matchTitle || matchKeywords;
    });
  }, [comboboxSearch]);

  // Reset full list expanded state when input is cleared
  useEffect(() => {
    if (!focusInput) {
      setIsFullListExpanded(false);
    }
  }, [focusInput]);

  // Update focusInput when tags or tagInput changes
  useEffect(() => {
    const combined = [...tags];
    const trimmedInput = tagInput.trim().replace(/,$/, '').trim();
    if (trimmedInput) {
      combined.push(trimmedInput);
    }
    setFocusInput(combined.join(', '));
  }, [tags, tagInput]);

  const handleAddTag = (value: string) => {
    const trimmed = value.trim().replace(/,$/, '').trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleBlur = () => {
    if (tagInput.trim()) {
      handleAddTag(tagInput);
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  // Step 2 states: answers to industry questions
  const [answers, setAnswers] = useState<{ [key: string]: string }>(() => config.wizardAnswers || {});

  // Step 3 states: selected sections (pre-populated when category changes)
  const [selectedSections, setSelectedSections] = useState<{ [key: string]: boolean }>({});

  // Step 4 states: customization
  const [themePack, setThemePack] = useState<any>(() => config.themePack || 'cyan');
  const [accentColor, setAccentColor] = useState<any>(() => config.accentColor || 'cyan');

  // Auto-save Wizard state to parent config for editability/persistence
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      portfolioName: userName,
      avatarUrl: avatarUrl,
      wizardTags: tags,
      wizardFocusInput: focusInput,
      wizardManualProfessionId: manualProfessionId,
      wizardAnswers: answers,
      accentColor: accentColor,
      themePack: themePack
    }));
  }, [userName, avatarUrl, tags, focusInput, manualProfessionId, answers, accentColor, themePack, setConfig]);

  // Dynamically classify industry based on user input on "Na czym się skupiasz?"
  useEffect(() => {
    // If the user has manually selected a profession, look it up and set it
    if (manualProfessionId) {
      const prof = professionalDictionary.find(p => p.id === manualProfessionId);
      if (prof) {
        const category = industryCategories.find(c => c.id === prof.categoryId);
        if (category) {
          setSelectedCategory({
            ...category,
            matchedProfession: {
              id: prof.id,
              title: prof.title,
              emoji: prof.emoji
            }
          });
          return;
        }
      }
    }

    // Otherwise, perform automatic keyword classification
    const matched = classifyIndustry(focusInput);
    setSelectedCategory(matched);
  }, [focusInput, manualProfessionId]);

  // Pre-populate recommended sections when category changes
  useEffect(() => {
    const sectionsObj: { [key: string]: boolean } = {};
    selectedCategory.suggestedSections.forEach(s => {
      sectionsObj[s.id] = s.enabled;
    });
    setSelectedSections(sectionsObj);
  }, [selectedCategory]);

  const handleNext = () => {
    // Basic validation
    if (step === 1 && !userName.trim()) {
      alert('Proszę wpisać swoje imię i nazwisko lub nazwę firmy.');
      return;
    }
    setStep(prev => prev + 1);
    triggerHaptic('medium');
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    triggerHaptic('light');
  };

  const handleAnswerChange = (questionId: string, val: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: val
    }));
  };

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const triggerDynamicLogs = (callback: () => void) => {
    const logs = [
      '🔍 Weryfikacja parametrów instalacji i zależności pakietów...',
      `📦 Rozpakowywanie modułów systemowych dla profilu: ${selectedCategory.name}`,
      '📂 Rejestrowanie komponentów interfejsu (GUI) i tworzenie skrótów...',
      '⚙️ Konfigurowanie rdzenia systemu oraz usług działających w tle...',
      '🎨 Kompilowanie zmiennych środowiskowych motywu: ' + accentColor,
      '💫 Zapisywanie konfiguracji użytkownika do rejestru...',
      '✅ Instalacja systemu zakończona pomyślnie. Inicjowanie środowiska pulpitu...'
    ];

    let currentLogIndex = 0;
    setGenerationLogs([logs[0]]);

    const interval = setInterval(() => {
      currentLogIndex++;
      if (currentLogIndex < logs.length) {
        setGenerationLogs(prev => [...prev, logs[currentLogIndex]]);
      } else {
        clearInterval(interval);
        callback();
      }
    }, 400);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    triggerDynamicLogs(() => {
      // Get categorized seed data
      const seeds = getSeedDataForCategory(selectedCategory.id, answers, userName, accentColor, focusInput, manualProfessionId || undefined);
      
      // Update config
      setConfig(prev => ({
        ...prev,
        portfolioName: userName,
        portfolioBio: seeds.portfolioBio,
        accentColor: accentColor,
        isInitialized: true,
        portfolioCategory: selectedCategory.id,
        phone: seeds.additionalConfig.phone,
        address: seeds.additionalConfig.address,
        instagramUsername: seeds.additionalConfig.instagramUsername,
        githubUsername: seeds.additionalConfig.githubUsername,
        linkedinUsername: seeds.additionalConfig.linkedinUsername
      }));

      // Seed global datasets if setters are available
      if (setProjects) setProjects(seeds.projects);
      if (setCertificates) setCertificates(seeds.certificates);
      if (setTimeline) setTimeline(seeds.timeline);
      if (setIcons) setIcons(seeds.icons);

      setIsGenerating(false);
      setIsFinished(true);
    triggerHaptic('success');
    });
  };

  const { saveToCloud, saveStatus } = usePortfolioSave();

  const handleFinishAndExplore = async () => {
    const result = await saveToCloud(config, projects, certificates, timeline, icons);
    if (result.success) {
      if (result.publicSlug) {
        setPublishedSlug(result.publicSlug);
      } else {
        onClose();
        if (!isZeroState) {
          openApp('bio');
        }
      }
    }
  };

  const handleSkipWizard = () => {
    setConfig({
      glowIntensity: 100,
      accentColor: 'orange',
      themePack: 'orange',
      visualMode: 'deep-space',
      wallpaper: 'ubuntu-pixel',
      proMode: true,
      portfolioName: '',
      portfolioBio: '',
      isInitialized: true,
      playSounds: true,
      pixelTheme: false,
      portfolioStyle: 'modern',
      iconStyleModern: 'lumine-ubuntu-style',
      iconStyleRetro: 'classic-windows-95',
      fontSizeScale: 2.0,
      glassBlur: 'medium',
      borderStyle: 'thick',
      systemFont: 'apple'
    });

    if (setIcons) {
      setIcons([
        {
          id: 'icon-settings',
          label: 'Personalizacja',
          appId: 'settings',
          icon: 'settings',
          color: 'from-orange-500/30 to-orange-500/10 hover:shadow-orange-500/20 border-orange-500/20',
          x: 0,
          y: 0
        }
      ]);
    }

    onClose();
  };

  const handleResetWizard = () => {
    setStep(1);
    setTags([]);
    setTagInput('');
    setFocusInput('');
    setUserName('');
    setSelectedCategory(industryCategories[industryCategories.length - 1]);
    setManualProfessionId('');
    setAnswers({});
    setSelectedSections({});
    setAccentColor('cyan');
  };

  return (
    <div className="max-w-2xl mx-auto py-2">
      {/* Top progress stepper (Dots) */}
      {!isFinished && !isGenerating && publishedSlug === null && (
        <div className="flex items-center justify-center space-x-2.5 mb-8 select-none">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-2 text-center rounded-full transition-all duration-300 ${
                step === stepNum
                  ? 'w-8 bg-amber-500'
                  : 'w-2 bg-slate-800'
              }`}
              title={`Krok ${stepNum}/4`}
            />
          ))}
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest ml-2">
            Krok {step}/4
          </span>
        </div>
      )}

      {/* Main Container Form */}
      {publishedSlug !== null ? (
        <div className="p-6 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner shadow-amber-500/10">
            <CheckCircle size={32} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-sans font-bold text-white">
              Opublikowano!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Twoje portfolio zostało zapisane i jest teraz dostępne publicznie pod poniższym adresem.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left max-w-sm mx-auto flex items-center gap-2">
            <input 
              readOnly 
              value={`${window.location.origin}/p/${publishedSlug}`}
              className="flex-1 bg-transparent text-[11px] text-white font-mono outline-none min-h-[44px]"
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/p/${publishedSlug}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Kopiuj link"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
            <button
              onClick={() => window.open(`/p/${publishedSlug}`, '_blank')}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Otwórz podgląd publiczny"
            >
              <ExternalLink size={14} />
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              if (!isZeroState) {
                openApp('bio');
              }
            }}
            className="px-6 py-2 mt-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 mx-auto shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Eye size={14} /> {isZeroState ? 'Uruchom System' : 'Przejdź do pulpitu'}
          </button>
        </div>
      ) : isFinished ? (
        <div className="p-6 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner shadow-emerald-500/10">
            <CheckCircle size={32} className="animate-pulse" />
          </div>

          {!shouldReduceMotion && <Confetti recycle={false} numberOfPieces={200} colors={['#fbbf24', '#f59e0b', '#d97706', '#3b82f6', '#10b981']} />}<div className="space-y-2">
            <h3 className="text-lg md:text-xl font-sans font-bold text-white">
              Instalacja Zakończona Pomyślnie
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Gratulacje! Twój osobisty system PortfolioOS został pomyślnie zainstalowany i skonfigurowany dla profilu <strong className="text-amber-400">{selectedCategory.name}</strong>. Wszystkie pakiety, aplikacje oraz rejestry systemowe zostały pomyślnie wdrożone.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left space-y-2.5 max-w-sm mx-auto">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Nazwa:</span>
              <span className="text-white font-semibold">{userName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Branża:</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                {selectedCategory.matchedProfession ? (
                  <ProfessionIcon id={selectedCategory.matchedProfession.id} size={14} className="text-amber-400 shrink-0" />
                ) : (
                  <CategoryIcon id={selectedCategory.id} size={14} className="text-amber-400 shrink-0" />
                )}
                <span>{selectedCategory.matchedProfession ? selectedCategory.matchedProfession.title : selectedCategory.name}</span>
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Tło pulpitu:</span>
              <span className="text-cyan-400 font-mono capitalize">
                {config.wallpaper === 'ubuntu-pixel' ? 'Klasyczna Oberżyna' : config.wallpaper === 'space-nebula' ? 'Głęboki Kosmos' : 'Bursztynowa Cisza'}
              </span>
            </div>
          </div>

          <button
            id="btn-finish-wizard"
            onClick={handleFinishAndExplore}
            disabled={saveStatus === 'saving'}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 mx-auto shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed animate-scaleIn min-h-[44px]"
          >
            {saveStatus === 'saving' ? <><Loader2 className="animate-spin" size={14} /> Zapisywanie w chmurze...</> : <><Eye size={14} /> {isZeroState ? 'Uruchom System' : 'Przejdź do pulpitu'}</>}
          </button>
          {saveStatus === 'error' && (
            <p className="text-rose-400 text-[11px] mt-3 font-bold animate-pulse">Nie udało się zapisać konfiguracji, spróbuj ponownie.</p>
          )}
        </div>
      ) : isGenerating ? (
        <div className="py-12 text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-2xl border-4 border-amber-500/10 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl border-4 border-t-amber-500 animate-spin" />
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-sans font-bold text-white">Instalowanie komponentów systemowych...</h4>
            <p className="text-[11px] text-slate-400">Konfigurowanie środowiska pracy i rejestrowanie aplikacji na pulpicie...</p>
          </div>

          {/* Scrolling output log terminal style */}
          <div className="p-3 bg-black/50 rounded-xl border border-white/5 text-left font-mono text-[9px] text-emerald-400 max-w-sm mx-auto space-y-1 h-32 overflow-y-auto">
            {generationLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-1.5 animate-fadeIn">
                <span className="text-amber-500">❯</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Step 1: Powitanie */}
          {step === 1 && (
            <div className="space-y-6 text-center py-8 animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <Laptop size={36} className="text-amber-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white font-sans tracking-tight">Kreator PortfolioOS</h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Zainstaluj swój własny, interaktywny pulpit systemowy prezentujący Twoje Bio, projekty i umiejętności w formie wbudowanych aplikacji.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-sans font-bold flex items-center gap-2 mx-auto shadow-lg shadow-amber-500/20 active:scale-95 transition-transform cursor-pointer"
              >
                Zacznij konfigurację <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}

          {/* Step 2: Podstawowe dane profilu i branża */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn text-left">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-bold text-white">Dane profilu oraz Branża</h3>
                <p className="text-xs text-slate-400">Te dane zostaną wykorzystane do wygenerowania Twojego unikalnego portfolio.</p>
              </div>

              <div className="space-y-4">
                {/* 1. Imię / Nazwa */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Nazwa wizytówki / Imię i Nazwisko</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="np. Wiktor Krawczyk, Gospodarstwo Ekologiczne Lipa, Piekarnia Retro"
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* 2. Wybór Avatara */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Wybierz avatar profilowy</label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { id: 'dev', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Programista' },
                      { id: 'creator', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Twórca' },
                      { id: 'engineer', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', label: 'Rzemieślnik' },
                      { id: 'manager', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', label: 'Biznes' }
                    ].map((av) => {
                      const isSelected = avatarUrl === av.url;
                      return (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => setAvatarUrl(av.url)}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 cursor-pointer flex flex-col items-center gap-1.5 bg-slate-950/40 ${
                            isSelected ? 'border-amber-500 bg-amber-500/5 scale-105' : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <img src={av.url} alt={av.label} className="w-12 h-12 rounded-lg object-cover" />
                          <span className="text-[9px] text-slate-400 font-sans">{av.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {/* Custom url input */}
                  <div className="space-y-1 pt-1">
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Lub wklej własny adres URL do zdjęcia profilowego..."
                      className="w-full px-3 py-1.5 bg-slate-950/40 border border-slate-800 rounded-lg text-[10px] text-slate-300 placeholder-slate-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* 3. Wybór Branży / Kategorii */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Wybierz główny obszar działalności</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {industryCategories.map((cat) => {
                      const isSelected = selectedCategory.id === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setManualProfessionId('');
                          }}
                          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer h-16 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500/10 text-white'
                              : 'border-slate-800 bg-slate-950/20 text-slate-400 hover:border-slate-700 hover:bg-slate-900/40'
                          }`}
                        >
                          <CategoryIcon id={cat.id} size={14} className="text-amber-400 shrink-0" />
                          <span className="text-xs font-bold font-sans mt-1 leading-tight">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Słowa kluczowe / Specjalizacja */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Dodatkowe słowa kluczowe (np. rolnictwo, react, meble)</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder="Wpisz słowo kluczowe i kliknij Enter..."
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400 font-medium">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(idx)} className="text-amber-500 hover:text-amber-300"><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Real-time category recognition indicator */}
                {selectedCategory.matchedProfession && (
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between text-xs animate-fadeIn">
                    <span className="text-slate-400 font-sans">Automatycznie dopasowana profesja:</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <ProfessionIcon id={selectedCategory.matchedProfession.id} size={14} className="text-amber-400 shrink-0" />
                      {selectedCategory.matchedProfession.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Wybór jednego podstawowego stylu tła pulpitu */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn text-left">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-bold text-white">Styl tła pulpitu</h3>
                <p className="text-xs text-slate-400">Wybierz jeden z neutralnych, spokojnych stylów tła dla swojego nowego pulpitu.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {[
                  { id: 'ubuntu-pixel', name: 'Klasyczna Oberżyna', desc: 'Mroczny fiolet', bg: 'linear-gradient(135deg, #120e16 0%, #09070c 50%, #040306 100%)' },
                  { id: 'space-nebula', name: 'Głęboki Kosmos', desc: 'Mroczny granat', bg: 'linear-gradient(135deg, #090c15 0%, #05070c 50%, #020306 100%)' },
                  { id: 'amber-sunset', name: 'Bursztynowa Cisza', desc: 'Ciepła miedź / czerń', bg: 'linear-gradient(135deg, #120d09 0%, #0a0705 50%, #040302 100%)' }
                ].map((wp) => {
                  const isSelected = config.wallpaper === wp.id;
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => {
                        setConfig(prev => ({ ...prev, wallpaper: wp.id }));
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer h-28 relative overflow-hidden group ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-500/20 bg-slate-900/60 shadow-lg scale-102'
                          : 'border-slate-800 bg-slate-950/20 hover:border-slate-700'
                      }`}
                    >
                      <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity" style={{ background: wp.bg }} />
                      <div className="relative z-10 space-y-1">
                        <span className="block text-xs font-bold text-white">{wp.name}</span>
                        <span className="block text-[10px] text-slate-400">{wp.desc}</span>
                      </div>
                      {isSelected && (
                        <span className="relative z-10 self-end w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 text-[10px] font-black">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/30 border border-slate-900 text-[11px] text-slate-400 font-sans leading-relaxed">
                ℹ️ <strong>Personalizacja zaawansowana po wdrożeniu:</strong> Dodatkowe style, efekty cząsteczkowe w tle (spadające liście, bąbelki, gwiazdy) oraz niestandardowe motywy systemowe możesz dostosować w aplikacji <strong>Personalizacja</strong> bezpośrednio po uruchomieniu pulpitu.
              </div>
            </div>
          )}

          {/* Step 4: Krótkie podsumowanie */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn text-left">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-bold text-white">Podsumowanie Konfiguracji</h3>
                <p className="text-xs text-slate-400">Twój system operacyjny jest gotowy do wdrożenia. Sprawdź poniższe podsumowanie.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-sans">Nazwa użytkownika / Wizytówka:</span>
                  <span className="text-white font-semibold">{userName || 'Gość'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-sans">Główny obszar działalności:</span>
                  <span className="text-amber-400 font-semibold">{selectedCategory.name}</span>
                </div>
                {selectedCategory.matchedProfession && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-sans font-medium">Dopasowana specjalizacja:</span>
                    <span className="text-emerald-400 font-semibold">{selectedCategory.matchedProfession.title}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-sans">Wybrane tło pulpitu:</span>
                  <span className="text-cyan-400 font-semibold">
                    {config.wallpaper === 'ubuntu-pixel' ? 'Klasyczna Oberżyna' : config.wallpaper === 'space-nebula' ? 'Głęboki Kosmos' : 'Bursztynowa Cisza'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center max-w-md mx-auto leading-relaxed">
                Kliknij przycisk poniżej, aby wygenerować moduły pulpitu, zainstalować pakiety i zainicjować Twoje PortfolioOS.
              </p>
            </div>
          )}

          {/* Controls Footer buttons */}
          {step > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium cursor-pointer min-h-[44px]"
                >
                  <ArrowLeft size={13} /> Wstecz
                </button>
                <button
                  onClick={handleResetWizard}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 transition-colors font-medium cursor-pointer border border-red-500/10 rounded-lg hover:bg-red-500/5 min-h-[44px]"
                  title="Wyczyść wszystkie pola i wróć do kroku 1"
                >
                  🔄 Wyczyść kreator
                </button>
              </div>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-sans font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 min-h-[44px]"
                >
                  Dalej <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  id="btn-trigger-generate"
                  onClick={handleGenerate}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[44px]"
                >
                  <Sparkles size={13} /> Instaluj system i przejdź do pulpitu
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
