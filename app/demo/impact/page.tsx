'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import { MOCK_USERS, getImpactStats } from '@/lib/data/mock-impact';
import { formatCurrency } from '@/lib/utils/format';

export default function ImpactPage() {
  const stats = useMemo(() => getImpactStats(MOCK_USERS), []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <a href="/demo" className="text-xs font-mono text-gray-300 hover:text-gray-500 transition-colors">&larr; demo</a>
        <div className="flex items-end justify-between mt-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-950 tracking-tight">Impact</h1>
            <p className="text-sm text-gray-400 mt-1">DFW Metroplex &middot; Last 6 months &middot; {stats.totalScreened.toLocaleString()} users</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-px bg-gray-100 rounded-lg overflow-hidden mb-16">
          {[
            { label: 'Screenings', value: stats.totalScreened.toLocaleString() },
            { label: 'Applications', value: stats.totalApplied.toLocaleString() },
            { label: 'Approved', value: stats.totalApproved.toLocaleString() },
            { label: 'Benefits secured', value: formatCurrency(stats.totalBenefitsAnnual) + '/yr' },
          ].map((s) => (
            <div key={s.label} className="bg-white p-6">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="text-2xl font-semibold text-gray-950 tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ROI callout — quiet, not a gradient banner */}
        <div className="flex items-baseline gap-12 mb-16 pb-16 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-1">Grant ROI</p>
            <p className="text-6xl font-bold text-gray-950 tabular-nums tracking-tight">{Math.round(stats.totalBenefitsAnnual / 50000)}x</p>
            <p className="text-sm text-gray-400 mt-1">$50K grant &rarr; {formatCurrency(stats.totalBenefitsAnnual)} in benefits</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Conversion</p>
            <p className="text-6xl font-bold text-gray-950 tabular-nums tracking-tight">{stats.conversionRate}%</p>
            <p className="text-sm text-gray-400 mt-1">screened &rarr; approved</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Avg. benefit</p>
            <p className="text-6xl font-bold text-gray-950 tabular-nums tracking-tight">{formatCurrency(stats.avgBenefitPerUser)}</p>
            <p className="text-sm text-gray-400 mt-1">per approved user / month</p>
          </div>
        </div>

        {/* Trend */}
        <div className="mb-16">
          <h2 className="text-sm font-semibold text-gray-950 mb-1">Monthly trend</h2>
          <p className="text-xs text-gray-400 mb-6">Screenings and outcomes over time</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats.monthlyTrend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis dataKey="month" stroke="#d4d4d4" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#d4d4d4" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e5e5e5', boxShadow: 'none', fontSize: '12px' }} />
              <Area type="monotone" dataKey="screened" stroke="#171717" fill="#171717" fillOpacity={0.06} strokeWidth={1.5} name="Screened" />
              <Area type="monotone" dataKey="applied" stroke="#737373" fill="#737373" fillOpacity={0.04} strokeWidth={1.5} name="Applied" />
              <Area type="monotone" dataKey="approved" stroke="#a3a3a3" fill="#a3a3a3" fillOpacity={0.03} strokeWidth={1.5} name="Approved" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-3">
            {[
              { label: 'Screened', color: '#171717' },
              { label: 'Applied', color: '#737373' },
              { label: 'Approved', color: '#a3a3a3' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-xs text-gray-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* County + Demographics side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-sm font-semibold text-gray-950 mb-1">By county</h2>
            <p className="text-xs text-gray-400 mb-6">Screenings by county</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.byCounty} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
                <XAxis type="number" stroke="#d4d4d4" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="county" width={65} stroke="#d4d4d4" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e5e5e5', boxShadow: 'none', fontSize: '12px' }} />
                <Bar dataKey="screened" fill="#171717" radius={[0, 2, 2, 0]} name="Screened" />
                <Bar dataKey="approved" fill="#d4d4d4" radius={[0, 2, 2, 0]} name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-950 mb-1">Demographics</h2>
            <p className="text-xs text-gray-400 mb-6">User breakdown</p>
            <div className="space-y-4">
              {stats.byAgeGroup.map(ag => {
                const pct = Math.round((ag.count / stats.totalScreened) * 100);
                return (
                  <div key={ag.ageGroup}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{ag.ageGroup}</span>
                      <span className="text-xs text-gray-400 tabular-nums">{ag.count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-900 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
              {[
                { label: 'Disability', value: MOCK_USERS.filter(u => u.demographics.hasDisability).length },
                { label: 'Children', value: MOCK_USERS.filter(u => u.demographics.hasChildren).length },
                { label: 'Veterans', value: MOCK_USERS.filter(u => u.demographics.isVeteran).length },
              ].map(d => (
                <div key={d.label}>
                  <p className="text-2xl font-semibold text-gray-950 tabular-nums">{d.value}</p>
                  <p className="text-xs text-gray-400">{d.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Program funnel */}
        <div className="mb-16">
          <h2 className="text-sm font-semibold text-gray-950 mb-1">Program conversion</h2>
          <p className="text-xs text-gray-400 mb-6">Matched &rarr; applied &rarr; approved</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs">Program</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-400 text-xs">Matched</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-400 text-xs">Applied</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-400 text-xs">Approved</th>
                  <th className="text-right py-2 pl-4 font-medium text-gray-400 text-xs">Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats.byProgram.map((p) => (
                  <tr key={p.program} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-2.5 pr-4 font-medium text-gray-900">{p.program}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-gray-500">{p.matched}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-gray-500">{p.applied}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-gray-500">{p.approved}</td>
                    <td className="py-2.5 pl-4 text-right tabular-nums font-medium text-gray-900">{p.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-300">Report generated Feb 15, 2026</p>
          <button className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Download PDF</button>
        </div>
      </div>
    </div>
  );
}
