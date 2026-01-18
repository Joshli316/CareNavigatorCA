import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { Container } from '@/components/layout/Container';
import { ArrowRight, Clock, Shield, Sparkles, ClipboardCheck, TrendingUp, FileCheck } from 'lucide-react';

export default function Home() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto text-center py-12">
        {/* Hero Section */}
        <h1 className="text-display font-bold text-neutral-900 mb-6">
          Guiding Families to Disability Resources
        </h1>
        <p className="text-heading-md text-neutral-700 mb-4">
          A 15-minute path to benefits that currently takes 100+ hours
        </p>
        <p className="text-body-lg text-neutral-600 mb-12 max-w-2xl mx-auto">
          CareNavigator transforms the complex benefits system into a simple, guided experience.
          Answer a few questions and discover your personalized benefits roadmap.
        </p>

        <Link href="/quiz">
          <Button size="lg" className="inline-flex items-center space-x-2">
            <span>Start Your Benefits Quiz</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>

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

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Clock className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-heading-sm mb-2">Save 100+ Hours</h3>
            <p className="text-body text-neutral-600">
              Get results in 15 minutes instead of months of research
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-secondary-500" />
            </div>
            <h3 className="text-heading-sm mb-2">Smart Matching</h3>
            <p className="text-body text-neutral-600">
              Our AI engine finds benefits you didn't know existed
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
              <Shield className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-heading-sm mb-2">Secure & Private</h3>
            <p className="text-body text-neutral-600">
              Your data stays on your device, never shared
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 p-8 bg-primary-50 rounded-card">
          <h3 className="text-heading-md mb-6 text-neutral-900">The Problem We Solve</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-display font-bold text-primary-700">70%</div>
              <p className="text-body text-neutral-700">of eligible families fail to secure benefits</p>
            </div>
            <div>
              <div className="text-display font-bold text-primary-700">100+</div>
              <p className="text-body text-neutral-700">hours spent navigating fragmented systems</p>
            </div>
            <div>
              <div className="text-display font-bold text-primary-700">$18.4B</div>
              <p className="text-body text-neutral-700">market size for disability services</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <p className="text-body text-neutral-600 mb-4">
            Ready to discover your benefits?
          </p>
          <Link href="/quiz">
            <Button size="lg" variant="outline">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
