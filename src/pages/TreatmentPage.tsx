
import { useState } from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import type { TreatmentType } from '@/types';
import { treatmentCards } from '@/data/treatments';
import { TreatmentSelector } from '@/components/treatment/TreatmentSelector';
import { TreatmentCardComponent } from '@/components/treatment/TreatmentCard';

export function TreatmentPage() {
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentType | null>(null);

  const selectedCard = treatmentCards.find((c) => c.type === selectedTreatment);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FileText className="w-4 h-4 text-purple-500" />
        <span>选择治疗项目，查看患者易懂的解释话术</span>
      </div>

      <TreatmentSelector selected={selectedTreatment} onSelect={setSelectedTreatment} />

      {selectedCard ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-2">{selectedCard.name}</h2>
            <p className="text-purple-100 text-sm">用患者听得懂的方式，解释清楚每个细节</p>
          </div>
          <TreatmentCardComponent card={selectedCard} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-600 font-medium mb-2">请先选择治疗项目</h3>
          <p className="text-sm text-gray-400">选择后将展示患者易懂的解释话术</p>
        </div>
      )}

      {selectedCard && (
        <div className="bg-purple-50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-700">
            <p className="font-medium mb-1">沟通技巧</p>
            <ul className="text-purple-600 space-y-1 text-xs">
              <li>• 用通俗比喻代替专业术语，让患者更容易理解</li>
              <li>• 先讲好处再讲费用，降低患者对价格的敏感度</li>
              <li>• 强调"这是正常的"，减少患者的焦虑和担心</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
