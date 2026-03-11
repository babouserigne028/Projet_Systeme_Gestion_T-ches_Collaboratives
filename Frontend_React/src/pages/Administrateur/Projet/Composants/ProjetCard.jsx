import { Ic } from "../../../../composants/Icons";
import Avatar from "../../../../composants/Avatar";

export default function ProjetCard({ projet, onClick, unreadCount = 0 }) {
  const pourcentageTaches =
    projet.nombre_taches > 0
      ? Math.round(
          (projet.nombre_taches_terminees / projet.nombre_taches) * 100,
        )
      : 0;

  const isTermine = pourcentageTaches === 100 && projet.nombre_taches > 0;

  const progressColor = isTermine
    ? "bg-green-500"
    : pourcentageTaches >= 50
      ? "bg-indigo-500"
      : "bg-amber-500";

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg hover:border-gray-300
      transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 flex-1 group-hover:text-indigo-600 transition-colors">
          {projet.titre}
        </h3>
        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          {unreadCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold animate-pulse">
              <Ic.MessageCircle className="w-3 h-3" />
              {unreadCount}
            </span>
          )}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${
              isTermine
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {isTermine ? "Terminé" : "En cours"}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
        {projet.description}
      </p>

      {/* Creator + Date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar
            ini={`${projet.createur_details?.prenom?.[0] || ""}${projet.createur_details?.nom?.[0] || ""}`}
            role={projet.createur_details?.role}
            photo={projet.createur_details?.photo}
            sm
          />
          <span className="text-xs text-gray-600 font-medium">
            {projet.createur_details?.prenom} {projet.createur_details?.nom}
          </span>
        </div>
        {projet.date_creation && (
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <Ic.Clock className="w-3 h-3" />
            {formatDate(projet.date_creation)}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-50 border border-gray-100 p-2 rounded-xl text-center">
          <div className="font-bold text-gray-900 text-sm">
            {projet.nombre_taches}
          </div>
          <div className="text-[10px] text-gray-400">Tâches</div>
        </div>
        <div className="bg-gray-50 border border-gray-100 p-2 rounded-xl text-center">
          <div className="font-bold text-green-600 text-sm">
            {projet.nombre_taches_terminees}
          </div>
          <div className="text-[10px] text-gray-400">Faites</div>
        </div>
        <div className="bg-gray-50 border border-gray-100 p-2 rounded-xl text-center">
          <div className="font-bold text-gray-900 text-sm">
            {projet.collaborateurs?.length || 0}
          </div>
          <div className="text-[10px] text-gray-400">Membres</div>
        </div>
      </div>

      {/* Collaborator avatars */}
      {projet.collaborateurs?.length > 0 && (
        <div className="flex items-center gap-1 mb-3">
          {projet.collaborateurs.slice(0, 4).map((c) => (
            <Avatar
              key={c.id}
              ini={`${c.user?.prenom?.[0] || ""}${c.user?.nom?.[0] || ""}`}
              role={c.user?.role}
              photo={c.user?.photo}
              sm
            />
          ))}
          {projet.collaborateurs.length > 4 && (
            <span className="w-7 h-7 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
              +{projet.collaborateurs.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-gray-400 font-medium">
            Progression
          </span>
          <span className="text-[10px] font-bold text-gray-500">
            {pourcentageTaches}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`${progressColor} h-1.5 rounded-full transition-all`}
            style={{ width: `${pourcentageTaches}%` }}
          />
        </div>
      </div>
    </div>
  );
}
