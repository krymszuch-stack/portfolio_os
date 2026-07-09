import React, { useState, useEffect } from 'react';
import { OSConfig } from '../../types';
import { Plus, Check, X } from 'lucide-react';

interface BioSkillsSectionProps {
  config: OSConfig;
  setConfig: React.Dispatch<React.SetStateAction<OSConfig>>;
}

export const BioSkillsSection: React.FC<BioSkillsSectionProps> = ({ config, setConfig }) => {
  const [frontendSkills, setFrontendSkills] = useState<string[]>(() => config.frontendSkills || []);
  const [backendSkills, setBackendSkills] = useState<string[]>(() => config.backendSkills || []);
  const [designSkills, setDesignSkills] = useState<string[]>(() => config.designSkills || []);
  
  const [activeAddCategory, setActiveAddCategory] = useState<'frontend' | 'backend' | 'design' | null>(null);
  const [newSkillInput, setNewSkillInput] = useState('');

  useEffect(() => {
    setConfig(prev => {
      if (
        JSON.stringify(prev.frontendSkills) === JSON.stringify(frontendSkills) &&
        JSON.stringify(prev.backendSkills) === JSON.stringify(backendSkills) &&
        JSON.stringify(prev.designSkills) === JSON.stringify(designSkills)
      ) {
        return prev;
      }
      return {
        ...prev,
        frontendSkills,
        backendSkills,
        designSkills
      };
    });
  }, [frontendSkills, backendSkills, designSkills, setConfig]);

  const handleAddSkill = (category: 'frontend' | 'backend' | 'design') => {
    if (!newSkillInput.trim()) return;
    if (category === 'frontend') setFrontendSkills(prev => [...prev, newSkillInput.trim()]);
    else if (category === 'backend') setBackendSkills(prev => [...prev, newSkillInput.trim()]);
    else if (category === 'design') setDesignSkills(prev => [...prev, newSkillInput.trim()]);
    setNewSkillInput('');
    setActiveAddCategory(null);
  };

  return (
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
  );
};
