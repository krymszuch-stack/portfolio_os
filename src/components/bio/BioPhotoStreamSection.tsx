import React, { useState } from 'react';
import { OSConfig } from '../../types';
import { Plus, Trash2, Instagram } from 'lucide-react';

interface BioPhotoStreamSectionProps {
  config: OSConfig;
  setConfig: React.Dispatch<React.SetStateAction<OSConfig>>;
}

export const BioPhotoStreamSection: React.FC<BioPhotoStreamSectionProps> = ({ config, setConfig }) => {
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setConfig(prev => ({
      ...prev,
      instagramPhotos: [...(prev.instagramPhotos || []), newPhotoUrl.trim()]
    }));
    setNewPhotoUrl('');
    setIsAddingPhoto(false);
  };

  const handleDeletePhoto = (urlToDelete: string) => {
    setConfig(prev => ({
      ...prev,
      instagramPhotos: (prev.instagramPhotos || []).filter(u => u !== urlToDelete)
    }));
  };

  return (
    <div className="space-y-4 pt-4 border-t border-white/10/50">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-sans font-semibold text-white flex items-center gap-1.5">
            <Instagram size={16} className="text-purple-400" />
            Galeria Zdjęć Instagram Feed
          </h3>
          <p className="text-xs text-slate-400">
            Konfiguruj własną dynamiczną sekcję zdjęć. Najedź na zdjęcie, aby je usunąć, lub kliknij "+", aby dodać nowe.
          </p>
        </div>

        {isAddingPhoto ? (
          <div className="flex items-center gap-1.5 p-2 backdrop-blur-md bg-slate-950/60 border border-white/10 rounded-xl max-w-xs animate-fadeIn">
            <input
              type="text"
              placeholder="Wklej URL zdjęcia..."
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              className="px-2 py-1 backdrop-blur-md bg-slate-900/60 border border-white/10 rounded text-xs text-white focus:outline-none"
            />
            <button
              onClick={handleAddPhoto}
              className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-slate-950 text-xs font-semibold rounded cursor-pointer"
            >
              Zapisz
            </button>
            <button
              onClick={() => setIsAddingPhoto(false)}
              className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded cursor-pointer"
            >
              Anuluj
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setIsAddingPhoto(true); setNewPhotoUrl(''); }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all font-sans font-medium cursor-pointer animate-pulse"
          >
            <Plus size={14} /> Dodaj Zdjęcie
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(config.instagramPhotos || []).map((photoUrl, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
            <img
              src={photoUrl}
              alt={`Instagram image ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity p-2 text-center gap-2">
              <span className="text-[10px] text-slate-300 font-mono truncate max-w-full">
                {photoUrl.substring(0, 25)}...
              </span>
              <button
                onClick={() => handleDeletePhoto(photoUrl)}
                className="px-2 py-1 bg-rose-500/80 hover:bg-rose-600 text-white text-[10px] rounded font-semibold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={10} /> Usuń
              </button>
            </div>
          </div>
        ))}

        {/* Glowing '+' placeholder card at the end */}
        <button
          onClick={() => { setIsAddingPhoto(true); setNewPhotoUrl(''); }}
          className="relative aspect-square rounded-xl bg-purple-500/5 hover:bg-purple-500/10 border-2 border-dashed border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.05)] hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(168,85,247,0.15)]">
            <Plus className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] font-sans font-bold text-purple-300 uppercase tracking-widest mt-2">Dodaj Zdjęcie</span>
        </button>
      </div>
    </div>
  );
};
