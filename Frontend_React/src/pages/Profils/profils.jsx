import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import useFetchCurrentUser from "../../services/hooks/profil/useFetchCurrentUser";
import useUpdateProfile from "../../services/hooks/profil/useUpdateProfile";
import { useToast } from "../../services/hooks/useToast";
import utilisateurService from "../../services/api/utilisateurService";
import { setCurrentUser } from "../../store/userSlice";

import HeroCard from "./Composants/HeroCard";
import InfoSection from "./Composants/InfoSection";
import EditForm from "./Composants/EditForm";
import ProfileSkeleton from "./Composants/ProfileSkeleton";

/* ═══════════════════════════════════════════════
   ESMT — Page Profil Utilisateur
   Charte : Flat design, Jaune #EAB308
   ─────────────────────────────────────────────
   BG layout  : géré par DefaultLayout (bg-gray-50)
   Cards      : bg-white, border-gray-200
   Accent     : #EAB308 (jaune ESMT)
   Flat design: sans ombres lourdes, clean borders
   Responsive : 375 → 1440px
════════════════════════════════════════════════ */

export default function Profils() {
  const { user, loading, error, refresh } = useFetchCurrentUser();
  const { updateProfile, loading: saving } = useUpdateProfile();
  const toast = useToast();
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    matricule: "",
    promotion: "",
  });

  // Sync formData quand user est chargé ou rafraîchi
  useEffect(() => {
    if (user) {
      setFormData({
        prenom: user.prenom || "",
        nom: user.nom || "",
        email: user.email || "",
        telephone: user.telephone || "",
        matricule: user.matricule || "",
        promotion: user.promotion || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(user.id, formData);
      setEditMode(false);
      refresh();
      toast?.success?.("Profil mis à jour avec succès");
    } catch {
      toast?.error?.("Erreur lors de la mise à jour du profil");
    }
  };

  const handlePhotoUpload = async (file) => {
    setUploadingPhoto(true);
    try {
      const updatedUser = await utilisateurService.uploadPhoto(file);
      dispatch(setCurrentUser(updatedUser));
      refresh();
      toast?.success?.("Photo mise à jour avec succès");
    } catch {
      toast?.error?.("Erreur lors de l'upload de la photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        prenom: user.prenom || "",
        nom: user.nom || "",
        email: user.email || "",
        telephone: user.telephone || "",
        matricule: user.matricule || "",
        promotion: user.promotion || "",
      });
    }
    setEditMode(false);
  };

  /* ── Rendu ──────────────────────────────────── */
  if (loading) return <ProfileSkeleton />;

  if (error)
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-semibold">
            Impossible de charger le profil
          </p>
          <button
            onClick={refresh}
            className="px-5 py-2 rounded-xl bg-yellow-400 text-yellow-900 font-bold hover:bg-yellow-500 transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    );

  if (!user) return null;

  return (
    <div className="w-full space-y-6">
      <HeroCard
        user={user}
        editMode={editMode}
        formData={formData}
        onEditClick={() => setEditMode(true)}
        onPhotoUpload={handlePhotoUpload}
        uploadingPhoto={uploadingPhoto}
      />

      {!editMode && <InfoSection user={user} />}

      {editMode && (
        <EditForm
          formData={formData}
          onChange={handleInputChange}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      )}
    </div>
  );
}
