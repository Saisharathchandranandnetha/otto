'use client';

import { useEffect, useRef } from 'react';

export type ParticleMode = 'idle' | 'vortex' | 'error';

interface ParticleFieldProps {
  /** Current animation mode driven by the login state */
  mode: ParticleMode;
  /** Text the particles assemble into */
  text?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number; // target x
  ty: number; // target y
  size: number;
  hueMix: number; // 0 = teal, 1 = terracotta
  drift: number; // phase offset for ambient wobble
}

// Theme colors: teal rgb(54,102,103) / terracotta rgb(156,62,38)
const TEAL = [54, 102, 103] as const;
const TERRA = [156, 62, 38] as const;

function mix(a: readonly number[], b: readonly number[], t: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export function ParticleField({ mode, text = 'OTTO' }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<ParticleMode>(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let frame = 0;
    const mouse = { x: -9999, y: -9999, active: false };
    let errorFlash = 0;

    /** Sample the wordmark glyphs into particle target positions */
    function buildTargets() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw text to an offscreen canvas and sample opaque pixels
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d');
      if (!octx) return;

      const isMobile = width < 640;
      const fontSize = Math.min(width * (isMobile ? 0.22 : 0.16), height * 0.4);
      octx.font = `800 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      // Wordmark sits in the upper third on mobile, left half on desktop
      const cy = isMobile ? height * 0.18 : height * 0.46;
      const cx = isMobile ? width * 0.5 : width * 0.32;
      octx.fillStyle = '#000';
      octx.fillText(text, cx, cy);

      const gap = isMobile ? 5 : 4; // sampling density
      const data = octx.getImageData(0, 0, width, height).data;
      const targets: Array<[number, number]> = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          if (data[(y * width + x) * 4 + 3] > 128) {
            targets.push([x, y]);
          }
        }
      }

      // Build / rebuild particles
      particles = targets.map(([tx, ty], i) => {
        const existing = particles[i];
        return {
          x: existing ? existing.x : Math.random() * width,
          y: existing ? existing.y : Math.random() * height,
          vx: 0,
          vy: 0,
          tx,
          ty,
          size: 0.8 + Math.random() * 1.6,
          hueMix: Math.random() < 0.82 ? Math.random() * 0.25 : 0.7 + Math.random() * 0.3,
          drift: Math.random() * Math.PI * 2,
        };
      });
    }

    function tick() {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const m = modeRef.current;
      if (m === 'error') errorFlash = 1;
      errorFlash *= 0.96;

      const vortexX = width / 2;
      const vortexY = height / 2;

      for (const p of particles) {
        if (m === 'vortex' && !reduceMotion) {
          // Spiral toward center
          const dx = vortexX - p.x;
          const dy = vortexY - p.y;
          const dist = Math.max(Math.hypot(dx, dy), 1);
          const pull = 0.012;
          const swirl = 0.09;
          p.vx += dx * pull + (-dy / dist) * swirl * dist * 0.02;
          p.vy += dy * pull + (dx / dist) * swirl * dist * 0.02;
          p.vx *= 0.9;
          p.vy *= 0.9;
        } else {
          // Spring back to glyph target with ambient wobble
          const wobX = reduceMotion ? 0 : Math.sin(frame * 0.02 + p.drift) * 0.6;
          const wobY = reduceMotion ? 0 : Math.cos(frame * 0.017 + p.drift) * 0.6;
          p.vx += (p.tx + wobX - p.x) * 0.02;
          p.vy += (p.ty + wobY - p.y) * 0.02;

          // Mouse repulsion
          if (mouse.active && !reduceMotion) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            const radius = 110;
            if (dist < radius && dist > 0) {
              const force = ((radius - dist) / radius) * 6;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }
          p.vx *= 0.86;
          p.vy *= 0.86;
        }

        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.hypot(p.vx, p.vy);
        const energy = Math.min(speed / 6, 1);
        // Excited particles shift toward terracotta; error flashes everything terracotta
        const t = Math.min(p.hueMix + energy * 0.6 + errorFlash * 0.8, 1);
        const [r, g, b] = mix(TEAL, TERRA, t);
        const alpha = 0.55 + energy * 0.45;

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + energy * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    buildTargets();
    if (reduceMotion) {
      // Static render: place particles at targets, draw once
      for (const p of particles) {
        p.x = p.tx;
        p.y = p.ty;
      }
    }
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onResize = () => buildTargets();

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
