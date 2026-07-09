export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' = 'light') => {
  if (typeof window === 'undefined' || !window.navigator || !window.navigator.vibrate) return;
  
  try {
    switch (type) {
      case 'light':
        window.navigator.vibrate(10);
        break;
      case 'medium':
        window.navigator.vibrate(20);
        break;
      case 'heavy':
        window.navigator.vibrate(30);
        break;
      case 'success':
        window.navigator.vibrate([10, 30, 20]);
        break;
      case 'error':
        window.navigator.vibrate([20, 40, 20, 40, 30]);
        break;
      case 'warning':
        window.navigator.vibrate([20, 30, 20]);
        break;
    }
  } catch (e) {
    // Ignore error if vibration fails
  }
};
