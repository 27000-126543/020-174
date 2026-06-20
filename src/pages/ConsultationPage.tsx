
import { useMemo } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getSpeechesByConditions } from '@/data/speeches';
import { ComplaintSelector } from '@/components/consultation/ComplaintSelector';
import { PatientAttributes } from '@/components/consultation/PatientAttributes';
import { PatientProfile } from '@/components/consultation/PatientProfile';
import { SpeechCard } from '@/components/consultation/SpeechCard';
import type { SpeechSection } from '@/types';

export function ConsultationPage() {
  const selectedComplaint = useAppStore((state) => state.selectedComplaint);
  const patientAttributes = useAppStore((state) => state.patientAttributes);

  const speeches = useMemo(() => {
    if (!selectedComplaint) return [];
    return getSpeechesByConditions(
      selectedComplaint,
      patientAttributes.ageGroup,
      patientAttributes.anxietyLevel,
      patientAttributes.isFirstVisit
    );
  }, [selectedComplaint, patientAttributes]);

  const greetingSpeeches = speeches.filter((s) => s.section === 'greeting');
  const historySpeeches = speeches.filter((s) => s.section === 'medical_history');
  const preExamSpeeches = speeches.filter((s) => s.section === 'pre_exam');

  const sections: { key: SpeechSection; items: typeof greetingSpeeches }[] = [
    { key: 'greeting', items: greetingSpeeches },
    { key: 'medical_history', items: historySpeeches },
    { key: 'pre_exam', items: preExamSpeeches },
  ];

  const hasAnyAttribute = patientAttributes.ageGroup || patientAttributes.anxietyLevel || patientAttributes.isFirstVisit !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>选择主诉和患者属性，自动生成接诊话术</span>
      </div>

      <ComplaintSelector />
      <PatientAttributes />

      {selectedComplaint && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <PatientProfile />
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sections.map((section) => (
                  <SpeechCard key={section.key} section={section.key} items={section.items} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedComplaint && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-600 font-medium mb-2">请先选择主诉类型</h3>
          <p className="text-sm text-gray-400">选择后系统将自动生成对应话术</p>
        </div>
      )}

      {selectedComplaint && hasAnyAttribute && (
        <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">使用提示</p>
            <ul className="text-blue-600 space-y-1 text-xs">
              <li>• 点击任意句子即可复制到剪贴板</li>
              <li>• 悬停句子可标记反馈或收藏到个人话术库</li>
              <li>• 患者画像会根据选择实时更新沟通重点建议</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
