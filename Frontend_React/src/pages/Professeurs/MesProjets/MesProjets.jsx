import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
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
import { Ic } from "../../../composants/Icons";
import Avatar from "../../../composants/Avatar";
import Header from "./Composants/Header";
import ProjetCard from "./Composants/ProjetCard";
import CreateProjetModal from "./Composants/CreateProjetModal";
import ProjetDetailsModal from "./Composants/ProjetDetailsModal";
import useUnreadMessages from "../../../services/hooks/chat/useUnreadMessages";

export default function MesProjets() {
  const { showToast } = useToastGlobal();
  const currentUser = useSelector((state) => state.user.currentUser);
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

  // Filtrer : projets créés par le professeur + projets supervisés (collaborateur)
  const mesProjets = useMemo(() => {
    if (!projets || !currentUser) return [];
    return projets.filter((p) => {
      const isCreateur = p.createur === currentUser.id;
      const isCollab = (p.collaborateurs || []).some(
        (c) => c.user?.id === currentUser.id,
      );
      return isCreateur || isCollab;
    });
  }, [projets, currentUser]);

  // Détermine si le professeur est en lecture seule sur un projet (superviseur)
  const isReadOnly = (projet) => {
    return projet.createur !== currentUser?.id;
  };

  const projetStats = useMemo(() => {
    const total = mesProjets.length;
    const termines = mesProjets.filter(
      (p) =>
        p.nombre_taches > 0 && p.nombre_taches_terminees === p.nombre_taches,
    ).length;
    return { total, enCours: total - termines, termines };
  }, [mesProjets]);

  const filteredProjets = useMemo(() => {
    return mesProjets.filter((p) => {
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
  }, [mesProjets, search, statusFilter]);

  const refreshSelectedProjet = async (projetId) => {
    try {
      const updated = await projetService.getProjetById(projetId);
      setSelectedProjet(updated);
    } catch {}
  };

  const handleCreateProjet = async (data) => {
    try {
      const newProjet = await createProjet({
        titre: data.titre,
        description: data.description,
      });
      const projetId = newProjet.id;
      if (data.collaborateurs?.length) {
        for (const userId of data.collaborateurs) {
          try {
            await addCollaborateur(projetId, userId);
          } catch {}
        }
      }
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

  const handleUpdateTache = async (tacheId, data) => {
    try {
      await updateTache(tacheId, data);
      await refresh();
      if (selectedProjet) await refreshSelectedProjet(selectedProjet.id);
    } catch (err) {
      showToast(`Erreur: ${err.message}`, "error");
    }
  };

  const handleDeleteTache = async (tacheId) => {
    try {
      await deleteTache(tacheId);
      await refresh();
      if (selectedProjet) await refreshSelectedProjet(selectedProjet.id);
      showToast("Tâche supprimée", "ok");
    } catch (err) {
      showToast(`Erreur: ${err.message}`, "error");
    }
  };

  const handleEditProjet = async (projetId, data) => {
    try {
      await updateProjet(projetId, data);
      await refresh();
      await refreshSelectedProjet(projetId);
      showToast("Projet modifié", "ok");
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      showToast(`Erreur: ${msg}`, "error");
    }
  };

  return (
    <div className="w-full space-y-5">
      {createModal && (
        <CreateProjetModal
          onClose={() => setCreateModal(false)}
          onCreate={handleCreateProjet}
          loading={createLoading}
          allUsers={allUsers.filter((u) => u.is_active)}
        />
      )}

      {selectedProjet && (
        <ProjetDetailsModal
          projet={selectedProjet}
          onClose={() => setSelectedProjet(null)}
          onDelete={isReadOnly(selectedProjet) ? null : handleDeleteProjet}
          onRefresh={refresh}
          onAddCollab={isReadOnly(selectedProjet) ? null : handleAddCollab}
          onRemoveCollab={
            isReadOnly(selectedProjet) ? null : handleRemoveCollab
          }
          onCreateTache={isReadOnly(selectedProjet) ? null : handleCreateTache}
          onUpdateTache={isReadOnly(selectedProjet) ? null : handleUpdateTache}
          onDeleteTache={isReadOnly(selectedProjet) ? null : handleDeleteTache}
          onEditProjet={isReadOnly(selectedProjet) ? null : handleEditProjet}
          allUsers={allUsers.filter((u) => u.is_active)}
          addCollabLoading={addCollabLoading}
          createTacheLoading={createTacheLoading}
          onMarkRead={markAsRead}
          readOnly={isReadOnly(selectedProjet)}
        />
      )}

      <Header
        onCreateClick={() => setCreateModal(true)}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        stats={projetStats}
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Chargement des projets...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          Erreur: {error}
        </div>
      ) : filteredProjets.length === 0 ? (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-100 rounded-full inline-block mb-3">
            <Ic.Folder className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Aucun projet trouvé</p>
          <p className="text-xs text-gray-400 mt-1">
            Créez un nouveau projet pour commencer
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjets.map((projet) => (
            <ProjetCard
              key={projet.id}
              projet={projet}
              onClick={() => setSelectedProjet(projet)}
              unreadCount={unreadCounts[String(projet.id)] || 0}
              isSuperviseur={isReadOnly(projet)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
