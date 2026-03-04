'use client';

import { useState, useMemo } from 'react';
import { ApplicationStrategy, RankedProgram, TierLevel } from '@/lib/utils/strategy';
import { formatCurrency } from '@/lib/utils/format';

interface ApplicationTimelineProps {
  strategy: ApplicationStrategy;
}

interface TimelineEntry {
  program: RankedProgram;
  startWeek: number;
  durationWeeks: number;
  tier: TierLevel;
}

const TIER_COLORS: Record<TierLevel, { bar: string; dot: string }> = {
  high: { bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  medium: { bar: 'bg-amber-400', dot: 'bg-amber-400' },
  low: { bar: 'bg-gray-300', dot: 'bg-gray-300' },
};

function buildTimelineEntries(strategy: ApplicationStrategy): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const tier of strategy.tiers) {
    for (const program of tier.programs) {
      const duration = program.result.timelineWeeks || 0;
      let startWeek: number;

      if (tier.level === 'high') {
        // High-tier programs start immediately (week 0)
        startWeek = 0;
      } else if (tier.level === 'medium') {
        // Medium-tier starts staggered at week 2-4 based on rank
        startWeek = 2 + (program.rank % 3) * 1;
      } else {
        // Low-tier starts after 4+ weeks
        startWeek = 4 + (program.rank % 4) * 1;
      }

      entries.push({
        program,
        startWeek,
        durationWeeks: Math.max(duration, 1), // minimum 1 week for visual
        tier: tier.level,
      });
    }
  }

  // Sort: earliest start first, then shortest duration first
  entries.sort((a, b) => {
    if (a.startWeek !== b.startWeek) return a.startWeek - b.startWeek;
    return a.durationWeeks - b.durationWeeks;
  });

  return entries;
}

function getScaleMarkers(maxWeek: number): number[] {
  const markers: number[] = [0];
  const step = maxWeek <= 12 ? 2 : maxWeek <= 24 ? 4 : 8;
  for (let w = step; w <= maxWeek; w += step) {
    markers.push(w);
  }
  // Always include the max
  if (markers[markers.length - 1] !== maxWeek) {
    markers.push(maxWeek);
  }
  return markers;
}

export function ApplicationTimeline({ strategy }: ApplicationTimelineProps) {
  const [expanded, setExpanded] = useState(false);

  const entries = useMemo(() => buildTimelineEntries(strategy), [strategy]);

  if (entries.length === 0) return null;

  const maxWeek = Math.max(...entries.map(e => e.startWeek + e.durationWeeks));
  const scaleMarkers = getScaleMarkers(maxWeek);

  // Longest program for the "full benefits" label
  const longestEntry = entries.reduce((a, b) =>
    (a.startWeek + a.durationWeeks > b.startWeek + b.durationWeeks) ? a : b
  );
  const fullBenefitsWeek = longestEntry.startWeek + longestEntry.durationWeeks;

  // Cumulative monthly value
  const totalMonthly = entries.reduce((sum, e) => {
    const v = e.program.result.estimatedMonthlyBenefit;
    return sum + (v > 0 ? v : 0);
  }, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-subtle overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-5 py-3 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={expanded}
        aria-controls="application-timeline"
      >
        {/* Calendar/timeline icon */}
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-semibold text-gray-900 text-sm flex-1">Application Timeline</span>
        <span className="text-xs text-gray-500 tabular-nums mr-2">
          ~{fullBenefitsWeek} weeks total
        </span>
        <span className="text-xs text-gray-600 uppercase tracking-wide mr-2">
          {expanded ? 'Collapse' : 'View'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div id="application-timeline" className="px-5 pb-5">
          {/* Desktop: Gantt chart */}
          <div className="hidden sm:block">
            {/* Scale */}
            <div className="flex items-end mb-1 ml-[140px]" aria-hidden="true">
              <div className="flex-1 relative h-5">
                {scaleMarkers.map(w => (
                  <span
                    key={w}
                    className="absolute text-xs text-gray-400 tabular-nums -translate-x-1/2"
                    style={{ left: `${(w / maxWeek) * 100}%` }}
                  >
                    {w}w
                  </span>
                ))}
              </div>
            </div>

            {/* Scale tick line */}
            <div className="flex items-center mb-2 ml-[140px]" aria-hidden="true">
              <div className="flex-1 relative h-px bg-gray-200">
                {scaleMarkers.map(w => (
                  <span
                    key={w}
                    className="absolute w-px h-2 bg-gray-300 -top-1"
                    style={{ left: `${(w / maxWeek) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Rows */}
            <div className="space-y-1.5" role="list" aria-label="Program application timeline">
              {entries.map((entry) => {
                const { program, startWeek, durationWeeks, tier } = entry;
                const r = program.result;
                const leftPct = (startWeek / maxWeek) * 100;
                const widthPct = (durationWeeks / maxWeek) * 100;
                const colors = TIER_COLORS[tier];
                const benefit = r.estimatedMonthlyBenefit;
                const isInstant = r.timelineWeeks === 0;

                return (
                  <div
                    key={r.programId}
                    className="flex items-center gap-3 group"
                    role="listitem"
                  >
                    {/* Program name + tier dot */}
                    <div className="w-[128px] flex-shrink-0 flex items-center gap-1.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                      <span className="text-xs text-gray-700 font-medium truncate" title={r.program.name}>
                        {r.program.shortName || r.program.name}
                      </span>
                    </div>

                    {/* Bar track */}
                    <div className="flex-1 relative h-5 flex items-center">
                      <div className="absolute inset-0 bg-gray-50 rounded" />
                      <div
                        className={`absolute h-3 rounded-full ${colors.bar} ${isInstant ? 'opacity-60' : ''} transition-all`}
                        style={{
                          left: `${leftPct}%`,
                          width: `${Math.max(widthPct, 1)}%`,
                        }}
                        title={`${r.program.name}: ${isInstant ? 'Instant' : `${durationWeeks}w processing`}, starts week ${startWeek}`}
                      />
                    </div>

                    {/* Duration + value */}
                    <div className="flex-shrink-0 flex items-center gap-2 w-[110px] justify-end">
                      <span className="text-xs text-gray-400 tabular-nums">
                        {isInstant ? 'Instant' : `${r.timelineWeeks}w`}
                      </span>
                      <span className="text-xs text-gray-600 tabular-nums font-medium w-[65px] text-right">
                        {benefit > 0 ? `${formatCurrency(benefit)}/mo` : 'Varies'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-gray-500">
                Full benefits in <span className="font-medium text-gray-700">~{fullBenefitsWeek} weeks</span>
                {' '}across {entries.length} programs
              </p>
              {totalMonthly > 0 && (
                <p className="text-xs text-gray-500">
                  Est. total: <span className="font-medium text-gray-700">{formatCurrency(totalMonthly)}/mo</span>
                </p>
              )}
            </div>
          </div>

          {/* Mobile: stacked list */}
          <div className="sm:hidden space-y-2" role="list" aria-label="Program application timeline">
            {entries.map((entry) => {
              const { program, startWeek, durationWeeks, tier } = entry;
              const r = program.result;
              const colors = TIER_COLORS[tier];
              const benefit = r.estimatedMonthlyBenefit;
              const isInstant = r.timelineWeeks === 0;
              const widthPct = (durationWeeks / maxWeek) * 100;

              return (
                <div key={r.programId} className="py-2 border-b border-gray-50 last:border-0" role="listitem">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                      <span className="text-sm text-gray-900 font-medium truncate">
                        {r.program.shortName || r.program.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400 tabular-nums">
                        {isInstant ? 'Instant' : `${r.timelineWeeks}w`}
                      </span>
                      <span className="text-xs text-gray-600 tabular-nums font-medium">
                        {benefit > 0 ? `${formatCurrency(benefit)}/mo` : 'Varies'}
                      </span>
                    </div>
                  </div>
                  {/* Mini bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors.bar}`}
                      style={{ width: `${Math.max(widthPct, 4)}%` }}
                    />
                  </div>
                  {startWeek > 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">Start week {startWeek}</p>
                  )}
                </div>
              );
            })}

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-1">
              <p className="text-xs text-gray-500">
                ~{fullBenefitsWeek} weeks total
              </p>
              {totalMonthly > 0 && (
                <p className="text-xs text-gray-500">
                  Est. <span className="font-medium text-gray-700">{formatCurrency(totalMonthly)}/mo</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
