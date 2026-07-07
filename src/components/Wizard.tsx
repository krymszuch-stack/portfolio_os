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
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Step 1 states
  const [tags, setTags] = useState<string[]>(() => config.wizardTags || []);
  const [tagInput, setTagInput] = useState('');
  const [focusInput, setFocusInput] = useState(() => config.wizardFocusInput || '');
  const [userName, setUserName] = useState(() => config.portfolioName || '');
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
  const [accentColor, setAccentColor] = useState<'purple' | 'cyan' | 'orange' | 'emerald'>(() => config.accentColor || 'cyan');

  // Auto-save Wizard state to parent config for editability/persistence
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      portfolioName: userName,
      wizardTags: tags,
      wizardFocusInput: focusInput,
      wizardManualProfessionId: manualProfessionId,
      wizardAnswers: answers,
      accentColor: accentColor
    }));
  }, [userName, tags, focusInput, manualProfessionId, answers, accentColor, setConfig]);

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
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
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
      '🔍 Analizowanie słów kluczowych i preferencji...',
      `🎯 Dopasowano optymalny profil: ${selectedCategory.name}`,
      '📂 Przygotowywanie dedykowanego zestawu ikon i skrótów...',
      '🛠️ Tworzenie struktury widżetów oraz podstron...',
      '🎨 Kompilacja schematu graficznego z akcentem: ' + accentColor,
      '💫 Generowanie responsywnej wersji demonstracyjnej...',
      '✨ Sukces! Twój system portfolio jest gotowy do pracy.'
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
    });
  };

  const handleFinishAndExplore = () => {
    onClose();
    if (!isZeroState) {
      openApp('bio');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-2">
      {/* Top progress stepper */}
      {!isFinished && !isGenerating && (
        <div className="flex items-center justify-between mb-8 select-none">
          {([
            { stepNum: 1, name: 'Branża', icon: <User size={13} /> },
            { stepNum: 2, name: 'Szczegóły', icon: <HelpCircle size={13} /> },
            { stepNum: 3, name: 'Sekcje', icon: <Check size={13} /> },
            { stepNum: 4, name: 'Wygląd', icon: <Palette size={13} /> }
          ]).map((s) => (
            <React.Fragment key={s.stepNum}>
              <div className="flex items-center space-x-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  step === s.stepNum 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20' 
                    : step > s.stepNum 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-900 border border-slate-800 text-slate-500'
                }`}>
                  {s.icon}
                </div>
                <span className={`text-xs font-sans font-medium hidden sm:inline ${
                  step === s.stepNum ? 'text-white' : 'text-slate-400'
                }`}>
                  {s.name}
                </span>
              </div>
              {s.stepNum < 4 && (
                <div className={`flex-1 h-0.5 mx-2 rounded ${
                  step > s.stepNum ? 'bg-emerald-500/30' : 'bg-slate-800'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Main Container Form */}
      {isFinished ? (
        <div className="p-6 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner shadow-emerald-500/10">
            <CheckCircle size={32} className="animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-sans font-bold text-white">
              Wizytówka Gotowa do Pracy!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Gratulacje! Twój nowy system wizytówkowy został wygenerowany z uwzględnieniem branży <strong className="text-amber-400">{selectedCategory.name}</strong>. Wszystkie widżety, skróty i bazy danych zostały skonfigurowane automatycznie.
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
              <span className="text-slate-400">Schemat kolorów:</span>
              <span className="text-cyan-400 font-mono capitalize">{accentColor}</span>
            </div>
          </div>

          <button
            id="btn-finish-wizard"
            onClick={handleFinishAndExplore}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 mx-auto shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Eye size={14} /> {isZeroState ? 'Uruchom Mój Pulpit OS' : 'Zapisz i Otwórz Profil'}
          </button>
        </div>
      ) : isGenerating ? (
        <div className="py-12 text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-2xl border-4 border-amber-500/10 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl border-4 border-t-amber-500 animate-spin" />
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-sans font-bold text-white">Generowanie optymalnej struktury...</h4>
            <p className="text-[11px] text-slate-400">Tworzenie spersonalizowanego środowiska pracy.</p>
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
          {/* Step 1: Broad focus keyword & core branding */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-semibold text-white">Kim jesteś i czym się zajmujesz?</h3>
                <p className="text-xs text-slate-400">Podaj podstawowe informacje, które pomogą nam spersonalizować Twoje portfolio.</p>
              </div>

              <div className="space-y-4 pt-2">
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

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Na czym się skupiasz? (Podaj branżę lub słowa kluczowe)</label>
                  
                  {/* Real-time Tags List */}
                  <div className="flex flex-wrap gap-1.5 p-3 min-h-[56px] bg-slate-950/60 border border-slate-800/80 rounded-xl">
                    {tags.length === 0 ? (
                      <span className="text-xs text-slate-500 self-center">
                        Wpisz słowa kluczowe poniżej i zatwierdź Enterem...
                      </span>
                    ) : (
                      tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-sans font-medium text-amber-400 animate-fadeIn"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(idx)}
                            className="text-amber-500/60 hover:text-amber-400 focus:outline-none transition-colors cursor-pointer"
                          >
                            <X size={12} strokeWidth={2.5} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Input field */}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder="np. rolnictwo, uprawa owoców, programowanie w React, remonty mieszkań"
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                    Wpisz słowo kluczowe i naciśnij <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[9px] font-mono">Enter</kbd> lub przecinek. Nasz inteligentny algorytm rozpozna profil w czasie rzeczywistym.
                  </p>
                </div>

                {/* Real-time category recognition indicator */}
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-900/60">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">Rozpoznany profil branżowy</span>
                      <div className="flex items-center gap-1.5">
                        <CategoryIcon id={selectedCategory.id} size={15} className="text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-white font-sans">{selectedCategory.name}</span>
                      </div>
                    </div>

                    <div>
                      {selectedCategory.matchedProfession ? (
                        <div className={`px-2.5 py-1 rounded-full ${manualProfessionId ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'} text-[10px] font-mono flex items-center gap-1.5 shrink-0 select-none`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${manualProfessionId ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                          {manualProfessionId ? 'Wybrano' : 'Automatycznie dopasowano'}
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 shrink-0 select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                          Profil ogólny
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Suggestions (Top-3 Chips) or descriptive placeholder */}
                  {topMatches.length > 0 && topMatches[0].confidence >= 0.4 ? (
                    <div className="space-y-2.5 animate-fadeIn">
                      <span className="text-[10px] text-slate-400 font-sans font-medium block">
                        Dopasowane specjalizacje (kliknij jedną, aby wybrać profil):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {topMatches.map(({ profession, confidence }) => {
                          const isSelected = selectedCategory.matchedProfession?.id === profession.id;
                          return (
                            <button
                              key={profession.id}
                              type="button"
                              onClick={() => setManualProfessionId(profession.id)}
                              className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2.5 group relative ${
                                isSelected
                                  ? 'bg-amber-500/10 border-amber-500/60 border text-white shadow-lg shadow-amber-500/5'
                                  : 'bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white'
                              }`}
                            >
                              <div className="shrink-0 group-hover:scale-110 transition-transform">
                                <ProfessionIcon id={profession.id} size={16} className="text-amber-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`text-xs font-semibold truncate ${isSelected ? 'text-amber-400' : 'text-slate-200'}`}>
                                  {profession.title}
                                </div>
                                <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                                  Zgodność: {Math.round(confidence * 100)}%
                                </div>
                              </div>
                              {isSelected && (
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 leading-relaxed py-1 animate-fadeIn">
                      Wpisz słowa kluczowe u góry, aby automatycznie dobrać precyzyjną specjalizację (np. <span className="text-amber-400 font-mono">hydraulik</span>, <span className="text-amber-400 font-mono">stolarz</span>, <span className="text-amber-400 font-mono">grafik</span>). Obecnie stosujemy profil ogólny lub najbliższą branżę.
                    </div>
                  )}

                  {/* Collapsible search reserve option (Option B) */}
                  <div className="pt-3 border-t border-slate-900/40 space-y-3">
                    <button
                      type="button"
                      onClick={() => setIsFullListExpanded(!isFullListExpanded)}
                      className="w-full flex items-center justify-between text-left text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
                    >
                      <span className="font-sans font-medium flex items-center gap-1.5">
                        <Search size={12} className="text-slate-400 shrink-0" />
                        <span>Żadna z sugestii nie pasuje? Wyszukaj ręcznie z pełnej listy</span>
                      </span>
                      <ChevronRight 
                        size={14} 
                        className={`text-slate-500 transition-transform duration-200 shrink-0 ${isFullListExpanded ? 'rotate-90 text-amber-500' : ''}`} 
                      />
                    </button>

                    {isFullListExpanded && (
                      <div className="space-y-3 pt-1 animate-fadeIn">
                        <div className="relative">
                          <input
                            type="text"
                            value={comboboxSearch}
                            onChange={(e) => setComboboxSearch(e.target.value)}
                            placeholder="Wpisz np. stolarz, rolnik, programista, fotograf, fryzjer..."
                            className="w-full pl-8 pr-8 py-2 bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-amber-500/50 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                          />
                          <div className="absolute left-2.5 top-2.5 text-slate-500 pointer-events-none">
                            <Search size={13} />
                          </div>
                          {comboboxSearch && (
                            <button
                              type="button"
                              onClick={() => setComboboxSearch('')}
                              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>

                        <div className="max-h-[170px] overflow-y-auto pr-1 space-y-4 custom-scrollbar">
                          {industryCategories.map(cat => {
                            const profsInCat = filteredProfessions.filter(p => p.categoryId === cat.id);
                            if (profsInCat.length === 0) return null;
                            return (
                              <div key={cat.id} className="space-y-1.5 pb-2">
                                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 py-1 border-b border-slate-900/50 mb-1">
                                  <CategoryIcon id={cat.id} size={11} className="text-slate-400 shrink-0" />
                                  <span>{cat.name}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 px-0.5">
                                  {profsInCat.map(p => {
                                    const isSelected = selectedCategory.matchedProfession?.id === p.id;
                                    return (
                                      <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setManualProfessionId(p.id)}
                                        className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-sans border cursor-pointer flex items-center gap-2 transition-all ${
                                          isSelected
                                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 font-medium'
                                            : 'bg-transparent border-transparent text-slate-300 hover:text-white hover:bg-slate-900/50 hover:border-slate-800/80'
                                        }`}
                                      >
                                        <ProfessionIcon id={p.id} size={14} className={isSelected ? 'text-amber-400 shrink-0' : 'text-slate-400 shrink-0'} />
                                        <span className="truncate flex-1">{p.title}</span>
                                        {isSelected && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}

                          {filteredProfessions.length === 0 && (
                            <div className="text-center py-6 text-xs text-slate-500 italic">
                              Brak dopasowań dla "{comboboxSearch}".
                            </div>
                          )}

                          <div className="border-t border-slate-900/80 pt-1.5 mt-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setManualProfessionId('');
                                setTags([]);
                                setFocusInput('');
                                setComboboxSearch('');
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-sans text-amber-500/90 hover:text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 cursor-pointer flex items-center gap-2 transition-all"
                            >
                              <Globe size={14} className="text-amber-500 shrink-0" />
                              <span className="flex-1 text-left">Zresetuj i wybierz profil ogólny</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dynamically generated industry specific questions */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <CategoryIcon id={selectedCategory.id} size={18} className="text-amber-400 shrink-0" />
                  <h3 className="text-base font-sans font-semibold text-white">Podstawowe pytania dla branży: {selectedCategory.name}</h3>
                </div>
                <p className="text-xs text-slate-400">Odpowiedz na te proste pytania, aby automatycznie wypełnić opisy i teksty wizytówki.</p>
              </div>

              <div className="space-y-4 pt-2">
                {selectedCategory.questions.map((q) => (
                  <div key={q.id} className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">{q.question}</label>
                    {q.type === 'select' ? (
                      <select
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="">Wybierz...</option>
                        {q.options?.map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : q.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder={q.placeholder}
                        className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder={q.placeholder}
                        className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Enable / Disable Recommended Sections */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-semibold text-white">Sugerowane Sekcje Portfolio</h3>
                <p className="text-xs text-slate-400">Wybierz, które sekcje i integracje chcesz wdrożyć. Zostały one dobrane do specyfiki Twojej branży.</p>
              </div>

              <div className="space-y-3 pt-2 max-h-[280px] overflow-y-auto pr-1">
                {selectedCategory.suggestedSections.map((sec) => {
                  const isChecked = !!selectedSections[sec.id];
                  return (
                    <div 
                      key={sec.id}
                      onClick={() => toggleSection(sec.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 select-none cursor-pointer ${
                        isChecked 
                          ? 'bg-slate-950/80 border-amber-500/40 text-white' 
                          : 'bg-slate-950/20 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-700'
                      }`}>
                        {isChecked && <Check size={11} strokeWidth={3} />}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold font-sans block">{sec.name}</span>
                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed">{sec.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Personalization (theme presets) */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-semibold text-white">Wybierz Akcent Wizualny</h3>
                <p className="text-xs text-slate-400">Zdecyduj o kolorze neonowej poświaty oraz elementów nawigacyjnych.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { id: 'purple', name: 'Lumina Deep Violet', glow: 'bg-purple-500', text: 'text-purple-400' },
                  { id: 'cyan', name: 'Cyber Neon Cyan', glow: 'bg-cyan-500', text: 'text-cyan-400' },
                  { id: 'orange', name: 'Sunset Amber Glow', glow: 'bg-orange-500', text: 'text-orange-400' },
                  { id: 'emerald', name: 'Nordic Emerald Mint', glow: 'bg-emerald-500', text: 'text-emerald-400' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAccentColor(preset.id as any)}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      accentColor === preset.id
                        ? 'border-amber-500 bg-slate-900/60 shadow-lg'
                        : 'border-slate-800 bg-slate-950/20 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-3.5 h-3.5 rounded-full ${preset.glow} shrink-0`} />
                      <span className="text-xs font-sans font-semibold text-slate-200">
                        {preset.name}
                      </span>
                    </div>
                    {accentColor === preset.id && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls Footer buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium cursor-pointer"
              >
                <ArrowLeft size={13} /> Wstecz
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-sans font-bold flex items-center gap-1 cursor-pointer"
              >
                Dalej <ArrowRight size={13} />
              </button>
            ) : (
              <button
                id="btn-trigger-generate"
                onClick={handleGenerate}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles size={13} /> Generuj Moje Portfolio OS
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
