/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { FolderOpen, ArrowRight, ExternalLink } from 'lucide-react';
import { Project, OSConfig } from '../types';

interface ProjectShowcaseProps {
  projects: Project[];
  config: OSConfig;
  onOpenProjects: () => void;
}

const getAccent = (accentColor: string) => {
  const map: Record<string, { border: string; tag: string; header: string; thumbGradient: string }> = {
    purple: { border: 'border-purple-500/20', tag: 'bg-purple-500/10 text-purple-300 border-purple-500/20', header: 'text-purple-400', thumbGradient: 'from-purple-900/60 to-purple-950/80' },
    cyan: { border: 'border-cyan-500/20', tag: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20', header: 'text-cyan-400', thumbGradient: 'from-cyan-900/60 to-cyan-950/80' },
    orange: { border: 'border-orange-500/20', tag: 'bg-orange-500/10 text-orange-300 border-orange-500/20', header: 'text-orange-400', thumbGradient: 'from-orange-900/60 to-orange-950/80' },
    emerald: { border: 'border-emerald-500/20', tag: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', header: 'text-emerald-400', thumbGradient: 'from-emerald-900/60 to-emerald-950/80' },
    'amber-retro': { border: 'border-yellow-500/20', tag: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20', header: 'text-yellow-400', thumbGradient: 'from-yellow-900/60 to-yellow-950/80' },
    'mono-terminal': { border: 'border-green-500/20', tag: 'bg-green-500/10 text-green-300 border-green-500/20', header: 'text-green-400', thumbGradient: 'from-green-900/60 to-green-950/80' },
    'black-gold': { border: 'border-amber-500/30', tag: 'bg-amber-500/10 text-amber-300 border-amber-500/30', header: 'text-amber-400', thumbGradient: 'from-amber-950/80 to-black' },
    'white-clean': { border: 'border-slate-200', tag: 'bg-slate-100 text-slate-600 border-slate-200', header: 'text-slate-700', thumbGradient: 'from-slate-200 to-slate-300' }
  };
  return map[accentColor] || map.purple;
};

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ projects, config, onOpenProjects }) => {
  const accent = getAccent(config.accentColor || 'purple');
  const isWhiteClean = config.accentColor === 'white-clean';
  const isBlackGold = config.accentColor === 'black-gold';

  const cardBg = isWhiteClean
    ? 'bg-white border-slate-200 shadow-sm'
    : isBlackGold
      ? 'bg-black/80 border-amber-500/30'
      : `bg-white/5 backdrop-blur-md ${accent.border}`;

  const titleColor = isWhiteClean ? 'text-slate-900' : 'text-white';
  const descColor = isWhiteClean ? 'text-slate-500' : 'text-white/50';

  if (projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl"
      >
        <div className={`rounded-2xl border p-8 text-center ${cardBg}`}>
          <FolderOpen size={32} className={`mx-auto mb-3 ${accent.header} opacity-50`} />
          <p className={`text-sm font-medium ${descColor}`}>
            Brak projektów — dodaj je w panelu zarządzania
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-4xl space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className={`text-sm font-bold uppercase tracking-wider ${accent.header}`}>
          Projekty
        </h2>
        <button
          onClick={onOpenProjects}
          className={`flex items-center gap-1 text-xs font-medium transition-all hover:gap-2 cursor-pointer ${accent.header} opacity-70 hover:opacity-100`}
        >
          Zobacz wszystkie
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Carousel */}
      <div
        className="flex gap-4 overflow-x-auto pb-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {projects.slice(0, 8).map((project, i) => {
          const card = (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
              className={`min-w-[260px] max-w-[300px] flex-shrink-0 rounded-2xl border overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group ${cardBg}`}
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Thumbnail */}
              <div className={`h-36 bg-gradient-to-br ${accent.thumbGradient} flex items-center justify-center relative overflow-hidden`}>
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className={`text-4xl font-black opacity-20 ${titleColor}`}>
                    {project.title[0]?.toUpperCase() || '?'}
                  </span>
                )}
                {project.link && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80">
                      <ExternalLink size={14} />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className={`text-sm font-bold truncate ${titleColor}`}>
                  {project.title}
                </h3>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${accent.tag}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );

          if (project.link) {
            return (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex-shrink-0"
              >
                {card}
              </a>
            );
          }
          return card;
        })}
      </div>
    </motion.div>
  );
};
