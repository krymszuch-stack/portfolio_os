/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveSprint } from '../types';
import { Layers, Play, CheckCircle, Flame, Plus, Trash2, Sliders } from 'lucide-react';

interface AppLabProps {
  sprints: ActiveSprint[];
  setSprints: React.Dispatch<React.SetStateAction<ActiveSprint[]>>;
}

export const AppLab: React.FC<AppLabProps> = ({
  sprints,
  setSprints
}) => {
  const [isAddingSprint, setIsAddingSprint] = useState(false);
  const [newSprint, setNewSprint] = useState({
    title: '',
    phase: 'Core Development',
    progress: 50,
    status: 'EST. RELEASE: Q4 2026',
    tags: ''
  });

  const handleCreateSprint = () => {
    if (!newSprint.title.trim()) return;

    const created: ActiveSprint = {
      id: `spr-${Date.now()}`,
      title: newSprint.title,
      phase: newSprint.phase,
      progress: Number(newSprint.progress),
      status: newSprint.status || 'ACTIVE WORK',
      tags: newSprint.tags ? newSprint.tags.split(',').map(t => t.trim()) : ['Research']
    };

    setSprints(prev => [...prev, created]);
    setIsAddingSprint(false);
    setNewSprint({
      title: '',
      phase: 'Core Development',
      progress: 50,
      status: 'EST. RELEASE: Q4 2026',
      tags: ''
    });
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    setSprints(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          progress: Math.min(100, Math.max(0, progress))
        };
      }
      return s;
    }));
  };

  const handleDeleteSprint = (id: string) => {
    setSprints(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-sans font-semibold text-white flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            Active Sprints & Lab Experiments
          </h3>
          <p className="text-xs text-slate-400">
            Śledź postęp aktualnych prac programistycznych i projektowych w czasie rzeczywistym. Dostosuj suwaki, aby zaktualizować statusy.
          </p>
        </div>

        <button
          id="btn-trigger-add-sprint"
          onClick={() => setIsAddingSprint(!isAddingSprint)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-all font-sans font-medium"
        >
          <Plus size={14} /> Nowy Sprint
        </button>
      </div>

      {/* New sprint creation form */}
      {isAddingSprint && (
        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 space-y-4">
          <h4 className="text-xs font-sans font-semibold text-white">Stwórz nową fazę / projekt</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono">Tytuł modułu</label>
              <input
                type="text"
                placeholder="np. Audio Synthesizer v3"
                value={newSprint.title}
                onChange={(e) => setNewSprint(s => ({ ...s, title: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono">Faza / Status</label>
              <input
                type="text"
                placeholder="np. Beta Testing"
                value={newSprint.phase}
                onChange={(e) => setNewSprint(s => ({ ...s, phase: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono">Początkowy postęp (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={newSprint.progress}
                onChange={(e) => setNewSprint(s => ({ ...s, progress: Number(e.target.value) }))}
                className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-mono">Ukończenie / Tagline</label>
              <input
                type="text"
                placeholder="EST. RELEASE: Q1 2026"
                value={newSprint.status}
                onChange={(e) => setNewSprint(s => ({ ...s, status: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              id="btn-save-new-sprint"
              onClick={handleCreateSprint}
              className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-slate-950 text-xs font-semibold rounded"
            >
              Uruchom Sprint
            </button>
            <button
              onClick={() => setIsAddingSprint(false)}
              className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Sprints listing */}
      <div className="space-y-4">
        {sprints.length === 0 ? (
          <button
            onClick={() => setIsAddingSprint(true)}
            className="w-full p-6 rounded-xl bg-orange-500/5 hover:bg-orange-500/10 border-2 border-dashed border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] shadow-[0_0_15px_rgba(249,115,22,0.05)] hover:shadow-[0_0_25px_rgba(249,115,22,0.25)] group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(249,115,22,0.15)]">
              <Plus className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xs font-sans font-bold text-orange-300 uppercase tracking-widest mt-2">Uruchom nowy sprint technologiczny</span>
            <p className="text-[10px] text-slate-500 font-sans mt-1">Zdefiniuj aktualny cel badawczy, postęp i status prac</p>
          </button>
        ) : (
          sprints.map((sprint) => (
            <div
              key={sprint.id}
              className="p-5 rounded-xl bg-slate-900/10 border border-slate-800/60 space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <Layers size={13} />
                    </span>
                    <h4 className="text-sm font-sans font-bold text-white">
                      {sprint.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="font-mono text-orange-400 font-semibold">{sprint.phase}</span>
                    <span>•</span>
                    <span>{sprint.status}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="flex items-center space-x-1 border border-slate-800/80 p-1 rounded-lg bg-slate-950/40 w-full sm:w-auto">
                    <span className="p-1 text-slate-500">
                      <Sliders size={12} />
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sprint.progress}
                      onChange={(e) => handleUpdateProgress(sprint.id, Number(e.target.value))}
                      className="w-full sm:w-28 accent-orange-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-orange-400 w-8 text-right pr-1">
                      {sprint.progress}%
                    </span>
                  </div>

                  <button
                    id={`btn-delete-sprint-${sprint.id}`}
                    onClick={() => handleDeleteSprint(sprint.id)}
                    className="p-2 rounded-lg bg-slate-950/30 hover:bg-rose-500/10 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Usuń sprint"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Glassy Progress Bar */}
              <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-[1px]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 transition-all duration-300"
                  style={{ width: `${sprint.progress}%` }}
                />
              </div>

              {/* Sprint metadata tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sprint.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono font-semibold bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
