'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GaugeProps {
  value: number;       // 0–100
  label: string;
  suffix?: string;
  color?: string;
  size?: number;
}

export function D3MetricsGauge({ value, label, suffix = '%', color = '#F59E0B', size = 160 }: GaugeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    d3.select(container).select('svg').remove();

    const svg = d3.select(container)
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .attr('viewBox', `0 0 ${size} ${size}`);

    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', `gauge-grad-${label.replace(/\s/g, '')}`)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.8);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0.3);

    const g = svg.append('g')
      .attr('transform', `translate(${size / 2}, ${size / 2})`);

    const arcWidth = 10;
    const radius = (size / 2) - 14;
    const startAngle = -Math.PI * 0.75;
    const endAngle = Math.PI * 0.75;

    // Background arc
    const bgArc = d3.arc<unknown>()
      .innerRadius(radius - arcWidth)
      .outerRadius(radius)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .cornerRadius(5);

    g.append('path')
      .attr('d', bgArc({} as any))
      .attr('fill', 'rgba(255,255,255,0.06)');

    // Value arc
    const valueAngle = startAngle + (endAngle - startAngle) * (value / 100);
    const valueArc = d3.arc<unknown>()
      .innerRadius(radius - arcWidth)
      .outerRadius(radius)
      .startAngle(startAngle)
      .endAngle(startAngle)
      .cornerRadius(5);

    const valuePath = g.append('path')
      .attr('d', valueArc({} as any))
      .attr('fill', `url(#gauge-grad-${label.replace(/\s/g, '')})`);

    // Animate arc
    valuePath.transition()
      .duration(1800)
      .ease(d3.easeElasticOut.amplitude(1).period(0.5))
      .attrTween('d', () => {
        const interpolate = d3.interpolate(startAngle, valueAngle);
        return (t: number) => {
          const arc = d3.arc<unknown>()
            .innerRadius(radius - arcWidth)
            .outerRadius(radius)
            .startAngle(startAngle)
            .endAngle(interpolate(t))
            .cornerRadius(5);
          return arc({} as any) || '';
        };
      });

    // Glow dot at end of arc
    const dotAngle = valueAngle;
    const dotRadius = radius - arcWidth / 2;
    const dot = g.append('circle')
      .attr('cx', Math.cos(dotAngle - Math.PI / 2) * dotRadius)
      .attr('cy', Math.sin(dotAngle - Math.PI / 2) * dotRadius)
      .attr('r', 4)
      .attr('fill', color)
      .attr('opacity', 0);

    dot.transition().delay(1600).duration(400).attr('opacity', 0.9);

    // Center value text
    const valueText = g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.1em')
      .attr('fill', 'white')
      .attr('font-size', `${size * 0.2}px`)
      .attr('font-weight', '700')
      .attr('font-family', 'Plus Jakarta Sans, system-ui, sans-serif')
      .text('0');

    // Animate number
    const counter = { val: 0 };
    d3.select(counter).transition()
      .duration(1800)
      .ease(d3.easeCubicOut)
      .tween('text', function() {
        const i = d3.interpolateNumber(0, value);
        return function(t: number) {
          counter.val = i(t);
          valueText.text(Math.round(counter.val) + suffix);
        };
      });

    // Label text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', `${size * 0.17}px`)
      .attr('fill', 'rgba(255,255,255,0.5)')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('font-family', 'Plus Jakarta Sans, system-ui, sans-serif')
      .text(label);

    return () => {
      d3.select(container).select('svg').remove();
    };
  }, [value, label, suffix, color, size]);

  return <div ref={ref} className="inline-flex items-center justify-center" />;
}
