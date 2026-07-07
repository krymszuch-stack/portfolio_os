/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TimelineItem, OSConfig } from '../types';
import { Briefcase, MapPin, Plus, Trash2, Edit2, Check, Sparkles, Instagram, Linkedin, Github, X } from 'lucide-react';

interface AppBioProps {
  config: OSConfig;
  setConfig: React.Dispatch<React.SetStateAction<OSConfig>>;
  timeline: TimelineItem[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
}

export const AppBio: React.FC<AppBioProps> = ({
  config,
  setConfig,
  timeline,
  setTimeline
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: config.portfolioName || '',
    bio: config.portfolioBio || '',
    role: config.professionalRole || 'Full Stack Architect & Developer'
  });

  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarInput, setAvatarInput] = useState(config.avatarUrl || '');

  const [frontendSkills, setFrontendSkills] = useState<string[]>([]);
  const [backendSkills, setBackendSkills] = useState<string[]>([]);
  const [designSkills, setDesignSkills] = useState<string[]>([]);
  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [isAddingValue, setIsAddingValue] = useState(false);
  const [newValueInput, setNewValueInput] = useState('');

  const [activeAddCategory, setActiveAddCategory] = useState<'frontend' | 'backend' | 'design' | null>(null);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [editingSocial, setEditingSocial] = useState<'github' | 'instagram' | 'linkedin' | null>(null);
  const [socialInput, setSocialInput] = useState('');

  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({
    period: '',
    role: '',
    company: '',
    description: ''
  });

  const handleSaveProfile = () => {
    setConfig(prev => ({
      ...prev,
      portfolioName: profileForm.name,
      portfolioBio: profileForm.bio,
      professionalRole: profileForm.role
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

  const handleSaveSocial = (type: 'github' | 'instagram' | 'linkedin') => {
    setConfig(prev => ({
      ...prev,
      [`${type}Username`]: socialInput.trim() || undefined
    }));
    setEditingSocial(null);
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setConfig(prev => ({
      ...prev,
      instagramPhotos: [...(prev.instagramPhotos || []), newPhotoUrl.trim()]
    }));
    setNewPhotoUrl('');
    setIsAddingPhoto(false);
  };

  const handleDeletePhoto = (urlToDelete: string) => {
    setConfig(prev => ({
      ...prev,
      instagramPhotos: (prev.instagramPhotos || []).filter(u => u !== urlToDelete)
    }));
  };

  const handleAddSkill = (category: 'frontend' | 'backend' | 'design') => {
    if (!newSkillInput.trim()) return;
    if (category === 'frontend') setFrontendSkills(prev => [...prev, newSkillInput.trim()]);
    else if (category === 'backend') setBackendSkills(prev => [...prev, newSkillInput.trim()]);
    else if (category === 'design') setDesignSkills(prev => [...prev, newSkillInput.trim()]);
    setNewSkillInput('');
    setActiveAddCategory(null);
  };

  const handleAddMilestone = () => {
    const newItem: TimelineItem = {
      id: `time-${Date.now()}`,
      period: '2026',
      role: 'Nowe stanowisko',
      company: 'Nowa Firma',
      description: 'Opis zakresu odpowiedzialności i osiągniętych celów.'
    };
    setTimeline(prev => [newItem, ...prev]);
  };

  const handleStartEditMilestone = (item: TimelineItem) => {
    setEditingMilestoneId(item.id);
    setMilestoneForm({
      period: item.period,
      role: item.role,
      company: item.company,
      description: item.description
    });
  };

  const handleSaveMilestone = (id: string) => {
    setTimeline(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, ...milestoneForm };
      }
      return item;
    }));
    setEditingMilestoneId(null);
  };

  const handleDeleteMilestone = (id: string) => {
    setTimeline(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Block */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-15 pointer-events-none">
          <Sparkles className="w-24 h-24 text-slate-300" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-5 w-full md:w-auto">
            
            {/* Avatar Photo Container */}
            <div className="relative shrink-0">
              {isEditingAvatar ? (
                <div className="space-y-2 p-3 bg-slate-950/90 border border-slate-800 rounded-xl shadow-xl z-20 absolute left-0 top-0 min-w-[220px]">
                  <label className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">Wklej URL zdjęcia</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
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
                      className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-slate-700/50 group-hover:border-amber-500/50 transition-all duration-300"
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
                    <label className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block mb-0.5">Imię i Nazwisko</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded px-2.5 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block mb-0.5">Rola Zawodowa</label>
                    <input
                      type="text"
                      value={profileForm.role}
                      onChange={(e) => setProfileForm(p => ({ ...p, role: e.target.value }))}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500 block"
                    />
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
                        setProfileForm(p => ({ ...p, name: config.portfolioName, role: config.professionalRole || p.role, bio: config.portfolioBio }));
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
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-colors font-sans font-semibold shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer"
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
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700/60 transition-colors font-sans font-medium cursor-pointer"
              >
                <Edit2 size={13} /> Edytuj Bio
              </button>
            )}
          </div>
        </div>

        {/* Bio Text area */}
        <div className="mt-5 pt-5 border-t border-slate-800/50">
          {isEditingProfile ? (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">O Mnie / Biografia</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                rows={3}
                placeholder="Napisz kilka zdań o swoim profesjonalnym doświadczeniu..."
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
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
                    setProfileForm(p => ({ ...p, name: config.portfolioName, role: config.professionalRole || p.role, bio: config.portfolioBio }));
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
              className="group/val inline-flex items-center gap-1.5 text-[11px] bg-slate-800/40 hover:bg-slate-800/80 text-slate-300 hover:text-slate-200 border border-slate-700/50 px-2.5 py-1 rounded-md font-sans transition-all"
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
                className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-amber-500"
                autoFocus
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

      {/* Grid: Career Timeline & Skill Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Timeline (Left Column) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-sans font-semibold tracking-wide text-white">
              Doświadczenie Zawodowe
            </h3>
            <button
              id="btn-add-milestone"
              onClick={handleAddMilestone}
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors font-sans font-medium"
            >
              <Plus size={14} /> Dodaj Etap
            </button>
          </div>

          <div className="relative pl-4 border-l-2 border-slate-800/80 space-y-6">
            {timeline.length === 0 ? (
              <button
                onClick={handleAddMilestone}
                className="w-full p-5 rounded-2xl bg-purple-500/5 hover:bg-purple-500/10 border-2 border-dashed border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(168,85,247,0.15)]">
                  <Plus className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-xs font-sans font-bold text-purple-300 uppercase tracking-widest mt-2">Dodaj Pierwszy Etap Doświadczenia</span>
                <p className="text-[10px] text-slate-500 font-sans mt-1">Stwórz wpis o pracy, edukacji lub projekcie</p>
              </button>
            ) : (
              timeline.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Pointer Node */}
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-slate-950 border border-purple-500" />

                  {editingMilestoneId === item.id ? (
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={milestoneForm.period}
                          placeholder="Okres (np. 2023 - Obecnie)"
                          onChange={(e) => setMilestoneForm(f => ({ ...f, period: e.target.value }))}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={milestoneForm.company}
                          placeholder="Firma"
                          onChange={(e) => setMilestoneForm(f => ({ ...f, company: e.target.value }))}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={milestoneForm.role}
                        placeholder="Rola zawodowa"
                        onChange={(e) => setMilestoneForm(f => ({ ...f, role: e.target.value }))}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-full"
                      />
                      <textarea
                        value={milestoneForm.description}
                        placeholder="Opis obowiązków..."
                        rows={2}
                        onChange={(e) => setMilestoneForm(f => ({ ...f, description: e.target.value }))}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 w-full"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          id={`btn-save-milestone-${item.id}`}
                          onClick={() => handleSaveMilestone(item.id)}
                          className="px-2.5 py-1 text-[11px] bg-emerald-500 text-white rounded font-medium"
                        >
                          Zapisz
                        </button>
                        <button
                          onClick={() => setEditingMilestoneId(null)}
                          className="px-2.5 py-1 text-[11px] bg-slate-800 text-slate-300 rounded"
                        >
                          Anuluj
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-x-2">
                          <span className="text-[11px] font-mono text-purple-400 font-semibold uppercase tracking-wider">
                            {item.period}
                          </span>
                          <span className="text-xs text-slate-500 font-sans">
                            •
                          </span>
                          <span className="text-xs font-sans font-bold text-slate-200">
                            {item.role}
                          </span>
                          <span className="text-xs text-slate-400 font-sans">
                            w {item.company}
                          </span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1.5 transition-opacity">
                          <button
                            id={`btn-edit-milestone-${item.id}`}
                            onClick={() => handleStartEditMilestone(item)}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            title="Edytuj"
                          >
                            <Edit2 size={11} />
                          </button>
                          <button
                            id={`btn-delete-milestone-${item.id}`}
                            onClick={() => handleDeleteMilestone(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Usuń"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300/90 leading-relaxed font-sans font-light">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Skill badging taxonomy (Right Column) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="space-y-4">
            <h3 className="text-base font-sans font-semibold tracking-wide text-white">
              Stos Technologiczny
            </h3>
            
            <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 space-y-4">
              {/* Frontend Category */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest block">
                    Frontend
                  </span>
                  {activeAddCategory === 'frontend' ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="np. Svelte"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-white w-20 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddSkill('frontend')}
                        className="p-1 bg-purple-500 text-slate-950 rounded hover:bg-purple-400 cursor-pointer"
                      >
                        <Check size={10} />
                      </button>
                      <button
                        onClick={() => setActiveAddCategory(null)}
                        className="p-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setActiveAddCategory('frontend'); setNewSkillInput(''); }}
                      className="flex items-center gap-0.5 text-[9px] text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/20 cursor-pointer animate-pulse"
                    >
                      <Plus size={10} /> Dodaj
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {frontendSkills.map((skill, idx) => (
                    <span key={idx} className="group/tag inline-flex items-center gap-1 text-xs bg-slate-950/60 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/30 text-slate-300 hover:text-purple-300 px-2 py-1 rounded-md transition-all duration-200 cursor-default">
                      <span>{skill}</span>
                      <button
                        onClick={() => setFrontendSkills(prev => prev.filter(s => s !== skill))}
                        className="opacity-0 group-hover/tag:opacity-100 hover:text-rose-400 transition-opacity ml-1 text-[10px] cursor-pointer"
                        title="Usuń"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend & Devops */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest block">
                    Backend & DevOps
                  </span>
                  {activeAddCategory === 'backend' ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="np. Redis"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-white w-20 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddSkill('backend')}
                        className="p-1 bg-cyan-500 text-slate-950 rounded hover:bg-cyan-400 cursor-pointer"
                      >
                        <Check size={10} />
                      </button>
                      <button
                        onClick={() => setActiveAddCategory(null)}
                        className="p-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setActiveAddCategory('backend'); setNewSkillInput(''); }}
                      className="flex items-center gap-0.5 text-[9px] text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/20 cursor-pointer animate-pulse"
                    >
                      <Plus size={10} /> Dodaj
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {backendSkills.map((skill, idx) => (
                    <span key={idx} className="group/tag inline-flex items-center gap-1 text-xs bg-slate-950/60 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 px-2 py-1 rounded-md transition-all duration-200 cursor-default">
                      <span>{skill}</span>
                      <button
                        onClick={() => setBackendSkills(prev => prev.filter(s => s !== skill))}
                        className="opacity-0 group-hover/tag:opacity-100 hover:text-rose-400 transition-opacity ml-1 text-[10px] cursor-pointer"
                        title="Usuń"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools & Art */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest block">
                    Design & Produkcja
                  </span>
                  {activeAddCategory === 'design' ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="np. Blender"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-white w-20 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddSkill('design')}
                        className="p-1 bg-orange-500 text-slate-950 rounded hover:bg-orange-400 cursor-pointer"
                      >
                        <Check size={10} />
                      </button>
                      <button
                        onClick={() => setActiveAddCategory(null)}
                        className="p-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setActiveAddCategory('design'); setNewSkillInput(''); }}
                      className="flex items-center gap-0.5 text-[9px] text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-1.5 py-0.5 rounded border border-orange-500/20 cursor-pointer animate-pulse"
                    >
                      <Plus size={10} /> Dodaj
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {designSkills.map((skill, idx) => (
                    <span key={idx} className="group/tag inline-flex items-center gap-1 text-xs bg-slate-950/60 hover:bg-orange-500/10 border border-slate-800 hover:border-orange-500/30 text-slate-300 hover:text-orange-300 px-2 py-1 rounded-md transition-all duration-200 cursor-default">
                      <span>{skill}</span>
                      <button
                        onClick={() => setDesignSkills(prev => prev.filter(s => s !== skill))}
                        className="opacity-0 group-hover/tag:opacity-100 hover:text-rose-400 transition-opacity ml-1 text-[10px] cursor-pointer"
                        title="Usuń"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Block */}
          <div className="space-y-3">
            <h3 className="text-xs font-sans font-bold text-slate-300 uppercase tracking-widest">
              Integracje Społecznościowe
            </h3>
            <div className="space-y-2">
              
              {/* GitHub */}
              <div className="p-2.5 rounded-lg bg-slate-900/30 border border-slate-800/40 text-xs text-slate-300">
                {editingSocial === 'github' ? (
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Nazwa użytkownika GitHub"
                      value={socialInput}
                      onChange={(e) => setSocialInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
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
              <div className="p-2.5 rounded-lg bg-slate-900/30 border border-slate-800/40 text-xs text-slate-300">
                {editingSocial === 'instagram' ? (
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Nazwa użytkownika Instagram"
                      value={socialInput}
                      onChange={(e) => setSocialInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
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
              <div className="p-2.5 rounded-lg bg-slate-900/30 border border-slate-800/40 text-xs text-slate-300">
                {editingSocial === 'linkedin' ? (
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="in/nazwa-profilu"
                      value={socialInput}
                      onChange={(e) => setSocialInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
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
        </div>
      </div>

      {/* Linked Instagram photo stream (Fully Editable) */}
      <div className="space-y-4 pt-4 border-t border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-sans font-semibold text-white flex items-center gap-1.5">
              <Instagram size={16} className="text-purple-400" />
              Galeria Zdjęć Instagram Feed
            </h3>
            <p className="text-xs text-slate-400">
              Konfiguruj własną dynamiczną sekcję zdjęć. Najedź na zdjęcie, aby je usunąć, lub kliknij "+", aby dodać nowe.
            </p>
          </div>

          {isAddingPhoto ? (
            <div className="flex items-center gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-xl max-w-xs animate-fadeIn">
              <input
                type="text"
                placeholder="Wklej URL zdjęcia..."
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:outline-none"
              />
              <button
                onClick={handleAddPhoto}
                className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-slate-950 text-xs font-semibold rounded cursor-pointer"
              >
                Zapisz
              </button>
              <button
                onClick={() => setIsAddingPhoto(false)}
                className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded cursor-pointer"
              >
                Anuluj
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setIsAddingPhoto(true); setNewPhotoUrl(''); }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all font-sans font-medium cursor-pointer animate-pulse"
            >
              <Plus size={14} /> Dodaj Zdjęcie
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(config.instagramPhotos || []).map((photoUrl, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-800">
              <img
                src={photoUrl}
                alt={`Instagram image ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity p-2 text-center gap-2">
                <span className="text-[10px] text-slate-300 font-mono truncate max-w-full">
                  {photoUrl.substring(0, 25)}...
                </span>
                <button
                  onClick={() => handleDeletePhoto(photoUrl)}
                  className="px-2 py-1 bg-rose-500/80 hover:bg-rose-600 text-white text-[10px] rounded font-semibold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={10} /> Usuń
                </button>
              </div>
            </div>
          ))}

          {/* Glowing '+' placeholder card at the end */}
          <button
            onClick={() => { setIsAddingPhoto(true); setNewPhotoUrl(''); }}
            className="relative aspect-square rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border-2 border-dashed border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(168,85,247,0.15)]">
              <Plus className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] font-sans font-bold text-purple-300 uppercase tracking-widest mt-2">Dodaj Zdjęcie</span>
          </button>
        </div>
      </div>
    </div>
  );
};
