import { useEffect } from 'react';
import { OSConfig } from '../types';

export const useDynamicFonts = (config: OSConfig) => {
  useEffect(() => {
    const fontsToLoad = new Set<string>();

    if (config.pixelTheme) {
      fontsToLoad.add('family=VT323');
      fontsToLoad.add('family=Press+Start+2P');
    }

    if (config.systemFont === 'ubuntu') {
      fontsToLoad.add('family=Ubuntu:wght@400;500;700');
    }

    if (config.systemFont === 'retro') {
      fontsToLoad.add('family=VT323');
    }

    if (fontsToLoad.size > 0) {
      const id = 'dynamic-fonts';
      let link = document.getElementById(id) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      
      const fontUrl = `https://fonts.googleapis.com/css2?${Array.from(fontsToLoad).join('&')}&display=swap`;
      if (link.href !== fontUrl) {
        link.href = fontUrl;
      }
    } else {
      const link = document.getElementById('dynamic-fonts');
      if (link) {
        link.remove();
      }
    }
  }, [config.pixelTheme, config.systemFont]);
};
