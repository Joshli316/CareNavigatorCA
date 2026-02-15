'use client';

import { useState } from 'react';
import { Grant, ExtractedProfile } from '@/types/grant';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';

interface ApplicationPreviewProps {
  grant: Grant;
  profile: ExtractedProfile;
  onClose: () => void;
}

export function ApplicationPreview({ grant, profile, onClose }: ApplicationPreviewProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Simulate PDF download
    setTimeout(() => {
      // Create a mock PDF blob and trigger download
      const content = generateApplicationText(grant, profile);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${grant.name.replace(/[^a-z0-9]/gi, '_')}_Application.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Application Preview</h2>
            <p className="text-sm text-gray-500">{grant.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Application Form Preview */}
          <Card className="p-6 bg-gray-50">
            <div className="text-center mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">{grant.name}</h3>
              <p className="text-sm text-gray-500">{grant.organization}</p>
              <p className="text-xs text-gray-400 mt-2">Application Generated: {new Date().toLocaleDateString()}</p>
            </div>

            {/* Applicant Information */}
            <div className="space-y-6">
              <section>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Applicant Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Full Name" value={profile.fullName} />
                  <FormField label="Date of Birth" value={profile.dateOfBirth} />
                  <FormField label="Address" value={profile.address} />
                  <FormField label="City" value={profile.city} />
                  <FormField label="State" value={profile.state} />
                  <FormField label="ZIP Code" value={profile.zipCode} />
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Financial Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Monthly Income" value={`$${profile.monthlyIncome.toLocaleString()}`} />
                  <FormField label="Annual Income" value={`$${(profile.monthlyIncome * 12).toLocaleString()}`} />
                  <FormField label="Employment Status" value={profile.employmentStatus} />
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Household Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Household Size" value={profile.householdSize.toString()} />
                  <FormField label="Dependents" value={profile.dependents.toString()} />
                  <FormField label="Veteran Status" value={profile.isVeteran ? 'Yes' : 'No'} />
                  <FormField label="Disability Status" value={profile.hasDisability ? 'Yes' : 'No'} />
                </div>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Required Documents
                </h4>
                <div className="space-y-2">
                  {grant.requiredDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{doc}</span>
                      <span className="text-xs text-success">Attached</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Signature */}
              <section className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Electronic Signature</p>
                    <p className="text-lg font-script italic text-gray-800">{profile.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-sm text-gray-800">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </section>
            </div>
          </Card>

          {/* Submission Info */}
          <div className="mt-6 p-4 bg-accent-50 rounded-lg">
            <h4 className="font-medium text-accent-700 mb-2">Next Steps</h4>
            <ul className="text-sm text-accent-600 space-y-1">
              <li>• Download and review your application</li>
              <li>• Submit to {grant.organization} via their {grant.hasAPI ? 'online portal' : grant.hasPDF ? 'mail or in-person' : 'preferred method'}</li>
              <li>• Expected processing time: {grant.processingTime}</li>
              {grant.applicationUrl && (
                <li>
                  • <a href={grant.applicationUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    Visit official website →
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.print()}>
              Print
            </Button>
            <Button onClick={handleDownload} disabled={downloading}>
              {downloading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Application
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-gray-800 bg-white px-3 py-2 rounded border border-gray-200">
        {value}
      </p>
    </div>
  );
}

function generateApplicationText(grant: Grant, profile: ExtractedProfile): string {
  return `
================================================================================
                          ${grant.name.toUpperCase()}
                              APPLICATION FORM
================================================================================

Organization: ${grant.organization}
Generated: ${new Date().toLocaleString()}

--------------------------------------------------------------------------------
                          APPLICANT INFORMATION
--------------------------------------------------------------------------------

Full Name:          ${profile.fullName}
Date of Birth:      ${profile.dateOfBirth}
Address:            ${profile.address}
City:               ${profile.city}
State:              ${profile.state}
ZIP Code:           ${profile.zipCode}

--------------------------------------------------------------------------------
                          FINANCIAL INFORMATION
--------------------------------------------------------------------------------

Monthly Income:     $${profile.monthlyIncome.toLocaleString()}
Annual Income:      $${(profile.monthlyIncome * 12).toLocaleString()}
Employment Status:  ${profile.employmentStatus}

--------------------------------------------------------------------------------
                          HOUSEHOLD INFORMATION
--------------------------------------------------------------------------------

Household Size:     ${profile.householdSize}
Dependents:         ${profile.dependents}
Veteran Status:     ${profile.isVeteran ? 'Yes' : 'No'}
Disability Status:  ${profile.hasDisability ? 'Yes' : 'No'}
Senior (65+):       ${profile.isSenior ? 'Yes' : 'No'}

--------------------------------------------------------------------------------
                          REQUIRED DOCUMENTS
--------------------------------------------------------------------------------

${grant.requiredDocuments.map(doc => `[✓] ${doc}`).join('\n')}

--------------------------------------------------------------------------------
                              CERTIFICATION
--------------------------------------------------------------------------------

I certify that all information provided in this application is true and accurate
to the best of my knowledge. I understand that providing false information may
result in denial of benefits or other penalties.


Signature: ${profile.fullName}
Date: ${new Date().toLocaleDateString()}

================================================================================
                    Generated by Grant Navigator
================================================================================
`.trim();
}
