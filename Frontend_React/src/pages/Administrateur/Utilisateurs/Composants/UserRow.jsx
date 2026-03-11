import { Ic } from "../../../../composants/Icons";
import Avatar from "../../../../composants/Avatar";
import StatusDot from "./StatusDot";

export default function UserRow({ user, onEdit, onDelete, onView }) {
  const getRoleColor = (role) => {
    switch (role) {
      case "administrateur":
        return "bg-red-100 text-red-700";
      case "professeur":
        return "bg-blue-100 text-blue-700";
      case "etudiant":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <tr className="hover:bg-yellow-50 border-b border-gray-200 transition">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar
            ini={`${user.prenom?.[0]}${user.nom?.[0]}`}
            role={user.role}
            photo={user.photo}
          />
          <div>
            <div className="font-semibold text-gray-900">
              {user.prenom} {user.nom}
            </div>
            <div className="text-xs text-gray-500">{user.matricule}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleColor(
            user.role,
          )}`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <StatusDot active={user.is_active} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onView?.(user)}
            className="p-2 hover:bg-blue-100 hover:text-blue-600 text-gray-600 rounded-lg transition"
            title="Voir détails"
          >
            <Ic.Eye className="w-4 h-4" />
          </button>
          {user.role !== "administrateur" && (
            <>
              <button
                onClick={() => onEdit?.(user)}
                className="p-2 hover:bg-yellow-100 hover:text-yellow-600 text-gray-600 rounded-lg transition"
                title="Éditer"
              >
                <Ic.Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete?.(user)}
                className="p-2 hover:bg-red-100 hover:text-red-600 text-gray-600 rounded-lg transition"
                title="Supprimer"
              >
                <Ic.Trash className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
