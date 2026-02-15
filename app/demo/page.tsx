import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform Demo',
};

const DEMOS = [
  {
    number: '01',
    title: 'Benefits Simulation',
    description: 'How benefits change as income changes. Drag a slider, watch the cliff.',
    href: '/demo/simulation',
    audience: 'Policy makers',
  },
  {
    number: '02',
    title: 'Impact Dashboard',
    description: '1,247 screenings, conversion funnels, county data. The grant ROI slide.',
    href: '/demo/impact',
    audience: 'Funders',
  },
  {
    number: '03',
    title: 'Application Copilot',
    description: 'AI walks you through SNAP field by field. Pre-filled from screening.',
    href: '/demo/copilot',
    audience: 'End users',
  },
  {
    number: '04',
    title: 'SMS Bot',
    description: 'Full screening via text message. 90 seconds, any phone.',
    href: '/demo/sms',
    audience: 'Accessibility',
  },
  {
    number: '05',
    title: 'Embed Widget + API',
    description: 'Three lines of code. Any website becomes a screening point.',
    href: '/demo/widget',
    audience: 'Partners',
  },
];

export default function DemoHub() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6">CareNavigator / Platform</p>
        <h1 className="text-5xl font-bold text-gray-950 tracking-tight leading-[1.1] mb-5">
          The operating system<br />for benefits access
        </h1>
        <p className="text-lg text-gray-400 max-w-lg mb-4">
          $60B+ in benefits go unclaimed every year. Not because people don&apos;t qualify — because the system is too complex to navigate.
        </p>
        <p className="text-sm text-gray-300 mb-20">All demos use mock data. No live applications.</p>

        {/* Demos */}
        <div className="space-y-0 border-t border-gray-100">
          {DEMOS.map((demo) => (
            <a
              key={demo.href}
              href={demo.href}
              className="group flex items-baseline gap-6 py-6 border-b border-gray-100 hover:bg-gray-50 -mx-6 px-6 transition-colors"
            >
              <span className="text-xs font-mono text-gray-300 w-6 flex-shrink-0">{demo.number}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-950 transition-colors">
                  {demo.title}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">{demo.description}</p>
              </div>
              <span className="text-xs text-gray-300 hidden sm:block">{demo.audience}</span>
              <span className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all">&rarr;</span>
            </a>
          ))}
        </div>

        {/* Core product link */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-300 mb-3">Already built</p>
          <a href="/results" className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Eligibility quiz, results dashboard, AI advisor, tracker, benefits letter
            <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
