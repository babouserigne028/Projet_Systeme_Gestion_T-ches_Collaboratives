import { FONT_URL } from "./data/constants";

/* ─── Sidebar Styles Component ─────────────────────────────────── */
function SidebarStyles() {
  return (
    <style>{`
      @import url('${FONT_URL}');
      
      /* Animations */
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
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .animate-fadeInUp {
        animation: fadeInUp 0.3s ease-out both;
      }
      
      .animate-slideInLeft {
        animation: slideInLeft 0.3s ease-out both;
      }
      
      .nav-item-anim {
        animation: slideInLeft 0.3s ease both;
      }
      
      /* Scrollbar styling */
      .sidebar-scroll::-webkit-scrollbar {
        width: 4px;
      }
      
      .sidebar-scroll::-webkit-scrollbar-track {
        background: rgba(212, 175, 55, 0.05);
        border-radius: 10px;
      }
      
      .sidebar-scroll::-webkit-scrollbar-thumb {
        background: rgba(212, 175, 55, 0.3);
        border-radius: 10px;
      }
      
      .sidebar-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(212, 175, 55, 0.5);
      }

      /* Active Navigation Item Styling */
      .active-nav-item {
        background: linear-gradient(to right, #D4AF37, #f5d060);
        box-shadow: 0 10px 15px -3px rgba(212, 175, 55, 0.3);
      }
      
      /* Preferences */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  );
}

export default SidebarStyles;
