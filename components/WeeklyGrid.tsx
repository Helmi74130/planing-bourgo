'use client';

import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { usePlanningStore } from '@/store/usePlanningStore';
import { CourseCard } from './CourseCard';
import { Plus } from 'lucide-react';
import type { Course } from '@/types';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

interface WeeklyGridProps {
  isAdmin?: boolean;
  onAddCourse?: (day: number, time: string) => void;
  onEditCourse?: (course: Course) => void;
}

export function WeeklyGrid({ isAdmin = false, onAddCourse, onEditCourse }: WeeklyGridProps) {
  const {
    planning,
    types_cours,
    terrains,
    coaches,
    horaires,
    deleteCourse,
    moveCourse,
  } = usePlanningStore();

  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Generate time slots
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const [startHour] = horaires.ouverture.split(':').map(Number);
    const [endHour] = horaires.fermeture.split(':').map(Number);

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    return slots;
  }, [horaires]);

  const handleDragStart = (event: DragStartEvent) => {
    const course = planning.find((c) => c.id === event.active.id);
    if (course) {
      setActiveCourse(course);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const courseId = active.id as string;
      const dropTarget = over.id as string;

      // Parse drop target: "day-X-time-HH:MM"
      const match = dropTarget.match(/^day-(\d+)-time-(.+)$/);
      if (match) {
        const newDay = parseInt(match[1]);
        const newTime = match[2];
        moveCourse(courseId, newDay, newTime);
      }
    }

    setActiveCourse(null);
  };

  const handleDragCancel = () => {
    setActiveCourse(null);
  };

  const getCourseForSlot = (day: number, time: string) => {
    return planning.filter((course) => {
      if (course.jour_semaine !== day) return false;

      const slotMinutes = parseTimeToMinutes(time);
      const startMinutes = parseTimeToMinutes(course.heure_debut);
      const endMinutes = parseTimeToMinutes(course.heure_fin);

      return slotMinutes >= startMinutes && slotMinutes < endMinutes;
    });
  };

  const parseTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getCourseDuration = (course: Course): number => {
    const start = parseTimeToMinutes(course.heure_debut);
    const end = parseTimeToMinutes(course.heure_fin);
    return Math.ceil((end - start) / 30); // Number of 30-minute slots
  };

  const isStartOfCourse = (course: Course, time: string): boolean => {
    return course.heure_debut === time;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="overflow-auto">
        <div className="min-w-max">
          <div className="grid grid-cols-[100px_repeat(7,minmax(180px,1fr))] gap-px bg-border">
            {/* Header with days */}
            <div className="bg-card p-3 font-semibold text-center border-b-2 border-primary">
              Horaire
            </div>
            {DAYS.map((day, index) => (
              <div
                key={day}
                className="bg-card p-3 font-semibold text-center border-b-2 border-primary"
              >
                {day}
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((time) => (
              <div key={time} className="contents">
                <div className="bg-card p-3 text-sm font-medium text-center border-r border-border">
                  {time}
                </div>

                {DAYS.map((_, dayIndex) => {
                  const coursesInSlot = getCourseForSlot(dayIndex, time);
                  const droppableId = `day-${dayIndex}-time-${time}`;

                  return (
                    <SortableContext
                      key={droppableId}
                      id={droppableId}
                      items={coursesInSlot.map((c) => c.id)}
                      strategy={rectSortingStrategy}
                    >
                      <div
                        className="bg-secondary min-h-[60px] p-2 relative hover:bg-muted/50 transition-colors"
                      >
                        {coursesInSlot.map((course) => {
                          const isStart = isStartOfCourse(course, time);
                          if (!isStart) return null;

                          const duration = getCourseDuration(course);
                          const typeCours = types_cours.find(
                            (t) => t.id === course.type_cours_id
                          );
                          const terrain = terrains.find(
                            (t) => t.id === course.terrain_id
                          );
                          const coach = coaches.find((c) => c.id === course.coach_id);

                          return (
                            <div
                              key={course.id}
                              style={{
                                gridRow: `span ${duration}`,
                              }}
                            >
                              <CourseCard
                                course={course}
                                typeCours={typeCours}
                                terrain={terrain}
                                coach={coach}
                                isDraggable={isAdmin}
                                onEdit={
                                  onEditCourse
                                    ? () => onEditCourse(course)
                                    : undefined
                                }
                                onDelete={
                                  isAdmin
                                    ? () => {
                                        if (
                                          confirm(
                                            'Êtes-vous sûr de vouloir supprimer ce cours?'
                                          )
                                        ) {
                                          deleteCourse(course.id);
                                        }
                                      }
                                    : undefined
                                }
                              />
                            </div>
                          );
                        })}

                        {isAdmin && coursesInSlot.length === 0 && (
                          <button
                            onClick={() => onAddCourse?.(dayIndex, time)}
                            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity group"
                          >
                            <div className="bg-primary/20 border-2 border-dashed border-primary rounded-lg p-2">
                              <Plus className="w-6 h-6 text-primary" />
                            </div>
                          </button>
                        )}
                      </div>
                    </SortableContext>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeCourse && (
          <div className="opacity-90 rotate-3 scale-105">
            <CourseCard
              course={activeCourse}
              typeCours={types_cours.find((t) => t.id === activeCourse.type_cours_id)}
              terrain={terrains.find((t) => t.id === activeCourse.terrain_id)}
              coach={coaches.find((c) => c.id === activeCourse.coach_id)}
              isDraggable={false}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
