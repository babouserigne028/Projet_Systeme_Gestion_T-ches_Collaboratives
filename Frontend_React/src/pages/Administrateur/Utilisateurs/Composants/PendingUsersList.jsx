import Avatar from "../../../../composants/Avatar";
import Badge from "../../../../composants/Badge";
import { Ic } from "../../../../composants/Icons";
import { getInitials } from "../../../../utils/formatters";
import { formatDate } from "../../../../utils/formatDate";

export default function PendingUsersList({ users, onApprove, loading }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div>
          <h2 className="text-sm font-bold text-gray-800">
            Comptes en attente de validation
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            {users.length} compte(s) requièrent votre approbation
          </p>
        </div>
        {users.length > 0 && (
          <Badge color="orange">⏳ {users.length} en attente</Badge>
        )}
      </div>

      {users.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Ic.Check className="w-7 h-7" />
          </div>
          <p className="text-base font-bold text-gray-800">Tout est traité !</p>
          <p className="text-sm text-gray-400">
            Aucun compte en attente de validation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 sm:p-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 hover:border-yellow-300 hover:shadow-md transition-all group"
            >
              {/* Top — Avatar + Infos + Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    ini={getInitials(user.prenom, user.nom)}
                    role={user.role}
                    photo={user.photo}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {user.prenom} {user.nom}
                    </p>
                    <Badge
                      color={user.role === "professeur" ? "blue" : "green"}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  En attente
                </span>
              </div>

              {/* Detail rows */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <Ic.Mail className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  <span className="text-gray-500 truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Ic.Calendar className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  <span className="text-gray-500">
                    Promotion : {user.promotion || "N/A"}
                  </span>
                </div>
                {user.date_joined && (
                  <div className="flex items-center gap-2 text-xs">
                    <Ic.Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    <span className="text-gray-500">
                      Inscrit le {formatDate(user.date_joined)}
                    </span>
                  </div>
                )}
              </div>

              {/* Approve button */}
              <button
                onClick={() => onApprove(user.id, user)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 text-gray-900 font-bold text-sm hover:bg-yellow-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Ic.Check className="w-4 h-4" />
                {loading ? "Validation..." : "Valider le compte"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
