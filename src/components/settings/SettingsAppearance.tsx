import React from 'react';
import { Loader2, Check, AlertCircle, Sparkles, Palette, Globe, Layers, Eye, Type } from 'lucide-react';
import { OSConfig } from '../../types';

interface SettingsAppearanceProps {
  localConfig: OSConfig;
  setLocalConfig: (config: OSConfig) => void;
  config: OSConfig;
  slugStatus: 'idle' | 'checking' | 'available' | 'taken' | 'invalid';
  slugErrorMsg: string;
}

export const SettingsAppearance: React.FC<SettingsAppearanceProps> = ({
  localConfig,
  setLocalConfig,
  config,
  slugStatus,
  slugErrorMsg
}) => {
  // Common style classes for modern settings items
  const cardClass = "bg-white p-5 border border-slate-200/60 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4";
  const headerClass = "text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2";
  const descClass = "text-xs text-slate-400 font-medium leading-relaxed mt-1";

  const getButtonClass = (isSelected: boolean) => {
    return `p-3 text-left border rounded-xl transition-all flex flex-col justify-between cursor-pointer ${
      isSelected
        ? 'bg-purple-50/60 border-purple-500 text-purple-950 font-semibold ring-1 ring-purple-500 shadow-sm'
        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 shadow-sm'
    }`;
  };

  const getMiniButtonClass = (isSelected: boolean) => {
    return `p-2 text-left border rounded-xl transition-all text-xs flex flex-col justify-center leading-normal cursor-pointer ${
      isSelected
        ? 'bg-purple-50/60 border-purple-500 text-purple-950 font-bold ring-1 ring-purple-500 shadow-sm'
        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
    }`;
  };

  if (config.viewerMode) {
    return (
      <div className="space-y-6">
        <div className={cardClass}>
          <h3 className={headerClass}>
            <Palette size={16} className="text-purple-500" />
            <span>Wybór Motywu Systemu</span>
          </h3>
          <p className={descClass}>
            Możesz spersonalizować wygląd mojego portfolio wybierając jeden z predefiniowanych, dopracowanych motywów.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { id: 'terraria', name: '🌳 Terraria Forest', desc: 'Szmaragdowa zieleń, ziemisty brąz' },
              { id: 'cyberpunk', name: '🌆 Cyber Neon', desc: 'Czerń i jaskrawe, neonowe kontury' },
              { id: 'mono-terminal', name: '📟 Tryb Hacker / Terminal', desc: 'Matrixowy zielony monochrom' },
              { id: 'white-clean', name: '🕊️ Minimalist Light', desc: 'Minimalistyczna biel z subtelnymi krawędziami' },
            ].map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  if (theme.id === 'mono-terminal') {
                    setLocalConfig({ ...localConfig, systemTheme: 'cyberpunk', accentColor: 'mono-terminal', themePack: 'mono-terminal', portfolioStyle: 'modern' });
                  } else if (theme.id === 'white-clean') {
                    setLocalConfig({ ...localConfig, systemTheme: 'terraria', accentColor: 'white-clean', themePack: 'white-clean', portfolioStyle: 'modern' });
                  } else {
                    setLocalConfig({ ...localConfig, systemTheme: theme.id as any, portfolioStyle: 'modern' });
                  }
                }}
                className={getButtonClass(localConfig.systemTheme === theme.id || localConfig.accentColor === theme.id)}
              >
                <span className="font-bold text-xs">{theme.name}</span>
                <span className="text-[10px] text-slate-400 mt-1 font-medium leading-none">{theme.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 0. Główny Styl Portfolio */}
      <div className={cardClass}>
        <h3 className={headerClass}>
          <Palette size={16} className="text-purple-500" />
          <span>Główny Styl Portfolio</span>
        </h3>
        <p className={descClass}>Zdecyduj jak inni zobaczą Twoje Portfolio (np. jako strona główna)</p>
        <div className="grid grid-cols-1 gap-2 pt-1">
          {[
            { id: 'modern', name: '✨ Modern Glassmorphism', desc: 'Szkło, płynne blaski neonów, nowoczesny desktop' }
          ].map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setLocalConfig({ 
                ...localConfig, 
                portfolioStyle: style.id as any
              })}
              className={getButtonClass(localConfig.portfolioStyle === style.id)}
            >
              <span className="font-bold text-xs">{style.name}</span>
              <span className="text-[10px] text-slate-400 mt-1 font-medium leading-none">{style.desc}</span>
            </button>
          ))}
        </div>

        {/* 0.5. Icon Style Variants Selection */}
        <div className="border-t border-slate-100 pt-4 mt-2 space-y-3">
          <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wide">Wybierz wariant ikon dla stylu Modern (Lumine)</h4>
          <p className="text-[10px] text-slate-400 font-semibold uppercase leading-none">Dostępnych jest 11 ekskluzywnych stylów poświaty i kompozycji szklanej:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 border border-slate-100 p-2 rounded-2xl bg-slate-50/50">
            {[
              { id: 'lumine-ubuntu-style', name: '🍊 Ubuntu Classic Style', desc: 'Ciepły, gładki gradient pomarańczu i oberżyny w stylu systemu Ubuntu' },
              { id: 'lumine-minimalist-glass', name: '💎 Minimalist Glass', desc: 'Czyste szkło, wysoki biały półcień i lekka poświata' },
              { id: 'lumine-neon-glow', name: '🧪 Neon Glow', desc: 'Głęboka czerń otoczona laserową poświatą Cyan' },
              { id: 'lumine-cyberpunk-gold', name: '🪙 Cyberpunk Gold', desc: 'Pajęczyna złotych mikropatternów z bursztynowym blaskiem' },
              { id: 'lumine-aurora-hologram', name: '🎨 Aurora Hologram', desc: 'Wielobarwne pastelowe przejścia fioletu, różu i błękitu' },
              { id: 'lumine-dark-slate-chrome', name: '🔗 Dark Slate Chrome', desc: 'Matowa, szczotkowana stal z chromowanym obrzeżem' },
              { id: 'lumine-vaporwave-sunset', name: '🦇 Vaporwave Sunset', desc: 'Fuksjowo-różowe gradienty rodem z lat 80-tych' },
              { id: 'lumine-forest-emerald', name: '🌿 Forest Emerald', desc: 'Głęboki jadeit leśny rozświetlony szmaragdowym pyłem' },
              { id: 'lumine-cosmic-nebula', name: '🔮 Cosmic Nebula', desc: 'Mistyczna poświata fioletu i kosmicznych obłoków' },
              { id: 'lumine-solar-flare', name: '☀️ Solar Flare', desc: 'Dynamiczna, magnetyczna eksplozja słonecznego pomarańczu' },
              { id: 'lumine-monochromatic-carbon', name: '🖤 Monochromatic Carbon', desc: 'Ciemna, karbonowa, minimalistyczna elegancja bez neonów' }
            ].map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setLocalConfig({ ...localConfig, iconStyleModern: variant.id })}
                className={getMiniButtonClass((localConfig.iconStyleModern || 'lumine-minimalist-glass') === variant.id)}
              >
                <span className="font-bold text-[11px]">{variant.name}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 leading-none font-medium">{variant.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 0.8. Adres Publiczny Portfolio (Slug) */}
      <div className={cardClass}>
        <h3 className={headerClass}>
          <Globe size={16} className="text-purple-500" />
          <span>Adres Publiczny (Slug)</span>
        </h3>
        <p className={descClass}>
          Ustaw własny adres do Twojego portfolio (np. mojadomena.com/p/<strong>twoj-adres</strong>). Pozostaw puste, by system wygenerował go losowo.
        </p>
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <span className="text-xs font-mono font-bold text-slate-400">/p/</span>
            <input
              type="text"
              placeholder="np. jan-kowalski"
              value={localConfig.customSlug || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, customSlug: e.target.value.toLowerCase() })}
              className="flex-grow bg-transparent font-mono text-sm font-bold text-slate-800 focus:outline-none"
            />
          </div>
          <div className="min-h-[20px] flex items-center pl-1">
            {slugStatus === 'checking' && <span className="text-xs text-blue-600 font-bold flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Sprawdzanie dostępności...</span>}
            {slugStatus === 'available' && <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><Check size={12} /> Ten adres jest wolny!</span>}
            {(slugStatus === 'invalid' || slugStatus === 'taken') && <span className="text-xs text-rose-600 font-bold flex items-center gap-1"><AlertCircle size={12} className="shrink-0" /> {slugErrorMsg}</span>}
            {slugStatus === 'idle' && localConfig.customSlug === config.customSlug && localConfig.customSlug && <span className="text-xs text-slate-400 font-bold">Adres aktywny.</span>}
          </div>
        </div>
      </div>

      {/* 1. System Theme Presets */}
      <div className={cardClass}>
        <h3 className={headerClass}>
          <Palette size={16} className="text-purple-500" />
          <span>1. Motyw Graficzny (Gradienty i Styl)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {[
            { id: 'terraria', name: '🌳 Terraria Forest', desc: 'Szmaragdowa zieleń, ziemisty brąz' },
            { id: 'classic-mac', name: '💻 Classic Mac', desc: 'Retro szarość, idealne piksele 1991' },
            { id: 'cyberpunk', name: '🌆 Cyber Neon', desc: 'Czerń i jaskrawe, neonowe kontury' },
            { id: 'retro-gold', name: '🪙 Retro Gold', desc: 'Ciepły mosiądz, złote i miedziane tony' }
          ].map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setLocalConfig({ ...localConfig, systemTheme: theme.id as any })}
              className={getButtonClass(localConfig.systemTheme === theme.id)}
            >
              <span className="font-bold text-xs">{theme.name}</span>
              <span className="text-[10px] text-slate-400 mt-1 font-medium leading-none">{theme.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Window Frame Design */}
      <div className={cardClass}>
        <h3 className={headerClass}>
          <Layers size={16} className="text-purple-500" />
          <span>2. Styl Ramki Okien</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {[
            { id: 'curved-classic', name: '💻 Zaokrąglony Mac', desc: 'Klasyczne linie retro' },
            { id: 'sharp-chunky', name: '🧱 Terraria Blocky', desc: 'Klockowe, grube kontury' }
          ].map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setLocalConfig({ ...localConfig, windowStyle: style.id as any })}
              className={getButtonClass(localConfig.windowStyle === style.id)}
            >
              <span className="font-bold text-xs">{style.name}</span>
              <span className="text-[10px] text-slate-400 mt-1 font-medium leading-none">{style.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2.5. Kompozycja kolorów i motyw główny */}
      <div className={cardClass}>
        <h3 className={headerClass}>
          <Palette size={16} className="text-purple-500" />
          <span>2.5. Kolorystyka i Motyw Główny</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          {[
            { id: 'black-gold', name: '👑 Opaque Black', desc: 'Matowa czerń, złoto' },
            { id: 'white-clean', name: '🕊️ White Clean', desc: 'Czysta retro biel' },
            { id: 'purple', name: '🔮 Deep Purple', desc: 'Neonowy fiolet' },
            { id: 'cyan', name: '💎 Laser Cyan', desc: 'Morski błękit' },
            { id: 'orange', name: '🔥 Solar Orange', desc: 'Gorący pomarańcz' },
            { id: 'emerald', name: '🌿 Forest Emerald', desc: 'Szmaragdowa zieleń' },
            { id: 'amber-retro', name: '📟 Amber Retro', desc: 'Ciepły bursztyn CRT' },
            { id: 'mono-terminal', name: '📟 Green Terminal', desc: 'Matrixowy zielony' }
          ].map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => setLocalConfig({ 
                ...localConfig, 
                accentColor: color.id as any,
                themePack: color.id as any
              })}
              className={getMiniButtonClass(localConfig.accentColor === color.id)}
            >
              <span className="font-bold text-[11px]">{color.name}</span>
              <span className="text-[9px] text-slate-400 mt-0.5 leading-none font-medium">{color.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Dynamic Particles Selector */}
      <div className={cardClass}>
        <h3 className={headerClass}>
          <Sparkles size={16} className="text-purple-500" />
          <span>3. Efekty Cząsteczkowe w Tle</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {[
            { id: 'leaves', name: '🍃 Spadające Liście', desc: 'Liście z dżungli Terrarii' },
            { id: 'sparkles', name: '✨ Magiczne Iskry', desc: 'Świetliste piksele kurzu' },
            { id: 'bubbles', name: '🫧 Bąbelki Powietrza', desc: 'Relaksujący motyw wodny' },
            { id: 'none', name: '🚫 Wyłączone', desc: 'Czysty pulpit, maksymalna płynność' }
          ].map((pt) => (
            <button
              key={pt.id}
              type="button"
              onClick={() => setLocalConfig({ ...localConfig, particles: pt.id as any })}
              className={getButtonClass(localConfig.particles === pt.id)}
            >
              <span className="font-bold text-xs">{pt.name}</span>
              <span className="text-[10px] text-slate-400 mt-1 font-medium leading-none">{pt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3.5. Ułatwienia dostępu i zaawansowany design */}
      <div className={cardClass}>
        <h3 className={headerClass}>
          <Eye size={16} className="text-purple-500" />
          <span>3.5. Ułatwienia dostępu i design</span>
        </h3>
        <p className={descClass}>Skalowanie czcionek dla lepszej czytelności oraz dodatkowe parametry interfejsu</p>

        {/* Font size adjustment slider */}
        <div className="space-y-2 bg-slate-50 border border-slate-150 rounded-2xl p-3.5 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-slate-700 uppercase">Rozmiar Czcionki Systemowej:</span>
            <span className="text-xs font-black bg-purple-50 px-2.5 py-0.5 border border-purple-200 rounded-lg text-purple-700">
              {Math.round((localConfig.fontSizeScale || 1.0) * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3 py-1">
            <span className="text-xs font-bold text-slate-400">A</span>
            <input
              type="range"
              min="0.8"
              max="3.0"
              step="0.05"
              value={localConfig.fontSizeScale || 1.0}
              onChange={(e) => setLocalConfig({ ...localConfig, fontSizeScale: parseFloat(e.target.value) })}
              className="flex-grow accent-purple-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-bold text-slate-700">A</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal font-semibold">Skaluje tekst całego interfejsu, aby ułatwić czytanie na mniejszych ekranach.</p>
        </div>

        {/* Design details row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Glass blur select */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Rozmycie tła szkła:</span>
            <select
              value={localConfig.glassBlur || 'medium'}
              onChange={(e) => setLocalConfig({ ...localConfig, glassBlur: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="none">Brak (Przezroczyste)</option>
              <option value="low">Lekkie (Low)</option>
              <option value="medium">Średnie (Medium)</option>
              <option value="high">Mocne (High)</option>
            </select>
          </div>

          {/* Border style select */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Obramowanie okien:</span>
            <select
              value={localConfig.borderStyle || 'thin'}
              onChange={(e) => setLocalConfig({ ...localConfig, borderStyle: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="none">Brak obramowania</option>
              <option value="thin">Cienka ramka</option>
              <option value="thick">Gruba retro ramka</option>
              <option value="double">Podwójna retro ramka</option>
            </select>
          </div>
        </div>

        {/* Czcionka selection */}
        <div className="space-y-2 pt-4 border-t border-slate-100 mt-2">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase block flex items-center gap-1.5">
            <Type size={12} className="text-purple-500" />
            <span>Czcionka Interfejsu (Font):</span>
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'apple', name: '🍎 Apple SF', desc: 'System-ui' },
              { id: 'ubuntu', name: '🍊 Ubuntu', desc: 'Classic Linux' },
              { id: 'inter', name: '💎 Inter', desc: 'Modern Sans' },
              { id: 'retro', name: '👾 8-Bit', desc: 'Pixel Mono' }
            ].map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => setLocalConfig({ ...localConfig, systemFont: font.id as any })}
                className={getMiniButtonClass(localConfig.systemFont === font.id)}
              >
                <span className="font-bold text-[11px]">{font.name}</span>
                <span className="text-[9px] text-slate-400 font-normal mt-0.5">{font.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
