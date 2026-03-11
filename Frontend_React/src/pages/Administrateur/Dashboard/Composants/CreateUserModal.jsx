import { useState } from "react";
import { Ic } from "../../../../composants/Icons";
import useRegister from "../../../../services/hooks/auth/useRegister";
import useCheckEmail from "../../../../services/hooks/auth/useCheckEmail";

const CreateUserModal = ({
  onClose,
  onCreate,
  refresh,
  fetchListeUserEnAttentDeValidation,
  refreshStatsEligibleProf,
}) => {
  const { register, loading, error } = useRegister();
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

  const ROLE_OPTIONS = [
    { value: "etudiant", label: "Étudiant" },
    { value: "professeur", label: "Professeur" },
    { value: "administrateur", label: "Admin" },
  ];

  const handleCreate = async () => {
    // Validation des champs obligatoires
    if (
      !formData.email.trim() ||
      !formData.prenom.trim() ||
      !formData.nom.trim() ||
      !formData.password.trim()
    ) {
      return;
    }

    // Vérifier que l'email est disponible (éviter l'erreur de duplication)
    if (isAvailable !== true) {
      return;
    }

    // Appeler l'API via le hook useRegister
    const response = await register({
      email: formData.email,
      prenom: formData.prenom,
      nom: formData.nom,
      telephone: formData.telephone,
      password: formData.password,
      role: formData.role,
      promotion: formData.promotion,
    });

    if (response) {
      // Créer l'objet utilisateur pour l'affichage local
      const roleLabel =
        ROLE_OPTIONS.find((opt) => opt.value === formData.role)?.label ||
        formData.role;
      const newUser = {
        id: response.id,
        name: `${formData.prenom} ${formData.nom}`,
        email: formData.email,
        role: roleLabel,
        date: "Aujourd'hui",
        ini: `${formData.prenom[0]}${formData.nom[0]}`.toUpperCase(),
      };
      onCreate(newUser);
      refresh();
      fetchListeUserEnAttentDeValidation();
      refreshStatsEligibleProf();
      onClose();
    }
  };

  const isFormValid =
    formData.email.trim() &&
    formData.prenom.trim() &&
    formData.nom.trim() &&
    formData.password.trim() &&
    isAvailable === true; // Email DOIT être disponible (pas null ou false)

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
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
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
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  onBlur={() => {
                    if (formData.email.trim()) {
                      checkEmail(formData.email);
                    }
                  }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                  placeholder="ex: fatou.diallo@esmt.sn"
                />
                {/* Indicateur de vérification */}
                {checkingEmail && (
                  <div className="absolute right-3 top-2.5 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
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
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Matricule & Promotion */}
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
              />
            </div>
          </div>

          {/* Info text */}
          <div className="text-xs text-gray-400 font-medium">
            Les champs marqués avec <span className="text-red-500">*</span> sont
            obligatoires.
          </div>
        </div>

        {/* CTA footer */}
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
};

export default CreateUserModal;
