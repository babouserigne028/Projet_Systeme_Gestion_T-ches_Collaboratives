import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../composants/Sidebar/index";
import { useState } from "react";
import Footer from "../composants/Footer";

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const currentUser = useSelector((state) => state.user.currentUser);
  const userRole = currentUser?.role;

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        userRole={userRole}
        user={currentUser}
      />
      <div
        className={`flex flex-col flex-1 h-screen transition-all duration-300 ${
          sidebarOpen ? "md:ml-[260px]" : "md:ml-[72px]"
        }`}
      >
        <main className="flex-1 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DefaultLayout;
