import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Ic } from "../../../composants/Icons";
import Avatar from "../../../composants/Avatar";
import { useFetchProfDashboard } from "../../../services/hooks/professeur/useFetchProfDashboard";

const KpiCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-2">
      <div
        className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const ProgressRing = ({ pct }) => {
  const r = 36,
    c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="#6366f1"
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900">
        {pct}%
      </span>
    </div>
  );
};

const formatDate = (d) => {
  if (!d) return "--";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function Dashboard() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { response: data, loading, refresh } = useFetchProfDashboard();

  useEffect(() => {
    refresh();
  }, []);

  if (loading || !data) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, {currentUser?.prenom || "Professeur"} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          Voici un aperçu de vos projets et tâches
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Ic.Folder}
          label="Mes Projets"
          value={data.total_projets}
          color="bg-indigo-100 text-indigo-600"
          sub={`${data.projets_en_cours} en cours · ${data.projets_termines} terminés`}
        />
        <KpiCard
          icon={Ic.Check}
          label="Tâches terminées"
          value={data.taches_terminees}
          color="bg-green-100 text-green-600"
          sub={`sur ${data.total_taches} au total`}
        />
        <KpiCard
          icon={Ic.Clock}
          label="À faire"
          value={data.taches_a_faire}
          color="bg-amber-100 text-amber-600"
          sub={
            data.taches_en_retard > 0
              ? `${data.taches_en_retard} en retard`
              : "Tout dans les temps"
          }
        />
        <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">
            Complétion
          </p>
          <ProgressRing pct={data.taux_completion} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {/* Projets récents */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Ic.Folder className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase">
                Projets récents
              </h2>
            </div>
          </div>
          {data.projets_recents?.length > 0 ? (
            <div className="space-y-2">
              {data.projets_recents.map((p) => {
                const pct =
                  p.nombre_taches > 0
                    ? Math.round(
                        (p.nombre_taches_terminees / p.nombre_taches) * 100,
                      )
                    : 0;
                return (
                  <div
                    key={p.id}
                    className="px-3 py-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-800 truncate flex-1">
                        {p.titre}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ml-2 ${
                          pct === 100
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {pct === 100 ? "Terminé" : "En cours"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Ic.Check className="w-3 h-3" />{" "}
                        {p.nombre_taches_terminees}/{p.nombre_taches} tâches
                      </span>
                      <span className="flex items-center gap-1">
                        <Ic.Users className="w-3 h-3" />{" "}
                        {p.collaborateurs?.length || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${pct === 100 ? "bg-green-500" : pct >= 50 ? "bg-indigo-500" : "bg-amber-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Ic.Folder className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Aucun projet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
