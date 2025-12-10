'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { WeeklyGrid } from '@/components/WeeklyGrid';

export default function DisplayPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-black">
      <Header isAdmin={false} />

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Planning de la Semaine</h2>
            <p className="text-lg text-primary font-semibold">
              {currentTime.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-primary">
              {currentTime.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>

        <div className="bg-card/50 rounded-lg p-4 border-2 border-primary/30">
          <WeeklyGrid isAdmin={false} />
        </div>
      </div>
    </div>
  );
}
