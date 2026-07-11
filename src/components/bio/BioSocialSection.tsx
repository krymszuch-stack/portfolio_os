import React, { useState } from 'react';
import { OSConfig } from '../../types';
import { Plus, Github, Instagram, Linkedin } from 'lucide-react';

interface BioSocialSectionProps {
  config: OSConfig;
  setConfig: React.Dispatch<React.SetStateAction<OSConfig>>;
}

export const BioSocialSection: React.FC<BioSocialSectionProps> = ({ config, setConfig }) => {
  const [editingSocial, setEditingSocial] = useState<'github' | 'instagram' | 'linkedin' | null>(null);
  const [socialInput, setSocialInput] = useState('');

  const handleSaveSocial = (type: 'github' | 'instagram' | 'linkedin') => {
    let finalInput = socialInput.trim();
    if (finalInput && !finalInput.startsWith('http://') && !finalInput.startsWith('https://')) {
      finalInput = 'https://' + finalInput;
    }
    setConfig(prev => ({
      ...prev,
      [`${type}Username`]: finalInput || undefined
    }));
    setEditingSocial(null);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-sans font-bold text-slate-300 uppercase tracking-widest">
        Integracje Społecznościowe
      </h3>
      <div className="space-y-2">
        
        {/* GitHub */}
        <div className="p-2.5 rounded-lg bg-slate-900/30 border border-white/10/40 text-xs text-slate-300">
          {editingSocial === 'github' ? (
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                placeholder="Nazwa użytkownika GitHub"
                value={socialInput}
                onChange={(e) => setSocialInput(e.target.value)}
                className="flex-1 backdrop-blur-md bg-slate-950/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
              />
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleSaveSocial('github')}
                  className="px-2 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded cursor-pointer"
                >
                  Zapisz
                </button>
                <button
                  onClick={() => setEditingSocial(null)}
                  className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded cursor-pointer"
                >
                  Anuluj
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Github size={14} className="text-slate-400" />
                <span>GitHub: <span className="font-semibold text-white">{config.githubUsername || 'Nie skonfigurowano'}</span></span>
              </div>
              {config.githubUsername ? (
                <button
                  onClick={() => { setSocialInput(config.githubUsername || ''); setEditingSocial('github'); }}
                  className="text-[10px] text-slate-400 hover:text-white transition-colors underline cursor-pointer"
                >
                  Zmień
                </button>
              ) : (
                <button
                  onClick={() => { setSocialInput(''); setEditingSocial('github'); }}
                  className="flex items-center gap-0.5 px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded text-[10px] font-semibold animate-pulse cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.15)]"
                >
                  <Plus size={10} /> Połącz
                </button>
              )}
            </div>
          )}
        </div>

        {/* Instagram */}
        <div className="p-2.5 rounded-lg bg-slate-900/30 border border-white/10/40 text-xs text-slate-300">
          {editingSocial === 'instagram' ? (
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                placeholder="Nazwa użytkownika Instagram"
                value={socialInput}
                onChange={(e) => setSocialInput(e.target.value)}
                className="flex-1 backdrop-blur-md bg-slate-950/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
              />
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleSaveSocial('instagram')}
                  className="px-2 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded cursor-pointer"
                >
                  Zapisz
                </button>
                <button
                  onClick={() => setEditingSocial(null)}
                  className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded cursor-pointer"
                >
                  Anuluj
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Instagram size={14} className="text-slate-400" />
                <span>Instagram: <span className="font-semibold text-white">{config.instagramUsername || 'Nie skonfigurowano'}</span></span>
              </div>
              {config.instagramUsername ? (
                <button
                  onClick={() => { setSocialInput(config.instagramUsername || ''); setEditingSocial('instagram'); }}
                  className="text-[10px] text-slate-400 hover:text-white transition-colors underline cursor-pointer"
                >
                  Zmień
                </button>
              ) : (
                <button
                  onClick={() => { setSocialInput(''); setEditingSocial('instagram'); }}
                  className="flex items-center gap-0.5 px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded text-[10px] font-semibold animate-pulse cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.15)]"
                >
                  <Plus size={10} /> Połącz
                </button>
              )}
            </div>
          )}
        </div>

        {/* LinkedIn */}
        <div className="p-2.5 rounded-lg bg-slate-900/30 border border-white/10/40 text-xs text-slate-300">
          {editingSocial === 'linkedin' ? (
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                placeholder="in/nazwa-profilu"
                value={socialInput}
                onChange={(e) => setSocialInput(e.target.value)}
                className="flex-1 backdrop-blur-md bg-slate-950/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
              />
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => handleSaveSocial('linkedin')}
                  className="px-2 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded cursor-pointer"
                >
                  Zapisz
                </button>
                <button
                  onClick={() => setEditingSocial(null)}
                  className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded cursor-pointer"
                >
                  Anuluj
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Linkedin size={14} className="text-slate-400" />
                <span>LinkedIn: <span className="font-semibold text-white">{config.linkedinUsername || 'Nie skonfigurowano'}</span></span>
              </div>
              {config.linkedinUsername ? (
                <button
                  onClick={() => { setSocialInput(config.linkedinUsername || ''); setEditingSocial('linkedin'); }}
                  className="text-[10px] text-slate-400 hover:text-white transition-colors underline cursor-pointer"
                >
                  Zmień
                </button>
              ) : (
                <button
                  onClick={() => { setSocialInput(''); setEditingSocial('linkedin'); }}
                  className="flex items-center gap-0.5 px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded text-[10px] font-semibold animate-pulse cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.15)]"
                >
                  <Plus size={10} /> Połącz
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
