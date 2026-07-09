import React, { useState, useEffect } from 'react';
import { OSConfig, InboxMessage } from '../../types';
import * as Lucide from 'lucide-react';

export const ClockWidgetComponent: React.FC<{ config: OSConfig }> = ({ config }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hrs = time.getHours();
  const mins = time.getMinutes();
  const secs = time.getSeconds();
  
  const hStr = hrs.toString().padStart(2, '0');
  const mStr = mins.toString().padStart(2, '0');
  const sStr = secs.toString().padStart(2, '0');

  const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  const dayStr = days[time.getDay()];

  return (
    <div className="flex flex-col h-full justify-between select-none font-mono p-1">
      <div className="flex justify-between items-center pb-2 border-b border-white/10">
        <span className="text-xs font-bold text-white/45 uppercase tracking-wider">{dayStr}</span>
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
      </div>
      <div className="flex-grow flex items-center justify-center py-4">
        <div className="text-4xl font-extrabold text-white flex items-baseline tracking-widest gap-1 bg-black/35 py-3 px-6 rounded-2xl border border-white/5 shadow-inner">
          <span>{hStr}</span>
          <span className="animate-pulse text-cyan-400">:</span>
          <span>{mStr}</span>
          <span className="text-lg text-white/40 ml-2 font-medium">{sStr}</span>
        </div>
      </div>
    </div>
  );
};

export const NoteWidgetComponent: React.FC<{ iconId: string }> = ({ iconId }) => {
  const [noteText, setNoteText] = useState(() => localStorage.getItem(`note-${iconId}`) || '');
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteText(e.target.value);
    localStorage.setItem(`note-${iconId}`, e.target.value);
  };
  return (
    <div className="flex flex-col h-full w-full justify-between gap-2.5 p-1">
      <span className="text-xs font-bold text-white/45 uppercase font-mono tracking-wider">Moje Notatki</span>
      <textarea
        value={noteText}
        onChange={handleChange}
        placeholder="Napisz coś..."
        className="w-full flex-grow bg-black/45 text-white/90 text-xs p-3 focus:outline-none resize-none font-sans rounded-2xl border border-white/5 shadow-inner custom-scrollbar"
      />
    </div>
  );
};

export const renderIcon = (name: string, className = '') => {
  const IconComponent = (Lucide as any)[name];
  return IconComponent ? <IconComponent className={className} /> : <Lucide.Folder className={className} />;
};

export const getIconStyleClasses = (config: OSConfig, isWiggling: boolean) => {
  if (isWiggling) {
    return {
      container: 'bg-purple-500/20 border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] rounded-[22px]',
      icon: 'text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]',
      text: 'text-purple-300 font-bold bg-purple-900/50 px-2 py-0.5 rounded-full border border-purple-500/30 backdrop-blur-sm'
    };
  } else {
    switch (config.portfolioStyle) {
      case 'lumine-ubuntu-style':
        return {
          container: 'bg-gradient-to-br from-[#5e2750]/70 to-[#2c001e]/60 border border-[#77216f] shadow-[0_0_20px_rgba(119,33,111,0.4)] rounded-[22px] text-purple-200',
          icon: 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]',
          text: 'text-purple-100 group-hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-semibold text-[13px] mt-4 tracking-wide'
        };
      case 'retro':
        return {
          container: 'bg-[#C0C0C0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-[1px_1px_0px_black] rounded-none text-black',
          icon: 'text-black',
          text: 'text-black font-mono font-bold text-[10px] bg-[#C0C0C0] px-1 border border-black/20 mt-1'
        };
      case 'lumine-neon-cyan':
        return {
          container: 'bg-cyan-950/45 border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.45)] rounded-[22px] text-cyan-300',
          icon: 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]',
          text: 'text-cyan-300/80 group-hover:text-cyan-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
        };
      case 'lumine-cyber-emerald':
        return {
          container: 'bg-emerald-950/45 border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.45)] rounded-[22px] text-emerald-300',
          icon: 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]',
          text: 'text-emerald-300/80 group-hover:text-emerald-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
        };
      case 'lumine-cosmic-nebula':
        return {
          container: 'bg-violet-950/45 border border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.45)] rounded-[22px] text-purple-200',
          icon: 'text-purple-200 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]',
          text: 'text-purple-200/80 group-hover:text-purple-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
        };
      case 'lumine-solar-flare':
        return {
          container: 'bg-amber-950/45 border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.45)] rounded-[22px] text-amber-300',
          icon: 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]',
          text: 'text-amber-300/80 group-hover:text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
        };
      case 'lumine-monochromatic-carbon':
        return {
          container: 'bg-neutral-900/90 border border-neutral-700 shadow-md rounded-[22px] text-neutral-300',
          icon: 'text-neutral-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]',
          text: 'text-neutral-400/80 group-hover:text-neutral-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
        };
      default:
        return {
          container: 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl rounded-[22px] text-[#e0e0e0]',
          icon: 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]',
          text: 'text-white/80 group-hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium text-[11px] mt-3.5'
        };
    }
  }
};

export const getWidgetStyleClasses = (widgetType: string) => {
  const styles: Record<string, { card: string; iconBg: string; text: string }> = {
    weather: {
      card: 'bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-slate-950/80 border-amber-500/20 hover:border-amber-400/40 shadow-[0_4px_20px_rgba(245,158,11,0.05)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.15)]',
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      text: 'text-amber-400'
    },
    clock: {
      card: 'bg-gradient-to-br from-indigo-500/10 via-slate-900/60 to-slate-950/80 border-indigo-500/20 hover:border-indigo-400/40 shadow-[0_4px_20px_rgba(124,58,237,0.05)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.15)]',
      iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      text: 'text-indigo-400'
    },
    notes: {
      card: 'bg-gradient-to-br from-emerald-500/10 via-slate-900/60 to-slate-950/80 border-emerald-500/20 hover:border-emerald-400/40 shadow-[0_4px_20px_rgba(16,185,129,0.05)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.15)]',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      text: 'text-emerald-400'
    },
    bio: {
      card: 'bg-gradient-to-br from-purple-500/10 via-slate-900/60 to-slate-950/80 border-purple-500/20 hover:border-purple-400/40 shadow-[0_4px_20px_rgba(168,85,247,0.05)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.15)]',
      iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      text: 'text-purple-400'
    },
    projects: {
      card: 'bg-gradient-to-br from-blue-500/10 via-slate-900/60 to-slate-950/80 border-blue-500/20 hover:border-blue-400/40 shadow-[0_4px_20px_rgba(59,130,246,0.05)] hover:shadow-[0_4px_30px_rgba(59,130,246,0.15)]',
      iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      text: 'text-blue-400'
    },
    lab: {
      card: 'bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-slate-950/80 border-amber-500/20 hover:border-amber-400/40 shadow-[0_4px_20px_rgba(245,158,11,0.05)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.15)]',
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      text: 'text-amber-400'
    },
    certificates: {
      card: 'bg-gradient-to-br from-emerald-500/10 via-slate-900/60 to-slate-950/80 border-emerald-500/20 hover:border-emerald-400/40 shadow-[0_4px_20px_rgba(16,185,129,0.05)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.15)]',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      text: 'text-emerald-400'
    },
    contact: {
      card: 'bg-gradient-to-br from-rose-500/10 via-slate-900/60 to-slate-950/80 border-rose-500/20 hover:border-rose-400/40 shadow-[0_4px_20px_rgba(244,63,94,0.05)] hover:shadow-[0_4px_30px_rgba(244,63,94,0.15)]',
      iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      text: 'text-rose-400'
    },
    planned: {
      card: 'bg-gradient-to-br from-cyan-500/10 via-slate-900/60 to-slate-950/80 border-cyan-500/20 hover:border-cyan-400/40 shadow-[0_4px_20px_rgba(6,182,212,0.05)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.15)]',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      text: 'text-cyan-400'
    }
  };
  return styles[widgetType] || styles.bio;
};

export const getWidgetSizeClasses = (isMobile: boolean, widgetType?: string) => {
  switch (widgetType) {
    case 'tech-radar':
    case 'quick-contact':
      return isMobile ? 'w-full h-48 mb-2' : 'w-[230px] h-[230px] absolute top-0 left-0 z-10 hover:z-20';
    case 'github-activity':
      return isMobile ? 'w-full h-48 mb-2' : 'w-[472px] h-[230px] absolute top-0 left-0 z-10 hover:z-20';
    default:
      return isMobile ? 'w-full h-32 mb-1' : 'w-96 h-56 relative';
  }
};

export const InboxWidgetComponent: React.FC = () => {
  const [messages, setMessages] = useState<InboxMessage[]>(() => {
    const saved = localStorage.getItem('portfolio_os_inbox_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'msg-mock-1',
        sender: 'Karolina Wiśniewska (Google HR)',
        senderEmail: 'k.wisniewska@google.com',
        subject: 'Zaproszenie na rozmowę rekrutacyjną - Full-stack',
        message: 'Cześć Adrian,\n\nPrzejrzałam Twoje portfolio i jestem pod ogromnym wrażeniem symulatora AdrianOS! Chcielibyśmy porozmawiać o Twojej dostępności w projekcie Google Cloud AI.\n\nKiedy znajdziesz chwilę w tym tygodniu na krótkiego calla na Google Meet?\n\nPozdrawiam,\nKarolina',
        date: 'Wczoraj',
        read: false
      },
      {
        id: 'msg-mock-2',
        sender: 'Tomasz Kowalski (Microsoft Tech Lead)',
        senderEmail: 'tomasz.kowalski@microsoft.com',
        subject: 'Pytanie o WebGL i optymalizację w AdrianOS',
        message: 'Dzień dobry Panie Adrianie,\n\nŚwietny projekt z tym webowym OS-em! Zauważyłem, że używa Pan zaawansowanego renderowania. Szukamy osoby do zespołu optymalizacji Azure Portal.\n\nCzy byłby Pan otwarty na rozmowę o współpracy?\n\nPozdrawiam,\nTomasz Kowalski',
        date: '09:41',
        read: false
      }
    ];
  });

  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('portfolio_os_inbox_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const handleNewMsg = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const newMsg: InboxMessage = {
        id: `msg-${Date.now()}`,
        sender: detail.sender || 'Anonimowy gość',
        senderEmail: detail.senderEmail || '',
        subject: detail.subject || '(brak tematu)',
        message: detail.message || '',
        date: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setMessages(prev => [newMsg, ...prev]);
    };

    window.addEventListener('portfolio_os_new_message', handleNewMsg);
    return () => window.removeEventListener('portfolio_os_new_message', handleNewMsg);
  }, []);

  const unreadCount = messages.filter(m => !m.read).length;
  const selectedMsg = messages.find(m => m.id === selectedMsgId);

  const handleSelectMessage = (id: string) => {
    setSelectedMsgId(id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  return (
    <div className="flex flex-col h-full w-full justify-between gap-2.5 p-1 text-white select-text">
      {selectedMsg ? (
        // Detale wiadomości
        <div className="flex flex-col h-full w-full justify-between">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10 shrink-0">
            <button 
              onClick={() => setSelectedMsgId(null)}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Lucide.ArrowLeft size={16} />
            </button>
            <div className="truncate">
              <span className="text-[10px] font-bold text-slate-450 uppercase font-mono tracking-wider">Szczegóły Wiadomości</span>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto pr-1 my-2 space-y-2 text-xs custom-scrollbar">
            <div className="bg-black/35 p-3 rounded-2xl border border-white/5 space-y-1">
              <div className="flex justify-between items-start">
                <p className="font-extrabold text-slate-200">{selectedMsg.sender}</p>
                <span className="text-[10px] text-slate-450 font-mono">{selectedMsg.date}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">{selectedMsg.senderEmail}</p>
              <p className="font-semibold text-cyan-400 mt-1">{selectedMsg.subject}</p>
            </div>
            <div className="bg-black/20 p-3 rounded-2xl border border-white/5 text-slate-300 whitespace-pre-wrap leading-relaxed font-sans shadow-inner min-h-[80px]">
              {selectedMsg.message}
            </div>
          </div>
        </div>
      ) : (
        // Lista wiadomości
        <div className="flex flex-col h-full w-full justify-between">
          <div className="flex justify-between items-center pb-2 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white/45 uppercase font-mono tracking-wider">Skrzynka Odbiorcza</span>
              {unreadCount > 0 && (
                <span className="bg-purple-500/80 border border-purple-400/30 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full animate-pulse shadow-sm">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          </div>
          
          <div className="flex-grow overflow-y-auto pr-1 my-2 space-y-1.5 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs italic font-sans py-8">
                Brak wiadomości w skrzynce
              </div>
            ) : (
              messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex justify-between gap-3 items-center group relative cursor-pointer ${
                    msg.read 
                      ? 'bg-black/15 border-white/5 text-slate-400 hover:bg-black/25 hover:text-slate-300' 
                      : 'bg-black/40 border-purple-500/20 text-slate-200 hover:bg-black/50 hover:border-purple-500/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate flex-grow">
                    {!msg.read && (
                      <div className="w-2 h-2 rounded-full bg-purple-400 shrink-0 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                    )}
                    <div className="truncate flex-grow">
                      <p className={`text-xs truncate ${!msg.read ? 'font-extrabold text-white' : 'font-medium'}`}>
                        {msg.sender}
                      </p>
                      <p className="text-[10px] text-slate-450 truncate mt-0.5 font-sans leading-none">
                        {msg.subject}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono shrink-0 select-none">{msg.date}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
