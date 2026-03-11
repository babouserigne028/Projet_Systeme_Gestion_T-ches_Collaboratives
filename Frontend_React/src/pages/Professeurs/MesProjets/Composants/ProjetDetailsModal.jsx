import { useState, useEffect } from "react";
import { Ic } from "../../../../composants/Icons";
import Avatar from "../../../../composants/Avatar";
import ChatPanel from "../../../Administrateur/Projet/Composants/ChatPanel";

export default function ProjetDetailsModal({
  projet,
  onClose,
  onDelete,
  onRefresh,
  onAddCollab,
  onRemoveCollab,
  onCreateTache,
  onUpdateTache,
  onDeleteTache,
  onEditProjet,
  allUsers = [],
  addCollabLoading,
  createTacheLoading,
  onMarkRead,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [collabSearch, setCollabSearch] = useState("");
  const [newTache, setNewTache] = useState({
    titre: "",
    assigne_a: "",
    date_echeance: "",
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (activeTab === "chat" && onMarkRead) onMarkRead(projet.id);
  }, [activeTab]);

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    titre: projet.titre,
    description: projet.description,
  });
  const [tacheFilter, setTacheFilter] = useState("toutes");

  const pourcentageTaches =
    projet.nombre_taches > 0
      ? Math.round(
          (projet.nombre_taches_terminees / projet.nombre_taches) * 100,
        )
      : 0;

  const collabIds = (projet.collaborateurs || []).map((c) => c.user?.id);
  const availableUsers = allUsers.filter((u) => !collabIds.includes(u.id));
  const filteredAvailable = availableUsers.filter((u) => {
    const q = collabSearch.toLowerCase();
    return (
      !q ||
      u.prenom.toLowerCase().includes(q) ||
      u.nom.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const filteredTaches = (projet.taches || []).filter((t) => {
    if (tacheFilter === "a_faire") return t.statut === "a_faire";
    if (tacheFilter === "termine") return t.statut === "termine";
    return true;
  });

  const handleAddCollab = async (userId) => {
    await onAddCollab(projet.id, userId);
    setCollabSearch("");
  };
  const handleAddTache = async () => {
    if (!newTache.titre.trim()) return;
    await onCreateTache({
      titre: newTache.titre,
      projet: projet.id,
      assigne_a: newTache.assigne_a || projet.collaborateurs?.[0]?.user?.id,
      date_echeance: newTache.date_echeance || new Date().toISOString(),
    });
    setNewTache({ titre: "", assigne_a: "", date_echeance: "" });
  };
  const handleToggleTache = async (tache) => {
    const newStatut = tache.statut === "termine" ? "a_faire" : "termine";
    await onUpdateTache(tache.id, {
      statut: newStatut,
      ...(newStatut === "termine"
        ? { date_completion: new Date().toISOString() }
        : { date_completion: null }),
    });
  };
  const handleSaveEdit = async () => {
    if (onEditProjet && editData.titre.trim()) {
      await onEditProjet(projet.id, editData);
      setEditing(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Aperçu", icon: Ic.Eye },
    {
      id: "collaborateurs",
      label: `Participants (${projet.collaborateurs?.length || 0})`,
      icon: Ic.Users,
    },
    {
      id: "taches",
      label: `Tâches (${projet.taches?.length || 0})`,
      icon: Ic.Check,
    },
    { id: "chat", label: "Chat", icon: Ic.MessageCircle },
  ];

  const formatDate = (d) => {
    if (!d) return "--";
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/30"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm overflow-hidden"
            style={{ animation: "scaleIn .25s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                <Ic.Trash className="w-7 h-7 text-red-600" />
              </div>
              <p className="font-semibold text-gray-900">
                Supprimer ce projet ?
              </p>
              <p className="text-sm text-gray-500">
                Cette action supprimera toutes les tâches et les collaborateurs
                associés.
              </p>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => onDelete(projet.id)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-all cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
          style={{ animation: "scaleIn .25s ease" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 bg-white shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editData.titre}
                      onChange={(e) =>
                        setEditData({ ...editData, titre: e.target.value })
                      }
                      className="text-lg font-semibold text-gray-900 w-full border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-500"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      rows="2"
                      className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-500 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setEditData({
                            titre: projet.titre,
                            description: projet.description,
                          });
                        }}
                        className="px-3 py-1 text-xs font-bold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {projet.titre}
                      </h3>
                      {onEditProjet && (
                        <button
                          onClick={() => setEditing(true)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                          title="Modifier"
                        >
                          <Ic.Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Créé par {projet.createur_details?.prenom}{" "}
                      {projet.createur_details?.nom} ·{" "}
                      {formatDate(projet.date_creation)}
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors ml-2"
              >
                <Ic.X className="w-4 h-4" />
              </button>
            </div>
            {!editing && (
              <div className="flex gap-1 mt-3">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === t.id
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <t.icon className="w-3.5 h-3.5" /> {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Overview */}
            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-center">
                    <div className="text-xl font-bold text-blue-600">
                      {projet.nombre_taches}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Tâches
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-100 p-3 rounded-xl text-center">
                    <div className="text-xl font-bold text-green-600">
                      {projet.nombre_taches_terminees}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Terminées
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 p-3 rounded-xl text-center">
                    <div className="text-xl font-bold text-purple-600">
                      {pourcentageTaches}%
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Avancement
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-gray-600 uppercase">
                      Progression
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {pourcentageTaches}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-linear-to-r from-indigo-500 to-green-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${pourcentageTaches}%` }}
                    />
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase block mb-1">
                    Description
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {projet.description}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase block mb-2">
                    Participants ({projet.collaborateurs?.length || 0})
                  </span>
                  {projet.collaborateurs?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {projet.collaborateurs.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg border border-gray-200 text-xs"
                        >
                          <Avatar
                            ini={`${c.user?.prenom?.[0] || ""}${c.user?.nom?.[0] || ""}`}
                            role={c.user?.role}
                            photo={c.user?.photo}
                            sm
                          />
                          <span className="font-medium text-gray-700">
                            {c.user?.prenom} {c.user?.nom}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Aucun participant</p>
                  )}
                </div>
                {projet.taches?.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-gray-600 uppercase block mb-2">
                      Dernières tâches
                    </span>
                    <div className="space-y-1">
                      {projet.taches.slice(0, 3).map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 text-xs"
                        >
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${t.statut === "termine" ? "bg-green-500" : "bg-amber-400"}`}
                          />
                          <span
                            className={`font-medium truncate ${t.statut === "termine" ? "text-gray-400 line-through" : "text-gray-700"}`}
                          >
                            {t.titre}
                          </span>
                          {t.assigne_a_details && (
                            <span className="text-gray-400 ml-auto whitespace-nowrap">
                              {t.assigne_a_details.prenom}
                            </span>
                          )}
                        </div>
                      ))}
                      {projet.taches.length > 3 && (
                        <button
                          onClick={() => setActiveTab("taches")}
                          className="text-xs text-indigo-600 font-medium hover:underline cursor-pointer"
                        >
                          Voir toutes les tâches ({projet.taches.length})
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Collaborateurs */}
            {activeTab === "collaborateurs" && (
              <>
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase block mb-2">
                    Ajouter un participant
                  </span>
                  <div className="relative">
                    <Ic.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={collabSearch}
                      onChange={(e) => setCollabSearch(e.target.value)}
                      placeholder="Rechercher un utilisateur..."
                      className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  {collabSearch && filteredAvailable.length > 0 && (
                    <div className="border border-gray-200 rounded-lg max-h-32 overflow-y-auto mt-1">
                      {filteredAvailable.slice(0, 6).map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleAddCollab(u.id)}
                          disabled={addCollabLoading}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-indigo-50 text-left text-sm transition-colors cursor-pointer disabled:opacity-50"
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
                    <p className="text-xs text-gray-400 mt-1">
                      Aucun utilisateur disponible
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase block mb-2">
                    Membres actuels ({projet.collaborateurs?.length || 0})
                  </span>
                  {projet.collaborateurs?.length > 0 ? (
                    <div className="space-y-1.5">
                      {projet.collaborateurs.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 group"
                        >
                          <Avatar
                            ini={`${c.user?.prenom?.[0] || ""}${c.user?.nom?.[0] || ""}`}
                            role={c.user?.role}
                            photo={c.user?.photo}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {c.user?.prenom} {c.user?.nom}
                            </p>
                            <p className="text-xs text-gray-400">
                              {c.user?.email}
                            </p>
                          </div>
                          <span className="text-[10px] text-gray-400 capitalize px-2 py-0.5 bg-white rounded border border-gray-200">
                            {c.user?.role}
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemoveCollab(projet.id, c.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          >
                            <Ic.X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Ic.Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Aucun participant</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Tâches */}
            {activeTab === "taches" && (
              <>
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase block mb-2">
                    Nouvelle tâche
                  </span>
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
                      {(projet.collaborateurs || []).map((c) => (
                        <option key={c.user?.id} value={c.user?.id}>
                          {c.user?.prenom} {c.user?.nom}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={newTache.date_echeance}
                        onChange={(e) =>
                          setNewTache({
                            ...newTache,
                            date_echeance: e.target.value,
                          })
                        }
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleAddTache}
                        disabled={!newTache.titre.trim() || createTacheLoading}
                        className="px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Ic.Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {projet.taches?.length > 0 && (
                  <div className="flex gap-2">
                    {[
                      {
                        id: "toutes",
                        label: `Toutes (${projet.taches.length})`,
                      },
                      {
                        id: "a_faire",
                        label: `À faire (${projet.taches.filter((t) => t.statut === "a_faire").length})`,
                      },
                      {
                        id: "termine",
                        label: `Terminées (${projet.taches.filter((t) => t.statut === "termine").length})`,
                      },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setTacheFilter(f.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          tacheFilter === f.id
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase block mb-2">
                    Liste des tâches ({filteredTaches.length})
                  </span>
                  {filteredTaches.length > 0 ? (
                    <div className="space-y-1.5">
                      {filteredTaches.map((tache) => (
                        <div
                          key={tache.id}
                          className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 group"
                        >
                          <button
                            onClick={() => handleToggleTache(tache)}
                            className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                              tache.statut === "termine"
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 hover:border-indigo-400"
                            }`}
                          >
                            {tache.statut === "termine" && (
                              <Ic.Check className="w-3 h-3" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${tache.statut === "termine" ? "line-through text-gray-400" : "text-gray-700"}`}
                            >
                              {tache.titre}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              {tache.assigne_a_details && (
                                <span className="flex items-center gap-1">
                                  <Avatar
                                    ini={`${tache.assigne_a_details.prenom?.[0] || ""}${tache.assigne_a_details.nom?.[0] || ""}`}
                                    role={tache.assigne_a_details.role}
                                    photo={tache.assigne_a_details.photo}
                                    sm
                                  />
                                  {tache.assigne_a_details.prenom}
                                </span>
                              )}
                              {tache.date_echeance && (
                                <span className="flex items-center gap-0.5">
                                  <Ic.Clock className="w-3 h-3" />
                                  {formatDate(tache.date_echeance)}
                                </span>
                              )}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                              tache.statut === "termine"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {tache.statut === "termine" ? "Terminé" : "À faire"}
                          </span>
                          <button
                            type="button"
                            onClick={() => onDeleteTache(tache.id)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          >
                            <Ic.Trash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Ic.Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        {tacheFilter !== "toutes"
                          ? "Aucune tâche dans ce filtre"
                          : "Aucune tâche"}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Chat */}
            {activeTab === "chat" && <ChatPanel projetId={projet.id} />}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-all cursor-pointer"
            >
              <Ic.Trash className="w-4 h-4" /> Supprimer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
