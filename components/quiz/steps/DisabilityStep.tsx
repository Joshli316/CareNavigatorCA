'use client';

import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/shared/Checkbox';
import { DisabilityData, DisabilityType } from '@/types/quiz';

interface DisabilityStepProps {
  data: DisabilityData;
  onChange: (data: DisabilityData) => void;
  onValidate: (isValid: boolean) => void;
}

export function DisabilityStep({ data, onChange, onValidate }: DisabilityStepProps) {
  const [formData, setFormData] = useState<DisabilityData>(data);

  useEffect(() => {
    // Always valid - this step just gathers information
    onValidate(true);
  }, []); // Empty deps - validation is always true and doesn't depend on formData

  const handleCheckbox = (field: keyof DisabilityData, checked: boolean) => {
    const newData = { ...formData, [field]: checked };
    setFormData(newData);
    onChange(newData);
  };

  const handleDisabilityType = (type: DisabilityType, checked: boolean) => {
    const types = checked
      ? [...formData.disabilityType, type]
      : formData.disabilityType.filter((t) => t !== type);
    const newData = { ...formData, disabilityType: types };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-lg text-neutral-900 mb-2">Disability Information</h2>
        <p className="text-body text-neutral-600">
          Many benefits are specifically for people with disabilities. This helps us match you with the right programs.
        </p>
      </div>

      <Checkbox
        label="I have a disability"
        description="This includes physical, cognitive, mental health, or chronic conditions that affect daily activities"
        checked={formData.hasDisability}
        onChange={(e) => handleCheckbox('hasDisability', e.target.checked)}
      />

      {formData.hasDisability && (
        <div className="ml-8 space-y-4 border-l-2 border-primary-200 pl-6">
          <p className="text-body-sm font-medium text-neutral-700">
            Select all that apply:
          </p>
          <div className="space-y-3">
            <Checkbox
              label="Physical disability"
              checked={formData.disabilityType.includes(DisabilityType.PHYSICAL)}
              onChange={(e) => handleDisabilityType(DisabilityType.PHYSICAL, e.target.checked)}
            />
            <Checkbox
              label="Cognitive or intellectual disability"
              checked={formData.disabilityType.includes(DisabilityType.COGNITIVE)}
              onChange={(e) => handleDisabilityType(DisabilityType.COGNITIVE, e.target.checked)}
            />
            <Checkbox
              label="Mental health condition"
              checked={formData.disabilityType.includes(DisabilityType.MENTAL_HEALTH)}
              onChange={(e) => handleDisabilityType(DisabilityType.MENTAL_HEALTH, e.target.checked)}
            />
            <Checkbox
              label="Chronic illness"
              checked={formData.disabilityType.includes(DisabilityType.CHRONIC_ILLNESS)}
              onChange={(e) => handleDisabilityType(DisabilityType.CHRONIC_ILLNESS, e.target.checked)}
            />
            <Checkbox
              label="Developmental disability"
              checked={formData.disabilityType.includes(DisabilityType.DEVELOPMENTAL)}
              onChange={(e) => handleDisabilityType(DisabilityType.DEVELOPMENTAL, e.target.checked)}
            />
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-neutral-200 space-y-4">
        <p className="text-body-sm font-medium text-neutral-700">
          Current benefits (if any):
        </p>
        <Checkbox
          label="I currently receive SSI"
          description="Supplemental Security Income"
          checked={formData.receivingSSI}
          onChange={(e) => handleCheckbox('receivingSSI', e.target.checked)}
        />
        <Checkbox
          label="I currently receive SSDI"
          description="Social Security Disability Insurance"
          checked={formData.receivingSSDI}
          onChange={(e) => handleCheckbox('receivingSSDI', e.target.checked)}
        />
        <Checkbox
          label="I have an SSA disability determination"
          description="Social Security Administration has officially determined I am disabled"
          checked={formData.hasSSADetermination}
          onChange={(e) => handleCheckbox('hasSSADetermination', e.target.checked)}
        />
      </div>
    </div>
  );
}
