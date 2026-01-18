'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/shared/Input';
import { Checkbox } from '@/components/shared/Checkbox';
import { FinancialData, IncomeType } from '@/types/quiz';

interface FinancialStepProps {
  data: FinancialData;
  onChange: (data: FinancialData) => void;
  onValidate: (isValid: boolean) => void;
}

export function FinancialStep({ data, onChange, onValidate }: FinancialStepProps) {
  const [formData, setFormData] = useState<FinancialData>(data);

  useEffect(() => {
    // Valid if income and assets are specified
    const isValid = formData.monthlyIncome >= 0 && formData.countableAssets >= 0;
    onValidate(isValid);
  }, [formData]); // onValidate removed to prevent infinite re-renders

  const handleChange = (field: keyof FinancialData, value: number | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  const handleIncomeType = (type: IncomeType, checked: boolean) => {
    const types = checked
      ? [...formData.incomeType, type]
      : formData.incomeType.filter((t) => t !== type);
    const newData = { ...formData, incomeType: types };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-lg text-neutral-900 mb-2">Financial Information</h2>
        <p className="text-body text-neutral-600">
          Most benefits have income and asset limits. This information helps determine your eligibility.
        </p>
      </div>

      <Input
        label="Monthly household income (gross, before taxes)"
        type="number"
        value={formData.monthlyIncome || ''}
        onChange={(e) => handleChange('monthlyIncome', parseFloat(e.target.value) || 0)}
        min={0}
        step={0.01}
        placeholder="0.00"
        helperText="Include all sources of income for everyone in your household"
      />

      <div className="space-y-3">
        <p className="text-body-sm font-medium text-neutral-700">
          Income sources (select all that apply):
        </p>
        <Checkbox
          label="Wages/Employment"
          checked={formData.incomeType.includes(IncomeType.WAGES)}
          onChange={(e) => handleIncomeType(IncomeType.WAGES, e.target.checked)}
        />
        <Checkbox
          label="SSI"
          checked={formData.incomeType.includes(IncomeType.SSI)}
          onChange={(e) => handleIncomeType(IncomeType.SSI, e.target.checked)}
        />
        <Checkbox
          label="SSDI"
          checked={formData.incomeType.includes(IncomeType.SSDI)}
          onChange={(e) => handleIncomeType(IncomeType.SSDI, e.target.checked)}
        />
        <Checkbox
          label="Retirement/Pension"
          checked={formData.incomeType.includes(IncomeType.RETIREMENT)}
          onChange={(e) => handleIncomeType(IncomeType.RETIREMENT, e.target.checked)}
        />
        <Checkbox
          label="Other"
          checked={formData.incomeType.includes(IncomeType.OTHER)}
          onChange={(e) => handleIncomeType(IncomeType.OTHER, e.target.checked)}
        />
      </div>

      <Input
        label="Countable assets (savings, checking accounts, stocks)"
        type="number"
        value={formData.countableAssets || ''}
        onChange={(e) => handleChange('countableAssets', parseFloat(e.target.value) || 0)}
        min={0}
        step={0.01}
        placeholder="0.00"
        helperText="Do not include your primary home or one vehicle"
      />

      <div className="pt-4 border-t border-neutral-200 space-y-4">
        <p className="text-body-sm font-medium text-neutral-700">
          Property ownership:
        </p>

        <Checkbox
          label="I own a car"
          checked={formData.ownsCar}
          onChange={(e) => handleChange('ownsCar', e.target.checked)}
        />

        {formData.ownsCar && (
          <div className="ml-8">
            <Input
              label="Estimated car value"
              type="number"
              value={formData.carValue || ''}
              onChange={(e) => handleChange('carValue', parseFloat(e.target.value) || 0)}
              min={0}
              step={100}
              placeholder="0.00"
            />
          </div>
        )}

        <Checkbox
          label="I own my home"
          checked={formData.ownsHome}
          onChange={(e) => handleChange('ownsHome', e.target.checked)}
        />

        {formData.ownsHome && (
          <div className="ml-8">
            <Input
              label="Estimated home value"
              type="number"
              value={formData.homeValue || ''}
              onChange={(e) => handleChange('homeValue', parseFloat(e.target.value) || 0)}
              min={0}
              step={1000}
              placeholder="0.00"
              helperText="Primary homes are often exempt from asset limits"
            />
          </div>
        )}
      </div>
    </div>
  );
}
