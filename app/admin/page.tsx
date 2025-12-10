'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { AdminPanel } from '@/components/AdminPanel';
import { WeeklyGrid } from '@/components/WeeklyGrid';
import { CourseForm } from '@/components/CourseForm';
import type { Course } from '@/types';

export default function AdminPage() {
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  const [defaultDay, setDefaultDay] = useState<number | undefined>(undefined);
  const [defaultTime, setDefaultTime] = useState<string | undefined>(undefined);

  const handleAddCourse = (day: number, time: string) => {
    setEditingCourse(undefined);
    setDefaultDay(day);
    setDefaultTime(time);
    setShowCourseForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setDefaultDay(undefined);
    setDefaultTime(undefined);
    setShowCourseForm(true);
  };

  const handleCloseCourseForm = () => {
    setShowCourseForm(false);
    setEditingCourse(undefined);
    setDefaultDay(undefined);
    setDefaultTime(undefined);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header isAdmin />

      <div className="flex-1 flex overflow-hidden">
        <AdminPanel />

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">Planning Hebdomadaire</h2>
            <p className="text-muted-foreground">
              Glissez-déposez les cours pour les déplacer. Cliquez sur une case vide pour ajouter
              un cours.
            </p>
          </div>

          <WeeklyGrid
            isAdmin
            onAddCourse={handleAddCourse}
            onEditCourse={handleEditCourse}
          />
        </div>
      </div>

      {showCourseForm && (
        <CourseForm
          course={editingCourse}
          defaultDay={defaultDay}
          defaultTime={defaultTime}
          onClose={handleCloseCourseForm}
        />
      )}
    </div>
  );
}
