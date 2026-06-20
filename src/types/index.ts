
export type ChiefComplaintType = 'toothache' | 'missing_tooth' | 'malocclusion' | 'cleaning' | 'other';

export type AgeGroup = 'child' | 'teen' | 'adult' | 'senior';

export type AnxietyLevel = 'low' | 'medium' | 'high';

export interface PatientAttributes {
  ageGroup: AgeGroup | null;
  anxietyLevel: AnxietyLevel | null;
  isFirstVisit: boolean | null;
}

export type SpeechSection = 'greeting' | 'medical_history' | 'pre_exam';

export interface SpeechItem {
  id: string;
  content: string;
  section: SpeechSection;
  tags: string[];
}

export type SpeechFeedback = 'too_stiff' | 'need_simplify' | null;

export interface SpeechWithFeedback extends SpeechItem {
  feedback: SpeechFeedback;
  usedCount: number;
}

export type TreatmentType = 'root_canal' | 'filling' | 'implant' | 'orthodontics' | 'removable_denture' | 'fixed_bridge' | 'whitening' | 'scaling' | 'other';

export interface TreatmentCard {
  type: TreatmentType;
  name: string;
  icon: string;
  costBreakdown: string[];
  treatmentSessions: string;
  possibleDiscomfort: string[];
  followUpRequirement: string[];
}

export interface PersonalSpeech {
  id: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  source?: 'consult_collect' | 'review_manual' | 'review_auto' | 'manual_edit';
  reviewId?: string;
}

export interface ReviewRecord {
  id: string;
  isSmooth: boolean;
  stuckPoint: string;
  speechContent: string;
  createdAt: number;
  speechIds?: string[];
  chiefComplaint?: ChiefComplaintType;
  treatmentItems?: TreatmentType[];
  patientConcerns?: string[];
  patientAttributes?: PatientAttributes;
}

export interface FavoriteComparison {
  id: string;
  treatmentA: TreatmentType;
  treatmentB: TreatmentType;
  name: string;
  note: string;
  createdAt: number;
}

export type TabType = 'consultation' | 'treatment' | 'review';

export const chiefComplaintLabels: Record<ChiefComplaintType, string> = {
  toothache: '牙痛',
  missing_tooth: '缺牙',
  malocclusion: '牙齿不齐',
  cleaning: '洗牙咨询',
  other: '其他',
};

export const treatmentLabels: Record<TreatmentType, string> = {
  root_canal: '根管治疗',
  filling: '补牙',
  implant: '种植牙',
  orthodontics: '正畸',
  removable_denture: '活动义齿',
  fixed_bridge: '固定桥',
  whitening: '美白',
  scaling: '洁牙',
  other: '其他',
};

export const concernOptions = [
  '费用预算',
  '治疗疼痛',
  '治疗周期',
  '美观效果',
  '使用寿命',
  '饮食影响',
  '复诊次数',
  '安全性',
  '美观考虑',
  '家属意见',
];
