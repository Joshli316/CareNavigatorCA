'use client';

import { useState, useMemo } from 'react';
import { EligibilityResult } from '@/types/benefit';
import { calculateBenefitsAtIncome, SIMULATION_PROGRAMS } from '@/lib/data/mock-simulation';
import { formatCurrency } from '@/lib/utils/format';
import { Expandable } from '@/components/shared/Expandable';

interface BenefitsCliffProps {
  income: number;
  results: EligibilityResult[];
}

export function BenefitsCliff({ income, results }: BenefitsCliffProps) {
  const clampedIncome = Math.max(0, Math.min(6000, income));
  const [sliderIncome, setSliderIncome] = useState(clampedIncome);

  const currentBenefits = useMemo(() => calculateBenefitsAtIncome(clampedIncome), [clampedIncome]);
  const sliderBenefits = useMemo(() => calculateBenefitsAtIncome(sliderIncome), [sliderIncome]);

  const currentTotal = currentBenefits.reduce((s, b) => s + b.benefit, 0);
  const sliderTotal = sliderBenefits.reduce((s, b) => s + b.benefit, 0);

  const currentNet = clampedIncome + currentTotal;
  const sliderNet = sliderIncome + sliderTotal;
  const netChange = sliderNet - currentNet;

  // Find the biggest cliff near user's income (within $800)
  const nearestCliff = useMemo(() => {
    let maxDrop = 0;
    let cliffIncome = 0;
    for (let i = clampedIncome; i <= Math.min(clampedIncome + 800, 6000); i += 50) {
      const before = calculateBenefitsAtIncome(i);
      const after = calculateBenefitsAtIncome(i + 50);
      const drop = before.reduce((s, b) => s + b.benefit, 0) - after.reduce((s, b) => s + b.benefit, 0);
      if (drop > maxDrop) {
        maxDrop = drop;
        cliffIncome = i + 50;
      }
    }
    return maxDrop > 50 ? { income: cliffIncome, drop: maxDrop } : null;
  }, [clampedIncome]);

  // Max benefit across all programs (for bar scaling)
  const maxBenefit = Math.max(...SIMULATION_PROGRAMS.map(p => p.maxMonthlyBenefit));

  // Format for display — use raw $ for zero values instead of "Varies"
  const fmt = (v: number) => v === 0 ? '$0' : formatCurrency(v);

  const trigger = (
    <button className="w-full flex items-center justify-between gap-2 py-3 px-4 text-left group">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-accent-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span className="text-sm font-medium text-gray-900">Income & Benefits Cliff</span>
        {nearestCliff && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-error-light text-error font-medium">Cliff nearby</span>
        )}
      </div>
      <svg
        className="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 group-hover:text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-subtle overflow-hidden">
      <Expandable trigger={trigger}>
        <div className="px-4 pb-5 space-y-5">
          {/* Comparison rows */}
          <div className="space-y-2">
            <ComparisonRow
              label="Current"
              income={clampedIncome}
              benefits={currentTotal}
              net={currentNet}
              fmt={fmt}
            />
            <ComparisonRow
              label={`At ${fmt(sliderIncome)}`}
              income={sliderIncome}
              benefits={sliderTotal}
              net={sliderNet}
              fmt={fmt}
              highlight
            />
            {/* Net change row */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">Net change</span>
              <div className="flex items-center gap-3 text-xs tabular-nums">
                <span className="text-gray-400">
                  {sliderIncome >= clampedIncome ? '+' : ''}{fmt(sliderIncome - clampedIncome)} income
                </span>
                {sliderTotal !== currentTotal && (
                  <span className="text-gray-400">
                    {sliderTotal >= currentTotal ? '+' : ''}{fmt(sliderTotal - currentTotal)} benefits
                  </span>
                )}
                <span className={`font-semibold ${netChange >= 0 ? 'text-success' : 'text-error'}`}>
                  = {netChange >= 0 ? '+' : ''}{fmt(netChange)}/mo
                </span>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div>
            <input
              type="range"
              min={0}
              max={6000}
              step={100}
              value={sliderIncome}
              onChange={(e) => setSliderIncome(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-600 [&::-webkit-slider-thumb]:shadow-subtle"
            />
            <div className="flex justify-between text-[10px] text-gray-300 mt-1 tabular-nums">
              <span>$0</span><span>$1.5k</span><span>$3k</span><span>$4.5k</span><span>$6k</span>
            </div>
          </div>

          {/* Cliff warning */}
          {nearestCliff && (
            <div className="flex items-start gap-2 bg-error-light rounded-lg px-3 py-2.5">
              <svg className="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-xs text-gray-700">
                Earning past <span className="font-semibold">{fmt(nearestCliff.income)}/mo</span> could
                reduce your benefits by <span className="font-semibold text-error">{fmt(nearestCliff.drop)}/mo</span>
              </p>
            </div>
          )}

          {/* Program breakdown bars */}
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">Program Breakdown</p>
            <div className="space-y-2">
              {SIMULATION_PROGRAMS.map((prog) => {
                const current = currentBenefits.find(b => b.program === prog.name);
                const slider = sliderBenefits.find(b => b.program === prog.name);
                if (!current || !slider) return null;
                // Skip programs with zero at both income levels
                if (current.benefit === 0 && slider.benefit === 0) return null;

                const currentPct = (current.benefit / maxBenefit) * 100;
                const sliderPct = (slider.benefit / maxBenefit) * 100;
                const diff = slider.benefit - current.benefit;

                return (
                  <div key={prog.name} className="group">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs text-gray-600">{prog.name}</span>
                      <div className="flex items-center gap-2 text-xs tabular-nums">
                        <span className="text-gray-400">{fmt(current.benefit)}</span>
                        {diff !== 0 && (
                          <>
                            <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <span className={diff > 0 ? 'text-success font-medium' : 'text-error font-medium'}>
                              {fmt(slider.benefit)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Stacked bars */}
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      {/* Current bar */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                        style={{
                          width: `${currentPct}%`,
                          backgroundColor: prog.color,
                          opacity: 0.3,
                        }}
                      />
                      {/* Slider bar (overlaid) */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                        style={{
                          width: `${sliderPct}%`,
                          backgroundColor: prog.color,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-3 h-1.5 rounded-full bg-gray-300 opacity-30" />
              <span>Current ({fmt(clampedIncome)})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-1.5 rounded-full bg-gray-500 opacity-80" />
              <span>Slider ({fmt(sliderIncome)})</span>
            </div>
          </div>
        </div>
      </Expandable>
    </div>
  );
}

/** Compact row: income -> benefits -> net */
function ComparisonRow({
  label,
  income,
  benefits,
  net,
  fmt,
  highlight,
}: {
  label: string;
  income: number;
  benefits: number;
  net: number;
  fmt: (v: number) => string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${highlight ? 'bg-accent-50' : 'bg-gray-50'}`}>
      <span className={`text-xs font-medium ${highlight ? 'text-accent-700' : 'text-gray-500'} w-20 flex-shrink-0`}>
        {label}
      </span>
      <div className="flex items-center gap-3 text-xs tabular-nums">
        <span className="text-gray-500">{fmt(income)} income</span>
        <span className="text-gray-300">+</span>
        <span className="text-gray-500">{fmt(benefits)} benefits</span>
        <span className="text-gray-300">=</span>
        <span className="font-semibold text-gray-900">{fmt(net)}</span>
      </div>
    </div>
  );
}
