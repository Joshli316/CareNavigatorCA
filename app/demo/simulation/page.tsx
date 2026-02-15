'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine,
} from 'recharts';
import { SIMULATION_PROGRAMS, generateCliffData, calculateBenefitsAtIncome, getOptimalSequence } from '@/lib/data/mock-simulation';
import { formatCurrency } from '@/lib/utils/format';

// Muted, professional palette instead of rainbow
const CHART_COLORS = ['#171717', '#525252', '#737373', '#a3a3a3', '#d4d4d4', '#e5e5e5', '#404040', '#78716c'];

export default function SimulationPage() {
  const [income, setIncome] = useState(1500);
  const cliffData = useMemo(() => generateCliffData(), []);
  const currentBenefits = useMemo(() => calculateBenefitsAtIncome(income), [income]);
  const sequence = useMemo(() => getOptimalSequence(), []);

  const totalBenefits = currentBenefits.reduce((s, b) => s + b.benefit, 0);
  const netResources = income + totalBenefits;

  // Biggest cliff
  const biggestCliff = useMemo(() => {
    let maxDrop = 0, maxIncome = 0;
    for (let i = 1; i < cliffData.length; i++) {
      const drop = (cliffData[i - 1]['totalBenefits'] as number) - (cliffData[i]['totalBenefits'] as number);
      if (drop > maxDrop) { maxDrop = drop; maxIncome = cliffData[i]['income'] as number; }
    }
    return { income: maxIncome, drop: maxDrop };
  }, [cliffData]);

  // What-if
  const higherBenefits = useMemo(() => calculateBenefitsAtIncome(income + 500), [income]);
  const higherTotal = higherBenefits.reduce((s, b) => s + b.benefit, 0);
  const benefitLoss = totalBenefits - higherTotal;
  const netGain = 500 - benefitLoss;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <a href="/demo" className="text-xs font-mono text-gray-300 hover:text-gray-500 transition-colors">&larr; demo</a>
        <h1 className="text-3xl font-bold text-gray-950 tracking-tight mt-6 mb-2">Benefits Simulation</h1>
        <p className="text-sm text-gray-400 mb-12">Household of 3, Texas. Drag the slider.</p>

        {/* Slider + stats */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Monthly income</p>
              <p className="text-5xl font-bold text-gray-950 tabular-nums tracking-tight">{formatCurrency(income)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Total benefits</p>
              <p className="text-5xl font-bold text-gray-950 tabular-nums tracking-tight">{formatCurrency(totalBenefits)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Net resources</p>
              <p className="text-5xl font-bold text-gray-950 tabular-nums tracking-tight">{formatCurrency(netResources)}</p>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={6000}
            step={100}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-900"
          />
          <div className="flex justify-between text-[10px] text-gray-300 mt-1.5 tabular-nums">
            <span>$0</span><span>$1.5k</span><span>$3k</span><span>$4.5k</span><span>$6k</span>
          </div>
          {Math.abs(income - biggestCliff.income) < 400 && (
            <p className="text-xs text-gray-500 mt-3">
              <span className="text-gray-900 font-medium">Cliff at {formatCurrency(biggestCliff.income)}</span> — earning past this loses {formatCurrency(biggestCliff.drop)}/mo
            </p>
          )}
        </div>

        {/* Main cliff chart */}
        <div className="mb-16">
          <h2 className="text-sm font-semibold text-gray-950 mb-1">The cliff</h2>
          <p className="text-xs text-gray-400 mb-6">Total benefits by income. Sharp drops = you earn more but have less.</p>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={cliffData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis dataKey="income" tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} stroke="#d4d4d4" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} stroke="#d4d4d4" fontSize={11} tickLine={false} axisLine={false} width={45} />
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any, name: any) => [formatCurrency(value) + '/mo', name]}
                labelFormatter={(v) => `Income: ${formatCurrency(v as number)}/mo`}
                contentStyle={{ borderRadius: '6px', border: '1px solid #e5e5e5', boxShadow: 'none', fontSize: '12px' }}
              />
              <ReferenceLine x={income} stroke="#171717" strokeDasharray="4 4" strokeWidth={1} />
              {SIMULATION_PROGRAMS.map((p, i) => (
                <Area key={p.name} type="stepAfter" dataKey={p.name} stackId="1" stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.15 + (i * 0.08)} strokeWidth={0} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
            {SIMULATION_PROGRAMS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[i], opacity: 0.6 }} />
                <span className="text-[11px] text-gray-400">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current breakdown + What if */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-sm font-semibold text-gray-950 mb-1">At {formatCurrency(income)}/mo</h2>
            <p className="text-xs text-gray-400 mb-6">Program-by-program</p>
            <div className="space-y-3">
              {currentBenefits.filter(b => b.benefit > 0).map((b, i) => (
                <div key={b.program} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-20">{b.program}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(b.benefit / 1200) * 100}%`, backgroundColor: CHART_COLORS[i] }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 tabular-nums w-16 text-right">{formatCurrency(b.benefit)}</span>
                </div>
              ))}
              {currentBenefits.every(b => b.benefit === 0) && (
                <p className="text-sm text-gray-400 italic">No benefits at this income level</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-950 mb-1">What if you earn $500 more?</h2>
            <p className="text-xs text-gray-400 mb-6">{formatCurrency(income)} &rarr; {formatCurrency(income + 500)}</p>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-500">Extra income</span>
                <span className="text-sm font-medium text-gray-900">+$500</span>
              </div>
              {benefitLoss > 0 && (
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-gray-500">Benefits lost</span>
                  <span className="text-sm font-medium text-gray-900">-{formatCurrency(benefitLoss)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex items-baseline justify-between">
                <span className="text-sm font-medium text-gray-900">Net change</span>
                <span className={`text-lg font-semibold tabular-nums ${netGain >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                  {netGain >= 0 ? '+' : ''}{formatCurrency(netGain)}/mo
                </span>
              </div>
              {netGain < 0 && (
                <p className="text-xs text-red-500">You&apos;d have less money. The cliff is real.</p>
              )}
              {benefitLoss > 0 && (
                <div className="pt-2 space-y-1">
                  {currentBenefits.map((c, i) => {
                    const diff = c.benefit - higherBenefits[i].benefit;
                    if (diff <= 0) return null;
                    return (
                      <div key={c.program} className="flex items-center justify-between text-xs text-gray-400">
                        <span>{c.program}</span>
                        <span>-{formatCurrency(diff)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Optimal sequence */}
        <div className="mb-16">
          <h2 className="text-sm font-semibold text-gray-950 mb-1">Optimal sequence</h2>
          <p className="text-xs text-gray-400 mb-8">Apply in this order. Some approvals unlock faster processing for others.</p>
          <div className="space-y-3">
            {sequence.map((s, i) => (
              <div key={s.program} className="flex items-start gap-4">
                <span className="text-xs font-mono text-gray-300 w-5 pt-0.5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium text-gray-900">{s.program}</span>
                    <span className="text-[10px] text-gray-400 tabular-nums">{s.duration}w</span>
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] text-gray-300">Week {s.week}</span>
                  </div>
                  <p className="text-xs text-gray-400">{s.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-12 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400 mb-4">At {formatCurrency(income)}/mo, you could receive up to {formatCurrency(totalBenefits)}/mo in benefits.</p>
          <a href="/quiz" className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Start screening
          </a>
        </div>
      </div>
    </div>
  );
}
