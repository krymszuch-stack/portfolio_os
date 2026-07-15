import React from 'react';
import { Project, OSConfig } from '../types';
import * as Lucide from 'lucide-react';

interface BentoHubProps {
  projects: Project[];
  config: OSConfig;
  openApp: (appId: 'bio' | 'projects' | 'dashboard' | 'certificates' | 'settings' | 'contact' | 'wizard' | 'terminal') => void;
}

export const BentoHub: React.FC<BentoHubProps> = ({ projects, config, openApp }) => {
  // Split projects into two arrays to fake the "Websites" and "Projects" dual-carousel look
  const half = Math.ceil((projects.length || 1) / 2);
  const featuredProjects = projects.slice(0, half);
  const otherProjects = projects.slice(half);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 z-10 pointer-events-none pb-28 pt-8">
      <div className="w-full max-w-5xl max-h-[85vh] overflow-y-auto hide-scrollbar rounded-[2rem] bg-slate-950/70 backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] p-4 md:p-6 pointer-events-auto flex flex-col gap-6 animate-scaleIn">
        
        {/* Top Row: Profile & Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Profile Card */}
          <div className="flex-1 bg-white/5 rounded-3xl p-5 md:p-6 border border-white/10 flex items-center gap-5 md:gap-6 shadow-inner">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-white/20 overflow-hidden shrink-0 bg-slate-800 shadow-xl">
              {config.avatarUrl ? (
                <img src={config.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Lucide.User size={40} className="w-full h-full p-6 text-slate-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{config.ownerName || 'Adrian'}</h1>
              <p className="text-sm md:text-base text-slate-300 font-medium mt-1">{config.portfolioRole || 'Full Stack Web Developer'}</p>
              <p className="text-xs md:text-sm text-slate-500 mt-2 line-clamp-2 max-w-md leading-relaxed">
                {config.portfolioBio || 'Tworzę skalowalne aplikacje webowe, systemy oparte o AI i rozwijam chmurę. Zlokalizowany w Polsce.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-[340px] grid grid-cols-2 gap-3 shrink-0">
            <button 
              onClick={() => openApp('bio')}
              className="col-span-2 flex items-center justify-between bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-3xl p-4 transition-all group shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform shadow-inner border border-blue-400/20">
                  <Lucide.FileBadge size={32} strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white">Zobacz CV</h3>
                  <p className="text-xs text-blue-300/70 mt-0.5">Doświadczenie & Edukacja</p>
                </div>
              </div>
              <Lucide.ChevronRight size={24} className="text-blue-500/50 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => openApp('contact')}
              className="flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] p-5 transition-all group shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform border border-emerald-400/20">
                <Lucide.Send size={28} strokeWidth={1.5} className="mr-1 mt-1" />
              </div>
              <span className="text-sm font-bold text-white">Napisz</span>
            </button>
            <button 
              onClick={() => openApp('certificates')}
              className="flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[1.5rem] p-5 transition-all group shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
            >
              <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform border border-amber-400/20">
                <Lucide.Medal size={28} strokeWidth={1.5} />
              </div>
              <span className="text-sm font-bold text-white">Certyfikaty</span>
            </button>
            <button 
              onClick={() => openApp('wizard')}
              className="col-span-2 flex items-center justify-between bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-3xl p-4 transition-all group shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] animate-pulse hover:animate-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0 group-hover:scale-110 transition-transform shadow-inner border border-yellow-400/20">
                  <Lucide.Sparkles size={32} strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white">Stwórz Własne Portfolio</h3>
                  <p className="text-xs text-yellow-300/70 mt-0.5">Uruchom Kreator Wizytówki</p>
                </div>
              </div>
              <Lucide.ChevronRight size={24} className="text-yellow-500/50 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Middle Row: Featured Projects */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex justify-between items-end px-3">
            <h2 className="text-sm md:text-base font-bold text-white tracking-wide">Główne Projekty</h2>
            <button onClick={() => openApp('projects')} className="text-[10px] md:text-xs text-slate-400 hover:text-white transition-colors">Pokaż wszystkie ({projects.length})</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar px-2 -mx-2">
            {featuredProjects.map(proj => (
              <ProjectCard key={proj.id} project={proj} onClick={() => openApp('projects')} />
            ))}
            {featuredProjects.length === 0 && (
              <div className="text-sm text-slate-500 italic p-4">Brak projektów.</div>
            )}
          </div>
        </div>

        {/* Bottom Row: Other Projects */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end px-3">
            <h2 className="text-sm md:text-base font-bold text-white tracking-wide">Eksperymenty i Pakiety</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar px-2 -mx-2">
            {otherProjects.map(proj => (
              <ProjectCard key={proj.id} project={proj} onClick={() => openApp('projects')} />
            ))}
            {otherProjects.length === 0 && (
              <div className="text-sm text-slate-500 italic p-4">Brak innych projektów.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const ProjectCard = ({ project, onClick }: { project: Project, onClick: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className="flex-shrink-0 w-64 md:w-80 bg-[#16161c] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all text-left group snap-start shadow-lg"
    >
      <div className="h-32 md:h-40 bg-slate-900 relative overflow-hidden border-b border-white/5">
        {project.thumbnail ? (
           <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center group-hover:scale-105 transition-all duration-500">
            <Lucide.Github size={48} className="text-white/10" />
            {project.stars && project.stars > 0 && (
              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-[10px] text-amber-400 font-bold border border-white/10">
                <Lucide.Star size={10} className="fill-amber-400" /> {project.stars}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-4 md:p-5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <h3 className="text-sm md:text-base font-bold text-white truncate">{project.title}</h3>
        <p className="text-[11px] md:text-xs text-slate-400 truncate mt-1.5">{project.description || 'Brak opisu.'}</p>
        <div className="flex gap-2 mt-4 overflow-hidden">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] md:text-[10px] font-medium px-2 py-1 rounded-md bg-white/5 border border-white/5 text-slate-300 whitespace-nowrap">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-[9px] md:text-[10px] font-medium px-2 py-1 rounded-md bg-white/5 border border-white/5 text-slate-400 whitespace-nowrap">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};
