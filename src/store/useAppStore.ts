
import { create } from 'zustand';
import type { TabType, ChiefComplaintType, PatientAttributes, PersonalSpeech, ReviewRecord } from '@/types';

interface AppState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedComplaint: ChiefComplaintType | null;
  setSelectedComplaint: (type: ChiefComplaintType | null) => void;
  patientAttributes: PatientAttributes;
  setPatientAttributes: (attrs: Partial<PatientAttributes>) => void;
  personalSpeeches: PersonalSpeech[];
  addPersonalSpeech: (speech: Omit<PersonalSpeech, 'id' | 'createdAt'>) => void;
  updatePersonalSpeech: (id: string, updates: Partial<Pick<PersonalSpeech, 'content' | 'category' | 'tags'>>) => void;
  deletePersonalSpeech: (id: string) => void;
  reviewRecords: ReviewRecord[];
  addReviewRecord: (record: Omit<ReviewRecord, 'id' | 'createdAt'>) => void;
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to save to localStorage');
  }
};

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'consultation',
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedComplaint: null,
  setSelectedComplaint: (type) => set({ selectedComplaint: type }),

  patientAttributes: {
    ageGroup: null,
    anxietyLevel: null,
    isFirstVisit: null,
  },
  setPatientAttributes: (attrs) =>
    set((state) => ({
      patientAttributes: { ...state.patientAttributes, ...attrs },
    })),

  personalSpeeches: loadFromStorage('personalSpeeches', []),
  addPersonalSpeech: (speech) =>
    set((state) => {
      const newSpeech: PersonalSpeech = {
        ...speech,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: Date.now(),
      };
      const updated = [...state.personalSpeeches, newSpeech];
      saveToStorage('personalSpeeches', updated);
      return { personalSpeeches: updated };
    }),
  deletePersonalSpeech: (id) =>
    set((state) => {
      const updated = state.personalSpeeches.filter((s) => s.id !== id);
      saveToStorage('personalSpeeches', updated);
      return { personalSpeeches: updated };
    }),
  updatePersonalSpeech: (id, updates) =>
    set((state) => {
      const updated = state.personalSpeeches.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      );
      saveToStorage('personalSpeeches', updated);
      return { personalSpeeches: updated };
    }),

  reviewRecords: loadFromStorage('reviewRecords', []),
  addReviewRecord: (record) =>
    set((state) => {
      const newRecord: ReviewRecord = {
        ...record,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: Date.now(),
      };
      const updated = [...state.reviewRecords, newRecord];
      saveToStorage('reviewRecords', updated);
      return { reviewRecords: updated };
    }),
}));
