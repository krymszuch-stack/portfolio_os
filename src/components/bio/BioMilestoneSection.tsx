import React, { useState } from 'react';
import { TimelineItem } from '../../types';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface BioMilestoneSectionProps {
  timeline: TimelineItem[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
}

export const BioMilestoneSection: React.FC<BioMilestoneSectionProps> = ({ timeline, setTimeline }) => {
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({
    period: '',
    role: '',
    company: '',
    description: ''
  });

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
    <div className="space-y-4">
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

      <div className="relative pl-4 border-l-2 border-white/10/80 space-y-6">
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
              <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full backdrop-blur-md bg-slate-950/60 border border-purple-500" />

              {editingMilestoneId === item.id ? (
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={milestoneForm.period}
                      placeholder="Okres (np. 2023 - Obecnie)"
                      onChange={(e) => setMilestoneForm(f => ({ ...f, period: e.target.value }))}
                      className="backdrop-blur-md bg-slate-900/60 border border-white/10 rounded px-2 py-1 text-xs text-white"
                    />
                    <div>
                      <input
                        type="text"
                        value={milestoneForm.company}
                        placeholder="Firma *"
                        onChange={(e) => setMilestoneForm(f => ({ ...f, company: e.target.value }))}
                        className={`backdrop-blur-md bg-slate-900/60 border ${!milestoneForm.company.trim() ? 'border-rose-500' : 'border-white/10'} rounded px-2 py-1 text-xs text-white w-full`}
                      />
                      {!milestoneForm.company.trim() && (
                        <span className="text-[8px] text-rose-500 font-mono mt-0.5 block">Firma jest wymagana!</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={milestoneForm.role}
                      placeholder="Rola zawodowa *"
                      onChange={(e) => setMilestoneForm(f => ({ ...f, role: e.target.value }))}
                      className={`backdrop-blur-md bg-slate-900/60 border ${!milestoneForm.role.trim() ? 'border-rose-500' : 'border-white/10'} rounded px-2 py-1 text-xs text-white w-full`}
                    />
                    {!milestoneForm.role.trim() && (
                      <span className="text-[8px] text-rose-500 font-mono mt-0.5 block">Rola jest wymagana!</span>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono mb-0.5">
                      <span>Opis obowiązków</span>
                      <span className={milestoneForm.description.length > 500 ? 'text-rose-500 font-bold' : ''}>
                        {milestoneForm.description.length} / 500
                      </span>
                    </div>
                    <textarea
                      value={milestoneForm.description}
                      placeholder="Opis obowiązków..."
                      rows={2}
                      maxLength={500}
                      onChange={(e) => setMilestoneForm(f => ({ ...f, description: e.target.value.slice(0, 500) }))}
                      className="backdrop-blur-md bg-slate-900/60 border border-white/10 rounded px-2 py-1 text-xs text-slate-300 w-full"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      id={`btn-save-milestone-${item.id}`}
                      onClick={() => handleSaveMilestone(item.id)}
                      disabled={!milestoneForm.company.trim() || !milestoneForm.role.trim() || milestoneForm.description.length > 500}
                      className="px-2.5 py-1 text-[11px] bg-emerald-500 disabled:bg-slate-800 text-white disabled:text-slate-500 rounded font-medium disabled:cursor-not-allowed"
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
  );
};
