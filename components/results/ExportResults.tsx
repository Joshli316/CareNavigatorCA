'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { Download, Printer, Share2, RefreshCw } from 'lucide-react';
import { EligibilityResult } from '@/types/benefit';
import { QuizData } from '@/types/quiz';

interface ExportResultsProps {
  results: EligibilityResult[];
  quizData: QuizData;
}

export function ExportResults({ results, quizData }: ExportResultsProps) {
  const router = useRouter();

  const handleRetakeQuiz = () => {
    // Clear results and go back to quiz start
    localStorage.removeItem('carenavigator_results');
    router.push('/quiz');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const exportData = {
      generatedAt: new Date().toISOString(),
      quizData,
      results: results.map(r => ({
        programName: r.program.name,
        category: r.program.category,
        probability: r.probability,
        isEligible: r.isEligible,
        estimatedMonthlyBenefit: r.estimatedMonthlyBenefit,
        timelineWeeks: r.timelineWeeks,
        nextSteps: r.nextSteps,
      })),
      summary: {
        totalPrograms: results.length,
        eligiblePrograms: results.filter(r => r.isEligible).length,
        estimatedTotalMonthlyBenefit: results
          .filter(r => r.isEligible && typeof r.estimatedMonthlyBenefit === 'number')
          .reduce((sum, r) => sum + (r.estimatedMonthlyBenefit as number), 0),
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `care-navigator-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareText = `I found ${results.filter(r => r.isEligible).length} benefits I may be eligible for using CareNavigator! Check out https://care-navigator.pages.dev`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My CareNavigator Results',
          text: shareText,
          url: 'https://care-navigator.pages.dev',
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <Button
        onClick={handleRetakeQuiz}
        variant="outline"
        size="sm"
        className="inline-flex items-center space-x-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Retake Quiz</span>
      </Button>

      <Button
        onClick={handlePrint}
        variant="outline"
        size="sm"
        className="inline-flex items-center space-x-2"
      >
        <Printer className="w-4 h-4" />
        <span>Print Results</span>
      </Button>

      <Button
        onClick={handleDownloadJSON}
        variant="outline"
        size="sm"
        className="inline-flex items-center space-x-2"
      >
        <Download className="w-4 h-4" />
        <span>Download JSON</span>
      </Button>

      <Button
        onClick={handleShare}
        variant="outline"
        size="sm"
        className="inline-flex items-center space-x-2"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </Button>
    </div>
  );
}
