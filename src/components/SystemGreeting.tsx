import React, { useState, useEffect } from 'react';

export const SystemGreeting: React.FC<{ className?: string }> = ({ className }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setGreeting('Dzień dobry');
      else if (hour >= 12 && hour < 18) setGreeting('Witaj na pulpicie');
      else setGreeting('Dobry wieczór');
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Only need to check every minute
    return () => clearInterval(interval);
  }, []);

  return <span className={className}>{greeting}, gość •</span>;
};
