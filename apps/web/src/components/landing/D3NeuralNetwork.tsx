'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  color: string;
  radius: number;
  group: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

const DOMAINS: Omit<Node, keyof d3.SimulationNodeDatum>[] = [
  { id: 'edu', label: 'Education', color: '#3B82F6', radius: 28, group: 1 },
  { id: 'mfg', label: 'Manufacturing', color: '#F59E0B', radius: 26, group: 1 },
  { id: 'hc', label: 'Healthcare', color: '#EF4444', radius: 27, group: 1 },
  { id: 'cs', label: 'Support', color: '#8B5CF6', radius: 25, group: 1 },
  { id: 'ret', label: 'Retail', color: '#EC4899', radius: 24, group: 1 },
  { id: 'sales', label: 'Sales', color: '#10B981', radius: 25, group: 1 },
  { id: 'legal', label: 'Legal', color: '#6B7280', radius: 23, group: 1 },
  { id: 'otto', label: 'OTTO', color: '#F59E0B', radius: 40, group: 0 },
  { id: 'trust', label: 'Trust', color: '#06B6D4', radius: 20, group: 2 },
  { id: 'rag', label: 'Knowledge', color: '#14B8A6', radius: 20, group: 2 },
  { id: 'wf', label: 'Workflows', color: '#A855F7', radius: 20, group: 2 },
  { id: 'ai', label: 'AI Core', color: '#F97316', radius: 22, group: 2 },
];

const LINKS: { source: string; target: string; value: number }[] = [
  { source: 'otto', target: 'edu', value: 3 },
  { source: 'otto', target: 'mfg', value: 3 },
  { source: 'otto', target: 'hc', value: 3 },
  { source: 'otto', target: 'cs', value: 2 },
  { source: 'otto', target: 'ret', value: 2 },
  { source: 'otto', target: 'sales', value: 2 },
  { source: 'otto', target: 'legal', value: 2 },
  { source: 'otto', target: 'trust', value: 4 },
  { source: 'otto', target: 'rag', value: 4 },
  { source: 'otto', target: 'wf', value: 4 },
  { source: 'otto', target: 'ai', value: 5 },
  { source: 'ai', target: 'trust', value: 2 },
  { source: 'ai', target: 'rag', value: 2 },
  { source: 'trust', target: 'wf', value: 1 },
  { source: 'edu', target: 'rag', value: 1 },
  { source: 'hc', target: 'ai', value: 1 },
  { source: 'mfg', target: 'wf', value: 1 },
  { source: 'cs', target: 'ai', value: 1 },
  { source: 'sales', target: 'trust', value: 1 },
];

export function D3NeuralNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous
    d3.select(container).select('svg').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svgRef.current = svg.node();

    // Defs for glows and gradients
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'neural-glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Particle glow
    const particleFilter = defs.append('filter').attr('id', 'particle-glow');
    particleFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const pfMerge = particleFilter.append('feMerge');
    pfMerge.append('feMergeNode').attr('in', 'coloredBlur');
    pfMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const nodes: Node[] = DOMAINS.map(d => ({ ...d }));
    const links: Link[] = LINKS.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(d => 80 + (d.value as number) * 15).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-250))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<Node>().radius(d => d.radius + 10))
      .alphaDecay(0.008);

    // Link elements
    const linkGroup = svg.append('g').attr('class', 'links');
    const linkElements = linkGroup.selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(255,255,255,0.06)')
      .attr('stroke-width', (d: Link) => Math.sqrt(d.value as number) * 1.2);

    // Animated particles along edges
    const particleGroup = svg.append('g').attr('class', 'particles');

    interface ParticleData {
      link: Link;
      offset: number;
      speed: number;
      color: string;
    }
    const particleData: ParticleData[] = [];
    links.forEach(link => {
      const count = Math.ceil((link.value as number) * 0.6);
      for (let i = 0; i < count; i++) {
        const src = nodes.find(n => n.id === (typeof link.source === 'string' ? link.source : (link.source as Node).id));
        particleData.push({
          link,
          offset: Math.random(),
          speed: 0.002 + Math.random() * 0.003,
          color: src?.color ?? '#F59E0B',
        });
      }
    });

    const particles = particleGroup.selectAll('circle')
      .data(particleData)
      .join('circle')
      .attr('r', 2)
      .attr('fill', (d: ParticleData) => d.color)
      .attr('opacity', 0.7)
      .attr('filter', 'url(#particle-glow)');

    // Node elements
    const nodeGroup = svg.append('g').attr('class', 'nodes');
    const nodeElements = nodeGroup.selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'grab');

    // Halo ring
    nodeElements.append('circle')
      .attr('r', (d: Node) => d.radius + 8)
      .attr('fill', 'none')
      .attr('stroke', (d: Node) => d.color)
      .attr('stroke-width', 1)
      .attr('opacity', 0.15);

    // Pulse ring
    nodeElements.append('circle')
      .attr('r', (d: Node) => d.radius + 4)
      .attr('fill', 'none')
      .attr('stroke', (d: Node) => d.color)
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.3)
      .each(function(this: SVGCircleElement) {
        const el = d3.select(this);
        function pulse() {
          el.transition()
            .duration(2000 + Math.random() * 1000)
            .attr('r', function(this: SVGCircleElement) {
              const d = d3.select(this.parentNode as Element).datum() as Node;
              return d.radius + 16;
            })
            .attr('opacity', 0)
            .transition()
            .duration(0)
            .attr('r', function(this: SVGCircleElement) {
              const d = d3.select(this.parentNode as Element).datum() as Node;
              return d.radius + 4;
            })
            .attr('opacity', 0.3)
            .on('end', pulse);
        }
        pulse();
      });

    // Main circle
    nodeElements.append('circle')
      .attr('r', (d: Node) => d.radius)
      .attr('fill', (d: Node) => d.color)
      .attr('opacity', (d: Node) => d.group === 0 ? 0.9 : 0.2)
      .attr('filter', 'url(#neural-glow)');

    // Inner gradient circle
    nodeElements.append('circle')
      .attr('r', (d: Node) => d.radius * 0.7)
      .attr('fill', (d: Node) => d.color)
      .attr('opacity', (d: Node) => d.group === 0 ? 0.6 : 0.15);

    // Labels
    nodeElements.append('text')
      .text((d: Node) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d: Node) => d.radius + 18)
      .attr('fill', 'rgba(255,255,255,0.6)')
      .attr('font-size', (d: Node) => d.group === 0 ? '13px' : '10px')
      .attr('font-weight', (d: Node) => d.group === 0 ? '600' : '400')
      .attr('font-family', 'Plus Jakarta Sans, system-ui, sans-serif');

    // Drag behavior
    const drag = d3.drag<SVGGElement, Node>()
      .on('start', (event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeElements.call(drag as any);

    simulation.on('tick', () => {
      linkElements
        .attr('x1', (d: Link) => (d.source as Node).x!)
        .attr('y1', (d: Link) => (d.source as Node).y!)
        .attr('x2', (d: Link) => (d.target as Node).x!)
        .attr('y2', (d: Link) => (d.target as Node).y!);

      nodeElements.attr('transform', (d: Node) => `translate(${d.x},${d.y})`);

      // Animate particles
      particles.each(function(this: SVGCircleElement, d: ParticleData) {
        d.offset = (d.offset + d.speed) % 1;
        const src = d.link.source as Node;
        const tgt = d.link.target as Node;
        const x = src.x! + (tgt.x! - src.x!) * d.offset;
        const y = src.y! + (tgt.y! - src.y!) * d.offset;
        d3.select(this).attr('cx', x).attr('cy', y);
      });
    });

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      svg.attr('width', w).attr('height', h).attr('viewBox', `0 0 ${w} ${h}`);
      simulation.force('center', d3.forceCenter(w / 2, h / 2));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      simulation.stop();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
  );
}
