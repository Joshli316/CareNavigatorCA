'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { GeographyData } from '@/types/quiz';
import { US_STATES } from '@/lib/constants/states';

interface GeographyStepProps {
  data: GeographyData;
  onChange: (data: GeographyData) => void;
  onValidate: (isValid: boolean) => void;
}

export function GeographyStep({ data, onChange, onValidate }: GeographyStepProps) {
  const [formData, setFormData] = useState<GeographyData>(data);

  useEffect(() => {
    // Validate on every change
    const isValid =
      formData.state !== '' &&
      formData.county.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.zipCode.trim().length === 5 &&
      formData.residencyMonths > 0;
    onValidate(isValid);
  }, [formData]); // onValidate removed to prevent infinite re-renders

  const handleChange = (field: keyof GeographyData, value: string | number) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-lg text-neutral-900 mb-2">Where do you live?</h2>
        <p className="text-body text-neutral-600">
          Many benefits are state-specific. Knowing your location helps us find programs available to you.
        </p>
      </div>

      <Select
        label="State"
        options={US_STATES}
        value={formData.state}
        onChange={(e) => handleChange('state', e.target.value)}
        helperText="Select your current state of residence"
      />

      <Input
        label="County"
        type="text"
        value={formData.county}
        onChange={(e) => handleChange('county', e.target.value)}
        placeholder="e.g., Harris County"
        helperText="Some local programs are county-specific"
      />

      <Input
        label="City"
        type="text"
        value={formData.city}
        onChange={(e) => handleChange('city', e.target.value)}
        placeholder="e.g., Houston"
        helperText="Helps match you with local organizations and services"
      />

      <Input
        label="ZIP Code"
        type="text"
        value={formData.zipCode}
        onChange={(e) => handleChange('zipCode', e.target.value)}
        placeholder="12345"
        maxLength={5}
        pattern="[0-9]{5}"
      />

      <Input
        label="How many months have you lived in this state?"
        type="number"
        value={formData.residencyMonths || ''}
        onChange={(e) => handleChange('residencyMonths', parseInt(e.target.value) || 0)}
        min={0}
        helperText="Some programs require a minimum residency period"
      />
    </div>
  );
}
