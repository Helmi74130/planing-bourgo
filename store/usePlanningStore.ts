import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { PlanningStore, PlanningData, Course, Terrain, Coach, TypeCours } from '@/types';

const STORAGE_KEY = 'bourgo_arena_planning';
const MAX_HISTORY = 10;

const defaultData: PlanningData = {
  sports_complex: 'Bourgo Arena',
  primary_color: '#82FF13',
  dark_color: '#000000',
  horaires: {
    ouverture: '08:00',
    fermeture: '22:00',
  },
  terrains: [
    { id: uuidv4(), nom: 'Court 1' },
    { id: uuidv4(), nom: 'Court 2' },
    { id: uuidv4(), nom: 'Terrain 1' },
  ],
  coaches: [
    { id: uuidv4(), nom: 'Jean Dupont' },
    { id: uuidv4(), nom: 'Marie Martin' },
    { id: uuidv4(), nom: 'Pierre Durand' },
  ],
  types_cours: [
    { id: uuidv4(), nom: 'Padel', couleur: '#3b82f6', description: 'Cours de padel' },
    { id: uuidv4(), nom: 'Boxe', couleur: '#ef4444', description: 'Cours de boxe' },
    { id: uuidv4(), nom: 'Basketball', couleur: '#f59e0b', description: 'Cours de basketball' },
    { id: uuidv4(), nom: 'Fitness', couleur: '#10b981', description: 'Cours de fitness' },
  ],
  planning: [],
};

// Load from localStorage
const loadFromStorage = (): PlanningData => {
  if (typeof window === 'undefined') return defaultData;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as PlanningData;
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return defaultData;
};

// Save to localStorage
const saveToStorage = (data: PlanningData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Create a snapshot of current state
const createSnapshot = (state: PlanningStore): PlanningData => ({
  sports_complex: state.sports_complex,
  primary_color: state.primary_color,
  dark_color: state.dark_color,
  horaires: state.horaires,
  terrains: state.terrains,
  coaches: state.coaches,
  types_cours: state.types_cours,
  planning: state.planning,
});

export const usePlanningStore = create<PlanningStore>((set, get) => {
  const initialData = loadFromStorage();

  // Auto-save every 30 seconds
  if (typeof window !== 'undefined') {
    setInterval(() => {
      const state = get();
      saveToStorage(createSnapshot(state));
    }, 30000);
  }

  return {
    ...initialData,
    history: [],
    currentHistoryIndex: -1,

    // Helper to add to history
    _addToHistory: () => {
      const state = get();
      const snapshot = createSnapshot(state);
      const newHistory = state.history.slice(0, state.currentHistoryIndex + 1);
      newHistory.push(snapshot);

      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }

      set({
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1,
      });
    },

    // Courses
    addCourse: (course) => {
      const state = get();
      (state as any)._addToHistory();

      const newCourse: Course = {
        ...course,
        id: uuidv4(),
      };

      set({ planning: [...state.planning, newCourse] });
      saveToStorage(createSnapshot(get()));
    },

    updateCourse: (id, updates) => {
      const state = get();
      (state as any)._addToHistory();

      set({
        planning: state.planning.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      });
      saveToStorage(createSnapshot(get()));
    },

    deleteCourse: (id) => {
      const state = get();
      (state as any)._addToHistory();

      set({
        planning: state.planning.filter((c) => c.id !== id),
      });
      saveToStorage(createSnapshot(get()));
    },

    moveCourse: (courseId, newDay, newStartTime) => {
      const state = get();
      const course = state.planning.find((c) => c.id === courseId);
      if (!course) return;

      (state as any)._addToHistory();

      const startParts = course.heure_debut.split(':');
      const endParts = course.heure_fin.split(':');
      const newStartParts = newStartTime.split(':');

      const duration = (parseInt(endParts[0]) * 60 + parseInt(endParts[1])) -
                      (parseInt(startParts[0]) * 60 + parseInt(startParts[1]));

      const newEndMinutes = parseInt(newStartParts[0]) * 60 + parseInt(newStartParts[1]) + duration;
      const newEndHour = Math.floor(newEndMinutes / 60);
      const newEndMinute = newEndMinutes % 60;
      const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`;

      set({
        planning: state.planning.map((c) =>
          c.id === courseId
            ? { ...c, jour_semaine: newDay, heure_debut: newStartTime, heure_fin: newEndTime }
            : c
        ),
      });
      saveToStorage(createSnapshot(get()));
    },

    // Terrains
    addTerrain: (terrain) => {
      const state = get();
      (state as any)._addToHistory();

      const newTerrain: Terrain = {
        ...terrain,
        id: uuidv4(),
      };

      set({ terrains: [...state.terrains, newTerrain] });
      saveToStorage(createSnapshot(get()));
    },

    updateTerrain: (id, updates) => {
      const state = get();
      (state as any)._addToHistory();

      set({
        terrains: state.terrains.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      });
      saveToStorage(createSnapshot(get()));
    },

    deleteTerrain: (id) => {
      const state = get();
      (state as any)._addToHistory();

      set({
        terrains: state.terrains.filter((t) => t.id !== id),
        planning: state.planning.map((c) =>
          c.terrain_id === id ? { ...c, terrain_id: null } : c
        ),
      });
      saveToStorage(createSnapshot(get()));
    },

    // Coaches
    addCoach: (coach) => {
      const state = get();
      (state as any)._addToHistory();

      const newCoach: Coach = {
        ...coach,
        id: uuidv4(),
      };

      set({ coaches: [...state.coaches, newCoach] });
      saveToStorage(createSnapshot(get()));
    },

    updateCoach: (id, updates) => {
      const state = get();
      (state as any)._addToHistory();

      set({
        coaches: state.coaches.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      });
      saveToStorage(createSnapshot(get()));
    },

    deleteCoach: (id) => {
      const state = get();
      (state as any)._addToHistory();

      set({
        coaches: state.coaches.filter((c) => c.id !== id),
        planning: state.planning.map((c) =>
          c.coach_id === id ? { ...c, coach_id: null } : c
        ),
      });
      saveToStorage(createSnapshot(get()));
    },

    // Types de cours
    addCourseType: (type) => {
      const state = get();
      (state as any)._addToHistory();

      const newType: TypeCours = {
        ...type,
        id: uuidv4(),
      };

      set({ types_cours: [...state.types_cours, newType] });
      saveToStorage(createSnapshot(get()));
    },

    updateCourseType: (id, updates) => {
      const state = get();
      (state as any)._addToHistory();

      set({
        types_cours: state.types_cours.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      });
      saveToStorage(createSnapshot(get()));
    },

    deleteCourseType: (id) => {
      const state = get();
      (state as any)._addToHistory();

      set({
        types_cours: state.types_cours.filter((t) => t.id !== id),
        planning: state.planning.filter((c) => c.type_cours_id !== id),
      });
      saveToStorage(createSnapshot(get()));
    },

    // Import/Export
    loadPlanningFromJSON: (data) => {
      const state = get();
      (state as any)._addToHistory();

      set({
        ...data,
        history: state.history,
        currentHistoryIndex: state.currentHistoryIndex,
      });
      saveToStorage(data);
    },

    exportPlanningJSON: () => {
      return createSnapshot(get());
    },

    // Undo/Redo
    undo: () => {
      const state = get();
      if (state.currentHistoryIndex > 0) {
        const previousState = state.history[state.currentHistoryIndex - 1];
        set({
          ...previousState,
          history: state.history,
          currentHistoryIndex: state.currentHistoryIndex - 1,
        });
        saveToStorage(previousState);
      }
    },

    redo: () => {
      const state = get();
      if (state.currentHistoryIndex < state.history.length - 1) {
        const nextState = state.history[state.currentHistoryIndex + 1];
        set({
          ...nextState,
          history: state.history,
          currentHistoryIndex: state.currentHistoryIndex + 1,
        });
        saveToStorage(nextState);
      }
    },

    canUndo: () => {
      const state = get();
      return state.currentHistoryIndex > 0;
    },

    canRedo: () => {
      const state = get();
      return state.currentHistoryIndex < state.history.length - 1;
    },

    // Reset
    reset: () => {
      set({
        ...defaultData,
        history: [],
        currentHistoryIndex: -1,
      });
      saveToStorage(defaultData);
    },
  };
});
