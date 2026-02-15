'use client';

import { ReactNode, useState } from 'react';

interface ExpandableProps {
  children: ReactNode;
  trigger?: ReactNode;
  defaultExpanded?: boolean;
  expandText?: string;
  collapseText?: string;
}

export function Expandable({
  children,
  trigger,
  defaultExpanded = false,
  expandText = 'Show Details',
  collapseText = 'Hide Details',
}: ExpandableProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div>
      {trigger ? (
        <div onClick={() => setIsExpanded(!isExpanded)}>{trigger}</div>
      ) : (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-3 text-xs tracking-wide text-gray-500 hover:text-gray-700 transition-colors uppercase"
        >
          <span>{isExpanded ? collapseText : expandText}</span>
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      {isExpanded && children}
    </div>
  );
}
