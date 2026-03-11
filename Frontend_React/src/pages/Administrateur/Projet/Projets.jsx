import { useState, useEffect, useMemo } from "react";
import { useToastGlobal } from "../../../services/context/ToastContext";
import {
  useFetchProjets,
  useCreateProjet,
  useUpdateProjet,
  useDeleteProjet,
  useAddCollaborateur,
  useRemoveCollaborateur,
} from "../../../services/hooks/projet";
import {
  useCreateTache,
  useUpdateTache,
  useDeleteTache,
} from "../../../services/hooks/tache";
import utilisateurService from "../../../services/api/utilisateurService";
import projetService from "../../../services/api/projetService";
import Header from "./Composants/Header";
import ProjetGrid from "./Composants/ProjetGrid";
import CreateProjetModal from "./Composants/CreateProjetModal";
import ProjetDetailsModal from "./Composants/ProjetDetailsModal";
import useUnreadMessages from "../../../services/hooks/chat/useUnreadMessages";

export default function Projets() {
  const { showToast } = useToastGlobal();
  const [createModal, setCreateModal] = useState(false);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [allUsers, setAllUsers] = useState([]);

  // ── API Hooks ──
  const { response: projets, loading, refresh, error } = useFetchProjets();
  const { createProjet, loading: createLoading } = useCreateProjet();
  const { updateProjet } = useUpdateProjet();
  const { deleteProjet } = useDeleteProjet();
  const { addCollaborateur, loading: addCollabLoading } = useAddCollaborateur();
  const { removeCollaborateur } = useRemoveCollaborateur();
  const { createTache, loading: createTacheLoading } = useCreateTache();
  const { updateTache } = useUpdateTache();
  const { deleteTache } = useDeleteTache();
  const { unreadCounts, markAsRead } = useUnreadMessages();

  // Fetch all users for collaborator selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await utilisateurService.getUtilisateurs();
        setAllUsers(data.utilisateurs || []);
      } catch {}
    };
    fetchUsers();
    refresh();
  }, []);

  // Compute stats for header
  const projetStats = useMemo(() => {
    if (!projets) return { total: 0, enCours: 0, termines: 0 };
    const total = projets.length;
    const termines = projets.filter(
      (p) =>
        p.nombre_taches > 0 && p.nombre_taches_terminees === p.nombre_taches,
    ).length;
    return { total, enCours: total - termines, termines };
  }, [projets]);

  // Filter projects by search + status
  const filteredProjets = useMemo(() => {
    if (!projets) return [];
    return projets.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.titre.toLowerCase().includes(q);
      const isTermine =
        p.nombre_taches > 0 && p.nombre_taches_terminees === p.nombre_taches;
      const matchStatus =
        statusFilter === "Tous" ||
        (statusFilter === "en_cours" && !isTermine) ||
        (statusFilter === "termine" && isTermine);
      return matchSearch && matchStatus;
    });
  }, [projets, search, statusFilter]);

  // Refresh selected project data after mutations
  const refreshSelectedProjet = async (projetId) => {
    try {
      const updated = await projetService.getProjetById(projetId);
      setSelectedProjet(updated);
    } catch {}
  };

  // ── Create Projet ──
  const handleCreateProjet = async (data) => {
    try {
      const newProjet = await createProjet({
        titre: data.titre,
        description: data.description,
      });
      // Add collaborators
      const projetId = newProjet.id;
      if (data.collaborateurs?.length) {
        for (const userId of data.collaborateurs) {
          try {
            await addCollaborateur(projetId, userId);
          } catch {}
        }
      }
      // Add tasks
      if (data.taches?.length) {
        for (const tache of data.taches) {
          try {
            await createTache({
              titre: tache.titre,
              projet: projetId,
              assigne_a: tache.assigne_a || data.collaborateurs?.[0],
              date_echeance: tache.date_echeance
                ? new Date(tache.date_echeance).toISOString()
                : new Date().toISOString(),
            });
          } catch {}
        }
      }
      setCreateModal(false);
      await refresh();
      showToast("Projet créé avec succès ✓", "ok");
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      showToast(`Erreur: ${msg}`, "error");
    }
  };

  // ── Delete Projet ──
  const handleDeleteProjet = async (id) => {
    try {
      await deleteProjet(id);
      await refresh();
      setSelectedProjet(null);
      showToast("Projet supprimé avec succès", "ok");
    } catch (err) {
      showToast(`Erreur: ${err.message}`, "error");
    }
  };

  // ── Add collaborator ──
  const handleAddCollab = async (projetId, userId) => {
    try {
      await addCollaborateur(projetId, userId);
      await refresh();
      await refreshSelectedProjet(projetId);
      showToast("Participant ajouté ✓", "ok");
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      showToast(`Erreur: ${msg}`, "error");
    }
  };

  // ── Remove collaborator ──
  const handleRemoveCollab = async (projetId, collabId) => {
    try {
      await removeCollaborateur(projetId, collabId);
      await refresh();
      await refreshSelectedProjet(projetId);
      showToast("Participant retiré", "ok");
    } catch (err) {
      showToast(`Erreur: ${err.message}`, "error");
    }
  };

  // ── Create tache ──
  const handleCreateTache = async (data) => {
    try {
      await createTache(data);
      await refresh();
      await refreshSelectedProjet(data.projet);
      showToast("Tâche créée ✓", "ok");
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      showToast(`Erreur: ${msg}`, "error");
    }
  };

  // ── Update tache ──
  const handleUpdateTache = async (tacheId, data) => {
    try {
      await updateTache(tacheId, data);
      await refresh();
      if (selectedProjet) await refreshSelectedProjet(selectedProjet.id);
    } catch (err) {
      showToast(`Erreur: ${err.message}`, "error");
    }
  };

  // ── Delete tache ──
  const handleDeleteTache = async (tacheId) => {
    try {
      await deleteTache(tacheId);
      await refresh();
      if (selectedProjet) await refreshSelectedProjet(selectedProjet.id);
      showToast("Tache supprimee", "ok");
    } catch (err) {
      showToast(`Erreur: ${err.message}`, "error");
    }
  };

  // ── Edit Projet ──
  const handleEditProjet = async (projetId, data) => {
    try {
      await updateProjet(projetId, data);
      await refresh();
      await refreshSelectedProjet(projetId);
      showToast("Projet modifie", "ok");
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      showToast(`Erreur: ${msg}`, "error");
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* ── Create Modal ── */}
      {createModal && (
        <CreateProjetModal
          onClose={() => setCreateModal(false)}
          onCreate={handleCreateProjet}
          loading={createLoading}
          allUsers={allUsers.filter((u) => u.is_active)}
        />
      )}

      {/* ── Details Modal ── */}
      {selectedProjet && (
        <ProjetDetailsModal
          projet={selectedProjet}
          onClose={() => setSelectedProjet(null)}
          onDelete={handleDeleteProjet}
          onRefresh={refresh}
          onAddCollab={handleAddCollab}
          onRemoveCollab={handleRemoveCollab}
          onCreateTache={handleCreateTache}
          onUpdateTache={handleUpdateTache}
          onDeleteTache={handleDeleteTache}
          onEditProjet={handleEditProjet}
          allUsers={allUsers.filter((u) => u.is_active)}
          addCollabLoading={addCollabLoading}
          createTacheLoading={createTacheLoading}
          onMarkRead={markAsRead}
        />
      )}

      {/* ── Header ── */}
      <Header
        onCreateClick={() => setCreateModal(true)}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalProjets={projets?.length || 0}
        stats={projetStats}
      />

      {/* ── Content ── */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Chargement des projets...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          Erreur: {error}
        </div>
      ) : (
        <ProjetGrid
          projets={filteredProjets}
          onProjetClick={setSelectedProjet}
          unreadCounts={unreadCounts}
        />
      )}
    </div>
  );
}
