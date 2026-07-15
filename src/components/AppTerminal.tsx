import React, { useState, useRef, useEffect } from 'react';
import { OSConfig } from '../types';
import { Terminal as TerminalIcon } from 'lucide-react';

interface AppTerminalProps {
  config: OSConfig;
}

interface Log {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

export const AppTerminal: React.FC<AppTerminalProps> = ({ config }) => {
  const [logs, setLogs] = useState<Log[]>([
    { type: 'system', text: 'Portfolio OS Terminal v1.0.0' },
    { type: 'system', text: 'Wpisz "help", aby zobaczyć listę komend.' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    
    setLogs(prev => [...prev, { type: 'input', text: `visitor@portfolio:~$ ${trimmed}` }]);
    
    const args = trimmed.toLowerCase().split(' ');
    const command = args[0];
    
    setTimeout(() => {
      let outputLogs: Log[] = [];
      switch (command) {
        case 'help':
          outputLogs = [
            { type: 'output', text: 'Dostępne komendy:' },
            { type: 'output', text: '  whoami    - informacje o autorze' },
            { type: 'output', text: '  projects  - lista głównych projektów' },
            { type: 'output', text: '  contact   - jak się ze mną skontaktować' },
            { type: 'output', text: '  clear     - czyści ekran terminala' },
            { type: 'output', text: '  sudo      - wykonaj jako superużytkownik' }
          ];
          break;
        case 'whoami':
          outputLogs = [
            { type: 'output', text: config.portfolioName || 'Gość' },
            { type: 'output', text: config.portfolioBio || 'Brak opisu.' }
          ];
          break;
        case 'projects':
          outputLogs = [
            { type: 'output', text: 'Projekty możesz przejrzeć w dedykowanej aplikacji "Projekty".' }
          ];
          break;
        case 'contact':
          outputLogs = [
            { type: 'output', text: 'Aby się skontaktować, użyj aplikacji "Kontakt" lub napisz wiadomość w panelu.' }
          ];
          break;
        case 'clear':
          setLogs([]);
          return;
        case 'sudo':
          if (args[1] === 'make' && args[2] === 'me' && args[3] === 'an' && args[4] === 'offer') {
            outputLogs = [
              { type: 'system', text: 'ACCESS GRANTED. Przechodzę w tryb rekrutacji.' },
              { type: 'output', text: 'Pobieranie poufnych plików CV... 100%' },
              { type: 'output', text: 'Skontaktuj się ze mną przez LinkedIn, aby sfinalizować ofertę!' }
            ];
          } else {
            outputLogs = [
              { type: 'error', text: `sudo: ${args.slice(1).join(' ')}: command not found` }
            ];
          }
          break;
        default:
          outputLogs = [
            { type: 'error', text: `bash: ${command}: command not found` }
          ];
          break;
      }
      setLogs(prev => [...prev, ...outputLogs]);
    }, 150);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-green-400 font-mono text-sm p-4 overflow-hidden rounded-b-[14px]">
      <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-800 pb-2">
        <TerminalIcon size={16} />
        <span>bash - 80x24</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-1 pb-4 custom-scrollbar">
        {logs.map((log, i) => (
          <div key={i} className={`
            ${log.type === 'error' ? 'text-red-400' : ''}
            ${log.type === 'system' ? 'text-cyan-400' : ''}
            ${log.type === 'input' ? 'text-white' : ''}
          `}>
            {log.text}
          </div>
        ))}
        
        <div className="flex items-center mt-2">
          <span className="text-white mr-2">visitor@portfolio:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommand(input);
                setInput('');
              }
            }}

            className="flex-1 bg-transparent border-none outline-none text-green-400 caret-green-400"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
