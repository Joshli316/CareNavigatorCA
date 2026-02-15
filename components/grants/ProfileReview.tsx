'use client';

import { useState } from 'react';
import { useGrant } from '@/lib/context/GrantContext';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';

export function ProfileReview() {
  const { profile, setCurrentStep, matchedGrants } = useGrant();
  const [isEditing, setIsEditing] = useState(false);

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No profile data available. Please upload your documents first.</p>
        <Button className="mt-4" onClick={() => setCurrentStep('upload')}>
          Go Back
        </Button>
      </div>
    );
  }

  const confidenceColor =
    profile.extractionConfidence >= 90
      ? 'text-success'
      : profile.extractionConfidence >= 70
        ? 'text-warning'
        : 'text-error';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Review Your Information</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          We extracted this information from your documents. Please review and confirm it&apos;s accurate before we find
          matching programs.
        </p>
      </div>

      {/* Confidence Indicator */}
      <div className="bg-accent-50 rounded-lg p-4 text-center">
        <p className="text-sm text-accent-700">
          Extraction confidence: <span className={`font-semibold ${confidenceColor}`}>{profile.extractionConfidence}%</span>
        </p>
        <p className="text-xs text-accent-600 mt-1">
          Based on {profile.documentsProcessed.length} document{profile.documentsProcessed.length !== 1 ? 's' : ''}{' '}
          processed
        </p>
      </div>

      {/* Profile Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">👤</span>
            Personal Information
          </h2>
          <dl className="space-y-3">
            <ProfileField label="Full Name" value={profile.fullName} />
            <ProfileField label="Date of Birth" value={profile.dateOfBirth} />
            <ProfileField label="Veteran Status" value={profile.isVeteran ? 'Yes' : 'No'} />
            <ProfileField label="Senior (65+)" value={profile.isSenior ? 'Yes' : 'No'} />
            <ProfileField label="Disability" value={profile.hasDisability ? 'Yes' : 'No'} />
          </dl>
        </Card>

        {/* Address */}
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">🏠</span>
            Address
          </h2>
          <dl className="space-y-3">
            <ProfileField label="Street" value={profile.address} />
            <ProfileField label="City" value={profile.city} />
            <ProfileField label="State" value={profile.state} />
            <ProfileField label="ZIP Code" value={profile.zipCode} />
          </dl>
        </Card>

        {/* Income & Employment */}
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">💼</span>
            Income & Employment
          </h2>
          <dl className="space-y-3">
            <ProfileField label="Monthly Income" value={`$${profile.monthlyIncome.toLocaleString()}`} />
            <ProfileField label="Annual Income" value={`$${(profile.monthlyIncome * 12).toLocaleString()}`} />
            <ProfileField
              label="Employment Status"
              value={profile.employmentStatus.charAt(0).toUpperCase() + profile.employmentStatus.slice(1)}
            />
          </dl>
        </Card>

        {/* Household */}
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">👨‍👩‍👧‍👦</span>
            Household
          </h2>
          <dl className="space-y-3">
            <ProfileField label="Household Size" value={profile.householdSize.toString()} />
            <ProfileField label="Dependents" value={profile.dependents.toString()} />
          </dl>
        </Card>
      </div>

      {/* Edit Notice */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="text-sm font-medium text-gray-700">Need to make changes?</p>
          <p className="text-sm text-gray-500">
            If any information is incorrect, you can edit it after confirming. For major changes, consider re-uploading
            your documents.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="outline" onClick={() => setCurrentStep('upload')}>
          Back to Documents
        </Button>
        <Button size="lg" onClick={() => setCurrentStep('results')}>
          Confirm & Find Programs
          <span className="ml-2">→</span>
        </Button>
      </div>

      {/* Preview of matches */}
      {matchedGrants.length > 0 && (
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-accent-600">
            Based on your profile, we&apos;ve already found{' '}
            <span className="font-semibold">{matchedGrants.length} potential programs</span> you may qualify for!
          </p>
        </div>
      )}
    </div>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string;
}

function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}
