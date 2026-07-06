import React, { useState } from 'react';
import { OSConfig } from '../types';

interface AppSettingsProps {
  config: OSConfig;
  onSave: (newConfig: OSConfig) => void;
}

export const AppSettings: React.FC<AppSettingsProps> = ({ config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<OSConfig>({
    ...config,
    systemTheme: config.systemTheme || 'terraria',
    particles: config.particles || 'leaves',
    clockFormat: config.clockFormat || '24h',
    windowStyle: config.windowStyle || 'curved-classic',
    pixelTheme: config.pixelTheme !== false, // default true
    playSounds: config.playSounds !== false, // default true
    portfolioStyle: config.portfolioStyle || 'modern',
    fontSizeScale: config.fontSizeScale || 1.0,
    glassBlur: config.glassBlur || 'medium',
    borderStyle: config.borderStyle || 'thin',
  });

  const handleSave = () => {
    onSave(localConfig);
    // Custom audio confirmation
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext && localConfig.playSounds) {
        const ctx = new AudioContext();
        // A magical 2-note ascending chord (save success)
        const playBeep = (freq: number, delay: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.04, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.15);
        };
        playBeep(440, 0);
        playBeep(880, 0.1);
      }
    } catch (e) {}
  };

  return (
    <div className="p-4 text-black font-mono space-y-6 max-h-[80vh] overflow-y-auto select-none">
      <div className="border-b-2 border-black pb-2 mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-blue-900">Ustawienia AdrianOS</h2>
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Dostosuj 8-bitowy świat swojego portfolio</p>
      </div>

      {/* 0. Główny Styl Portfolio */}
      <div className="space-y-4 bg-[#f9f9f9] p-3 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
        <div>
          <h3 className="text-sm font-bold text-black border-l-4 border-blue-600 pl-2 uppercase">Główny Styl Portfolio</h3>
          <p className="text-[10px] text-gray-500 font-bold leading-tight uppercase mt-1">Zdecyduj jak inni zobaczą Twoje Portfolio (np. jako strona główna)</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'modern', name: '🌌 Modern Glassmorphism', desc: 'Szkło, płynne blaski neonów, nowoczesny desktop' },
            { id: 'retro', name: '🕹️ Retro 8-Bit Pixel', desc: 'Pikselowy świat RPG, spadające liście' }
          ].map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setLocalConfig({ 
                ...localConfig, 
                portfolioStyle: style.id as any,
                // Automatically switch accompanying theme preset to make it look cohesive
                pixelTheme: style.id === 'retro'
              })}
              className={`p-3 text-left border-2 border-black rounded transition-all flex flex-col justify-between ${
                localConfig.portfolioStyle === style.id
                  ? 'bg-yellow-100 border-yellow-600 ring-2 ring-black'
                  : 'bg-[#F0F0F0] hover:bg-[#E5E5E5]'
              }`}
            >
              <span className="font-bold text-xs">{style.name}</span>
              <span className="text-[9px] text-gray-500 mt-1 font-semibold leading-none">{style.desc}</span>
            </button>
          ))}
        </div>

        {/* 0.5. Icon Style Variants Selection based on chosen Portfolio Style */}
        <div className="border-t border-gray-200 pt-3 mt-1 space-y-2">
          {localConfig.portfolioStyle === 'modern' ? (
            <>
              <h4 className="text-xs font-bold text-blue-900 uppercase">Wybierz wariant ikon dla stylu Modern (Lumine)</h4>
              <p className="text-[9px] text-gray-500 font-semibold uppercase leading-none mb-1">Dostępnych jest 10 ekskluzywnych stylów poświaty i kompozycji szklanej:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1 border border-gray-200 p-1.5 rounded bg-white">
                {[
                  { id: 'lumine-minimalist-glass', name: '🌌 Minimalist Glass', desc: 'Czyste szkło, wysoki biały półcień i lekka poświata' },
                  { id: 'lumine-neon-glow', name: '🧪 Neon Glow', desc: 'Głęboka czerń otoczona laserową poświatą Cyan' },
                  { id: 'lumine-cyberpunk-gold', name: '🪙 Cyberpunk Gold', desc: 'Pajęczyna złotych mikropatternów z bursztynowym blaskiem' },
                  { id: 'lumine-aurora-hologram', name: '🎨 Aurora Hologram', desc: 'Wielobarwne pastelowe przejścia fioletu, różu i błękitu' },
                  { id: 'lumine-dark-slate-chrome', name: '⛓️ Dark Slate Chrome', desc: 'Matowa, szczotkowana stal z chromowanym obrzeżem' },
                  { id: 'lumine-vaporwave-sunset', name: '🌇 Vaporwave Sunset', desc: 'Fuksjowo-różowe gradienty rodem z lat 80-tych' },
                  { id: 'lumine-forest-emerald', name: '🍃 Forest Emerald', desc: 'Głęboki jadeit leśny rozświetlony szmaragdowym pyłem' },
                  { id: 'lumine-cosmic-nebula', name: '🔮 Cosmic Nebula', desc: 'Mistyczna poświata fioletu i kosmicznych obłoków' },
                  { id: 'lumine-solar-flare', name: '☀️ Solar Flare', desc: 'Dynamiczna, magnetyczna eksplozja słonecznego pomarańczu' },
                  { id: 'lumine-monochromatic-carbon', name: '🥷 Monochromatic Carbon', desc: 'Ciemna, karbonowa, minimalistyczna elegancja bez neonów' }
                ].map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setLocalConfig({ ...localConfig, iconStyleModern: variant.id })}
                    className={`p-2 text-left border rounded transition-all text-xs flex flex-col justify-center leading-normal ${
                      (localConfig.iconStyleModern || 'lumine-minimalist-glass') === variant.id
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-[1px_1px_0px_black]'
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="font-bold text-[10px]">{variant.name}</span>
                    <span className="text-[8px] text-gray-500 mt-0.5 leading-none font-medium">{variant.desc}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h4 className="text-xs font-bold text-emerald-900 uppercase">Wybierz wariant ikon dla stylu Retro (8-bit)</h4>
              <p className="text-[9px] text-gray-500 font-semibold uppercase leading-none mb-1">Dostępnych jest 10 unikalnych palet kolorów retro:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1 border border-gray-200 p-1.5 rounded bg-white">
                {[
                  { id: 'classic-windows-95', name: '💾 Classic Windows 95', desc: 'Dwuwymiarowa szarość z wyraźnym czarnym cieniem' },
                  { id: 'gameboy-green', name: '🔋 GameBoy Green DMG', desc: 'Pikselowa matryca o klasycznym zielonkawym odcieniu' },
                  { id: 'nes-retro-console', name: '🕹️ NES Retro Console', desc: 'Kultowa kombinacja ciemnego plastiku z czerwienią' },
                  { id: 'arcade-cabinet', name: '👾 Arcade Cabinet Glow', desc: 'Czarne tło z wektorową, neonowo-fioletową ramką' },
                  { id: 'c64-blue', name: '📼 C64 Classic Blue', desc: 'Niebieskie retro klocki z jasnobłękitnym obramowaniem' },
                  { id: 'minecraft-brick', name: '🧱 Minecraft Brick Block', desc: 'Brązowo-błotniste piksele z glinianym wykończeniem' },
                  { id: 'stealth-retro', name: '🛸 Stealth Retro Dark', desc: 'Bardzo ciemne piksele ze stonowanymi szarościami' },
                  { id: 'candy-pixel', name: '🍬 Candy Pixel Burst', desc: 'Słodki, cukierkowy róż z malinowym cieniem' },
                  { id: 'cyber-8bit', name: '🚧 Cyber-8bit Grid', desc: 'Czerń połączona z jaskrawym, ostrzegawczym żółtym' },
                  { id: 'doom-crimson', name: '👹 Doom Crimson Hell', desc: 'Krwistoczerwona ramka z piekielnym, mrocznym wnętrzem' }
                ].map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setLocalConfig({ ...localConfig, iconStyleRetro: variant.id })}
                    className={`p-2 text-left border rounded transition-all text-xs flex flex-col justify-center leading-normal ${
                      (localConfig.iconStyleRetro || 'classic-windows-95') === variant.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold shadow-[1px_1px_0px_black]'
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="font-bold text-[10px]">{variant.name}</span>
                    <span className="text-[8px] text-gray-500 mt-0.5 leading-none font-medium">{variant.desc}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 1. System Theme Presets */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-black border-l-4 border-emerald-600 pl-2 uppercase">1. Motyw Graficzny (Gradienty i Styl)</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'terraria', name: '🌳 Terraria Forest', desc: 'Smaragdowa zieleń, ziemisty brąz' },
            { id: 'classic-mac', name: '💻 Classic Mac', desc: 'Retro szarość, idealne piksele 1991' },
            { id: 'cyberpunk', name: '🌆 Cyber Neon', desc: 'Czerń i jaskrawe, neonowe kontury' },
            { id: 'retro-gold', name: '🪙 Retro Gold', desc: 'Ciepły mosiądz, złote i miedziane tony' }
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => setLocalConfig({ ...localConfig, systemTheme: theme.id as any })}
              className={`p-3 text-left border-2 border-black rounded transition-all flex flex-col justify-between ${
                localConfig.systemTheme === theme.id
                  ? 'bg-yellow-100 border-yellow-600 shadow-[inset_2px_2px_0px_rgba(0,0,0,0.15)] ring-2 ring-black'
                  : 'bg-[#F0F0F0] hover:bg-[#E5E5E5]'
              }`}
            >
              <span className="font-bold text-xs">{theme.name}</span>
              <span className="text-[9px] text-gray-500 mt-1 font-semibold leading-none">{theme.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Window Frame Design */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-black border-l-4 border-yellow-600 pl-2 uppercase">2. Styl Ramki Okien</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'curved-classic', name: '💻 Zaokrąglony Mac', desc: 'Klasyczne linie retro' },
            { id: 'sharp-chunky', name: '🧱 Terraria Blocky', desc: 'Klockowe, grube kontury' }
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setLocalConfig({ ...localConfig, windowStyle: style.id as any })}
              className={`p-2.5 text-left border-2 border-black rounded transition-all flex flex-col justify-between ${
                localConfig.windowStyle === style.id
                  ? 'bg-yellow-100 border-yellow-600 ring-2 ring-black'
                  : 'bg-[#F0F0F0] hover:bg-[#E5E5E5]'
              }`}
            >
              <span className="font-bold text-xs">{style.name}</span>
              <span className="text-[9px] text-gray-500 mt-1 font-semibold leading-none">{style.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Dynamic Particles Selector */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-black border-l-4 border-purple-600 pl-2 uppercase">3. Efekty Cząsteczkowe w Tle</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'leaves', name: '🍁 Spadające Liście', desc: 'Liście z dżungli Terrarii' },
            { id: 'sparkles', name: '✨ Magiczne Iskry', desc: 'Świetliste piksele kurzu' },
            { id: 'bubbles', name: '🫧 Bąbelki Powietrza', desc: 'Relaksujący motyw wodny' },
            { id: 'none', name: '🚫 Wyłączone', desc: 'Czysty pulpit, maksymalna wydajność' }
          ].map((pt) => (
            <button
              key={pt.id}
              onClick={() => setLocalConfig({ ...localConfig, particles: pt.id as any })}
              className={`p-2.5 text-left border-2 border-black rounded transition-all flex flex-col justify-between ${
                localConfig.particles === pt.id
                  ? 'bg-yellow-100 border-yellow-600 ring-2 ring-black'
                  : 'bg-[#F0F0F0] hover:bg-[#E5E5E5]'
              }`}
            >
              <span className="font-bold text-xs">{pt.name}</span>
              <span className="text-[9px] text-gray-500 mt-1 font-semibold leading-none">{pt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3.5. Ułatwienia dostępu i zaawansowany design */}
      <div className="space-y-4 bg-[#fbfbfb] p-3.5 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
        <div>
          <h3 className="text-sm font-bold text-black border-l-4 border-blue-600 pl-2 uppercase">3.5. Ułatwienia dostępu i design</h3>
          <p className="text-[10px] text-gray-500 font-bold leading-tight uppercase mt-1">Skalowanie czcionek dla lepszej czytelności oraz dodatkowe parametry interfejsu</p>
        </div>

        {/* Font size adjustment slider */}
        <div className="space-y-2 bg-white p-2.5 border border-gray-200 rounded">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-black uppercase font-mono">🔍 Rozmiar Czcionki Systemowej:</span>
            <span className="text-xs font-black bg-blue-100 px-2.5 py-0.5 border border-black rounded text-blue-900 font-mono">
              {Math.round((localConfig.fontSizeScale || 1.0) * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-3 py-1">
            <span className="text-[10px] font-bold font-mono text-gray-400">A</span>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={localConfig.fontSizeScale || 1.0}
              onChange={(e) => setLocalConfig({ ...localConfig, fontSizeScale: parseFloat(e.target.value) })}
              className="flex-grow accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-bold font-mono text-gray-800">A</span>
          </div>
          <p className="text-[8px] text-gray-500 leading-normal uppercase font-semibold">Skaluje tekst całego interfejsu, aby ułatwić czytanie na mniejszych ekranach.</p>
        </div>

        {/* Design details row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Glass blur select */}
          <div className="space-y-1.5">
            <label className="text-[9px] text-gray-600 font-bold uppercase font-mono block">Rozmycie tła szkła:</label>
            <select
              value={localConfig.glassBlur || 'medium'}
              onChange={(e) => setLocalConfig({ ...localConfig, glassBlur: e.target.value as any })}
              className="w-full p-1.5 bg-white border border-gray-300 rounded text-xs font-bold font-mono focus:outline-none focus:border-black"
            >
              <option value="none">Brak (Przezroczyste)</option>
              <option value="low">Lekkie (Low)</option>
              <option value="medium">Średnie (Medium)</option>
              <option value="high">Mocne (High)</option>
            </select>
          </div>

          {/* Border style select */}
          <div className="space-y-1.5">
            <label className="text-[9px] text-gray-600 font-bold uppercase font-mono block">Obramowanie okien:</label>
            <select
              value={localConfig.borderStyle || 'thin'}
              onChange={(e) => setLocalConfig({ ...localConfig, borderStyle: e.target.value as any })}
              className="w-full p-1.5 bg-white border border-gray-300 rounded text-xs font-bold font-mono focus:outline-none focus:border-black"
            >
              <option value="none">Brak obramowania</option>
              <option value="thin">Cienka ramka</option>
              <option value="thick">Gruba retro ramka</option>
              <option value="double">Podwójna retro ramka</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Functional System Switches */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-black border-l-4 border-red-600 pl-2 uppercase">4. Przełączniki Systemowe</h3>
        <div className="bg-[#F5F5F5] p-3 border-2 border-black rounded space-y-2.5">
          <label className="flex items-center gap-3 font-bold text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={localConfig.pixelTheme}
              onChange={(e) => setLocalConfig({ ...localConfig, pixelTheme: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
            <span>Aktywuj Pikselowy Filtr Ekranu (CRT overlay)</span>
          </label>
          <label className="flex items-center gap-3 font-bold text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={localConfig.playSounds}
              onChange={(e) => setLocalConfig({ ...localConfig, playSounds: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
            <span>Dźwięki systemowe i kliknięcia 8-bit</span>
          </label>
          <div className="h-[1px] bg-gray-300 my-1" />
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs">Format zegara w TopBar:</span>
            <div className="flex gap-2">
              {['24h', '12h'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setLocalConfig({ ...localConfig, clockFormat: fmt as any })}
                  className={`px-3 py-1 border-2 border-black font-bold text-xs rounded ${
                    localConfig.clockFormat === fmt ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {fmt === '24h' ? '24-godz' : '12-godz (AM/PM)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Integrated Button on a Pedestal */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleSave}
          className="relative group w-full max-w-xs h-16 flex flex-col items-center justify-center cursor-pointer select-none"
        >
          {/* Base pedestal / solid stand shadow */}
          <div className="absolute inset-x-2 bottom-0 h-3 bg-black rounded" />
          {/* Main button block with beautiful depth */}
          <div className="absolute inset-x-2 bottom-2 top-0 bg-[#4caf50] border-2 border-black text-white font-bold text-sm tracking-widest flex items-center justify-center uppercase shadow-[inset_0_3px_0_rgba(255,255,255,0.4)] group-active:translate-y-[2px] group-active:shadow-none transition-all">
            💾 ZAPISZ USTAWIENIA
          </div>
        </button>
      </div>
    </div>
  );
};
