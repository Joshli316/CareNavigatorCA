'use client';

import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableProps {
  children: ReactNode;
  trigger?: ReactNode;
  defaultExpanded?: boolean;
  expandText?: string;
  collapseText?: string;
}

/**
 * Reusable expand/collapse component
 * Consolidates duplicate toggle logic from BenefitCard and PrefillButton
 */
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
      {/* Custom trigger or default button */}
      {trigger ? (
        <div onClick={() => setIsExpanded(!isExpanded)}>{trigger}</div>
      ) : (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center space-x-2 py-2 text-body text-primary-500 hover:text-primary-600 transition-colors"
        >
          <span>{isExpanded ? collapseText : expandText}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Expandable content */}
      {isExpanded && children}
    </div>
  );
}
