'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  UploadedDocument,
  DocumentUploadType,
  ExtractedProfile,
  Grant,
  GrantApplication,
} from '@/types/grant';
import { MOCK_GRANTS } from '@/lib/data/mock-grants';
import { trackEvent } from '@/lib/utils/analytics';

interface GrantContextType {
  // Documents
  documents: UploadedDocument[];
  uploadDocument: (type: DocumentUploadType, file: File) => void;
  removeDocument: (type: DocumentUploadType) => void;
  getDocumentByType: (type: DocumentUploadType) => UploadedDocument | undefined;

  // Profile
  profile: ExtractedProfile | null;
  setProfile: (profile: ExtractedProfile) => void;
  updateProfileField: (field: keyof ExtractedProfile, value: unknown) => void;

  // Extraction
  isExtracting: boolean;
  extractionProgress: number;
  startExtraction: () => Promise<void>;

  // Grants
  matchedGrants: Grant[];
  applications: GrantApplication[];
  generateApplication: (grantId: string) => void;

  // Navigation
  currentStep: 'upload' | 'review' | 'results';
  setCurrentStep: (step: 'upload' | 'review' | 'results') => void;

  // Reset
  resetAll: () => void;
}

const GrantContext = createContext<GrantContextType | undefined>(undefined);

export function GrantProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [profile, setProfileState] = useState<ExtractedProfile | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [matchedGrants, setMatchedGrants] = useState<Grant[]>([]);
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'results'>('upload');

  const uploadDocument = useCallback((type: DocumentUploadType, file: File) => {
    trackEvent('grant_upload');
    const newDoc: UploadedDocument = {
      id: `${type}-${Date.now()}`,
      type,
      file,
      fileName: file.name,
      status: 'complete', // In real app, this would go through uploading -> processing -> complete
      confidence: 0.95,
    };

    setDocuments((prev) => {
      const filtered = prev.filter((d) => d.type !== type);
      return [...filtered, newDoc];
    });
  }, []);

  const removeDocument = useCallback((type: DocumentUploadType) => {
    setDocuments((prev) => prev.filter((d) => d.type !== type));
  }, []);

  const getDocumentByType = useCallback(
    (type: DocumentUploadType) => {
      return documents.find((d) => d.type === type);
    },
    [documents]
  );

  const setProfile = useCallback((newProfile: ExtractedProfile) => {
    setProfileState(newProfile);
  }, []);

  const updateProfileField = useCallback((field: keyof ExtractedProfile, value: unknown) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  }, []);

  // Simulated extraction - in real app, this would call Claude Vision API
  const startExtraction = useCallback(async () => {
    setIsExtracting(true);
    setExtractionProgress(0);

    // Simulate extraction progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setExtractionProgress(i);
    }

    // Generate mock extracted profile
    const mockProfile: ExtractedProfile = {
      fullName: 'Maria Santos',
      dateOfBirth: '1984-04-15',
      address: '123 Main Street',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      monthlyIncome: 2400,
      employmentStatus: 'employed',
      householdSize: 4,
      dependents: 2,
      hasDisability: false,
      isVeteran: false,
      isSenior: false,
      extractionConfidence: 0.94,
      documentsProcessed: documents.map((d) => d.type),
    };

    setProfileState(mockProfile);

    // Run matching against grants
    const grants = matchGrantsToProfile(mockProfile);
    setMatchedGrants(grants);

    setIsExtracting(false);
    setCurrentStep('review');
  }, [documents]);

  const generateApplication = useCallback(
    (grantId: string) => {
      const grant = matchedGrants.find((g) => g.id === grantId);
      if (!grant) return;

      const app: GrantApplication = {
        id: `app-${Date.now()}`,
        grantId,
        grant,
        status: 'in_progress',
      };

      setApplications((prev) => [...prev, app]);

      // Simulate PDF generation
      setTimeout(() => {
        setApplications((prev) =>
          prev.map((a) =>
            a.id === app.id
              ? { ...a, status: 'submitted', pdfUrl: `/mock-pdf/${grantId}.pdf` }
              : a
          )
        );
      }, 1500);
    },
    [matchedGrants]
  );

  const resetAll = useCallback(() => {
    setDocuments([]);
    setProfileState(null);
    setMatchedGrants([]);
    setApplications([]);
    setCurrentStep('upload');
    setExtractionProgress(0);
  }, []);

  return (
    <GrantContext.Provider
      value={{
        documents,
        uploadDocument,
        removeDocument,
        getDocumentByType,
        profile,
        setProfile,
        updateProfileField,
        isExtracting,
        extractionProgress,
        startExtraction,
        matchedGrants,
        applications,
        generateApplication,
        currentStep,
        setCurrentStep,
        resetAll,
      }}
    >
      {children}
    </GrantContext.Provider>
  );
}

export function useGrant() {
  const context = useContext(GrantContext);
  if (!context) {
    throw new Error('useGrant must be used within a GrantProvider');
  }
  return context;
}

// Helper function to match grants based on profile
function matchGrantsToProfile(profile: ExtractedProfile): Grant[] {
  return MOCK_GRANTS.map((grant) => {
    let score = 50; // Base score
    const matchReasons: string[] = [];
    const failReasons: string[] = [];

    // Income-based matching
    if (profile.monthlyIncome < 3000) {
      score += 20;
      matchReasons.push('Income within eligible range');
    }

    // Household size
    if (profile.householdSize >= 3) {
      score += 10;
      matchReasons.push('Household size meets requirements');
    }

    // State match (Arizona-based for demo)
    if (profile.state === 'AZ') {
      score += 15;
      matchReasons.push('Located in service area');
    }

    // Disability programs
    if (grant.category === 'healthcare' && profile.hasDisability) {
      score += 20;
      matchReasons.push('Disability status qualifies');
    }

    // Random variance for demo
    score += Math.floor(Math.random() * 15) - 5;
    score = Math.min(100, Math.max(0, score));

    // Determine confidence
    let confidence: 'likely' | 'possible' | 'unlikely';
    if (score >= 70) {
      confidence = 'likely';
    } else if (score >= 40) {
      confidence = 'possible';
    } else {
      confidence = 'unlikely';
      failReasons.push('May not meet all eligibility criteria');
    }

    return {
      ...grant,
      eligibilityScore: score,
      confidence,
      matchReasons: matchReasons.length > 0 ? matchReasons : ['Basic eligibility met'],
      failReasons,
    };
  }).sort((a, b) => b.eligibilityScore - a.eligibilityScore);
}
