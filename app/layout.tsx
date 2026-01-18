import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { QuizProvider } from '@/lib/context/QuizContext';
import { ResultsProvider } from '@/lib/context/ResultsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CareNavigator - Benefits Made Simple',
  description: 'Transform 100+ hours of benefits research into a 15-minute guided experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QuizProvider>
          <ResultsProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
          </ResultsProvider>
        </QuizProvider>
      </body>
    </html>
  );
}
