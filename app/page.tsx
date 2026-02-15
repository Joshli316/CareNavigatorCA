import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { Container } from '@/components/layout/Container';

export default function Home() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto py-16 md:py-24">
        {/* Hero */}
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-50 text-accent-700 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            Free Benefits Navigator
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-6 leading-tight">
            Find disability resources<br />
            <span className="text-accent-600">in 15 minutes</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover benefits worth thousands instead of spending 100+ hours navigating complex government systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/quiz">
              <Button size="lg" className="px-8">
                Start Free Assessment
              </Button>
            </Link>
            <Link href="/grants">
              <Button size="lg" variant="outline" className="px-8">
                Upload Documents Instead
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No signup required
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              100% free forever
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Private & secure
            </span>
          </div>
        </header>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-center text-sm font-semibold text-accent-600 uppercase tracking-wide mb-3">How It Works</h2>
          <p className="text-center text-2xl font-medium text-gray-900 mb-12">Three simple steps</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-subtle">
              <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center font-semibold mb-4">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Answer questions</h3>
              <p className="text-sm text-gray-500">Tell us about your location, disability, finances, and household.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-subtle">
              <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center font-semibold mb-4">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Get matched</h3>
              <p className="text-sm text-gray-500">We evaluate 34+ federal, state, and local programs for you.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-subtle">
              <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center font-semibold mb-4">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Apply confidently</h3>
              <p className="text-sm text-gray-500">See eligibility scores, benefits, timelines, and next steps.</p>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="mb-20">
          <h2 className="text-center text-sm font-semibold text-accent-600 uppercase tracking-wide mb-3">Programs Covered</h2>
          <p className="text-center text-2xl font-medium text-gray-900 mb-12">Benefits you may qualify for</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'SSI/SSDI', desc: 'Income support', color: 'bg-accent-50 text-accent-700' },
              { name: 'Medicaid', desc: 'Healthcare', color: 'bg-success-light text-success' },
              { name: 'SNAP', desc: 'Food assistance', color: 'bg-warning-light text-warning' },
              { name: 'Section 8', desc: 'Housing', color: 'bg-accent-50 text-accent-700' },
              { name: 'Education', desc: 'Special ed', color: 'bg-success-light text-success' },
              { name: 'Tax Credits', desc: 'EITC & more', color: 'bg-warning-light text-warning' },
              { name: 'ABLE', desc: 'Tax-free savings', color: 'bg-accent-50 text-accent-700' },
              { name: '+30 More', desc: 'State & local', color: 'bg-gray-100 text-gray-600' },
            ].map((program) => (
              <div key={program.name} className="bg-white border border-gray-200 rounded-xl p-5 shadow-subtle hover:shadow-card transition-shadow">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-3 ${program.color}`}>
                  {program.name}
                </span>
                <p className="text-sm text-gray-500">{program.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Grant Navigator */}
        <section className="mb-20">
          <h2 className="text-center text-sm font-semibold text-accent-600 uppercase tracking-wide mb-3">New Feature</h2>
          <p className="text-center text-2xl font-medium text-gray-900 mb-4">Upload documents, skip the quiz</p>
          <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">
            Already have your documents? Our AI extracts your information automatically and matches you with grants and benefits in minutes.
          </p>

          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-subtle">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-accent-100 text-accent-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Upload Documents</h3>
                <p className="text-sm text-gray-500">ID, pay stubs, utility bills</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-accent-100 text-accent-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">AI Extraction</h3>
                <p className="text-sm text-gray-500">We read & organize your info</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-accent-100 text-accent-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Get Matched</h3>
                <p className="text-sm text-gray-500">50+ programs analyzed</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Link href="/grants">
                <Button>
                  Try Grant Navigator
                  <span className="ml-2">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20 bg-accent-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-center text-sm font-semibold text-accent-200 uppercase tracking-wide mb-3">The Problem</h2>
          <p className="text-center text-2xl font-medium mb-10">Benefits shouldn&apos;t be this hard to find</p>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-light tabular-nums mb-2">70%</p>
              <p className="text-accent-200">of eligible families miss benefits</p>
            </div>
            <div>
              <p className="text-5xl font-light tabular-nums mb-2">100+</p>
              <p className="text-accent-200">hours spent navigating systems</p>
            </div>
            <div>
              <p className="text-5xl font-light tabular-nums mb-2">$18B</p>
              <p className="text-accent-200">left unclaimed annually</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 bg-gray-50 rounded-2xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Ready to find your benefits?</h2>
          <p className="text-gray-500 mb-8">Takes about 15 minutes. Completely free.</p>
          <Link href="/quiz">
            <Button size="lg" className="px-8">
              Start Free Assessment
            </Button>
          </Link>
        </section>
      </div>
    </Container>
  );
}
