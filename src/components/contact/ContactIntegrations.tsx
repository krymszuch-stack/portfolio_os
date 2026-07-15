import React from 'react';
import { MessageSquare } from 'lucide-react';
import { OSConfig } from '../../types';

interface ContactIntegrationsProps {
  config?: OSConfig;
  setConfig?: React.Dispatch<React.SetStateAction<OSConfig>>;
  googleUser: { displayName: string | null; email: string | null } | null;
  msUser: { displayName: string | null; email: string | null } | null;
  authError: string | null;
  onConnectGoogle: () => void;
  onDisconnectGoogle: () => void;
  onConnectMicrosoft: () => void;
  onDisconnectMicrosoft: () => void;
}

export const ContactIntegrations: React.FC<ContactIntegrationsProps> = ({
  config,
  setConfig,
  googleUser,
  msUser,
  authError,
  onConnectGoogle,
  onDisconnectGoogle,
  onConnectMicrosoft,
  onDisconnectMicrosoft
}) => {
  return (
    <>
      {/* Intro info box */}
      <div className="p-4 rounded-xl bg-slate-900/30 border border-white/10/80 flex items-start gap-3 relative overflow-hidden">
        <MessageSquare className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
            Napisz bezpośrednio lub połącz się społecznościowo
          </h4>
          <p className="text-xs text-slate-400 leading-normal">
            Skorzystaj z formularza poniżej, aby wysłać bezpośrednią wiadomość (obsługujemy wysyłkę przez Microsoft Graph, Google Gmail API lub bezpieczną bramkę demonstracyjną), bądź napisz na mediach społecznościowych.
          </p>
        </div>
      </div>

      {/* Integracja Pocztowa Panel */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-white/10/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[9px] text-amber-400 font-mono uppercase tracking-widest font-bold">USTAWIENIA INTEGRACJI POCZTOWEJ</span>
            <h4 className="text-xs font-sans font-bold text-slate-200">Metoda dostarczania wiadomości z portfolio</h4>
          </div>
          <span className="self-start sm:self-auto px-2 py-0.5 text-[8px] font-mono rounded backdrop-blur-md bg-slate-900/60 text-slate-300 uppercase tracking-widest">
            STATUS: {config?.emailProvider === 'google' ? 'GOOGLE API' : config?.emailProvider === 'microsoft' ? 'MS GRAPH API' : 'SIMULATED SMTP'}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 leading-normal">
          Umożliwia wysyłanie wiadomości wpisanych w formularz poniżej bezpośrednio na Twoją skrzynkę e-mail. 
          Wybierz dostawcę i zaloguj się, aby połączyć integrację:
        </p>

        {authError && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono">
            ✦ {authError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Option 1: Simulated SMTP */}
          <button
            onClick={() => {
              if (setConfig) setConfig(prev => ({ ...prev, emailProvider: 'smtp' }));
            }}
            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer ${
              (config?.emailProvider || 'smtp') === 'smtp'
                ? 'bg-amber-500/10 border-amber-500/80 text-white shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                : 'bg-slate-900/40 border-white/10 hover:border-white/10 text-slate-400'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs">🤖</span>
                <span className="text-xs font-sans font-bold">Bramka SMTP (MOCK)</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Symulacja wysyłki SMTP z animowanym statusem. Brak wymagań logowania.
              </p>
            </div>
            <span className="mt-2 text-[8px] font-mono uppercase text-amber-400 font-bold">Domyślna (Demo)</span>
          </button>

          {/* Option 2: Google Gmail API */}
          <div
            className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
              config?.emailProvider === 'google'
                ? 'bg-blue-500/10 border-blue-500/80 text-white shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                : 'bg-slate-900/40 border-white/10 text-slate-400'
            }`}
          >
            <div>
              <button
                onClick={() => {
                  if (setConfig) setConfig(prev => ({ ...prev, emailProvider: 'google' }));
                }}
                className="w-full text-left cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <svg className="w-3.5 h-3.5 fill-current text-blue-400" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.71 0 3.275.614 4.5 1.737l2.4-2.4C17.385 1.578 14.97-.035 12.24-.035c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.83 0 10.51-4.14 10.51-11 0-.675-.075-1.35-.225-1.995h-10.29z"/>
                  </svg>
                  <span className="text-xs font-sans font-bold ml-1">Google Gmail API</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Wysyła prawdziwą wiadomość przez Google API na Twój adres Gmail.
                </p>
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-850 flex justify-between items-center">
              {googleUser ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[9px] text-emerald-400 truncate max-w-[100px] font-mono animate-pulse" title={googleUser.email || ''}>
                    ● {googleUser.displayName || googleUser.email}
                  </span>
                  <button
                    onClick={onDisconnectGoogle}
                    className="text-[9px] text-rose-400 hover:text-rose-300 font-mono underline cursor-pointer"
                  >
                    Rozłącz
                  </button>
                </div>
              ) : (
                <button
                  onClick={onConnectGoogle}
                  className="w-full py-1 text-center bg-blue-600 hover:bg-blue-700 text-[10px] font-sans font-bold text-white rounded cursor-pointer transition-colors"
                >
                  Połącz z Google
                </button>
              )}
            </div>
          </div>

          {/* Option 3: Microsoft Graph API */}
          <div
            className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
              config?.emailProvider === 'microsoft'
                ? 'bg-sky-500/10 border-sky-500/80 text-white shadow-[0_0_12px_rgba(14,165,233,0.15)]'
                : 'bg-slate-900/40 border-white/10 text-slate-400'
            }`}
          >
            <div>
              <button
                onClick={() => {
                  if (setConfig) setConfig(prev => ({ ...prev, emailProvider: 'microsoft' }));
                }}
                className="w-full text-left cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <svg className="w-3.5 h-3.5 fill-current text-sky-400" viewBox="0 0 23 23">
                    <path d="M11.5 0H0v11.5h11.5V0zm11.5 0H11.5v11.5H23V0zM11.5 11.5H0V23h11.5V11.5zm11.5 0H11.5V23H23V11.5z"/>
                  </svg>
                  <span className="text-xs font-sans font-bold ml-1">Microsoft Graph API</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Wysyła prawdziwą wiadomość przez Outlook na Twój adres Microsoft.
                </p>
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-850 flex justify-between items-center">
              {msUser ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[9px] text-emerald-400 truncate max-w-[100px] font-mono animate-pulse" title={msUser.email || ''}>
                    ● {msUser.displayName || msUser.email}
                  </span>
                  <button
                    onClick={onDisconnectMicrosoft}
                    className="text-[9px] text-rose-400 hover:text-rose-300 font-mono underline cursor-pointer"
                  >
                    Rozłącz
                  </button>
                </div>
              ) : (
                <button
                  onClick={onConnectMicrosoft}
                  className="w-full py-1 text-center bg-sky-600 hover:bg-sky-700 text-[10px] font-sans font-bold text-white rounded cursor-pointer transition-colors"
                >
                  Połącz z Microsoft
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
