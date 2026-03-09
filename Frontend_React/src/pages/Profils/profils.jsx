import { useState } from "react";

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

// ── Icons ─────────────────────────────────────
const Ic = {
  User: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Mail: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Calendar: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Edit: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Clock: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

// ── Mock Data ─────────────────────────────────
const mockUser = {
  id: 1,
  prenom: "Serigne",
  nom: "Babou",
  email: "s.babou@esmt.sn",
  role: "Administrateur",
  telephone: "+221 77 XXX XX XX",
  matricule: "ADM001",
  promotion: "2026",
};

const getInitials = (prenom, nom) => {
  return `${prenom?.[0]?.toUpperCase() || ""}${nom?.[0]?.toUpperCase() || ""}`;
};

const getFullName = (prenom, nom) => {
  return `${prenom} ${nom}`.trim();
};

const roleColors = {
  Administrateur: "bg-violet-100 border-violet-300 text-violet-700",
  Professeur: "bg-blue-100 border-blue-300 text-blue-700",
  Étudiant: "bg-teal-100 border-teal-300 text-teal-700",
};

// ── Badge Component ───────────────────────────
const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700 border border-gray-200",
    yellow: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    green: "bg-green-100 text-green-700 border border-green-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

// ── Info Row Component ────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
    <div className="p-2.5 rounded-lg bg-yellow-50 group-hover:bg-yellow-100 transition-colors flex-shrink-0">
      <Icon className="w-4 h-4 text-yellow-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-gray-900 font-medium mt-0.5 break-words">
        {value}
      </p>
    </div>
  </div>
);

// ── Loading Skeleton ──────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
);

// ── Main Component ────────────────────────────
export default function Profils() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    prenom: mockUser.prenom,
    nom: mockUser.nom,
    email: mockUser.email,
    telephone: mockUser.telephone,
    matricule: mockUser.matricule,
    promotion: mockUser.promotion,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditMode(false);
    // Logique de sauvegarde sera ajoutée ici
  };

  const roleColor = roleColors[mockUser.role];

  return (
    <div className="w-full space-y-6">
      {/* ═══════════════════════════════════════════════════════════*/}
      {/* SECTION 1: Hero Card - Profil Principal                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Hero Banner - Modern Gradient Background */}
        <div className="relative h-40 md:h-48 bg-gradient-to-135 from-yellow-300 via-yellow-400 to-yellow-500">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
          </div>

          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #000 1px, transparent 1px), linear-gradient(#000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Content Section - Overlapping Layout */}
        <div className="px-6 md:px-8 pb-8 relative">
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 -mt-20 md:-mt-24 mb-6">
            {/* Avatar Card */}
            <div className="flex justify-center sm:justify-start flex-shrink-0">
              <div
                className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl border-6 border-white ${roleColor} flex items-center justify-center text-4xl md:text-5xl font-bold shadow-xl transition-transform hover:scale-110 flex-shrink-0`}
              >
                {getInitials(
                  editMode ? formData.prenom : mockUser.prenom,
                  editMode ? formData.nom : mockUser.nom,
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0 flex flex-col justify-end pb-3">
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {getFullName(
                    editMode ? formData.prenom : mockUser.prenom,
                    editMode ? formData.nom : mockUser.nom,
                  )}
                </h1>
                <p className="text-gray-600 text-base md:text-lg">
                  {editMode ? formData.email : mockUser.email}
                </p>
              </div>

              {/* Role & Status */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <Badge variant="yellow">{mockUser.role}</Badge>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 border border-green-300">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-green-700">
                    Actif
                  </span>
                </div>
              </div>

              {/* Matricule & Promotion */}
              <div className="text-sm text-gray-600 flex items-center gap-4 hidden sm:flex flex-wrap">
                {mockUser.matricule && (
                  <span>
                    Matricule: <strong>{mockUser.matricule}</strong>
                  </span>
                )}
                {mockUser.promotion && (
                  <span>
                    Promotion: <strong>{mockUser.promotion}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Edit Button - Right aligned */}
            {!editMode && (
              <div className="flex justify-center sm:justify-end flex-shrink-0 sm:absolute sm:top-20 md:top-24 sm:right-6 md:right-8">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50 transition-all hover:shadow-lg font-bold text-base active:scale-95"
                >
                  <Ic.Edit className="w-5 h-5" />
                  <span>Éditer</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Details */}
          <div className="sm:hidden mt-4 p-4 rounded-2xl bg-yellow-50 border-2 border-yellow-200 space-y-2">
            {mockUser.matricule && (
              <p className="text-sm text-gray-800">
                Matricule: <strong>{mockUser.matricule}</strong>
              </p>
            )}
            {mockUser.promotion && (
              <p className="text-sm text-gray-800">
                Promotion: <strong>{mockUser.promotion}</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 2: Infos Personnes (Display Mode)                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {!editMode && (
        <div className="grid grid-cols-1 gap-6">
          {/* Infos Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Ic.User className="w-5 h-5 text-yellow-600" />
              </div>
              Informations personnelles
            </h3>
            <div className="space-y-2">
              <InfoRow
                icon={Ic.User}
                label="Nom complet"
                value={getFullName(mockUser.prenom, mockUser.nom)}
              />
              <InfoRow icon={Ic.Mail} label="Email" value={mockUser.email} />
              <InfoRow
                icon={Ic.Clock}
                label="Téléphone"
                value={mockUser.telephone}
              />
              {mockUser.matricule && (
                <InfoRow
                  icon={Ic.User}
                  label="Matricule"
                  value={mockUser.matricule}
                />
              )}
              {mockUser.promotion && (
                <InfoRow
                  icon={Ic.Calendar}
                  label="Promotion"
                  value={mockUser.promotion}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 3: Formulaire d'édition                            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {editMode && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Ic.Edit className="w-6 h-6 text-yellow-600" />
            </div>
            Éditer mon profil
          </h3>
          <p className="text-gray-600 text-sm mb-8 ml-15">
            Mettez à jour vos informations personnelles
          </p>

          {/* Form */}
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prénom */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <Ic.User className="w-4 h-4 text-yellow-600" />
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
                  placeholder="Votre prénom"
                />
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <Ic.User className="w-4 h-4 text-yellow-600" />
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            {/* Email & Téléphone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <Ic.Mail className="w-4 h-4 text-yellow-600" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <Ic.Clock className="w-4 h-4 text-yellow-600" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
                  placeholder="+221 77 XXX XX XX"
                />
              </div>
            </div>

            {/* Matricule & Promotion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matricule */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <Ic.User className="w-4 h-4 text-yellow-600" />
                  Matricule
                </label>
                <input
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
                  placeholder="ADM001"
                />
              </div>

              {/* Promotion */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <Ic.Calendar className="w-4 h-4 text-yellow-600" />
                  Promotion
                </label>
                <input
                  type="text"
                  name="promotion"
                  value={formData.promotion}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
                  placeholder="2026"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-95 text-base"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold hover:from-yellow-500 hover:to-amber-500 transition-all hover:shadow-lg active:scale-95 text-base"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
