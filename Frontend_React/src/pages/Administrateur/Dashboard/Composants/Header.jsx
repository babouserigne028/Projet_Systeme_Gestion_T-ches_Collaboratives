import { Ic } from "../../../../composants/Icons";

const Header = ({ setCreateUserModal }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium">
          Mercredi 4 mars 2026 · Espace collaboratif ESMT
        </p>
      </div>
      <button
        onClick={() => setCreateUserModal(true)}
        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500
          text-gray-900 font-bold text-sm px-4 py-2.5 rounded-xl shadow-sm
          transition-all duration-200 cursor-pointer self-start sm:self-auto
          hover:shadow-[0_4px_16px_#EAB30855]"
      >
        <Ic.Plus className="w-4 h-4" />
        <span>Ajouter un utilisateur</span>
      </button>
    </div>
  );
};

export default Header;
