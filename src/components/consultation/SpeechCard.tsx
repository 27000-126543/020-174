
import { MessageCircle, ClipboardList, Stethoscope } from 'lucide-react';
import type { SpeechItem as SpeechItemType, SpeechSection } from '@/types';
import { speechSectionLabels } from '@/data/speeches';
import { SpeechItemComponent } from './SpeechItem';

const iconMap: Record<SpeechSection, typeof MessageCircle> = {
  greeting: MessageCircle,
  medical_history: ClipboardList,
  pre_exam: Stethoscope,
};

const colorMap: Record<SpeechSection, string> = {
  greeting: 'from-blue-500 to-blue-600',
  medical_history: 'from-emerald-500 to-emerald-600',
  pre_exam: 'from-amber-500 to-amber-600',
};

interface SpeechCardProps {
  section: SpeechSection;
  items: SpeechItemType[];
}

export function SpeechCard({ section, items }: SpeechCardProps) {
  const Icon = iconMap[section];
  const gradient = colorMap[section];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradient} px-5 py-3 flex items-center gap-2`}>
        <Icon className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold text-sm">{speechSectionLabels[section]}</h3>
        <span className="ml-auto text-xs text-white/80">{items.length} 句</span>
      </div>
      <div className="p-3 space-y-1">
        {items.map((item, index) => (
          <SpeechItemComponent key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
