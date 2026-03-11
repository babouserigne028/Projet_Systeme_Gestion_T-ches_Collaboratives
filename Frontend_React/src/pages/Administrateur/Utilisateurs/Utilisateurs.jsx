import { useState, useEffect, useMemo } from "react";
import { useToastGlobal } from "../../../services/context/ToastContext";
import useFetchStatUsers from "../../../services/hooks/utilisateur/useFetchStatUsers";
import useFetchListeUserEnAttentDeValidation from "../../../services/hooks/utilisateur/useFetchListeUserEnAttentDeValidation";
import useApproveUserEnAttente from "../../../services/hooks/utilisateur/useApproveUserEnAttente";
import useCreateUser from "../../../services/hooks/utilisateur/useCreateUser";
import useUpdateUser from "../../../services/hooks/utilisateur/useUpdateUser";
import useDeleteUser from "../../../services/hooks/utilisateur/useDeleteUser";
import Header from "./Composants/Header";
import UsersList from "./Composants/UsersList";
import PendingUsersList from "./Composants/PendingUsersList";
import CreateUserModal from "./Composants/CreateUserModal";
import EditUserModal from "./Composants/EditUserModal";
import DeleteConfirmModal from "./Composants/DeleteConfirmModal";
import ViewUserModal from "./Composants/ViewUserModal";

const PAGE_SIZE = 8;

export default function Utilisateurs() {
  const { showToast } = useToastGlobal();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [page, setPage] = useState(1);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ── API Hooks ──
  const { response: statsData, refresh: refreshStats } = useFetchStatUsers();
  const { response: pendingUsers, fetchListeUserEnAttentDeValidation } =
    useFetchListeUserEnAttentDeValidation();
  const { approveUser, loading: approveLoading } = useApproveUserEnAttente();
  const { createUser, loading: createLoading } = useCreateUser();
  const { updateUser, loading: updateLoading } = useUpdateUser();
  const { deleteUser, loading: deleteLoading } = useDeleteUser();

  // Fetch initial data
  useEffect(() => {
    refreshStats();
    fetchListeUserEnAttentDeValidation();
  }, []);

  // ── Filters ──
  const allUsers = statsData?.utilisateurs || [];

  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const q = search.toLowerCase();
      const matchQ =
        !q ||
        u.email.toLowerCase().includes(q) ||
        u.prenom.toLowerCase().includes(q) ||
        u.nom.toLowerCase().includes(q);
      const matchR =
        roleFilter === "Tous" || u.role === roleFilter.toLowerCase();
      const matchS =
        statusFilter === "Tous" ||
        (statusFilter === "actif" ? u.is_active : !u.is_active);
      return matchQ && matchR && matchS;
    });
  }, [allUsers, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginated = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // ── Actions ──
  const handleApproveUser = async (id, user) => {
    try {
      await approveUser(id);
      await fetchListeUserEnAttentDeValidation();
      await refreshStats();
      showToast(`Compte de ${user.prenom} ${user.nom} validé`, "ok");
    } catch (error) {
      showToast(`Erreur: ${error.message}`, "error");
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      await createUser(formData);
      showToast(
        `Utilisateur ${formData.prenom} ${formData.nom} créé avec succès`,
        "ok",
      );
      setShowCreateModal(false);
      await refreshStats();
      await fetchListeUserEnAttentDeValidation();
    } catch (error) {
      const errData = error.response?.data;
      const msg = errData?.email?.[0] || errData?.detail || error.message;
      showToast(`Erreur: ${msg}`, "error");
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (userId, formData) => {
    try {
      await updateUser(userId, formData);
      showToast(
        `Utilisateur ${formData.prenom} ${formData.nom} modifié avec succès`,
        "ok",
      );
      setShowEditModal(false);
      setSelectedUser(null);
      await refreshStats();
      await fetchListeUserEnAttentDeValidation();
    } catch (error) {
      const errData = error.response?.data;
      const msg = errData?.email?.[0] || errData?.detail || error.message;
      showToast(`Erreur: ${msg}`, "error");
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (userId) => {
    try {
      await deleteUser(userId);
      showToast("Utilisateur supprimé avec succès", "ok");
      setShowDeleteModal(false);
      setSelectedUser(null);
      await refreshStats();
      await fetchListeUserEnAttentDeValidation();
    } catch (error) {
      showToast(`Erreur: ${error.message}`, "error");
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  return (
    <div className="w-full space-y-5">
      {/* ── Content ── */}
      <Header
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        resetPage={() => setPage(1)}
        stats={statsData?.par_role || {}}
        onCreateClick={() => setShowCreateModal(true)}
      />
      <UsersList
        users={paginated}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onView={handleViewUser}
      />

      <PendingUsersList
        users={pendingUsers?.utilisateurs || []}
        onApprove={handleApproveUser}
        loading={approveLoading}
      />

      {/* ── Modals ── */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateUser}
        loading={createLoading}
      />

      <EditUserModal
        user={selectedUser}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onUpdate={handleUpdateUser}
        loading={updateLoading}
      />

      <DeleteConfirmModal
        user={selectedUser}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      <ViewUserModal
        user={selectedUser}
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}
