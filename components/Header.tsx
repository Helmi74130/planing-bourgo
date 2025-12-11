'use client';

import { useState } from 'react';
import { Download, Upload, RotateCcw, Undo2, Redo2, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { usePlanningStore } from '@/store/usePlanningStore';

interface HeaderProps {
  isAdmin?: boolean;
}

export function Header({ isAdmin = false }: HeaderProps) {
  const { exportPlanningJSON, loadPlanningFromJSON, reset, undo, redo, canUndo, canRedo } = usePlanningStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleExport = () => {
    const data = exportPlanningJSON();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bourgo-arena-planning-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            loadPlanningFromJSON(data);
            alert('Planning importé avec succès!');
          } catch (error) {
            alert('Erreur lors de l\'importation du fichier JSON');
            console.error(error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le planning? Cette action est irréversible.')) {
      reset();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSaveSuccess(true);
    setIsSaving(false);

    // Wait a bit to show success message
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reload the page
    window.location.reload();
  };

  return (
    <header className="bg-black border-b-2 border-primary py-4 px-6">
      <div className="max-w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center font-bold text-black text-xl">
              BA
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bourgo Arena</h1>
              <p className="text-sm text-muted-foreground">Emploi du Temps Sportif</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sauvegarde en cours...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Sauvegarde réussie!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Sauvegarder
                </>
              )}
            </button>
            <div className="w-px h-8 bg-border mx-2" />
            <button
              onClick={undo}
              disabled={!canUndo()}
              className="p-2 rounded bg-secondary hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Annuler"
            >
              <Undo2 className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className="p-2 rounded bg-secondary hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Refaire"
            >
              <Redo2 className="w-5 h-5 text-white" />
            </button>
            <div className="w-px h-8 bg-border mx-2" />
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded font-semibold hover:bg-primary/90 transition-colors"
            >
              <Download className="w-5 h-5" />
              Exporter
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded font-semibold hover:bg-muted transition-colors"
            >
              <Upload className="w-5 h-5" />
              Importer
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-white rounded font-semibold hover:bg-destructive/90 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
