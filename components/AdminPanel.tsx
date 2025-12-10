'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { usePlanningStore } from '@/store/usePlanningStore';

type PanelSection = 'terrains' | 'coaches' | 'types';

export function AdminPanel() {
  const {
    terrains,
    coaches,
    types_cours,
    addTerrain,
    updateTerrain,
    deleteTerrain,
    addCoach,
    updateCoach,
    deleteCoach,
    addCourseType,
    updateCourseType,
    deleteCourseType,
  } = usePlanningStore();

  const [expandedSection, setExpandedSection] = useState<PanelSection | null>('types');
  const [editingItem, setEditingItem] = useState<{ type: PanelSection; id: string | null }>({
    type: 'terrains',
    id: null,
  });
  const [formData, setFormData] = useState({ nom: '', couleur: '#82FF13', description: '' });

  const toggleSection = (section: PanelSection) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const startAdd = (type: PanelSection) => {
    setEditingItem({ type, id: null });
    setFormData({ nom: '', couleur: '#82FF13', description: '' });
  };

  const startEdit = (type: PanelSection, id: string) => {
    setEditingItem({ type, id });

    if (type === 'terrains') {
      const item = terrains.find((t) => t.id === id);
      if (item) setFormData({ nom: item.nom, couleur: '', description: '' });
    } else if (type === 'coaches') {
      const item = coaches.find((c) => c.id === id);
      if (item) setFormData({ nom: item.nom, couleur: '', description: '' });
    } else if (type === 'types') {
      const item = types_cours.find((t) => t.id === id);
      if (item)
        setFormData({
          nom: item.nom,
          couleur: item.couleur,
          description: item.description || '',
        });
    }
  };

  const cancelEdit = () => {
    setEditingItem({ type: 'terrains', id: null });
    setFormData({ nom: '', couleur: '#82FF13', description: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom.trim()) {
      alert('Le nom est requis');
      return;
    }

    const { type, id } = editingItem;

    if (type === 'terrains') {
      if (id) {
        updateTerrain(id, { nom: formData.nom });
      } else {
        addTerrain({ nom: formData.nom });
      }
    } else if (type === 'coaches') {
      if (id) {
        updateCoach(id, { nom: formData.nom });
      } else {
        addCoach({ nom: formData.nom });
      }
    } else if (type === 'types') {
      if (id) {
        updateCourseType(id, {
          nom: formData.nom,
          couleur: formData.couleur,
          description: formData.description || undefined,
        });
      } else {
        addCourseType({
          nom: formData.nom,
          couleur: formData.couleur,
          description: formData.description || undefined,
        });
      }
    }

    cancelEdit();
  };

  const handleDelete = (type: PanelSection, id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément?')) return;

    if (type === 'terrains') {
      deleteTerrain(id);
    } else if (type === 'coaches') {
      deleteCoach(id);
    } else if (type === 'types') {
      deleteCourseType(id);
    }
  };

  return (
    <div className="w-80 bg-card border-r-2 border-primary overflow-y-auto">
      <div className="p-4 border-b-2 border-primary">
        <h2 className="text-lg font-bold text-white">Gestion</h2>
      </div>

      <div className="divide-y divide-border">
        {/* Types de cours */}
        <div>
          <button
            onClick={() => toggleSection('types')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors"
          >
            <span className="font-semibold text-white">Types de cours</span>
            {expandedSection === 'types' ? (
              <ChevronDown className="w-5 h-5 text-primary" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {expandedSection === 'types' && (
            <div className="p-4 space-y-2 bg-secondary/30">
              {types_cours.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-2 rounded bg-secondary hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: type.couleur }}
                    />
                    <span className="text-sm text-white truncate">{type.nom}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit('types', type.id)}
                      className="p-1 rounded hover:bg-primary/20"
                    >
                      <Pencil className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete('types', type.id)}
                      className="p-1 rounded hover:bg-destructive/20"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => startAdd('types')}
                className="w-full py-2 px-3 rounded bg-primary/10 border-2 border-dashed border-primary text-primary font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          )}
        </div>

        {/* Terrains */}
        <div>
          <button
            onClick={() => toggleSection('terrains')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors"
          >
            <span className="font-semibold text-white">Terrains</span>
            {expandedSection === 'terrains' ? (
              <ChevronDown className="w-5 h-5 text-primary" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {expandedSection === 'terrains' && (
            <div className="p-4 space-y-2 bg-secondary/30">
              {terrains.map((terrain) => (
                <div
                  key={terrain.id}
                  className="flex items-center justify-between p-2 rounded bg-secondary hover:bg-muted transition-colors group"
                >
                  <span className="text-sm text-white truncate">{terrain.nom}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit('terrains', terrain.id)}
                      className="p-1 rounded hover:bg-primary/20"
                    >
                      <Pencil className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete('terrains', terrain.id)}
                      className="p-1 rounded hover:bg-destructive/20"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => startAdd('terrains')}
                className="w-full py-2 px-3 rounded bg-primary/10 border-2 border-dashed border-primary text-primary font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          )}
        </div>

        {/* Coaches */}
        <div>
          <button
            onClick={() => toggleSection('coaches')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors"
          >
            <span className="font-semibold text-white">Coaches</span>
            {expandedSection === 'coaches' ? (
              <ChevronDown className="w-5 h-5 text-primary" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {expandedSection === 'coaches' && (
            <div className="p-4 space-y-2 bg-secondary/30">
              {coaches.map((coach) => (
                <div
                  key={coach.id}
                  className="flex items-center justify-between p-2 rounded bg-secondary hover:bg-muted transition-colors group"
                >
                  <span className="text-sm text-white truncate">{coach.nom}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit('coaches', coach.id)}
                      className="p-1 rounded hover:bg-primary/20"
                    >
                      <Pencil className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete('coaches', coach.id)}
                      className="p-1 rounded hover:bg-destructive/20"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => startAdd('coaches')}
                className="w-full py-2 px-3 rounded bg-primary/10 border-2 border-dashed border-primary text-primary font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Form Modal */}
      {editingItem.id !== null || (editingItem.id === null && formData.nom !== '' && editingItem.type) ? (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full border-2 border-primary">
            <div className="p-4 border-b-2 border-primary">
              <h3 className="text-lg font-bold text-white">
                {editingItem.id ? 'Modifier' : 'Ajouter'}{' '}
                {editingItem.type === 'terrains'
                  ? 'un terrain'
                  : editingItem.type === 'coaches'
                  ? 'un coach'
                  : 'un type de cours'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-2 rounded bg-secondary text-white border-2 border-border focus:border-primary focus:outline-none"
                  placeholder="Nom"
                  required
                  autoFocus
                />
              </div>

              {editingItem.type === 'types' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Couleur *
                    </label>
                    <input
                      type="color"
                      value={formData.couleur}
                      onChange={(e) =>
                        setFormData({ ...formData, couleur: e.target.value })
                      }
                      className="w-20 h-10 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded bg-secondary text-white border-2 border-border focus:border-primary focus:outline-none"
                      placeholder="Description (optionnelle)"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded bg-secondary text-white font-semibold hover:bg-muted transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-primary text-black font-semibold hover:bg-primary/90 transition-colors"
                >
                  {editingItem.id ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
