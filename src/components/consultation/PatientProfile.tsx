
import { User, Heart, Star, Lightbulb, AlertTriangle, Info } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { chiefComplaintOptions, ageGroupOptions, anxietyLevelOptions } from '@/data/speeches';

interface ProfileItem {
  icon: typeof User;
  label: string;
  value: string | null;
  color: string;
}

export function PatientProfile() {
  const selectedComplaint = useAppStore((state) => state.selectedComplaint);
  const patientAttributes = useAppStore((state) => state.patientAttributes);

  const complaintLabel = selectedComplaint
    ? chiefComplaintOptions.find((o) => o.type === selectedComplaint)?.label
    : null;

  const ageLabel = patientAttributes.ageGroup
    ? ageGroupOptions.find((o) => o.value === patientAttributes.ageGroup)?.label
    : null;

  const anxietyLabel = patientAttributes.anxietyLevel
    ? anxietyLevelOptions.find((o) => o.value === patientAttributes.anxietyLevel)?.label
    : null;

  const visitLabel = patientAttributes.isFirstVisit === true
    ? '首次到院'
    : patientAttributes.isFirstVisit === false
    ? '复诊患者'
    : null;

  const profiles: ProfileItem[] = [
    { icon: User, label: '主诉', value: complaintLabel, color: 'text-blue-500' },
    { icon: User, label: '年龄', value: ageLabel, color: 'text-emerald-500' },
    { icon: Heart, label: '状态', value: anxietyLabel, color: 'text-orange-500' },
    { icon: Star, label: '到院', value: visitLabel, color: 'text-purple-500' },
  ];

  const hasAnyProfile = profiles.some((p) => p.value !== null);

  const focusPoints: { icon: typeof Lightbulb; text: string; type: 'info' | 'warning' | 'tip' }[] = [];

  if (patientAttributes.anxietyLevel === 'high') {
    focusPoints.push({
      icon: AlertTriangle,
      text: '患者非常紧张，优先建立信任感，语速放慢，多解释每一步操作',
      type: 'warning',
    });
  }

  if (patientAttributes.anxietyLevel === 'medium') {
    focusPoints.push({
      icon: Info,
      text: '患者有些紧张，沟通时多安抚，提前告知可能的不适感',
      type: 'info',
    });
  }

  if (patientAttributes.isFirstVisit) {
    focusPoints.push({
      icon: Info,
      text: '首次到院患者，先介绍门诊环境和流程，降低陌生感',
      type: 'info',
    });
  }

  if (patientAttributes.ageGroup === 'child') {
    focusPoints.push({
      icon: Lightbulb,
      text: '儿童患者，用游戏化语言引导配合，多鼓励表扬，邀请家长参与',
      type: 'tip',
    });
  }

  if (patientAttributes.ageGroup === 'senior') {
    focusPoints.push({
      icon: Lightbulb,
      text: '老年患者，语速放慢，声音适当放大，关注全身健康状况',
      type: 'tip',
    });
  }

  if (selectedComplaint === 'toothache') {
    focusPoints.push({
      icon: Lightbulb,
      text: '牙痛患者首要诉求是止痛，先解决疼痛再讨论长期方案',
      type: 'tip',
    });
  }

  if (selectedComplaint === 'missing_tooth') {
    focusPoints.push({
      icon: Lightbulb,
      text: '缺牙患者关注修复效果和费用，准备好方案对比和费用明细',
      type: 'tip',
    });
  }

  if (selectedComplaint === 'malocclusion') {
    focusPoints.push({
      icon: Lightbulb,
      text: '矫正患者通常关注美观和周期，展示案例照片增强信心',
      type: 'tip',
    });
  }

  const typeStyles = {
    warning: 'bg-orange-50 border-orange-200 text-orange-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    tip: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  };

  const iconStyles = {
    warning: 'text-orange-500',
    info: 'text-blue-500',
    tip: 'text-emerald-500',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
        患者画像摘要
      </h3>

      {!hasAnyProfile ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400">选择主诉和患者属性后，这里会汇总患者特点</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {profiles.map((profile) => {
              const Icon = profile.icon;
              return (
                <div
                  key={profile.label}
                  className={`p-3 rounded-xl border ${
                    profile.value ? 'bg-gray-50 border-gray-200' : 'bg-gray-50/50 border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${profile.value ? profile.color : 'text-gray-300'}`} />
                    <span className="text-xs text-gray-500">{profile.label}</span>
                  </div>
                  <p className={`text-sm font-medium ${profile.value ? 'text-gray-800' : 'text-gray-300'}`}>
                    {profile.value || '未选择'}
                  </p>
                </div>
              );
            })}
          </div>

          {focusPoints.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                本次沟通重点
              </h4>
              <div className="space-y-2">
                {focusPoints.map((point, idx) => {
                  const Icon = point.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${typeStyles[point.type]}`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconStyles[point.type]}`} />
                      <span>{point.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
