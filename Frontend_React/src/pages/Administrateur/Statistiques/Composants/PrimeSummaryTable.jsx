import { Ic } from "../../../../composants/Icons";
import { scoreColor, scoreBg, PRIME_THRESHOLD } from "./helpers";

const PrimeSummaryTable = ({ teachers, selectedT, setSelectedT }) => {
  const primeCount = teachers.filter((t) => t.prime).length;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div>
          <h3 className="text-sm font-bold text-gray-800">
            Récapitulatif des primes
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            Score ≥ {PRIME_THRESHOLD}% → 30 000 XOF · 100% → 100 000 XOF
          </p>
        </div>
        <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
          {primeCount} / {teachers.length} éligibles
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px]">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50">
              {[
                "#",
                "Professeur",
                "Tâches",
                "Projets",
                "Score",
                "Taux complétion",
                "Statut prime",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 sm:px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {teachers.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 sm:px-6 py-8 text-center text-sm text-gray-400"
                >
                  Aucun professeur à afficher
                </td>
              </tr>
            ) : (
              teachers.map((t, i) => {
                const sc = t.score;
                const col = scoreColor(sc);
                const pct = t.tasks > 0 ? (t.done / t.tasks) * 100 : 0;
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedT(t)}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer
                      ${selectedT?.id === t.id ? "bg-yellow-50" : ""}`}
                  >
                    <td className="px-4 sm:px-6 py-3.5 text-xs font-bold text-gray-300">
                      #{i + 1}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                          style={{
                            background: `${t.color}18`,
                            borderColor: `${t.color}55`,
                            color: t.color,
                          }}
                        >
                          {t.ini}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {t.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-xs text-gray-600 font-medium">
                      {t.done}
                      <span className="text-gray-300">/{t.tasks}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-xs text-gray-600 font-medium">
                      {t.projects}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreBg(sc)}`}
                      >
                        {sc}%
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: `linear-gradient(90deg,${col}88,${col})`,
                            }}
                          />
                        </div>
                        <span
                          className="text-[11px] font-bold w-8 text-right"
                          style={{ color: col }}
                        >
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      {t.prime ? (
                        <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-full">
                          <Ic.Award className="w-3 h-3" />{" "}
                          {t.primeMontant?.toLocaleString()} XOF
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-400 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                          Non éligible
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrimeSummaryTable;
