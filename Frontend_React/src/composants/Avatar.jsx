import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Animation styles
const avatarStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.3); opacity: 0; }
  }
  .animate-fadeInUp {
    animation: fadeInUp 0.3s ease-out both;
  }
  .animate-pulse-ring {
    animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;

const Avatar = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <>
      <style>{avatarStyles}</style>
      <div
        className="relative animate-fadeInUp motion-reduce:animate-none"
        ref={dropdownRef}
      >
        <div
          className="group flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-white/20 hover:border-white/40 transition-all duration-200 cursor-pointer"
          title="Mon Profil"
          role="button"
          tabIndex={0}
          aria-label={`Profil de ${currentUser?.Prenom} ${currentUser?.Nom}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setShowDropdown(!showDropdown);
            }
          }}
        >
          {/* Avatar avec gradient et indicateur en ligne */}
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm sm:text-xl shadow-lg ring-2 ring-white/20 group-hover:ring-emerald-300/50 group-hover:scale-105 group-hover:shadow-emerald-400/30 transition-all duration-300">
              <span className="drop-shadow-sm">
                {currentUser?.Prenom?.charAt(0)}
                {currentUser?.Nom?.charAt(0)}
              </span>
            </div>
            {/* Indicateur en ligne */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse-ring"></span>
              <span className="relative block w-full h-full rounded-full bg-emerald-400 border-2 border-white shadow-sm"></span>
            </div>
          </div>

          {/* Informations utilisateur - Desktop */}
          <div className="hidden sm:flex flex-col justify-center min-w-0 py-1">
            <p className="font-semibold text-white text-sm truncate max-w-[100px] lg:max-w-[140px] group-hover:text-emerald-100 transition-colors">
              {currentUser?.Prenom} {currentUser?.Nom}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30">
                <span className="text-xs text-emerald-200 font-medium truncate max-w-[80px] lg:max-w-[100px]">
                  {currentUser?.role?.Nom}
                </span>
              </span>
            </div>
          </div>

          {/* Chevron pour indiquer l'interaction possible */}
          <svg
            className="hidden sm:block w-4 h-4 text-white/50 group-hover:text-white/80 group-hover:translate-y-0.5 transition-all duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Avatar;
