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
    { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/mesprojets", icon: "folder", label: "Mes Projets" },
    { to: "/mestaches", icon: "tasks", label: "Mes Tâches" },
    { to: "/statistiques", icon: "chart", label: "Statistiques" },
    { to: "/profil", icon: "profile", label: "Mon Profil" },
  ],
  etudiant: [
    { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/mesprojets", icon: "folder", label: "Mes Projets" },
    { to: "/mestaches", icon: "tasks", label: "Mes Tâches" },
    { to: "/monprofil", icon: "profile", label: "Mon Profil" },
  ],
};

export default MENUS;
