import React from 'react';
import { OSConfig } from '../types';
import { Target, Activity, Sparkles } from 'lucide-react';

interface AppDashboardProps {
  config: OSConfig;
}

export const AppDashboard: React.FC<AppDashboardProps> = ({ config }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50/90 text-slate-900 select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/50 bg-white/50 backdrop-blur-md">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="text-orange-500" />
          Mój Ekosystem
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">
          Aktualne cele, laboratorium i roadmap
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Roadmap & Current Focus */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-3">
            <Target size={16} className="text-rose-500" />
            Bieżący Cel (Current Focus)
          </h3>
          <div className="bg-rose-50/50 rounded-lg p-3 border border-rose-100">
            <h4 className="font-bold text-rose-900 text-sm">Zunifikowany OS UI/UX</h4>
            <p className="text-xs text-rose-700/80 mt-1 font-medium leading-relaxed">
              Optymalizacja interfejsu w kierunku hybrydy Windows, Ubuntu i macOS z naciskiem na dostępność i system widżetów czerpiący z systemów mobilnych.
            </p>
            <div className="mt-3 w-full bg-rose-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        {/* Labs / Experymenty */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-amber-500" />
            Laboratorium (R&D)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="text-xs font-bold text-slate-800">Silnik Haptic Audio</div>
              <div className="text-[10px] text-slate-500 uppercase mt-1">Web Audio API</div>
              <div className="mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 inline-block px-1.5 py-0.5 rounded border border-emerald-200">WDROŻONO</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="text-xs font-bold text-slate-800">AI CV Parser</div>
              <div className="text-[10px] text-slate-500 uppercase mt-1">Gemini Pro API</div>
              <div className="mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 inline-block px-1.5 py-0.5 rounded border border-emerald-200">WDROŻONO</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="text-xs font-bold text-slate-800">Dynamiczny Dock (macOS)</div>
              <div className="text-[10px] text-slate-500 uppercase mt-1">Framer Motion</div>
              <div className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 inline-block px-1.5 py-0.5 rounded border border-amber-200">W TRAKCIE</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="text-xs font-bold text-slate-800">Widżety (iOS/Win11)</div>
              <div className="text-[10px] text-slate-500 uppercase mt-1">CSS Grid / Glass</div>
              <div className="mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 inline-block px-1.5 py-0.5 rounded border border-amber-200">W TRAKCIE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
