import { Ic } from "../../../../composants/Icons";
import Avatar from "../../../../composants/Avatar";

export default function DeleteConfirmModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  loading,
}) {
  if (!isOpen || !user) return null;

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
            Supprimer l'utilisateur
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
          {/* Warning icon */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <Ic.Trash className="w-7 h-7 text-red-600" />
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action
            est irréversible.
          </p>

          {/* User info */}
          <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3 border border-gray-200">
            <Avatar
              ini={`${user.prenom?.[0] || ""}${user.nom?.[0] || ""}`}
              role={user.role}
              photo={user.photo}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {user.prenom} {user.nom}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Suppression...
              </>
            ) : (
              <>
                <Ic.Trash className="w-4 h-4" /> Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
