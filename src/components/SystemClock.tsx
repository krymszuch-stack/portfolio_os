import React, { useState, useEffect } from 'react';

export const SystemClock: React.FC<{ className?: string }> = ({ className }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const formattedDate = now.toLocaleDateString('pl-PL', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
      setTimeStr(`${formattedDate} • ${formattedTime}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className={className}>{timeStr}</span>;
};
