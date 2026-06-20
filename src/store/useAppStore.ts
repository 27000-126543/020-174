
import { create } from 'zustand';
import type { TabType, ChiefComplaintType, PatientAttributes, PersonalSpeech, ReviewRecord, FavoriteComparison } from '@/types';

interface AppState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedComplaint: ChiefComplaintType | null;
  setSelectedComplaint: (type: ChiefComplaintType | null) => void;
  patientAttributes: PatientAttributes;
  setPatientAttributes: (attrs: Partial<PatientAttributes>) => void;
  personalSpeeches: PersonalSpeech[];
  addPersonalSpeech: (speech: Omit<PersonalSpeech, 'id' | 'createdAt'>) => string;
  updatePersonalSpeech: (id: string, updates: Partial<Pick<PersonalSpeech, 'content' | 'category' | 'tags'>>) => void;
  deletePersonalSpeech: (id: string) => void;
  reviewRecords: ReviewRecord[];
  addReviewRecord: (record: Omit<ReviewRecord, 'id' | 'createdAt' | 'speechIds'> & { speechIds?: string[] }) => string;
  comparisonNotes: Record<string, string>;
  setComparisonNote: (pairKey: string, note: string) => void;
  favoriteComparisons: FavoriteComparison[];
  addFavoriteComparison: (comp: Omit<FavoriteComparison, 'id' | 'createdAt'>) => void;
  deleteFavoriteComparison: (id: string) => void;
  updateFavoriteComparison: (id: string, updates: Partial<FavoriteComparison>) => void;
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
  addPersonalSpeech: (speech) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newSpeech: PersonalSpeech = {
      ...speech,
      id,
      createdAt: Date.now(),
    };
    set((state) => {
      const updated = [...state.personalSpeeches, newSpeech];
      saveToStorage('personalSpeeches', updated);
      return { personalSpeeches: updated };
    });
    return id;
  },
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
  addReviewRecord: (record) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newRecord: ReviewRecord = {
      ...record,
      id,
      createdAt: Date.now(),
      speechIds: record.speechIds || [],
    };
    set((state) => {
      const updated = [...state.reviewRecords, newRecord];
      saveToStorage('reviewRecords', updated);
      return { reviewRecords: updated };
    });
    return id;
  },

  comparisonNotes: loadFromStorage('comparisonNotes', {}),
  setComparisonNote: (pairKey, note) =>
    set((state) => {
      const updated = { ...state.comparisonNotes, [pairKey]: note };
      saveToStorage('comparisonNotes', updated);
      return { comparisonNotes: updated };
    }),

  favoriteComparisons: loadFromStorage('favoriteComparisons', []),
  addFavoriteComparison: (comp) =>
    set((state) => {
      const newComp: FavoriteComparison = {
        ...comp,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: Date.now(),
      };
      const updated = [...state.favoriteComparisons, newComp];
      saveToStorage('favoriteComparisons', updated);
      return { favoriteComparisons: updated };
    }),
  deleteFavoriteComparison: (id) =>
    set((state) => {
      const updated = state.favoriteComparisons.filter((c) => c.id !== id);
      saveToStorage('favoriteComparisons', updated);
      return { favoriteComparisons: updated };
    }),
  updateFavoriteComparison: (id, updates) =>
    set((state) => {
      const updated = state.favoriteComparisons.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      saveToStorage('favoriteComparisons', updated);
      return { favoriteComparisons: updated };
    }),
}));
