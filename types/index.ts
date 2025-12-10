export interface Terrain {
  id: string;
  nom: string;
}

export interface Coach {
  id: string;
  nom: string;
}

export interface TypeCours {
  id: string;
  nom: string;
  couleur: string;
  description?: string;
}

export interface Course {
  id: string;
  type_cours_id: string;
  jour_semaine: number; // 0=lundi, 6=dimanche
  heure_debut: string; // "HH:mm"
  heure_fin: string; // "HH:mm"
  terrain_id: string | null;
  coach_id: string | null;
  couleur_custom: string | null;
  capacite?: number;
}

export interface PlanningData {
  sports_complex: string;
  primary_color: string;
  dark_color: string;
  horaires: {
    ouverture: string;
    fermeture: string;
  };
  terrains: Terrain[];
  coaches: Coach[];
  types_cours: TypeCours[];
  planning: Course[];
}

export interface PlanningState {
  sports_complex: string;
  primary_color: string;
  dark_color: string;
  horaires: {
    ouverture: string;
    fermeture: string;
  };
  terrains: Terrain[];
  coaches: Coach[];
  types_cours: TypeCours[];
  planning: Course[];
  history: PlanningData[];
  currentHistoryIndex: number;
}

export interface PlanningActions {
  // Courses
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  moveCourse: (courseId: string, newDay: number, newStartTime: string) => void;

  // Terrains
  addTerrain: (terrain: Omit<Terrain, 'id'>) => void;
  updateTerrain: (id: string, terrain: Partial<Terrain>) => void;
  deleteTerrain: (id: string) => void;

  // Coaches
  addCoach: (coach: Omit<Coach, 'id'>) => void;
  updateCoach: (id: string, coach: Partial<Coach>) => void;
  deleteCoach: (id: string) => void;

  // Types de cours
  addCourseType: (type: Omit<TypeCours, 'id'>) => void;
  updateCourseType: (id: string, type: Partial<TypeCours>) => void;
  deleteCourseType: (id: string) => void;

  // Import/Export
  loadPlanningFromJSON: (data: PlanningData) => void;
  exportPlanningJSON: () => PlanningData;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Utilities
  reset: () => void;
}

export type PlanningStore = PlanningState & PlanningActions;
