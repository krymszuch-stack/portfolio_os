import React from 'react';
import { Download, Upload } from 'lucide-react';
import { OSConfig, DesktopIcon } from '../../types';
import { THEME_ICONS_MAP } from '../../lib/themeIcons';

interface SettingsSystemProps {
  localConfig: OSConfig;
  setLocalConfig: (config: OSConfig) => void;
  icons?: DesktopIcon[];
  setIcons?: React.Dispatch<React.SetStateAction<DesktopIcon[]>>;
  DEFAULT_APPS_LIST: Array<{ appId: string; label: string; icon: string; color: string }>;
  handleExportBackup: () => void;
  handleImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsSystem: React.FC<SettingsSystemProps> = ({
  localConfig,
  setLocalConfig,
  icons,
  setIcons,
  DEFAULT_APPS_LIST,
  handleExportBackup,
  handleImportBackup
}) => {
  return (
    <>
      {/* 3.8. Zarządzanie Ikonami Pulpitu (Ilość ikon) */}
      {icons && setIcons && (
        <div className="space-y-3 bg-[#f3f9f3] p-3.5 border-2 border-black rounded shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
          <div>
            <h3 className="text-sm font-bold text-black border-l-4 border-green-600 pl-2 uppercase">3.8. Zarządzanie Ikonami Pulpitu</h3>
            <p className="text-[0.75rem] text-gray-500 font-bold leading-tight uppercase mt-1">
              Włączaj lub wyłączaj ikony, aby uprościć pulpit (od pustego do pełnego zestawu)
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-2 border border-gray-200 rounded max-h-[180px] overflow-y-auto">
            {DEFAULT_APPS_LIST.map((app) => {
              const isEnabled = icons.some((i) => i.appId === app.appId);
              return (
                <button
                  key={app.appId}
                  type="button"
                  onClick={() => {
                    if (isEnabled) {
                      // Remove it
                      setIcons(prev => prev.filter(i => i.appId !== app.appId));
                    } else {
                      // Add it
                      let nextX = 0;
                      let nextY = 0;
                      const coords = new Set(icons.map(i => `${i.x},${i.y}`));
                      let found = false;
                      for (let y = 0; y < 6 && !found; y++) {
                        for (let x = 0; x < 6 && !found; x++) {
                          if (!coords.has(`${x},${y}`)) {
                            nextX = x;
                            nextY = y;
                            found = true;
                          }
                        }
                      }
                      const activeThemeId = localConfig.systemTheme || 'terraria';
                      const themePackIcons = THEME_ICONS_MAP[activeThemeId];
                      const defaultIconStr = app.appId === 'gdrive' ? 'hardDrive' : app.appId === 'planned' ? 'phone' : app.appId === 'contact' ? 'mail' : app.appId === 'wizard' ? 'sparkles' : app.appId === 'certificates' ? 'award' : app.appId === 'lab' ? 'flask' : app.appId === 'projects' ? 'folder' : app.appId === 'bio' ? 'user' : app.appId;
                      const selectedIconStr = themePackIcons ? (themePackIcons[app.appId] || defaultIconStr) : defaultIconStr;

                      setIcons(prev => [
                        ...prev,
                        {
                          id: `icon-${app.appId}`,
                          label: app.label,
                          appId: app.appId,
                          icon: selectedIconStr,
                          color: app.color,
                          x: nextX,
                          y: nextY
                        }
                      ]);
                    }
                  }}
                  className={`flex items-center justify-between p-2 rounded border text-xs font-bold transition-all cursor-pointer ${
                    isEnabled
                      ? 'bg-green-50 border-green-600 text-green-900 shadow-[1px_1px_0px_black]'
                      : 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm select-none">{app.icon}</span>
                    <span>{app.label}</span>
                  </div>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center font-sans ${
                    isEnabled ? 'bg-green-600 border-green-600 text-white font-bold' : 'border-gray-400 bg-white'
                  }`}>
                    {isEnabled && '✓'}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[0.65rem] text-gray-500 leading-normal uppercase font-semibold">
            Ikona "Personalizacja" (Ustawienia) jest zawsze widoczna, aby zagwarantować stały dostęp do panelu konfiguracji.
          </p>
        </div>
      )}

      {/* 4. Functional System Switches */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-black border-l-4 border-red-600 pl-2 uppercase">4. Przełączniki Systemowe</h3>
        <div className="bg-[#F5F5F5] p-3 border-2 border-black rounded space-y-2.5">
          <span className="flex items-center gap-3 font-bold text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={localConfig.pixelTheme}
              onChange={(e) => setLocalConfig({ ...localConfig, pixelTheme: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
            <span>Aktywuj Pikselowy Filtr Ekranu (CRT overlay)</span>
          </span>
          <span className="flex items-center gap-3 font-bold text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={localConfig.playSounds}
              onChange={(e) => setLocalConfig({ ...localConfig, playSounds: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
            <span>Dźwięki systemowe i kliknięcia 8-bit</span>
          </span>
          <div className="h-[1px] bg-gray-300 my-1" />
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs">Format zegara w TopBar:</span>
            <div className="flex gap-2">
              {['24h', '12h'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setLocalConfig({ ...localConfig, clockFormat: fmt as any })}
                  className={`px-3 py-1 border-2 border-black font-bold text-xs rounded cursor-pointer ${
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

      {/* 4.7. Kopia Zapasowa (Backup & Restore) */}
      <div className="space-y-3 bg-[#f8fafc] border border-blue-200 p-3.5 rounded shadow-[1px_1px_0px_black]">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-bold">💾</span>
          <h3 className="text-sm font-bold text-black uppercase">4.7. Kopia Zapasowa i Przywracanie</h3>
        </div>

        <p className="text-[0.7rem] text-gray-500 font-bold uppercase leading-relaxed text-left">
          Pobierz pełną kopię zapasową konfiguracji systemu, projektów, certyfikatów, osi czasu oraz ikon, aby zapisać je bezpiecznie lokalnie w pliku JSON lub przywrócić je w dowolnym momencie.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-blue-100">
          <button
            onClick={handleExportBackup}
            className="p-2 min-h-[44px] flex items-center justify-center gap-2 bg-white hover:bg-blue-50 border border-blue-300 hover:border-blue-400 text-blue-700 font-sans font-bold text-xs rounded cursor-pointer transition-all uppercase"
          >
            <Download size={13} />
            <span>Pobierz Kopię Zapasową (JSON)</span>
          </button>

          <span className="p-2 min-h-[44px] flex items-center justify-center gap-2 bg-white hover:bg-blue-50 border border-dashed border-blue-300 hover:border-blue-400 text-blue-700 font-sans font-bold text-xs rounded cursor-pointer transition-all uppercase text-center select-none">
            <Upload size={13} />
            <span>Przywróć z pliku JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden min-h-[44px]"
            />
          </span>
        </div>
      </div>
    </>
  );
};
