
export type ChiefComplaintType = 'toothache' | 'missing_tooth' | 'malocclusion' | 'cleaning';

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

export type TreatmentType = 'root_canal' | 'filling' | 'implant' | 'orthodontics' | 'removable_denture' | 'fixed_bridge';

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
