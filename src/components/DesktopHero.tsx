/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Download, Mail, Sparkles } from 'lucide-react';
import { OSConfig } from '../types';

interface DesktopHeroProps {
  config: OSConfig;
  onOpenContact: () => void;
  onLaunchGenerator?: () => void;
}

const getAccentClasses = (accentColor: string) => {
  const map: Record<string, { border: string; text: string; btnBg: string; btnText: string; avatarBorder: string; subtleBg: string }> = {
    purple: { border: 'border-purple-500/30', text: 'text-purple-400', btnBg: 'bg-purple-500 hover:bg-purple-600', btnText: 'text-white', avatarBorder: 'border-purple-500/50', subtleBg: 'bg-purple-500/10' },
    cyan: { border: 'border-cyan-500/30', text: 'text-cyan-400', btnBg: 'bg-cyan-500 hover:bg-cyan-600', btnText: 'text-white', avatarBorder: 'border-cyan-500/50', subtleBg: 'bg-cyan-500/10' },
    orange: { border: 'border-orange-500/30', text: 'text-orange-400', btnBg: 'bg-orange-500 hover:bg-orange-600', btnText: 'text-white', avatarBorder: 'border-orange-500/50', subtleBg: 'bg-orange-500/10' },
    emerald: { border: 'border-emerald-500/30', text: 'text-emerald-400', btnBg: 'bg-emerald-500 hover:bg-emerald-600', btnText: 'text-white', avatarBorder: 'border-emerald-500/50', subtleBg: 'bg-emerald-500/10' },
    'amber-retro': { border: 'border-yellow-500/40', text: 'text-yellow-400', btnBg: 'bg-yellow-500 hover:bg-yellow-600', btnText: 'text-black', avatarBorder: 'border-yellow-500/50', subtleBg: 'bg-yellow-500/10' },
    'mono-terminal': { border: 'border-green-500/40', text: 'text-green-400', btnBg: 'bg-green-500 hover:bg-green-600', btnText: 'text-black', avatarBorder: 'border-green-500/50', subtleBg: 'bg-green-500/10' },
    'black-gold': { border: 'border-amber-500/80', text: 'text-amber-400', btnBg: 'bg-amber-500 hover:bg-amber-600', btnText: 'text-black', avatarBorder: 'border-amber-500/60', subtleBg: 'bg-amber-500/10' },
    'white-clean': { border: 'border-slate-300/80', text: 'text-slate-600', btnBg: 'bg-slate-800 hover:bg-slate-900', btnText: 'text-white', avatarBorder: 'border-slate-400', subtleBg: 'bg-slate-100' }
  };
  return map[accentColor] || map.purple;
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0]?.[0] || 'P').toUpperCase();
};

export const DesktopHero: React.FC<DesktopHeroProps> = ({ config, onOpenContact, onLaunchGenerator }) => {
  const accent = getAccentClasses(config.accentColor || 'purple');
  const isWhiteClean = config.accentColor === 'white-clean';
  const isBlackGold = config.accentColor === 'black-gold';

  const displayName = config.fullName || config.portfolioName || 'Portfolio OS';
  const role = config.professionalRole || config.title || config.portfolioBio || '';
  const initials = getInitials(displayName);

  const cardBg = isWhiteClean
    ? 'bg-white/90 border-slate-200 shadow-lg'
    : isBlackGold
      ? 'bg-black/90 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.08)]'
      : `bg-white/5 backdrop-blur-xl ${accent.border} shadow-2xl`;

  const nameColor = isWhiteClean ? 'text-slate-900' : 'text-white';
  const subtextColor = isWhiteClean ? 'text-slate-500' : 'text-white/60';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-2xl w-full rounded-3xl border p-6 md:p-8 ${cardBg}`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 md:gap-6">
        {/* Avatar */}
        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 ${accent.avatarBorder} flex-shrink-0 overflow-hidden flex items-center justify-center ${accent.subtleBg}`}>
          {config.avatarUrl ? (
            <img
              src={config.avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className={`text-2xl md:text-3xl font-bold ${accent.text}`}>
              {initials}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div>
            <h1 className={`text-xl md:text-2xl font-bold tracking-tight ${nameColor}`}>
              {displayName}
            </h1>
            {role && (
              <p className={`text-sm mt-1 font-medium ${accent.text}`}>
                {role}
              </p>
            )}
            {config.address && (
              <p className={`text-xs mt-1.5 flex items-center gap-1 ${subtextColor} justify-center sm:justify-start`}>
                <MapPin size={12} className="flex-shrink-0" />
                <span>{config.address}</span>
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start pt-1">
            {config.cvUrl ? (
              <a
                href={config.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${accent.btnBg} ${accent.btnText} shadow-lg hover:shadow-xl hover:scale-[1.02]`}
              >
                <Download size={14} />
                Pobierz CV
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 text-white/30 cursor-not-allowed border border-white/5"
              >
                <Download size={14} />
                Pobierz CV
              </button>
            )}
            <button
              onClick={onOpenContact}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${accent.border} ${accent.text} hover:bg-white/5 hover:scale-[1.02] cursor-pointer`}
            >
              <Mail size={14} />
              Napisz do mnie
            </button>
            {onLaunchGenerator && (
              <button
                onClick={onLaunchGenerator}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 hover:scale-[1.02] cursor-pointer animate-pulse"
              >
                <Sparkles size={14} className="text-yellow-400" />
                Stwórz własne portfolio
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
