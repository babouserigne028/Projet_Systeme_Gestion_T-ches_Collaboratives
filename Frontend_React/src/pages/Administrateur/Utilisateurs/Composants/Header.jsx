import { Ic } from "../../../../composants/Icons";

export default function Header({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  resetPage,
  stats,
  onCreateClick,
}) {
  const roles = ["Tous", "Administrateur", "Professeur", "Étudiant"];
  const statuses = ["Tous", "actif", "inactif"];

  return (
    <div className="space-y-4">
      {/* Title & Button */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {stats?.etudiants || 0} étudiants · {stats?.professeurs || 0}{" "}
            professeurs · {stats?.administrateurs || 0} administrateurs
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg hover:shadow-lg hover:scale-105 transition-all font-bold text-sm shadow-sm"
        >
          <Ic.Plus className="w-4 h-4" />
          Ajouter utilisateur
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            placeholder="Rechercher par email ou nom..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm transition"
          />
          <Ic.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            resetPage();
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm transition bg-white"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            resetPage();
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm transition bg-white"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "Tous"
                ? "Tous"
                : status === "actif"
                  ? "Actifs"
                  : "Inactifs"}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
