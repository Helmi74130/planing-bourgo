'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePlanningStore } from '@/store/usePlanningStore';
import type { Course } from '@/types';

interface CourseFormProps {
  course?: Course;
  defaultDay?: number;
  defaultTime?: string;
  onClose: () => void;
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export function CourseForm({ course, defaultDay, defaultTime, onClose }: CourseFormProps) {
  const { types_cours, terrains, coaches, addCourse, updateCourse } = usePlanningStore();

  const [formData, setFormData] = useState({
    type_cours_id: course?.type_cours_id || '',
    jour_semaine: course?.jour_semaine ?? defaultDay ?? 0,
    heure_debut: course?.heure_debut || defaultTime || '09:00',
    heure_fin: course?.heure_fin || '10:00',
    terrain_id: course?.terrain_id || '',
    coach_id: course?.coach_id || '',
    couleur_custom: course?.couleur_custom || '',
    capacite: course?.capacite || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = {
      type_cours_id: formData.type_cours_id,
      jour_semaine: formData.jour_semaine,
      heure_debut: formData.heure_debut,
      heure_fin: formData.heure_fin,
      terrain_id: formData.terrain_id || null,
      coach_id: formData.coach_id || null,
      couleur_custom: formData.couleur_custom || null,
      capacite: formData.capacite > 0 ? formData.capacite : undefined,
    };

    // Validation
    if (!courseData.type_cours_id) {
      alert('Veuillez sélectionner un type de cours');
      return;
    }

    const startMinutes = parseTimeToMinutes(courseData.heure_debut);
    const endMinutes = parseTimeToMinutes(courseData.heure_fin);

    if (startMinutes >= endMinutes) {
      alert('L\'heure de fin doit être après l\'heure de début');
      return;
    }

    if (course) {
      updateCourse(course.id, courseData);
    } else {
      addCourse(courseData);
    }

    onClose();
  };

  const parseTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const selectedType = types_cours.find((t) => t.id === formData.type_cours_id);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-primary">
        <div className="sticky top-0 bg-card border-b-2 border-primary p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {course ? 'Modifier le cours' : 'Ajouter un cours'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type de cours */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Type de cours *
            </label>
            <select
              value={formData.type_cours_id}
              onChange={(e) =>
                setFormData({ ...formData, type_cours_id: e.target.value })
              }
              className="w-full px-4 py-2 rounded bg-secondary text-white border-2 border-border focus:border-primary focus:outline-none"
              required
            >
              <option value="">Sélectionner un type</option>
              {types_cours.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Jour de la semaine */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Jour de la semaine *
            </label>
            <select
              value={formData.jour_semaine}
              onChange={(e) =>
                setFormData({ ...formData, jour_semaine: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 rounded bg-secondary text-white border-2 border-border focus:border-primary focus:outline-none"
              required
            >
              {DAYS.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Horaires */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Heure de début *
              </label>
              <input
                type="time"
                value={formData.heure_debut}
                onChange={(e) =>
                  setFormData({ ...formData, heure_debut: e.target.value })
                }
                className="w-full px-4 py-2 rounded bg-secondary text-white border-2 border-border focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Heure de fin *
              </label>
              <input
                type="time"
                value={formData.heure_fin}
                onChange={(e) =>
                  setFormData({ ...formData, heure_fin: e.target.value })
                }
                className="w-full px-4 py-2 rounded bg-secondary text-white border-2 border-border focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Terrain */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Terrain (optionnel)
            </label>
            <select
              value={formData.terrain_id}
              onChange={(e) =>
                setFormData({ ...formData, terrain_id: e.target.value })
              }
              className="w-full px-4 py-2 rounded bg-secondary text-white border-2 border-border focus:border-primary focus:outline-none"
            >
              <option value="">Aucun terrain</option>
              {terrains.map((terrain) => (
                <option key={terrain.id} value={terrain.id}>
                  {terrain.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Coach */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Coach (optionnel)
            </label>
            <select
              value={formData.coach_id}
              onChange={(e) =>
                setFormData({ ...formData, coach_id: e.target.value })
              }
              className="w-full px-4 py-2 rounded bg-secondary text-white border-2 border-border focus:border-primary focus:outline-none"
            >
              <option value="">Aucun coach</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Couleur personnalisée */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Couleur personnalisée (optionnel)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={formData.couleur_custom || selectedType?.couleur || '#82FF13'}
                onChange={(e) =>
                  setFormData({ ...formData, couleur_custom: e.target.value })
                }
                className="w-20 h-10 rounded cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, couleur_custom: '' })}
                className="text-sm text-muted-foreground hover:text-white"
              >
                Utiliser la couleur par défaut
              </button>
            </div>
          </div>

          {/* Capacité */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Capacité / Nombre de places (optionnel)
            </label>
            <input
              type="number"
              min="0"
              value={formData.capacite}
              onChange={(e) =>
                setFormData({ ...formData, capacite: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 rounded bg-secondary text-white border-2 border-border focus:border-primary focus:outline-none"
              placeholder="Ex: 20"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded bg-secondary text-white font-semibold hover:bg-muted transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-primary text-black font-semibold hover:bg-primary/90 transition-colors"
            >
              {course ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
