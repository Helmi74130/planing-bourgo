'use client';

import Link from 'next/link';
import { Monitor, Settings } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-black to-primary/10 p-4">
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Logo & Title */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-2xl shadow-2xl shadow-primary/50">
            <span className="text-5xl font-bold text-black">BA</span>
          </div>
          <h1 className="text-6xl font-bold text-white tracking-tight">Bourgo Arena</h1>
          <p className="text-xl text-muted-foreground">
            Système de gestion d&apos;emploi du temps sportif
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Admin Card */}
          <Link
            href="/admin"
            className="group relative overflow-hidden bg-card border-2 border-primary rounded-2xl p-8 hover:border-primary/80 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white">Administration</h2>
              <p className="text-muted-foreground">
                Gérer les cours, terrains, coaches et types de cours. Modifier le planning avec
                drag & drop.
              </p>
              <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                Accéder à l&apos;admin
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* Display Card */}
          <Link
            href="/display"
            className="group relative overflow-hidden bg-card border-2 border-primary rounded-2xl p-8 hover:border-primary/80 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Monitor className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white">Affichage</h2>
              <p className="text-muted-foreground">
                Vue lecture seule optimisée pour écran géant. Affichage en temps réel du planning
                hebdomadaire.
              </p>
              <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                Voir le planning
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-semibold">
            Fonctionnalités
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white">
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-2xl mb-2">🗓️</div>
              <div className="font-semibold">Planning 7 jours</div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold">Drag & Drop</div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-2xl mb-2">💾</div>
              <div className="font-semibold">Auto-save</div>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <div className="text-2xl mb-2">📤</div>
              <div className="font-semibold">Import/Export</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
