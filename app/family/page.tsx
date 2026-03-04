'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { EligibilityEngine } from '@/lib/rules/eligibilityEngine';
import { getProgramsByState } from '@/lib/rules/benefitRules';
import { computeDocumentOverlap } from '@/lib/utils/strategy';
import { formatCurrency } from '@/lib/utils/format';
import { US_STATES } from '@/lib/constants/states';
import {
  QuizData,
  DisabilityType,
  AssistanceLevel,
  IncomeType,
} from '@/types/quiz';
import { EligibilityResult } from '@/types/benefit';

// --- Types ---

type Relationship = 'self' | 'spouse' | 'child' | 'parent' | 'other';

interface FamilyMember {
  id: string;
  name: string;
  age: number | '';
  relationship: Relationship;
  hasDisability: boolean;
  disabilityType: DisabilityType[];
  receivingSSI: boolean;
  receivingSSDI: boolean;
  isVeteran: boolean;
}

interface SharedInfo {
  state: string;
  county: string;
  monthlyIncome: number | '';
  countableAssets: number | '';
}

interface MemberResult {
  memberId: string;
  memberName: string;
  memberAge: number;
  relationship: Relationship;
  results: EligibilityResult[];
  eligibleCount: number;
  totalValue: number;
}

interface FamilySummary {
  totalUniquePrograms: number;
  combinedMonthlyValue: number;
  sharedProgramCount: number;
  sharedDocumentCount: number;
  memberResults: MemberResult[];
  sharedPrograms: {
    programId: string;
    programName: string;
    members: string[];
    combinedValue: number;
    probability: number;
  }[];
  documentOverlap: {
    documentName: string;
    members: string[];
    programCount: number;
  }[];
}

// --- Constants ---

const MEMBER_COLORS = [
  { bg: 'bg-accent-50', border: 'border-accent-200', text: 'text-accent-700', dot: 'bg-accent-500' },
  { bg: 'bg-success-light', border: 'border-green-200', text: 'text-success', dot: 'bg-success' },
  { bg: 'bg-warning-light', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-warning' },
  { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
];

const RELATIONSHIP_OPTIONS: { value: Relationship; label: string }[] = [
  { value: 'self', label: 'Self' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'other', label: 'Other' },
];

const DISABILITY_TYPE_OPTIONS: { value: DisabilityType; label: string }[] = [
  { value: DisabilityType.PHYSICAL, label: 'Physical' },
  { value: DisabilityType.COGNITIVE, label: 'Cognitive' },
  { value: DisabilityType.MENTAL_HEALTH, label: 'Mental Health' },
  { value: DisabilityType.CHRONIC_ILLNESS, label: 'Chronic Illness' },
  { value: DisabilityType.DEVELOPMENTAL, label: 'Developmental' },
];

const STORAGE_KEY = 'cn_family_data';

const MAX_MEMBERS = 5;

// --- Helpers ---

function createMember(index: number): FamilyMember {
  return {
    id: `member-${Date.now()}-${index}`,
    name: '',
    age: '',
    relationship: index === 0 ? 'self' : 'other',
    hasDisability: false,
    disabilityType: [],
    receivingSSI: false,
    receivingSSDI: false,
    isVeteran: false,
  };
}

function getMemberDisplayName(member: FamilyMember, index: number): string {
  if (member.name.trim()) return member.name.trim();
  return `Member ${index + 1}`;
}

function buildQuizData(member: FamilyMember, shared: SharedInfo, allMembers: FamilyMember[]): QuizData {
  const householdSize = allMembers.length;
  const childrenAges = allMembers
    .filter((m) => typeof m.age === 'number' && m.age < 18)
    .map((m) => m.age as number);
  const hasChildren = childrenAges.length > 0;
  const memberAge = typeof member.age === 'number' ? member.age : 0;

  const incomeTypes: IncomeType[] = [];
  if (member.receivingSSI) incomeTypes.push(IncomeType.SSI);
  if (member.receivingSSDI) incomeTypes.push(IncomeType.SSDI);
  if (incomeTypes.length === 0) incomeTypes.push(IncomeType.WAGES);

  return {
    geography: {
      state: shared.state,
      county: shared.county,
      city: '',
      zipCode: '',
      residencyMonths: 12, // default assumption
    },
    disability: {
      hasDisability: member.hasDisability,
      disabilityType: member.disabilityType,
      receivingSSI: member.receivingSSI,
      receivingSSDI: member.receivingSSDI,
      hasSSADetermination: member.receivingSSI || member.receivingSSDI,
    },
    financial: {
      monthlyIncome: typeof shared.monthlyIncome === 'number' ? shared.monthlyIncome : 0,
      incomeType: incomeTypes,
      countableAssets: typeof shared.countableAssets === 'number' ? shared.countableAssets : 0,
      ownsCar: false,
      carValue: 0,
      ownsHome: false,
      homeValue: 0,
    },
    demographic: {
      age: memberAge,
      householdSize,
      hasChildren,
      childrenAges,
      isVeteran: member.isVeteran,
      needsAssistance: member.hasDisability ? AssistanceLevel.SOME : AssistanceLevel.NONE,
    },
  };
}

// --- Component ---

export default function FamilyPage() {
  const [members, setMembers] = useState<FamilyMember[]>([createMember(0)]);
  const [shared, setShared] = useState<SharedInfo>({
    state: '',
    county: '',
    monthlyIncome: '',
    countableAssets: '',
  });
  const [results, setResults] = useState<FamilySummary | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.members?.length > 0) setMembers(parsed.members);
        if (parsed.shared) setShared(parsed.shared);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ members, shared }));
    } catch {
      // ignore storage errors
    }
  }, [members, shared]);

  const addMember = useCallback(() => {
    if (members.length >= MAX_MEMBERS) return;
    setMembers((prev) => [...prev, createMember(prev.length)]);
  }, [members.length]);

  const removeMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateMember = useCallback((id: string, updates: Partial<FamilyMember>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  const updateShared = useCallback((updates: Partial<SharedInfo>) => {
    setShared((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleExpandMember = useCallback((id: string) => {
    setExpandedMembers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const canAnalyze =
    shared.state !== '' &&
    shared.county.trim() !== '' &&
    members.every((m) => typeof m.age === 'number' && m.age > 0);

  const analyze = useCallback(() => {
    if (!canAnalyze) return;
    setIsAnalyzing(true);

    // Use setTimeout to let the UI update with the loading state
    setTimeout(() => {
      try {
        const programs = getProgramsByState(shared.state);
        const memberResults: MemberResult[] = [];

        for (let i = 0; i < members.length; i++) {
          const member = members[i];
          const quizData = buildQuizData(member, shared, members);
          const engine = new EligibilityEngine(programs);
          const eligResults = engine.evaluateEligibility(quizData);
          const eligible = eligResults.filter((r) => r.isEligible);

          memberResults.push({
            memberId: member.id,
            memberName: getMemberDisplayName(member, i),
            memberAge: typeof member.age === 'number' ? member.age : 0,
            relationship: member.relationship,
            results: eligResults,
            eligibleCount: eligible.length,
            totalValue: eligible.reduce((sum, r) => sum + r.estimatedMonthlyBenefit, 0),
          });
        }

        // Deduplicate programs across all members
        const allProgramIds = new Set<string>();
        const programMemberMap = new Map<string, { members: string[]; values: number[]; name: string; probability: number }>();

        for (const mr of memberResults) {
          const eligible = mr.results.filter((r) => r.isEligible);
          for (const r of eligible) {
            allProgramIds.add(r.programId);
            if (!programMemberMap.has(r.programId)) {
              programMemberMap.set(r.programId, {
                members: [],
                values: [],
                name: r.program.name,
                probability: r.probability,
              });
            }
            const entry = programMemberMap.get(r.programId)!;
            entry.members.push(mr.memberName);
            entry.values.push(r.estimatedMonthlyBenefit);
            entry.probability = Math.max(entry.probability, r.probability);
          }
        }

        // Shared programs (qualify for 2+ members)
        const sharedPrograms = Array.from(programMemberMap.entries())
          .filter(([, data]) => data.members.length > 1)
          .map(([id, data]) => ({
            programId: id,
            programName: data.name,
            members: data.members,
            combinedValue: Math.max(...data.values), // Use max (same program, not additive)
            probability: data.probability,
          }))
          .sort((a, b) => b.members.length - a.members.length || b.combinedValue - a.combinedValue);

        // Document overlap across all members
        const allEligible = memberResults.flatMap((mr) => mr.results.filter((r) => r.isEligible));
        const docOverlap = computeDocumentOverlap(allEligible);
        const documentOverlap = docOverlap
          .filter((d) => d.programCount > 1)
          .map((d) => {
            // Figure out which members need this doc
            const needMembers: string[] = [];
            for (const mr of memberResults) {
              const memberEligible = mr.results.filter((r) => r.isEligible);
              for (const r of memberEligible) {
                if (r.program.requiredDocuments.includes(d.documentType)) {
                  if (!needMembers.includes(mr.memberName)) {
                    needMembers.push(mr.memberName);
                  }
                }
              }
            }
            return {
              documentName: d.displayName,
              members: needMembers,
              programCount: d.programCount,
            };
          });

        const combinedMonthlyValue = memberResults.reduce((sum, mr) => sum + mr.totalValue, 0);

        setResults({
          totalUniquePrograms: allProgramIds.size,
          combinedMonthlyValue,
          sharedProgramCount: sharedPrograms.length,
          sharedDocumentCount: documentOverlap.length,
          memberResults,
          sharedPrograms,
          documentOverlap,
        });
      } catch (err) {
        console.error('Family analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 50);
  }, [canAnalyze, members, shared]);

  return (
    <Container>
      <div className="max-w-5xl mx-auto py-12 md:py-16">
        {/* Hero */}
        <header className="mb-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent-600 transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-3">
            Family Benefits Optimizer
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            See what your whole household qualifies for together
          </p>
        </header>

        {/* Shared Info */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Household Information</h2>
          <p className="text-sm text-gray-500 mb-5">Shared across all family members</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
              <select
                value={shared.state}
                onChange={(e) => updateShared({ state: e.target.value })}
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                {US_STATES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">County</label>
              <input
                type="text"
                value={shared.county}
                onChange={(e) => updateShared({ county: e.target.value })}
                placeholder="e.g., Dallas County"
                className="w-full h-10 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly household income</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                <input
                  type="number"
                  value={shared.monthlyIncome}
                  onChange={(e) => updateShared({ monthlyIncome: e.target.value ? Number(e.target.value) : '' })}
                  placeholder="0"
                  min={0}
                  className="w-full h-10 pl-7 pr-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Countable assets</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
                <input
                  type="number"
                  value={shared.countableAssets}
                  onChange={(e) => updateShared({ countableAssets: e.target.value ? Number(e.target.value) : '' })}
                  placeholder="0"
                  min={0}
                  className="w-full h-10 pl-7 pr-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Household size is auto-calculated from members ({members.length} {members.length === 1 ? 'person' : 'people'})
          </div>
        </Card>

        {/* Family Members */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Family Members
              <span className="ml-2 text-sm font-normal text-gray-400">({members.length}/{MAX_MEMBERS})</span>
            </h2>
            {members.length < MAX_MEMBERS && (
              <Button variant="outline" size="sm" onClick={addMember}>
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add member
              </Button>
            )}
          </div>

          {members.map((member, index) => {
            const color = MEMBER_COLORS[index % MEMBER_COLORS.length];
            return (
              <Card key={member.id} className={`p-5 ${color.bg} border ${color.border}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                    <span className={`text-sm font-semibold ${color.text}`}>
                      {getMemberDisplayName(member, index)}
                    </span>
                    {member.relationship !== 'other' && (
                      <span className="text-xs text-gray-400 capitalize">
                        ({member.relationship})
                      </span>
                    )}
                  </div>
                  {index > 0 && (
                    <button
                      onClick={() => removeMember(member.id)}
                      className="p-1 text-gray-400 hover:text-error transition-colors rounded"
                      aria-label={`Remove ${getMemberDisplayName(member, index)}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name (optional)</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(member.id, { name: e.target.value })}
                      placeholder={`Member ${index + 1}`}
                      className="w-full h-9 px-3 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Age <span className="text-error">*</span>
                    </label>
                    <input
                      type="number"
                      value={member.age}
                      onChange={(e) => updateMember(member.id, { age: e.target.value ? Number(e.target.value) : '' })}
                      placeholder="Age"
                      min={0}
                      max={120}
                      className="w-full h-9 px-3 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    />
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Relationship</label>
                    <select
                      value={member.relationship}
                      onChange={(e) => updateMember(member.id, { relationship: e.target.value as Relationship })}
                      className="w-full h-9 px-3 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    >
                      {RELATIONSHIP_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Veteran */}
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={member.isVeteran}
                        onChange={(e) => updateMember(member.id, { isVeteran: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                      />
                      Veteran
                    </label>
                  </div>
                </div>

                {/* Disability row */}
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={member.hasDisability}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        updateMember(member.id, {
                          hasDisability: checked,
                          disabilityType: checked ? member.disabilityType : [],
                        });
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                    />
                    Has disability
                  </label>

                  {member.hasDisability && (
                    <>
                      <select
                        value={member.disabilityType[0] || ''}
                        onChange={(e) => {
                          const val = e.target.value as DisabilityType;
                          updateMember(member.id, {
                            disabilityType: val ? [val] : [],
                          });
                        }}
                        className="h-8 px-2 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                      >
                        <option value="">Select type</option>
                        {DISABILITY_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>

                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={member.receivingSSI}
                          onChange={(e) => updateMember(member.id, { receivingSSI: e.target.checked })}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                        />
                        Receiving SSI
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={member.receivingSSDI}
                          onChange={(e) => updateMember(member.id, { receivingSSDI: e.target.checked })}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                        />
                        Receiving SSDI
                      </label>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Analyze button */}
        <div className="text-center mb-12">
          <Button
            size="lg"
            className="px-10"
            onClick={analyze}
            disabled={!canAnalyze || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze Family Benefits'
            )}
          </Button>
          {!canAnalyze && (
            <p className="text-xs text-gray-400 mt-2">
              Fill in state, county, and age for each member to continue
            </p>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8 animate-fade-in">
            {/* Summary Card */}
            <Card className="p-6 bg-accent-600 border-accent-600 text-white">
              <h2 className="text-xl font-semibold mb-6">Family Benefits Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-3xl font-light tabular-nums">{results.totalUniquePrograms}</p>
                  <p className="text-sm text-accent-200 mt-1">Total programs</p>
                </div>
                <div>
                  <p className="text-3xl font-light tabular-nums">
                    {formatCurrency(results.combinedMonthlyValue)}
                  </p>
                  <p className="text-sm text-accent-200 mt-1">Combined monthly value</p>
                </div>
                <div>
                  <p className="text-3xl font-light tabular-nums">{results.sharedProgramCount}</p>
                  <p className="text-sm text-accent-200 mt-1">Shared programs</p>
                </div>
                <div>
                  <p className="text-3xl font-light tabular-nums">{results.sharedDocumentCount}</p>
                  <p className="text-sm text-accent-200 mt-1">Shared documents</p>
                </div>
              </div>
            </Card>

            {/* Per-member columns */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Results by Member</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.memberResults.map((mr, idx) => {
                  const color = MEMBER_COLORS[idx % MEMBER_COLORS.length];
                  const expanded = expandedMembers.has(mr.memberId);
                  const eligible = mr.results.filter((r) => r.isEligible);
                  const top5 = eligible.slice(0, 5);
                  const remaining = eligible.slice(5);

                  return (
                    <Card key={mr.memberId} className="p-5">
                      {/* Member header */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                        <span className="font-semibold text-gray-900">{mr.memberName}</span>
                        <span className="text-xs text-gray-400">
                          {mr.memberAge}y, {mr.relationship}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-4 mb-4">
                        <div className={`px-3 py-1.5 rounded-md ${color.bg}`}>
                          <span className={`text-lg font-semibold ${color.text}`}>{mr.eligibleCount}</span>
                          <span className="text-xs text-gray-500 ml-1">programs</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-md bg-gray-50">
                          <span className="text-lg font-semibold text-gray-900">{formatCurrency(mr.totalValue)}</span>
                          <span className="text-xs text-gray-500 ml-1">/mo</span>
                        </div>
                      </div>

                      {/* Top programs */}
                      {top5.length > 0 ? (
                        <div className="space-y-2">
                          {top5.map((r) => (
                            <div
                              key={r.programId}
                              className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
                            >
                              <div className="min-w-0 flex-1 mr-2">
                                <p className="text-sm text-gray-900 truncate">{r.program.shortName}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        r.probability >= 70
                                          ? 'bg-success'
                                          : r.probability >= 40
                                          ? 'bg-warning'
                                          : 'bg-gray-300'
                                      }`}
                                      style={{ width: `${r.probability}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-400">{r.probability}%</span>
                                </div>
                              </div>
                              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                {r.estimatedMonthlyBenefit > 0 ? formatCurrency(r.estimatedMonthlyBenefit) : 'Varies'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 py-2">No eligible programs found</p>
                      )}

                      {/* Expand/collapse */}
                      {remaining.length > 0 && (
                        <>
                          {expanded && (
                            <div className="space-y-2 mt-2">
                              {remaining.map((r) => (
                                <div
                                  key={r.programId}
                                  className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
                                >
                                  <div className="min-w-0 flex-1 mr-2">
                                    <p className="text-sm text-gray-900 truncate">{r.program.shortName}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${
                                            r.probability >= 70
                                              ? 'bg-success'
                                              : r.probability >= 40
                                              ? 'bg-warning'
                                              : 'bg-gray-300'
                                          }`}
                                          style={{ width: `${r.probability}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-gray-400">{r.probability}%</span>
                                    </div>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                    {r.estimatedMonthlyBenefit > 0 ? formatCurrency(r.estimatedMonthlyBenefit) : 'Varies'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          <button
                            onClick={() => toggleExpandMember(mr.memberId)}
                            className="mt-3 text-xs font-medium text-accent-600 hover:text-accent-700 transition-colors"
                          >
                            {expanded
                              ? 'Show less'
                              : `View all ${eligible.length} programs`}
                          </button>
                        </>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Shared Programs */}
            {results.sharedPrograms.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Shared Programs</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Programs that multiple family members qualify for
                </p>
                <div className="space-y-3">
                  {results.sharedPrograms.map((sp) => (
                    <Card key={sp.programId} className="p-4" hoverable>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">{sp.programName}</p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {sp.members.map((name, i) => {
                              const memberIdx = results.memberResults.findIndex((mr) => mr.memberName === name);
                              const mColor = MEMBER_COLORS[memberIdx >= 0 ? memberIdx % MEMBER_COLORS.length : 0];
                              return (
                                <span
                                  key={i}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${mColor.bg} ${mColor.text}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${mColor.dot}`} />
                                  {name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-semibold text-gray-900">
                            {sp.combinedValue > 0 ? formatCurrency(sp.combinedValue) : 'Varies'}
                          </p>
                          <p className="text-xs text-gray-400">{sp.probability}% match</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Apply once, benefits for the whole family
                </div>
              </div>
            )}

            {/* Document Overlap */}
            {results.documentOverlap.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Document Strategy</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Gather these {results.documentOverlap.length} documents to cover multiple programs for the whole family
                </p>
                <Card className="overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left font-medium text-gray-500 py-2.5 px-4">Document</th>
                        <th className="text-left font-medium text-gray-500 py-2.5 px-4 hidden sm:table-cell">Needed by</th>
                        <th className="text-right font-medium text-gray-500 py-2.5 px-4">Programs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.documentOverlap.map((doc, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 px-4 text-gray-900">{doc.documentName}</td>
                          <td className="py-2.5 px-4 hidden sm:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {doc.members.map((name, j) => {
                                const memberIdx = results.memberResults.findIndex((mr) => mr.memberName === name);
                                const mColor = MEMBER_COLORS[memberIdx >= 0 ? memberIdx % MEMBER_COLORS.length : 0];
                                return (
                                  <span
                                    key={j}
                                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${mColor.bg} ${mColor.text}`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${mColor.dot}`} />
                                    {name}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent-50 text-accent-700 text-xs font-medium">
                              {doc.programCount}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {/* CTA */}
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Want detailed results?</h2>
              <p className="text-sm text-gray-500 mb-5">
                Run the full quiz for each family member to get personalized next steps and application guides.
              </p>
              <Link href="/quiz">
                <Button className="px-8">Start Individual Assessment</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
