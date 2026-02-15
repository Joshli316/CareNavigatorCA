'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTracker, STATUS_CONFIG, STATUS_ORDER, ApplicationStatus } from '@/lib/context/TrackerContext';

interface TrackerBadgeProps {
  programId: string;
}

export function TrackerBadge({ programId }: TrackerBadgeProps) {
  const { getStatus, setStatus } = useTracker();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const status = getStatus(programId);
  const config = STATUS_CONFIG[status];

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${config.bg} ${config.color} hover:opacity-80`}
      >
        {config.label}
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[150px]">
          {STATUS_ORDER.map(s => {
            const c = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => { setStatus(programId, s); setIsOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2 ${s === status ? 'font-semibold' : ''}`}
              >
                <span className={`w-2 h-2 rounded-full ${c.bg} border ${s === status ? 'border-current' : 'border-transparent'}`} style={{ backgroundColor: s === 'not_started' ? '#d1d5db' : s === 'gathering_docs' ? '#fbbf24' : s === 'applied' ? '#3b82f6' : s === 'in_review' ? '#a855f7' : s === 'approved' ? '#22c55e' : '#ef4444' }} />
                <span className={c.color}>{c.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
