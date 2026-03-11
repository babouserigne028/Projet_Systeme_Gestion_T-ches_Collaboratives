import { useState } from "react";
import { Ic } from "../../../../composants/Icons";
import Avatar from "../../../../composants/Avatar";

/* ── Section header helper ── */
const SectionTitle = ({ icon: Icon, title, count, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-indigo-600" />
      </div>
      <span className="text-xs font-bold text-gray-600 uppercase">
        {title}
        {count !== undefined && (
          <span className="ml-1 text-gray-400">({count})</span>
        )}
      </span>
    </div>
    {children}
  </div>
);

export default function CreateProjetModal({
  onClose,
  onCreate,
  loading,
  allUsers = [],
}) {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
  });
  const [selectedCollabs, setSelectedCollabs] = useState([]);
  const [chefProjet, setChefProjet] = useState("");
  const [taches, setTaches] = useState([]);
  const [newTache, setNewTache] = useState({
    titre: "",
    assigne_a: "",
    date_echeance: "",
  });
  const [collabSearch, setCollabSearch] = useState("");

  // Users that can be added as collaborators
  const availableUsers = allUsers.filter(
    (u) => !selectedCollabs.some((c) => c.id === u.id),
  );

  const filteredAvailable = availableUsers.filter((u) => {
    const q = collabSearch.toLowerCase();
    return (
      !q ||
      u.prenom.toLowerCase().includes(q) ||
      u.nom.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const addCollab = (user) => {
    setSelectedCollabs((prev) => [...prev, user]);
    setCollabSearch("");
  };

  const removeCollab = (userId) => {
    setSelectedCollabs((prev) => prev.filter((u) => u.id !== userId));
    if (String(chefProjet) === String(userId)) setChefProjet("");
    setTaches((prev) =>
      prev.map((t) =>
        String(t.assigne_a) === String(userId) ? { ...t, assigne_a: "" } : t,
      ),
    );
  };

  const addTache = () => {
    if (!newTache.titre.trim()) return;
    setTaches((prev) => [...prev, { ...newTache, id: Date.now() }]);
    setNewTache({ titre: "", assigne_a: "", date_echeance: "" });
  };

  const removeTache = (id) => {
    setTaches((prev) => prev.filter((t) => t.id !== id));
  };

  const isFormValid = formData.titre.trim() && formData.description.trim();

  const handleSubmit = async () => {
    if (!isFormValid) return;
    await onCreate({
      ...formData,
      collaborateurs: selectedCollabs.map((u) => u.id),
      chef_projet: chefProjet || null,
      taches: taches.map(({ id, ...rest }) => rest),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ animation: "scaleIn .25s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Ic.Book className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Nouveau projet
              </h3>
              <p className="text-[11px] text-gray-400">
                Renseignez les informations, ajoutez des participants et des
                tâches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors"
          >
            <Ic.X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* ── Section 1: Infos projet ── */}
          <SectionTitle icon={Ic.Edit} title="Informations du projet">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) =>
                    setFormData({ ...formData, titre: e.target.value })
                  }
                  placeholder="Ex: Système de recommandation IA"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Décrivez les objectifs du projet..."
                  rows="3"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 resize-none transition-colors"
                />
              </div>
            </div>
          </SectionTitle>

          <div className="border-t border-gray-100" />

          {/* ── Section 2: Participants ── */}
          <SectionTitle
            icon={Ic.Users}
            title="Participants"
            count={selectedCollabs.length}
          >
            {/* Search users */}
            <div className="relative mb-2">
              <Ic.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={collabSearch}
                onChange={(e) => setCollabSearch(e.target.value)}
                placeholder="Rechercher un utilisateur..."
                className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Dropdown results */}
            {collabSearch && filteredAvailable.length > 0 && (
              <div className="border border-gray-200 rounded-lg max-h-32 overflow-y-auto mb-2">
                {filteredAvailable.slice(0, 6).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => addCollab(u)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-indigo-50 text-left text-sm transition-colors cursor-pointer"
                  >
                    <Avatar
                      ini={`${u.prenom?.[0] || ""}${u.nom?.[0] || ""}`}
                      role={u.role}
                      photo={u.photo}
                      sm
                    />
                    <span className="font-medium text-gray-700">
                      {u.prenom} {u.nom}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto capitalize">
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {collabSearch && filteredAvailable.length === 0 && (
              <p className="text-xs text-gray-400 mb-2">
                Aucun utilisateur trouvé
              </p>
            )}

            {/* Selected collaborators */}
            {selectedCollabs.length > 0 ? (
              <div className="space-y-1.5">
                {selectedCollabs.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <Avatar
                      ini={`${u.prenom?.[0] || ""}${u.nom?.[0] || ""}`}
                      role={u.role}
                      photo={u.photo}
                      sm
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">
                      {u.prenom} {u.nom}
                    </span>
                    <span className="text-[10px] text-gray-400 capitalize px-1.5 py-0.5 bg-white rounded border border-gray-200">
                      {u.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCollab(u.id)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Ic.X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 rounded-lg">
                Utilisez la recherche pour ajouter des participants
              </p>
            )}
          </SectionTitle>

          {/* ── Section 3: Chef de projet ── */}
          {selectedCollabs.length > 0 && (
            <>
              <div className="border-t border-gray-100" />
              <SectionTitle icon={Ic.TrendUp} title="Chef de projet">
                <select
                  value={chefProjet}
                  onChange={(e) => setChefProjet(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">-- Aucun --</option>
                  {selectedCollabs.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.prenom} {u.nom} ({u.role})
                    </option>
                  ))}
                </select>
              </SectionTitle>
            </>
          )}

          <div className="border-t border-gray-100" />

          {/* ── Section 4: Tâches ── */}
          <SectionTitle icon={Ic.Check} title="Tâches" count={taches.length}>
            {/* Tasks list */}
            {taches.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {taches.map((t) => {
                  const assignedUser = selectedCollabs.find(
                    (u) => String(u.id) === String(t.assigne_a),
                  );
                  return (
                    <div
                      key={t.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="w-5 h-5 rounded border-2 border-gray-300 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {t.titre}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {assignedUser && (
                            <span>
                              {assignedUser.prenom} {assignedUser.nom}
                            </span>
                          )}
                          {t.date_echeance && (
                            <span>
                              {new Date(t.date_echeance).toLocaleDateString(
                                "fr-FR",
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTache(t.id)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Ic.X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add task form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newTache.titre}
                onChange={(e) =>
                  setNewTache({ ...newTache, titre: e.target.value })
                }
                placeholder="Titre de la tâche"
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
              />
              <select
                value={newTache.assigne_a}
                onChange={(e) =>
                  setNewTache({ ...newTache, assigne_a: e.target.value })
                }
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="">Assigner à...</option>
                {selectedCollabs.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.prenom} {u.nom}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newTache.date_echeance}
                  onChange={(e) =>
                    setNewTache({ ...newTache, date_echeance: e.target.value })
                  }
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={addTache}
                  disabled={!newTache.titre.trim()}
                  className="px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <Ic.Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </SectionTitle>

          {/* Summary */}
          {(selectedCollabs.length > 0 || taches.length > 0) && (
            <>
              <div className="border-t border-gray-100" />
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                <p className="text-xs font-bold text-indigo-700 mb-1">
                  Résumé du projet
                </p>
                <div className="flex gap-4 text-xs text-indigo-600">
                  <span>{selectedCollabs.length} participant(s)</span>
                  <span>{taches.length} tâche(s)</span>
                  {chefProjet && (
                    <span>
                      Chef :{" "}
                      {selectedCollabs.find(
                        (u) => String(u.id) === String(chefProjet),
                      )?.prenom || "—"}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Création...
              </>
            ) : (
              <>
                <Ic.Plus className="w-4 h-4" /> Créer le projet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
