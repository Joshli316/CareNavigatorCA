// Benefits cliff simulation data
// Models how benefits change as income increases

export interface BenefitProgram {
  name: string;
  category: string;
  maxMonthlyBenefit: number;
  incomePhaseOutStart: number; // FPL-based monthly income where benefits start reducing
  incomePhaseOutEnd: number;   // Income where benefits reach $0
  color: string;
  description: string;
  applicationWeeks: number;
  dependsOn?: string[]; // Programs that help qualify for this one
}

// For a household of 3 in Texas (2026 FPL ~$2,060/mo for family of 3)
export const SIMULATION_PROGRAMS: BenefitProgram[] = [
  {
    name: 'Medicaid',
    category: 'Healthcare',
    maxMonthlyBenefit: 800,
    incomePhaseOutStart: 2880, // 138% FPL
    incomePhaseOutEnd: 2880,   // Hard cliff
    color: '#3b82f6',
    description: 'Free health coverage for your family',
    applicationWeeks: 4,
  },
  {
    name: 'SNAP',
    category: 'Food',
    maxMonthlyBenefit: 740,
    incomePhaseOutStart: 1800,
    incomePhaseOutEnd: 3400, // 165% FPL gross
    color: '#22c55e',
    description: 'Monthly food benefits (EBT card)',
    applicationWeeks: 4,
    dependsOn: ['Medicaid'],
  },
  {
    name: 'TANF',
    category: 'Cash',
    maxMonthlyBenefit: 450,
    incomePhaseOutStart: 800,
    incomePhaseOutEnd: 1800,
    color: '#f59e0b',
    description: 'Cash assistance for families with children',
    applicationWeeks: 8,
  },
  {
    name: 'Section 8',
    category: 'Housing',
    maxMonthlyBenefit: 1200,
    incomePhaseOutStart: 2400,
    incomePhaseOutEnd: 4100, // 50% AMI
    color: '#8b5cf6',
    description: 'Rental assistance voucher',
    applicationWeeks: 52,
  },
  {
    name: 'WIC',
    category: 'Food',
    maxMonthlyBenefit: 50,
    incomePhaseOutStart: 3800,
    incomePhaseOutEnd: 3800, // Hard cliff at 185% FPL
    color: '#06b6d4',
    description: 'Nutrition for mothers and young children',
    applicationWeeks: 2,
  },
  {
    name: 'LIHEAP',
    category: 'Utilities',
    maxMonthlyBenefit: 300,
    incomePhaseOutStart: 2400,
    incomePhaseOutEnd: 3100, // 150% FPL
    color: '#ef4444',
    description: 'Help paying energy bills',
    applicationWeeks: 4,
  },
  {
    name: 'Lifeline',
    category: 'Utilities',
    maxMonthlyBenefit: 30,
    incomePhaseOutStart: 2880,
    incomePhaseOutEnd: 2880, // 135% FPL hard cliff
    color: '#64748b',
    description: 'Discounted phone/internet',
    applicationWeeks: 2,
    dependsOn: ['Medicaid', 'SNAP'],
  },
  {
    name: 'ACP',
    category: 'Utilities',
    maxMonthlyBenefit: 30,
    incomePhaseOutStart: 4100,
    incomePhaseOutEnd: 4100, // 200% FPL hard cliff
    color: '#a855f7',
    description: 'Internet discount program',
    applicationWeeks: 2,
    dependsOn: ['SNAP', 'Medicaid'],
  },
];

export function calculateBenefitsAtIncome(monthlyIncome: number): { program: string; benefit: number; color: string }[] {
  return SIMULATION_PROGRAMS.map(p => {
    let benefit = 0;
    if (monthlyIncome <= p.incomePhaseOutStart) {
      benefit = p.maxMonthlyBenefit;
    } else if (monthlyIncome >= p.incomePhaseOutEnd) {
      benefit = 0;
    } else {
      // Linear phase-out
      const range = p.incomePhaseOutEnd - p.incomePhaseOutStart;
      const progress = (monthlyIncome - p.incomePhaseOutStart) / range;
      benefit = Math.round(p.maxMonthlyBenefit * (1 - progress));
    }
    return { program: p.name, benefit, color: p.color };
  });
}

export function generateCliffData() {
  const data = [];
  for (let income = 0; income <= 6000; income += 100) {
    const benefits = calculateBenefitsAtIncome(income);
    const entry: Record<string, number> = { income };
    let total = 0;
    for (const b of benefits) {
      entry[b.program] = b.benefit;
      total += b.benefit;
    }
    entry['totalBenefits'] = total;
    entry['netResources'] = income + total;
    data.push(entry);
  }
  return data;
}

export function getOptimalSequence(): { program: string; week: number; duration: number; color: string; reason: string }[] {
  return [
    { program: 'WIC', week: 1, duration: 2, color: '#06b6d4', reason: 'Fastest approval — food benefits in 2 weeks' },
    { program: 'Medicaid', week: 1, duration: 4, color: '#3b82f6', reason: 'Apply simultaneously — unlocks Lifeline + SNAP expedited' },
    { program: 'SNAP', week: 3, duration: 4, color: '#22c55e', reason: 'Medicaid pending = expedited SNAP processing' },
    { program: 'Lifeline', week: 5, duration: 2, color: '#64748b', reason: 'Medicaid approval auto-qualifies you' },
    { program: 'ACP', week: 5, duration: 2, color: '#a855f7', reason: 'SNAP approval auto-qualifies you' },
    { program: 'LIHEAP', week: 5, duration: 4, color: '#ef4444', reason: 'Apply during open enrollment window' },
    { program: 'TANF', week: 7, duration: 8, color: '#f59e0b', reason: 'Longer process — start after quick wins secured' },
    { program: 'Section 8', week: 1, duration: 52, color: '#8b5cf6', reason: 'Long waitlist — apply immediately, benefits come later' },
  ];
}
