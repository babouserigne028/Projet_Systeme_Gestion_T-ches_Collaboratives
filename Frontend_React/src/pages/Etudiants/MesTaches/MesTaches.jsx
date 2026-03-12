import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useFetchTaches } from "../../../services/hooks/tache";
import { useUpdateTache } from "../../../services/hooks/tache";
import { useToastGlobal } from "../../../services/context/ToastContext";
import { Ic } from "../../../composants/Icons";
import Avatar from "../../../composants/Avatar";

const statusConfig = {
  a_faire: {
    label: "À faire",
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  termine: {
    label: "Terminé",
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
  },
};

const formatDate = (d) => {
  if (!d) return "--";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isOverdue = (t) =>
  t.statut !== "termine" &&
  t.date_echeance &&
  new Date(t.date_echeance) < new Date();
const daysLeft = (d) => {
  if (!d) return null;
  const diff = Math.ceil((new Date(d) - new Date()) / 86400000);
  return diff;
};

export default function MesTaches() {
  const currentUser = useSelector((s) => s.user.currentUser);
  const { response: allTaches, loading, fetchTaches } = useFetchTaches();
  const { updateTache } = useUpdateTache();
  const { showToast } = useToastGlobal();

  const [statusFilter, setStatusFilter] = useState("toutes");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("echeance");

  useEffect(() => {
    fetchTaches();
  }, [fetchTaches]);

  // Mes tâches = celles assignées à moi
  const mesTaches = useMemo(() => {
    if (!allTaches) return [];
    return allTaches.filter((t) => t.assigne_a === currentUser?.id);
  }, [allTaches, currentUser]);

  // Filtrage + recherche
  const filteredTaches = useMemo(() => {
    let result = mesTaches;
    if (statusFilter === "a_faire")
      result = result.filter((t) => t.statut === "a_faire");
    if (statusFilter === "termine")
      result = result.filter((t) => t.statut === "termine");
    if (statusFilter === "en_retard")
      result = result.filter((t) => isOverdue(t));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.titre.toLowerCase().includes(q) ||
          t.projet_details?.titre?.toLowerCase().includes(q),
      );
    }
    // Tri
    result = [...result].sort((a, b) => {
      if (sortBy === "echeance") {
        if (!a.date_echeance) return 1;
        if (!b.date_echeance) return -1;
        return new Date(a.date_echeance) - new Date(b.date_echeance);
      }
      if (sortBy === "titre") return a.titre.localeCompare(b.titre);
      return 0;
    });
    return result;
  }, [mesTaches, statusFilter, search, sortBy]);

  const handleToggleStatut = async (tache) => {
    const newStatut = tache.statut === "termine" ? "a_faire" : "termine";
    try {
      await updateTache(tache.id, {
        statut: newStatut,
        ...(newStatut === "termine"
          ? { date_completion: new Date().toISOString() }
          : { date_completion: null }),
      });
      showToast(
        newStatut === "termine"
          ? "Tâche marquée comme terminée"
          : "Tâche réouverte",
        "ok",
      );
      fetchTaches();
    } catch {
      showToast("Erreur lors de la mise à jour", "error");
    }
  };

  const stats = useMemo(
    () => ({
      total: mesTaches.length,
      a_faire: mesTaches.filter((t) => t.statut === "a_faire").length,
      termine: mesTaches.filter((t) => t.statut === "termine").length,
      en_retard: mesTaches.filter((t) => isOverdue(t)).length,
    }),
    [mesTaches],
  );

  const taux =
    stats.total > 0 ? Math.round((stats.termine / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Tâches</h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total} tâche{stats.total !== 1 ? "s" : ""} · {stats.termine}{" "}
            terminée{stats.termine !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Ic.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-400 w-56 transition-colors"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 transition-colors cursor-pointer"
          >
            <option value="echeance">Échéance</option>
            <option value="titre">Titre A-Z</option>
          </select>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "blue",
            icon: Ic.Folder,
          },
          {
            label: "À faire",
            value: stats.a_faire,
            color: "amber",
            icon: Ic.Clock,
          },
          {
            label: "Terminées",
            value: stats.termine,
            color: "green",
            icon: Ic.Check,
          },
          {
            label: "En retard",
            value: stats.en_retard,
            color: "red",
            icon: Ic.Alert,
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={`bg-${kpi.color}-50 border border-${kpi.color}-100 rounded-xl p-4 flex items-center gap-3`}
          >
            <div
              className={`w-10 h-10 rounded-lg bg-${kpi.color}-100 flex items-center justify-center`}
            >
              <kpi.icon className={`w-5 h-5 text-${kpi.color}-600`} />
            </div>
            <div>
              <div className={`text-xl font-bold text-${kpi.color}-600`}>
                {kpi.value}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {kpi.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progression */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-700">
            Progression globale
          </span>
          <span className="text-sm font-bold text-indigo-600">{taux}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-linear-to-r from-indigo-500 to-green-500 h-3 rounded-full transition-all"
            style={{ width: `${taux}%` }}
          />
        </div>
      </div>

      {/* Filtres par statut */}
      <div className="flex gap-2">
        {[
          { id: "toutes", label: `Toutes (${stats.total})` },
          { id: "a_faire", label: `À faire (${stats.a_faire})` },
          { id: "termine", label: `Terminées (${stats.termine})` },
          { id: "en_retard", label: `En retard (${stats.en_retard})` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === f.id
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : filteredTaches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Ic.Check className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            {search
              ? "Aucune tâche ne correspond à votre recherche"
              : statusFilter !== "toutes"
                ? "Aucune tâche dans cette catégorie"
                : "Aucune tâche assignée"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTaches.map((tache) => {
            const overdue = isOverdue(tache);
            const dl = daysLeft(tache.date_echeance);
            const st = statusConfig[tache.statut] || statusConfig.a_faire;

            return (
              <div
                key={tache.id}
                className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl border transition-all group ${
                  overdue
                    ? "border-red-200 bg-red-50/30"
                    : "border-gray-200 hover:border-indigo-200"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleStatut(tache)}
                  className={`w-6 h-6 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                    tache.statut === "termine"
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                  }`}
                >
                  {tache.statut === "termine" && (
                    <Ic.Check className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      tache.statut === "termine"
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {tache.titre}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    {tache.projet_details && (
                      <span className="flex items-center gap-1">
                        <Ic.Folder className="w-3 h-3" />
                        <span className="truncate max-w-28">
                          {tache.projet_details.titre}
                        </span>
                      </span>
                    )}
                    {tache.date_echeance && (
                      <span
                        className={`flex items-center gap-1 ${overdue ? "text-red-500 font-semibold" : ""}`}
                      >
                        <Ic.Clock className="w-3 h-3" />
                        {formatDate(tache.date_echeance)}
                      </span>
                    )}
                    {tache.date_completion && (
                      <span className="flex items-center gap-1 text-green-500">
                        <Ic.Check className="w-3 h-3" />
                        {formatDate(tache.date_completion)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge échéance */}
                {tache.statut !== "termine" && dl !== null && (
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                      dl < 0
                        ? "bg-red-100 text-red-600"
                        : dl === 0
                          ? "bg-orange-100 text-orange-600"
                          : dl <= 3
                            ? "bg-amber-100 text-amber-600"
                            : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {dl < 0
                      ? `${Math.abs(dl)}j en retard`
                      : dl === 0
                        ? "Aujourd'hui"
                        : dl === 1
                          ? "Demain"
                          : `Dans ${dl}j`}
                  </span>
                )}

                {/* Statut */}
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${st.bg} ${st.text}`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
