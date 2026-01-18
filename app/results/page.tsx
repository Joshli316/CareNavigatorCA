import { Container } from '@/components/layout/Container';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';

export default function ResultsPage() {
  return (
    <Container>
      <div className="py-8">
        <ResultsDashboard />
      </div>
    </Container>
  );
}
