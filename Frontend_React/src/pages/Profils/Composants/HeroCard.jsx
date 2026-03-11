import { Ic } from "../../../composants/Icons";
import { getInitials, getFullName, roleColors, roleLabels } from "./helpers";
import { API_URL } from "../../../config/api";
import { useRef } from "react";

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

const HeroCard = ({
  user,
  editMode,
  formData,
  onEditClick,
  onPhotoUpload,
  uploadingPhoto,
}) => {
  const prenom = editMode ? formData.prenom : user.prenom;
  const nom = editMode ? formData.nom : user.nom;
  const email = editMode ? formData.email : user.email;
  const roleColor =
    roleColors[user.role] || "bg-gray-100 border-gray-300 text-gray-700";
  const roleLabel = roleLabels[user.role] || user.role;
  const fileInputRef = useRef(null);

  const photoUrl = user.photo
    ? user.photo.startsWith("http")
      ? user.photo
      : `${API_URL}${user.photo}`
    : null;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Hero Banner */}
      <div className="relative h-40 md:h-48 bg-gradient-to-135 from-yellow-300 via-yellow-400 to-yellow-500">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #000 1px, transparent 1px), linear-gradient(#000 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Content Section */}
      <div className="px-6 md:px-8 pb-8 relative">
        <div className="flex flex-col sm:flex-row gap-6 md:gap-8 -mt-20 md:-mt-24 mb-6">
          {/* Avatar */}
          <div className="flex justify-center sm:justify-start flex-shrink-0">
            <div className="relative group">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={getFullName(prenom, nom)}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-6 border-white object-cover shadow-xl transition-transform hover:scale-110 flex-shrink-0"
                />
              ) : (
                <div
                  className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl border-6 border-white ${roleColor} flex items-center justify-center text-4xl md:text-5xl font-bold shadow-xl transition-transform hover:scale-110 flex-shrink-0`}
                >
                  {getInitials(prenom, nom)}
                </div>
              )}
              {/* Bouton upload photo */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onPhotoUpload?.(file);
                  e.target.value = "";
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-1 right-1 w-9 h-9 rounded-xl bg-yellow-400 text-yellow-900 flex items-center justify-center shadow-lg hover:bg-yellow-500 transition-all opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-50"
                title="Changer la photo"
              >
                {uploadingPhoto ? (
                  <span className="w-4 h-4 border-2 border-yellow-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Ic.Camera className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-end pb-3">
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {getFullName(prenom, nom)}
              </h1>
              <p className="text-gray-600 text-base md:text-lg">{email}</p>
            </div>

            {/* Role & Status */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Badge variant="yellow">{roleLabel}</Badge>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 border border-green-300">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-green-700">
                  Actif
                </span>
              </div>
            </div>

            {/* Matricule & Promotion */}
            <div className="text-sm text-gray-600 flex items-center gap-4 hidden sm:flex flex-wrap">
              {user.matricule && (
                <span>
                  Matricule: <strong>{user.matricule}</strong>
                </span>
              )}
              {user.promotion && (
                <span>
                  Promotion: <strong>{user.promotion}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Edit Button */}
          {!editMode && (
            <div className="flex justify-center sm:justify-end flex-shrink-0 sm:absolute sm:top-20 md:top-24 sm:right-6 md:right-8">
              <button
                onClick={onEditClick}
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
          {user.matricule && (
            <p className="text-sm text-gray-800">
              Matricule: <strong>{user.matricule}</strong>
            </p>
          )}
          {user.promotion && (
            <p className="text-sm text-gray-800">
              Promotion: <strong>{user.promotion}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
