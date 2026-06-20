
import { Smile, CircleOff, AlignVerticalDistributeCenter, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { ChiefComplaintType } from '@/types';
import { chiefComplaintOptions } from '@/data/speeches';

const iconMap: Record<ChiefComplaintType, typeof Smile> = {
  toothache: Smile,
  missing_tooth: CircleOff,
  malocclusion: AlignVerticalDistributeCenter,
  cleaning: Sparkles,
};

export function ComplaintSelector() {
  const selectedComplaint = useAppStore((state) => state.selectedComplaint);
  const setSelectedComplaint = useAppStore((state) => state.setSelectedComplaint);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
        选择主诉类型
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {chiefComplaintOptions.map((option) => {
          const Icon = iconMap[option.type];
          const isSelected = selectedComplaint === option.type;
          return (
            <button
              key={option.type}
              onClick={() => setSelectedComplaint(isSelected ? null : option.type)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md scale-[1.02]'
                  : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-white text-gray-400'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
