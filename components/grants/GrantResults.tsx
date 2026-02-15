'use client';

import { useState } from 'react';
import { useGrant } from '@/lib/context/GrantContext';
import { Grant, GrantCategory, GrantApplication } from '@/types/grant';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { ApplicationPreview } from './ApplicationPreview';

type FilterCategory = 'all' | GrantCategory;
type FilterEligibility = 'all' | 'likely' | 'possible';

export function GrantResults() {
  const { matchedGrants, profile, applications, generateApplication, setCurrentStep } = useGrant();
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [eligibilityFilter, setEligibilityFilter] = useState<FilterEligibility>('all');
  const [previewGrant, setPreviewGrant] = useState<Grant | null>(null);

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No profile data available. Please complete the previous steps.</p>
        <Button className="mt-4" onClick={() => setCurrentStep('upload')}>
          Start Over
        </Button>
      </div>
    );
  }

  const filteredGrants = matchedGrants.filter((grant) => {
    if (categoryFilter !== 'all' && grant.category !== categoryFilter) return false;
    if (eligibilityFilter === 'likely' && grant.confidence !== 'likely') return false;
    if (eligibilityFilter === 'possible' && grant.confidence !== 'possible') return false;
    return true;
  });

  const likelyGrants = matchedGrants.filter((g) => g.confidence === 'likely');
  const possibleGrants = matchedGrants.filter((g) => g.confidence === 'possible');

  const categories: FilterCategory[] = ['all', 'food', 'housing', 'healthcare', 'utilities', 'income', 'emergency', 'education'];

  return (
    <div className="space-y-8">
      {/* Application Preview Modal */}
      {previewGrant && (
        <ApplicationPreview
          grant={previewGrant}
          profile={profile}
          onClose={() => setPreviewGrant(null)}
        />
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Your Matched Programs</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Based on your profile, here are the grants and benefits you may qualify for.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Programs Found" value={matchedGrants.length.toString()} icon="📋" />
        <StatCard label="Likely Eligible" value={likelyGrants.length.toString()} icon="✅" accent />
        <StatCard label="Possibly Eligible" value={possibleGrants.length.toString()} icon="❓" />
        <StatCard label="Generated" value={applications.length.toString()} icon="📄" />
      </div>

      {/* Generated Applications Section */}
      {applications.length > 0 && (
        <div className="bg-success-light border border-success/20 rounded-lg p-4">
          <h3 className="font-medium text-success mb-3">Your Generated Applications ({applications.length})</h3>
          <div className="flex flex-wrap gap-2">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setPreviewGrant(app.grant)}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-success/30 hover:border-success transition-colors text-sm"
              >
                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-gray-700">{app.grant.name}</span>
                <span className="text-xs text-success">View</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Filter by Category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  categoryFilter === cat
                    ? 'bg-accent-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Eligibility Filter */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Filter by Eligibility</p>
          <div className="flex gap-2">
            <button
              onClick={() => setEligibilityFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                eligibilityFilter === 'all'
                  ? 'bg-accent-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setEligibilityFilter('likely')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                eligibilityFilter === 'likely'
                  ? 'bg-success text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Likely
            </button>
            <button
              onClick={() => setEligibilityFilter('possible')}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                eligibilityFilter === 'possible'
                  ? 'bg-warning text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Possible
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing {filteredGrants.length} of {matchedGrants.length} programs
      </p>

      {/* Grant Cards */}
      <div className="space-y-4">
        {filteredGrants.map((grant) => (
          <GrantCard
            key={grant.id}
            grant={grant}
            application={applications.find((a) => a.grantId === grant.id)}
            onGenerate={() => generateApplication(grant.id)}
            onView={() => setPreviewGrant(grant)}
          />
        ))}
      </div>

      {filteredGrants.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No programs match your current filters.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setCategoryFilter('all');
              setEligibilityFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={() => setCurrentStep('review')}>
          ← Back to Profile Review
        </Button>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  accent?: boolean;
}

function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <Card className={`p-4 text-center ${accent ? 'bg-accent-50 border-accent-200' : ''}`}>
      <span className="text-2xl">{icon}</span>
      <p className={`text-2xl font-semibold mt-1 ${accent ? 'text-accent-700' : 'text-gray-900'}`}>{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </Card>
  );
}

interface GrantCardProps {
  grant: Grant;
  application?: GrantApplication;
  onGenerate: () => void;
  onView: () => void;
}

function GrantCard({ grant, application, onGenerate, onView }: GrantCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    onGenerate();
    // Show preview after a short delay to simulate generation
    setTimeout(() => {
      setGenerating(false);
      onView();
    }, 1500);
  };

  const confidenceColor =
    grant.confidence === 'likely'
      ? 'bg-success text-white'
      : grant.confidence === 'possible'
        ? 'bg-warning text-white'
        : 'bg-gray-400 text-white';

  const confidenceLabel =
    grant.confidence === 'likely'
      ? 'Likely Eligible'
      : grant.confidence === 'possible'
        ? 'Possibly Eligible'
        : 'May Not Qualify';

  return (
    <Card className="overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">{grant.name}</h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${confidenceColor}`}>
                {grant.eligibilityScore}% - {confidenceLabel}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{grant.organization}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-accent-600">{grant.benefitAmount}</p>
            <p className="text-xs text-gray-500">{grant.processingTime}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3">{grant.description}</p>

        {/* Category & Submission Type */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
            {grant.category.charAt(0).toUpperCase() + grant.category.slice(1)}
          </span>
          <span className="text-xs text-gray-500">
            Submit via: {grant.hasAPI ? 'Direct Submit' : grant.hasPDF ? 'PDF Form' : 'Manual'}
          </span>
        </div>

        {/* Expandable Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* Match Reasons */}
            {grant.matchReasons.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Why You May Qualify</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {grant.matchReasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-success mt-0.5">✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fail Reasons */}
            {grant.failReasons.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Potential Issues</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {grant.failReasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-warning mt-0.5">!</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Documents */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Required Documents</p>
              <div className="flex flex-wrap gap-2">
                {grant.requiredDocuments.map((doc, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Application URL */}
            {grant.applicationUrl && (
              <div>
                <a
                  href={grant.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent-600 hover:text-accent-700 underline"
                >
                  View official application →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-accent-600 hover:text-accent-700 font-medium"
          >
            {expanded ? '− Show Less' : '+ Show Details'}
          </button>

          <div className="flex gap-2">
            {generating ? (
              <Button disabled>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </Button>
            ) : application ? (
              <Button onClick={onView}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Application
              </Button>
            ) : (
              <Button onClick={handleGenerate}>Generate Application</Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
