/* ═══════════════════════════════════════════════
   Profil — Helpers & constantes
════════════════════════════════════════════════ */

export const getInitials = (prenom, nom) =>
  `${prenom?.[0]?.toUpperCase() || ""}${nom?.[0]?.toUpperCase() || ""}`;

export const getFullName = (prenom, nom) => `${prenom} ${nom}`.trim();

export const roleColors = {
  administrateur: "bg-violet-100 border-violet-300 text-violet-700",
  professeur: "bg-blue-100 border-blue-300 text-blue-700",
  etudiant: "bg-teal-100 border-teal-300 text-teal-700",
};

export const roleLabels = {
  administrateur: "Administrateur",
  professeur: "Professeur",
  etudiant: "Étudiant",
};
