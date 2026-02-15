import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';
import { AdvisorPanel } from '@/components/ai/AdvisorPanel';

export const metadata: Metadata = {
  title: 'Your Results',
};

export default function ResultsPage() {
  return (
    <Container>
      <div className="py-8">
        <ResultsDashboard />
      </div>
      <AdvisorPanel />
    </Container>
  );
}
