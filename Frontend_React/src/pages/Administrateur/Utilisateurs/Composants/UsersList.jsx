import UserRow from "./UserRow";

export default function UsersList({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onView,
}) {
  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-bold text-gray-900">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left font-bold text-gray-900">
                Email
              </th>
              <th className="px-6 py-3 text-left font-bold text-gray-900">
                Rôle
              </th>
              <th className="px-6 py-3 text-left font-bold text-gray-900">
                Statut
              </th>
              <th className="px-6 py-3 text-right font-bold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 10H9m4 4v4m-6-4v4m12-1a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">
                      Aucun utilisateur trouvé
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition"
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === num
                  ? "bg-yellow-400 text-gray-900 shadow-md font-bold"
                  : "border border-gray-300 hover:bg-yellow-50 hover:text-yellow-600"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-yellow-50 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
