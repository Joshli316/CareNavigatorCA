'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuiz } from '@/lib/context/QuizContext';
import { useResults } from '@/lib/context/ResultsContext';
import { EligibilityEngine } from '@/lib/rules/eligibilityEngine';
import { getProgramsByState } from '@/lib/rules/benefitRules';
import { trackEvent } from '@/lib/utils/analytics';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/shared/Button';
import { QuizData, AssistanceLevel } from '@/types/quiz';

interface LifeEvent {
  id: string;
  title: string;
  subtitle: string;
  focus: string;
  icon: React.ReactNode;
  quizData: QuizData;
}

const LIFE_EVENTS: LifeEvent[] = [
  {
    id: 'diagnosed',
    title: 'I was just diagnosed with a disability',
    subtitle: 'Find income support, healthcare, and rehab services',
    focus: 'SSI/SSDI, Medicaid, vocational rehab',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11v4m0-4h.01" />
      </svg>
    ),
    quizData: {
      geography: { state: 'TX', county: 'Dallas', city: '', zipCode: '', residencyMonths: 12 },
      disability: { hasDisability: true, disabilityType: [], receivingSSI: false, receivingSSDI: false, hasSSADetermination: false },
      financial: { monthlyIncome: 1500, incomeType: [], countableAssets: 0, ownsCar: false, carValue: 0, ownsHome: false, homeValue: 0 },
      demographic: { age: 35, householdSize: 1, hasChildren: false, childrenAges: [], isVeteran: false, needsAssistance: AssistanceLevel.SOME },
    },
  },
  {
    id: 'lost-job',
    title: 'I lost my job',
    subtitle: 'Get food, cash assistance, and emergency help',
    focus: 'SNAP, TANF, emergency assistance',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    quizData: {
      geography: { state: 'TX', county: 'Dallas', city: '', zipCode: '', residencyMonths: 12 },
      disability: { hasDisability: false, disabilityType: [], receivingSSI: false, receivingSSDI: false, hasSSADetermination: false },
      financial: { monthlyIncome: 0, incomeType: [], countableAssets: 2000, ownsCar: false, carValue: 0, ownsHome: false, homeValue: 0 },
      demographic: { age: 40, householdSize: 2, hasChildren: false, childrenAges: [], isVeteran: false, needsAssistance: AssistanceLevel.NONE },
    },
  },
  {
    id: 'having-baby',
    title: "I'm having a baby",
    subtitle: 'Access nutrition, healthcare, and family support',
    focus: 'WIC, Medicaid, CHIP',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    quizData: {
      geography: { state: 'TX', county: 'Dallas', city: '', zipCode: '', residencyMonths: 12 },
      disability: { hasDisability: false, disabilityType: [], receivingSSI: false, receivingSSDI: false, hasSSADetermination: false },
      financial: { monthlyIncome: 2000, incomeType: [], countableAssets: 0, ownsCar: false, carValue: 0, ownsHome: false, homeValue: 0 },
      demographic: { age: 28, householdSize: 3, hasChildren: true, childrenAges: [0], isVeteran: false, needsAssistance: AssistanceLevel.NONE },
    },
  },
  {
    id: 'turning-65',
    title: "I'm turning 65",
    subtitle: 'Explore Medicare, senior programs, and retirement aid',
    focus: 'Medicare, SSI, senior programs',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    quizData: {
      geography: { state: 'TX', county: 'Dallas', city: '', zipCode: '', residencyMonths: 12 },
      disability: { hasDisability: false, disabilityType: [], receivingSSI: false, receivingSSDI: false, hasSSADetermination: false },
      financial: { monthlyIncome: 1800, incomeType: [], countableAssets: 0, ownsCar: false, carValue: 0, ownsHome: false, homeValue: 0 },
      demographic: { age: 65, householdSize: 1, hasChildren: false, childrenAges: [], isVeteran: false, needsAssistance: AssistanceLevel.NONE },
    },
  },
  {
    id: 'caregiver',
    title: "I'm becoming a caregiver",
    subtitle: 'Find respite care, attendant services, and support',
    focus: 'Respite care, attendant services, caregiver support',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
    ),
    quizData: {
      geography: { state: 'TX', county: 'Dallas', city: '', zipCode: '', residencyMonths: 12 },
      disability: { hasDisability: false, disabilityType: [], receivingSSI: false, receivingSSDI: false, hasSSADetermination: false },
      financial: { monthlyIncome: 1200, incomeType: [], countableAssets: 0, ownsCar: false, carValue: 0, ownsHome: false, homeValue: 0 },
      demographic: { age: 50, householdSize: 2, hasChildren: false, childrenAges: [], isVeteran: false, needsAssistance: AssistanceLevel.EXTENSIVE },
    },
  },
  {
    id: 'leaving-military',
    title: "I'm leaving the military",
    subtitle: 'Access VA benefits, education, and veteran programs',
    focus: 'VA benefits, Hazlewood, vet programs',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    quizData: {
      geography: { state: 'TX', county: 'Dallas', city: '', zipCode: '', residencyMonths: 12 },
      disability: { hasDisability: true, disabilityType: [], receivingSSI: false, receivingSSDI: false, hasSSADetermination: false },
      financial: { monthlyIncome: 2500, incomeType: [], countableAssets: 0, ownsCar: false, carValue: 0, ownsHome: false, homeValue: 0 },
      demographic: { age: 32, householdSize: 3, hasChildren: false, childrenAges: [], isVeteran: true, needsAssistance: AssistanceLevel.NONE },
    },
  },
];

export default function LifeEventsPage() {
  const router = useRouter();
  const { updateStepData } = useQuiz();
  const { setResults } = useResults();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleEventClick = (event: LifeEvent) => {
    setLoadingId(event.id);
    trackEvent('life_event_click', { event: event.id });

    // Populate quiz context with pre-filled data
    updateStepData('geography', event.quizData.geography);
    updateStepData('disability', event.quizData.disability);
    updateStepData('financial', event.quizData.financial);
    updateStepData('demographic', event.quizData.demographic);

    // Run eligibility engine
    try {
      const programs = getProgramsByState(event.quizData.geography.state);
      const engine = new EligibilityEngine(programs);
      const results = engine.evaluateEligibility(event.quizData);

      setResults(results);
      router.push('/results');
    } catch (err) {
      console.error('Eligibility engine error:', err);
      setLoadingId(null);
    }
  };

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-16 md:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            Quick Start
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-6 leading-tight">
            What just happened?
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Pick what&apos;s going on &mdash; we&apos;ll find your benefits in 60 seconds.
          </p>
        </header>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {LIFE_EVENTS.map((event) => {
            const isLoading = loadingId === event.id;
            return (
              <button
                key={event.id}
                onClick={() => handleEventClick(event)}
                disabled={loadingId !== null}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-subtle hover:shadow-card hover:border-accent-300 transition-all duration-150 text-left group disabled:opacity-60 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
              >
                <div className="w-12 h-12 bg-accent-50 text-accent-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent-100 transition-colors">
                  {isLoading ? (
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    event.icon
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 leading-snug">{event.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{event.subtitle}</p>
                <span className="inline-flex items-center text-xs font-medium text-accent-600">
                  {event.focus}
                </span>
              </button>
            );
          })}
        </div>

        {/* Back to full assessment */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-3">Want more accurate results?</p>
          <Link href="/quiz">
            <Button variant="outline" size="md">
              Take the full assessment instead
              <span className="ml-2">&rarr;</span>
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
