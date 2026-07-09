import React from 'react';
import { Edit2, X } from 'lucide-react';
import { ContextMenuState } from './useDesktopContextMenu';

interface DesktopContextMenuProps {
  contextMenu: ContextMenuState;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState>>;
  handleOpenEdit: (icon: any) => void;
  handleDeleteIcon: (id: string) => void;
}

export const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
  contextMenu,
  setContextMenu,
  handleOpenEdit,
  handleDeleteIcon
}) => {
  if (!contextMenu) return null;

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: contextMenu.y, 
        left: contextMenu.x,
        zIndex: 999999
      }}
      className="w-48 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="px-3 py-1.5 border-b border-white/5 mb-1">
        <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest leading-none">Opcje ikony</p>
        <p className="text-xs font-semibold text-white truncate mt-1">{contextMenu.icon.label}</p>
      </div>
      <button
        onClick={(e) => {
          setContextMenu(null);
          handleOpenEdit(contextMenu.icon);
        }}
        className="w-full px-3 py-2 text-xs text-left text-white/80 hover:text-white hover:bg-white/10 rounded-xl flex items-center gap-2 transition-all cursor-pointer font-sans"
      >
        <Edit2 size={13} />
        Edytuj właściwości
      </button>
      <button
        onClick={() => {
          handleDeleteIcon(contextMenu.icon.id);
          setContextMenu(null);
        }}
        className="w-full px-3 py-2 text-xs text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition-all cursor-pointer font-sans"
      >
        <X size={14} strokeWidth={3} />
        Usuń ikonę
      </button>
    </div>
  );
};
