import { Ic } from "../../../../composants/Icons";
import ProjetCard from "./ProjetCard";

export default function ProjetGrid({
  projets,
  onProjetClick,
  unreadCounts = {},
}) {
  if (!projets || projets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="p-4 bg-gray-100 rounded-full inline-block mb-3">
          <Ic.Book className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Aucun projet trouvé</p>
        <p className="text-xs text-gray-400 mt-1">
          Créez un nouveau projet pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projets.map((projet) => (
        <ProjetCard
          key={projet.id}
          projet={projet}
          onClick={() => onProjetClick(projet)}
          unreadCount={unreadCounts[String(projet.id)] || 0}
        />
      ))}
    </div>
  );
}
