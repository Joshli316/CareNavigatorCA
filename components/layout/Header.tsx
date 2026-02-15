import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-sm font-medium text-gray-900 tracking-tight hover:text-gray-600 transition-colors">
            CareNavigator
          </Link>

          <nav aria-label="Main navigation" className="flex items-center gap-8">
            <Link href="/quiz" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Assessment
            </Link>
            <Link href="/grants" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Grants
            </Link>
            <Link href="/results" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Results
            </Link>
            <Link href="/demo" className="text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
              Demo
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
