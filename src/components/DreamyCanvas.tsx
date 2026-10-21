import React, { useEffect, useRef } from 'react';

interface DreamyCanvasProps {
  className?: string;
  particleCount?: number;
}

export const DreamyCanvas: React.FC<DreamyCanvasProps> = ({
  className = '',
  particleCount = 36
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    interface Particle {
      type: 'sparkle' | 'petal' | 'gold_star';
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      rotation: number;
      vRot: number;
      sway: number;
      vSway: number;
      opacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
    }

    interface Sparkle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      decay: number;
      color: string;
      rotation: number;
    }

    const particles: Particle[] = [];
    const touchSparkles: Sparkle[] = [];

    const createParticle = (isInitial = false): Particle => {
      const typeRoll = Math.random();
      let type: 'sparkle' | 'petal' | 'gold_star' = 'sparkle';
      if (typeRoll < 0.32) type = 'petal';
      else if (typeRoll < 0.68) type = 'gold_star';

      return {
        type,
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : -25,
        size: type === 'petal' ? Math.random() * 5 + 4.5 : Math.random() * 2.5 + 1.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: type === 'petal' ? Math.random() * 0.45 + 0.3 : Math.random() * 0.3 + 0.15,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        sway: Math.random() * Math.PI * 2,
        vSway: Math.random() * 0.02 + 0.015,
        opacity: Math.random() * 0.5 + 0.35,
        twinkleSpeed: Math.random() * 0.04 + 0.02,
        twinklePhase: Math.random() * Math.PI * 2
      };
    };

    const count = Math.min(particleCount, Math.floor(width / 12));
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(true));
    }

    const drawDiamondStar = (c: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, fill: string) => {
      c.save();
      c.translate(x, y);
      c.globalAlpha = Math.max(0, Math.min(1, alpha));
      c.fillStyle = fill;
      c.beginPath();
      c.moveTo(0, -size * 1.6);
      c.quadraticCurveTo(0, 0, size * 1.6, 0);
      c.quadraticCurveTo(0, 0, 0, size * 1.6);
      c.quadraticCurveTo(0, 0, -size * 1.6, 0);
      c.quadraticCurveTo(0, 0, 0, -size * 1.6);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawPetal = (c: CanvasRenderingContext2D, p: Particle) => {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rotation);
      c.globalAlpha = Math.max(0, Math.min(1, p.opacity));
      c.fillStyle = '#f4b6c2';
      c.beginPath();
      c.moveTo(0, -p.size);
      c.bezierCurveTo(p.size * 0.75, -p.size * 0.75, p.size * 0.95, p.size * 0.35, 0, p.size);
      c.bezierCurveTo(-p.size * 0.95, p.size * 0.35, -p.size * 0.75, -p.size * 0.75, 0, -p.size);
      c.closePath();
      c.fill();
      c.restore();
    };

    const spawnTouchSparkle = (px: number, py: number) => {
      const colors = ['#ffe6b5', '#ffdf9b', '#ffffff', '#f4b6c2', '#e8c987'];
      for (let k = 0; k < 2; k++) {
        touchSparkles.push({
          x: px + (Math.random() - 0.5) * 12,
          y: py + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.3,
          size: Math.random() * 3 + 2,
          life: 1.0,
          decay: Math.random() * 0.04 + 0.025,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI
        });
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      spawnTouchSparkle(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      // Ambient floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.sway += p.vSway;
        p.x += p.vx + Math.sin(p.sway) * (p.type === 'petal' ? 0.6 : 0.2);
        p.y += p.vy;
        p.rotation += p.vRot;
        p.twinklePhase += p.twinkleSpeed;

        const dynamicAlpha = p.opacity * (0.55 + 0.45 * Math.sin(p.twinklePhase));

        if (p.type === 'petal') {
          drawPetal(ctx, p);
        } else if (p.type === 'gold_star') {
          drawDiamondStar(ctx, p.x, p.y, p.size, dynamicAlpha, '#ffe6b5');
        } else {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, dynamicAlpha * 0.4));
          ctx.fillStyle = '#ffdf9b';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = Math.max(0, Math.min(1, dynamicAlpha));
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (p.y > height + 25 || p.x < -30 || p.x > width + 30) {
          particles[i] = createParticle(false);
        }
      }

      // Pointer trailing sparkles
      for (let j = touchSparkles.length - 1; j >= 0; j--) {
        const s = touchSparkles[j];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;

        if (s.life <= 0) {
          touchSparkles.splice(j, 1);
          continue;
        }

        drawDiamondStar(ctx, s.x, s.y, s.size * s.life, s.life * 0.9, s.color);
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};
