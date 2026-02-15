'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Lightbulb, Sparkles } from 'lucide-react';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'textarea' | 'radio' | 'checkbox';
  prefilled?: string;
  options?: string[];
  required?: boolean;
  aiHint: string;
  aiWarning?: string;
  section: string;
}

const SNAP_FIELDS: FormField[] = [
  // Section 1: Personal Information
  { id: 'fullName', label: 'Full Legal Name', type: 'text', prefilled: 'Maria Rodriguez', required: true, aiHint: 'Use your full legal name exactly as it appears on your Social Security card. Middle names are optional but recommended.', section: 'Personal Information' },
  { id: 'ssn', label: 'Social Security Number', type: 'text', prefilled: '***-**-4589', required: true, aiHint: 'Required for all household members applying. If you don\'t have an SSN, you can still apply — ask for an exemption form.', section: 'Personal Information' },
  { id: 'dob', label: 'Date of Birth', type: 'date', prefilled: '1991-03-15', required: true, aiHint: 'Your age (35) qualifies you for standard adult SNAP benefits. No age-related restrictions apply.', section: 'Personal Information' },
  { id: 'address', label: 'Street Address', type: 'text', prefilled: '4521 Elm Street, Apt 2B', required: true, aiHint: 'Must be your current physical address in Texas. P.O. boxes are not accepted as primary address.', section: 'Personal Information' },
  { id: 'city', label: 'City', type: 'text', prefilled: 'Dallas', required: true, aiHint: 'Dallas County residents are processed at the Dallas HHSC office on 8th Street.', section: 'Personal Information' },
  { id: 'zip', label: 'ZIP Code', type: 'text', prefilled: '75201', required: true, aiHint: 'Your ZIP code determines which local HHSC office processes your application.', section: 'Personal Information' },
  { id: 'phone', label: 'Phone Number', type: 'text', prefilled: '', required: false, aiHint: 'Providing a phone number speeds up processing. Caseworkers often call to verify information instead of sending letters, which can save 1-2 weeks.', aiWarning: 'Not providing a phone number may delay your application by 1-2 weeks.', section: 'Personal Information' },
  { id: 'email', label: 'Email Address', type: 'text', prefilled: '', required: false, aiHint: 'Optional but recommended. You can receive status updates and documents electronically.', section: 'Personal Information' },

  // Section 2: Household
  { id: 'householdSize', label: 'Total Household Members', type: 'select', prefilled: '3', options: ['1', '2', '3', '4', '5', '6', '7', '8+'], required: true, aiHint: 'Based on your quiz: household of 3. Include everyone who lives with you AND purchases/prepares food together. Roommates who buy their own food count separately.', section: 'Household Composition' },
  { id: 'householdMembers', label: 'List all household members (Name, Relationship, Age, SSN)', type: 'textarea', prefilled: 'Maria Rodriguez, Self, 35, ***-**-4589\nSofia Rodriguez, Daughter, 5, ***-**-7721\nCarlos Rodriguez, Son, 8, ***-**-3302', required: true, aiHint: 'List every person in your household. Children under 18 automatically qualify. Each member needs their own SSN or an exemption.', section: 'Household Composition' },
  { id: 'pregnantMember', label: 'Is anyone in the household pregnant?', type: 'radio', options: ['Yes', 'No'], prefilled: 'No', required: true, aiHint: 'Pregnant household members may qualify for expedited processing and higher benefit amounts.', section: 'Household Composition' },

  // Section 3: Income
  { id: 'grossIncome', label: 'Monthly Gross Income (before taxes)', type: 'text', prefilled: '$1,500', required: true, aiHint: 'From your quiz: $1,500/month. This is your GROSS income — before any deductions. Include wages, tips, self-employment, child support received, and any other regular income.', section: 'Income & Resources' },
  { id: 'incomeSource', label: 'Source of Income', type: 'select', prefilled: 'Part-time employment', options: ['Full-time employment', 'Part-time employment', 'Self-employment', 'Unemployment benefits', 'Social Security', 'SSI/SSDI', 'Child support', 'No income', 'Other'], required: true, aiHint: 'Select your primary income source. You can list additional sources below.', section: 'Income & Resources' },
  { id: 'otherIncome', label: 'Other Income Sources', type: 'textarea', prefilled: '', required: false, aiHint: 'Include: child support, alimony, VA benefits, rental income, interest, dividends. If none, leave blank. Underreporting income can result in penalties.', section: 'Income & Resources' },
  { id: 'assets', label: 'Total Countable Assets (bank accounts, stocks, bonds)', type: 'text', prefilled: '$0', required: true, aiHint: 'From your quiz: $0 in countable assets. Do NOT include: your home, one vehicle, retirement accounts (401k/IRA), or personal belongings. Texas has no asset test for most SNAP applicants.', section: 'Income & Resources' },

  // Section 4: Expenses
  { id: 'rent', label: 'Monthly Rent or Mortgage', type: 'text', prefilled: '', required: false, aiHint: 'Your housing costs are deducted from countable income, which INCREASES your SNAP benefit. Don\'t skip this — it could mean $100+ more per month.', aiWarning: 'Leaving rent blank could reduce your benefit by $100-200/month. Even if someone else pays, list what you contribute.', section: 'Monthly Expenses' },
  { id: 'utilities', label: 'Monthly Utilities', type: 'text', prefilled: '', required: false, aiHint: 'Texas uses the Standard Utility Allowance (SUA) of $567/month. If you pay ANY utility (electric, gas, water, phone), you automatically get this deduction. Just check "yes."', section: 'Monthly Expenses' },
  { id: 'childcare', label: 'Monthly Childcare Costs', type: 'text', prefilled: '', required: false, aiHint: 'With 2 children, childcare costs are fully deductible. This could significantly increase your benefit amount. Include daycare, after-school care, summer programs.', section: 'Monthly Expenses' },
  { id: 'medical', label: 'Monthly Medical Expenses (if disabled/elderly)', type: 'text', prefilled: '', required: false, aiHint: 'Since you indicated a disability: medical expenses over $35/month are deductible. Include prescriptions, doctor visits, medical equipment, transportation to appointments.', aiWarning: 'You reported a disability — documenting medical expenses could increase your benefit by $50-150/month.', section: 'Monthly Expenses' },

  // Section 5: Disability
  { id: 'disabilityStatus', label: 'Does anyone in the household have a disability?', type: 'radio', options: ['Yes', 'No'], prefilled: 'Yes', required: true, aiHint: 'From your quiz: Yes. Disability status provides additional deductions and may qualify you for higher benefit tiers.', section: 'Disability & Medical' },
  { id: 'receivingDisabilityBenefits', label: 'Are you receiving SSI or SSDI?', type: 'radio', options: ['Yes — SSI', 'Yes — SSDI', 'Yes — Both', 'No', 'Application pending'], prefilled: 'No', required: true, aiHint: 'If your SSI/SSDI application is pending, select "Application pending." You may still qualify for SNAP while waiting.', section: 'Disability & Medical' },

  // Section 6: Signature
  { id: 'signature', label: 'Electronic Signature', type: 'text', prefilled: '', required: true, aiHint: 'Type your full legal name to sign electronically. By signing, you certify that all information is true and complete to the best of your knowledge.', section: 'Certification' },
  { id: 'signatureDate', label: 'Date', type: 'date', prefilled: '2026-02-15', required: true, aiHint: 'Today\'s date. Your application is effective from this date — benefits may be retroactive to today if approved.', section: 'Certification' },
];

const SECTIONS = [...new Set(SNAP_FIELDS.map(f => f.section))];

export default function CopilotPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    SNAP_FIELDS.forEach(f => { init[f.id] = f.prefilled || ''; });
    return init;
  });
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const sectionFields = SNAP_FIELDS.filter(f => f.section === SECTIONS[currentSection]);
  const totalFields = SNAP_FIELDS.length;
  const filledFields = SNAP_FIELDS.filter(f => values[f.id]?.trim()).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  const handleNext = () => {
    setCompletedSections(prev => new Set([...prev, currentSection]));
    if (currentSection < SECTIONS.length - 1) setCurrentSection(currentSection + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <a href="/demo" className="text-xs font-mono text-gray-300 hover:text-gray-500 transition-colors">&larr; demo</a>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight mt-6 mb-2">Application Copilot</h1>
          <p className="text-sm text-gray-400">SNAP application — pre-filled from screening, AI-guided field by field</p>
        </div>

        {/* Progress */}
        <div className="border-b border-gray-100 pb-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{progress}% complete</span>
            <span className="text-sm text-gray-400">{filledFields}/{totalFields} fields</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-accent-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          {/* Section tabs */}
          <div className="flex gap-1 mt-3 overflow-x-auto">
            {SECTIONS.map((s, i) => (
              <button
                key={s}
                onClick={() => setCurrentSection(i)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  i === currentSection
                    ? 'bg-accent-600 text-white'
                    : completedSections.has(i)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {completedSections.has(i) && <CheckCircle2 className="w-3 h-3" />}
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">{SECTIONS[currentSection]}</h2>
              <p className="text-sm text-gray-500 mb-6">Fields marked with * are required</p>

              <div className="space-y-5">
                {sectionFields.map((field) => (
                  <div
                    key={field.id}
                    className={`relative group rounded-lg p-4 -mx-4 transition-colors ${activeHint === field.id ? 'bg-accent-50 ring-1 ring-accent-200' : 'hover:bg-gray-50'}`}
                    onFocus={() => setActiveHint(field.id)}
                    onClick={() => setActiveHint(field.id)}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={values[field.id]}
                        onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent ${values[field.id] ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}`}
                      />
                    )}

                    {field.type === 'date' && (
                      <input
                        type="date"
                        value={values[field.id]}
                        onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent ${values[field.id] ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}`}
                      />
                    )}

                    {field.type === 'textarea' && (
                      <textarea
                        value={values[field.id]}
                        onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent ${values[field.id] ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}`}
                      />
                    )}

                    {field.type === 'select' && (
                      <select
                        value={values[field.id]}
                        onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent ${values[field.id] ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}`}
                      >
                        <option value="">Select...</option>
                        {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}

                    {field.type === 'radio' && (
                      <div className="flex gap-4">
                        {field.options?.map(o => (
                          <label key={o} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={field.id}
                              value={o}
                              checked={values[field.id] === o}
                              onChange={(e) => setValues({ ...values, [field.id]: e.target.value })}
                              className="text-accent-600 focus:ring-accent-500"
                            />
                            <span className="text-sm text-gray-700">{o}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Pre-filled indicator */}
                    {field.prefilled && values[field.id] === field.prefilled && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Sparkles className="w-3 h-3 text-accent-500" />
                        <span className="text-xs text-accent-600">Pre-filled from your screening</span>
                      </div>
                    )}

                    {/* Warning */}
                    {field.aiWarning && !values[field.id] && (
                      <div className="flex items-start gap-1.5 mt-2 text-amber-600">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="text-xs">{field.aiWarning}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                {currentSection < SECTIONS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-6 py-2.5 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700 transition-colors"
                  >
                    Next Section <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button className="flex items-center gap-1 px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    <CheckCircle2 className="w-4 h-4" /> Submit Application (Demo)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* AI Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Active hint */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">AI Copilot</p>
                    <p className="text-xs text-gray-400">Helping you fill this out</p>
                  </div>
                </div>
                {activeHint ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {SNAP_FIELDS.find(f => f.id === activeHint)?.aiHint}
                    </p>
                    {SNAP_FIELDS.find(f => f.id === activeHint)?.aiWarning && !values[activeHint] && (
                      <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">{SNAP_FIELDS.find(f => f.id === activeHint)?.aiWarning}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Click on any field to see AI guidance</p>
                )}
              </div>

              {/* Tips */}
              <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <p className="text-sm font-semibold text-amber-900">Pro Tips</p>
                </div>
                <ul className="space-y-2 text-xs text-amber-800">
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold">1.</span>
                    <span>Report ALL housing costs — they reduce your countable income and increase your benefit.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold">2.</span>
                    <span>If you pay any utility, you get the full $567/mo Standard Utility Allowance deduction.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold">3.</span>
                    <span>Medical expenses over $35/mo are deductible for disabled households.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold">4.</span>
                    <span>Submitting today means benefits are retroactive to today if approved.</span>
                  </li>
                </ul>
              </div>

              {/* Documents needed */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <p className="text-sm font-semibold text-gray-900 mb-3">Documents You&apos;ll Need</p>
                <ul className="space-y-2">
                  {[
                    { doc: 'Photo ID', status: 'ready' },
                    { doc: 'Proof of income (pay stubs)', status: 'ready' },
                    { doc: 'Social Security cards', status: 'ready' },
                    { doc: 'Proof of address (utility bill)', status: 'missing' },
                    { doc: 'Disability documentation', status: 'missing' },
                  ].map(d => (
                    <li key={d.doc} className="flex items-center gap-2">
                      {d.status === 'ready' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className={`text-sm ${d.status === 'ready' ? 'text-gray-700' : 'text-amber-700'}`}>{d.doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
