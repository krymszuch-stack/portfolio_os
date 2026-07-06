/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Send, Linkedin, Github, MessageSquare, Check, Sparkles } from 'lucide-react';

export const AppContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setIsSent(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Intro info box */}
      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 flex items-start gap-3 relative overflow-hidden">
        <MessageSquare className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
            Napisz bezpośrednio lub połącz się społecznościowo
          </h4>
          <p className="text-xs text-slate-400 leading-normal">
            Skorzystaj z formularza poniżej, aby wysłać bezpośrednią wiadomość (zasymulowano pełną wysyłkę z zabezpieczeniami i loaderem SMTP), bądź napisz na mediach społecznościowych.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Contact Form (Left column, 7 spans) */}
        <div className="lg:col-span-7">
          {isSent ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <Check size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-sans font-bold text-white">Wiadomość wysłana pomyślnie!</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Dziękuję za kontakt. Formularz zasymulował połączenie z API bramki pocztowej. Odpiszę na podany adres e-mail w ciągu 24 godzin.
                </p>
              </div>
              <button
                onClick={() => setIsSent(false)}
                className="px-4 py-1.5 bg-slate-900 text-xs font-sans font-medium text-slate-200 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Wyślij kolejną wiadomość
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Twoje imię / nazwa firmy</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                    placeholder="np. Jan Kowalski"
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Adres e-mail *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                    placeholder="np. jan@domena.com"
                    className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Temat wiadomości</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(f => ({ ...f, subject: e.target.value }))}
                  placeholder="np. Zapytanie o projekt strony portfolio"
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Treść wiadomości *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
                  placeholder="Napisz krótko nad jakim projektem pracujesz i czego potrzebujesz..."
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 px-4 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/10 transition-all"
              >
                {isSending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Wysyłanie bezpiecznego pakietu pocztowego...
                  </>
                ) : (
                  <>
                    <Send size={13} /> Wyślij Wiadomość
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Directory cards (Right column, 5 spans) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <h4 className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">Kanały Kontaktu</h4>
            <p className="text-[11px] text-slate-500 font-sans">Moje oficjalne profile społecznościowe i komunikatory.</p>
          </div>

          {/* Social connections cards - 4x2 Premium Grid for Primary Group */}
          <div className="grid grid-cols-4 gap-3">
            {/* GitHub */}
            <a
              href="https://github.com/adrianowicz11"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 hover:bg-white/10 border border-slate-800/80 hover:border-slate-500/30 transition-all duration-300 group text-center relative"
              title="GitHub"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-white/80 group-hover:text-white transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576 4.765-1.583 8.2-6.086 8.2-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1.5 group-hover:text-white truncate max-w-full">GitHub</span>
            </a>

            {/* GitLab */}
            <a
              href="https://gitlab.com/adrianowicz"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 hover:bg-[#fc6d26]/10 border border-slate-800/80 hover:border-[#fc6d26]/40 transition-all duration-300 group text-center relative"
              title="GitLab"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-slate-400 group-hover:text-[#fc6d26] transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="m23.73 10.39-1.2-3.69a.74.74 0 0 0-.29-.39.73.73 0 0 0-.47-.11.75.75 0 0 0-.41.18.73.73 0 0 0-.21.36l-2.24 6.89H8.09l-2.24-6.89a.78.78 0 0 0-.22-.36.75.75 0 0 0-.4-.18.78.78 0 0 0-.48.11.77.77 0 0 0-.29.39L3.26 10.39a1.05 1.05 0 0 0 .37 1.16l8.06 5.86 8.06-5.86a1.05 1.05 0 0 0 .37-1.16M12 18.71 8.07 15.8h7.86L12 18.71Z" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1.5 group-hover:text-[#fc6d26] truncate max-w-full">GitLab</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/adrianowicz"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 hover:bg-[#0077b5]/10 border border-slate-800/80 hover:border-[#0077b5]/40 transition-all duration-300 group text-center relative"
              title="LinkedIn"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-slate-400 group-hover:text-[#0077b5] transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1.5 group-hover:text-[#0077b5] truncate max-w-full">LinkedIn</span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/adrianowicz"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 hover:bg-[#e1306c]/10 border border-slate-800/80 hover:border-[#e1306c]/40 transition-all duration-300 group text-center relative"
              title="Instagram"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-slate-400 group-hover:text-[#e1306c] transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1.5 group-hover:text-[#e1306c] truncate max-w-full">Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/adrianowicz"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 hover:bg-[#1877f2]/10 border border-slate-800/80 hover:border-[#1877f2]/40 transition-all duration-300 group text-center relative"
              title="Facebook"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-slate-400 group-hover:text-[#1877f2] transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1.5 group-hover:text-[#1877f2] truncate max-w-full">Facebook</span>
            </a>

            {/* Messenger */}
            <a
              href="https://m.me/adrianowicz"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 hover:bg-[#00B2FF]/10 border border-slate-800/80 hover:border-[#00B2FF]/40 transition-all duration-300 group text-center relative"
              title="Messenger"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-slate-400 group-hover:text-[#00B2FF] transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654a.715.715 0 0 1 .23.535l-.054 1.97c-.013.483.472.834.922.656l2.193-.87a.747.747 0 0 1 .472-.023c1.173.34 2.421.523 3.718.523 6.627 0 12-4.974 12-11.11C24 4.974 18.627 0 12 0zm5.132 14.168l-2.884-3.07a1.05 1.05 0 0 0-1.468-.03l-2.233 1.71a.345.345 0 0 1-.462-.02L7.02 9.53a.35.35 0 0 1 .035-.506l2.884-3.07a1.05 1.05 0 0 0 1.468.03l2.233 1.71a.345.345 0 0 1 .462.02l3.065 3.228a.35.35 0 0 1-.035.506z" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1.5 group-hover:text-[#00B2FF] truncate max-w-full">Messenger</span>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/adrianowicz"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 hover:bg-[#0088cc]/10 border border-slate-800/80 hover:border-[#0088cc]/40 transition-all duration-300 group text-center relative"
              title="Telegram"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-slate-400 group-hover:text-[#0088cc] transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.1.32-.14-.23.11-1.9 1.13-5.06 3.14-5.06 3.14l-2.43.83c-.41.13-.41.36 0 .49l1.87.58c.41.13.78-.13.98-.3l3.63-2.45c.16-.11.33.05.2.16l-2.93 2.71c-.26.24-.13.49.1.64l2.87 2.12c.43.32.85-.02.94-.48l1.88-8.86c.09-.43-.13-.7-.52-.59z" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1.5 group-hover:text-[#0088cc] truncate max-w-full">Telegram</span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/48123456789"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/40 hover:bg-[#25d366]/10 border border-slate-800/80 hover:border-[#25d366]/40 transition-all duration-300 group text-center relative"
              title="WhatsApp"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 text-slate-400 group-hover:text-[#25d366] transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.514-2.961-2.628-.086-.114-.705-.933-.705-1.792 0-.859.447-1.28.606-1.456.158-.175.345-.222.46-.222.114 0 .23 0 .33.005.109.004.254-.041.398.305.144.346.489 1.191.532 1.277.043.086.072.186.014.303-.058.117-.086.19-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.088.275.073.376-.044.1-.117.432-.501.547-.672.115-.171.23-.142.388-.086.158.057 1.005.474 1.178.56.172.086.287.129.33.201.043.072.043.418-.101.823z" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1.5 group-hover:text-[#25d366] truncate max-w-full">WhatsApp</span>
            </a>
          </div>

          {/* Offset Gaming Section */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="space-y-1">
              <span className="text-[9px] text-purple-400 font-mono uppercase tracking-widest font-bold">Strefa Rozrywki (Offset)</span>
              <p className="text-[10px] text-slate-500 font-sans">Moje oficjalne profile na platformach do grania oraz Discord.</p>
            </div>
            
            {/* Visual offset style - indented column of cards */}
            <div className="pl-4 border-l-2 border-purple-500/20 ml-2 space-y-2.5">
              {/* Steam */}
              <a
                href="https://steamcommunity.com/id/adrianowicz"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-900/15 hover:bg-[#00adee]/10 border border-slate-800/60 hover:border-[#00adee]/30 flex items-center justify-between transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <span className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-[#00adee] transition-all">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M11.979 0C5.378 0 0 5.378 0 11.979c0 2.124.558 4.122 1.536 5.86l5.526-2.285c.105-.183.25-.337.424-.45l2.275-3.238c.005-.096-.002-.19-.002-.287 0-1.854 1.503-3.356 3.356-3.356 1.854 0 3.356 1.502 3.356 3.356a3.357 3.357 0 0 1-3.356 3.356c-.098 0-.192-.01-.288-.016l-3.218 2.302c-.118.17-.276.307-.463.398l-5.55 2.296c1.785 1.05 3.865 1.654 6.084 1.654 6.6 0 11.979-5.379 11.979-11.979S18.58 0 11.979 0zM13.1 8.9c1.6 0 2.9 1.3 2.9 2.9s-1.3 2.9-2.9 2.9-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9zm-4.7 9.8c-.5.2-1.1 0-1.3-.5s0-1.1.5-1.3c.5-.2 1.1 0 1.3.5s-.1 1.1-.5 1.3z" />
                    </svg>
                  </span>
                  <div>
                    <h5 className="text-xs font-sans font-bold text-white group-hover:text-[#00adee] transition-colors">Steam Community</h5>
                    <p className="text-[10px] text-slate-400 font-mono">id/adrianowicz</p>
                  </div>
                </div>
                <span className="text-[9px] text-[#00adee] font-mono font-bold group-hover:translate-x-1 transition-transform">
                  PROFIL ↗
                </span>
              </a>

              {/* EA */}
              <a
                href="https://www.ea.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-900/15 hover:bg-[#ff134b]/10 border border-slate-800/60 hover:border-[#ff134b]/30 flex items-center justify-between transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <span className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-[#ff134b] transition-all">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.5h-2v-5h-1.5V10H13v6.5zm-1-7.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
                    </svg>
                  </span>
                  <div>
                    <h5 className="text-xs font-sans font-bold text-white group-hover:text-[#ff134b] transition-colors">EA Network</h5>
                    <p className="text-[10px] text-slate-400 font-mono">Adrianowicz_EA</p>
                  </div>
                </div>
                <span className="text-[9px] text-[#ff134b] font-mono font-bold group-hover:translate-x-1 transition-transform">
                  EA APP ↗
                </span>
              </a>

              {/* Ubisoft */}
              <a
                href="https://ubisoftconnect.com/"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-900/15 hover:bg-[#00ffff]/10 border border-slate-800/60 hover:border-[#00ffff]/30 flex items-center justify-between transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <span className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-[#00ffff] transition-all">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 17c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7zm-3.5-7c0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5-3.5-1.6-3.5-3.5z" />
                    </svg>
                  </span>
                  <div>
                    <h5 className="text-xs font-sans font-bold text-white group-hover:text-[#00ffff] transition-colors">Ubisoft Connect</h5>
                    <p className="text-[10px] text-slate-400 font-mono">Adrian_Ubi</p>
                  </div>
                </div>
                <span className="text-[9px] text-[#00ffff] font-mono font-bold group-hover:translate-x-1 transition-transform">
                  CONNECT ↗
                </span>
              </a>

              {/* Discord */}
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-slate-900/15 hover:bg-[#5865F2]/10 border border-slate-800/60 hover:border-[#5865F2]/30 flex items-center justify-between transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <span className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-[#5865F2] transition-all">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 1-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                      </svg>
                    </span>
                    <div>
                      <h5 className="text-xs font-sans font-bold text-white group-hover:text-[#5865F2] transition-colors">Discord Server</h5>
                      <p className="text-[10px] text-slate-400 font-mono">adrianowicz#1234</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-[#5865F2] font-mono font-bold group-hover:translate-x-1 transition-transform">
                    DOŁĄCZ ↗
                  </span>
                </a>
              </div>
          </div>

          {/* Secure verified badge */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center space-y-1 text-slate-400">
            <Sparkles size={14} className="text-purple-400 mx-auto mb-1 animate-pulse" />
            <h5 className="text-[11px] font-sans font-bold text-slate-200">Bezpieczna transmisja SSL</h5>
            <p className="text-[10px] leading-normal font-light">
              Dane wpisane w tym interfejsie są chronione i szyfrowane end-to-end. Chronimy Twoją prywatność.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
