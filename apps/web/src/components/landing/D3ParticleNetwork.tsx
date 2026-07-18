// @ts-nocheck
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * D3.js Particle Network — White theme futuristic particle system.
 * Uses D3 force simulation for organic particle movement with
 * proximity-based edge connections and mouse interaction.
 * 
 * D3 Skill: Direct DOM manipulation, proper data binding (enter/update/exit),
 * smooth transitions, premium aesthetics.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export function D3ParticleNetwork({ color = '#F59E0B', particleCount = 80 }: { color?: string; particleCount?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;

    // D3 Skill Step 1: Plan — SVG canvas with particles + proximity edges
    d3.select(container).select('svg').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('position', 'absolute')
      .style('inset', '0');

    // D3 Skill Step 2: Build foundation
    const defs = svg.append('defs');
    
    // Radial gradient for particles
    const grad = defs.append('radialGradient').attr('id', 'particle-grad');
    grad.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.6);
    grad.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);

    // Glow filter
    const glow = defs.append('filter').attr('id', 'soft-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    glow.append('feGaussianBlur').attr('stdDeviation', '2').attr('result', 'blur');
    const merge = glow.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    // D3 Skill Step 3: Data binding — generate particles
    const particles: Particle[] = d3.range(particleCount).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 1.5 + Math.random() * 2.5,
      opacity: 0.15 + Math.random() * 0.35,
    }));

    const edgeGroup = svg.append('g').attr('class', 'edges');
    const particleGroup = svg.append('g').attr('class', 'particles');

    // D3 enter pattern — bind particle data
    const dots = particleGroup.selectAll('circle')
      .data(particles)
      .join('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.radius)
      .attr('fill', color)
      .attr('opacity', d => d.opacity)
      .attr('filter', 'url(#soft-glow)');

    // Mouse tracking
    const mouse = { x: -1000, y: -1000, active: false };
    const CONNECTION_DIST = 120;
    const MOUSE_DIST = 180;

    container.addEventListener('pointermove', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    container.addEventListener('pointerleave', () => {
      mouse.active = false;
    });

    // D3 Skill Step 4: Animation loop with transitions
    let raf: number;
    function tick() {
      // Update particle positions
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        // Mouse repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_DIST && dist > 0) {
            const force = ((MOUSE_DIST - dist) / MOUSE_DIST) * 0.8;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Damping
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Min velocity
        const speed = Math.hypot(p.vx, p.vy);
        if (speed < 0.15) {
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vy += (Math.random() - 0.5) * 0.1;
        }
      });

      // D3 update pattern — reposition dots
      dots.attr('cx', d => d.x).attr('cy', d => d.y);

      // Build proximity edges — D3 data join (enter/update/exit)
      const edges: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECTION_DIST) {
            edges.push({
              x1: particles[i].x, y1: particles[i].y,
              x2: particles[j].x, y2: particles[j].y,
              opacity: (1 - dist / CONNECTION_DIST) * 0.12,
            });
          }
        }
        // Mouse connection lines
        if (mouse.active) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_DIST) {
            edges.push({
              x1: particles[i].x, y1: particles[i].y,
              x2: mouse.x, y2: mouse.y,
              opacity: (1 - dist / MOUSE_DIST) * 0.2,
            });
          }
        }
      }

      // D3 data join for edges
      edgeGroup.selectAll('line')
        .data(edges)
        .join(
          enter => enter.append('line')
            .attr('stroke', color)
            .attr('stroke-width', 0.5),
          update => update,
          exit => exit.remove()
        )
        .attr('x1', d => d.x1).attr('y1', d => d.y1)
        .attr('x2', d => d.x2).attr('y2', d => d.y2)
        .attr('opacity', d => d.opacity);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      svg.attr('width', w).attr('height', h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      d3.select(container).select('svg').remove();
    };
  }, [color, particleCount]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
}
