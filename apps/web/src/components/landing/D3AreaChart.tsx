'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AreaChartProps {
  data?: number[];
  color?: string;
  height?: number;
}

export function D3AreaChart({
  data = [12, 19, 28, 35, 42, 55, 48, 62, 71, 68, 78, 85, 92, 88, 95],
  color = '#F59E0B',
  height = 120,
}: AreaChartProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    d3.select(container).select('svg').remove();

    const width = container.clientWidth || 300;
    const margin = { top: 10, right: 0, bottom: 0, left: 0 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const defs = svg.append('defs');
    const gradientId = `area-grad-${Math.random().toString(36).slice(2, 8)}`;
    const gradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0').attr('y1', '0')
      .attr('x2', '0').attr('y2', '1');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.4);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.02);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, innerW]);
    const y = d3.scaleLinear().domain([0, d3.max(data) || 100]).range([innerH, 0]);

    // Area
    const area = d3.area<number>()
      .x((_, i) => x(i))
      .y0(innerH)
      .y1(d => y(d))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Line
    const line = d3.line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Clip path for animation
    const clipId = `clip-${Math.random().toString(36).slice(2, 8)}`;
    const clip = defs.append('clipPath').attr('id', clipId);
    const clipRect = clip.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', 0).attr('height', innerH + 10);

    clipRect.transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .attr('width', innerW + 10);

    const clipped = g.append('g').attr('clip-path', `url(#${clipId})`);

    // Draw area
    clipped.append('path')
      .datum(data)
      .attr('d', area)
      .attr('fill', `url(#${gradientId})`);

    // Draw line
    clipped.append('path')
      .datum(data)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round');

    // Glow dot at last point
    const lastX = x(data.length - 1);
    const lastY = y(data[data.length - 1]);
    
    clipped.append('circle')
      .attr('cx', lastX)
      .attr('cy', lastY)
      .attr('r', 4)
      .attr('fill', color)
      .attr('opacity', 0)
      .transition().delay(1800).duration(400)
      .attr('opacity', 1);

    clipped.append('circle')
      .attr('cx', lastX)
      .attr('cy', lastY)
      .attr('r', 8)
      .attr('fill', color)
      .attr('opacity', 0)
      .transition().delay(1800).duration(400)
      .attr('opacity', 0.2);

    return () => {
      d3.select(container).select('svg').remove();
    };
  }, [data, color, height]);

  return <div ref={ref} className="w-full" />;
}
