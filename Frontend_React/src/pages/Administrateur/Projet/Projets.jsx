import { useState, useMemo } from "react";

/* ═══════════════════════════════════════════════
   ESMT Task Manager — Gestion des Projets
   Directives : Portfolio Grid · Flat Design
   Charte     : même dashboard (light, jaune ESMT)
   Accents    : Indigo #4F46E5 + Orange #F97316
   Layout     : intégré à DefaultLayout
════════════════════════════════════════════════ */

// ── Icons ─────────────────────────────────────
const Ic = {
  Plus: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Search: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Grid: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  List: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  Users: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Check: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  Clock: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Calendar: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Tag: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Eye: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Edit: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  ChevronR: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  X: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Folder: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Star: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Alert: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Cap: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Book: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  ListChecks: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M9 5l3 3L22 0" />
      <line x1="1" y1="11" x2="7" y2="11" />
      <line x1="1" y1="5" x2="7" y2="5" />
    </svg>
  ),
};

// ── Data ──────────────────────────────────────
const STATUS_META = {
  en_cours: {
    label: "En cours",
    cls: "bg-blue-50   border-blue-200   text-blue-700",
    dot: "bg-blue-500",
  },
  termine: {
    label: "Terminé",
    cls: "bg-green-50  border-green-200  text-green-700",
    dot: "bg-green-500",
  },
};

// ── All available users for collaboration ──
const ALL_USERS = [
  { name: "Dr. Amadou Diop", role: "Professeur" },
  { name: "Prof. Khady Gueye", role: "Professeur" },
  { name: "Mme. Rokhaya Sarr", role: "Professeur" },
  { name: "M. Ousmane Thiam", role: "Professeur" },
  { name: "Dr. Lamine Diouf", role: "Professeur" },
  { name: "Cheikh Mamadou", role: "Étudiant" },
  { name: "Ibrahim Fall", role: "Étudiant" },
  { name: "Aïssatou Faye", role: "Étudiant" },
  { name: "Stéphane Gueye", role: "Étudiant" },
  { name: "Aïssatou Seck", role: "Étudiant" },
  { name: "Fatou Diagne", role: "Étudiant" },
  { name: "Lamine Sow", role: "Étudiant" },
];

const PROJECTS = [
  {
    id: 1,
    title: "Système de recommandation IA pour e-learning",
    status: "en_cours",
    owner: "Dr. Amadou Diop",
    ownerRole: "Professeur",
    members: [
      { name: "Cheikh Mamadou", role: "Étudiant" },
      { name: "Ibrahim Fall", role: "Étudiant" },
      { name: "Aïssatou Faye", role: "Étudiant" },
      { name: "Stéphane Gueye", role: "Étudiant" },
    ],
    tasks: { total: 18, done: 12 },
    deadline: "30 avr 2026",
    description:
      "Développement d'un moteur de recommandation basé sur le comportement des apprenants pour personnaliser les parcours pédagogiques.",
    starred: true,
    tasksList: [
      {
        id: 1,
        title: "Collecte des données",
        description: "Récupérer les données comportementales des apprenants",
        assignedTo: "Cheikh Mamadou",
        status: "done",
      },
      {
        id: 2,
        title: "Modélisation ML",
        description: "Développer le modèle machine learning",
        assignedTo: "Ibrahim Fall",
        status: "done",
      },
      {
        id: 3,
        title: "API FastAPI",
        description: "Créer l'API de recommandation",
        assignedTo: "Aïssatou Faye",
        status: "in_progress",
      },
      {
        id: 4,
        title: "Tests unitaires",
        description: "Tester tous les composants",
        assignedTo: "Stéphane Gueye",
        status: "pending",
      },
      {
        id: 5,
        title: "Documentation",
        description: "Rédiger la documentation technique",
        assignedTo: "Cheikh Mamadou",
        status: "pending",
      },
    ],
  },
  {
    id: 2,
    title: "Plateforme de gestion des stages étudiants",
    status: "en_cours",
    owner: "Prof. Khady Gueye",
    ownerRole: "Professeur",
    members: [
      { name: "Cheikh Mamadou", role: "Étudiant" },
      { name: "Aïssatou Seck", role: "Étudiant" },
      { name: "Fatou Diagne", role: "Étudiant" },
    ],
    tasks: { total: 24, done: 18 },
    deadline: "15 mai 2026",
    description:
      "Application web permettant aux étudiants de postuler aux stages, aux entreprises de publier des offres et aux enseignants de suivre les évaluations.",
    starred: false,
    tasksList: [
      {
        id: 1,
        title: "Design UI/UX",
        description: "Créer les maquettes de l'application",
        assignedTo: "Cheikh Mamadou",
        status: "done",
      },
      {
        id: 2,
        title: "Backend - Authentification",
        description: "Système de login/register",
        assignedTo: "Aïssatou Seck",
        status: "done",
      },
      {
        id: 3,
        title: "Frontend - Dashboard",
        description: "Interface du dashboard étudiant",
        assignedTo: "Fatou Diagne",
        status: "in_progress",
      },
    ],
  },
  {
    id: 3,
    title: "Application mobile de révision gamifiée",
    status: "en_cours",
    owner: "Mme. Rokhaya Sarr",
    ownerRole: "Professeur",
    members: [
      { name: "Ibrahim Fall", role: "Étudiant" },
      { name: "Lamine Sow", role: "Étudiant" },
    ],
    tasks: { total: 14, done: 0 },
    deadline: "01 jun 2026",
    description:
      "Application mobile gamifiée pour aider les étudiants à réviser via des quiz adaptatifs, badges et classements.",
    starred: false,
    tasksList: [
      {
        id: 1,
        title: "Setup Flutter",
        description: "Initialiser le projet Flutter",
        assignedTo: "Ibrahim Fall",
        status: "pending",
      },
      {
        id: 2,
        title: "Architecture des tâches",
        description: "Concevoir l'architecture de la app",
        assignedTo: "Lamine Sow",
        status: "pending",
      },
    ],
  },
  {
    id: 4,
    title: "Audit sécurité du réseau universitaire",
    status: "en_cours",
    owner: "M. Ousmane Thiam",
    ownerRole: "Professeur",
    members: [
      { name: "Cheikh Mamadou", role: "Étudiant" },
      { name: "Aïssatou Faye", role: "Étudiant" },
    ],
    tasks: { total: 10, done: 7 },
    deadline: "20 avr 2026",
    description:
      "Analyse des vulnérabilités du réseau interne de l'ESMT, rédaction d'un rapport de sécurité et proposition de contre-mesures.",
    starred: true,
    tasksList: [
      {
        id: 1,
        title: "Scan réseau",
        description: "Effectuer un scan Nmap complet",
        assignedTo: "Cheikh Mamadou",
        status: "done",
      },
      {
        id: 2,
        title: "Tests de pénétration",
        description: "Tester les vulnérabilités trouvées",
        assignedTo: "Aïssatou Faye",
        status: "done",
      },
    ],
  },
  {
    id: 5,
    title: "Tableau de bord analytique temps réel",
    status: "termine",
    owner: "Dr. Amadou Diop",
    ownerRole: "Professeur",
    members: [
      { name: "Fatou Diagne", role: "Étudiant" },
      { name: "Aïssatou Seck", role: "Étudiant" },
      { name: "Stéphane Gueye", role: "Étudiant" },
    ],
    tasks: { total: 20, done: 20 },
    deadline: "28 fév 2026",
    description:
      "Dashboard de visualisation de données en temps réel pour le suivi des performances académiques avec filtres dynamiques.",
    starred: false,
    tasksList: [
      {
        id: 1,
        title: "Récupération des données",
        description: "Connecter les sources de données",
        assignedTo: "Fatou Diagne",
        status: "done",
      },
      {
        id: 2,
        title: "Graphiques React",
        description: "Implémenter les graphiques avec Recharts",
        assignedTo: "Aïssatou Seck",
        status: "done",
      },
      {
        id: 3,
        title: "WebSocket temps réel",
        description: "Mettre en place les WebSockets",
        assignedTo: "Stéphane Gueye",
        status: "done",
      },
    ],
  },
  {
    id: 6,
    title: "Étude comparative des LLMs pour l'éducation",
    status: "en_cours",
    owner: "Dr. Lamine Diouf",
    ownerRole: "Professeur",
    members: [{ name: "Cheikh Mamadou", role: "Étudiant" }],
    tasks: { total: 8, done: 3 },
    deadline: "15 jun 2026",
    description:
      "Revue systématique des grands modèles de langage (GPT-4, Claude, Gemini) dans des contextes d'enseignement supérieur africain.",
    starred: false,
    tasksList: [
      {
        id: 1,
        title: "Recherche bibliographique",
        description: "Collecter les articles pertinents",
        assignedTo: "Cheikh Mamadou",
        status: "done",
      },
      {
        id: 2,
        title: "Analyse comparative",
        description: "Comparer les performances des modèles",
        assignedTo: "Cheikh Mamadou",
        status: "in_progress",
      },
    ],
  },
  {
    id: 7,
    title: "Déploiement infrastructure cloud ESMT",
    status: "en_cours",
    owner: "M. Ousmane Thiam",
    ownerRole: "Professeur",
    members: [
      { name: "Ibrahim Fall", role: "Étudiant" },
      { name: "Lamine Sow", role: "Étudiant" },
      { name: "Aïssatou Faye", role: "Étudiant" },
    ],
    tasks: { total: 16, done: 9 },
    deadline: "10 mai 2026",
    description:
      "Migration et déploiement des services universitaires sur un cloud privé basé sur OpenStack avec haute disponibilité.",
    starred: false,
    tasksList: [
      {
        id: 1,
        title: "Configuration OpenStack",
        description: "Installer et configurer OpenStack",
        assignedTo: "Ibrahim Fall",
        status: "done",
      },
      {
        id: 2,
        title: "Migration base de données",
        description: "Migrer les données existantes",
        assignedTo: "Lamine Sow",
        status: "in_progress",
      },
      {
        id: 3,
        title: "Tests de charge",
        description: "Tester la performance du cloud",
        assignedTo: "Aïssatou Faye",
        status: "pending",
      },
    ],
  },
  {
    id: 8,
    title: "Chatbot d'assistance académique",
    status: "en_cours",
    owner: "Prof. Khady Gueye",
    ownerRole: "Professeur",
    members: [
      { name: "Fatou Diagne", role: "Étudiant" },
      { name: "Cheikh Mamadou", role: "Étudiant" },
    ],
    tasks: { total: 12, done: 0 },
    deadline: "30 jun 2026",
    description:
      "Agent conversationnel basé sur RAG pour répondre aux questions des étudiants sur les cours, le règlement et les examens.",
    starred: false,
    tasksList: [
      {
        id: 1,
        title: "Création base de connaissances",
        description: "Collecter et structurer les documents",
        assignedTo: "Fatou Diagne",
        status: "pending",
      },
      {
        id: 2,
        title: "Fine-tuning du modèle",
        description: "Adapter le modèle au contexte académique",
        assignedTo: "Cheikh Mamadou",
        status: "pending",
      },
    ],
  },
];

const STATUSES = ["Tous", "en_cours", "termine"];
const STATUS_LBL = {
  Tous: "Tous",
  en_cours: "En cours",
  termine: "Terminé",
};

// ── Helpers ───────────────────────────────────
const pct = (p) =>
  p.tasks.total ? Math.round((p.tasks.done / p.tasks.total) * 100) : 0;

const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const MemberAva = ({ name, role, size = "sm" }) => {
  const cls =
    role === "Professeur"
      ? "bg-blue-100 border-blue-300 text-blue-700"
      : "bg-teal-100 border-teal-300 text-teal-700";
  const sz = size === "sm" ? "w-6 h-6 text-[9px]" : "w-8 h-8 text-[11px]";
  return (
    <div
      className={`${sz} ${cls} rounded-full border-2 border-white ring-1 ring-gray-200
      flex items-center justify-center font-bold shrink-0`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};

const StatusPill = ({ status }) => {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-0.5 text-[11px] font-bold ${m.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};

// ── Project Card (Grid view) ──────────────────
const ProjectCard = ({ project, onView, onEdit, onDelete, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const progress = pct(project);
  const sm = STATUS_META[project.status];

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden
        transition-all duration-200 cursor-pointer group relative"
      style={{
        animation: `fadeUp .4s ease both`,
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Star */}
      {project.starred && (
        <div className="absolute top-4 right-4 z-10">
          <Ic.Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <StatusPill status={project.status} />
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug mb-2 group-hover:text-indigo-700 transition-colors duration-150 line-clamp-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500 font-medium">
              {project.tasks.done} / {project.tasks.total} tâches
            </span>
            <span
              className={`font-bold ${progress === 100 ? "text-green-600" : progress >= 60 ? "text-indigo-600" : "text-amber-600"}`}
            >
              {progress}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background:
                  progress === 100
                    ? "#16A34A"
                    : progress >= 60
                      ? "#4F46E5"
                      : "#D97706",
              }}
            />
          </div>
        </div>

        {/* Footer: owner + members + deadline */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {/* Owner */}
            <div
              className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-[10px] font-bold text-indigo-700"
              title={project.owner}
            >
              {getInitials(project.owner)}
            </div>
            {/* Members stack */}
            <div className="flex -space-x-1.5">
              {project.members.slice(0, 3).map((m, i) => (
                <MemberAva key={i} name={m.name} role={m.role} />
              ))}
              {project.members.length > 3 && (
                <div
                  className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white ring-1 ring-gray-200
                  flex items-center justify-center text-[9px] font-bold text-gray-400"
                >
                  +{project.members.length - 3}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
            <Ic.Calendar className="w-3 h-3" />
            {project.deadline}
          </div>
        </div>
      </div>

      {/* Hover overlay actions */}
      <div
        className={`absolute inset-0 bg-gray-900/5 flex items-end justify-center pb-4 gap-2
        transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(project);
          }}
          className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2
            text-xs font-bold text-gray-700 shadow-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600
            transition-all cursor-pointer"
        >
          <Ic.Eye className="w-3.5 h-3.5" /> Voir
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="flex items-center gap-1.5 bg-white border border-red-200 rounded-xl px-3 py-2
            text-xs font-bold text-red-500 shadow-sm hover:bg-red-500 hover:text-white
            transition-all cursor-pointer"
        >
          <Ic.Trash className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ── Project List Row ──────────────────────────
const ProjectRow = ({ project, onView, delay = 0 }) => {
  const progress = pct(project);

  return (
    <tr
      className="hover:bg-gray-50 transition-colors group cursor-pointer"
      style={{
        animation: `fadeUp .35s ease both`,
        animationDelay: `${delay}ms`,
      }}
      onClick={() => onView(project)}
    >
      <td className="px-4 sm:px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p
              className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700
              transition-colors truncate"
            >
              {project.title}
            </p>
            {project.starred && (
              <div className="flex items-center gap-2 mt-0.5">
                <Ic.Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 sm:px-5 py-3.5">
        <StatusPill status={project.status} />
      </td>
      <td className="px-4 sm:px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-[9px] font-bold text-indigo-700 shrink-0"
            title={project.owner}
          >
            {getInitials(project.owner)}
          </div>
          <span className="text-xs text-gray-600 font-medium truncate max-w-30 line-clamp-1">
            {project.owner}
          </span>
        </div>
      </td>
      <td className="px-4 sm:px-5 py-3.5">
        <div className="flex -space-x-1">
          {project.members.slice(0, 4).map((m, i) => (
            <MemberAva key={i} name={m.name} role={m.role} />
          ))}
          {project.members.length > 4 && (
            <div
              className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white ring-1 ring-gray-200
              flex items-center justify-center text-[9px] font-bold text-gray-400"
            >
              +{project.members.length - 4}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 sm:px-5 py-3.5 min-w-[140px]">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: progress === 100 ? "#16A34A" : "#4F46E5",
              }}
            />
          </div>
          <span className="text-[11px] font-bold w-7 text-right text-gray-600">
            {progress}%
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {project.tasks.done}/{project.tasks.total} tâches
        </p>
      </td>
      <td className="px-4 sm:px-5 py-3.5 text-xs text-gray-400 font-medium">
        <div className="flex items-center gap-1">
          <Ic.Calendar className="w-3 h-3" />
          {project.deadline}
        </div>
      </td>
      <td className="px-4 sm:px-5 py-3.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(project);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100
            text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
        >
          <Ic.ChevronR className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
};

// ── Create New Project Modal ──
const CreateProjectModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    owner: "Dr. Amadou Diop",
    ownerRole: "Professeur",
    members: [],
    status: "en_cours",
  });

  const handleCreate = () => {
    if (formData.title.trim()) {
      const newProject = {
        id: Math.max(...PROJECTS.map((p) => p.id), 0) + 1,
        ...formData,
        tasks: { total: 0, done: 0 },
        tasksList: [],
        starred: false,
      };
      onCreate(newProject);
      onClose();
    }
  };

  const addMember = (user) => {
    if (!formData.members.some((m) => m.name === user.name)) {
      setFormData({
        ...formData,
        members: [...formData.members, user],
      });
    }
  };

  const removeMember = (name) => {
    setFormData({
      ...formData,
      members: formData.members.filter((m) => m.name !== name),
    });
  };

  const availableUsers = ALL_USERS.filter(
    (user) =>
      !formData.members.some((m) => m.name === user.name) &&
      user.name !== formData.owner,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden"
        style={{ animation: "scaleIn .25s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Créer un nouveau projet
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors"
          >
            <Ic.X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
              Titre du projet *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
              placeholder="Titre du projet"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 resize-none"
              rows="3"
              placeholder="Description du projet"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
              Échéance
            </label>
            <input
              type="text"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="ex: 30 avr 2026"
            />
          </div>

          {/* Owner/Responsable */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
              Responsable du projet
            </label>
            <select
              value={formData.owner}
              onChange={(e) => {
                const selected = ALL_USERS.find(
                  (u) => u.name === e.target.value,
                );
                setFormData({
                  ...formData,
                  owner: selected.name,
                  ownerRole: selected.role,
                });
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              {ALL_USERS.filter((u) => u.role === "Professeur").map((u) => (
                <option key={u.name} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Collaborateurs */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">
              Collaborateurs
            </label>
            {/* Current members */}
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.members.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-1"
                >
                  <div className="w-4 h-4 rounded-full bg-indigo-200 flex items-center justify-center text-[8px] font-bold text-indigo-700">
                    {getInitials(m.name)}
                  </div>
                  <span className="text-xs font-medium text-indigo-700">
                    {m.name}
                  </span>
                  <button
                    onClick={() => removeMember(m.name)}
                    className="ml-1 w-4 h-4 flex items-center justify-center hover:bg-indigo-200 rounded text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  >
                    <Ic.X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            {/* Available users dropdown */}
            {availableUsers.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-40 overflow-y-auto">
                  {availableUsers.map((user, i) => (
                    <button
                      key={i}
                      onClick={() => addMember(user)}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left text-sm transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600 shrink-0">
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {user.role}
                          </p>
                        </div>
                      </div>
                      <Ic.Plus className="w-4 h-4 text-gray-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <Ic.Plus className="w-4 h-4" /> Créer le projet
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Project Modal with button to open Tasks ──
const ProjectModalWithButton = ({ project, onClose, onOpenTasks, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    deadline: project.deadline,
    status: project.status,
    members: project.members,
  });

  const handleSave = () => {
    if (formData.title.trim()) {
      const updatedProject = { ...project, ...formData };
      onEdit && onEdit(updatedProject);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: project.title,
      description: project.description,
      deadline: project.deadline,
      status: project.status,
      members: project.members,
    });
    setIsEditing(false);
  };

  const addMember = (user) => {
    if (!formData.members.some((m) => m.name === user.name)) {
      setFormData({
        ...formData,
        members: [...formData.members, user],
      });
    }
  };

  const removeMember = (name) => {
    setFormData({
      ...formData,
      members: formData.members.filter((m) => m.name !== name),
    });
  };

  const availableUsers = ALL_USERS.filter(
    (user) =>
      !formData.members.some((m) => m.name === user.name) &&
      user.name !== project.owner,
  );

  const progress = pct(project);
  const sm = STATUS_META[project.status];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden"
        style={{ animation: "scaleIn .25s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill status={project.status} />
            {project.starred && (
              <Ic.Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors"
          >
            <Ic.X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          {isEditing ? (
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full text-xl font-semibold text-gray-900 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
              placeholder="Titre du projet"
              autoFocus
            />
          ) : (
            <h2 className="text-xl font-semibold text-gray-900 leading-snug">
              {project.title}
            </h2>
          )}

          {/* Description */}
          {isEditing ? (
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 resize-none"
              rows="3"
              placeholder="Description du projet"
            />
          ) : (
            <p className="text-sm text-gray-500 leading-relaxed">
              {project.description}
            </p>
          )}

          {/* Deadline Input (Editing mode) */}
          {isEditing && (
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                Échéance
              </label>
              <input
                type="text"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                placeholder="ex: 30 avr 2026"
              />
            </div>
          )}

          {/* Members/Collaborators (Editing mode) */}
          {isEditing && (
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">
                Collaborateurs
              </label>
              {/* Current members */}
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.members.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-1"
                  >
                    <div className="w-4 h-4 rounded-full bg-indigo-200 flex items-center justify-center text-[8px] font-bold text-indigo-700">
                      {getInitials(m.name)}
                    </div>
                    <span className="text-xs font-medium text-indigo-700">
                      {m.name}
                    </span>
                    <button
                      onClick={() => removeMember(m.name)}
                      className="ml-1 w-4 h-4 flex items-center justify-center hover:bg-indigo-200 rounded text-indigo-600 hover:text-indigo-700 cursor-pointer"
                    >
                      <Ic.X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {/* Available users dropdown */}
              {availableUsers.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-40 overflow-y-auto">
                    {availableUsers.map((user, i) => (
                      <button
                        key={i}
                        onClick={() => addMember(user)}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left text-sm transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600 shrink-0">
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {user.role}
                            </p>
                          </div>
                        </div>
                        <Ic.Plus className="w-4 h-4 text-gray-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Progress */}
          {!isEditing && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-600">Progression</span>
                <span className="font-bold text-indigo-700">{progress}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${progress}%`,
                    background: progress === 100 ? "#16A34A" : "#4F46E5",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>{project.tasks.done} tâches terminées</span>
                <span>
                  {project.tasks.total - project.tasks.done} restantes
                </span>
              </div>
            </div>
          )}

          {/* Meta grid */}
          {!isEditing && (
            <div className="grid grid-cols-2 gap-3">
              {/* Responsable with avatar */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Ic.Cap className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Responsable
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full bg-indigo-200 border border-indigo-300 flex items-center justify-center text-[9px] font-bold text-indigo-700"
                    title={project.owner}
                  >
                    {getInitials(project.owner)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {project.owner}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {project.ownerRole}
                    </p>
                  </div>
                </div>
              </div>

              {/* Échéance */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Ic.Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Échéance
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {project.deadline}
                </p>
              </div>

              {/* Collaborateurs */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Ic.Users className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Collaborateurs
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {project.members.length} membres
                </p>
              </div>

              {/* Tâches */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Ic.Check className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Tâches
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {project.tasks.done} / {project.tasks.total}
                </p>
              </div>
            </div>
          )}

          {/* Members */}
          {!isEditing && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Équipe
              </p>
              <div className="flex flex-wrap gap-2">
                {/* Owner first */}
                <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-1">
                  <div
                    className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center text-[9px] font-bold text-indigo-700"
                    title={project.owner}
                  >
                    {getInitials(project.owner)}
                  </div>
                  <span className="text-xs font-semibold text-indigo-700 line-clamp-1">
                    {project.owner}
                  </span>
                  <span className="text-[9px] text-indigo-400 font-medium">
                    chef
                  </span>
                </div>
                {project.members.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1"
                  >
                    <MemberAva name={m.name} role={m.role} />
                    <span className="text-xs font-medium text-gray-600 line-clamp-1">
                      {m.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
            font-bold text-sm text-white transition-all cursor-pointer bg-indigo-600 hover:bg-indigo-700"
          >
            <Ic.Edit className="w-4 h-4" />{" "}
            {isEditing ? "Annuler" : "Modifier le projet"}
          </button>
          {isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="flex items-center gap-2 border border-green-200 bg-green-50 rounded-xl px-4 py-2.5
              text-sm font-bold text-green-700 hover:bg-green-100 transition-all cursor-pointer"
            >
              <Ic.Check className="w-4 h-4" /> Sauvegarder
            </button>
          )}
          {!isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTasks();
              }}
              className="flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-4 py-2.5
              text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <Ic.ListChecks className="w-4 h-4" /> Tâches
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Tasks Modal ────────────────────────────────
const TASK_STATUSES = {
  pending: {
    label: "En attente",
    cls: "bg-gray-50 border-gray-200 text-gray-700",
    dot: "bg-gray-400",
  },
  in_progress: {
    label: "En cours",
    cls: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-500",
  },
  done: {
    label: "Terminée",
    cls: "bg-green-50 border-green-200 text-green-700",
    dot: "bg-green-500",
  },
};

const TasksModal = ({ project, onClose, onUpdateTasks }) => {
  const [tasks, setTasks] = useState(project.tasksList || []);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [localFormData, setLocalFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "pending",
  });

  const handleAdd = () => {
    if (formData.title && formData.assignedTo) {
      const newTask = { id: Date.now(), ...formData };
      setTasks([...tasks, newTask]);
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        status: "pending",
      });
      setShowForm(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setFormData(task);
    setShowForm(true);
  };

  const handleSave = () => {
    if (formData.title && formData.assignedTo) {
      setTasks(tasks.map((t) => (t.id === editingId ? formData : t)));
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        status: "pending",
      });
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl overflow-hidden"
        style={{ animation: "scaleIn .25s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Ic.ListChecks className="w-5 h-5 text-indigo-600" />
            Tâches - {project.title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer transition-colors"
          >
            <Ic.X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Add Task Form */}
          {showForm && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <input
                type="text"
                placeholder="Titre de la tâche"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-indigo-500"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-indigo-500 resize-none"
                rows="2"
              />
              <select
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-indigo-500"
              >
                <option value="">Assigner à...</option>
                {project.members.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-indigo-500"
              >
                {Object.entries(TASK_STATUSES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (editingId) handleSave();
                    else handleAdd();
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-bold transition-colors cursor-pointer"
                >
                  {editingId ? "Mettre à jour" : "Ajouter"}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      title: "",
                      description: "",
                      assignedTo: "",
                      status: "pending",
                    });
                  }}
                  className="flex-1 border border-gray-200 bg-white rounded-lg py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Tasks List */}
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Aucune tâche pour ce projet
              </div>
            ) : (
              tasks.map((task) => {
                const taskStatus = TASK_STATUSES[task.status];
                return (
                  <div
                    key={task.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded border ${taskStatus.cls}`}
                          >
                            {taskStatus.label}
                          </span>
                          <div className="flex items-center gap-1.5 bg-gray-100 rounded px-2 py-1">
                            <div
                              className="w-5 h-5 rounded-full bg-indigo-200 border border-indigo-300 flex items-center justify-center text-[9px] font-bold text-indigo-700"
                              title={task.assignedTo}
                            >
                              {getInitials(task.assignedTo)}
                            </div>
                            <span className="text-xs font-semibold text-gray-600">
                              {task.assignedTo}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value)
                          }
                          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer"
                        >
                          {Object.entries(TASK_STATUSES).map(([key, val]) => (
                            <option key={key} value={key}>
                              {val.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleEdit(task)}
                          className="w-7 h-7 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                        >
                          <Ic.Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        >
                          <Ic.Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        {!showForm && (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-sm font-bold transition-colors cursor-pointer"
            >
              <Ic.Plus className="w-4 h-4" /> Nouvelle tâche
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Confirm delete ────────────────────────────
const ConfirmDelete = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
    <div
      className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6 space-y-4"
      style={{ animation: "scaleIn .2s ease" }}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 mx-auto">
        <Ic.Trash className="w-6 h-6" />
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-800">Supprimer ce projet ?</p>
        <p className="text-sm text-gray-400 mt-1">
          Cette action est irréversible. Toutes les tâches associées seront
          supprimées.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold transition-colors cursor-pointer"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════
export default function Projets() {
  const [projects, setProjects] = useState(PROJECTS);
  const [search, setSearch] = useState("");
  const [statFilter, setStatFilter] = useState("Tous");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [modal, setModal] = useState(null); // project detail
  const [tasksModal, setTasksModal] = useState(null); // tasks detail
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [createModal, setCreateModal] = useState(false); // new project form

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Filters ───────────────────────────────
  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        const q = search.toLowerCase();
        const mQ =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.owner.toLowerCase().includes(q);
        const mS = statFilter === "Tous" || p.status === statFilter;
        return mQ && mS;
      }),
    [projects, search, statFilter],
  );

  const confirmDelete = () => {
    setProjects((ps) => ps.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    showToast("Projet supprimé", "err");
  };

  // ── Stats ─────────────────────────────────
  const totalTasks = projects.reduce((s, p) => s + p.tasks.total, 0);
  const doneTasks = projects.reduce((s, p) => s + p.tasks.done, 0);
  const globalPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="w-full space-y-5">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999] flex items-center gap-2.5
          px-4 py-3 rounded-xl border shadow-lg text-sm font-semibold bg-white
          ${toast.type === "ok" ? "border-green-200 text-green-700" : "border-red-200 text-red-700"}`}
          style={{ animation: "fadeIn .3s ease" }}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center ${toast.type === "ok" ? "bg-green-100" : "bg-red-100"}`}
          >
            <Ic.Check className="w-3 h-3" />
          </div>
          {toast.msg}
        </div>
      )}

      {deleteId && (
        <ConfirmDelete
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
      {createModal && (
        <CreateProjectModal
          onClose={() => setCreateModal(false)}
          onCreate={(newProject) => {
            setProjects([...projects, newProject]);
            showToast(`Projet "${newProject.title}" créé avec succès`, "ok");
          }}
        />
      )}
      {modal && (
        <ProjectModalWithButton
          project={modal}
          onClose={() => setModal(null)}
          onOpenTasks={() => {
            setTasksModal(modal);
            setModal(null);
          }}
          onEdit={() => {
            setModal(null);
            showToast(`Modification de "${modal.title}" à venir`);
          }}
        />
      )}
      {tasksModal && (
        <TasksModal project={tasksModal} onClose={() => setTasksModal(null)} />
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
            Projets
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium">
            {projects.length} projets · {doneTasks}/{totalTasks} tâches
            complétées · {globalPct}% global
          </p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="self-start sm:self-auto flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500
          text-gray-900 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          <Ic.Plus className="w-4 h-4" /> Nouveau projet
        </button>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            val: projects.length,
            cls: "bg-white border-gray-200 text-gray-800",
            Icon: Ic.Folder,
          },
          {
            label: "En cours",
            val: projects.filter((p) => p.status === "en_cours").length,
            cls: "bg-blue-50 border-blue-200 text-blue-700",
            Icon: Ic.Clock,
          },
          {
            label: "Terminés",
            val: projects.filter((p) => p.status === "termine").length,
            cls: "bg-green-50 border-green-200 text-green-700",
            Icon: Ic.Check,
          },
          {
            label: "Taux global",
            val: `${globalPct}%`,
            cls: "bg-indigo-50 border-indigo-200 text-indigo-700",
            Icon: Ic.Star,
          },
        ].map(({ label, val, cls, Icon }) => (
          <div
            key={label}
            className={`border rounded-2xl px-4 py-3.5 flex items-center gap-3 ${cls}`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${cls}`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-extrabold leading-none tracking-tight">
                {val}
              </p>
              <p className="text-xs font-medium text-gray-400 mt-0.5">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 space-y-3">
        {/* Row 1: search + view toggle */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <Ic.Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par titre, auteur, technologie…"
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <Ic.X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {/* View toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {[
              ["grid", Ic.Grid],
              ["list", Ic.List],
            ].map(([id, Icon]) => (
              <button
                key={id}
                onClick={() => setViewMode(id)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer
                  ${viewMode === id ? "bg-white border border-gray-200 text-gray-700 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: filters */}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {/* Status */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Statut
            </span>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer
                  ${statFilter === s ? "bg-gray-800 border-gray-800 text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
              >
                {STATUS_LBL[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="text-xs text-gray-400 font-medium">
          {filtered.length} projet{filtered.length > 1 ? "s" : ""}
          {(search || statFilter !== "Tous") && " · filtrés"}
        </div>
      </div>

      {/* ── Grid View ── */}
      {viewMode === "grid" && (
        <>
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl py-20 flex flex-col items-center gap-3 text-gray-400">
              <Ic.Folder className="w-10 h-10 opacity-30" />
              <p className="font-semibold text-sm">Aucun projet trouvé</p>
              <p className="text-xs">Modifiez vos filtres</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filtered.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  delay={i * 50}
                  onView={setModal}
                  onEdit={() =>
                    showToast(`Modification de "${p.title}" à venir`)
                  }
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── List View ── */}
      {viewMode === "list" && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {[
                    "Projet",
                    "Statut",
                    "Responsable",
                    "Équipe",
                    "Progression",
                    "Échéance",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 sm:px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-gray-400 text-sm"
                    >
                      Aucun projet trouvé
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, i) => (
                    <ProjectRow
                      key={p.id}
                      project={p}
                      delay={i * 40}
                      onView={setModal}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
