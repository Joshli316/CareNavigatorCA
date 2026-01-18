import Link from 'next/link';
import { HeartHandshake } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <HeartHandshake className="w-8 h-8 text-primary-500" />
            <span className="text-heading-sm text-neutral-900">
              CareNavigator
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link href="/quiz" className="text-body text-neutral-700 hover:text-primary-500 transition-colors">
              Take Quiz
            </Link>
            <Link href="/results" className="text-body text-neutral-700 hover:text-primary-500 transition-colors">
              Results
            </Link>
            <Link href="/vault" className="text-body text-neutral-700 hover:text-primary-500 transition-colors">
              Vault
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
