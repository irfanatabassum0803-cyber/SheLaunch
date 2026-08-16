import React, { useEffect, useRef } from 'react';

interface AmbientBackgroundProps {
  variant?: 'cinematic' | 'subtle';
}

export const AmbientCanvasBackground: React.FC<AmbientBackgroundProps> = ({ variant = 'cinematic' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic light orbs with burgundy, wine, rose & blush tones
    const orbCount = variant === 'cinematic' ? 5 : 3;
    const orbs = Array.from({ length: orbCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: (Math.random() * 250 + 200) * (variant === 'cinematic' ? 1.4 : 1.1),
      vx: (Math.random() - 0.5) * (variant === 'cinematic' ? 0.35 : 0.18),
      vy: (Math.random() - 0.5) * (variant === 'cinematic' ? 0.35 : 0.18),
      color: [
        'rgba(138, 35, 63, 0.28)',   // Wine
        'rgba(172, 51, 83, 0.22)',   // Burgundy
        'rgba(246, 115, 148, 0.15)', // Blush
        'rgba(79, 27, 40, 0.35)',    // Deep Maroon
        'rgba(215, 180, 71, 0.08)',  // Subtle Gold bloom
      ][i % 5],
    }));

    // Floating subtle luminous stardust particles
    const particleCount = variant === 'cinematic' ? 32 : 16;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -Math.random() * 0.3 - 0.05,
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Base deep wine background
      ctx.fillStyle = variant === 'cinematic' ? '#1F060E' : '#18040B';
      ctx.fillRect(0, 0, width, height);

      // 2. Render blurred glowing orbs
      orbs.forEach((orb) => {
        if (!isReducedMotion) {
          orb.x += orb.vx;
          orb.y += orb.vy;

          if (orb.x < -orb.radius) orb.x = width + orb.radius;
          if (orb.x > width + orb.radius) orb.x = -orb.radius;
          if (orb.y < -orb.radius) orb.y = height + orb.radius;
          if (orb.y > height + orb.radius) orb.y = -orb.radius;
        }

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(31, 6, 14, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Render luminous champagne/blush particles
      particles.forEach((p) => {
        if (!isReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.y < 0) {
            p.y = height;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        }

        const currentAlpha = p.alpha + Math.sin(time * 2 + p.x) * 0.2;
        ctx.fillStyle = `rgba(255, 235, 240, ${Math.max(0.1, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [variant]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-90 transition-opacity duration-1000"
      />
      {/* Subtle overlay grid/grain texture */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-900/20 via-transparent to-black/40 mix-blend-overlay" 
      />
    </div>
  );
};
