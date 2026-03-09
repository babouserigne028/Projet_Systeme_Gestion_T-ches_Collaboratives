import Avatar from "./avatar";
import { Menu } from "lucide-react";

// Animation styles
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-fadeInUp {
    animation: fadeInUp 0.4s ease-out both;
  }
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
`;

export default function HeaderMesPointages({
  title,
  soustitre,
  soustitreMobile,
  action,
}) {
  return (
    <>
      <style>{animationStyles}</style>
      <div className="backdrop-blur-md bg-gradient-to-r from-white/5 to-white/10 rounded-xl sm:rounded-2xl m-2 p-3 sm:p-4 border border-white/10 shadow-lg animate-fadeInUp motion-reduce:animate-none">
        {/* Header mobile */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:hidden">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Bouton hamburger pour mobile */}
            <button
              onClick={() => {
                // Déclencher l'ouverture du menu mobile via la fonction globale
                if (window.toggleSidebarMobile) {
                  window.toggleSidebarMobile();
                }
              }}
              aria-label="Ouvrir le menu"
              className="group text-white hover:text-emerald-300 p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all duration-200 flex-shrink-0 border border-transparent hover:border-white/20"
            >
              <Menu
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
            </button>
            <div
              className="flex-1 min-w-0 animate-fadeInUp motion-reduce:animate-none"
              style={{ animationDelay: "100ms" }}
            >
              <h1 className="text-lg font-bold truncate bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
          </div>
          {/* Avatar mobile */}
          <div
            className="flex-shrink-0 animate-fadeInUp motion-reduce:animate-none"
            style={{ animationDelay: "200ms" }}
          >
            <Avatar />
          </div>
        </div>

        {/* Description mobile */}
        <div
          className="sm:hidden mb-2 animate-fadeInUp motion-reduce:animate-none"
          style={{ animationDelay: "150ms" }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            {soustitreMobile}
          </p>
        </div>

        {/* Action mobile */}
        {action && (
          <div
            className="sm:hidden animate-fadeInUp motion-reduce:animate-none"
            style={{ animationDelay: "200ms" }}
          >
            {action}
          </div>
        )}

        {/* Header desktop */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Icône décorative */}
            <div className="hidden lg:flex w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 border border-emerald-400/30 items-center justify-center flex-shrink-0 animate-fadeInUp motion-reduce:animate-none">
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div
              className="flex-1 min-w-0 animate-fadeInUp motion-reduce:animate-none"
              style={{ animationDelay: "100ms" }}
            >
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 truncate bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
                {soustitre}
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-4 animate-fadeInUp motion-reduce:animate-none"
            style={{ animationDelay: "200ms" }}
          >
            {/* Indicateur de temps */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>En ligne</span>
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
            <div className="flex-shrink-0">
              <Avatar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
