/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OSConfig } from '../types';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle, Github, Instagram, Linkedin, User, Palette, Eye } from 'lucide-react';

interface WizardProps {
  config: OSConfig;
  setConfig: React.Dispatch<React.SetStateAction<OSConfig>>;
  onClose: () => void;
  openApp: (appId: 'bio' | 'projects' | 'lab' | 'certificates' | 'settings' | 'contact' | 'wizard') => void;
}

export const Wizard: React.FC<WizardProps> = ({
  config,
  setConfig,
  onClose,
  openApp
}) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Form states initialized from current config
  const [form, setForm] = useState({
    name: config.portfolioName,
    bio: config.portfolioBio,
    github: config.githubUsername || '',
    instagram: config.instagramUsername || '',
    linkedin: config.linkedinUsername || '',
    themePreset: config.accentColor || 'purple',
    roleType: 'Senior Frontend Developer',
    fetchingPhotos: false,
    fetchedPhotosCount: 0
  });

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleFetchPhotos = () => {
    setForm(prev => ({ ...prev, fetchingPhotos: true }));
    setTimeout(() => {
      setForm(prev => ({
        ...prev,
        fetchingPhotos: false,
        fetchedPhotosCount: 4
      }));
    }, 1500);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Update global configuration with user's choices
      setConfig(prev => ({
        ...prev,
        portfolioName: form.name,
        portfolioBio: form.bio,
        githubUsername: form.github || undefined,
        instagramUsername: form.instagram || undefined,
        linkedinUsername: form.linkedin || undefined,
        accentColor: form.themePreset as 'purple' | 'cyan' | 'orange' | 'emerald',
        // Update photo set if fetched during the wizard
        instagramPhotos: form.fetchedPhotosCount > 0 
          ? [
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=500&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80'
            ]
          : prev.instagramPhotos
      }));
      setIsGenerating(false);
      setIsFinished(true);
    }, 2000);
  };

  const handleFinishAndExplore = () => {
    onClose();
    // Open Bio App immediately so the user can see their customized results live!
    openApp('bio');
  };

  return (
    <div className="max-w-2xl mx-auto py-2">
      {/* Top progress stepper */}
      {!isFinished && (
        <div className="flex items-center justify-between mb-8 select-none">
          {([
            { stepNum: 1, name: 'Informacje', icon: <User size={13} /> },
            { stepNum: 2, name: 'Integracje', icon: <Github size={13} /> },
            { stepNum: 3, name: 'Personalizacja', icon: <Palette size={13} /> }
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
              {s.stepNum < 3 && (
                <div className={`flex-1 h-0.5 mx-4 rounded ${
                  step > s.stepNum ? 'bg-emerald-500/30' : 'bg-slate-800'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Main Container Form */}
      {isFinished ? (
        <div className="p-8 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner shadow-emerald-500/10">
            <CheckCircle size={32} className="animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-sans font-bold text-white">
              Szablon Portfolio Wygenerowany!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Twój PortfolioOS został w pełni zaktualizowany na podstawie wprowadzonych preferencji. Dane profilowe, integracje i schematy kolorystyczne są gotowe do eksploracji.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left space-y-2 max-w-sm mx-auto">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <span className="font-semibold text-white">Nazwa portfolio:</span>
              <span className="text-slate-300">{form.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <span className="font-semibold text-white">Akcent kolorystyczny:</span>
              <span className="text-amber-400 font-mono capitalize">{form.themePreset}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <span className="font-semibold text-white">Instagram zdjęcia:</span>
              <span className="text-emerald-400 font-semibold">{form.fetchedPhotosCount > 0 ? 'Zaimportowano (4 szt.)' : 'Standardowy feed'}</span>
            </div>
          </div>

          <button
            id="btn-finish-wizard"
            onClick={handleFinishAndExplore}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 mx-auto shadow-lg shadow-amber-500/20 transition-all"
          >
            <Eye size={14} /> Uruchom Mój Pulpit OS
          </button>
        </div>
      ) : isGenerating ? (
        <div className="py-12 text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-2xl border-4 border-amber-500/10 animate-pulse" />
            <div className="absolute inset-0 rounded-2xl border-4 border-t-amber-500 animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-sans font-bold text-white">Generowanie środowiska...</h4>
            <p className="text-[11px] text-slate-400">Analizowanie powiązań społecznościowych i wdrażanie bibliotek stylów w locie.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Step 1: Base profile */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-semibold text-white">Krok 1: Informacje o Twoim Portfolio</h3>
                <p className="text-xs text-slate-400">Wpisz swoje dane do wizytówki, które automatycznie wygenerują struktury tekstowe.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Imię i Nazwisko / Nazwa wizytówki</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="np. Wiktor Krawczyk"
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Poziom Doświadczenia</label>
                  <select
                    value={form.roleType}
                    onChange={(e) => setForm(f => ({ ...f, roleType: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Junior Frontend Developer">Junior Frontend Developer</option>
                    <option value="Mid Fullstack Developer">Mid Fullstack Developer</option>
                    <option value="Senior Frontend Developer">Senior Frontend Developer</option>
                    <option value="Lead UI/UX Architect">Lead UI/UX Architect</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Krótki opis bio / tagline</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Napisz krótko czym się zajmujesz..."
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Social integration mock */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-semibold text-white">Krok 2: Powiązania Społecznościowe</h3>
                <p className="text-xs text-slate-400">Podepnij najważniejsze konta deweloperskie i wizualne do swojego portfolio.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2 bg-slate-950/40 p-1 rounded-xl border border-slate-800/80">
                  <span className="p-2 text-slate-400">
                    <Github size={15} />
                  </span>
                  <input
                    type="text"
                    value={form.github}
                    onChange={(e) => setForm(f => ({ ...f, github: e.target.value }))}
                    placeholder="Twój login GitHub"
                    className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-slate-600"
                  />
                </div>

                <div className="flex items-center space-x-2 bg-slate-950/40 p-1 rounded-xl border border-slate-800/80">
                  <span className="p-2 text-slate-400">
                    <Linkedin size={15} />
                  </span>
                  <input
                    type="text"
                    value={form.linkedin}
                    onChange={(e) => setForm(f => ({ ...f, linkedin: e.target.value }))}
                    placeholder="Twój profil LinkedIn (np. in/nazwa)"
                    className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 bg-slate-950/40 p-1 rounded-xl border border-slate-800/80">
                    <span className="p-2 text-slate-400">
                      <Instagram size={15} />
                    </span>
                    <input
                      type="text"
                      value={form.instagram}
                      onChange={(e) => setForm(f => ({ ...f, instagram: e.target.value }))}
                      placeholder="Twój profil Instagram"
                      className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-slate-600"
                    />
                  </div>

                  <button
                    type="button"
                    id="btn-fetch-instagram"
                    onClick={handleFetchPhotos}
                    disabled={form.fetchingPhotos || !form.instagram}
                    className="text-[10px] font-sans font-bold text-amber-400 hover:text-amber-300 disabled:text-slate-600 transition-colors flex items-center gap-1 ml-1"
                  >
                    {form.fetchingPhotos ? (
                      'Pobieranie zdjęć feed...'
                    ) : form.fetchedPhotosCount > 0 ? (
                      '✓ Zdjęcia zaciągnięte pomyślnie (4 szt.)'
                    ) : (
                      '⚡ Importuj najnowszy feed zdjęć z Instagrama (Mock API)'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Styles preset */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-base font-sans font-semibold text-white">Krok 3: Stylizowanie & Schemat Akcentu</h3>
                <p className="text-xs text-slate-400">Wybierz główny neonowy kolor poświaty, który nada styl całemu systemowi.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { id: 'purple', name: 'Lumina Deep Violet', glow: 'bg-purple-500' },
                  { id: 'cyan', name: 'Cyber Neon Cyan', glow: 'bg-cyan-500' },
                  { id: 'orange', name: 'Sunset Amber Glow', glow: 'bg-orange-500' },
                  { id: 'emerald', name: 'Nordic Emerald Mint', glow: 'bg-emerald-500' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    id={`btn-preset-${preset.id}`}
                    onClick={() => setForm(f => ({ ...f, themePreset: preset.id }))}
                    className={`p-4 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                      form.themePreset === preset.id
                        ? 'border-amber-500 bg-slate-900/60 shadow-lg'
                        : 'border-slate-800 bg-slate-950/20 hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${preset.glow} shrink-0`} />
                    <span className="text-xs font-sans font-semibold text-slate-200">
                      {preset.name}
                    </span>
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
              >
                <ArrowLeft size={13} /> Wstecz
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-sans font-bold flex items-center gap-1"
              >
                Dalej <ArrowRight size={13} />
              </button>
            ) : (
              <button
                id="btn-trigger-generate"
                onClick={handleGenerate}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
              >
                <Sparkles size={13} /> Generuj Mój Szablon OS
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
