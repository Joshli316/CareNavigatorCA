import { Container } from '@/components/layout/Container';
import { QuizContainer } from '@/components/quiz/QuizContainer';

export default function QuizPage() {
  return (
    <Container>
      <div className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-heading-lg text-neutral-900 mb-2">Benefits Eligibility Quiz</h1>
          <p className="text-body text-neutral-600 max-w-2xl mx-auto">
            Answer a few questions to discover which benefits you may qualify for. Your answers are saved automatically and never leave your device.
          </p>
        </div>

        <QuizContainer />
      </div>
    </Container>
  );
}
