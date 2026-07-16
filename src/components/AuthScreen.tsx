import React, { useState } from 'react';
import { googleSignIn } from '../lib/googleAuth';
import { loginMicrosoft } from '../lib/microsoftAuth';
import { Sparkles, LogIn, Monitor, Cloud, Shield, ChevronRight, HelpCircle } from 'lucide-react';

interface AuthScreenProps {
  onContinueGuest: () => void;
}

export function AuthScreen({ onContinueGuest }: AuthScreenProps) {
  const [loading, setLoading] = useState<'google' | 'microsoft' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading('google');
      setError(null);
      await googleSignIn();
    } catch (err: any) {
      console.error('Google login failed:', err);
      if (err?.code === 'auth/unauthorized-domain') { setError('Błąd Google: Domena nie jest autoryzowana w Firebase (dodaj ją w Firebase Console).'); } else { setError('Logowanie Google nie powiodło się. Spróbuj ponownie.'); }
    } finally {
      setLoading(null);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      setLoading('microsoft');
      setError(null);
      await loginMicrosoft();
    } catch (err: any) {
      console.error('Microsoft login failed:', err);
      if (err?.name === 'BrowserAuthError') { setError('Błąd Microsoft: ' + err.message); } else { setError('Logowanie Microsoft AD nie powiodło się. Spróbuj ponownie.'); }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-y-auto bg-[#050507] text-[#e0e0e0] flex flex-col items-center justify-center p-4 md:p-8"
      style={{ background: 'radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.08) 0%, transparent 60%), #050507' }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Central Panel */}
      <div className="w-full max-w-lg bg-slate-950/50 border-2 border-amber-500/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 mb-1">
            <Monitor size={28} className="animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-[10px] tracking-widest text-amber-500 uppercase font-bold block mb-1">
              SYSTEM PORTFOLIOOS v1.0.4 // INICJALIZACJA
            </span>
            <h1 className="text-xl md:text-2xl font-sans font-black text-white tracking-tight uppercase">
              Zarządzanie Tożsamością
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed uppercase font-semibold">
            Wybierz metodę autoryzacji, aby wczytać swoje portfolio z chmury lub kontynuować lokalnie w pamięci przeglądarki.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/30 rounded text-xs text-red-400 font-mono text-center uppercase tracking-wide">
            [BŁĄD SYSTEMU]: {error}
          </div>
        )}

        {/* Auth Actions */}
        <div className="space-y-3">
          {/* Google Auth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading !== null}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase rounded-xl flex items-center justify-between transition-all border border-transparent hover:border-amber-500 cursor-pointer shadow-lg"
          >
            <span className="flex items-center gap-3">
              <span className="text-base">🔴</span>
              {loading === 'google' ? 'ŁĄCZENIE Z SERWEREM GOOGLE...' : 'ZALOGUJ PRZEZ GOOGLE'}
            </span>
            <ChevronRight size={14} />
          </button>

          {/* Microsoft Auth Button */}
          <button
            onClick={handleMicrosoftLogin}
            disabled={loading !== null}
            className="w-full py-3 px-4 bg-sky-900 hover:bg-sky-800 disabled:opacity-50 text-white text-xs font-mono font-bold tracking-wider uppercase rounded-xl flex items-center justify-between transition-all border border-transparent hover:border-amber-500 cursor-pointer shadow-lg"
          >
            <span className="flex items-center gap-3">
              <span className="text-base">🔷</span>
              {loading === 'microsoft' ? 'AUTORYZACJA MICROSOFT...' : 'ZALOGUJ PRZEZ MICROSOFT LIVE'}
            </span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Separator line */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest">LUB</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Guest Action */}
        <div className="text-center">
          <button
            onClick={onContinueGuest}
            disabled={loading !== null}
            className="text-xs font-mono font-bold text-amber-500 hover:text-amber-400 hover:underline tracking-wider uppercase cursor-pointer"
          >
            &gt; KONTYNUUJ BEZ LOGOWANIA (ZAPISZ LOKALNIE)
          </button>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mt-2">
            Dane zostaną zapisane w localStorage. Niektóre funkcje integracji mogą być ograniczone.
          </p>
        </div>

        {/* Footer info/details */}
        <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono tracking-wider">
          <span className="flex items-center gap-1">
            <Shield size={12} className="text-emerald-500/60" /> BEZPIECZNE POŁĄCZENIE
          </span>
          <span className="flex items-center gap-1">
            <Cloud size={12} className="text-blue-500/60" /> AUTO-SYNC CLOUD
          </span>
        </div>

      </div>

      {/* Side Help banner or info */}
      <div className="mt-6 text-center text-[10px] text-slate-600 font-mono uppercase tracking-widest select-none pointer-events-none">
        <HelpCircle size={14} className="inline mr-1 text-slate-500" />
        Logowanie pozwala na podgląd i edycję z dowolnego urządzenia.
      </div>
    </div>
  );
}
