
import { useState } from 'react';
import {
  Wallet,
  Calendar,
  AlertTriangle,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { TreatmentCard as TreatmentCardType } from '@/types';
import { treatmentSectionLabels } from '@/data/treatments';

interface SectionProps {
  icon: typeof Wallet;
  title: string;
  color: string;
  bgColor: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ icon: Icon, title, color, bgColor, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className={`w-10 h-10 ${bgColor} ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-medium text-gray-800">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400 ml-auto" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 ml-auto" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-4 pt-0">
          <div className="pl-[52px]">{children}</div>
        </div>
      )}
    </div>
  );
}

interface TreatmentCardComponentProps {
  card: TreatmentCardType;
}

export function TreatmentCardComponent({ card }: TreatmentCardComponentProps) {
  return (
    <div className="space-y-3">
      <Section
        icon={Wallet}
        title={treatmentSectionLabels.costBreakdown}
        color="text-emerald-600"
        bgColor="bg-emerald-50"
      >
        <ul className="space-y-2">
          {card.costBreakdown.map((item, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        icon={Calendar}
        title={treatmentSectionLabels.treatmentSessions}
        color="text-blue-600"
        bgColor="bg-blue-50"
      >
        <p className="text-sm text-gray-600 leading-relaxed">{card.treatmentSessions}</p>
      </Section>

      <Section
        icon={AlertTriangle}
        title={treatmentSectionLabels.possibleDiscomfort}
        color="text-orange-600"
        bgColor="bg-orange-50"
      >
        <ul className="space-y-2">
          {card.possibleDiscomfort.map((item, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        icon={RefreshCcw}
        title={treatmentSectionLabels.followUpRequirement}
        color="text-purple-600"
        bgColor="bg-purple-50"
      >
        <ul className="space-y-2">
          {card.followUpRequirement.map((item, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
