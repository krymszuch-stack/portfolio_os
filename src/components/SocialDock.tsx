/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Linkedin, Github, Instagram, Facebook, Send,
  MessageCircle, MessageSquare, Gamepad2, Phone
} from 'lucide-react';
import { OSConfig } from '../types';

interface SocialDockProps {
  config: OSConfig;
}

interface SocialLink {
  id: string;
  label: string;
  url: string;
  color: string;
  Icon: React.FC<{ size?: number; className?: string }>;
}

export const SocialDock: React.FC<SocialDockProps> = ({ config }) => {
  const isWhiteClean = config.accentColor === 'white-clean';
  const isBlackGold = config.accentColor === 'black-gold';

  const socialLinks = useMemo<SocialLink[]>(() => {
    const links: SocialLink[] = [];

    if (config.linkedinUsername) links.push({
      id: 'linkedin', label: 'LinkedIn',
      Icon: Linkedin,
      url: `https://linkedin.com/in/${config.linkedinUsername}`,
      color: 'hover:text-[#0a66c2] hover:bg-[#0a66c2]/10'
    });
    if (config.githubUsername) links.push({
      id: 'github', label: 'GitHub',
      Icon: Github,
      url: `https://github.com/${config.githubUsername}`,
      color: isWhiteClean ? 'hover:text-slate-900 hover:bg-slate-900/10' : 'hover:text-white hover:bg-white/10'
    });
    if (config.instagramUsername) links.push({
      id: 'instagram', label: 'Instagram',
      Icon: Instagram,
      url: `https://instagram.com/${config.instagramUsername}`,
      color: 'hover:text-[#e1306c] hover:bg-[#e1306c]/10'
    });
    if (config.facebookUsername) links.push({
      id: 'facebook', label: 'Facebook',
      Icon: Facebook,
      url: `https://facebook.com/${config.facebookUsername}`,
      color: 'hover:text-[#1877f2] hover:bg-[#1877f2]/10'
    });
    if (config.telegramUsername) links.push({
      id: 'telegram', label: 'Telegram',
      Icon: Send,
      url: `https://t.me/${config.telegramUsername}`,
      color: 'hover:text-[#229ed9] hover:bg-[#229ed9]/10'
    });
    if (config.whatsappPhone) links.push({
      id: 'whatsapp', label: 'WhatsApp',
      Icon: MessageCircle,
      url: `https://wa.me/${config.whatsappPhone}`,
      color: 'hover:text-[#25d366] hover:bg-[#25d366]/10'
    });
    if (config.discordId) links.push({
      id: 'discord', label: 'Discord',
      Icon: MessageSquare,
      url: 'https://discord.com',
      color: 'hover:text-[#5865f2] hover:bg-[#5865f2]/10'
    });
    if (config.steamId) links.push({
      id: 'steam', label: 'Steam',
      Icon: Gamepad2,
      url: `https://steamcommunity.com/id/${config.steamId}`,
      color: isWhiteClean ? 'hover:text-[#1b2838] hover:bg-[#1b2838]/10' : 'hover:text-[#66c0f4] hover:bg-[#66c0f4]/10'
    });
    if (config.phone) links.push({
      id: 'phone', label: 'Telefon',
      Icon: Phone,
      url: `tel:${config.phone}`,
      color: 'hover:text-emerald-400 hover:bg-emerald-400/10'
    });

    return links;
  }, [config, isWhiteClean]);

  if (socialLinks.length === 0) return null;

  const containerBg = isWhiteClean
    ? 'bg-white/90 border-slate-200 shadow-sm'
    : isBlackGold
      ? 'bg-black/90 border-amber-500/30'
      : 'bg-white/5 backdrop-blur-xl border-white/10';

  const iconBase = isWhiteClean
    ? 'bg-slate-50 border-slate-200 text-slate-500'
    : 'bg-white/5 border-white/5 text-slate-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`max-w-md rounded-2xl border px-3 py-2 flex items-center gap-1.5 flex-wrap ${containerBg}`}
    >
      {socialLinks.map((link, i) => (
        <motion.a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
          className={`relative group w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 ${iconBase} ${link.color}`}
        >
          <link.Icon size={18} />
          {/* Tooltip */}
          <span className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 pointer-events-none bg-black/85 border border-white/10 text-slate-200 px-2 py-1 rounded-lg text-[10px] font-sans font-medium whitespace-nowrap shadow-md z-50">
            {link.label}
          </span>
        </motion.a>
      ))}
    </motion.div>
  );
};
