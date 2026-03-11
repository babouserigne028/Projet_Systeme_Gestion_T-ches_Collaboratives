import { Ic } from "../../../../composants/Icons";

export default function Header({
  onCreateClick,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  stats,
}) {
  const statuses = ["Tous", "en_cours", "termine"];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Projets</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {stats?.total || 0} projet{(stats?.total || 0) > 1 ? "s" : ""} ·{" "}
            {stats?.enCours || 0} en cours · {stats?.termines || 0} terminé
            {(stats?.termines || 0) > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg hover:shadow-lg hover:scale-105 transition-all font-bold text-sm shadow-sm"
        >
          <Ic.Plus className="w-4 h-4" /> Nouveau projet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative md:col-span-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet par titre..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm transition"
          />
          <Ic.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-sm transition bg-white"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "Tous"
                ? "Tous les projets"
                : s === "en_cours"
                  ? "En cours"
                  : "Terminés"}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
