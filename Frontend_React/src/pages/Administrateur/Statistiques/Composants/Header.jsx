import { Ic } from "../../../../composants/Icons";

const PERIODS = [
  { id: "semaine", label: "7 jours" },
  { id: "mois", label: "30 jours" },
  { id: "annee", label: "Année" },
];

const Header = ({ period, setPeriod, totalProfs, isPersonal }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
        {isPersonal ? "Mes Statistiques" : "Statistiques Professeurs"}
      </h1>
      <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium">
        {isPersonal
          ? "Suivi de ma performance · Éligibilité prime"
          : `Suivi de performance · Attribution des primes · ${totalProfs} professeurs actifs`}
      </p>
    </div>
    <div className="flex items-center gap-2 self-start sm:self-auto">
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
              ${period === p.id ? "bg-yellow-400 text-gray-900" : "text-gray-400 hover:text-gray-700"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <button
        className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl
        px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <Ic.Download className="w-3.5 h-3.5" /> Export
      </button>
    </div>
  </div>
);

export default Header;
