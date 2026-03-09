import { SIDEBAR_BG, SIDEBAR_WIDTH } from "./data/constants";
import ICONS from "./data/icons";
import LogoutBtn from "./LogoutBtn";
import NavList from "./NavList";
import UserCard from "./UserCard";

const SidebarDesktop = ({
  isOpen,
  toggleSidebar,
  user,
  menu,
  handleNav,
  setShowLogout,
}) => {
  return (
    <div
      className="hidden md:flex h-screen fixed left-0 top-0 z-50 flex-col transition-all duration-300 ease-in-out"
      style={{
        width: isOpen ? SIDEBAR_WIDTH.open : SIDEBAR_WIDTH.closed,
        ...SIDEBAR_BG,
      }}
    >
      {/* Ambient glow top */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Header — logo */}
      <div
        className="flex items-center shrink-0 px-4 py-4 relative"
        style={{
          borderBottom: "1px solid rgba(212,175,55,0.12)",
          minHeight: "68px",
        }}
      >
        <div
          className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isOpen ? "w-full" : "justify-center w-full"}`}
        >
          <div
            className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#D4AF37,#f5d060)",
              boxShadow: "0 4px 12px rgba(212,175,55,0.3)",
            }}
          >
            <ICONS.tasks size={18} />
          </div>
          {isOpen && (
            <div className="leading-tight overflow-hidden">
              <p
                className="text-white font-extrabold text-sm tracking-tight whitespace-nowrap"
                style={{ fontFamily: "'Baloo 2', cursive" }}
              >
                ESMT <span style={{ color: "#D4AF37" }}>Task Manager</span>
              </p>
              <p
                className="text-xs whitespace-nowrap"
                style={{
                  color: "rgba(212,175,55,0.5)",
                  fontFamily: "'Comic Neue', cursive",
                }}
              >
                Espace collaboratif
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle collapse button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3.5 top-13 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer border-none z-10 transition-all duration-200 hover:scale-110"
        style={{
          background: "linear-gradient(135deg,#D4AF37,#f5d060)",
          boxShadow: "0 2px 10px rgba(212,175,55,0.4)",
          color: "#171717",
        }}
        aria-label={isOpen ? "Réduire" : "Agrandir"}
      >
        {isOpen ? (
          <ICONS.chevronLeft size={12} />
        ) : (
          <ICONS.chevronRight size={12} />
        )}
      </button>

      {/* User card */}
      <div className="px-3 py-3 shrink-0">
        <UserCard user={user} isOpen={isOpen} />
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto sidebar-scroll py-1 min-h-0">
        <NavList open={isOpen} menu={menu} onNav={handleNav} />
      </div>

      {/* Bottom: logout */}
      <div
        className="px-3 py-4 shrink-0"
        style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
      >
        <LogoutBtn open={isOpen} onClick={() => setShowLogout(true)} />
      </div>
    </div>
  );
};

export default SidebarDesktop;
