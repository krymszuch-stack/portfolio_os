/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Certificate } from '../types';
import { Award, ShieldCheck, ShieldAlert, Plus, Trash2, Link } from 'lucide-react';

interface AppCertificatesProps {
  certificates: Certificate[];
  setCertificates: React.Dispatch<React.SetStateAction<Certificate[]>>;
}

export const AppCertificates: React.FC<AppCertificatesProps> = ({
  certificates,
  setCertificates
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
    verified: true
  });

  const handleCreate = () => {
    if (!newCert.title.trim()) return;

    const created: Certificate = {
      id: `cert-${Date.now()}`,
      title: newCert.title.trim(),
      issuer: newCert.issuer.trim() || '',
      date: newCert.date.trim() || '',
      description: newCert.description.slice(0, 500) || '',
      verified: newCert.verified
    };

    setCertificates(prev => [created, ...prev]);
    setIsAdding(false);
    setNewCert({
      title: '',
      issuer: '',
      date: '',
      description: '',
      verified: true
    });
  };

  const handleToggleVerify = (id: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, verified: !c.verified };
      }
      return c;
    }));
  };

  const handleDelete = (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-sans font-semibold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-pink-400" />
            Zweryfikowane Certyfikaty & Kwalifikacje
          </h3>
          <p className="text-xs text-slate-400">
            Przeglądaj oficjalnie zatwierdzone certyfikaty deweloperskie i projektowe. Kliknij tarczę weryfikacji, aby przełączyć jej status.
          </p>
        </div>

        <button
          id="btn-trigger-add-cert"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-lg hover:bg-pink-500/20 transition-all font-sans font-medium"
        >
          <Plus size={14} /> Dodaj Certyfikat
        </button>
      </div>

      {/* Inline Creation Form */}
      {isAdding && (
        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 space-y-4">
          <h4 className="text-xs font-sans font-semibold text-white">Dodaj nowy certyfikat</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono">
                Nazwa certyfikatu <span className="text-rose-500 font-bold">*</span>
              </span>
              <input
                type="text"
                placeholder="np. Certified Kubernetes Administrator (CKA)"
                value={newCert.title}
                onChange={(e) => setNewCert(c => ({ ...c, title: e.target.value }))}
                className={`w-full px-2.5 py-1.5 bg-slate-950/60 border ${!newCert.title.trim() ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-pink-500'} rounded-lg text-xs text-white focus:outline-none transition-colors`}
              />
              {!newCert.title.trim() && (
                <span className="text-[9px] text-rose-500 font-mono mt-0.5 block">✦ Nazwa certyfikatu jest wymagana!</span>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="addCertIssuer" className="text-[10px] text-slate-400 uppercase font-mono">Wystawca</label>
              <input
                id="addCertIssuer"
                type="text"
                placeholder="np. Linux Foundation / Google / Meta"
                value={newCert.issuer}
                onChange={(e) => setNewCert(c => ({ ...c, issuer: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Data przyznania</span>
              <input
                type="text"
                placeholder="np. Styczeń 2026"
                value={newCert.date}
                onChange={(e) => setNewCert(c => ({ ...c, date: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="space-y-1 col-span-2">
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="addCertDescription" className="text-[10px] text-slate-400 uppercase font-mono">Krótki opis</label>
                <span className={`text-[10px] font-mono ${newCert.description.length > 500 ? 'text-rose-500 font-bold animate-pulse' : 'text-slate-400'}`}>
                  {newCert.description.length} / 500
                </span>
              </div>
              <textarea
                id="addCertDescription"
                placeholder="Zagadnienia objęte certyfikacją..."
                value={newCert.description}
                rows={2}
                maxLength={500}
                onChange={(e) => setNewCert(c => ({ ...c, description: e.target.value.slice(0, 500) }))}
                className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="check-verified"
                checked={newCert.verified}
                onChange={(e) => setNewCert(c => ({ ...c, verified: e.target.checked }))}
                className="rounded accent-pink-500 bg-slate-900 border-slate-700"
              />
              <label htmlFor="check-verified" className="text-xs text-slate-300">Zweryfikowany (Sygnowany kryptograficznie)</label>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              id="btn-save-new-cert"
              onClick={handleCreate}
              disabled={!newCert.title.trim() || newCert.description.length > 500}
              className="px-3 py-1 bg-pink-500 hover:bg-pink-600 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 text-xs font-semibold rounded disabled:cursor-not-allowed transition-colors"
            >
              Stwórz wpis
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs rounded cursor-pointer"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-2xl bg-slate-900/10 hover:bg-slate-900/25 border border-slate-800/80 hover:border-pink-500/20 transition-all duration-300 flex flex-col justify-between group relative"
          >
            {/* Decorative soft glowing bubble inside card */}
            {cert.verified && (
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
            )}

            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-1.5 overflow-hidden">
                    {cert.logoUrl ? (
                      <img
                        src={cert.logoUrl}
                        alt={cert.issuer}
                        className="w-full h-full object-contain filter brightness-90 group-hover:brightness-100 transition-all"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Award className="w-6 h-6 text-pink-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-sans font-bold text-white leading-tight">
                      {cert.title}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {cert.issuer} • {cert.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {/* Verified toggle button */}
                  <button
                    id={`btn-verify-toggle-${cert.id}`}
                    onClick={() => handleToggleVerify(cert.id)}
                    className="p-1 rounded-md bg-slate-950/40 hover:bg-slate-900 border border-slate-800 text-slate-400 transition-colors"
                    title={cert.verified ? "Zweryfikowano (Kliknij aby odznaczyć)" : "Niezweryfikowano (Kliknij aby zweryfikować)"}
                  >
                    {cert.verified ? (
                      <ShieldCheck size={14} className="text-emerald-400" />
                    ) : (
                      <ShieldAlert size={14} className="text-amber-500" />
                    )}
                  </button>

                  <button
                    id={`btn-delete-cert-${cert.id}`}
                    onClick={() => handleDelete(cert.id)}
                    className="p-1 rounded-md bg-slate-950/40 hover:bg-rose-500/10 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Usuń certyfikat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans font-light">
                {cert.description}
              </p>
            </div>

            {/* Verification signature details */}
            <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                ID: {cert.id.toUpperCase()}
              </span>

              {cert.verified ? (
                <div className="flex items-center space-x-1 text-[10px] font-mono font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>KRYPTOGRAFICZNIE ZWERYFIKOWANY</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-500">
                  <span>Weryfikacja w toku</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Glowing "+" Certificate Card */}
        <button
          onClick={() => setIsAdding(true)}
          className="p-5 rounded-2xl bg-pink-500/5 hover:bg-pink-500/10 border-2 border-dashed border-pink-500/20 hover:border-pink-400/50 transition-all duration-300 flex flex-col items-center justify-center group relative"
        >
          <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform shadow-lg">
            <Plus className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-xs font-sans font-bold text-pink-300 uppercase tracking-widest mt-2">Dodaj Nowy Certyfikat</span>
          <p className="text-[10px] text-slate-500 font-sans mt-1">Prześlij osiągnięcie lub certyfikat</p>
        </button>
      </div>
    </div>
  );
};
