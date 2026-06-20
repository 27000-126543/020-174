
import { User, Heart, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ageGroupOptions, anxietyLevelOptions } from '@/data/speeches';
import type { AgeGroup, AnxietyLevel } from '@/types';

export function PatientAttributes() {
  const patientAttributes = useAppStore((state) => state.patientAttributes);
  const setPatientAttributes = useAppStore((state) => state.setPatientAttributes);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
        患者属性
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <User className="w-4 h-4" />
            <span>年龄阶段</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ageGroupOptions.map((option) => {
              const isSelected = patientAttributes.ageGroup === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() =>
                    setPatientAttributes({
                      ageGroup: isSelected ? null : (option.value as AgeGroup),
                    })
                  }
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Heart className="w-4 h-4" />
            <span>紧张程度</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {anxietyLevelOptions.map((option) => {
              const isSelected = patientAttributes.anxietyLevel === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() =>
                    setPatientAttributes({
                      anxietyLevel: isSelected ? null : (option.value as AnxietyLevel),
                    })
                  }
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Star className="w-4 h-4" />
            <span>是否首次到院</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setPatientAttributes({ isFirstVisit: patientAttributes.isFirstVisit === true ? null : true })
              }
              className={`px-4 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                patientAttributes.isFirstVisit === true
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              首次到院
            </button>
            <button
              onClick={() =>
                setPatientAttributes({ isFirstVisit: patientAttributes.isFirstVisit === false ? null : false })
              }
              className={`px-4 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                patientAttributes.isFirstVisit === false
                  ? 'bg-gray-500 text-white border-gray-500 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              复诊
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
