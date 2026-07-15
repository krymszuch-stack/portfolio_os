/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import { OSConfig } from '../../types';
import { Briefcase, MapPin, Plus, Edit2, Check, Sparkles, X } from 'lucide-react';

interface BioProfileSectionProps {
  config: OSConfig;
  setConfig: React.Dispatch<React.SetStateAction<OSConfig>>;
}

export const BioProfileSection: React.FC<BioProfileSectionProps> = ({ config, setConfig }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: config.portfolioName || '',
    bio: config.portfolioBio || '',
    role: config.professionalRole || 'Full Stack Architect & Developer'
  });

  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarInput, setAvatarInput] = useState(config.avatarUrl || '');

  const [coreValues, setCoreValues] = useState<string[]>(() => config.coreValues || []);
  const [isAddingValue, setIsAddingValue] = useState(false);
  const [newValueInput, setNewValueInput] = useState('');

  useEffect(() => {
    setConfig(prev => {
      if (JSON.stringify(prev.coreValues) === JSON.stringify(coreValues)) {
        return prev;
      }
      return { ...prev, coreValues };
    });
  }, [coreValues, setConfig]);

  const handleSaveProfile = () => {
    if (!profileForm.name.trim() || !profileForm.role.trim()) return;
    setConfig(prev => ({
      ...prev,
      portfolioName: profileForm.name.trim(),
      portfolioBio: profileForm.bio.slice(0, 500),
      professionalRole: profileForm.role.trim()
    }));
    setIsEditingProfile(false);
  };

  const handleSaveAvatar = () => {
    setConfig(prev => ({
      ...prev,
      avatarUrl: avatarInput.trim() || undefined
    }));
    setIsEditingAvatar(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10/60 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-15 pointer-events-none">
        <Sparkles className="w-24 h-24 text-slate-300" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-5 w-full md:w-auto">
          
          {/* Avatar Photo Container */}
          <div className="relative shrink-0">
            {isEditingAvatar ? (
              <div className="space-y-2 p-3 bg-slate-950/90 border border-white/10 rounded-xl shadow-xl z-20 absolute left-0 top-0 min-w-[220px]">
                <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">Wklej URL zdjęcia</span>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                  className="w-full px-2 py-1 backdrop-blur-md bg-slate-900/60 border border-white/10 rounded text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
                <div className="flex gap-1.5 justify-end">
                  <button
                    onClick={handleSaveAvatar}
                    className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-semibold rounded transition-colors cursor-pointer"
                  >
                    Zapisz
                  </button>
                  <button
                    onClick={() => setIsEditingAvatar(false)}
                    className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded transition-colors cursor-pointer"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            ) : null}

            <div 
              onClick={() => { setAvatarInput(config.avatarUrl || ''); setIsEditingAvatar(true); }}
              className="relative group cursor-pointer"
              title="Kliknij, aby zmienić zdjęcie profilowe"
            >
              {config.avatarUrl ? (
                <div className="relative">
                  <img
                    src={config.avatarUrl}
                    alt="Avatar"
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white/10/50 group-hover:border-amber-500/50 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                    <Plus className="w-5 h-5 text-amber-400" />
                    <span className="text-[8px] font-mono text-amber-400 uppercase tracking-wide">Zmień</span>
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center bg-amber-500/5 hover:bg-amber-500/10 border-2 border-dashed border-amber-500/30 text-amber-400 hover:border-amber-400 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] animate-pulse">
                  <Plus className="w-6 h-6" />
                  <span className="text-[8px] font-sans font-bold tracking-wider uppercase mt-1">Zdjęcie</span>
                </div>
              )}
              {config.avatarUrl && (
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
              )}
            </div>
          </div>

          {/* Name and Role Section */}
          <div className="space-y-1.5 flex-1 min-w-0">
            {isEditingProfile ? (
              <div className="space-y-2 max-w-sm">
                <div>
                  <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block mb-0.5">
                    Imię i Nazwisko <span className="text-rose-500 font-bold">*</span>
                  </span>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className={`w-full bg-slate-950/80 border ${!profileForm.name.trim() ? 'border-rose-500 focus:border-rose-500' : 'border-white/10 focus:border-purple-500'} rounded px-2.5 py-1 text-sm text-white focus:outline-none`}
                  />
                  {!profileForm.name.trim() && (
                    <span className="text-[9px] text-rose-500 font-mono mt-0.5 block">✦ Imię i nazwisko nie może być puste!</span>
                  )}
                </div>
                <div>
                  <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block mb-0.5">
                    Rola Zawodowa <span className="text-rose-500 font-bold">*</span>
                  </span>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm(p => ({ ...p, role: e.target.value }))}
                    className={`w-full bg-slate-950/80 border ${!profileForm.role.trim() ? 'border-rose-500 focus:border-rose-500' : 'border-white/10 focus:border-purple-500'} rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none block`}
                  />
                  {!profileForm.role.trim() && (
                    <span className="text-[9px] text-rose-500 font-mono mt-0.5 block">✦ Rola zawodowa nie może być pusta!</span>
                  )}
                </div>
              </div>
            ) : (
              <>
                {config.portfolioName ? (
                  <h2 className="text-xl md:text-2xl font-sans font-bold tracking-tight text-white flex items-center gap-2">
                    {config.portfolioName}
                    <span className="text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider">
                      {config.proMode ? 'PRO' : 'FREE DEMO'}
                    </span>
                  </h2>
                ) : (
                  <button
                    onClick={() => {
                      setProfileForm(p => ({ ...p, name: config.portfolioName || '', role: config.professionalRole || p.role, bio: config.portfolioBio || '' }));
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-sans font-semibold shadow-[0_0_12px_rgba(245,158,11,0.15)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse transition-all cursor-pointer"
                  >
                    <Plus size={14} /> Dodaj Imię i Nazwisko
                  </button>
                )}

                {config.portfolioName && (
                  <p className="text-sm font-sans font-medium text-slate-300 flex items-center gap-1.5">
                    <Briefcase size={14} className="text-slate-400" />
                    {config.professionalRole || 'Full Stack Architect & Developer'}
                  </p>
                )}
              </>
            )}

            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin size={12} /> Warsaw, Poland (Remote)
            </p>
          </div>
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {isEditingProfile ? (
            <button
              id="btn-save-profile"
              onClick={handleSaveProfile}
              disabled={!profileForm.name.trim() || !profileForm.role.trim() || profileForm.bio.length > 500}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 rounded-lg transition-colors font-sans font-semibold shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer disabled:cursor-not-allowed"
            >
              <Check size={14} /> Zapisz
            </button>
          ) : (
            <button
              id="btn-edit-profile"
              onClick={() => {
                setProfileForm({
                  name: config.portfolioName || '',
                  bio: config.portfolioBio || '',
                  role: config.professionalRole || 'Full Stack Architect & Developer'
                });
                setIsEditingProfile(true);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-white/10/60 transition-colors font-sans font-medium cursor-pointer"
            >
              <Edit2 size={13} /> Edytuj Bio
            </button>
          )}
        </div>
      </div>

      {/* Bio Text area */}
      <div className="mt-5 pt-5 border-t border-white/10/50">
        {isEditingProfile ? (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">O Mnie / Biografia</span>
              <span className={`text-[10px] font-mono ${profileForm.bio.length > 500 ? 'text-rose-500 font-bold animate-pulse' : 'text-slate-400'}`}>
                {profileForm.bio.length} / 500
              </span>
            </div>
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value.slice(0, 500) }))}
              maxLength={500}
              rows={3}
              placeholder="Napisz kilka zdań o swoim profesjonalnym doświadczeniu..."
              className="w-full bg-slate-950/80 border border-white/10 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        ) : (
          config.portfolioBio ? (
            <p className="text-sm leading-relaxed text-slate-300 font-sans max-w-2xl whitespace-pre-line">
              {config.portfolioBio}
            </p>
          ) : (
            <div className="py-2">
              <button
                onClick={() => {
                  setProfileForm(p => ({ ...p, name: config.portfolioName || '', role: config.professionalRole || p.role, bio: config.portfolioBio || '' }));
                  setIsEditingProfile(true);
                }}
                className="flex items-center gap-1.5 px-4 py-3 bg-amber-500/5 border-2 border-dashed border-amber-500/20 hover:border-amber-400 hover:bg-amber-500/10 text-amber-400 rounded-xl text-xs font-sans font-semibold shadow-[0_0_12px_rgba(245,158,11,0.08)] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse transition-all w-full max-w-sm cursor-pointer"
              >
                <Plus size={16} /> Dodaj Opis Zawodowy (Bio / O mnie)
              </button>
            </div>
          )
        )}
      </div>

      {/* Core Values Tag Box */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {coreValues.map((value, idx) => (
          <span
            key={idx}
            className="group/val inline-flex items-center gap-1.5 text-[11px] bg-slate-800/40 hover:bg-slate-800/80 text-slate-300 hover:text-slate-200 border border-white/10/50 px-2.5 py-1 rounded-md font-sans transition-all"
          >
            <span>✦ {value}</span>
            <button
              onClick={() => setCoreValues(prev => prev.filter((_, i) => i !== idx))}
              className="opacity-0 group-hover/val:opacity-100 text-rose-400 hover:text-rose-300 text-[10px] cursor-pointer transition-opacity"
              title="Usuń"
            >
              ✕
            </button>
          </span>
        ))}

        {isAddingValue ? (
          <div className="flex items-center gap-1.5 animate-fadeIn">
            <input
              type="text"
              placeholder="np. Niezawodność"
              value={newValueInput}
              onChange={(e) => setNewValueInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const trimmed = newValueInput.trim();
                  if (trimmed && !coreValues.includes(trimmed)) {
                    setCoreValues(prev => [...prev, trimmed]);
                  }
                  setNewValueInput('');
                  setIsAddingValue(false);
                }
              }}
              className="backdrop-blur-md bg-slate-950/60 border border-white/10 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-amber-500"

            />
            <button
              onClick={() => {
                const trimmed = newValueInput.trim();
                if (trimmed && !coreValues.includes(trimmed)) {
                  setCoreValues(prev => [...prev, trimmed]);
                }
                setNewValueInput('');
                setIsAddingValue(false);
              }}
              className="p-1 bg-amber-500 text-slate-950 rounded hover:bg-amber-400 cursor-pointer"
            >
              <Check size={12} />
            </button>
            <button
              onClick={() => {
                setNewValueInput('');
                setIsAddingValue(false);
              }}
              className="p-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingValue(true)}
            className="inline-flex items-center gap-1 text-[11px] bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 border border-dashed border-amber-500/30 hover:border-amber-400 px-2.5 py-1 rounded-md font-sans cursor-pointer transition-all shadow-[0_0_12px_rgba(245,158,11,0.08)] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-102"
            title="Dodaj cechę / atut"
          >
            <Plus size={11} /> Dodaj cechę
          </button>
        )}
      </div>
    </div>
  );
};
