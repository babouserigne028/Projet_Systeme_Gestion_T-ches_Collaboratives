import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SidebarStyles from "./SidebarStyles";
import MobileHamburger from "./MobileHamburger";
import LogoutModal from "../../pages/Auth/Logout/LogoutModal";
import useLockBodyScroll from "../useLockBodyScroll";
import MENUS from "./data/menus";
import SidebarMobile from "./SidebarMobile";
import SidebarDesktop from "./SidebarDesktop";

export default function Sidebar({ isOpen, toggleSidebar, userRole, user }) {
  const navigate = useNavigate();
  const menu = MENUS[userRole];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useLockBodyScroll(mobileOpen);

  const handleNav = useCallback(
    (path) => {
      setMobileOpen(false);
      navigate(path);
    },
    [navigate],
  );

  const handleLogout = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    sessionStorage.removeItem("token");
    localStorage.removeItem("refresh");
    navigate("/login");
  }, [navigate]);

  return (
    <>
      <SidebarStyles />
      <MobileHamburger onClick={() => setMobileOpen(true)} />
      <SidebarMobile
        mobileOpen={mobileOpen}
        user={user}
        setMobileOpen={setMobileOpen}
        isOpen={isOpen}
        menu={menu}
        handleNav={handleNav}
        setShowLogout={setShowLogout}
      />
      <SidebarDesktop
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        user={user}
        menu={menu}
        handleNav={handleNav}
        setShowLogout={setShowLogout}
      />
      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
        userName={`${user.prenom} ${user.nom}`}
      />
    </>
  );
}
