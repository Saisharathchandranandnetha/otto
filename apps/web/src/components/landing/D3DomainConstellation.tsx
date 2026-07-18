'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DomainNode {
  id: string;
  label: string;
  description: string;
  color: string;
  capabilities: string[];
  icon: string;
}

const DOMAIN_NODES: DomainNode[] = [
  { id: 'edu', label: 'Education', description: 'AI tutors, grading, curriculum planning', color: '#3B82F6', capabilities: ['Smart Tutoring', 'Auto-Grading', 'Student Analytics', 'Curriculum AI'], icon: '🎓' },
  { id: 'mfg', label: 'Manufacturing', description: 'Predictive maintenance, quality control', color: '#F59E0B', capabilities: ['Floor Supervisor', 'Defect Detection', 'Supply Chain AI', 'Maintenance Prediction'], icon: '🏭' },
  { id: 'hc', label: 'Healthcare', description: 'Clinical AI, patient triage, care coord', color: '#EF4444', capabilities: ['Patient Triage', 'Clinical Notes', 'Drug Interaction', 'Care Coordination'], icon: '🏥' },
  { id: 'cs', label: 'Support', description: 'AI frontline, ticket deflection, CSAT', color: '#8B5CF6', capabilities: ['Ticket Deflection', 'Sentiment Analysis', 'Auto-Resolution', 'CSAT Prediction'], icon: '🎧' },
  { id: 'ret', label: 'Retail', description: 'Personal shopper, inventory, clienteling', color: '#EC4899', capabilities: ['Personal Shopper', 'Inventory AI', 'VIP Clienteling', 'Demand Forecast'], icon: '🛍️' },
  { id: 'sales', label: 'Sales', description: 'Lead qualification, CPQ, deal pipeline', color: '#10B981', capabilities: ['Lead Scoring', 'Deal Pipeline', 'CPQ Engine', 'Revenue Forecast'], icon: '📈' },
  { id: 'legal', label: 'Legal', description: 'Contract drafting, case law, intake AI', color: '#6B7280', capabilities: ['Contract Draft', 'Case Research', 'Compliance Check', 'Intake Automation'], icon: '⚖️' },
];

export function D3DomainConstellation() {
  const ref = useRef<HTMLDivElement>(null);
  const [hoveredDomain, setHoveredDomain] = useState<DomainNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    d3.select(container).select('svg').remove();

    const width = container.clientWidth;
    const height = 500;
    const cx = width / 2;
    const cy = height / 2;
    const orbitRadius = Math.min(width, height) * 0.32;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const defs = svg.append('defs');
    const glow = defs.append('filter').attr('id', 'constellation-glow');
    glow.append('feGaussianBlur').attr('stdDeviation', '8').attr('result', 'blur');
    const merge = glow.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Orbit rings
    [0.6, 0.8, 1.0].forEach((scale, i) => {
      svg.append('circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', orbitRadius * scale)
        .attr('fill', 'none')
        .attr('stroke', `rgba(255,255,255,${0.03 + i * 0.01})`)
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '4,8');
    });

    // Center node (OTTO)
    const centerGroup = svg.append('g').attr('transform', `translate(${cx},${cy})`);
    
    centerGroup.append('circle')
      .attr('r', 36)
      .attr('fill', '#F59E0B')
      .attr('opacity', 0.15)
      .attr('filter', 'url(#constellation-glow)');

    centerGroup.append('circle')
      .attr('r', 24)
      .attr('fill', '#F59E0B')
      .attr('opacity', 0.3);

    centerGroup.append('text')
      .text('OTTO')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .attr('font-family', 'Plus Jakarta Sans, system-ui, sans-serif');

    // Domain nodes in orbit
    const angleStep = (2 * Math.PI) / DOMAIN_NODES.length;

    DOMAIN_NODES.forEach((domain, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const x = cx + Math.cos(angle) * orbitRadius;
      const y = cy + Math.sin(angle) * orbitRadius;

      // Connection line
      svg.append('line')
        .attr('x1', cx).attr('y1', cy)
        .attr('x2', cx).attr('y2', cy)
        .attr('stroke', domain.color)
        .attr('stroke-width', 1)
        .attr('opacity', 0.1)
        .transition().duration(1200).delay(i * 100)
        .attr('x2', x).attr('y2', y);

      const nodeGroup = svg.append('g')
        .attr('transform', `translate(${cx},${cy})`)
        .style('cursor', 'pointer');

      // Animate to position
      nodeGroup.transition()
        .duration(1200)
        .delay(i * 100)
        .ease(d3.easeBackOut.overshoot(1.2))
        .attr('transform', `translate(${x},${y})`);

      // Outer glow
      nodeGroup.append('circle')
        .attr('r', 30)
        .attr('fill', domain.color)
        .attr('opacity', 0.08)
        .attr('filter', 'url(#constellation-glow)');

      // Main circle
      nodeGroup.append('circle')
        .attr('r', 22)
        .attr('fill', domain.color)
        .attr('opacity', 0.2)
        .attr('stroke', domain.color)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.3);

      // Icon emoji
      nodeGroup.append('text')
        .text(domain.icon)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', '20px');

      // Label
      const labelY = 36;
      nodeGroup.append('text')
        .text(domain.label)
        .attr('text-anchor', 'middle')
        .attr('dy', `${labelY}px`)
        .attr('fill', 'rgba(255,255,255,0.7)')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('font-family', 'Plus Jakarta Sans, system-ui, sans-serif');

      // Hover interactions
      nodeGroup
        .on('mouseenter', function(event: MouseEvent) {
          d3.select(this).select('circle:nth-child(2)')
            .transition().duration(200)
            .attr('r', 28).attr('opacity', 0.35);
          const rect = container.getBoundingClientRect();
          setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top - 20 });
          setHoveredDomain(domain);
        })
        .on('mouseleave', function() {
          d3.select(this).select('circle:nth-child(2)')
            .transition().duration(200)
            .attr('r', 22).attr('opacity', 0.2);
          setHoveredDomain(null);
        });
    });

    return () => {
      d3.select(container).select('svg').remove();
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full" style={{ minHeight: 500 }}>
      {hoveredDomain && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -100%)' }}
        >
          <div className="bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{hoveredDomain.icon}</span>
              <span className="font-semibold text-white text-sm">{hoveredDomain.label}</span>
            </div>
            <p className="text-neutral-400 text-xs mb-3">{hoveredDomain.description}</p>
            <div className="flex flex-wrap gap-1">
              {hoveredDomain.capabilities.map(cap => (
                <span key={cap} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/70 border border-white/10">
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
