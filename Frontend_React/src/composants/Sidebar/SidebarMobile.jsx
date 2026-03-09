import ICONS from "./data/icons";
import LogoutBtn from "./LogoutBtn";
import NavList from "./NavList";
import UserCard from "./UserCard";
import { SIDEBAR_BG } from "./data/constants";

const SidebarMobile = ({
  mobileOpen,
  user,
  setMobileOpen,
  isOpen,
  menu,
  handleNav,
  setShowLogout,
}) => {
  return (
    <>
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-150 md:hidden bg-black/60 backdrop-blur-sm animate-fadeInUp motion-reduce:animate-none"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 h-full z-160 md:hidden flex flex-col transition-transform duration-300 ease-in-out sidebar-scroll overflow-y-auto"
        style={{
          width: "280px",
          maxWidth: "85vw",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          ...SIDEBAR_BG,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigation"
      >
        {/* Mobile header */}
        <div
          className="flex items-center justify-between p-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(212,175,55,0.12)" }}
        >
          {/* Logo text */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg,#D4AF37,#f5d060)",
              }}
            >
              <ICONS.tasks size={16} />
            </div>
            <span
              className="text-white font-bold text-sm"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              ESMT <span style={{ color: "#D4AF37" }}>Tasks</span>
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer border-none transition-all duration-150 hover:bg-white/10 hover:text-red-400"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.5)",
            }}
            aria-label="Fermer le menu"
          >
            <ICONS.close size={16} />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-3 shrink-0">
          <UserCard user={user} isOpen={isOpen} />
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto sidebar-scroll py-2">
          <NavList open={isOpen} menu={menu} onNav={handleNav} />
        </div>

        {/* Logout */}
        <div
          className="p-4 shrink-0"
          style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}
        >
          <LogoutBtn open={isOpen} onClick={() => setShowLogout(true)} />
        </div>
      </div>
    </>
  );
};

export default SidebarMobile;
