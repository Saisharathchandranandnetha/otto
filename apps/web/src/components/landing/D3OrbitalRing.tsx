'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * D3.js Orbital Ring — Animated concentric orbit rings with domain nodes
 * rotating at different speeds. White theme, premium glassmorphic feel.
 * 
 * D3 Skill: Direct DOM manipulation, smooth transitions (d3.transition),
 * proper data binding, premium modern aesthetics with harmonious palette.
 */

interface OrbitNode {
  label: string;
  icon: string;
  color: string;
  orbit: number;    // which ring (0=inner, 1=mid, 2=outer)
  angle: number;    // starting angle in radians
  speed: number;    // radians per frame
}

const ORBIT_NODES: OrbitNode[] = [
  { label: 'Education', icon: '🎓', color: '#3B82F6', orbit: 2, angle: 0, speed: 0.003 },
  { label: 'Healthcare', icon: '🏥', color: '#EF4444', orbit: 2, angle: Math.PI * 0.57, speed: 0.003 },
  { label: 'Manufacturing', icon: '🏭', color: '#F59E0B', orbit: 2, angle: Math.PI * 1.14, speed: 0.003 },
  { label: 'Retail', icon: '🛍️', color: '#EC4899', orbit: 2, angle: Math.PI * 1.71, speed: 0.003 },
  { label: 'Trust Engine', icon: '🛡️', color: '#10B981', orbit: 1, angle: 0.5, speed: -0.005 },
  { label: 'AI Core', icon: '🧠', color: '#8B5CF6', orbit: 1, angle: 2.6, speed: -0.005 },
  { label: 'Workflows', icon: '⚡', color: '#F97316', orbit: 1, angle: 4.7, speed: -0.005 },
  { label: 'Sales', icon: '📈', color: '#10B981', orbit: 2, angle: Math.PI * 0.285, speed: 0.003 },
  { label: 'Legal', icon: '⚖️', color: '#6B7280', orbit: 2, angle: Math.PI * 1.425, speed: 0.003 },
  { label: 'Support', icon: '🎧', color: '#8B5CF6', orbit: 2, angle: Math.PI * 0.855, speed: 0.003 },
];

export function D3OrbitalRing() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const size = Math.min(container.clientWidth, 560);
    const cx = size / 2;
    const cy = size / 2;
    const orbits = [size * 0.14, size * 0.26, size * 0.42];

    d3.select(container).select('svg').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .attr('viewBox', `0 0 ${size} ${size}`)
      .style('overflow', 'visible');

    const defs = svg.append('defs');
    
    // Subtle glow
    const glow = defs.append('filter').attr('id', 'orbit-glow');
    glow.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    const mg = glow.append('feMerge');
    mg.append('feMergeNode').attr('in', 'blur');
    mg.append('feMergeNode').attr('in', 'SourceGraphic');

    // D3 Skill Step 2: Foundation — orbit rings
    orbits.forEach((r, i) => {
      svg.append('circle')
        .attr('cx', cx).attr('cy', cy).attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(0,0,0,0.04)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', i === 1 ? '6,6' : 'none');
    });

    // Center OTTO node
    const centerG = svg.append('g').attr('transform', `translate(${cx},${cy})`);
    centerG.append('circle').attr('r', 32).attr('fill', '#F59E0B').attr('opacity', 0.08);
    centerG.append('circle').attr('r', 22).attr('fill', '#F59E0B').attr('opacity', 0.15);
    centerG.append('circle').attr('r', 14).attr('fill', '#F59E0B').attr('opacity', 0.5);
    centerG.append('text').text('O').attr('text-anchor', 'middle').attr('dy', '0.38em')
      .attr('fill', 'white').attr('font-size', '14px').attr('font-weight', '800')
      .attr('font-family', 'Plus Jakarta Sans, system-ui, sans-serif');

    // D3 Skill Step 3: Data binding — bind orbit nodes
    const nodeGroups = svg.selectAll<SVGGElement, OrbitNode>('.orbit-node')
      .data(ORBIT_NODES)
      .join('g')
      .attr('class', 'orbit-node');

    // Connection lines to center
    const lines = svg.selectAll<SVGLineElement, OrbitNode>('.orbit-line')
      .data(ORBIT_NODES)
      .join('line')
      .attr('class', 'orbit-line')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.1);

    // Node circles
    nodeGroups.append('circle')
      .attr('r', d => d.orbit === 1 ? 18 : 16)
      .attr('fill', 'white')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5)
      .attr('filter', 'url(#orbit-glow)')
      .style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))');

    // Emoji icons
    nodeGroups.append('text')
      .text(d => d.icon)
      .attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('font-size', d => d.orbit === 1 ? '16px' : '14px');

    // Labels
    nodeGroups.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle').attr('dy', d => (d.orbit === 1 ? 18 : 16) + 14)
      .attr('fill', '#64748B').attr('font-size', '9px').attr('font-weight', '500')
      .attr('font-family', 'Plus Jakarta Sans, system-ui, sans-serif');

    // D3 Skill Step 4: Smooth animation with requestAnimationFrame
    let raf: number;
    const state = ORBIT_NODES.map(n => ({ ...n }));

    function animate() {
      state.forEach((n, i) => {
        n.angle += n.speed;
        const r = orbits[n.orbit];
        const x = cx + Math.cos(n.angle) * r;
        const y = cy + Math.sin(n.angle) * r;

        d3.select(nodeGroups.nodes()[i]).attr('transform', `translate(${x},${y})`);
        d3.select(lines.nodes()[i])
          .attr('x1', cx).attr('y1', cy)
          .attr('x2', x).attr('y2', y);
      });

      raf = requestAnimationFrame(animate);
    }

    // Entry animation — nodes fly in
    nodeGroups.attr('opacity', 0).transition().duration(800)
      .delay((_, i) => i * 80).attr('opacity', 1);
    lines.attr('opacity', 0).transition().duration(800)
      .delay((_, i) => i * 80).attr('opacity', 0.1);

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      d3.select(container).select('svg').remove();
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center justify-center" style={{ width: '100%', maxWidth: 560, aspectRatio: '1/1' }} />
  );
}
