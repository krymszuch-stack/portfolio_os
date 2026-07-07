/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';

export type ParticleVariant = 'snow' | 'matrix-rain' | 'dust' | 'none';

interface ParticleOverlayProps {
  triggerRef: React.MutableRefObject<((x: number, y: number, count?: number) => void) | null>;
  variant?: ParticleVariant;
}

export const ParticleOverlay: React.FC<ParticleOverlayProps> = ({ triggerRef, variant = 'none' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let particles: any[] = [];
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const initContinuousParticles = () => {
      particles = [];
      if (variant === 'none') return;
      
      const isMobile = window.innerWidth < 768;
      // Limit count: max 30 on mobile, 50 on desktop to keep the background clean and legible
      const count = isMobile 
        ? (variant === 'snow' ? 25 : 12) 
        : (variant === 'snow' ? 45 : 22);

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.1, // extremely subtle base x velocity
          vy: variant === 'snow' ? Math.random() * 0.4 + 0.4 : Math.random() * 0.2 + 0.2, // steady, calm vertical speed
          size: variant === 'snow' ? Math.random() * 1.5 + 1 : Math.random() * 1.0 + 0.5,
          phase: Math.random() * Math.PI * 2, // phase for smooth sine wave drift
          phaseSpeed: 0.002 + Math.random() * 0.008 // slower, more relaxing wave speed
        });
      }
      
      if (variant === 'matrix-rain') {
        const columns = Math.floor(canvas.width / 24);
        for(let i=0; i<columns; i++) {
          particles.push({
            x: i * 24,
            y: Math.random() * canvas.height,
            vy: Math.random() * 1.0 + 1.0,
            char: String.fromCharCode(0x30A0 + Math.random() * 96)
          });
        }
      }
    };
    
    initContinuousParticles();
    
    const tick = () => {
      if (variant === 'none' && particlesRef.current.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationId = requestAnimationFrame(tick);
        return;
      }
      
      if (variant === 'matrix-rain') {
        ctx.fillStyle = 'rgba(5, 5, 7, 0.08)'; // slightly fade previous frames
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.65)'; // deep violet matrix characters matching theme
        ctx.font = '13px monospace';
        
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.fillText(p.char, p.x, p.y);
          if (p.y > canvas.height && Math.random() > 0.98) {
            p.y = -20;
          }
          p.y += p.vy;
          p.char = Math.random() > 0.92 ? String.fromCharCode(0x30A0 + Math.random() * 96) : p.char;
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (variant !== 'none') {
          // Glassmorphism snow is white/semi-transparent, dust is light violet/amber
          ctx.fillStyle = variant === 'snow' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(167, 139, 250, 0.2)';
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Peaceful downward motion with a gentle horizontal sway (sine drift)
            p.phase += p.phaseSpeed;
            p.x += p.vx + Math.sin(p.phase) * 0.15;
            p.y += p.vy;
            
            if (p.y > canvas.height) {
              p.y = -p.size;
              p.x = Math.random() * canvas.width;
            }
            if (p.x > canvas.width) p.x = 0;
            if (p.x < 0) p.x = canvas.width;
          }
        }
      }
      
      // Draw triggerRef sparks (retro click effects)
      const sparks = particlesRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.96;
        p.life -= 1;
        
        if (p.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const alpha = p.life / p.maxLife;
        ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.65})`; // soft violet click spark
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      
      animationId = requestAnimationFrame(tick);
    };
    
    animationId = requestAnimationFrame(tick);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [variant]);

  
  useEffect(() => {
    triggerRef.current = (x: number, y: number, count = 12) => {
      const finalCount = count + Math.floor(Math.random() * 8);
      for (let i = 0; i < finalCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          gravity: 0.12,
          size: Math.random() > 0.4 ? 3 : 1.5,
          life: 25 + Math.floor(Math.random() * 15),
          maxLife: 40
        });
      }
    };
  }, [triggerRef]);


  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[0]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
