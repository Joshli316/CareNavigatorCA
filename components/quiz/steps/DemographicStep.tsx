'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { Checkbox } from '@/components/shared/Checkbox';
import { DemographicData, AssistanceLevel } from '@/types/quiz';

interface DemographicStepProps {
  data: DemographicData;
  onChange: (data: DemographicData) => void;
  onValidate: (isValid: boolean) => void;
}

const ASSISTANCE_OPTIONS = [
  { value: AssistanceLevel.NONE, label: 'No assistance needed' },
  { value: AssistanceLevel.SOME, label: 'Some assistance (cooking, cleaning, managing medications)' },
  { value: AssistanceLevel.EXTENSIVE, label: 'Extensive assistance (bathing, dressing, eating)' },
];

export function DemographicStep({ data, onChange, onValidate }: DemographicStepProps) {
  const [formData, setFormData] = useState<DemographicData>(data);

  useEffect(() => {
    // Valid if age and household size are provided
    const isValid = formData.age > 0 && formData.householdSize > 0;
    onValidate(isValid);
  }, [formData]); // onValidate removed to prevent infinite re-renders

  const handleChange = (field: keyof DemographicData, value: number | boolean | string) => {
    const newData = { ...formData, [field]: value as any };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-lg text-neutral-900 mb-2">Household Information</h2>
        <p className="text-body text-neutral-600">
          Household size and age affect eligibility for many programs.
        </p>
      </div>

      <Input
        label="Your age"
        type="number"
        value={formData.age || ''}
        onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
        min={0}
        max={120}
        placeholder="0"
      />

      <Input
        label="Household size (including yourself)"
        type="number"
        value={formData.householdSize || ''}
        onChange={(e) => handleChange('householdSize', parseInt(e.target.value) || 1)}
        min={1}
        placeholder="1"
        helperText="Include everyone who lives with you and shares expenses"
      />

      <Checkbox
        label="I have children under 18"
        checked={formData.hasChildren}
        onChange={(e) => handleChange('hasChildren', e.target.checked)}
      />

      {formData.hasChildren && (
        <div className="ml-8">
          <Input
            label="Children's ages (comma-separated)"
            type="text"
            value={formData.childrenAges.join(', ')}
            onChange={(e) => {
              const ages = e.target.value
                .split(',')
                .map((a) => parseInt(a.trim()))
                .filter((a) => !isNaN(a));
              handleChange('childrenAges', 0);
              const newData = { ...formData, childrenAges: ages };
              setFormData(newData);
              onChange(newData);
            }}
            placeholder="e.g., 5, 8, 12"
          />
        </div>
      )}

      <Checkbox
        label="I am a veteran or active duty military"
        checked={formData.isVeteran}
        onChange={(e) => handleChange('isVeteran', e.target.checked)}
      />

      <Select
        label="Level of assistance needed with daily activities"
        options={ASSISTANCE_OPTIONS}
        value={formData.needsAssistance}
        onChange={(e) => handleChange('needsAssistance', e.target.value)}
        helperText="Some healthcare programs require you to need help with activities like cooking, bathing, or managing medications"
      />
    </div>
  );
}
