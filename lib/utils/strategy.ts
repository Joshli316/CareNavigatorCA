import { EligibilityResult } from '@/types/benefit';
import { DocumentType } from '@/types/document';
import { formatDocumentType } from './format';

// --- Types ---

export type TierLevel = 'high' | 'medium' | 'low';
export type EffortLevel = 'none' | 'quick' | 'moderate' | 'involved';

export interface ApplicationStrategy {
  tiers: ProgramTier[];
  coreDocuments: DocumentOverlapEntry[];
  fullChecklist: DocumentOverlapEntry[];
  recommendedFirst: RankedProgram | null;
  totalDocumentsNeeded: number;
  totalEligibleValue: number;
  variesCount: number;
  isEmpty: boolean;
  allUnlikely: boolean;
}

export interface ProgramTier {
  level: TierLevel;
  label: string;
  programs: RankedProgram[];
  totalMonthlyValue: number;
  variesCount: number;
  incrementalDocuments: DocumentOverlapEntry[];
}

export interface RankedProgram {
  result: EligibilityResult;
  rank: number;
  effortLevel: EffortLevel;
  sharedDocuments: DocumentType[];
  uniqueDocuments: DocumentType[];
}

export interface DocumentOverlapEntry {
  documentType: DocumentType;
  displayName: string;
  programCount: number;
  programNames: string[];
  tierBreakdown: { high: number; medium: number; low: number };
}

// --- Helpers ---

function getTierLevel(probability: number): TierLevel {
  if (probability >= 70) return 'high';
  if (probability >= 40) return 'medium';
  return 'low';
}

function getTierLabel(level: TierLevel): string {
  if (level === 'high') return 'Recommended Core Applications';
  if (level === 'medium') return 'If You Also Apply';
  return 'Optional Applications';
}

export function computeEffort(result: EligibilityResult): EffortLevel {
  const docs = result.program.requiredDocuments.length;
  const weeks = result.timelineWeeks;
  if (docs === 0 && weeks === 0) return 'none';
  if (docs <= 2 && weeks < 8) return 'quick';
  if (docs >= 3 || weeks >= 8) return 'involved';
  return 'moderate';
}

// --- Document overlap ---

export function computeDocumentOverlap(
  results: EligibilityResult[],
  filterTier?: TierLevel
): DocumentOverlapEntry[] {
  const docMap = new Map<DocumentType, { programs: string[]; tiers: { high: number; medium: number; low: number } }>();

  for (const r of results) {
    if (filterTier && getTierLevel(r.probability) !== filterTier) continue;
    for (const doc of r.program.requiredDocuments) {
      if (!docMap.has(doc)) {
        docMap.set(doc, { programs: [], tiers: { high: 0, medium: 0, low: 0 } });
      }
      const entry = docMap.get(doc)!;
      entry.programs.push(r.program.name);
      entry.tiers[getTierLevel(r.probability)]++;
    }
  }

  return Array.from(docMap.entries())
    .map(([docType, data]) => ({
      documentType: docType,
      displayName: formatDocumentType(docType),
      programCount: data.programs.length,
      programNames: data.programs,
      tierBreakdown: data.tiers,
    }))
    .sort((a, b) => b.programCount - a.programCount);
}

// --- Incremental docs ---

function computeIncrementalDocs(
  tierResults: EligibilityResult[],
  coreDocs: Set<DocumentType>,
  allResults: EligibilityResult[]
): DocumentOverlapEntry[] {
  const needed = new Map<DocumentType, string[]>();
  for (const r of tierResults) {
    for (const doc of r.program.requiredDocuments) {
      if (coreDocs.has(doc)) continue;
      if (!needed.has(doc)) needed.set(doc, []);
      needed.get(doc)!.push(r.program.name);
    }
  }

  // Build tier breakdown from all results for context
  const fullOverlap = computeDocumentOverlap(allResults);
  const overlapMap = new Map(fullOverlap.map(e => [e.documentType, e.tierBreakdown]));

  return Array.from(needed.entries())
    .map(([docType, programs]) => ({
      documentType: docType,
      displayName: formatDocumentType(docType),
      programCount: programs.length,
      programNames: programs,
      tierBreakdown: overlapMap.get(docType) || { high: 0, medium: 0, low: 0 },
    }))
    .sort((a, b) => b.programCount - a.programCount);
}

// --- Main computation ---

export function computeStrategy(results: EligibilityResult[]): ApplicationStrategy {
  if (results.length === 0) {
    return {
      tiers: [], coreDocuments: [], fullChecklist: [],
      recommendedFirst: null, totalDocumentsNeeded: 0,
      totalEligibleValue: 0, variesCount: 0,
      isEmpty: true, allUnlikely: false,
    };
  }

  const allUnlikely = results.every(r => r.probability < 40);

  // Group by tier
  const tierGroups: Record<TierLevel, EligibilityResult[]> = { high: [], medium: [], low: [] };
  for (const r of results) {
    tierGroups[getTierLevel(r.probability)].push(r);
  }

  // Sort within each tier: probability DESC, doc overlap score DESC, value DESC, timeline ASC
  const allDocs = computeDocumentOverlap(results);
  const docCountMap = new Map(allDocs.map(e => [e.documentType, e.programCount]));

  function overlapScore(r: EligibilityResult): number {
    return r.program.requiredDocuments.reduce((sum, d) => sum + (docCountMap.get(d) || 0), 0);
  }

  function sortPrograms(arr: EligibilityResult[]): EligibilityResult[] {
    return [...arr].sort((a, b) => {
      if (b.probability !== a.probability) return b.probability - a.probability;
      const osA = overlapScore(a), osB = overlapScore(b);
      if (osB !== osA) return osB - osA;
      const vA = typeof a.estimatedMonthlyBenefit === 'number' ? a.estimatedMonthlyBenefit : 0;
      const vB = typeof b.estimatedMonthlyBenefit === 'number' ? b.estimatedMonthlyBenefit : 0;
      if (vB !== vA) return vB - vA;
      return a.timelineWeeks - b.timelineWeeks;
    });
  }

  // Core packet: intersection of high-tier docs. If empty, use union.
  const highWithDocs = tierGroups.high.filter(r => r.program.requiredDocuments.length > 0);
  let coreDocSet: Set<DocumentType>;

  if (highWithDocs.length === 0) {
    coreDocSet = new Set<DocumentType>();
  } else if (highWithDocs.length === 1) {
    coreDocSet = new Set(highWithDocs[0].program.requiredDocuments);
  } else {
    // Start with first program's docs, intersect with rest
    let intersection = new Set(highWithDocs[0].program.requiredDocuments);
    for (let i = 1; i < highWithDocs.length; i++) {
      const programDocs = new Set(highWithDocs[i].program.requiredDocuments);
      intersection = new Set([...intersection].filter(d => programDocs.has(d)));
    }
    // If intersection empty, use union
    if (intersection.size === 0) {
      coreDocSet = new Set<DocumentType>();
      for (const r of highWithDocs) {
        for (const d of r.program.requiredDocuments) coreDocSet.add(d);
      }
    } else {
      coreDocSet = intersection;
    }
  }

  const coreDocuments = computeDocumentOverlap(results).filter(e => coreDocSet.has(e.documentType));

  // Build tiers
  let globalRank = 0;
  const tiers: ProgramTier[] = [];

  for (const level of ['high', 'medium', 'low'] as TierLevel[]) {
    const sorted = sortPrograms(tierGroups[level]);
    if (sorted.length === 0) continue;

    const programs: RankedProgram[] = sorted.map(r => {
      globalRank++;
      const shared = r.program.requiredDocuments.filter(d => coreDocSet.has(d));
      const unique = r.program.requiredDocuments.filter(d => !coreDocSet.has(d));
      return {
        result: r,
        rank: globalRank,
        effortLevel: computeEffort(r),
        sharedDocuments: shared,
        uniqueDocuments: unique,
      };
    });

    let totalMonthlyValue = 0;
    let variesCount = 0;
    for (const r of sorted) {
      const v = r.estimatedMonthlyBenefit;
      if (typeof v === 'number' && v > 0) totalMonthlyValue += v;
      else variesCount++;
    }

    tiers.push({
      level,
      label: getTierLabel(level),
      programs,
      totalMonthlyValue,
      variesCount,
      incrementalDocuments: computeIncrementalDocs(sorted, coreDocSet, results),
    });
  }

  // Totals
  const allDocsNeeded = new Set<DocumentType>();
  for (const r of results) {
    if (r.probability < 40) continue;
    for (const d of r.program.requiredDocuments) allDocsNeeded.add(d);
  }

  let totalEligibleValue = 0;
  let variesCount = 0;
  for (const r of results) {
    if (r.probability < 40) continue;
    const v = r.estimatedMonthlyBenefit;
    if (typeof v === 'number' && v > 0) totalEligibleValue += v;
    else variesCount++;
  }

  const recommendedFirst = tiers.length > 0 && tiers[0].programs.length > 0
    ? tiers[0].programs[0]
    : null;

  return {
    tiers,
    coreDocuments,
    fullChecklist: allDocs,
    recommendedFirst,
    totalDocumentsNeeded: allDocsNeeded.size,
    totalEligibleValue,
    variesCount,
    isEmpty: false,
    allUnlikely,
  };
}
