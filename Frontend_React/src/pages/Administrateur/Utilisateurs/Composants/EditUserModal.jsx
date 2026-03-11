import { useState, useEffect } from "react";
import { Ic } from "../../../../composants/Icons";
import Avatar from "../../../../composants/Avatar";

const ROLE_OPTIONS = [
  { value: "etudiant", label: "Étudiant" },
  { value: "professeur", label: "Professeur" },
  { value: "administrateur", label: "Admin" },
];

export default function EditUserModal({
  user,
  isOpen,
  onClose,
  onUpdate,
  loading,
}) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "etudiant",
    telephone: "",
    promotion: "",
    is_active: true,
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        role: user.role || "etudiant",
        telephone: user.telephone || "",
        promotion: user.promotion || "",
        is_active: user.is_active ?? true,
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const isFormValid =
    formData.email.trim() && formData.prenom.trim() && formData.nom.trim();

  const handleUpdate = () => {
    if (!isFormValid) return;
    onUpdate(user.id, formData);
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
            <Avatar
              ini={`${user.prenom?.[0] || ""}${user.nom?.[0] || ""}`}
              role={user.role}
              photo={user.photo}
            />
            <h3 className="text-lg font-semibold text-gray-900">
              Modifier l'utilisateur
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors"
          >
            <Ic.X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Row 1: Prénom & Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                Nom *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Row 2: Email & Téléphone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                placeholder="ex: +221 77 123 45 67"
                disabled={loading}
              />
            </div>
          </div>

          {/* Row 3: Rôle & Promotion */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                Rôle *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                disabled={loading}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                Promotion
              </label>
              <input
                type="text"
                value={formData.promotion}
                onChange={(e) =>
                  setFormData({ ...formData, promotion: e.target.value })
                }
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                placeholder="ex: 2025-2026"
                disabled={loading}
              />
            </div>
          </div>

          {/* Statut actif */}
          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="is_active_edit"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              disabled={loading}
            />
            <label
              htmlFor="is_active_edit"
              className="text-xs font-bold text-gray-600 uppercase"
            >
              Compte actif
            </label>
          </div>
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
            onClick={handleUpdate}
            disabled={!isFormValid || loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Mise à jour...
              </>
            ) : (
              <>
                <Ic.Check className="w-4 h-4" /> Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
