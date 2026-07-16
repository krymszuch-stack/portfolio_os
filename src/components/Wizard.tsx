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
  Info,
  RefreshCw,
  AlertCircle
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

  // AI Parser states
  const [isAiMode, setIsAiMode] = useState(false);
  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseStatus, setParseStatus] = useState('');

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
    const result = await saveToCloud(config, projects || [], certificates || [], timeline || [], icons || []);
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

  const handleAiParse = async () => {
    setIsParsing(true);
    setParseError(null);
    setParseStatus('Wczytywanie pliku...');

    try {
      let fileData: string | null = null;
      let mimeType: string | null = null;

      if (cvFile) {
        const filePromise = new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(cvFile);
        });
        const dataUrl = await filePromise;
        const parts = dataUrl.split(',');
        fileData = parts[1];
        mimeType = dataUrl.split(';')[0].split(':')[1];
      }

      if (!cvText.trim() && !fileData) {
        throw new Error("Wklej profil LinkedIn lub załącz plik CV przed analizą.");
      }

      setParseStatus('Przesyłanie do AI (Gemini)...');
      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: cvText,
          fileData,
          mimeType
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Błąd komunikacji z asystentem AI.');
      }

      setParseStatus('Analiza struktury CV i wyodrębnianie kompetencji...');
      const result = await response.json();

      if (result.bio) {
        if (result.bio.suggestedCategory) {
          const foundCat = industryCategories.find(c => c.id === result.bio.suggestedCategory);
          if (foundCat) setSelectedCategory(foundCat);
        }
        if (result.bio.suggestedProfessionId) {
          setManualProfessionId(result.bio.suggestedProfessionId);
        }
        const parsedSkills = result.bio.skills || [];
        const fSkills: string[] = [];
        const bSkills: string[] = [];
        const dSkills: string[] = [];
        
        parsedSkills.forEach((s: any) => {
          const name = s.name;
          const nameLower = name.toLowerCase();
          if (nameLower.includes('css') || nameLower.includes('html') || nameLower.includes('react') || nameLower.includes('vue') || nameLower.includes('angular') || nameLower.includes('javascript') || nameLower.includes('typescript') || nameLower.includes('frontend') || nameLower.includes('ui') || nameLower.includes('tailwind')) {
            fSkills.push(name);
          } else if (nameLower.includes('design') || nameLower.includes('figma') || nameLower.includes('photoshop') || nameLower.includes('illustrator') || nameLower.includes('ux') || nameLower.includes('graphics')) {
            dSkills.push(name);
          } else {
            bSkills.push(name);
          }
        });

        // Set local states
        if (result.bio.fullName) setUserName(result.bio.fullName);

        // Update main configuration
        setConfig(prev => ({
          ...prev,
          portfolioName: result.bio.fullName || prev.portfolioName,
          fullName: result.bio.fullName || prev.fullName,
          title: result.bio.title || prev.title,
          professionalRole: result.bio.title || prev.professionalRole,
          portfolioBio: result.bio.biography || prev.portfolioBio,
          address: result.bio.contactInfo?.location || prev.address,
          phone: result.bio.contactInfo?.phone || prev.phone,
          githubUsername: result.bio.contactInfo?.github || prev.githubUsername,
          linkedinUsername: result.bio.contactInfo?.linkedin || prev.linkedinUsername,
          skills: parsedSkills.map((s: any) => s.name),
          frontendSkills: fSkills,
          backendSkills: bSkills,
          designSkills: dSkills
        }));
      }

      if (result.projects && setProjects) {
        const parsedProjects = result.projects.map((p: any, idx: number) => ({
          id: `proj-ai-${idx}`,
          title: p.title,
          description: p.description,
          role: p.role,
          tags: p.techStack || [],
          stars: 0,
          link: ''
        }));
        setProjects(parsedProjects);
      }

      if (result.certificates && setCertificates) {
        const parsedCerts = result.certificates.map((c: any, idx: number) => ({
          id: `cert-ai-${idx}`,
          title: c.title,
          issuer: c.issuer,
          date: c.date,
          url: c.url || ''
        }));
        setCertificates(parsedCerts);
      }

      if (result.timeline && setTimeline) {
        const parsedTimeline = result.timeline.map((t: any, idx: number) => ({
          id: `time-ai-${idx}`,
          year: t.year,
          role: t.role,
          company: t.company,
          description: t.description
        }));
        setTimeline(parsedTimeline);
      }

      setParseStatus('Gotowe!');
      // Move to intermediate verification step instead of jumping straight to publish
      setStep(4); // Idź do kroku 4 żeby zweryfikować dane po parsowaniu
    } catch (err: any) {
      setParseError(err.message || 'Wystąpił błąd podczas analizy CV.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleResetWizard = () => {
    setIsAiMode(false);
    setCvText('');
    setCvFile(null);
    setParseError(null);
    setParseStatus('');
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
          {[1, 2, 3, 4, 5].map((stepNum) => (
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
            Krok {step}/5
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

          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 text-left max-w-sm mx-auto flex items-center gap-2">
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

          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 text-left space-y-2.5 max-w-sm mx-auto">
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
            <div className="space-y-6 text-center py-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <Laptop size={36} className="text-amber-400" />
              </div>
              
              {!isAiMode ? (
                <>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-white font-sans tracking-tight">Kreator PortfolioOS</h2>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Zainstaluj swój własny, interaktywny pulpit systemowy prezentujący Twoje Bio, projekty i umiejętności w formie wbudowanych aplikacji.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 max-w-xs mx-auto pt-3">
                    <button
                      type="button"
                      onClick={() => setIsAiMode(true)}
                      className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-950 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/15 cursor-pointer animate-pulse hover:animate-none"
                    >
                      <Sparkles size={14} /> Błyskawiczny Start z AI (Zalecane) ⚡
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-sans font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      Konfiguracja Krok po Kroku <ArrowRight size={14} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-5 text-left max-w-md mx-auto">
                  <div className="space-y-1 text-center">
                    <h2 className="text-xl font-bold text-white font-sans">Błyskawiczny Start z AI</h2>
                    <p className="text-xs text-slate-400">Załaduj plik CV (PDF/JPG) lub wklej dane profilu z LinkedIn</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Text area input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Wklej tekst CV / profil LinkedIn</label>
                      <textarea
                        value={cvText}
                        onChange={(e) => setCvText(e.target.value)}
                        placeholder="Wklej tutaj treść swojego CV lub całą zawartość skopiowaną z profilu LinkedIn..."
                        rows={5}
                        disabled={isParsing}
                        className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-yellow-500/50 resize-none font-sans"
                      />
                    </div>

                    {/* File uploader */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lub załącz plik CV (PDF, PNG, JPG)</label>
                      <div className="relative border-2 border-dashed border-slate-800 rounded-xl p-4 bg-slate-950/30 hover:bg-slate-950/50 transition-colors flex flex-col items-center justify-center gap-1.5">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          disabled={isParsing}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setCvFile(file);
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-slate-300">
                          {cvFile ? `✓ Wybrano: ${cvFile.name}` : "Kliknij lub przeciągnij plik tutaj"}
                        </span>
                        <span className="text-[9px] text-slate-500">Maksymalny rozmiar: 15MB (PDF/Obraz)</span>
                      </div>
                    </div>

                    {/* Parser Status & Log output */}
                    {isParsing && (
                      <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex items-center gap-2 text-xs text-yellow-400">
                        <RefreshCw size={13} className="animate-spin text-yellow-400 shrink-0" />
                        <span>{parseStatus}</span>
                      </div>
                    )}

                    {/* Error message */}
                    {parseError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-xs text-red-400">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" />
                        <span>{parseError}</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAiMode(false)}
                        disabled={isParsing}
                        className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold cursor-pointer border border-white/5 transition-colors disabled:opacity-50"
                      >
                        Wróć
                      </button>
                      <button
                        type="button"
                        onClick={handleAiParse}
                        disabled={isParsing || (!cvText.trim() && !cvFile)}
                        className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-500/10 transition-colors"
                      >
                        {isParsing ? "Przetwarzanie..." : "Analizuj i generuj ⚡"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Nazwa wizytówki / Imię i Nazwisko</span>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="np. Wiktor Krawczyk, Gospodarstwo Ekologiczne Lipa, Piekarnia Retro"
                    className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* 2. Wybór Avatara */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Wybierz avatar lub podaj URL</span>
                  <input
                    type="text"
                    placeholder="Wklej link do zdjęcia (np. z LinkedIn)"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 outline-none mb-3"
                  />
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
                            isSelected ? 'border-amber-500 bg-amber-500/5 scale-105' : 'border-white/10 hover:border-white/10'
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
                      className="w-full px-3 py-1.5 bg-slate-950/40 border border-white/10 rounded-lg text-[10px] text-slate-300 placeholder-slate-700 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* 3. Wybór Branży / Kategorii */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Wybierz główny obszar działalności</span>
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
                              : 'border-white/10 bg-slate-950/20 text-slate-400 hover:border-white/10 hover:bg-slate-900/40'
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
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Dodatkowe słowa kluczowe (np. rolnictwo, react, meble)</span>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder="Wpisz słowo kluczowe i kliknij Enter..."
                    className="w-full px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400 font-medium">
                          {tag}
                          <button type="button" aria-label={`Usuń tag ${tag}`} onClick={() => handleRemoveTag(idx)} className="text-amber-500 hover:text-amber-300"><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Real-time category recognition indicator */}
                {selectedCategory.matchedProfession && (
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-white/10/60 flex items-center justify-between text-xs animate-fadeIn">
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
                          : 'border-white/10 bg-slate-950/20 hover:border-white/10'
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
            <div className="space-y-4 animate-fadeIn text-left">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-bold text-white">Weryfikacja danych</h3>
                <p className="text-xs text-slate-400">Sprawdź podsumowanie swojego profilu. W razie potrzeby możesz dokonać zmian później w Ustawieniach (App Settings).</p>
              </div>
              <div className="bg-slate-900/50 p-4 border border-white/10 rounded-xl space-y-3">
                <p className="text-xs text-slate-300"><strong>Imię i Nazwisko:</strong> {userName}</p>
                <p className="text-xs text-slate-300"><strong>Stanowisko:</strong> {config.title}</p>
                <p className="text-xs text-slate-300"><strong>Zidentyfikowane projekty:</strong> {projects?.length || 0}</p>
                <p className="text-xs text-slate-300"><strong>Zidentyfikowane wpisy doświadczenia:</strong> {timeline?.length || 0}</p>
                <p className="text-xs text-slate-300"><strong>Sugerowana kategoria:</strong> {selectedCategory.name}</p>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-5 animate-fadeIn text-left">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-bold text-white">Podsumowanie Konfiguracji</h3>
                <p className="text-xs text-slate-400">Twój system operacyjny jest gotowy do wdrożenia. Sprawdź poniższe podsumowanie.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3.5">
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
            <div className="flex items-center justify-between pt-6 border-t border-white/10/50">
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

              {step < 5 ? (
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
