// Synthetic impact data for the demo dashboard
// ~1,200 users across Texas counties

export interface MockUser {
  id: string;
  county: string;
  screenedAt: string;
  appliedCount: number;
  approvedCount: number;
  monthlyBenefitsSecured: number;
  demographics: {
    ageGroup: '18-25' | '26-35' | '36-45' | '46-55' | '56-65' | '65+';
    hasDisability: boolean;
    hasChildren: boolean;
    isVeteran: boolean;
  };
  programsMatched: string[];
  status: 'screened' | 'applying' | 'approved' | 'inactive';
}

const COUNTIES = [
  { name: 'Dallas', weight: 35 },
  { name: 'Tarrant', weight: 20 },
  { name: 'Collin', weight: 12 },
  { name: 'Denton', weight: 10 },
  { name: 'Ellis', weight: 5 },
  { name: 'Rockwall', weight: 4 },
  { name: 'Kaufman', weight: 4 },
  { name: 'Johnson', weight: 3 },
  { name: 'Parker', weight: 3 },
  { name: 'Hunt', weight: 2 },
  { name: 'Wise', weight: 2 },
];

const PROGRAMS = [
  'Medicaid', 'SNAP', 'SSDI', 'SSI', 'Section 8', 'TANF', 'WIC',
  'LIHEAP', 'Lifeline', 'ACP', 'STAR+PLUS', 'VA Disability',
];

const AGE_GROUPS: MockUser['demographics']['ageGroup'][] = ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateUsers(): MockUser[] {
  const rand = seededRandom(42);
  const users: MockUser[] = [];

  for (let i = 0; i < 1247; i++) {
    const r = rand();
    let county = 'Dallas';
    let cumWeight = 0;
    for (const c of COUNTIES) {
      cumWeight += c.weight / 100;
      if (r < cumWeight) { county = c.name; break; }
    }

    const hasDisability = rand() < 0.72;
    const hasChildren = rand() < 0.38;
    const isVeteran = rand() < 0.12;
    const ageIdx = Math.floor(rand() * AGE_GROUPS.length);
    const matchCount = Math.floor(rand() * 8) + 3;
    const programs = PROGRAMS.slice().sort(() => rand() - 0.5).slice(0, matchCount);

    const statusRoll = rand();
    const status: MockUser['status'] = statusRoll < 0.15 ? 'inactive' : statusRoll < 0.35 ? 'screened' : statusRoll < 0.67 ? 'applying' : 'approved';

    const appliedCount = status === 'screened' || status === 'inactive' ? 0 : Math.floor(rand() * matchCount) + 1;
    const approvedCount = status === 'approved' ? Math.floor(rand() * appliedCount) + 1 : 0;
    const monthlyBenefitsSecured = approvedCount > 0 ? Math.round((rand() * 3000 + 200) / 10) * 10 : 0;

    // Spread screenings over last 6 months
    const daysAgo = Math.floor(rand() * 180);
    const date = new Date(2026, 1, 15);
    date.setDate(date.getDate() - daysAgo);

    users.push({
      id: `user-${String(i).padStart(4, '0')}`,
      county,
      screenedAt: date.toISOString().split('T')[0],
      appliedCount,
      approvedCount,
      monthlyBenefitsSecured,
      demographics: {
        ageGroup: AGE_GROUPS[ageIdx],
        hasDisability,
        hasChildren,
        isVeteran,
      },
      programsMatched: programs,
      status,
    });
  }

  return users;
}

export const MOCK_USERS = generateUsers();

// Pre-computed aggregates
export function getImpactStats(users: MockUser[]) {
  const totalScreened = users.length;
  const totalApplied = users.filter(u => u.appliedCount > 0).length;
  const totalApproved = users.filter(u => u.approvedCount > 0).length;
  const totalBenefitsMonthly = users.reduce((s, u) => s + u.monthlyBenefitsSecured, 0);
  const totalBenefitsAnnual = totalBenefitsMonthly * 12;

  const byCounty = COUNTIES.map(c => {
    const countyUsers = users.filter(u => u.county === c.name);
    return {
      county: c.name,
      screened: countyUsers.length,
      applied: countyUsers.filter(u => u.appliedCount > 0).length,
      approved: countyUsers.filter(u => u.approvedCount > 0).length,
      benefits: countyUsers.reduce((s, u) => s + u.monthlyBenefitsSecured, 0),
    };
  });

  const byProgram = PROGRAMS.map(p => {
    const matched = users.filter(u => u.programsMatched.includes(p)).length;
    const applied = users.filter(u => u.programsMatched.includes(p) && u.appliedCount > 0).length;
    const approved = users.filter(u => u.programsMatched.includes(p) && u.approvedCount > 0).length;
    return { program: p, matched, applied, approved, conversionRate: matched > 0 ? Math.round((approved / matched) * 100) : 0 };
  }).sort((a, b) => b.matched - a.matched);

  const byAgeGroup = AGE_GROUPS.map(ag => ({
    ageGroup: ag,
    count: users.filter(u => u.demographics.ageGroup === ag).length,
  }));

  // Monthly trend (last 6 months)
  const monthlyTrend = [];
  for (let m = 5; m >= 0; m--) {
    const date = new Date(2026, 1 - m, 1);
    const monthStr = date.toISOString().slice(0, 7);
    const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const monthUsers = users.filter(u => u.screenedAt.startsWith(monthStr));
    monthlyTrend.push({
      month: monthLabel,
      screened: monthUsers.length,
      applied: monthUsers.filter(u => u.appliedCount > 0).length,
      approved: monthUsers.filter(u => u.approvedCount > 0).length,
      benefits: monthUsers.reduce((s, u) => s + u.monthlyBenefitsSecured, 0),
    });
  }

  return {
    totalScreened,
    totalApplied,
    totalApproved,
    totalBenefitsMonthly,
    totalBenefitsAnnual,
    conversionRate: Math.round((totalApproved / totalScreened) * 100),
    avgBenefitPerUser: totalApproved > 0 ? Math.round(totalBenefitsMonthly / totalApproved) : 0,
    byCounty,
    byProgram,
    byAgeGroup,
    monthlyTrend,
  };
}
