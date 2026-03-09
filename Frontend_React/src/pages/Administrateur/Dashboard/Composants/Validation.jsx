import ActionBtn from "./ActionBtn";
import Avatar from "./Avatar";
import Badge from "./Badge";
import { Ic } from "./data/Icones";
import { getInitials } from "../../../../../src/utils/formatters";
import { formatDate } from "../../../../utils/formatDate";

const Validation = ({ approve, responseListeEnAttente }) => {
  const users = responseListeEnAttente?.utilisateurs || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Panel header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2
            px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50"
      >
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
        /* Scrollable table wrapper pour mobile */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Utilisateur", "Rôle", "Email", "Date", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 sm:px-6 py-3
                        text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        ini={getInitials(u.prenom, u.nom)}
                        role={u.role}
                      />
                      <span className="text-sm font-semibold text-gray-800">
                        {u.prenom} {u.nom}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <Badge color={u.role === "professeur" ? "blue" : "green"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-xs text-gray-400">
                    {u.email}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5 text-xs text-gray-400">
                    {formatDate(u.date_joined)}
                  </td>
                  <td className="px-4 sm:px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <ActionBtn
                        label="Valider"
                        color="green"
                        Icon={Ic.Check}
                        onClick={() => approve(u.id, u)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Validation;
