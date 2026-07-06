/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Terminal, Shield, CheckCircle2, AlertTriangle, Play, Sparkles, 
  RefreshCw, Wrench, Lock, Activity, Cpu, Eye, ArrowRight, ShieldAlert, FileText
} from 'lucide-react';

interface WindowsFixerSimulatorProps {
  onClose: () => void;
}

interface Issue {
  id: string;
  category: 'security' | 'system' | 'performance' | 'drivers';
  title: string;
  description: string;
  status: 'critical' | 'warning' | 'fixed';
  recommendation: string;
  command: string;
}

export const WindowsFixerSimulator: React.FC<WindowsFixerSimulatorProps> = ({ onClose }) => {
  const [description, setDescription] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [isScanComplete, setIsScanComplete] = useState(false);
  const [healthScore, setHealthScore] = useState(100);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isFixingId, setIsFixingId] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'terminal' | 'security'>('report');

  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  const presets = [
    {
      id: 'preset-slow',
      label: 'Wolne działanie & Optymalizacja',
      query: 'Komputer bardzo wolno działa, długo się uruchamia i zużywa 100% procesora.'
    },
    {
      id: 'preset-bsod',
      label: 'Niebieski ekran (BSOD) & Zawieszenia',
      query: 'Wyskakuje niebieski ekran (BSOD) z kodem DRIVER_IRQL_NOT_LESS_OR_EQUAL lub system się nagle zawiesza.'
    },
    {
      id: 'preset-malware',
      label: 'Wirusy & Zagrożenia bezpieczeństwa',
      query: 'Mam podejrzenie wirusa, Windows Defender jest wyłączony i wyskakują dziwne reklamy.'
    },
    {
      id: 'preset-update',
      label: 'Błąd Windows Update & Instalacji',
      query: 'Usługa Windows Update nie działa i zgłasza błąd instalacji aktualizacji 0x80070002.'
    }
  ];

  // Auto scroll console to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scanLogs]);

  const runDiagnosticScan = (queryText: string) => {
    if (!queryText.trim()) return;
    
    setIsScanning(true);
    setIsScanComplete(false);
    setScanStep(0);
    setScanLogs([]);
    setActiveTab('terminal');

    const logs: string[] = [];
    const addLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
      }, delay);
    };

    // Analyze query keywords to customize diagnosed issues
    const text = queryText.toLowerCase();
    let initialScore = 100;
    let scanIssues: Issue[] = [];

    if (text.includes('wolno') || text.includes('lag') || text.includes('optymaliz') || text.includes('dysk') || text.includes('slow')) {
      initialScore = 58;
      scanIssues = [
        {
          id: 'opt-startup',
          category: 'performance',
          title: 'Nadmiar programów w autostarcie',
          description: 'Zidentyfikowano 14 procesów trzecich uruchamianych przy starcie systemu o wysokim wpływie na procesor.',
          status: 'warning',
          recommendation: 'Wyłącz zbędne programy startowe w Menedżerze Zadań (Taskmgr) oraz wyczyść klucz rejestru Run.',
          command: 'reg delete HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v UnusedApp /f'
        },
        {
          id: 'opt-temp',
          category: 'performance',
          title: 'Przepełniony bufor plików tymczasowych',
          description: 'Ponad 12.4 GB plików tymczasowych w folderach Temp i Prefetch powoduje fragmentację tabel MFT.',
          status: 'warning',
          recommendation: 'Wykonaj oczyszczanie dysku za pomocą narzędzia cleanmgr i opróżnij foldery tymczasowe.',
          command: 'del /q/f/s %TEMP%\\* && cleanmgr /sagerun:1'
        },
        {
          id: 'opt-reg',
          category: 'system',
          title: 'Zfragmentowany i przestarzały rejestr systemowy',
          description: 'Znaleziono 842 osierocone klucze rejestru powodujące opóźnienia w odpytywaniu usług systemowych.',
          status: 'warning',
          recommendation: 'Wykonaj kompaktowanie i czyszczenie bazy rejestru przywracając domyślne indeksowanie gałęzi systemowych.',
          command: 'lodctr /R && cd %windir%\\system32 && config'
        }
      ];
    } else if (text.includes('blue') || text.includes('screen') || text.includes('bsod') || text.includes('niebieski') || text.includes('zawiesza')) {
      initialScore = 44;
      scanIssues = [
        {
          id: 'driver-gpu',
          category: 'drivers',
          title: 'Konflikt sterownika graficznego (nvlddmkm.sys)',
          description: 'Dziennik zdarzeń wskazuje na wielokrotne naruszenie pamięci jądra wywołane przez niestabilny sterownik GPU.',
          status: 'critical',
          recommendation: 'Zainstaluj czystą wersję sterownika graficznego WHQL oraz zaktualizuj firmware BIOS płyty głównej.',
          command: 'pnputil /add-driver oem32.inf /install /force'
        },
        {
          id: 'sys-files',
          category: 'system',
          title: 'Naruszenie integralności plików systemowych',
          description: 'Sumy kontrolne kluczowych bibliotek DLL systemu Windows (m.in. kernel32.dll) nie pasują do bazy sfc.',
          status: 'critical',
          recommendation: 'Uruchom narzędzie SFC (System File Checker) w połączeniu z przywracaniem obrazu DISM.',
          command: 'DISM.exe /Online /Cleanup-image /Restorehealth && sfc /scannow'
        },
        {
          id: 'sys-mem',
          category: 'system',
          title: 'Niestabilność pamięci podręcznej jądra',
          description: 'Zgłoszono błędy alokacji pamięci stronicowanej. Prawdopodobne uszkodzenie struktury pliku wymiany pagefile.sys.',
          status: 'warning',
          recommendation: 'Odbuduj plik wymiany systemu Windows i uruchom systemowe narzędzie diagnostyki pamięci RAM.',
          command: 'wmic pagefileupsetting where name="C:\\\\pagefile.sys" set InitialSize=4096,MaximumSize=8192'
        }
      ];
    } else if (text.includes('wirus') || text.includes('defender') || text.includes('bezpieczeństw') || text.includes('trojan') || text.includes('reklam')) {
      initialScore = 32;
      scanIssues = [
        {
          id: 'sec-defender',
          category: 'security',
          title: 'Ochrona Windows Defender została WYŁĄCZONA',
          description: 'Zasady grupy (Group Policy) wymusiły wyłączenie silnika antywirusowego w czasie rzeczywistym.',
          status: 'critical',
          recommendation: 'Przywróć domyślne zasady systemowe dla Windows Defender i uruchom usługę WinDefend.',
          command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender" /v DisableAntiSpyware /t REG_DWORD /d 0 /f'
        },
        {
          id: 'sec-port',
          category: 'security',
          title: 'Podejrzany otwarty port nasłuchowy (Port 4444)',
          description: 'Wykryto aktywną usługę nasłuchującą na porcie 4444, powiązaną z nieautoryzowanym procesem w tle.',
          status: 'critical',
          recommendation: 'Zablokuj port w zaporze sieciowej (Windows Firewall) i natychmiast zamknij powiązany proces PID.',
          command: 'netsh advfirewall firewall add rule name="Block Port 4444" dir=in action=block protocol=TCP localport=4444'
        },
        {
          id: 'sec-uac',
          category: 'security',
          title: 'Skrajnie obniżony poziom kontroli konta UAC',
          description: 'Kontrola Konta Użytkownika (UAC) została całkowicie wyłączona, co pozwala na cichą instalację malware.',
          status: 'warning',
          recommendation: 'Przywróć standardowy lub maksymalny poziom alertów UAC w ustawieniach systemowych.',
          command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v ConsentPromptBehaviorAdmin /t REG_DWORD /d 5 /f'
        }
      ];
    } else if (text.includes('update') || text.includes('aktualiz') || text.includes('błąd') || text.includes('0x')) {
      initialScore = 48;
      scanIssues = [
        {
          id: 'upd-db',
          category: 'system',
          title: 'Uszkodzona baza danych Windows Update (0x80070002)',
          description: 'Suma kontrolna pamięci podręcznej pobierania jest niespójna, co uniemożliwia zatwierdzenie nowych poprawek.',
          status: 'critical',
          recommendation: 'Zatrzymaj usługi aktualizacji, usuń katalog SoftwareDistribution i zrestartuj bufor pobierania.',
          command: 'net stop wuauserv && net stop bits && rd /s /q %windir%\\SoftwareDistribution && net start wuauserv'
        },
        {
          id: 'upd-bits',
          category: 'system',
          title: 'Usługa Inteligentnego Transferu w Tle (BITS) nie odpowiada',
          description: 'Usługa BITS została zablokowana lub wyłączona przez błąd zależności svchost.exe.',
          status: 'warning',
          recommendation: 'Zresetuj stan rejestracyjny i przywróć automatyczny start usługi BITS.',
          command: 'sc config bits start= auto && net start bits'
        }
      ];
    } else {
      // General baseline issues
      initialScore = 67;
      scanIssues = [
        {
          id: 'gen-sfc',
          category: 'system',
          title: 'Potencjalne naruszenia spójności systemu plików',
          description: 'Ostatnie skanowanie SFC wykazało drobne rozbieżności w plikach magazynu komponentów WinSxS.',
          status: 'warning',
          recommendation: 'Zalecane uruchomienie pełnego skanowania naprawczego za pomocą komendy DISM.',
          command: 'DISM.exe /Online /Cleanup-Image /ScanHealth'
        },
        {
          id: 'gen-uac',
          category: 'security',
          title: 'Zabezpieczenia UAC poniżej zalecanego poziomu',
          description: 'Ustawienia UAC pozwalają aplikacjom na automatyczną eskalację uprawnień bez potwierdzenia hasłem administratora.',
          status: 'warning',
          recommendation: 'Podwyższ poziom zabezpieczeń kontroli konta użytkownika do poziomu najwyższego.',
          command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v PromptOnSecureDesktop /t REG_DWORD /d 1 /f'
        },
        {
          id: 'gen-telemetry',
          category: 'performance',
          title: 'Aktywne zbędne procesy telemetryczne',
          description: 'Wykryto 8 usług telemetrycznych Microsoft i firm trzecich marnujących cykle procesora w tle.',
          status: 'warning',
          recommendation: 'Wyłącz usługi diagnostyczne telemetryczne w celu zwiększenia prywatności i wydajności.',
          command: 'sc config DiagTrack start= disabled && sc stop DiagTrack'
        }
      ];
    }

    // Step-by-step console logs simulation
    let t = 0;
    addLog('Inicjalizacja silnika diagnostycznego WinFix AI...', t += 100);
    addLog('Pobieranie uprawnień administratora NT AUTHORITY\\SYSTEM...', t += 250);
    addLog('Połączono pomyślnie. Wyszukiwanie ścieżek jądra Windows...', t += 150);
    
    addLog('Krok 1/4: Skanowanie rejestru systemowego i plików jądra...', t += 300);
    addLog('Inicjowanie skanera SFC (System File Checker)...', t += 200);
    addLog('Skanowanie struktur C:\\Windows\\System32... 12%', t += 400);
    addLog('Skanowanie struktur C:\\Windows\\System32... 48%', t += 400);
    addLog('Skanowanie struktur C:\\Windows\\System32... 100%', t += 300);
    
    addLog('Krok 2/4: Weryfikacja usług systemowych i modułów aktualizacji...', t += 300);
    addLog('Sprawdzanie statusu usług: wuauserv, bits, cryptsvc, msiserver...', t += 250);
    if (text.includes('update') || text.includes('aktualiz') || text.includes('błąd')) {
      addLog('WYKRYTO BŁĄD: Uszkodzenie bazy SoftwareDistribution lub błąd blokady 0x80070002!', t += 200);
    } else {
      addLog('Usługi Windows Update działają w trybie standardowym.', t += 200);
    }
    
    addLog('Krok 3/4: Audyt bezpieczeństwa i analiza procesów w tle...', t += 400);
    addLog('Inicjowanie weryfikacji sygnatur antywirusowych (Windows Defender)...', t += 300);
    addLog('Pobieranie statusu zapory sieciowej (Windows Defender Firewall)...', t += 200);
    if (text.includes('wirus') || text.includes('defender') || text.includes('bezpieczeństw')) {
      addLog('OSTRZEŻENIE KRYTYCZNE: Silnik antywirusowy wyłączony przez regułę GPO!', t += 150);
      addLog('Wykryto aktywne połączenie na podejrzanym porcie 4444 (nasłuch backdoor).', t += 200);
    } else {
      addLog('Silnik Defender jest aktywny. Zalecane uszczelnienie ustawień zapory.', t += 150);
    }

    addLog('Krok 4/4: Analiza wydajności i obciążenia we/wy (I/O) dysku...', t += 400);
    addLog('Odpytywanie struktury MFT i kolejki wejścia/wyjścia dysku systemowego...', t += 250);
    addLog('Zliczanie wpływu aplikacji startowych na proces rozruchu...', t += 200);
    
    addLog('Analiza zakończona! Generowanie raportu końcowego...', t += 350);

    setTimeout(() => {
      setIssues(scanIssues);
      setHealthScore(initialScore);
      setIsScanning(false);
      setIsScanComplete(true);
      setActiveTab('report');
    }, t + 200);
  };

  const handleFixIssue = (issue: Issue) => {
    setIsFixingId(issue.id);
    setActiveTab('terminal');

    setScanLogs(prev => [
      ...prev,
      `\n-----------------------------------------------------------`,
      `[${new Date().toLocaleTimeString()}] URUCHOMIONO PROCEDURĘ NAPRAWCZĄ DLA: ${issue.title.toUpperCase()}`,
      `[${new Date().toLocaleTimeString()}] Wykonywanie polecenia: ${issue.command}`,
      `-----------------------------------------------------------`
    ]);

    const addLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
      }, delay);
    };

    let t = 100;
    addLog(`Weryfikowanie integralności komponentu docelowego...`, t += 200);
    addLog(`Wykonywanie skryptu naprawczego PowerShell...`, t += 250);
    addLog(`Zatrzymywanie zależnych usług systemowych w tle...`, t += 150);
    addLog(`Modyfikacja gałęzi rejestru: HKEY_LOCAL_MACHINE\\...`, t += 300);
    addLog(`Zwalnianie uchwytów plików (File lock release)...`, t += 200);
    addLog(`Odbudowywanie indeksów bazy danych zabezpieczeń...`, t += 250);
    addLog(`SUKCES: Operacja wykonana pomyślnie. Kod powrotu: [0]`, t += 200);

    setTimeout(() => {
      // Trigger glorious pixel-sparks around the screen!
      if ((window as any).triggerSparks) {
        // Emit explosions in various places or center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        (window as any).triggerSparks(centerX - 100, centerY, 30);
        (window as any).triggerSparks(centerX + 100, centerY, 30);
        (window as any).triggerSparks(centerX, centerY - 100, 30);
        (window as any).triggerSparks(centerX, centerY, 40);
      }

      setIssues(prev => prev.map(iss => {
        if (iss.id === issue.id) {
          return { ...iss, status: 'fixed' };
        }
        return iss;
      }));

      // Dynamically raise health score
      setHealthScore(prev => {
        const remainingUnfixed = issues.filter(iss => iss.id !== issue.id && iss.status !== 'fixed').length;
        if (remainingUnfixed === 0) return 100;
        const add = Math.floor((100 - prev) / (remainingUnfixed + 1));
        return Math.min(98, prev + add);
      });

      setIsFixingId(null);
      setActiveTab('report');
      
      setScanLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] STATUS: ROZWIĄZANO ZAGADNIENIE [${issue.title}]`
      ]);
    }, t + 100);
  };

  const handleFixAll = () => {
    const unfixed = issues.filter(i => i.status !== 'fixed');
    if (unfixed.length === 0) return;

    // Fix them sequentially
    setIsFixingId('all');
    setActiveTab('terminal');

    setScanLogs(prev => [
      ...prev,
      `\n===========================================================`,
      `[${new Date().toLocaleTimeString()}] URUCHOMIONO GLOBALNĄ AUTOMATYCZNĄ NAPRAWĘ SYSTEMU`,
      `===========================================================`
    ]);

    let t = 100;
    unfixed.forEach((issue, index) => {
      setTimeout(() => {
        setScanLogs(prev => [
          ...prev,
          `\n[${new Date().toLocaleTimeString()}] ROZPOCZYNANIE NAPRAWY ${index + 1}/${unfixed.length}: ${issue.title}`,
          `[${new Date().toLocaleTimeString()}] Skrypt: ${issue.command}`
        ]);
      }, t);
      t += 500;
      setTimeout(() => {
        setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Sukces: Naprawiono komponent.`]);
      }, t + 300);
      t += 400;
    });

    setTimeout(() => {
      if ((window as any).triggerSparks) {
        // Massive burst of sparks!
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            (window as any).triggerSparks(
              window.innerWidth * (0.2 + Math.random() * 0.6),
              window.innerHeight * (0.3 + Math.random() * 0.4),
              25
            );
          }, i * 200);
        }
      }

      setIssues(prev => prev.map(i => ({ ...i, status: 'fixed' })));
      setHealthScore(100);
      setIsFixingId(null);
      setActiveTab('report');

      setScanLogs(prev => [
        ...prev,
        `\n[${new Date().toLocaleTimeString()}] GLOBALNA NAPRAWA ZAKOŃCZONA SUKCESEM. Stan systemu: Znakomity (100/100).`
      ]);
    }, t + 300);
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getHealthBarColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500 shadow-emerald-500/30';
    if (score >= 60) return 'bg-amber-500 shadow-amber-500/30';
    return 'bg-rose-500 shadow-rose-500/30';
  };

  return (
    <div className="flex flex-col h-full text-slate-100 font-sans">
      
      {/* Intro Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400">
            <Shield size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-sans tracking-tight text-white flex items-center gap-2">
              WinFix AI <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/10">v2.4 Pro</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Ekspercki system diagnostyki i hardeningu bezpieczeństwa Windows
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Step 1: User description entry (Always visible or in start state) */}
        {!isScanning && !isScanComplete && (
          <div className="space-y-4 max-w-2xl mx-auto py-4">
            <div className="text-center space-y-1.5 max-w-md mx-auto">
              <h3 className="text-sm font-sans font-bold text-slate-200">Jakie anomalie wykazuje Twój komputer?</h3>
              <p className="text-xs text-slate-400">
                Wpisz własnymi słowami opis usterki, problemu z bezpieczeństwem lub błędu, a system ekspercki przeprowadzi celowany audyt jądra.
              </p>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset.id);
                    setDescription(preset.query);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-24 ${
                    selectedPreset === preset.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 hover:border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-900/30 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wide uppercase">
                    {preset.label}
                  </span>
                  <span className="text-[11px] text-slate-400 line-clamp-2 font-sans font-light leading-snug">
                    "{preset.query}"
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Description Textarea */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                  Własny opis problemu (j. polski / angielski)
                </label>
                {description.length > 0 && (
                  <button 
                    onClick={() => { setDescription(''); setSelectedPreset(null); }}
                    className="text-[10px] text-slate-500 hover:text-slate-300 font-mono"
                  >
                    Wyczyść
                  </button>
                )}
              </div>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setSelectedPreset(null);
                }}
                placeholder="Np. Podczas grania komputer restartuje się do niebieskiego ekranu i pisze coś o nvlddmkm.sys..."
                rows={3}
                className="w-full p-3 bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none transition-all resize-none font-sans"
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                id="btn-start-winfix-scan"
                disabled={!description.trim()}
                onClick={() => runDiagnosticScan(description)}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 rounded-xl text-xs font-sans font-extrabold flex items-center gap-2 shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play size={13} className="fill-slate-950" />
                Rozpocznij Analizę Diagnostyczną
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Live Scanning View */}
        {isScanning && (
          <div className="flex flex-col items-center justify-center space-y-6 py-12 max-w-md mx-auto">
            <div className="relative">
              {/* Spinning radial scanner */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-500/20 animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-2 w-16 h-16 rounded-full bg-slate-900 border border-slate-800/80 flex items-center justify-center">
                <RefreshCw size={24} className="text-cyan-400 animate-spin" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xs font-sans font-bold text-slate-200 uppercase tracking-wider">
                Głębokie skanowanie w toku...
              </h3>
              <p className="text-[11px] text-slate-400">
                Weryfikacja podpisów cyfrowych, gałęzi rejestru oraz logów jądra.
              </p>
            </div>

            <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 h-48 overflow-y-auto font-mono text-[10px] text-cyan-500/90 space-y-1 shadow-inner">
              {scanLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed animate-fadeIn">
                  {log}
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          </div>
        )}

        {/* Step 3: Diagnostic Complete Dashboard */}
        {isScanComplete && (
          <div className="space-y-6">
            
            {/* Quick Header Summary */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/20 border border-slate-800">
              
              <div className="flex items-center space-x-4">
                {/* Health Score Circle */}
                <div className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center shadow-lg font-mono ${getHealthColor(healthScore)}`}>
                  <span className="text-xl font-black">{healthScore}</span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-400">Pkt</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                    Stan systemu: {healthScore === 100 ? 'Doskonały' : healthScore >= 70 ? 'Wymaga uwagi' : 'Zagrożony'}
                  </h3>
                  <div className="w-32 sm:w-48 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${getHealthBarColor(healthScore)}`}
                      style={{ width: `${healthScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {issues.some(i => i.status !== 'fixed') && (
                  <button
                    id="btn-fix-all-winfix"
                    onClick={handleFixAll}
                    disabled={isFixingId !== null}
                    className="px-4 py-2 bg-emerald-400 hover:bg-emerald-500 disabled:bg-slate-800 text-slate-950 rounded-xl text-xs font-sans font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/5 transition-all"
                  >
                    <Wrench size={12} /> Napraw Wszystkie Błędy
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsScanComplete(false);
                    setDescription('');
                    setSelectedPreset(null);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs transition-all"
                >
                  Nowy Test
                </button>
              </div>
            </div>

            {/* Diagnostics View Tabs */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab('report')}
                className={`pb-2.5 px-4 text-xs font-sans font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'report' 
                    ? 'border-cyan-500 text-cyan-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity size={13} /> Raport Diagnostyczny ({issues.filter(i => i.status !== 'fixed').length})
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`pb-2.5 px-4 text-xs font-sans font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'security' 
                    ? 'border-cyan-500 text-cyan-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lock size={13} /> Hardening & Zabezpieczenia (Zalecane)
              </button>
              <button
                onClick={() => setActiveTab('terminal')}
                className={`pb-2.5 px-4 text-xs font-sans font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'terminal' 
                    ? 'border-cyan-500 text-cyan-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal size={13} /> Konsola PowerShell / Dziennik
              </button>
            </div>

            {/* TAB CONTENTS */}
            
            {/* 1. REPORT TAB */}
            {activeTab === 'report' && (
              <div className="space-y-4">
                {issues.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900/10 border border-dashed border-slate-800 rounded-2xl">
                    <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-200 font-bold">Brak wykrytych nieprawidłowości!</p>
                    <p className="text-[10px] text-slate-400 mt-1">Wszystkie usługi jądra i pliki bazy danych są całkowicie spójne.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all ${
                          issue.status === 'fixed'
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : issue.status === 'critical'
                            ? 'bg-rose-500/5 border-rose-500/20'
                            : 'bg-amber-500/5 border-amber-500/20'
                        }`}
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-1.5 rounded mt-0.5 ${
                            issue.status === 'fixed'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : issue.status === 'critical'
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {issue.status === 'fixed' ? (
                              <CheckCircle2 size={15} />
                            ) : (
                              <AlertTriangle size={15} />
                            )}
                          </div>

                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-xs font-sans font-bold text-white">
                                {issue.title}
                              </h4>
                              <span className={`text-[9px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded ${
                                issue.status === 'fixed'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : issue.status === 'critical'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}>
                                {issue.status === 'fixed' ? 'Rozwiązano' : issue.status === 'critical' ? 'Krytyczny' : 'Ostrzeżenie'}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500 capitalize bg-slate-950/40 px-1.5 py-0.5 rounded">
                                {issue.category}
                              </span>
                            </div>
                            
                            <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-light">
                              {issue.description}
                            </p>

                            <div className="pt-1.5 flex items-start gap-1 text-[10px] text-slate-400">
                              <span className="font-bold text-cyan-400">Zalecenie:</span>
                              <span className="font-light">{issue.recommendation}</span>
                            </div>
                          </div>
                        </div>

                        {issue.status !== 'fixed' && (
                          <div className="md:self-center flex items-center shrink-0">
                            <button
                              id={`btn-fix-${issue.id}`}
                              disabled={isFixingId !== null}
                              onClick={() => handleFixIssue(issue)}
                              className="w-full md:w-auto px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 text-slate-950 rounded-lg text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                            >
                              {isFixingId === issue.id ? (
                                <>
                                  <RefreshCw size={11} className="animate-spin" /> Naprawianie...
                                </>
                              ) : (
                                <>
                                  <Wrench size={11} /> Napraw teraz
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. SECURITY HARDENING TAB */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl space-y-1.5">
                  <h4 className="text-xs font-sans font-bold text-indigo-400 flex items-center gap-1.5">
                    <ShieldAlert size={14} />
                    Asystent Aktywnego Hardeningu OS
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Podwyższona ochrona jądra systemu zapobiega atakom typu Zero-Day i blokuje wektory złośliwego oprogramowania bezpośrednio w warstwie pamięci podręcznej. Skonfiguruj poniższe zalecenia, aby w pełni zabezpieczyć system.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Security recommendation 1 */}
                  <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex items-start space-x-3.5 hover:border-slate-700/50 transition-all">
                    <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 mt-0.5 shrink-0">
                      <Lock size={15} />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-sans font-bold text-white flex items-center gap-1.5">
                        Izolacja rdzenia (Core Isolation)
                        <span className="text-[8px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">ZALECANE</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                        Włączenie technologii VBS (Virtualization-Based Security) w celu izolowania krytycznych procesów jądra systemu Windows przed bezpośrednim odczytem z RAM-u.
                      </p>
                      <div className="pt-1 flex items-center gap-1.5 text-[10px]">
                        <span className="text-slate-500 font-mono">Status: Bezpieczny (Lokalna weryfikacja)</span>
                      </div>
                    </div>
                  </div>

                  {/* Security recommendation 2 */}
                  <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex items-start space-x-3.5 hover:border-slate-700/50 transition-all">
                    <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 mt-0.5 shrink-0">
                      <Shield size={15} />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-sans font-bold text-white flex items-center gap-1.5">
                        Ochrona przed Ransomware
                        <span className="text-[8px] font-mono bg-cyan-500/20 text-cyan-400 px-1.5 py-0.2 rounded">ZABEZPIECZ</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                        Aktywacja funkcji Controlled Folder Access w celu ścisłej autoryzacji zapisu do katalogów Dokumentów i Pulpitu dla zewnętrznych aplikacji.
                      </p>
                      <button
                        onClick={() => {
                          if ((window as any).triggerSparks) {
                            (window as any).triggerSparks(window.innerWidth/2, window.innerHeight/2, 18);
                          }
                          alert("Włączono ochronę kontrolowanego dostępu do folderów Windows.");
                        }}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 pt-1"
                      >
                        Włącz zabezpieczenie <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>

                  {/* Security recommendation 3 */}
                  <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex items-start space-x-3.5 hover:border-slate-700/50 transition-all">
                    <div className="p-2 rounded bg-purple-500/10 text-purple-400 mt-0.5 shrink-0">
                      <Cpu size={15} />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-sans font-bold text-white flex items-center gap-1.5">
                        Weryfikacja Podpisów WHQL
                        <span className="text-[8px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">ZAPARKOWANE</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                        Blokowanie ładowania sterowników innych niż certyfikowane przez Microsoft Hardware Quality Labs w celu ochrony przed trojanami Rootkit.
                      </p>
                      <div className="pt-1 flex items-center gap-1.5 text-[10px]">
                        <span className="text-emerald-400 font-mono">Aktywne (Weryfikowane przy boocie)</span>
                      </div>
                    </div>
                  </div>

                  {/* Security recommendation 4 */}
                  <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex items-start space-x-3.5 hover:border-slate-700/50 transition-all">
                    <div className="p-2 rounded bg-amber-500/10 text-amber-400 mt-0.5 shrink-0">
                      <Eye size={15} />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-sans font-bold text-white flex items-center gap-1.5">
                        Lokalna Zapora Sieciowa (Firewall)
                        <span className="text-[8px] font-mono bg-cyan-500/20 text-cyan-400 px-1.5 py-0.2 rounded">ZABEZPIECZ</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                        Zamknięcie nieużywanych portów RPC, NetBIOS i SMB w celach ochronnych przed skanerami podatności WAN.
                      </p>
                      <button
                        onClick={() => {
                          if ((window as any).triggerSparks) {
                            (window as any).triggerSparks(window.innerWidth/2, window.innerHeight/2, 18);
                          }
                          alert("Wszystkie podatne porty RPC/SMB zostały przefiltrowane lokalnie.");
                        }}
                        className="text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 pt-1"
                      >
                        Wykonaj czyszczenie portów <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 3. TERMINAL TAB */}
            {activeTab === 'terminal' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-slate-950 px-4 py-2 border border-slate-800 rounded-t-xl text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Terminal size={12} className="text-cyan-400" />
                    <span>PowerShell - System Diagnostics Administrator (NT AUTHORITY\\SYSTEM)</span>
                  </div>
                  <span className="text-rose-500 animate-pulse">● LIVE CONSOLE</span>
                </div>
                <div className="bg-slate-950 border-x border-b border-slate-800 rounded-b-xl p-4 h-80 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-1.5 shadow-inner">
                  {scanLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed whitespace-pre-wrap font-mono">
                      {log.startsWith('---') || log.startsWith('===') ? (
                        <span className="text-slate-500">{log}</span>
                      ) : log.includes('SUKCES') || log.includes('STATUS: ROZWIĄZANO') || log.includes('GLOBALNA NAPRAWA ZAKOŃCZONA') ? (
                        <span className="text-emerald-400 font-bold">{log}</span>
                      ) : log.includes('OSTRZEŻENIE') || log.includes('WYKRYTO BŁĄD') || log.includes('KRYTYCZNY') ? (
                        <span className="text-rose-400 font-bold">{log}</span>
                      ) : (
                        log
                      )}
                    </div>
                  ))}
                  <div ref={consoleEndRef} />
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
