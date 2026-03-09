import { NavLink } from "react-router-dom";
import { ICONS } from "./data/icons";

/* ─── NavItem Component ─────────────────────────────────────────── */
function NavItem({ item, isOpen, onClick, delay }) {
  // Récupérer le composant icône
  const IconComponent = ICONS[item.icon];

  return (
    <li
      className="animate-slideInLeft motion-reduce:animate-none"
      style={{ animationDelay: `${delay}ms` }}
    >
      <NavLink
        to={item.to}
        onClick={onClick}
        className={({ isActive }) => {
          const baseClass = `group flex items-center ${
            isOpen ? "justify-start gap-3 px-4" : "justify-center px-2"
          } py-3 rounded-xl transition-all duration-200 border-r-4`;

          if (isActive) {
            return `${baseClass} active-nav-item text-[#171717] shadow-lg border-[#D4AF37]`;
          }
          return `${baseClass} text-gray-400 border-transparent hover:text-white hover:shadow-lg hover:shadow-[#D4AF37]/20`;
        }}
      >
        {/* Icon */}
        <span className="shrink-0 transition-all duration-200 group-hover:scale-110">
          {IconComponent && <IconComponent size={18} />}
        </span>

        {/* Label */}
        {isOpen && <span className="font-semibold text-sm">{item.label}</span>}
      </NavLink>
    </li>
  );
}

export default NavItem;
