import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { QuizProvider } from '@/lib/context/QuizContext';
import { ResultsProvider } from '@/lib/context/ResultsContext';
import { TrackerProvider } from '@/lib/context/TrackerContext';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export const metadata: Metadata = {
  title: {
    default: 'CareNavigator — Find Disability Benefits in 15 Minutes',
    template: '%s | CareNavigator',
  },
  description: 'Discover disability benefits, grants, and assistance programs you qualify for. Free eligibility screening for 34+ federal, state, and local programs.',
  openGraph: {
    title: 'CareNavigator — Find Disability Benefits in 15 Minutes',
    description: 'Free eligibility screening for 34+ disability assistance programs. Get matched in 15 minutes.',
    type: 'website',
    siteName: 'CareNavigator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareNavigator — Find Disability Benefits in 15 Minutes',
    description: 'Free eligibility screening for 34+ disability assistance programs.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-gray-900 focus:shadow-lg">
          Skip to content
        </a>
        <ErrorBoundary>
          <QuizProvider>
            <ResultsProvider>
              <TrackerProvider>
                <Header />
                <main id="main-content" className="min-h-screen bg-white">
                  {children}
                </main>
              </TrackerProvider>
            </ResultsProvider>
          </QuizProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
