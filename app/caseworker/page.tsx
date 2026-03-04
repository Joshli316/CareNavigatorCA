'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  QuizData,
  DisabilityType,
  IncomeType,
  AssistanceLevel,
} from '@/types/quiz';
import { EligibilityResult } from '@/types/benefit';
import { EligibilityEngine } from '@/lib/rules/eligibilityEngine';
import { BENEFIT_PROGRAMS, getProgramsByState } from '@/lib/rules/programs';
import { formatCurrency } from '@/lib/utils/format';
import { computeEffort, EffortLevel } from '@/lib/utils/strategy';
import { US_STATES } from '@/lib/constants/states';

// ---------- Types ----------

interface SavedScreening {
  id: string;
  timestamp: string;
  age: number;
  state: string;
  programCount: number;
  eligibleCount: number;
  totalMonthlyValue: number;
  data: QuizData;
  results: null; // We re-run the engine on reload to avoid serializing huge objects
}

// ---------- Helpers ----------

const STORAGE_KEY = 'careNavigator_caseworkerHistory';

function loadHistory(): SavedScreening[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: SavedScreening[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  } catch {
    // localStorage full — silently fail
  }
}

function effortBadge(level: EffortLevel) {
  const map: Record<EffortLevel, { label: string; cls: string }> = {
    none: { label: 'None', cls: 'bg-gray-100 text-gray-600' },
    quick: { label: 'Quick', cls: 'bg-green-50 text-green-700' },
    moderate: { label: 'Moderate', cls: 'bg-yellow-50 text-yellow-700' },
    involved: { label: 'Involved', cls: 'bg-red-50 text-red-700' },
  };
  const b = map[level];
  return <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${b.cls}`}>{b.label}</span>;
}

function matchBadge(probability: number) {
  if (probability >= 70) return <span className="text-green-700 font-semibold">{probability}%</span>;
  if (probability >= 40) return <span className="text-yellow-700 font-semibold">{probability}%</span>;
  return <span className="text-gray-400 font-semibold">{probability}%</span>;
}

// ---------- Default form data ----------

function defaultData(): QuizData {
  return {
    geography: { state: 'TX', county: '', city: '', zipCode: '', residencyMonths: 12 },
    disability: {
      hasDisability: false,
      disabilityType: [],
      receivingSSI: false,
      receivingSSDI: false,
      hasSSADetermination: false,
    },
    financial: {
      monthlyIncome: 0,
      incomeType: [],
      countableAssets: 0,
      ownsCar: false,
      carValue: 0,
      ownsHome: false,
      homeValue: 0,
    },
    demographic: {
      age: 0,
      householdSize: 1,
      hasChildren: false,
      childrenAges: [],
      isVeteran: false,
      needsAssistance: AssistanceLevel.NONE,
    },
  };
}

// ---------- Component ----------

export default function CaseworkerPage() {
  const [data, setData] = useState<QuizData>(defaultData);
  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedScreening[]>(() => loadHistory());
  const resultsRef = useRef<HTMLDivElement>(null);

  // --- Field updaters ---

  const setGeo = useCallback((patch: Partial<QuizData['geography']>) => {
    setData(prev => ({ ...prev, geography: { ...prev.geography, ...patch } }));
  }, []);

  const setDis = useCallback((patch: Partial<QuizData['disability']>) => {
    setData(prev => ({ ...prev, disability: { ...prev.disability, ...patch } }));
  }, []);

  const setFin = useCallback((patch: Partial<QuizData['financial']>) => {
    setData(prev => ({ ...prev, financial: { ...prev.financial, ...patch } }));
  }, []);

  const setDemo = useCallback((patch: Partial<QuizData['demographic']>) => {
    setData(prev => ({ ...prev, demographic: { ...prev.demographic, ...patch } }));
  }, []);

  // --- Actions ---

  const runScreening = useCallback(() => {
    const programs = data.geography.state
      ? getProgramsByState(data.geography.state)
      : BENEFIT_PROGRAMS;
    const engine = new EligibilityEngine(programs);
    const res = engine.evaluateEligibility(data);
    setResults(res);
    setExpandedRow(null);

    // Save to history
    const eligible = res.filter(r => r.probability > 0);
    const totalVal = eligible.reduce((s, r) => s + (r.estimatedMonthlyBenefit || 0), 0);
    const entry: SavedScreening = {
      id: Date.now().toString(36),
      timestamp: new Date().toISOString(),
      age: data.demographic.age,
      state: data.geography.state,
      programCount: res.length,
      eligibleCount: eligible.filter(r => r.probability >= 40).length,
      totalMonthlyValue: totalVal,
      data: structuredClone(data),
      results: null,
    };
    const updated = [entry, ...history].slice(0, 50);
    setHistory(updated);
    saveHistory(updated);

    // Scroll to results
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, [data, history]);

  const resetForm = useCallback(() => {
    setData(defaultData());
    setResults(null);
    setExpandedRow(null);
  }, []);

  const loadScreening = useCallback((entry: SavedScreening) => {
    setData(entry.data);
    // Re-run engine
    const programs = entry.data.geography.state
      ? getProgramsByState(entry.data.geography.state)
      : BENEFIT_PROGRAMS;
    const engine = new EligibilityEngine(programs);
    const res = engine.evaluateEligibility(entry.data);
    setResults(res);
    setExpandedRow(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const deleteScreening = useCallback((id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    saveHistory(updated);
  }, [history]);

  // --- Derived values ---
  const eligibleResults = results?.filter(r => r.probability >= 40) ?? [];
  const totalMonthly = eligibleResults.reduce((s, r) => s + (r.estimatedMonthlyBenefit || 0), 0);

  // --- Disability type toggle ---
  const toggleDisabilityType = (type: DisabilityType) => {
    setDis({
      disabilityType: data.disability.disabilityType.includes(type)
        ? data.disability.disabilityType.filter(t => t !== type)
        : [...data.disability.disabilityType, type],
    });
  };

  // --- Income type toggle ---
  const toggleIncomeType = (type: IncomeType) => {
    setFin({
      incomeType: data.financial.incomeType.includes(type)
        ? data.financial.incomeType.filter(t => t !== type)
        : [...data.financial.incomeType, type],
    });
  };

  // ---------- Render ----------

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header */}
      <header className="bg-gray-800 text-white px-4 py-2.5 print:bg-white print:text-black print:border-b print:border-gray-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-accent-300 print:text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="font-semibold text-sm tracking-tight">CareNavigator</span>
            <span className="text-gray-400 text-xs">Caseworker Mode</span>
          </div>
          <button onClick={() => window.print()} className="text-xs text-gray-400 hover:text-white transition-colors print:hidden flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Intake Form */}
        <div className="print:hidden">
          {/* Section 1: Client Info */}
          <section className="mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Client Info</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-subtle">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">State</label>
                  <select
                    value={data.geography.state}
                    onChange={e => setGeo({ state: e.target.value })}
                    className="w-full h-8 px-2 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                  >
                    {US_STATES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">County</label>
                  <input
                    type="text"
                    value={data.geography.county}
                    onChange={e => setGeo({ county: e.target.value })}
                    placeholder="e.g. Dallas"
                    className="w-full h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">City</label>
                  <input
                    type="text"
                    value={data.geography.city}
                    onChange={e => setGeo({ city: e.target.value })}
                    placeholder="e.g. Dallas"
                    className="w-full h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">ZIP</label>
                  <input
                    type="text"
                    value={data.geography.zipCode}
                    onChange={e => setGeo({ zipCode: e.target.value })}
                    placeholder="75201"
                    maxLength={5}
                    className="w-full h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Age</label>
                  <input
                    type="number"
                    value={data.demographic.age || ''}
                    onChange={e => setDemo({ age: parseInt(e.target.value) || 0 })}
                    placeholder="35"
                    min={0}
                    max={120}
                    className="w-full h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Household Size</label>
                  <input
                    type="number"
                    value={data.demographic.householdSize || ''}
                    onChange={e => setDemo({ householdSize: parseInt(e.target.value) || 1 })}
                    min={1}
                    max={20}
                    className="w-full h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Situation */}
          <section className="mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Situation</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-subtle">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                {/* Disability */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.disability.hasDisability}
                    onChange={e => setDis({ hasDisability: e.target.checked, disabilityType: e.target.checked ? data.disability.disabilityType : [] })}
                    className="w-4 h-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                  />
                  Has disability
                </label>

                {/* SSI */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.disability.receivingSSI}
                    onChange={e => setDis({ receivingSSI: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                  />
                  Receiving SSI
                </label>

                {/* SSDI */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.disability.receivingSSDI}
                    onChange={e => setDis({ receivingSSDI: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                  />
                  Receiving SSDI
                </label>

                {/* Veteran */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.demographic.isVeteran}
                    onChange={e => setDemo({ isVeteran: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                  />
                  Veteran
                </label>

                {/* SSA Determination */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.disability.hasSSADetermination}
                    onChange={e => setDis({ hasSSADetermination: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                  />
                  SSA determination
                </label>

                {/* Has children */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.demographic.hasChildren}
                    onChange={e => setDemo({ hasChildren: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                  />
                  Has children
                </label>

                {/* Number of children — shown conditionally */}
                {data.demographic.hasChildren && (
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-medium text-gray-500 whitespace-nowrap"># children</label>
                    <input
                      type="number"
                      value={data.demographic.childrenAges.length || ''}
                      onChange={e => {
                        const count = parseInt(e.target.value) || 0;
                        setDemo({ childrenAges: Array(Math.max(0, count)).fill(5) });
                      }}
                      min={0}
                      max={15}
                      className="w-16 h-8 px-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                    />
                  </div>
                )}

                {/* Assistance level */}
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-medium text-gray-500 whitespace-nowrap">Assistance</label>
                  <select
                    value={data.demographic.needsAssistance}
                    onChange={e => setDemo({ needsAssistance: e.target.value as AssistanceLevel })}
                    className="h-8 px-2 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                  >
                    <option value={AssistanceLevel.NONE}>None</option>
                    <option value={AssistanceLevel.SOME}>Some</option>
                    <option value={AssistanceLevel.EXTENSIVE}>Extensive</option>
                  </select>
                </div>
              </div>

              {/* Disability types — shown when hasDisability */}
              {data.disability.hasDisability && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Disability Type(s)</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(DisabilityType).map(type => (
                      <label key={type} className="flex items-center gap-1.5 text-xs cursor-pointer bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:border-accent-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={data.disability.disabilityType.includes(type)}
                          onChange={() => toggleDisabilityType(type)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                        />
                        {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Finances */}
          <section className="mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Finances</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-subtle">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Monthly Income</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={data.financial.monthlyIncome || ''}
                      onChange={e => setFin({ monthlyIncome: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      min={0}
                      className="w-full h-8 pl-6 pr-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">Countable Assets</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={data.financial.countableAssets || ''}
                      onChange={e => setFin({ countableAssets: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      min={0}
                      className="w-full h-8 pl-6 pr-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                    />
                  </div>
                </div>

                {/* Car */}
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-medium text-gray-500 mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.financial.ownsCar}
                      onChange={e => setFin({ ownsCar: e.target.checked, carValue: e.target.checked ? data.financial.carValue : 0 })}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                    />
                    Owns Car
                  </label>
                  {data.financial.ownsCar && (
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        value={data.financial.carValue || ''}
                        onChange={e => setFin({ carValue: parseFloat(e.target.value) || 0 })}
                        placeholder="Value"
                        min={0}
                        className="w-full h-8 pl-6 pr-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                      />
                    </div>
                  )}
                </div>

                {/* Home */}
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-medium text-gray-500 mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.financial.ownsHome}
                      onChange={e => setFin({ ownsHome: e.target.checked, homeValue: e.target.checked ? data.financial.homeValue : 0 })}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                    />
                    Owns Home
                  </label>
                  {data.financial.ownsHome && (
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        value={data.financial.homeValue || ''}
                        onChange={e => setFin({ homeValue: parseFloat(e.target.value) || 0 })}
                        placeholder="Value"
                        min={0}
                        className="w-full h-8 pl-6 pr-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Income types */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Income Source(s)</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(IncomeType).map(type => (
                    <label key={type} className="flex items-center gap-1.5 text-xs cursor-pointer bg-gray-50 px-2 py-1 rounded border border-gray-200 hover:border-accent-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={data.financial.incomeType.includes(type)}
                        onChange={() => toggleIncomeType(type)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                      />
                      {type === 'ssi' ? 'SSI' : type === 'ssdi' ? 'SSDI' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Action bar */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={runScreening}
              className="h-10 px-6 bg-accent-600 text-white text-sm font-medium rounded-md hover:bg-accent-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Screen Client
            </button>
            <button
              onClick={resetForm}
              className="h-10 px-4 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
            >
              New Client
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div ref={resultsRef}>
            {/* Summary bar */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 shadow-subtle">
              <div className="flex flex-wrap items-center gap-4 md:gap-8">
                <div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-wide">Programs Screened</div>
                  <div className="text-xl font-semibold text-gray-900">{results.length}</div>
                </div>
                <div className="w-px h-8 bg-gray-200 hidden md:block" />
                <div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-wide">Likely Eligible</div>
                  <div className="text-xl font-semibold text-green-700">{eligibleResults.length}</div>
                </div>
                <div className="w-px h-8 bg-gray-200 hidden md:block" />
                <div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-wide">Est. Monthly Value</div>
                  <div className="text-xl font-semibold text-accent-700">
                    {totalMonthly > 0 ? formatCurrency(totalMonthly) : 'Varies'}
                    <span className="text-xs text-gray-400 font-normal ml-1">/mo</span>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2 print:hidden">
                  <button
                    onClick={() => window.print()}
                    className="h-8 px-3 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Packet
                  </button>
                </div>
              </div>
            </div>

            {/* Print header — hidden on screen */}
            <div className="hidden print:block mb-4">
              <h1 className="text-lg font-semibold">CareNavigator Benefits Screening</h1>
              <p className="text-xs text-gray-500">
                {data.geography.state && `State: ${data.geography.state}`}
                {data.demographic.age > 0 && ` | Age: ${data.demographic.age}`}
                {` | HH Size: ${data.demographic.householdSize}`}
                {data.financial.monthlyIncome > 0 && ` | Income: ${formatCurrency(data.financial.monthlyIncome)}/mo`}
                {` | Screened: ${new Date().toLocaleDateString()}`}
              </p>
            </div>

            {/* Results table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-subtle overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Program</th>
                    <th className="text-center px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-20">Match</th>
                    <th className="text-right px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-24 hidden sm:table-cell">Est. Value</th>
                    <th className="text-center px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-20 hidden md:table-cell">Effort</th>
                    <th className="text-center px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-24 hidden md:table-cell">Timeline</th>
                    <th className="text-center px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-20 hidden lg:table-cell">Category</th>
                    <th className="px-3 py-2 w-8 print:hidden" />
                  </tr>
                </thead>
                <tbody>
                  {results.filter(r => r.probability > 0).map(result => {
                    const effort = computeEffort(result);
                    const isExpanded = expandedRow === result.programId;
                    return (
                      <React.Fragment key={result.programId}>
                        <tr
                          onClick={() => setExpandedRow(isExpanded ? null : result.programId)}
                          className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-accent-50/30' : ''}`}
                        >
                          <td className="px-3 py-2">
                            <div className="font-medium text-gray-900 text-xs">{result.program.name}</div>
                            <div className="text-[11px] text-gray-400 capitalize">{result.program.jurisdiction}</div>
                          </td>
                          <td className="text-center px-3 py-2 text-xs">{matchBadge(result.probability)}</td>
                          <td className="text-right px-3 py-2 text-xs text-gray-700 hidden sm:table-cell">
                            {result.estimatedMonthlyBenefit > 0
                              ? <>{formatCurrency(result.estimatedMonthlyBenefit)}<span className="text-gray-400">/mo</span></>
                              : <span className="text-gray-400">Varies</span>
                            }
                          </td>
                          <td className="text-center px-3 py-2 hidden md:table-cell">{effortBadge(effort)}</td>
                          <td className="text-center px-3 py-2 text-xs text-gray-500 hidden md:table-cell">
                            {result.timelineWeeks > 0 ? `${result.timelineWeeks}w` : '-'}
                          </td>
                          <td className="text-center px-3 py-2 hidden lg:table-cell">
                            <span className="text-[10px] text-gray-400 uppercase">{result.program.category.replace(/_/g, ' ')}</span>
                          </td>
                          <td className="px-3 py-2 print:hidden">
                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="print:table-row">
                            <td colSpan={7} className="px-3 py-3 bg-gray-50/50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                {/* Why eligible */}
                                {result.reasoning?.whyEligible && result.reasoning.whyEligible.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-green-700 mb-1">Why Eligible</h4>
                                    <ul className="space-y-0.5 text-gray-600">
                                      {result.reasoning.whyEligible.map((r, i) => (
                                        <li key={i}>{r}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {/* Why ineligible / gaps */}
                                {result.reasoning?.whyIneligible && result.reasoning.whyIneligible.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-red-600 mb-1">Gaps</h4>
                                    <ul className="space-y-0.5 text-gray-600">
                                      {result.reasoning.whyIneligible.map((r, i) => (
                                        <li key={i}>{r}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {/* Next steps */}
                                {result.nextSteps.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-accent-700 mb-1">Next Steps</h4>
                                    <ul className="space-y-0.5 text-gray-600">
                                      {result.nextSteps.map((s, i) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {/* Required docs */}
                                {result.program.requiredDocuments.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-1">Required Documents</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {result.program.requiredDocuments.map((doc, i) => (
                                        <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                                          {doc.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {/* Links */}
                                {(result.program.applicationUrl || result.program.helplinePhone) && (
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-1">Contact</h4>
                                    {result.program.applicationUrl && result.program.applicationUrl !== '#' && (
                                      <a href={result.program.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-accent-600 hover:underline block">
                                        Application Link
                                      </a>
                                    )}
                                    {result.program.helplinePhone && (
                                      <span className="text-gray-600 block">{result.program.helplinePhone}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {results.filter(r => r.probability > 0).length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-8 text-center text-gray-400 text-sm">
                        No programs matched. Adjust client information and try again.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* QR Code placeholder */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-subtle flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                <svg className="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="6" height="6" rx="1" />
                  <rect x="10" y="2" width="2" height="2" />
                  <rect x="14" y="2" width="2" height="2" />
                  <rect x="16" y="2" width="6" height="6" rx="1" />
                  <rect x="4" y="4" width="2" height="2" fill="white" />
                  <rect x="18" y="4" width="2" height="2" fill="white" />
                  <rect x="2" y="10" width="2" height="2" />
                  <rect x="6" y="10" width="2" height="2" />
                  <rect x="10" y="10" width="4" height="4" />
                  <rect x="16" y="10" width="2" height="2" />
                  <rect x="20" y="10" width="2" height="2" />
                  <rect x="2" y="16" width="6" height="6" rx="1" />
                  <rect x="4" y="18" width="2" height="2" fill="white" />
                  <rect x="10" y="16" width="2" height="2" />
                  <rect x="14" y="14" width="2" height="2" />
                  <rect x="16" y="16" width="2" height="4" />
                  <rect x="20" y="16" width="2" height="2" />
                  <rect x="14" y="20" width="2" height="2" />
                  <rect x="20" y="20" width="2" height="2" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700">Client Results Link</p>
                <p className="text-[11px] text-gray-400">QR code will link to a shareable results page</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Screenings */}
        {history.length > 0 && (
          <section className="print:hidden mt-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recent Screenings</h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-subtle overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                    <th className="text-center px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-24">Programs</th>
                    <th className="text-right px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-28 hidden sm:table-cell">Est. Value</th>
                    <th className="text-right px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-36">Date</th>
                    <th className="w-8 px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {history.map(entry => (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td
                        className="px-3 py-2 cursor-pointer"
                        onClick={() => loadScreening(entry)}
                      >
                        <span className="font-medium text-gray-900">
                          Age {entry.age || '?'}, {entry.state || '??'}
                        </span>
                      </td>
                      <td
                        className="text-center px-3 py-2 cursor-pointer"
                        onClick={() => loadScreening(entry)}
                      >
                        <span className="text-green-700 font-medium">{entry.eligibleCount}</span>
                        <span className="text-gray-400"> / {entry.programCount}</span>
                      </td>
                      <td
                        className="text-right px-3 py-2 text-gray-600 hidden sm:table-cell cursor-pointer"
                        onClick={() => loadScreening(entry)}
                      >
                        {entry.totalMonthlyValue > 0 ? `${formatCurrency(entry.totalMonthlyValue)}/mo` : 'Varies'}
                      </td>
                      <td
                        className="text-right px-3 py-2 text-gray-400 cursor-pointer"
                        onClick={() => loadScreening(entry)}
                      >
                        {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteScreening(entry.id); }}
                          className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:table-row { display: table-row !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:text-black { color: black !important; }
          .print\\:border-b { border-bottom-width: 1px !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
