/* ─── Menu definitions per role ────────────────────────────────── */
export const MENUS = {
  administrateur: [
    { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/utilisateurs", icon: "users", label: "Utilisateurs" },
    { to: "/projets", icon: "folder", label: "Projets" },
    { to: "/statistiques", icon: "chart", label: "Statistiques" },
    { to: "/profil", icon: "profile", label: "Mon Profil" },
  ],
  professeur: [
    { to: "/prof/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/prof/mesprojets", icon: "folder", label: "Mes Projets" },
    { to: "/prof/mestaches", icon: "tasks", label: "Mes Tâches" },
    { to: "/prof/statistiques", icon: "chart", label: "Statistiques" },
    { to: "/profil", icon: "profile", label: "Mon Profil" },
  ],
  etudiant: [
    { to: "/etu/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/etu/mesprojets", icon: "folder", label: "Mes Projets" },
    { to: "/etu/mestaches", icon: "tasks", label: "Mes Tâches" },
    { to: "/profil", icon: "profile", label: "Mon Profil" },
  ],
};

export default MENUS;
