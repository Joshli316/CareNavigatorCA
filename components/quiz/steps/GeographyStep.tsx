'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/shared/Input';
import { Select } from '@/components/shared/Select';
import { GeographyData } from '@/types/quiz';

interface GeographyStepProps {
  data: GeographyData;
  onChange: (data: GeographyData) => void;
  onValidate: (isValid: boolean) => void;
}

const US_STATES = [
  { value: '', label: 'Select a state' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

export function GeographyStep({ data, onChange, onValidate }: GeographyStepProps) {
  const [formData, setFormData] = useState<GeographyData>(data);

  useEffect(() => {
    // Validate on every change
    const isValid =
      formData.state !== '' &&
      formData.county.trim() !== '' &&
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
