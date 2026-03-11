import { useState } from "react";
import { Ic } from "../../../../composants/Icons";
import useCheckEmail from "../../../../services/hooks/auth/useCheckEmail";

const ROLE_OPTIONS = [
  { value: "etudiant", label: "Étudiant" },
  { value: "professeur", label: "Professeur" },
  { value: "administrateur", label: "Admin" },
];

export default function CreateUserModal({
  isOpen,
  onClose,
  onCreate,
  loading,
}) {
  const { checkEmail, loading: checkingEmail, isAvailable } = useCheckEmail();
  const [formData, setFormData] = useState({
    email: "",
    prenom: "",
    nom: "",
    telephone: "",
    password: "",
    role: "etudiant",
    promotion: "",
  });

  if (!isOpen) return null;

  const isFormValid =
    formData.email.trim() &&
    formData.prenom.trim() &&
    formData.nom.trim() &&
    formData.password.trim() &&
    isAvailable === true;

  const handleCreate = () => {
    if (!isFormValid) return;
    onCreate(formData);
    setFormData({
      email: "",
      prenom: "",
      nom: "",
      telephone: "",
      password: "",
      role: "etudiant",
      promotion: "",
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
          <h3 className="text-lg font-semibold text-gray-900">
            Créer un nouvel utilisateur
          </h3>
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
                placeholder="ex: Fatou"
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
                placeholder="ex: Diallo"
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
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onBlur={() => {
                    if (formData.email.trim()) checkEmail(formData.email);
                  }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                  placeholder="ex: fatou.diallo@esmt.sn"
                  disabled={loading}
                />
                {checkingEmail && (
                  <div className="absolute right-3 top-2.5 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
                )}
                {isAvailable === false && (
                  <Ic.X className="absolute right-3 top-2.5 w-4 h-4 text-red-500" />
                )}
                {isAvailable === true && (
                  <Ic.Check className="absolute right-3 top-2.5 w-4 h-4 text-green-500" />
                )}
              </div>
              {isAvailable === false && (
                <p className="text-xs text-red-600 mt-1">
                  Cet email existe déjà
                </p>
              )}
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

          {/* Row 3: Password & Rôle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                Mot de passe *
              </label>
              <input
                type="text"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
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
          </div>

          {/* Row 4: Promotion */}
          <div className="grid grid-cols-2 gap-3">
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

          {/* Info text */}
          <div className="text-xs text-gray-400 font-medium">
            Les champs marqués avec <span className="text-red-500">*</span> sont
            obligatoires.
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
            onClick={handleCreate}
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
                <Ic.Plus className="w-4 h-4" /> Créer l'utilisateur
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
