
import { HeartPulse, PlusCircle, CircleGauge, AlignEndHorizontal, MoveHorizontal, Link } from 'lucide-react';
import type { TreatmentType } from '@/types';
import { treatmentCards } from '@/data/treatments';

const iconMap: Record<TreatmentType, typeof HeartPulse> = {
  root_canal: HeartPulse,
  filling: PlusCircle,
  implant: CircleGauge,
  orthodontics: AlignEndHorizontal,
  removable_denture: MoveHorizontal,
  fixed_bridge: Link,
};

interface TreatmentSelectorProps {
  selected: TreatmentType | null;
  onSelect: (type: TreatmentType | null) => void;
}

export function TreatmentSelector({ selected, onSelect }: TreatmentSelectorProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
        选择治疗项目
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {treatmentCards.map((card) => {
          const Icon = iconMap[card.type];
          const isSelected = selected === card.type;
          return (
            <button
              key={card.type}
              onClick={() => onSelect(isSelected ? null : card.type)}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 text-purple-600 shadow-md scale-[1.02]'
                  : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-purple-500 text-white' : 'bg-white text-gray-400'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">{card.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
