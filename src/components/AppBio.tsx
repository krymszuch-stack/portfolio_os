/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TimelineItem, OSConfig } from '../types';
import { Briefcase, MapPin, Plus, Trash2, Edit2, Check, Sparkles, Instagram, Linkedin, Github } from 'lucide-react';

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
    name: config.portfolioName,
    bio: config.portfolioBio,
    role: 'Full Stack Architect & Developer'
  });

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
      portfolioBio: profileForm.bio
    }));
    setIsEditingProfile(false);
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
          <div className="flex items-center space-x-5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                alt="Avatar"
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-slate-700/50"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            </div>

            <div className="space-y-1">
              {isEditingProfile ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="bg-slate-950/80 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm(p => ({ ...p, role: e.target.value }))}
                    className="bg-slate-950/80 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-purple-500 block w-full"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl md:text-2xl font-sans font-bold tracking-tight text-white flex items-center gap-2">
                    {config.portfolioName}
                    <span className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full font-mono font-medium">
                      {config.proMode ? 'PRO' : 'FREE DEMO'}
                    </span>
                  </h2>
                  <p className="text-sm font-sans font-medium text-slate-300 flex items-center gap-1.5">
                    <Briefcase size={14} className="text-slate-400" />
                    {profileForm.role}
                  </p>
                </>
              )}

              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin size={12} /> Warsaw, Poland (Remote)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {isEditingProfile ? (
              <button
                id="btn-save-profile"
                onClick={handleSaveProfile}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-sans font-medium"
              >
                <Check size={14} /> Zapisz
              </button>
            ) : (
              <button
                id="btn-edit-profile"
                onClick={() => {
                  setProfileForm({
                    name: config.portfolioName,
                    bio: config.portfolioBio,
                    role: profileForm.role
                  });
                  setIsEditingProfile(true);
                }}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700/60 transition-colors font-sans font-medium"
              >
                <Edit2 size={13} /> Edytuj Bio
              </button>
            )}
          </div>
        </div>

        {/* Bio Text area */}
        <div className="mt-5 pt-5 border-t border-slate-800/50">
          {isEditingProfile ? (
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
              rows={3}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            />
          ) : (
            <p className="text-sm leading-relaxed text-slate-300 font-sans max-w-2xl">
              {config.portfolioBio}
            </p>
          )}
        </div>

        {/* Core Values Tag Box */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['Minimalizm', 'Wydajność UX', 'WebGL Shaders', 'Zorientowanie na cel', 'Clean Code'].map((value, idx) => (
            <span key={idx} className="text-[11px] bg-slate-800/40 text-slate-300 border border-slate-700/50 px-2.5 py-1 rounded-md font-sans">
              ✦ {value}
            </span>
          ))}
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
            {timeline.map((item) => (
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
            ))}
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
                <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest block mb-2">
                  Frontend
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['React 19', 'TypeScript', 'Next.js', 'Tailwind v4', 'Framer Motion', 'Three.js'].map((skill, idx) => (
                    <span key={idx} className="text-xs bg-slate-950/60 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/30 text-slate-300 hover:text-purple-300 px-2 py-1 rounded-md transition-all duration-200 cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend & Devops */}
              <div>
                <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest block mb-2">
                  Backend & DevOps
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Google Cloud', 'GraphQL'].map((skill, idx) => (
                    <span key={idx} className="text-xs bg-slate-950/60 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 px-2 py-1 rounded-md transition-all duration-200 cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools & Art */}
              <div>
                <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest block mb-2">
                  Design & Produkcja
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Figma', 'UI/UX Design', 'Linear', 'Shaders', 'Product Discovery'].map((skill, idx) => (
                    <span key={idx} className="text-xs bg-slate-950/60 hover:bg-orange-500/10 border border-slate-800 hover:border-orange-500/30 text-slate-300 hover:text-orange-300 px-2 py-1 rounded-md transition-all duration-200 cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Block */}
          <div className="space-y-3">
            <h3 className="text-xs font-sans font-bold text-slate-300 uppercase tracking-widest">
              Integracje Społecznościowe (Mock)
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/30 border border-slate-800/40 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Github size={14} className="text-slate-400" />
                  <span>GitHub: <span className="font-semibold text-white">{config.githubUsername || 'creative-user'}</span></span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
                  POŁĄCZONO
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/30 border border-slate-800/40 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Instagram size={14} className="text-slate-400" />
                  <span>Instagram: <span className="font-semibold text-white">{config.instagramUsername || 'creative.designer'}</span></span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
                  POŁĄCZONO
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/30 border border-slate-800/40 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Linkedin size={14} className="text-slate-400" />
                  <span>LinkedIn: <span className="font-semibold text-white">{config.linkedinUsername || 'in/creative-dev'}</span></span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-medium">
                  POŁĄCZONO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Instagram photo stream (High fidelity mock) */}
      <div className="space-y-4 pt-4 border-t border-slate-800/50">
        <h3 className="text-sm font-sans font-semibold text-white flex items-center gap-1.5">
          <Instagram size={16} className="text-purple-400" />
          Instagram Feed Integration
        </h3>
        <p className="text-xs text-slate-400 -mt-2">
          Poniższe zdjęcia zostały zaimportowane z Instagrama i mogą być w pełni edytowane w formularzu generatora.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(config.instagramPhotos || []).map((photoUrl, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-800">
              <img
                src={photoUrl}
                alt={`Instagram mock ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[10px] text-white font-sans uppercase tracking-widest font-bold">
                  @instagram_feed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
