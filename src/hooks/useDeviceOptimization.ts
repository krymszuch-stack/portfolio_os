import { useState, useEffect } from 'react';

export const useDeviceOptimization = () => {
  const [optimization, setOptimization] = useState({
    isLowRes: false,
    disableAnimations: false,
    deviceType: 'desktop',
  });

  useEffect(() => {
    const handleOptimization = () => {
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const width = window.innerWidth;

      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || "";
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

      // Determine if the device is low resolution
      const isLowRes = screenWidth <= 1024 || width <= 1024;
      const isVeryLowRes = screenWidth <= 480 || width <= 480 || (isMobile && screenWidth <= 768);

      // When the resolution is too low, remove animations to maintain fluidity
      const disableAnimations = isVeryLowRes;

      setOptimization({
        isLowRes,
        disableAnimations,
        deviceType: isMobile ? 'mobile' : 'desktop',
      });

      // Apply root font-size for scaling fonts, icons, text (Tailwind uses rem)
      if (isVeryLowRes) {
        document.documentElement.style.fontSize = '12px';
        document.documentElement.classList.add('reduce-motion');
      } else if (isLowRes) {
        document.documentElement.style.fontSize = '14px';
        document.documentElement.classList.remove('reduce-motion');
      } else {
        document.documentElement.style.fontSize = '16px';
        document.documentElement.classList.remove('reduce-motion');
      }
    };

    handleOptimization();
    window.addEventListener('resize', handleOptimization);
    return () => window.removeEventListener('resize', handleOptimization);
  }, []);

  return optimization;
};
