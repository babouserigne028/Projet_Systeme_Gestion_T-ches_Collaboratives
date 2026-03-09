import { useState, useMemo } from "react";

/* ═══════════════════════════════════════════════
   ESMT — Gestion des Utilisateurs
   Charte : même que Dashboard (light mode)
   ─────────────────────────────────────────────
   BG layout  : géré par DefaultLayout
   Cards      : bg-white, border-gray-200
   Accent     : #EAB308 (jaune ESMT)
   Flat design: no heavy shadows, clean borders
   Responsive : 375 → 1440px
   Icons      : SVG Lucide uniquement
════════════════════════════════════════════════ */

// ── Icons ─────────────────────────────────────
const Ic = {
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
  Filter: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
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
  Check: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
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
  ChevronL: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
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
  Lock: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Unlock: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  ),
  Mail: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Close: (p) => (
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
  Shield: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

// ── Mock Users ────────────────────────────────
const INITIAL_USERS = [
  {
    id: 1,
    name: "Serigne Babou",
    role: "Administrateur",
    email: "s.babou@esmt.sn",
    status: "actif",
    joined: "15 jan 2026",
    projects: 0,
    tasks: 0,
    ini: "SB",
  },
  {
    id: 2,
    name: "Dr. Amadou Diop",
    role: "Professeur",
    email: "a.diop@esmt.sn",
    status: "actif",
    joined: "10 jan 2026",
    projects: 5,
    tasks: 42,
    ini: "AD",
  },
  {
    id: 3,
    name: "Prof. Khady Gueye",
    role: "Professeur",
    email: "k.gueye@esmt.sn",
    status: "actif",
    joined: "12 jan 2026",
    projects: 4,
    tasks: 35,
    ini: "KG",
  },
  {
    id: 4,
    name: "M. Ousmane Thiam",
    role: "Professeur",
    email: "o.thiam@esmt.sn",
    status: "actif",
    joined: "08 jan 2026",
    projects: 3,
    tasks: 28,
    ini: "OT",
  },
  {
    id: 5,
    name: "Mme. Rokhaya Sarr",
    role: "Professeur",
    email: "r.sarr@esmt.sn",
    status: "actif",
    joined: "20 jan 2026",
    projects: 4,
    tasks: 31,
    ini: "RS",
  },
  {
    id: 6,
    name: "Dr. Lamine Diouf",
    role: "Professeur",
    email: "l.diouf@esmt.sn",
    status: "suspendu",
    joined: "05 jan 2026",
    projects: 2,
    tasks: 20,
    ini: "LD",
  },
  {
    id: 7,
    name: "Fatou Diallo",
    role: "Étudiant",
    email: "fatou.diallo@esmt.sn",
    status: "en_attente",
    joined: "01 mars 2026",
    projects: 0,
    tasks: 0,
    ini: "FD",
  },
  {
    id: 8,
    name: "Cheikh Mbaye",
    role: "Étudiant",
    email: "c.mbaye@esmt.sn",
    status: "actif",
    joined: "14 jan 2026",
    projects: 3,
    tasks: 18,
    ini: "CM",
  },
  {
    id: 9,
    name: "Aissatou Sow",
    role: "Étudiant",
    email: "a.sow@esmt.sn",
    status: "en_attente",
    joined: "27 fév 2026",
    projects: 0,
    tasks: 0,
    ini: "AS",
  },
  {
    id: 10,
    name: "Ibrahima Fall",
    role: "Étudiant",
    email: "i.fall@esmt.sn",
    status: "actif",
    joined: "18 jan 2026",
    projects: 2,
    tasks: 12,
    ini: "IF",
  },
  {
    id: 11,
    name: "Mariama Ba",
    role: "Professeur",
    email: "m.ba@esmt.sn",
    status: "en_attente",
    joined: "24 fév 2026",
    projects: 0,
    tasks: 0,
    ini: "MB",
  },
  {
    id: 12,
    name: "Arame Faye",
    role: "Étudiant",
    email: "a.faye@esmt.sn",
    status: "actif",
    joined: "22 jan 2026",
    projects: 1,
    tasks: 7,
    ini: "AF",
  },
  {
    id: 13,
    name: "Lamine Seck",
    role: "Étudiant",
    email: "l.seck@esmt.sn",
    status: "en_attente",
    joined: "22 fév 2026",
    projects: 0,
    tasks: 0,
    ini: "LS",
  },
  {
    id: 14,
    name: "Moussa Ndiaye",
    role: "Professeur",
    email: "m.ndiaye@esmt.sn",
    status: "en_attente",
    joined: "28 fév 2026",
    projects: 0,
    tasks: 0,
    ini: "MN",
  },
  {
    id: 15,
    name: "Sokhna Gaye",
    role: "Étudiant",
    email: "s.gaye@esmt.sn",
    status: "suspendu",
    joined: "11 jan 2026",
    projects: 1,
    tasks: 5,
    ini: "SG",
  },
];

const PAGE_SIZE = 8;

// ── Helpers ───────────────────────────────────
const statusMeta = {
  actif: {
    label: "Actif",
    cls: "bg-green-50 border-green-200 text-green-700",
    dot: "bg-green-500",
  },
  en_attente: {
    label: "En attente",
    cls: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-400",
  },
  suspendu: {
    label: "Suspendu",
    cls: "bg-red-50   border-red-200   text-red-600",
    dot: "bg-red-400",
  },
};

const roleMeta = {
  Administrateur: {
    cls: "bg-violet-50 border-violet-200 text-violet-700",
    Icon: Ic.Shield,
  },
  Professeur: {
    cls: "bg-blue-50   border-blue-200   text-blue-700",
    Icon: Ic.Cap,
  },
  Étudiant: {
    cls: "bg-teal-50   border-teal-200   text-teal-700",
    Icon: Ic.Book,
  },
};

const avaColor = {
  Administrateur: "bg-violet-100 border-violet-300 text-violet-700",
  Professeur: "bg-blue-100   border-blue-300   text-blue-700",
  Étudiant: "bg-teal-100   border-teal-300   text-teal-700",
};

// ── Small components ──────────────────────────
const Badge = ({ children, cls }) => (
  <span
    className={`inline-flex items-center gap-1 border rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${cls}`}
  >
    {children}
  </span>
);

const StatusDot = ({ status }) => {
  const m = statusMeta[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${m.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};

const Ava = ({ ini, role, size = "md" }) => {
  const sz =
    size === "lg"
      ? "w-14 h-14 text-lg"
      : size === "sm"
        ? "w-7 h-7 text-[10px]"
        : "w-9 h-9 text-xs";
  return (
    <div
      className={`${sz} ${avaColor[role] || "bg-gray-100 border-gray-300 text-gray-600"}
      rounded-full border-2 flex items-center justify-center font-bold flex-shrink-0`}
    >
      {ini}
    </div>
  );
};

// ── Confirm dialog ────────────────────────────
const ConfirmDialog = ({ msg, onConfirm, onCancel, danger }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6 space-y-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto
        ${danger ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}
      >
        {danger ? (
          <Ic.Trash className="w-6 h-6" />
        ) : (
          <Ic.Lock className="w-6 h-6" />
        )}
      </div>
      <p className="text-sm text-gray-700 text-center font-medium">{msg}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600
          hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors cursor-pointer text-white
            ${danger ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}`}
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
);

// ── User Detail Modal ─────────────────────────
const UserModal = ({ user, onClose, onToggleStatus, onDelete }) => {
  const rm = roleMeta[user.role] || roleMeta["Étudiant"];
  const RoleIcon = rm.Icon;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800 text-sm">
            Détails de l'utilisateur
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-gray-500"
          >
            <Ic.Close className="w-4 h-4" />
          </button>
        </div>

        {/* Profile block */}
        <div className="p-5 flex items-center gap-4 border-b border-gray-100">
          <Ava ini={user.ini} role={user.role} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-base truncate">
              {user.name}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge cls={rm.cls}>
                <RoleIcon className="w-3 h-3" />
                {user.role}
              </Badge>
              <StatusDot status={user.status} />
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div className="p-5 space-y-3">
          {[
            { Icon: Ic.Mail, label: "Email", val: user.email },
            { Icon: Ic.Calendar, label: "Inscrit le", val: user.joined },
            { Icon: Ic.Book, label: "Projets", val: user.projects },
            { Icon: Ic.Check, label: "Tâches", val: user.tasks },
          ].map(({ Icon, label, val }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-gray-400 w-20 flex-shrink-0 font-medium">
                {label}
              </span>
              <span className="text-sm text-gray-700 font-semibold">{val}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={() => onToggleStatus(user.id)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold border transition-colors cursor-pointer
              ${
                user.status === "suspendu"
                  ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
              }`}
          >
            {user.status === "suspendu" ? (
              <>
                <Ic.Unlock className="w-4 h-4" /> Réactiver
              </>
            ) : (
              <>
                <Ic.Lock className="w-4 h-4" /> Suspendre
              </>
            )}
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600
              rounded-xl py-2.5 text-sm font-bold hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Ic.Trash className="w-4 h-4" /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════
export default function Utilisateurs() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null); // user modal
  const [confirm, setConfirm] = useState(null); // { type, userId }
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Filters ───────────────────────────────
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchQ =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchR = roleFilter === "Tous" || u.role === roleFilter;
      const matchS = statusFilter === "Tous" || u.status === statusFilter;
      return matchQ && matchR && matchS;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetPage = () => setPage(1);

  // ── Stats ─────────────────────────────────
  const stats = {
    total: users.length,
    actifs: users.filter((u) => u.status === "actif").length,
    attente: users.filter((u) => u.status === "en_attente").length,
    profs: users.filter((u) => u.role === "Professeur").length,
    etudiants: users.filter((u) => u.role === "Étudiant").length,
  };

  // ── Actions ───────────────────────────────
  const approveUser = (id) => {
    setUsers((u) =>
      u.map((x) => (x.id === id ? { ...x, status: "actif" } : x)),
    );
    setSelected(null);
    showToast("Compte activé avec succès");
  };

  const toggleStatus = (id) => {
    const u = users.find((x) => x.id === id);
    if (u.status === "en_attente") {
      approveUser(id);
      return;
    }
    setConfirm({
      type: u.status === "actif" ? "suspend" : "activate",
      userId: id,
    });
  };

  const confirmToggle = () => {
    const { type, userId } = confirm;
    setUsers((u) =>
      u.map((x) =>
        x.id === userId
          ? { ...x, status: type === "suspend" ? "suspendu" : "actif" }
          : x,
      ),
    );
    setConfirm(null);
    setSelected(null);
    showToast(type === "suspend" ? "Compte suspendu" : "Compte réactivé");
  };

  const deleteUser = (id) => setConfirm({ type: "delete", userId: id });

  const confirmDelete = () => {
    setUsers((u) => u.filter((x) => x.id !== confirm.userId));
    setConfirm(null);
    setSelected(null);
    showToast("Utilisateur supprimé", "err");
  };

  const roles = ["Tous", "Administrateur", "Professeur", "Étudiant"];
  const statuses = ["Tous", "actif", "en_attente", "suspendu"];
  const statusLabels = {
    Tous: "Tous",
    actif: "Actif",
    en_attente: "En attente",
    suspendu: "Suspendu",
  };

  return (
    <div className="w-full space-y-5">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999] flex items-center gap-2.5
          px-4 py-3 rounded-xl border shadow-lg text-sm font-semibold
          bg-white ${toast.type === "ok" ? "border-green-200 text-green-700" : "border-red-200 text-red-700"}
          animate-[fadeIn_.3s_ease]`}
          style={{ animation: "fadeIn .3s ease" }}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center
            ${toast.type === "ok" ? "bg-green-100" : "bg-red-100"}`}
          >
            {toast.type === "ok" ? (
              <Ic.Check className="w-3 h-3" />
            ) : (
              <Ic.X className="w-3 h-3" />
            )}
          </div>
          {toast.msg}
        </div>
      )}

      {/* ── Confirm dialog ── */}
      {confirm && (
        <ConfirmDialog
          msg={
            confirm.type === "delete"
              ? "Supprimer définitivement cet utilisateur ?"
              : confirm.type === "suspend"
                ? "Suspendre le compte de cet utilisateur ?"
                : "Réactiver le compte de cet utilisateur ?"
          }
          danger={confirm.type === "delete"}
          onConfirm={confirm.type === "delete" ? confirmDelete : confirmToggle}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── User modal ── */}
      {selected && (
        <UserModal
          user={selected}
          onClose={() => setSelected(null)}
          onToggleStatus={toggleStatus}
          onDelete={deleteUser}
        />
      )}

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Utilisateurs
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 font-medium">
            {stats.total} comptes enregistrés · {stats.attente} en attente de
            validation
          </p>
        </div>
        <button
          className="self-start sm:self-auto flex items-center gap-2
          bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-sm
          px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          <Ic.Plus className="w-4 h-4" /> Nouvel utilisateur
        </button>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "text-gray-800",
            bg: "bg-white",
            border: "border-gray-200",
            Icon: Ic.Users,
          },
          {
            label: "Actifs",
            value: stats.actifs,
            color: "text-green-700",
            bg: "bg-green-50",
            border: "border-green-200",
            Icon: Ic.Check,
          },
          {
            label: "En attente",
            value: stats.attente,
            color: "text-amber-700",
            bg: "bg-amber-50",
            border: "border-amber-200",
            Icon: Ic.Cap,
          },
          {
            label: "Professeurs",
            value: stats.profs,
            color: "text-blue-700",
            bg: "bg-blue-50",
            border: "border-blue-200",
            Icon: Ic.Cap,
          },
        ].map(({ label, value, color, bg, border, Icon }) => (
          <div
            key={label}
            className={`${bg} border ${border} rounded-2xl px-4 py-3.5 flex items-center gap-3`}
          >
            <div
              className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center ${color}`}
            >
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className={`text-2xl font-extrabold leading-none ${color}`}>
                {value}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <Ic.Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            placeholder="Rechercher par nom ou email…"
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 font-medium min-w-0"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                resetPage();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <Ic.X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-400 font-medium mr-1 hidden sm:block">
            Rôle :
          </span>
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRoleFilter(r);
                resetPage();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer
                ${
                  roleFilter === r
                    ? "bg-yellow-400 border-yellow-400 text-gray-900"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-400 font-medium mr-1 hidden sm:block">
            Statut :
          </span>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                resetPage();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer
                ${
                  statusFilter === s
                    ? "bg-gray-800 border-gray-800 text-white"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Result count */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-semibold text-gray-500">
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            {search || roleFilter !== "Tous" || statusFilter !== "Tous"
              ? " · filtrés"
              : ""}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            Page {page} / {totalPages || 1}
          </span>
        </div>

        {/* Scrollable wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  "Utilisateur",
                  "Rôle",
                  "Statut",
                  "Email",
                  "Projets / Tâches",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 sm:px-5 py-3
                    text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Ic.Search className="w-8 h-8 opacity-30" />
                      <p className="text-sm font-medium">
                        Aucun utilisateur trouvé
                      </p>
                      <p className="text-xs">
                        Modifiez vos filtres de recherche
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((u) => {
                  const rm = roleMeta[u.role] || roleMeta["Étudiant"];
                  const RoleIcon = rm.Icon;
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      {/* Name */}
                      <td className="px-4 sm:px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Ava ini={u.ini} role={u.role} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {u.name}
                            </p>
                            <p className="text-[11px] text-gray-400 font-medium">
                              {u.joined}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Role */}
                      <td className="px-4 sm:px-5 py-3.5">
                        <Badge cls={rm.cls}>
                          <RoleIcon className="w-3 h-3" />
                          {u.role}
                        </Badge>
                      </td>
                      {/* Status */}
                      <td className="px-4 sm:px-5 py-3.5">
                        <StatusDot status={u.status} />
                      </td>
                      {/* Email */}
                      <td className="px-4 sm:px-5 py-3.5 text-xs text-gray-400 max-w-[180px] truncate">
                        {u.email}
                      </td>
                      {/* Projects / Tasks */}
                      <td className="px-4 sm:px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-gray-700">
                            {u.projects}
                            <span className="text-gray-400 font-normal">
                              {" "}
                              proj.
                            </span>
                          </span>
                          <span className="text-gray-200">·</span>
                          <span className="text-xs font-semibold text-gray-700">
                            {u.tasks}
                            <span className="text-gray-400 font-normal">
                              {" "}
                              tâches
                            </span>
                          </span>
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-4 sm:px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {/* Valider si en attente */}
                          {u.status === "en_attente" && (
                            <button
                              onClick={() => approveUser(u.id)}
                              title="Valider"
                              className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-600
                              flex items-center justify-center transition-colors cursor-pointer border border-green-200"
                            >
                              <Ic.Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {/* Voir détails */}
                          <button
                            onClick={() => setSelected(u)}
                            title="Voir le profil"
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500
                            flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Ic.Eye className="w-3.5 h-3.5" />
                          </button>
                          {/* Suspendre / Réactiver */}
                          {u.role !== "Administrateur" && (
                            <button
                              onClick={() => toggleStatus(u.id)}
                              title={
                                u.status === "suspendu"
                                  ? "Réactiver"
                                  : "Suspendre"
                              }
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border
                              ${
                                u.status === "suspendu"
                                  ? "bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                  : "bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200"
                              }`}
                            >
                              {u.status === "suspendu" ? (
                                <Ic.Unlock className="w-3.5 h-3.5" />
                              ) : (
                                <Ic.Lock className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                          {/* Supprimer */}
                          {u.role !== "Administrateur" && (
                            <button
                              onClick={() => deleteUser(u.id)}
                              title="Supprimer"
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500
                              flex items-center justify-center transition-colors cursor-pointer border border-red-200"
                            >
                              <Ic.Trash className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold
                text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors cursor-pointer"
            >
              <Ic.ChevronL className="w-3.5 h-3.5" /> Précédent
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer
                    ${
                      n === page
                        ? "bg-yellow-400 text-gray-900"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold
                text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed
                transition-colors cursor-pointer"
            >
              Suivant <Ic.ChevronR className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:translateX(0); } }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: .01ms !important; } }
      `}</style>
    </div>
  );
}
