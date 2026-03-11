import { Ic } from "../../../../composants/Icons";
import Avatar from "../../../../composants/Avatar";
import StatusDot from "./StatusDot";

export default function ViewUserModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  const getRoleColor = (role) => {
    switch (role) {
      case "administrateur":
        return "bg-red-50 border-red-200 text-red-700";
      case "professeur":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "etudiant":
        return "bg-green-50 border-green-200 text-green-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const infoRows = [
    { Icon: Ic.Mail, label: "Email", value: user.email },
    { Icon: Ic.Shield, label: "Rôle", value: user.role },
    { Icon: Ic.Tag, label: "Matricule", value: user.matricule || "—" },
    {
      Icon: Ic.Calendar,
      label: "Inscrit le",
      value: formatDate(user.date_joined),
    },
  ];

  if (user.telephone) {
    infoRows.push({ Icon: Ic.Info, label: "Téléphone", value: user.telephone });
  }
  if (user.promotion) {
    infoRows.push({ Icon: Ic.Book, label: "Promotion", value: user.promotion });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden"
        style={{ animation: "scaleIn .25s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">
            Détails de l'utilisateur
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors"
          >
            <Ic.X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile */}
        <div className="px-5 py-4 flex items-center gap-4 border-b border-gray-100">
          <Avatar
            ini={`${user.prenom?.[0] || ""}${user.nom?.[0] || ""}`}
            role={user.role}
            photo={user.photo}
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-lg truncate">
              {user.prenom} {user.nom}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${getRoleColor(user.role)}`}
              >
                {user.role}
              </span>
              <StatusDot active={user.is_active} />
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div className="p-5 space-y-3">
          {infoRows.map(({ Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-gray-400 w-24 shrink-0 font-medium">
                {label}
              </span>
              <span className="text-sm text-gray-700 font-semibold capitalize">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
