'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import type { Course, TypeCours, Terrain, Coach } from '@/types';

interface CourseCardProps {
  course: Course;
  typeCours: TypeCours | undefined;
  terrain: Terrain | undefined;
  coach: Coach | undefined;
  onEdit?: () => void;
  onDelete?: () => void;
  isDraggable?: boolean;
}

export function CourseCard({
  course,
  typeCours,
  terrain,
  coach,
  onEdit,
  onDelete,
  isDraggable = false,
}: CourseCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: course.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const color = course.couleur_custom || typeCours?.couleur || '#82FF13';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg p-3 shadow-lg border-2 ${
        isDragging ? 'ring-2 ring-primary ring-offset-2 ring-offset-black' : ''
      }`}
      {...attributes}
    >
      <div
        className="absolute inset-0 rounded-lg opacity-90"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-black text-sm truncate">
              {typeCours?.nom || 'Cours'}
            </h3>
            <p className="text-xs text-black/80 font-medium">
              {course.heure_debut} - {course.heure_fin}
            </p>
          </div>

          {isDraggable && (
            <div className="flex items-center gap-1">
              <button
                {...listeners}
                className="p-1 rounded hover:bg-black/10 transition-colors cursor-grab active:cursor-grabbing"
                title="Déplacer"
              >
                <GripVertical className="w-4 h-4 text-black" />
              </button>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-1 rounded hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4 text-black" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-1 rounded hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4 text-black" />
                </button>
              )}
            </div>
          )}
        </div>

        {(terrain || coach) && (
          <div className="space-y-1 text-xs text-black/90">
            {terrain && (
              <div className="flex items-center gap-1">
                <span className="font-semibold">📍</span>
                <span className="truncate">{terrain.nom}</span>
              </div>
            )}
            {coach && (
              <div className="flex items-center gap-1">
                <span className="font-semibold">👤</span>
                <span className="truncate">{coach.nom}</span>
              </div>
            )}
          </div>
        )}

        {course.capacite && (
          <div className="mt-1 text-xs text-black/80 font-medium">
            {course.capacite} places
          </div>
        )}
      </div>
    </div>
  );
}
