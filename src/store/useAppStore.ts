
import { create } from 'zustand';
import type { TabType, ChiefComplaintType, PatientAttributes, PersonalSpeech, ReviewRecord, FavoriteComparison } from '@/types';

function inferSourceFromTags(tags: string[]): PersonalSpeech['source'] {
  if (tags.includes('接诊收藏')) return 'consult_collect';
  if (tags.includes('手动沉淀')) return 'review_manual';
  if (tags.includes('自动沉淀')) return 'review_auto';
  return 'manual_edit';
}

function migratePersonalSpeech(speech: PersonalSpeech): PersonalSpeech {
  return {
    ...speech,
    updatedAt: speech.updatedAt || speech.createdAt,
    source: speech.source || inferSourceFromTags(speech.tags),
  };
}

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    if (key === 'personalSpeeches' && Array.isArray(parsed)) {
      return parsed.map(migratePersonalSpeech) as T;
    }
    return parsed;
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

interface AppState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedComplaint: ChiefComplaintType | null;
  setSelectedComplaint: (type: ChiefComplaintType | null) => void;
  patientAttributes: PatientAttributes;
  setPatientAttributes: (attrs: Partial<PatientAttributes>) => void;
  personalSpeeches: PersonalSpeech[];
  addPersonalSpeech: (speech: Omit<PersonalSpeech, 'id' | 'createdAt' | 'updatedAt'> & { reviewId?: string }) => string;
  updatePersonalSpeech: (id: string, updates: Partial<Pick<PersonalSpeech, 'content' | 'category' | 'tags'>>) => void;
  deletePersonalSpeech: (id: string) => void;
  batchUpdateCategory: (ids: string[], category: string) => void;
  addTagToSpeeches: (ids: string[], tag: string) => void;
  removeTagFromSpeech: (id: string, tag: string) => void;
  reviewRecords: ReviewRecord[];
  addReviewRecord: (record: Omit<ReviewRecord, 'id' | 'createdAt'>) => string;
  comparisonNotes: Record<string, string>;
  setComparisonNote: (pairKey: string, note: string) => void;
  getComparisonNote: (treatmentA: string, treatmentB: string) => string;
  favoriteComparisons: FavoriteComparison[];
  addFavoriteComparison: (comp: Omit<FavoriteComparison, 'id' | 'createdAt'>) => void;
  deleteFavoriteComparison: (id: string) => void;
  updateFavoriteComparison: (id: string, updates: Partial<FavoriteComparison>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
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
    const now = Date.now();
    const newSpeech: PersonalSpeech = {
      ...speech,
      id,
      createdAt: now,
      updatedAt: now,
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
        s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
      );
      saveToStorage('personalSpeeches', updated);
      return { personalSpeeches: updated };
    }),
  batchUpdateCategory: (ids, category) =>
    set((state) => {
      const updated = state.personalSpeeches.map((s) =>
        ids.includes(s.id) ? { ...s, category, updatedAt: Date.now() } : s
      );
      saveToStorage('personalSpeeches', updated);
      return { personalSpeeches: updated };
    }),
  addTagToSpeeches: (ids, tag) =>
    set((state) => {
      const updated = state.personalSpeeches.map((s) =>
        ids.includes(s.id) && !s.tags.includes(tag)
          ? { ...s, tags: [...s.tags, tag], updatedAt: Date.now() }
          : s
      );
      saveToStorage('personalSpeeches', updated);
      return { personalSpeeches: updated };
    }),
  removeTagFromSpeech: (id, tag) =>
    set((state) => {
      const updated = state.personalSpeeches.map((s) =>
        s.id === id
          ? { ...s, tags: s.tags.filter((t) => t !== tag), updatedAt: Date.now() }
          : s
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

    if (newRecord.speechIds && newRecord.speechIds.length > 0) {
      set((state) => {
        const updatedSpeeches = state.personalSpeeches.map((s) =>
          newRecord.speechIds!.includes(s.id) ? { ...s, reviewId: id, updatedAt: Date.now() } : s
        );
        saveToStorage('personalSpeeches', updatedSpeeches);
        return { personalSpeeches: updatedSpeeches };
      });
    }

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
      const [a, b] = pairKey.split(' vs ');
      const reverseKey = `${b} vs ${a}`;
      const updated = {
        ...state.comparisonNotes,
        [pairKey]: note,
        [reverseKey]: note,
      };
      saveToStorage('comparisonNotes', updated);
      return { comparisonNotes: updated };
    }),
  getComparisonNote: (treatmentA, treatmentB) => {
    const state = get();
    const key1 = `${treatmentA} vs ${treatmentB}`;
    const key2 = `${treatmentB} vs ${treatmentA}`;
    return state.comparisonNotes[key1] || state.comparisonNotes[key2] || '';
  },

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
