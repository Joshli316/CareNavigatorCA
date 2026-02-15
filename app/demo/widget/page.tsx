'use client';

import { useState } from 'react';
import { ChevronRight, CheckCircle2, ExternalLink, Copy, Check } from 'lucide-react';

// Mini screening widget (what partners would embed)
function CareNavigatorWidget() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ state: '', income: '', disability: '', household: '' });
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-5 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          </div>
          <span className="text-sm font-semibold text-gray-900">CareNavigator</span>
        </div>
        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-semibold text-lg">You may qualify for 15 programs</p>
          <p className="text-green-600 text-sm">Estimated value: up to $7,437/month</p>
        </div>
        <div className="space-y-2 mb-4">
          {['Medicaid — Free healthcare', 'SNAP — $740/mo food benefits', 'SSDI — $1,537/mo disability'].map(p => (
            <div key={p} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{p}</span>
            </div>
          ))}
          <p className="text-xs text-gray-400 pl-6">+ 12 more programs</p>
        </div>
        <a href="/results" className="w-full flex items-center justify-center gap-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          See Full Results <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <p className="text-xs text-gray-400 text-center mt-2">Powered by CareNavigator</p>
      </div>
    );
  }

  const steps = [
    {
      question: 'What state do you live in?',
      input: (
        <select value={data.state} onChange={e => setData({...data, state: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Select state</option>
          <option value="TX">Texas</option>
          <option value="CA">California</option>
          <option value="NY">New York</option>
          <option value="FL">Florida</option>
        </select>
      ),
      valid: !!data.state,
    },
    {
      question: 'Monthly household income?',
      input: (
        <select value={data.income} onChange={e => setData({...data, income: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Select range</option>
          <option value="0-1000">Under $1,000</option>
          <option value="1000-2000">$1,000 - $2,000</option>
          <option value="2000-3000">$2,000 - $3,000</option>
          <option value="3000+">$3,000+</option>
        </select>
      ),
      valid: !!data.income,
    },
    {
      question: 'Do you have a disability?',
      input: (
        <div className="flex gap-3">
          {['Yes', 'No'].map(v => (
            <button key={v} onClick={() => setData({...data, disability: v})}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${data.disability === v ? 'bg-gray-100 border-gray-400 text-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >{v}</button>
          ))}
        </div>
      ),
      valid: !!data.disability,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-5 w-full max-w-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </div>
        <span className="text-sm font-semibold text-gray-900">Quick Benefits Check</span>
        <span className="ml-auto text-xs text-gray-400">{step + 1}/3</span>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">{steps[step].question}</p>
        {steps[step].input}
      </div>

      <div className="flex gap-2">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Back</button>
        )}
        <button
          onClick={() => step < 2 ? setStep(step + 1) : handleSubmit()}
          disabled={!steps[step].valid}
          className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
        >
          {step < 2 ? <>Next <ChevronRight className="w-4 h-4" /></> : 'Check Eligibility'}
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center mt-3">Powered by CareNavigator</p>
    </div>
  );
}

export default function WidgetPage() {
  const [copied, setCopied] = useState(false);
  const embedCode = `<script src="https://cdn.carenavigator.org/widget.js"></script>
<div id="carenavigator-widget"
  data-partner="parkland-health"
  data-theme="light"
  data-state="TX">
</div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <a href="/demo" className="text-xs font-mono text-gray-300 hover:text-gray-500 transition-colors">&larr; demo</a>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight mt-6 mb-2">Embed Widget + API</h1>
          <p className="text-sm text-gray-400">Three lines of code. Any website becomes a screening point.</p>
        </div>

        {/* Embed code */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Integration Code</h2>
            <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              {copied ? <><Check className="w-3.5 h-3.5 text-green-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <pre className="bg-gray-900 rounded-lg p-4 text-sm text-green-400 overflow-x-auto"><code>{embedCode}</code></pre>
        </div>

        {/* Hospital demo */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="bg-teal-700 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-teal-700 font-bold text-sm">P</div>
            <div>
              <h2 className="text-white font-semibold">Parkland Health</h2>
              <p className="text-teal-200 text-xs">Patient Services Portal</p>
            </div>
            <div className="ml-auto flex gap-4 text-teal-200 text-sm">
              <span>Home</span>
              <span>My Appointments</span>
              <span className="text-white font-medium">Benefits</span>
              <span>Contact</span>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-b from-teal-50 to-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Financial Assistance</h3>
                <p className="text-gray-600 mb-4">
                  You may qualify for government benefits that help cover healthcare costs, food, housing, and more.
                  Use our quick screening tool to find out in under 60 seconds.
                </p>
                <div className="space-y-3 mb-6">
                  {[
                    'Free, confidential screening',
                    'Results in under 60 seconds',
                    'Covers 30+ federal, state & local programs',
                    'Pre-fills your application forms',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                  <p className="text-sm text-teal-800">
                    <strong>Did you know?</strong> Last year, Parkland patients accessed over $12M in benefits through this screening tool.
                  </p>
                </div>
              </div>

              {/* Widget embedded in hospital page */}
              <div className="flex justify-center">
                <CareNavigatorWidget />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-xs text-gray-400">
            Parkland Health &middot; 5201 Harry Hines Blvd, Dallas, TX 75235 &middot; (214) 590-8000 &middot; <em>This is a demo — not the actual Parkland website</em>
          </div>
        </div>

        {/* Use cases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { org: 'Hospitals', desc: 'Patient intake and financial assistance screening', stat: '35% of uninsured patients qualify for Medicaid' },
            { org: 'Schools', desc: 'Enrollment forms with automatic benefits check', stat: '60% of free lunch families qualify for additional programs' },
            { org: 'Nonprofits', desc: 'Food banks, shelters, and community centers', stat: '$3.2M in benefits unlocked per 1,000 screenings' },
          ].map(c => (
            <div key={c.org} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{c.org}</h3>
              <p className="text-sm text-gray-500 mb-3">{c.desc}</p>
              <p className="text-xs text-gray-400">{c.stat}</p>
            </div>
          ))}
        </div>

        {/* API section */}
        <div className="bg-gray-900 rounded-xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">REST API</h2>
          <p className="text-gray-400 text-sm mb-4">Full programmatic access for deeper integrations</p>
          <pre className="bg-gray-800 rounded-lg p-4 text-sm overflow-x-auto"><code className="text-green-400">{`POST /api/v1/screen
{
  "state": "TX",
  "county": "Dallas",
  "age": 35,
  "householdSize": 3,
  "monthlyIncome": 1500,
  "hasDisability": true,
  "hasChildren": true
}

→ 200 OK
{
  "matchedPrograms": 15,
  "estimatedMonthlyBenefit": 7437,
  "topPrograms": [
    { "name": "Medicaid", "probability": 100, "benefit": "Varies" },
    { "name": "SNAP", "probability": 65, "benefit": 740 },
    { "name": "SSDI", "probability": 100, "benefit": 1537 }
  ],
  "applicationUrl": "https://carenavigator.org/apply/m4x7k2"
}`}</code></pre>
        </div>
      </div>
    </div>
  );
}
