import { useState, useCallback, useEffect } from 'react';
import { triggerHaptic } from '../lib/haptics';

export function useCopyToClipboard(resetInterval = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isCopied) {
      timeout = setTimeout(() => {
        setIsCopied(false);
      }, resetInterval);
    }
    return () => clearTimeout(timeout);
  }, [isCopied, resetInterval]);

  const copy = useCallback(async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      triggerHaptic('success');
    } catch (err) {
      console.warn('Failed to copy', err);
      triggerHaptic('error');
    }
  }, []);

  return [isCopied, copy] as const;
}
