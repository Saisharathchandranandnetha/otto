import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricPillarCardProps {
  title: string;
  primaryMetric: string;
  secondaryMetric: string;
  icon: LucideIcon;
  trendUp?: boolean;
}

export function MetricPillarCard({
  title,
  primaryMetric,
  secondaryMetric,
  icon: Icon,
  trendUp
}: MetricPillarCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-outline-variant/30 bg-surface p-4 shadow-sm transition hover:border-on-surface-variant/40">
      {/* Left accent border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
      
      <div className="flex items-start justify-between pl-2">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Icon size={18} className="text-amber-500" />
          <h3 className="text-label-md font-medium">{title}</h3>
        </div>
      </div>
      
      <div className="mt-4 pl-2">
        <div className="flex items-end gap-2">
          <p className="text-headline-sm font-semibold text-on-surface leading-none">
            {primaryMetric}
          </p>
          {trendUp !== undefined && (
            <span className={`text-label-sm font-medium leading-none ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
              {trendUp ? '↑' : '↓'} vs yday
            </span>
          )}
        </div>
        <p className="mt-2 text-label-sm text-on-surface-variant">
          {secondaryMetric}
        </p>
      </div>
    </div>
  );
}
