/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Smartphone, 
  Database, 
  PhoneOff, 
  CheckCircle, 
  PhoneCall, 
  Server, 
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldCheck,
  Search,
  MessageSquareOff,
  Flame,
  ArrowRight
} from 'lucide-react';

interface PresetNumber {
  number: string;
  label: string;
  type: 'scam' | 'warning' | 'safe' | 'unrecognized';
  reputation: string;
  source: string;
  details: string;
}

const PRESET_NUMBERS: PresetNumber[] = [
  {
    number: '+48 732 104 220',
    label: 'Bot Fotowoltaika',
    type: 'scam',
    reputation: 'Skrajnie niebezpieczny (98% negatywnych)',
    source: 'nieznanynumer.pl • infonumer.pl',
    details: 'Agresywny bot głosowy oferujący rzekome dofinansowania. Dzwoni wielokrotnie z różnych końcówek.'
  },
  {
    number: '+48 501 234 567',
    label: 'Kurier DHL Express',
    type: 'safe',
    reputation: 'Bezpieczny / Zweryfikowany',
    source: 'Baza zaufana DHL',
    details: 'Kurier realizujący doręczenie przesyłki w Twojej okolicy.'
  },
  {
    number: '+48 801 321 456',
    label: 'Infolinia PKO BP (SPOOFING)',
    type: 'warning',
    reputation: 'Ostrzeżenie o spoofingu (Zgłoszenia)',
    source: 'Crowdsourced • Zgłoszenia użytkowników',
    details: 'Numer identyczny z oficjalną infolinią banku, lecz system wykrył brak certyfikacji połączenia (możliwy spoofing VoIP przez oszustów).'
  },
  {
    number: '+48 799 449 812',
    label: 'Naciągacze na garnki',
    type: 'scam',
    reputation: 'Spam / Telemarketing (91% negatywnych)',
    source: 'nieznanynumer.pl • numernet.pl',
    details: 'Zaproszenia na rzekome darmowe badania medyczne połączone z agresywną sprzedażą garnków i pościeli.'
  },
  {
    number: '+48 600 111 222',
    label: 'Nieznany numer prywatny',
    type: 'unrecognized',
    reputation: 'Brak wpisów w bazie danych',
    source: 'Brak zgłoszeń',
    details: 'Zwykłe połączenie od osoby prywatnej, brak podejrzanej aktywności w bazach antyspamowych.'
  }
];

export const AppPlanned: React.FC = () => {
  const [selectedNumber, setSelectedNumber] = useState<PresetNumber>(PRESET_NUMBERS[0]);
  const [customNumber, setCustomNumber] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<'idle' | 'calling' | 'analyzing' | 'resolved'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSimulatePreset = (preset: PresetNumber) => {
    setSelectedNumber(preset);
    setCustomNumber('');
    startSimulation(preset);
  };

  const handleSimulateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNumber.trim()) return;

    // Build temporary PresetNumber structure for custom
    const cleanNum = customNumber.trim();
    let customPreset: PresetNumber = {
      number: cleanNum,
      label: 'Niezidentyfikowane połączenie',
      type: 'unrecognized',
      reputation: 'Brak wpisów w bazach publicznych',
      source: 'Analiza w czasie rzeczywistym',
      details: 'Wprowadzony numer nie znajduje się na czarnej liście. Połączenie zostanie dopuszczone do odebrania.'
    };

    // basic heuristic for simulation fun
    if (cleanNum.replace(/\s+/g, '').includes('732') || cleanNum.includes('799') || cleanNum.includes('800')) {
      customPreset = {
        number: cleanNum,
        label: 'Podejrzenie Spamu',
        type: 'scam',
        reputation: 'Wykryto podejrzany schemat (nieznanynumer.pl: 84%)',
        source: 'nieznanynumer.pl API',
        details: 'Numer o zbliżonej strukturze do zgłoszonych kampanii telemarketingowych botów AI.'
      };
    }

    startSimulation(customPreset);
  };

  const startSimulation = (target: PresetNumber) => {
    setIsSimulating(true);
    setSimulationStep('calling');
    setFeedbackMsg('');

    // Step 1: Call ringing (1.5s)
    setTimeout(() => {
      setSimulationStep('analyzing');
      
      // Step 2: Database query and AI rating check (1.8s)
      setTimeout(() => {
        setSimulationStep('resolved');
        if (target.type === 'scam') {
          setFeedbackMsg('POŁĄCZENIE ODRZUCONE: Wykryto próbę wyłudzenia / bot marketingowy.');
        } else if (target.type === 'warning') {
          setFeedbackMsg('OSTRZEŻENIE SYSTEMOWE: Wykryto podszywanie się pod bank (Spoofing). Odbieraj z ostrożnością!');
        } else {
          setFeedbackMsg('POŁĄCZENIE DOPUSZCZONE: Zaufany kontakt lub brak podejrzanej historii.');
        }
      }, 1800);

    }, 1500);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationStep('idle');
    setFeedbackMsg('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-y-auto pr-2 pb-6 text-slate-200">
      
      {/* LEFT COLUMN: Project Details & Specs (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Header Block */}
        <div className="space-y-1.5 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Rozwój mobilny • Planowany
            </span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono flex items-center gap-1">
              <Flame size={10} className="animate-pulse" /> Android & iOS
            </span>
          </div>
          <h2 className="text-xl font-sans font-bold text-white tracking-tight flex items-center gap-2 mt-1">
            <ShieldAlert className="text-rose-500 w-5 h-5" />
            Scam Identifier & Call Blocker
          </h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Inteligentna, otwarta aplikacja mobilna dedykowana na systemy Android oraz iOS, skutecznie blokująca oszustwa głosowe (Vishing), naciągaczy oraz automatyczne boty AI w oparciu o agregację publicznych baz opinii w czasie rzeczywistym.
          </p>
        </div>

        {/* Technical Architecture Specs */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Kluczowe Założenia Techniczne
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Spec Card 1 */}
            <div className="p-3.5 rounded-xl bg-slate-900/25 border border-white/5 hover:border-white/10 transition-all flex gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/15 h-fit">
                <Database size={15} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white font-sans">Agregacja baz online</h4>
                <p className="text-[11px] text-slate-400 leading-normal font-sans">
                  Dynamiczny web scraping i integracja API z polskimi serwisami opinii o numerach (np. <strong>nieznanynumer.pl</strong>, <strong>infonumer.pl</strong>, <strong>numernet.pl</strong>) w celu natychmiastowej oceny spamu.
                </p>
              </div>
            </div>

            {/* Spec Card 2 */}
            <div className="p-3.5 rounded-xl bg-slate-900/25 border border-white/5 hover:border-white/10 transition-all flex gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/15 h-fit">
                <Smartphone size={15} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white font-sans">Integracja z CallKit & SDK</h4>
                <p className="text-[11px] text-slate-400 leading-normal font-sans">
                  Wykorzystanie natywnych frameworków systemowych: <strong>Call Directory Extension</strong> (iOS/Swift) oraz <strong>CallScreeningService</strong> (Android/Kotlin) dla bezproblemowego działania w tle.
                </p>
              </div>
            </div>

            {/* Spec Card 3 */}
            <div className="p-3.5 rounded-xl bg-slate-900/25 border border-white/5 hover:border-white/10 transition-all flex gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/15 h-fit">
                <PhoneOff size={15} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white font-sans">Lokalna baza SQLite Offline</h4>
                <p className="text-[11px] text-slate-400 leading-normal font-sans">
                  Synchronizacja w tle top 15 000 najbardziej aktywnych numerów spamowych bezpośrednio na urządzeniu, gwarantująca natychmiastowe blokowanie nawet bez dostępu do sieci.
                </p>
              </div>
            </div>

            {/* Spec Card 4 */}
            <div className="p-3.5 rounded-xl bg-slate-900/25 border border-white/5 hover:border-white/10 transition-all flex gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/15 h-fit">
                <Server size={15} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white font-sans">Anti-Spoofing & Społeczność</h4>
                <p className="text-[11px] text-slate-400 leading-normal font-sans">
                  Szybkie raportowanie przez użytkowników bezpośrednio w aplikacji, pozwalające na tworzenie wirtualnych zapór chroniących przed podszywaniem się pod banki i urzędy (Spoofing).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap / Status checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Fazy Realizacji Projektu (Roadmap)
          </h3>
          
          <div className="space-y-2 font-sans text-xs">
            {/* Phase 1 */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/10 border border-slate-800/40">
              <div className="mt-0.5 text-emerald-400 bg-emerald-500/10 p-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle size={12} />
              </div>
              <div>
                <span className="font-semibold text-white">Faza 1: Analiza rynkowa i projekt architektury (100%)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Analiza struktury nagłówków stron antyspamowych, projekt bazy danych SQLite, diagramy przepływu integracji VoIP i CallKit.</p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/10 border border-slate-800/40">
              <div className="mt-0.5 text-orange-400 bg-orange-500/10 p-0.5 rounded-full border border-orange-500/20 animate-pulse">
                <Play size={12} />
              </div>
              <div>
                <span className="font-semibold text-white">Faza 2: Prototyp serwisu filtrującego na Android (W trakcie - 45%)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Implementacja `ConnectionService` oraz `CallScreeningService` w języku Kotlin. Przechwytywanie metadanych o numerze przed dzwonkiem.</p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/10 border border-slate-800/40 opacity-70">
              <div className="mt-0.5 text-slate-500 bg-slate-950 p-0.5 rounded-full border border-slate-800">
                <ArrowRight size={12} />
              </div>
              <div>
                <span className="font-semibold text-white/80">Faza 3: Rozszerzenie iOS Call Directory i App Group (Planowane)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Stworzenie modułu Swift przekazującego skompresowane tablice skrótów numerów do pamięci CallKit w celu blokowania bez wybudzania głównej aplikacji.</p>
              </div>
            </div>

            {/* Phase 4 */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/10 border border-slate-800/40 opacity-70">
              <div className="mt-0.5 text-slate-500 bg-slate-950 p-0.5 rounded-full border border-slate-800">
                <ArrowRight size={12} />
              </div>
              <div>
                <span className="font-semibold text-white/80">Faza 4: Dedykowane API w chmurze & Agregator opinii AI (Planowane)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">Backend w Node.js parsujący na bieżąco strony antyspamowe z inteligentnym modelem Gemini oceniającym semantyczny stopień zagrożenia (scam, marketing itp.).</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Real-Time Phone Screening Simulator (5 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1.5">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Symulator Blokowania Połączeń
          </h3>
          <p className="text-xs text-slate-400 font-sans leading-tight">
            Przetestuj działanie algorytmu! Wybierz podejrzany numer z listy lub wpisz własny, aby zobaczyć reakcję tarczy Scam Identifier.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 uppercase font-mono">Przykładowe numery testowe:</label>
          <div className="flex flex-col gap-1">
            {PRESET_NUMBERS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulatePreset(preset)}
                className={`w-full p-2 rounded-lg text-left text-xs transition-all border font-sans cursor-pointer flex justify-between items-center ${
                  selectedNumber.number === preset.number && isSimulating
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-slate-950/40 hover:bg-slate-900/50 border-white/5 hover:border-white/10 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      preset.type === 'scam' ? 'bg-rose-500' :
                      preset.type === 'warning' ? 'bg-amber-500' :
                      preset.type === 'safe' ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                    {preset.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{preset.number}</div>
                </div>
                <span className="text-[9px] font-mono opacity-60">Zasymuluj →</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <form onSubmit={handleSimulateCustom} className="flex gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Wpisz np. +48 732 999 111"
              value={customNumber}
              onChange={(e) => setCustomNumber(e.target.value)}
              className="w-full px-2.5 py-1.5 pl-8 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 font-mono"
            />
            <Search size={12} className="absolute left-2.5 top-2 text-slate-500" />
          </div>
          <button
            type="submit"
            disabled={!customNumber.trim()}
            className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Sprawdź
          </button>
        </form>

        {/* Interactive Smartphone Mockup */}
        <div className="relative mx-auto w-56 h-[340px] bg-slate-950 border-[5px] border-slate-800 rounded-[32px] overflow-hidden shadow-xl flex flex-col justify-between p-3 select-none">
          {/* Top Speaker Notch */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-slate-800 rounded-full flex items-center justify-center z-10">
            <div className="w-6 h-1 bg-black rounded-full" />
          </div>

          {/* SCREEN CONTENT */}
          <div className="flex-1 flex flex-col justify-between pt-5 pb-3">
            {simulationStep === 'idle' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 p-2">
                <Smartphone className="w-10 h-10 text-slate-500 animate-pulse" />
                <p className="text-xs font-semibold text-white">System aktywny</p>
                <p className="text-[10px] text-slate-400">Wybierz lub wpisz numer z bazy powyżej, aby wywołać symulację połączenia przychodzącego.</p>
              </div>
            )}

            {simulationStep === 'calling' && (
              <div className="flex-1 flex flex-col items-center justify-between text-center py-4">
                <div className="space-y-1">
                  <span className="text-[8px] uppercase tracking-widest font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full animate-pulse">
                    Połączenie przychodzące...
                  </span>
                  <p className="text-sm font-bold text-white mt-1 font-mono tracking-tight">{selectedNumber.number}</p>
                  <p className="text-[10px] text-slate-400">Wyszukiwanie informacji o dzwoniącym...</p>
                </div>

                <div className="relative flex items-center justify-center">
                  {/* Glowing rings */}
                  <div className="absolute w-20 h-20 border border-cyan-500/30 rounded-full animate-ping" />
                  <div className="absolute w-14 h-14 border border-cyan-500/40 rounded-full animate-ping delay-75" />
                  <div className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full relative z-10 animate-bounce">
                    <PhoneCall size={20} />
                  </div>
                </div>

                <div className="text-[8px] text-slate-500 font-mono">
                  Scam Identifier v1.0.4-dev
                </div>
              </div>
            )}

            {simulationStep === 'analyzing' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-4">
                <div className="p-3.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full animate-spin">
                  <Database size={22} />
                </div>
                <div className="space-y-1 px-1">
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                    Odpytywanie baz danych
                  </p>
                  <p className="text-[9px] text-slate-400 leading-tight">
                    Przeszukiwanie bazy nieznanynumer.pl oraz lokalnej sygnatury spamu offline...
                  </p>
                </div>
              </div>
            )}

            {simulationStep === 'resolved' && (
              <div className="flex-1 flex flex-col justify-between py-2 text-center">
                {selectedNumber.type === 'scam' && (
                  <div className="flex-1 flex flex-col items-center justify-between">
                    <div className="space-y-1 px-1 w-full">
                      <div className="mx-auto w-fit p-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full animate-scaleIn">
                        <MessageSquareOff size={22} />
                      </div>
                      <p className="text-[11px] font-extrabold text-rose-500 uppercase tracking-wider font-mono mt-1">
                        Połączenie Odrzucone!
                      </p>
                      <p className="text-[10px] font-bold text-white mt-1 truncate">{selectedNumber.label}</p>
                      <p className="text-[9px] font-mono text-rose-300 bg-rose-500/5 border border-rose-500/10 px-1 py-0.5 rounded mt-1">
                        {selectedNumber.reputation}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2 text-left text-[9px] text-slate-400 leading-snug w-full">
                      <span className="font-bold text-slate-300 font-sans block mb-0.5">Raport (źródło: {selectedNumber.source}):</span>
                      {selectedNumber.details}
                    </div>

                    <button
                      onClick={resetSimulation}
                      className="mt-2 flex items-center justify-center gap-1 mx-auto px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-semibold rounded-full cursor-pointer transition-colors"
                    >
                      <RotateCcw size={9} /> Resetuj symulator
                    </button>
                  </div>
                )}

                {selectedNumber.type === 'warning' && (
                  <div className="flex-1 flex flex-col items-center justify-between">
                    <div className="space-y-1 px-1 w-full">
                      <div className="mx-auto w-fit p-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full animate-scaleIn">
                        <AlertTriangle size={22} />
                      </div>
                      <p className="text-[11px] font-extrabold text-amber-500 uppercase tracking-wider font-mono mt-1 animate-pulse">
                        Wykryto Spoofing!
                      </p>
                      <p className="text-[10px] font-bold text-white mt-1 truncate">{selectedNumber.label}</p>
                      <p className="text-[9px] font-mono text-amber-300 bg-amber-500/5 border border-amber-500/10 px-1 py-0.5 rounded mt-1">
                        {selectedNumber.reputation}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2 text-left text-[9px] text-slate-400 leading-snug w-full">
                      <span className="font-bold text-slate-300 font-sans block mb-0.5">Raport (źródło: {selectedNumber.source}):</span>
                      {selectedNumber.details}
                    </div>

                    <button
                      onClick={resetSimulation}
                      className="mt-2 flex items-center justify-center gap-1 mx-auto px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-semibold rounded-full cursor-pointer transition-colors"
                    >
                      <RotateCcw size={9} /> Resetuj symulator
                    </button>
                  </div>
                )}

                {selectedNumber.type !== 'scam' && selectedNumber.type !== 'warning' && (
                  <div className="flex-1 flex flex-col items-center justify-between">
                    <div className="space-y-1 px-1 w-full">
                      <div className="mx-auto w-fit p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full animate-scaleIn">
                        <ShieldCheck size={22} />
                      </div>
                      <p className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider font-mono mt-1">
                        Bezpieczny Numer
                      </p>
                      <p className="text-[10px] font-bold text-white mt-1 truncate">{selectedNumber.label}</p>
                      <p className="text-[9px] font-mono text-emerald-300 bg-emerald-500/5 border border-emerald-500/10 px-1 py-0.5 rounded mt-1">
                        {selectedNumber.reputation}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2 text-left text-[9px] text-slate-400 leading-snug w-full">
                      <span className="font-bold text-slate-300 font-sans block mb-0.5">Raport:</span>
                      {selectedNumber.details}
                    </div>

                    <button
                      onClick={resetSimulation}
                      className="mt-2 flex items-center justify-center gap-1 mx-auto px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-semibold rounded-full cursor-pointer transition-colors"
                    >
                      <RotateCcw size={9} /> Resetuj symulator
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
