
import { ArrowLeftRight, Wallet, Calendar, AlertTriangle, RefreshCcw } from 'lucide-react';
import type { TreatmentCard as TreatmentCardType } from '@/types';
import { treatmentSectionLabels } from '@/data/treatments';

interface TreatmentComparisonProps {
  cardA: TreatmentCardType;
  cardB: TreatmentCardType;
}

function ComparisonSection({
  icon: Icon,
  title,
  color,
  bgColor,
  itemsA,
  itemsB,
  isList = true,
}: {
  icon: typeof Wallet;
  title: string;
  color: string;
  bgColor: string;
  itemsA: string[];
  itemsB: string[];
  isList?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className={`${bgColor} ${color} px-4 py-2.5 flex items-center gap-2`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        <div className="p-4">
          <p className="text-xs font-medium text-gray-500 mb-2">{title} - 方案A</p>
          {isList ? (
            <ul className="space-y-1.5">
              {itemsA.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                  <span className="w-1 h-1 bg-gray-300 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">{itemsA[0]}</p>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-gray-500 mb-2">{title} - 方案B</p>
          {isList ? (
            <ul className="space-y-1.5">
              {itemsB.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                  <span className="w-1 h-1 bg-gray-300 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">{itemsB[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TreatmentComparison({ cardA, cardB }: TreatmentComparisonProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
          <h3 className="text-lg font-bold">方案A：{cardA.name}</h3>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-4 text-white">
          <h3 className="text-lg font-bold">方案B：{cardB.name}</h3>
        </div>
      </div>

      <ComparisonSection
        icon={Wallet}
        title={treatmentSectionLabels.costBreakdown}
        color="text-emerald-600"
        bgColor="bg-emerald-50"
        itemsA={cardA.costBreakdown}
        itemsB={cardB.costBreakdown}
      />

      <ComparisonSection
        icon={Calendar}
        title={treatmentSectionLabels.treatmentSessions}
        color="text-blue-600"
        bgColor="bg-blue-50"
        itemsA={[cardA.treatmentSessions]}
        itemsB={[cardB.treatmentSessions]}
        isList={false}
      />

      <ComparisonSection
        icon={AlertTriangle}
        title={treatmentSectionLabels.possibleDiscomfort}
        color="text-orange-600"
        bgColor="bg-orange-50"
        itemsA={cardA.possibleDiscomfort}
        itemsB={cardB.possibleDiscomfort}
      />

      <ComparisonSection
        icon={RefreshCcw}
        title={treatmentSectionLabels.followUpRequirement}
        color="text-purple-600"
        bgColor="bg-purple-50"
        itemsA={cardA.followUpRequirement}
        itemsB={cardB.followUpRequirement}
      />
    </div>
  );
}
