'use client';

import { useState, useMemo } from 'react';
import { EligibilityResult } from '@/types/benefit';
import { useTracker, STATUS_CONFIG, STATUS_ORDER, ApplicationStatus } from '@/lib/context/TrackerContext';
import { formatCurrency } from '@/lib/utils/format';

interface FollowUpTrackerProps {
  results: EligibilityResult[];
}

const STATUS_STEPS: ApplicationStatus[] = ['gathering_docs', 'applied', 'in_review'];
const TERMINAL_STATUSES: ApplicationStatus[] = ['approved', 'denied'];

const STEP_LABELS: Record<ApplicationStatus, string> = {
  not_started: 'Not Started',
  gathering_docs: 'Gathering Docs',
  applied: 'Applied',
  in_review: 'In Review',
  approved: 'Approved',
  denied: 'Denied',
};

const NEXT_ACTION_LABELS: Record<ApplicationStatus, string> = {
  not_started: 'Start tracking',
  gathering_docs: "I've applied",
  applied: "It's under review",
  in_review: 'Got approved!',
  approved: '',
  denied: '',
};

function StatusStepper({ currentStatus }: { currentStatus: ApplicationStatus }) {
  const allSteps: ApplicationStatus[] = ['gathering_docs', 'applied', 'in_review', 'approved'];
  const currentIdx = allSteps.indexOf(currentStatus);
  const isDenied = currentStatus === 'denied';

  return (
    <div className="flex items-center gap-0 w-full overflow-x-auto py-2">
      {allSteps.map((step, i) => {
        const isActive = step === currentStatus;
        const isComplete = !isDenied && currentIdx > i;
        const isFuture = !isActive && !isComplete;
        const isDeniedStep = isDenied && step === 'approved';

        let circleClass = 'bg-gray-200 text-gray-400';
        if (isComplete) circleClass = 'bg-accent-600 text-white';
        if (isActive && step === 'approved') circleClass = 'bg-green-500 text-white';
        else if (isActive) circleClass = 'bg-accent-600 text-white ring-2 ring-accent-200';
        if (isDeniedStep) circleClass = 'bg-red-500 text-white';

        let lineClass = 'bg-gray-200';
        if (isComplete || (isActive && i > 0)) lineClass = 'bg-accent-600';

        return (
          <div key={step} className="flex items-center flex-1 min-w-0">
            {i > 0 && (
              <div className={`h-0.5 flex-1 ${lineClass} transition-colors`} />
            )}
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${circleClass}`}>
                {isComplete ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : isDeniedStep ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-semibold">{i + 1}</span>
                )}
              </div>
              <span className={`text-[10px] mt-1 whitespace-nowrap ${isActive || isComplete ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                {isDeniedStep ? 'Denied' : STEP_LABELS[step]}
              </span>
            </div>
            {i < allSteps.length - 1 && i > 0 ? null : null}
          </div>
        );
      })}
    </div>
  );
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ApplicationCard({
  result,
  status,
  updatedAt,
  notes,
  onSetStatus,
  onSetNotes,
}: {
  result: EligibilityResult;
  status: ApplicationStatus;
  updatedAt: number;
  notes?: string;
  onSetStatus: (status: ApplicationStatus) => void;
  onSetNotes: (notes: string) => void;
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [noteDraft, setNoteDraft] = useState(notes || '');

  const isTerminal = status === 'approved' || status === 'denied';
  const config = STATUS_CONFIG[status];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-subtle">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">{result.program.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {result.estimatedMonthlyBenefit > 0
              ? `${formatCurrency(result.estimatedMonthlyBenefit)}/mo`
              : 'Value varies'}
          </p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${config.bg} ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Status stepper */}
      <StatusStepper currentStatus={status} />

      {/* Action buttons */}
      {!isTerminal && (
        <div className="flex flex-wrap gap-2 mt-3">
          {status === 'gathering_docs' && (
            <button
              onClick={() => onSetStatus('applied')}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
            >
              {NEXT_ACTION_LABELS.gathering_docs}
            </button>
          )}
          {status === 'applied' && (
            <button
              onClick={() => onSetStatus('in_review')}
              className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg hover:bg-purple-100 transition-colors"
            >
              {NEXT_ACTION_LABELS.applied}
            </button>
          )}
          {status === 'in_review' && (
            <>
              <button
                onClick={() => onSetStatus('approved')}
                className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100 transition-colors"
              >
                Got approved!
              </button>
              <button
                onClick={() => onSetStatus('denied')}
                className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
              >
                Got denied
              </button>
            </>
          )}
        </div>
      )}

      {/* Last updated + notes toggle */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-[11px] text-gray-400">
          Updated {formatDate(updatedAt)}
        </span>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="text-[11px] text-accent-600 hover:text-accent-700 font-medium flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {notes ? 'Edit notes' : 'Add notes'}
        </button>
      </div>

      {/* Notes field */}
      {showNotes && (
        <div className="mt-3">
          <textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="e.g., Submitted on Monday, waiting for callback..."
            className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-accent-300 resize-none"
            rows={2}
          />
          <div className="flex justify-end gap-2 mt-1.5">
            <button
              onClick={() => { setShowNotes(false); setNoteDraft(notes || ''); }}
              className="text-[11px] text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => { onSetNotes(noteDraft); setShowNotes(false); }}
              className="text-[11px] text-accent-600 font-medium hover:text-accent-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FollowUpTracker({ results }: FollowUpTrackerProps) {
  const { applications, getStatus, setStatus, setNotes } = useTracker();
  const [showUntracked, setShowUntracked] = useState(false);

  const { tracked, untracked } = useMemo(() => {
    const tracked: EligibilityResult[] = [];
    const untracked: EligibilityResult[] = [];

    for (const r of results) {
      const status = getStatus(r.programId);
      if (status !== 'not_started') {
        tracked.push(r);
      } else {
        untracked.push(r);
      }
    }

    return { tracked, untracked };
  }, [results, getStatus, applications]);

  const summary = useMemo(() => {
    const approved = tracked.filter(r => getStatus(r.programId) === 'approved');
    const denied = tracked.filter(r => getStatus(r.programId) === 'denied');
    const approvedValue = approved.reduce((sum, r) => sum + (r.estimatedMonthlyBenefit || 0), 0);

    return { approved, denied, approvedValue, total: tracked.length };
  }, [tracked, getStatus, applications]);

  // Don't render at all if there are no results
  if (results.length === 0) return null;

  const hasTracked = tracked.length > 0;
  const hasOutcomes = summary.approved.length > 0 || summary.denied.length > 0;

  return (
    <section className="mt-10 mb-10 space-y-5" aria-label="Follow-Up Tracker">
      {/* Section header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
          <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Track Your Applications
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {hasTracked
            ? `Tracking ${tracked.length} application${tracked.length !== 1 ? 's' : ''}. Update your status as you progress.`
            : 'Keep track of where you are in the application process.'}
        </p>
      </div>

      {/* Outcome summary */}
      {hasOutcomes && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-subtle">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3">
            <span className="text-sm text-gray-700">
              <span className="font-semibold text-green-700">{summary.approved.length}</span> approved
              {summary.denied.length > 0 && (
                <>, <span className="font-semibold text-red-600">{summary.denied.length}</span> denied</>
              )}
              {' '}out of {summary.total} tracked
            </span>
            {summary.approvedValue > 0 && (
              <span className="text-sm font-semibold text-green-700">
                {formatCurrency(summary.approvedValue)}/mo in confirmed benefits
              </span>
            )}
          </div>
          {summary.approved.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {summary.approved.map(r => (
                <span key={r.programId} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {r.program.shortName || r.program.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prompt card — shown when nothing tracked yet */}
      {!hasTracked && (
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-100 mb-3">
            <svg className="w-6 h-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Start tracking your applications!</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Pick a program below and mark your progress. We'll help you stay on track.
          </p>
        </div>
      )}

      {/* Tracked application cards */}
      {hasTracked && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracked.map(r => {
            const app = applications[r.programId];
            return (
              <ApplicationCard
                key={r.programId}
                result={r}
                status={app.status}
                updatedAt={app.updatedAt}
                notes={app.notes}
                onSetStatus={(s) => setStatus(r.programId, s)}
                onSetNotes={(n) => setNotes(r.programId, n)}
              />
            );
          })}
        </div>
      )}

      {/* Untracked programs — collapsible */}
      {untracked.length > 0 && (
        <div>
          <button
            onClick={() => setShowUntracked(!showUntracked)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showUntracked ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {untracked.length} program{untracked.length !== 1 ? 's' : ''} not yet tracked
          </button>

          {showUntracked && (
            <div className="mt-3 space-y-2">
              {untracked.map(r => (
                <div
                  key={r.programId}
                  className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.program.name}</p>
                    <p className="text-xs text-gray-500">
                      {r.estimatedMonthlyBenefit > 0
                        ? `${formatCurrency(r.estimatedMonthlyBenefit)}/mo`
                        : 'Value varies'}
                      {' \u00B7 '}
                      {r.probability}% match
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus(r.programId, 'gathering_docs')}
                    className="flex-shrink-0 px-3 py-1.5 bg-accent-50 text-accent-700 text-xs font-medium rounded-lg hover:bg-accent-100 transition-colors"
                  >
                    Start tracking
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
