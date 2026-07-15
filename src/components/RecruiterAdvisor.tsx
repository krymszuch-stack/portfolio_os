/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Project, Certificate, TimelineItem, OSConfig } from '../types';

interface RecruiterAdvisorProps {
  config: OSConfig;
  projects: Project[];
  certificates: Certificate[];
  timeline: TimelineItem[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const getAccent = (accentColor: string) => {
  const map: Record<string, { border: string; text: string; bg: string; buttonBg: string; buttonHover: string; bubbleUser: string; bubbleModel: string }> = {
    purple: {
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      bg: 'bg-purple-950/20',
      buttonBg: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-700',
      bubbleUser: 'bg-purple-600 text-white',
      bubbleModel: 'bg-white/5 border-purple-500/10 text-slate-100'
    },
    cyan: {
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      bg: 'bg-cyan-950/20',
      buttonBg: 'bg-cyan-600',
      buttonHover: 'hover:bg-cyan-700',
      bubbleUser: 'bg-cyan-600 text-white',
      bubbleModel: 'bg-white/5 border-cyan-500/10 text-slate-100'
    },
    orange: {
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      bg: 'bg-orange-950/20',
      buttonBg: 'bg-orange-600',
      buttonHover: 'hover:bg-orange-700',
      bubbleUser: 'bg-orange-600 text-white',
      bubbleModel: 'bg-white/5 border-orange-500/10 text-slate-100'
    },
    emerald: {
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/20',
      buttonBg: 'bg-emerald-600',
      buttonHover: 'hover:bg-emerald-700',
      bubbleUser: 'bg-emerald-600 text-white',
      bubbleModel: 'bg-white/5 border-emerald-500/10 text-slate-100'
    },
    'amber-retro': {
      border: 'border-yellow-500/40',
      text: 'text-yellow-400',
      bg: 'bg-yellow-950/20',
      buttonBg: 'bg-yellow-600',
      buttonHover: 'hover:bg-yellow-700',
      bubbleUser: 'bg-yellow-600 text-black font-bold',
      bubbleModel: 'bg-white/5 border-yellow-500/20 text-yellow-100'
    },
    'mono-terminal': {
      border: 'border-green-500/40',
      text: 'text-green-400',
      bg: 'bg-green-950/20',
      buttonBg: 'bg-green-600',
      buttonHover: 'hover:bg-green-700',
      bubbleUser: 'bg-green-600 text-black font-bold',
      bubbleModel: 'bg-white/5 border-green-500/20 text-green-100 font-mono'
    },
    'black-gold': {
      border: 'border-amber-500/80',
      text: 'text-amber-400',
      bg: 'bg-amber-950/10',
      buttonBg: 'bg-amber-500',
      buttonHover: 'hover:bg-amber-600',
      bubbleUser: 'bg-amber-500 text-black font-bold',
      bubbleModel: 'bg-black border-amber-500/30 text-amber-100'
    },
    'white-clean': {
      border: 'border-slate-300',
      text: 'text-slate-700',
      bg: 'bg-slate-50',
      buttonBg: 'bg-slate-800',
      buttonHover: 'hover:bg-slate-900',
      bubbleUser: 'bg-slate-800 text-white',
      bubbleModel: 'bg-slate-100 border-slate-200 text-slate-800'
    }
  };
  return map[accentColor] || map.purple;
};

const SUGGESTED_QUERIES = [
  'Jakie są najmocniejsze strony kandydata?',
  'Czy kandydat posiada doświadczenie komercyjne?',
  'W jakich projektach odegrał kluczową rolę?',
  'Zweryfikuj znajomość głównych technologii.'
];

export const RecruiterAdvisor: React.FC<RecruiterAdvisorProps> = ({ config, projects, certificates, timeline }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const accent = getAccent(config.accentColor || 'purple');
  const isWhiteClean = config.accentColor === 'white-clean';
  const isBlackGold = config.accentColor === 'black-gold';

  const candidateName = config.fullName || config.portfolioName || 'Adrian';

  // Add initial message on load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: `Witaj! Jestem Wirtualnym Doradcą Rekrutera dla kandydata o imieniu ${candidateName}. Pomogę Ci sprawdzić, przeanalizować i zweryfikować jego doświadczenie, projekty oraz dopasowanie do Twoich wymagań. O co chcesz zapytać?`
        }
      ]);
    }
  }, [candidateName, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/recruiter-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portfolioData: { config, projects, certificates, timeline },
          query: textToSend,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Nie udało się połączyć z Doradcą AI. Upewnij się, że klucz API jest skonfigurowany.');
      }

      const data = await response.json();
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply || 'Nie otrzymałem poprawnej odpowiedzi.'
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      setError(err.message || 'Wystąpił nieznany błąd.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerBg = isWhiteClean
    ? 'bg-white border-slate-200 shadow-2xl'
    : isBlackGold
      ? 'bg-black/95 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.15)]'
      : 'bg-slate-950/85 backdrop-blur-2xl border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]';

  const titleColor = isWhiteClean ? 'text-slate-800' : 'text-white';
  const subtextColor = isWhiteClean ? 'text-slate-500' : 'text-white/60';

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <div className="fixed bottom-24 right-6 md:bottom-28 md:right-8 z-[200]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-4.5 py-3 rounded-full border shadow-2xl transition-all cursor-pointer ${
            isWhiteClean
              ? 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
              : isBlackGold
                ? 'bg-black border-amber-500/70 text-amber-400 hover:border-amber-400'
                : `bg-[#0e111a]/95 backdrop-blur-md ${accent.border} ${accent.text} hover:bg-[#161b2a]`
          }`}
        >
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-xs font-bold font-sans uppercase tracking-wider">Doradca Rekrutera AI</span>
          <MessageSquare size={16} />
        </motion.button>
      </div>

      {/* Slide-out Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[300] flex justify-end pointer-events-none">
            {/* Click-outside backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            />

            {/* Sidebar container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className={`w-full max-w-md h-full flex flex-col pointer-events-auto border-l ${containerBg}`}
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${accent.bg}`}>
                    <Sparkles size={16} className={accent.text} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${titleColor}`}>Weryfikacja Profilu</h3>
                    <p className={`text-[10px] uppercase font-bold tracking-wide ${subtextColor}`}>Doradca Rekrutera AI</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer ${subtextColor}`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed border ${
                        msg.role === 'user' ? accent.bubbleUser : accent.bubbleModel
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 py-2">
                    <RefreshCw size={12} className="animate-spin" />
                    <span>Doradca analizuje profil kandydata...</span>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Błąd weryfikacji</p>
                      <p className="mt-0.5 leading-relaxed">{error}</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length <= 1 && !isLoading && (
                <div className="px-5 pb-3 shrink-0">
                  <p className={`text-[9px] uppercase font-bold tracking-wider mb-2 ${subtextColor}`}>Szybkie pytania weryfikacyjne:</p>
                  <div className="flex flex-col gap-1.5">
                    {SUGGESTED_QUERIES.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className={`w-full text-left px-3 py-2 rounded-xl border text-[11px] font-sans font-medium transition-all cursor-pointer ${
                          isWhiteClean
                            ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(query);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Zadaj pytanie o umiejętności lub projekty..."
                    className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-sans focus:outline-none focus:ring-1 ${
                      isWhiteClean
                        ? 'bg-slate-100 focus:ring-slate-300 text-slate-800'
                        : isBlackGold
                          ? 'bg-black border border-amber-500/50 focus:ring-amber-500 text-amber-100'
                          : 'bg-white/5 border border-white/10 focus:ring-white/20 text-white'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${accent.buttonBg} ${accent.buttonHover} text-white cursor-pointer`}
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
