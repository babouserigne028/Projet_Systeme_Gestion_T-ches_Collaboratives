import { Ic } from "../../../../composants/Icons";
import { PRIME_THRESHOLD } from "./helpers";

const KpiCard = ({
  label,
  value,
  sub,
  Icon,
  accent,
  bg,
  border,
  trend,
  trendUp,
}) => (
  <div
    className={`${bg} border ${border} rounded-2xl p-4 flex items-start gap-3`}
  >
    <div
      className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}
      style={{ color: accent }}
    >
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0 flex-1">
      <p
        className="text-2xl font-extrabold leading-none tracking-tight"
        style={{ color: accent }}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">
        {label}
      </p>
      {trend && (
        <div
          className={`flex items-center gap-1 mt-1.5 text-[11px] font-semibold
          ${trendUp ? "text-green-600" : "text-red-500"}`}
        >
          {trendUp ? (
            <Ic.TrendUp className="w-3 h-3" />
          ) : (
            <Ic.TrendDn className="w-3 h-3" />
          )}
          {trend}
        </div>
      )}
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const KpiStrip = ({ resume }) => {
  const {
    taux_completion = 0,
    taches_completees = 0,
    total_taches = 0,
    score_moyen = 0,
    eligibles_prime = 0,
    total_profs = 0,
  } = resume || {};

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      <KpiCard
        label="Taux de complétion global"
        value={`${taux_completion}%`}
        Icon={Ic.Target}
        accent="#16A34A"
        bg="bg-green-50"
        border="border-green-200"
        sub="Tous professeurs confondus"
      />
      <KpiCard
        label="Tâches complétées"
        value={`${taches_completees}/${total_taches}`}
        Icon={Ic.Check}
        accent="#3B82F6"
        bg="bg-blue-50"
        border="border-blue-200"
        sub={`${total_taches - taches_completees} restantes`}
      />
      <KpiCard
        label="Score moyen"
        value={`${score_moyen}%`}
        Icon={Ic.Pulse}
        accent="#8B5CF6"
        bg="bg-violet-50"
        border="border-violet-200"
        sub="Performance globale"
      />
      <KpiCard
        label="Éligibles à la prime"
        value={`${eligibles_prime}/${total_profs}`}
        Icon={Ic.Award}
        accent="#D97706"
        bg="bg-amber-50"
        border="border-amber-200"
        sub={`Seuil ≥ ${PRIME_THRESHOLD}%`}
      />
    </div>
  );
};

export default KpiStrip;
