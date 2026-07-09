import React from 'react';
import { Cpu, FileText, Loader2, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { OSConfig } from '../../types';

interface SettingsIntegrationsProps {
  localConfig: OSConfig;
  setLocalConfig: (config: OSConfig) => void;
  googleUser: { displayName: string | null; email: string | null } | null;
  handleConnectGoogle: () => void;
  handleDisconnectGoogle: () => void;
  isMicrosoftConfigured: boolean;
  accounts: any[];
  handleConnectMicrosoft: () => void;
  handleDisconnectMicrosoft: () => void;
  gitHubSyncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncTime: string | null;
  handleForceSyncGitHub: () => void;
  cvText: string;
  setCvText: (val: string) => void;
  cvFile: File | null;
  setCvFile: (file: File | null) => void;
  parsingLoading: boolean;
  parseError: string | null;
  parseSuccess: boolean;
  handleParseCV: () => void;
}

export const SettingsIntegrations: React.FC<SettingsIntegrationsProps> = ({
  localConfig,
  setLocalConfig,
  googleUser,
  handleConnectGoogle,
  handleDisconnectGoogle,
  isMicrosoftConfigured,
  accounts,
  handleConnectMicrosoft,
  handleDisconnectMicrosoft,
  gitHubSyncStatus,
  lastSyncTime,
  handleForceSyncGitHub,
  cvText,
  setCvText,
  cvFile,
  setCvFile,
  parsingLoading,
  parseError,
  parseSuccess,
  handleParseCV
}) => {
  return (
    <>
      {/* 4.5. Integracje Chmurowe i Konta (Google & Microsoft) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-black border-l-4 border-blue-600 pl-2 uppercase">4.5. Integracje Chmurowe i Konta</h3>
        <p className="text-[0.7rem] text-gray-500 font-bold uppercase leading-relaxed">
          Połącz i autoryzuj swoje konta chmurowe, aby umożliwić integrację z Google Drive, Kalendarzem lub bezpiecznym dostarczaniem maili (Gmail/Outlook).
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F5F5F5] p-3 border-2 border-black rounded">
          {/* Połączenie Google */}
          <div className="p-2 p-2.5 bg-white border border-gray-300 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">🔵</span>
                <span className="text-xs font-bold text-gray-800 uppercase">Google Workspace</span>
              </div>
              <p className="text-[0.65rem] text-gray-500 font-medium leading-normal mb-2 uppercase font-semibold">
                Wymagane do działania Kalendarza, Dysku Google (Drive) i wysyłki e-maili przez Gmail API.
              </p>
            </div>

            <div className="pt-2 border-t border-gray-150 flex items-center justify-between">
              {googleUser ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[0.65rem] font-bold text-emerald-600 truncate max-w-[120px]" title={googleUser.email || ''}>
                    ● {googleUser.displayName || googleUser.email}
                  </span>
                  <button
                    onClick={handleDisconnectGoogle}
                    className="text-[0.65rem] font-bold text-red-600 hover:underline cursor-pointer min-h-[44px]"
                  >
                    Rozłącz
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectGoogle}
                  className="w-full py-1 text-center bg-blue-600 hover:bg-blue-700 text-[0.65rem] font-bold text-white rounded cursor-pointer transition-colors uppercase min-h-[44px]"
                >
                  Połącz z Google
                </button>
              )}
            </div>
          </div>

          {/* Połączenie Microsoft */}
          <div className="p-2 p-2.5 bg-white border border-gray-300 rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">🔷</span>
                <span className="text-xs font-bold text-gray-800 uppercase">Microsoft Live AD</span>
              </div>
              <p className="text-[0.65rem] text-gray-500 font-medium leading-normal mb-2 uppercase font-semibold">
                Umożliwia pełną integrację konta Microsoft, wysyłanie e-maili przez Microsoft Graph API i synchronizację.
              </p>
            </div>

            <div className="pt-2 border-t border-gray-150 flex items-center justify-between">
              {!isMicrosoftConfigured ? (
                <div className="w-full text-center py-1.5 bg-red-50 border border-red-200 text-red-600 text-[0.65rem] font-bold rounded uppercase leading-normal px-1">
                  Logowanie Microsoft niedostępne — brak konfiguracji
                </div>
              ) : accounts.length > 0 ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[0.65rem] font-bold text-emerald-600 truncate max-w-[120px]" title={accounts[0].username}>
                    ● {accounts[0].name || accounts[0].username}
                  </span>
                  <button
                    onClick={handleDisconnectMicrosoft}
                    className="text-[0.65rem] font-bold text-red-600 hover:underline cursor-pointer min-h-[44px]"
                  >
                    Rozłącz
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectMicrosoft}
                  className="w-full py-1 text-center bg-sky-600 hover:bg-sky-700 text-[0.65rem] font-bold text-white rounded cursor-pointer transition-colors uppercase min-h-[44px]"
                >
                  Połącz z Microsoft
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Wybór domyślnego dostawcy poczty */}
        <div className="p-2 p-2.5 bg-[#F5F5F5] border-2 border-black rounded flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-blue-900 uppercase">Dostawca Poczty Formularza:</span>
            <p className="text-[0.65rem] text-gray-500 font-semibold uppercase leading-tight">
              Wybierz, który protokół ma obsługiwać Twój formularz kontaktowy.
            </p>
          </div>
          <select
            value={localConfig.emailProvider || 'smtp'}
            onChange={(e) => setLocalConfig({ ...localConfig, emailProvider: e.target.value as any })}
            className="p-1.5 bg-white border-2 border-black rounded text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="smtp">Symulowany SMTP (Bramka Demo)</option>
            <option value="google" disabled={!googleUser}>Gmail API (Google) {!googleUser ? '(Zablokowane)' : ''}</option>
            <option value="microsoft" disabled={!isMicrosoftConfigured || accounts.length === 0}>
              {!isMicrosoftConfigured 
                ? 'Outlook Graph (Niedostępne - brak konfiguracji)' 
                : accounts.length === 0 
                  ? 'Outlook Graph (Microsoft) (Zablokowane)' 
                  : 'Outlook Graph (Microsoft)'}
            </option>
          </select>
        </div>
      </div>

      {/* 4.6. Synchronizacja GitHub (Status & Manual Sync) */}
      <div className="space-y-3 bg-amber-50/20 border border-amber-300 p-3.5 rounded shadow-[1px_1px_0px_black]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-600 font-bold">🐙</span>
            <h3 className="text-sm font-bold text-black uppercase">4.6. Status Synchronizacji GitHub</h3>
          </div>
          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
            gitHubSyncStatus === 'syncing' 
              ? 'bg-yellow-100 border-yellow-400 text-yellow-700 animate-pulse'
              : gitHubSyncStatus === 'success'
                ? 'bg-emerald-100 border-emerald-400 text-emerald-700'
                : gitHubSyncStatus === 'error'
                  ? 'bg-rose-100 border-rose-400 text-rose-700'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
          }`}>
            {gitHubSyncStatus === 'syncing' && 'Trwa synchronizacja...'}
            {gitHubSyncStatus === 'success' && 'Zsynchronizowano'}
            {gitHubSyncStatus === 'error' && 'Błąd połączenia'}
            {gitHubSyncStatus === 'idle' && 'Bezczynny'}
          </span>
        </div>

        <p className="text-[0.7rem] text-gray-500 font-bold uppercase leading-relaxed text-left">
          Monitoruj oraz wymuś pobieranie aktualnych statystyk i liczby gwiazdek (Stars) Twoich repozytoriów zintegrowanych jako aplikacja Projekty.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-amber-200/50">
          <div className="text-[10px] font-mono text-gray-600 uppercase font-bold">
            Ostatnia udana synchronizacja: <span className="text-amber-700">{lastSyncTime || 'Nigdy (wymagane odświeżenie)'}</span>
          </div>
          <button
            onClick={handleForceSyncGitHub}
            disabled={gitHubSyncStatus === 'syncing'}
            className="px-3.5 py-1.5 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 text-slate-950 disabled:text-gray-400 font-sans font-bold text-xs rounded border border-black cursor-pointer transition-all uppercase select-none min-h-[44px]"
          >
            <RefreshCw size={12} className={gitHubSyncStatus === 'syncing' ? 'animate-spin' : ''} />
            <span>Wymuś Odświeżenie (Force Sync)</span>
          </button>
        </div>
      </div>

      {/* 4.8. Import Profilu CV / LinkedIn (Kompilator AI & OCR) */}
      <div className="space-y-3.5 bg-[#fdfaf7] border border-orange-300 p-3.5 rounded shadow-[1px_1px_0px_black]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="text-orange-600 w-4 h-4" />
            <h3 className="text-sm font-bold text-black uppercase">4.8. Kompilator AI CV / LinkedIn z OCR</h3>
          </div>
          <span className="text-[9px] bg-orange-100 border border-orange-200 text-orange-700 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
            Powered by Gemini AI
          </span>
        </div>

        <p className="text-[0.7rem] text-gray-500 font-bold uppercase leading-relaxed text-left">
          Prześlij swój plik CV (PDF, PNG, JPG) lub wklej profil LinkedIn. Zaawansowane modele Gemini przeprowadzą automatyczną ekstrakcję danych (w tym proces OCR dla skanów) oraz dopasują je inteligentnie do zmiennych PortfolioOS wraz z przypisaniem synonimów umiejętności.
        </p>

        <div className="space-y-2.5">
          {/* Paste profile text */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-600 font-bold uppercase block text-left">Wklej tekst profilu LinkedIn / CV:</label>
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Wklej tutaj surowy tekst profilu zawodowego lub CV..."
              rows={3}
              className="w-full p-2 min-h-[44px] bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* PDF/Image File Upload with custom styles */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-600 font-bold uppercase block text-left">LUB prześlij dokument CV (PDF, Obraz):</label>
            <div className="border border-dashed border-gray-300 rounded p-2 bg-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="text-gray-400 w-4 h-4" />
                <span className="text-xs font-semibold text-gray-600 truncate max-w-[180px]">
                  {cvFile ? `${cvFile.name} (${Math.round(cvFile.size / 1024)} KB)` : 'Nie wybrano pliku (Formaty: pdf, png, jpg)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {cvFile && (
                  <button
                    onClick={() => setCvFile(null)}
                    className="text-[10px] font-bold text-red-500 hover:underline px-1.5 cursor-pointer"
                  >
                    Usuń
                  </button>
                )}
                <label className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-350 text-[10px] font-bold rounded cursor-pointer transition-colors uppercase">
                  Wybierz Plik
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setCvFile(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Feedback alerts */}
          {parseError && (
            <div className="p-2 min-h-[44px] bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded flex items-start gap-1.5">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{parseError}</span>
            </div>
          )}

          {parseSuccess && (
            <div className="p-2 min-h-[44px] bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded flex items-start gap-1.5">
              <Check size={14} className="shrink-0 mt-0.5" />
              <span>Kompilacja i import zakończone sukcesem! Twoje Bio, Projekty i inne sekcje zostały natychmiastowo zaktualizowane o wykryte atrybuty.</span>
            </div>
          )}

          {/* Parse button */}
          <button
            onClick={handleParseCV}
            disabled={parsingLoading || (!cvText.trim() && !cvFile)}
            className="w-full py-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-200 disabled:to-gray-200 text-white disabled:text-gray-400 font-sans font-extrabold text-xs rounded border border-black cursor-pointer transition-all uppercase select-none tracking-wider shadow-[0_2px_4px_rgba(249,115,22,0.2)] min-h-[44px]"
          >
            {parsingLoading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>URUCHAMIANIE KOMPILATORA AI (OCR + Analiza)...</span>
              </>
            ) : (
              <>
                <Cpu size={13} />
                <span>Kompiluj i Zaimplementuj Dane (AI Import)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
