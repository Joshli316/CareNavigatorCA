'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { trackEvent } from '@/lib/utils/analytics';

export type ApplicationStatus = 'not_started' | 'gathering_docs' | 'applied' | 'in_review' | 'approved' | 'denied';

export interface TrackedApplication {
  programId: string;
  status: ApplicationStatus;
  updatedAt: number;
  notes?: string;
}

interface TrackerContextValue {
  applications: Record<string, TrackedApplication>;
  getStatus: (programId: string) => ApplicationStatus;
  setStatus: (programId: string, status: ApplicationStatus) => void;
  setNotes: (programId: string, notes: string) => void;
  counts: Record<ApplicationStatus, number>;
}

const STORAGE_KEY = 'cn_tracker';

const STATUS_ORDER: ApplicationStatus[] = ['not_started', 'gathering_docs', 'applied', 'in_review', 'approved', 'denied'];

function loadTracker(): Record<string, TrackedApplication> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveTracker(data: Record<string, TrackedApplication>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const TrackerContext = createContext<TrackerContextValue | undefined>(undefined);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Record<string, TrackedApplication>>(loadTracker);

  const getStatus = useCallback((programId: string): ApplicationStatus => {
    return applications[programId]?.status || 'not_started';
  }, [applications]);

  const setStatus = useCallback((programId: string, status: ApplicationStatus) => {
    setApplications(prev => {
      const existing = prev[programId];
      const next = {
        ...prev,
        [programId]: { programId, status, updatedAt: Date.now(), notes: existing?.notes },
      };
      saveTracker(next);
      trackEvent('tracker_update', { programId, status });
      return next;
    });
  }, []);

  const setNotes = useCallback((programId: string, notes: string) => {
    setApplications(prev => {
      const existing = prev[programId];
      const next = {
        ...prev,
        [programId]: {
          programId,
          status: existing?.status || 'not_started',
          updatedAt: existing?.updatedAt || Date.now(),
          notes,
        },
      };
      saveTracker(next);
      return next;
    });
  }, []);

  const counts = Object.values(applications).reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, { not_started: 0, gathering_docs: 0, applied: 0, in_review: 0, approved: 0, denied: 0 } as Record<ApplicationStatus, number>);

  return (
    <TrackerContext.Provider value={{ applications, getStatus, setStatus, setNotes, counts }}>
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context) throw new Error('useTracker must be used within TrackerProvider');
  return context;
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  not_started: { label: 'Not Started', color: 'text-gray-500', bg: 'bg-gray-100' },
  gathering_docs: { label: 'Gathering Docs', color: 'text-amber-700', bg: 'bg-amber-50' },
  applied: { label: 'Applied', color: 'text-blue-700', bg: 'bg-blue-50' },
  in_review: { label: 'In Review', color: 'text-purple-700', bg: 'bg-purple-50' },
  approved: { label: 'Approved', color: 'text-green-700', bg: 'bg-green-50' },
  denied: { label: 'Denied', color: 'text-red-700', bg: 'bg-red-50' },
};

export { STATUS_ORDER };
