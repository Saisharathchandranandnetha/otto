'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * AmbientParticles — a subtle, always-on particle canvas for the main app.
 *
 * Design intent:
 *  • Very low opacity so content stays dominant
 *  • Same teal (#366667) / terracotta (#9c3e26) palette as the login particles
 *  • Gentle drift — no text-forming, just calm floating dots
 *  • Faint connecting lines between nearby particles (constellation effect)
 *  • Mouse proximity causes a soft "glow" — particles near the cursor brighten
 *  • Respects prefers-reduced-motion
 */

type RGB = readonly [number, number, number];
const TEAL: RGB = [54, 102, 103];
const TERRA: RGB = [156, 62, 38];
const CREAM: RGB = [251, 249, 245]; // background color for faint accent dots

function lerp(a: RGB, b: RGB, t: number): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;      // 0 = teal, 1 = terracotta
  phase: number;     // per-particle phase for gentle oscillation
  baseAlpha: number; // resting alpha (very low)
}

export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let particles: Mote[] = [];
    let raf = 0;
    let frame = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    // How many particles — keep it sparse so it stays ambient
    function particleCount() {
      const area = width * height;
      // ~1 particle per 12 000 px² → roughly 80 on a 1920×1080 screen
      return Math.max(30, Math.min(Math.floor(area / 12000), 120));
    }

    function init() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = particleCount();

      // Reuse existing particles if we have them (resize scenario)
      const existing = particles.slice(0, count);
      const newParticles: Mote[] = [];

      for (let i = 0; i < count; i++) {
        if (existing[i]) {
          newParticles.push(existing[i]!);
        } else {
          const speed = 0.15 + Math.random() * 0.25;
          const angle = Math.random() * Math.PI * 2;
          newParticles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1 + Math.random() * 2,
            hue: Math.random() < 0.65 ? Math.random() * 0.3 : 0.7 + Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
            baseAlpha: 0.06 + Math.random() * 0.08,
          });
        }
      }
      particles = newParticles;
    }

    function tick() {
      frame++;
      ctx!.clearRect(0, 0, width, height);

      const lineDistSq = 120 * 120; // max distance² for connecting lines
      const mouseGlowRadius = 180;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;

        if (!reduceMotion) {
          // Gentle oscillation layered on constant drift
          const wobX = Math.sin(frame * 0.008 + p.phase) * 0.12;
          const wobY = Math.cos(frame * 0.006 + p.phase * 1.3) * 0.12;
          p.x += p.vx + wobX;
          p.y += p.vy + wobY;
        }

        // Wrap around edges (seamless)
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Mouse proximity glow
        let glowBoost = 0;
        if (mouse.active && !reduceMotion) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseGlowRadius) {
            glowBoost = ((mouseGlowRadius - dist) / mouseGlowRadius) * 0.35;
          }
        }

        const alpha = Math.min(p.baseAlpha + glowBoost, 0.5);
        const [r, g, b] = lerp(TEAL, TERRA, p.hue);

        // Draw the particle
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size + glowBoost * 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx!.fill();

        // Faint connecting lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]!;
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < lineDistSq) {
            const proximity = 1 - dSq / lineDistSq;
            // Lines get slightly brighter when near the cursor
            const lineAlpha = proximity * 0.04 + (glowBoost > 0 ? proximity * 0.06 : 0);
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.strokeStyle = `rgba(${TEAL[0]},${TEAL[1]},${TEAL[2]},${lineAlpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      raf = requestAnimationFrame(tick);
    }

    init();
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onResize = () => init();

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    return setup();
  }, [setup]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: 1 }}
    />
  );
}
