'use client';

import { useState } from 'react';
import { Download, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { EligibilityResult } from '@/types/benefit';
import { QuizData } from '@/types/quiz';
import { preFillEngine } from '@/lib/applications/prefillEngine';
import { PrefilledApplication } from '@/types/application';

interface PrefillButtonProps {
  result: EligibilityResult;
  quizData: QuizData;
}

export function PrefillButton({ result, quizData }: PrefillButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [application, setApplication] = useState<PrefilledApplication | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Check if this program has an application template
  if (!result.program.applicationTemplate) {
    return null;
  }

  const template = result.program.applicationTemplate;

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate short delay for better UX (processing feel)
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const prefilled = preFillEngine.generateApplication(
        template,
        quizData,
        result
      );
      setApplication(prefilled);
      setShowDetails(true);
    } catch (error) {
      console.error('Error generating application:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!application) return;

    const json = preFillEngine.exportToJSON(application, {
      prettyPrint: true,
      includeInstructions: true,
      includeTimestamp: true,
    });

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.program.shortName.replace(/\s+/g, '_')}_Application.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!application) {
    return (
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        variant="secondary"
        size="md"
        className="w-full mt-4"
      >
        {isGenerating ? (
          <>
            <Clock className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Pre-fill Application
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-success/10 to-primary-100 rounded-lg p-4 border border-success/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <h4 className="text-body-sm font-semibold text-neutral-900">
              Application Pre-filled!
            </h4>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-body-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-body-xs text-neutral-600 mb-1">Completion</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${application.completionPercentage}%` }}
                />
              </div>
              <span className="text-body-sm font-semibold text-neutral-900">
                {application.completionPercentage}%
              </span>
            </div>
          </div>

          <div>
            <p className="text-body-xs text-neutral-600 mb-1">Time Saved</p>
            <p className="text-body-sm font-bold text-success">
              {application.timeSavings.savedMinutes} min
              <span className="text-body-xs text-neutral-600 font-normal ml-1">
                ({application.timeSavings.savedPercentage}%)
              </span>
            </p>
          </div>
        </div>

        {/* Details Section (Collapsible) */}
        {showDetails && (
          <div className="space-y-3 pt-3 border-t border-neutral-200">
            {/* Pre-filled Fields */}
            <div>
              <p className="text-body-sm font-medium text-neutral-900 mb-2">
                ✅ {Object.keys(application.formData).length} fields pre-filled
              </p>
              <div className="bg-white rounded p-2 text-body-xs text-neutral-700 max-h-32 overflow-y-auto">
                {Object.entries(application.formData)
                  .slice(0, 8)
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="font-medium">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-neutral-600">{String(value)}</span>
                    </div>
                  ))}
                {Object.keys(application.formData).length > 8 && (
                  <p className="text-neutral-500 italic pt-1">
                    ...and {Object.keys(application.formData).length - 8} more fields
                  </p>
                )}
              </div>
            </div>

            {/* Missing Fields Warning */}
            {application.missingFields.length > 0 && (
              <div className="bg-warning/10 border border-warning/30 rounded p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-warning mt-0.5" />
                  <div className="flex-1">
                    <p className="text-body-sm font-medium text-neutral-900 mb-1">
                      ⚠️ {application.missingFields.length} field(s) need manual entry
                    </p>
                    <ul className="text-body-xs text-neutral-700 list-disc list-inside space-y-0.5">
                      {application.missingFields.slice(0, 5).map((field) => (
                        <li key={field.fieldId}>
                          {field.label}
                          {field.reason === 'sensitive' && (
                            <span className="text-warning ml-1">(sensitive data)</span>
                          )}
                          {field.reason === 'requires_signature' && (
                            <span className="text-neutral-600 ml-1">(signature required)</span>
                          )}
                        </li>
                      ))}
                      {application.missingFields.length > 5 && (
                        <li className="text-neutral-500">
                          ...and {application.missingFields.length - 5} more
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          variant="primary"
          size="md"
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Pre-filled Application
        </Button>
      </div>

      {/* Time Savings Highlight */}
      <div className="text-center p-3 bg-neutral-50 rounded-lg">
        <p className="text-body-sm text-neutral-700">
          <span className="font-semibold text-primary-700">
            {application.timeSavings.manual} min
          </span>
          {' manual '}→{' '}
          <span className="font-semibold text-success">
            {application.timeSavings.prefill} min
          </span>
          {' with pre-fill'}
        </p>
      </div>
    </div>
  );
}
