const UserModal = ({ user, onClose, onToggleStatus, onDelete }) => {
  const rm = roleMeta[user.role] || roleMeta["Étudiant"];
  const RoleIcon = rm.Icon;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800 text-sm">
            Détails de l'utilisateur
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-gray-500"
          >
            <Ic.Close className="w-4 h-4" />
          </button>
        </div>

        {/* Profile block */}
        <div className="p-5 flex items-center gap-4 border-b border-gray-100">
          <Ava ini={user.ini} role={user.role} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-base truncate">
              {user.name}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge cls={rm.cls}>
                <RoleIcon className="w-3 h-3" />
                {user.role}
              </Badge>
              <StatusDot status={user.status} />
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div className="p-5 space-y-3">
          {[
            { Icon: Ic.Mail, label: "Email", val: user.email },
            { Icon: Ic.Calendar, label: "Inscrit le", val: user.joined },
            { Icon: Ic.Book, label: "Projets", val: user.projects },
            { Icon: Ic.Check, label: "Tâches", val: user.tasks },
          ].map(({ Icon, label, val }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-gray-400 w-20 flex-shrink-0 font-medium">
                {label}
              </span>
              <span className="text-sm text-gray-700 font-semibold">{val}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={() => onToggleStatus(user.id)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold border transition-colors cursor-pointer
              ${
                user.status === "suspendu"
                  ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
              }`}
          >
            {user.status === "suspendu" ? (
              <>
                <Ic.Unlock className="w-4 h-4" /> Réactiver
              </>
            ) : (
              <>
                <Ic.Lock className="w-4 h-4" /> Suspendre
              </>
            )}
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600
              rounded-xl py-2.5 text-sm font-bold hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Ic.Trash className="w-4 h-4" /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;