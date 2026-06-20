
import { RotateCcw } from 'lucide-react';
import { ReviewForm } from '@/components/review/ReviewForm';
import { SpeechLibrary } from '@/components/review/SpeechLibrary';
import { ReviewHistory } from '@/components/review/ReviewHistory';

export function ReviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <RotateCcw className="w-4 h-4 text-amber-500" />
        <span>复盘每次接诊，沉淀个人话术风格</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ReviewForm />
        </div>
        <div className="space-y-6">
          <ReviewHistory />
          <SpeechLibrary />
        </div>
      </div>
    </div>
  );
}
