import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { Container } from '@/components/layout/Container';
import { ArrowRight, Clock, Shield, Sparkles, ClipboardCheck, TrendingUp, FileCheck, Heart, Home, DollarSign, GraduationCap, Utensils, Wallet } from 'lucide-react';

export default function Home() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto text-center py-12">
        {/* Hero Section */}
        <h1 className="text-display font-bold text-neutral-900 mb-6">
          Guiding Families to Disability Resources
        </h1>
        <p className="text-heading-md text-neutral-700 mb-4">
          15 Minutes. Personalized Results. Zero Cost.
        </p>
        <p className="text-body-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
          Discover benefits worth thousands in 15 minutes instead of spending 100+ hours navigating complex systems.
        </p>

        <Link href="/quiz">
          <Button size="lg" className="inline-flex items-center space-x-2">
            <span>Find My Benefits in 15 Minutes</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-6 text-body-sm text-neutral-600">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            <span>No signup required</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-success" />
            <span>100% free forever</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-success" />
            <span>Your data stays private</span>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24 mb-20">
          <h2 className="text-heading-lg text-neutral-900 mb-4 text-center">How It Works</h2>
          <p className="text-body text-neutral-600 mb-12 text-center max-w-2xl mx-auto">
            Three simple steps to discover your personalized benefits roadmap
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6 relative">
                <ClipboardCheck className="w-10 h-10 text-primary-600" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-heading-sm font-bold">
                  1
                </span>
              </div>
              <h3 className="text-heading-sm mb-3">Answer 5 Quick Questions</h3>
              <p className="text-body text-neutral-600">
                Tell us about your location, disability, financial situation, and household. Takes just 5 minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-100 rounded-full mb-6 relative">
                <TrendingUp className="w-10 h-10 text-secondary-600" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center text-heading-sm font-bold">
                  2
                </span>
              </div>
              <h3 className="text-heading-sm mb-3">Get Matched Instantly</h3>
              <p className="text-body text-neutral-600">
                Our smart engine evaluates 34+ federal, state, local, and nonprofit programs to find your best matches.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-success/20 rounded-full mb-6 relative">
                <FileCheck className="w-10 h-10 text-success" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-success text-white rounded-full flex items-center justify-center text-heading-sm font-bold">
                  3
                </span>
              </div>
              <h3 className="text-heading-sm mb-3">Apply with Confidence</h3>
              <p className="text-body text-neutral-600">
                See your eligibility probability, estimated benefits, timelines, and clear next steps for each program.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Programs Section */}
        <div className="mt-24 mb-20">
          <h2 className="text-heading-lg text-neutral-900 mb-4 text-center">Benefits You May Qualify For</h2>
          <p className="text-body text-neutral-600 mb-12 text-center max-w-2xl mx-auto">
            We match you to federal, state, local, and nonprofit programs based on your unique situation
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
                <Heart className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="text-body font-semibold text-neutral-900 mb-1">SSI/SSDI</h4>
              <p className="text-body-sm text-neutral-600">Income & disability support</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-full mb-3">
                <Heart className="w-6 h-6 text-secondary-600" />
              </div>
              <h4 className="text-body font-semibold text-neutral-900 mb-1">Medicaid</h4>
              <p className="text-body-sm text-neutral-600">Healthcare coverage</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-success/20 rounded-full mb-3">
                <Utensils className="w-6 h-6 text-success" />
              </div>
              <h4 className="text-body font-semibold text-neutral-900 mb-1">SNAP</h4>
              <p className="text-body-sm text-neutral-600">Food assistance</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-warning/20 rounded-full mb-3">
                <Home className="w-6 h-6 text-warning" />
              </div>
              <h4 className="text-body font-semibold text-neutral-900 mb-1">Housing</h4>
              <p className="text-body-sm text-neutral-600">Section 8 & subsidies</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
                <GraduationCap className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="text-body font-semibold text-neutral-900 mb-1">Education</h4>
              <p className="text-body-sm text-neutral-600">Special ed & scholarships</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-full mb-3">
                <DollarSign className="w-6 h-6 text-secondary-600" />
              </div>
              <h4 className="text-body font-semibold text-neutral-900 mb-1">Tax Credits</h4>
              <p className="text-body-sm text-neutral-600">EITC & child credits</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-success/20 rounded-full mb-3">
                <Wallet className="w-6 h-6 text-success" />
              </div>
              <h4 className="text-body font-semibold text-neutral-900 mb-1">ABLE Accounts</h4>
              <p className="text-body-sm text-neutral-600">Tax-free savings</p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-warning/20 rounded-full mb-3">
                <Sparkles className="w-6 h-6 text-warning" />
              </div>
              <h4 className="text-body font-semibold text-neutral-900 mb-1">+30 More</h4>
              <p className="text-body-sm text-neutral-600">State & local programs</p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 gap-8 mt-20 mb-20">
          <div className="bg-primary-50 rounded-card p-8 text-left">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-4">
              <Clock className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-heading-md mb-3 text-neutral-900">Save 100+ Hours</h3>
            <p className="text-body text-neutral-700">
              Get results in 15 minutes instead of months researching eligibility requirements, application processes, and program deadlines across dozens of fragmented systems.
            </p>
          </div>

          <div className="bg-secondary-50 rounded-card p-8 text-left">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary-100 rounded-full mb-4">
              <Sparkles className="w-7 h-7 text-secondary-600" />
            </div>
            <h3 className="text-heading-md mb-3 text-neutral-900">Smart AI Matching</h3>
            <p className="text-body text-neutral-700">
              Our intelligent engine evaluates your eligibility across 34+ programs and uncovers benefits you didn't know existed, maximizing your financial support.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 p-8 bg-primary-50 rounded-card">
          <h3 className="text-heading-md mb-3 text-neutral-900">Navigating Disability Benefits Shouldn't Require a Law Degree</h3>
          <p className="text-body text-neutral-600 mb-8 max-w-2xl mx-auto">
            The current system leaves families struggling to find help they're entitled to
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-display font-bold text-primary-700">70%</div>
              <p className="text-body text-neutral-700">of eligible families fail to secure benefits they qualify for</p>
            </div>
            <div>
              <div className="text-display font-bold text-primary-700">100+</div>
              <p className="text-body text-neutral-700">hours spent navigating fragmented systems and complex paperwork</p>
            </div>
            <div>
              <div className="text-display font-bold text-primary-700">$18.4B</div>
              <p className="text-body text-neutral-700">in unclaimed disability benefits left on the table annually</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
