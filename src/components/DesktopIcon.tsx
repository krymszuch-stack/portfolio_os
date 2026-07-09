import React, { useState } from 'react';
import { motion } from 'motion/react';

interface DesktopIconProps {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
}


const Pedestal: React.FC<{ hover: boolean }> = ({ hover }) => {
  return (
    <div className="relative w-28 h-6 flex flex-col items-center justify-end select-none pointer-events-none mt-1">
      {/* Terraria Forest Grass top - pixelated crenellations */}
      <div className="w-24 h-1.5 bg-[#4caf50] border-t-2 border-b-2 border-black relative">
        <div className="absolute top-0 left-2 w-2 h-[2px] bg-[#81c784]" />
        <div className="absolute top-0 right-4 w-3 h-[2px] bg-[#81c784]" />
        <div className="absolute bottom-0 left-6 w-2 h-[2px] bg-[#2e7d32]" />
      </div>
      
      {/* Dirt block base - tapered at the sides to eliminate generic box look */}
      <div className="w-20 h-4 bg-[#8d6e63] border-l-2 border-r-2 border-b-2 border-black relative flex justify-around p-0.5">
        <div className="w-2 h-1 bg-[#5d4037] opacity-60" />
        <div className="w-1.5 h-1.5 bg-[#a1887f] opacity-80" />
        <div className="w-3 h-1 bg-[#5d4037] opacity-60" />
        <div className="w-1 h-1.5 bg-[#a1887f] opacity-80" />
      </div>

      {/* Shimmer/shadow under pedestal */}
      <div className={`absolute -bottom-1 w-24 h-[4px] rounded transition-all duration-300 ${
        hover ? 'bg-yellow-400 animate-pulse' : 'bg-black/30'
      }`} />
    </div>
  );
};

export const DesktopIcon: React.FC<DesktopIconProps> = ({ label, icon, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="button"
      aria-label={label}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="flex flex-col items-center justify-between w-36 h-40 group relative transition-all focus:outline-none"
    >
      {/* Floating 8-bit styled Icon */}
      <motion.div
        animate={isHovered ? { y: [0, -8, 0] } : { y: 0 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="text-white mt-2 select-none flex items-center justify-center relative"
        style={{
          imageRendering: 'pixelated',
          // Pixel-art border wrapper for vector outlines
          filter: 'drop-shadow(2px 0px 0px #000) drop-shadow(-2px 0px 0px #000) drop-shadow(0px 2px 0px #000) drop-shadow(0px -2px 0px #000) drop-shadow(2px 2px 0px #000) drop-shadow(-2px -2px 0px #000) drop-shadow(2px -2px 0px #000) drop-shadow(-2px 2px 0px #000)'
        }}
      >
        <div className="text-yellow-400 group-hover:text-amber-300 transition-colors">
          {React.cloneElement(icon as React.ReactElement<any>, { size: 56, strokeWidth: 2.5 })}
        </div>
      </motion.div>

      {/* Pedestal block */}
      <Pedestal hover={isHovered} />

      {/* Text label underneath */}
      <span className="text-xs text-white text-center font-bold font-mono tracking-wider drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-black/55 px-2 py-0.5 rounded border border-black select-none mt-1 z-10">
        {label}
      </span>
    </motion.button>
  );
};
